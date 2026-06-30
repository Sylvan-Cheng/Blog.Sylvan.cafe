import type {
  SatteriAstroData,
  SatteriProcessorOptions,
} from "@astrojs/markdown-satteri";
import { renderMermaidSVG } from "beautiful-mermaid";
import type { Element, ElementContent, RootContent } from "hast";
import katex from "katex";
import { parseCodeMeta } from "../utils/transformers/codeMetaParser";
import { getTextContent, toClassList } from "./hastUtils";
import { buildHeadingId } from "./headingIds";
import { injectMermaidStyle, wrapMermaidSvg } from "./mermaidMarkup";
import {
  applySatteriImgProxyProperties,
  BLOCKED_HTML_TAGS,
  sanitizeRawHtml,
  sanitizeSatteriElementProperties,
} from "./satteriHtmlSafety";

type SatteriMdastPlugin = NonNullable<
  SatteriProcessorOptions["mdastPlugins"]
>[number];
type SatteriHastPlugin = NonNullable<
  SatteriProcessorOptions["hastPlugins"]
>[number];

type SatteriData = {
  astro?: SatteriAstroData;
  sylvanHeadingIndex?: number;
  sylvanUsedHeadingIds?: Set<string>;
};

type AlertType = keyof typeof ALERTS;

const KATEX_DISPLAY_OPTIONS = {
  displayMode: true,
  throwOnError: false,
} as const;

const KATEX_DISPLAY_ARRAYSTRETCH = "1.5";
const KATEX_PLUGIN_CACHE_KEY = `arraystretch-${KATEX_DISPLAY_ARRAYSTRETCH}`;
const MULTILINE_MATH_ENV_PATTERN =
  /\\begin\{(?:align\*?|aligned|alignedat|alignat\*?|gather\*?|gathered|split)\}/;

const ALERTS = {
  note: {
    label: "NOTE",
    path: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z",
  },
  tip: {
    label: "TIP",
    path: "M6.5.75V2h3V.75a.75.75 0 0 1 1.5 0V2h.75A2.25 2.25 0 0 1 14 4.25v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 0-.75-.75H4.25a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h2.5a.75.75 0 0 1 0 1.5h-2.5A2.25 2.25 0 0 1 2 11.75v-7.5A2.25 2.25 0 0 1 4.25 2H5V.75a.75.75 0 0 1 1.5 0Zm5.78 6.97a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0l-1.25-1.25a.75.75 0 1 1 1.06-1.06l.72.72 2.72-2.72a.75.75 0 0 1 1.06 0Z",
  },
  important: {
    label: "IMPORTANT",
    path: "M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v1.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
  },
  warning: {
    label: "WARNING",
    path: "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
  },
  caution: {
    label: "CAUTION",
    path: "M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z",
  },
} as const;

function text(value: string): ElementContent {
  return { type: "text", value };
}

function svgIcon(path: string): Element {
  return {
    type: "element",
    tagName: "svg",
    properties: {
      className: ["octicon"],
      viewBox: "0 0 16 16",
      width: 16,
      height: 16,
      ariaHidden: "true",
    },
    children: [
      {
        type: "element",
        tagName: "path",
        properties: { d: path },
        children: [],
      },
    ],
  };
}

function isElement(node: RootContent | ElementContent): node is Element {
  return node.type === "element";
}

function isMathCode(node: Element, kind: "inline" | "display"): boolean {
  const classes = toClassList(node.properties?.className);
  return (
    classes.includes("language-math") &&
    classes.includes(kind === "inline" ? "math-inline" : "math-display")
  );
}

export function addDisplayMathRowSpacing(value: string): string {
  if (!MULTILINE_MATH_ENV_PATTERN.test(value)) return value;
  return `\\def\\arraystretch{${KATEX_DISPLAY_ARRAYSTRETCH}}\n${value}`;
}

export function satteriMermaid(): SatteriMdastPlugin {
  return {
    name: "sylvan-mermaid",
    code(node, ctx) {
      if (node.lang?.trim().toLowerCase() !== "mermaid") return;

      try {
        let svg = renderMermaidSVG(node.value || "", {
          bg: "var(--background)",
          fg: "var(--foreground)",
          transparent: true,
        });
        svg = injectMermaidStyle(svg);
        ctx.replaceNode(node, { rawHtml: wrapMermaidSvg(svg) });
      } catch {
        // Keep the code block for Shiki highlighting, matching the old pipeline.
      }
    },
  };
}

export function satteriGithubAlerts(): SatteriHastPlugin {
  return {
    name: "sylvan-github-alerts",
    element: {
      filter: ["blockquote"],
      visit(node, ctx) {
        const firstChildIndex = node.children?.findIndex(isElement) ?? -1;
        const firstChild = node.children?.[firstChildIndex];
        if (!isElement(firstChild) || firstChild.tagName !== "p") return;

        const firstText = firstChild.children?.[0];
        if (firstText?.type !== "text") return;

        const match = firstText.value.match(
          /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/,
        );
        if (!match) return;

        const type = match[1].toLowerCase() as AlertType;

        const alert = ALERTS[type];
        const remaining = firstText.value.slice(match[0].length);
        const firstParagraphChildren =
          remaining.length > 0
            ? [
                { ...firstText, value: remaining },
                ...firstChild.children.slice(1),
              ]
            : firstChild.children.slice(1);

        const bodyChildren = [
          ...(firstParagraphChildren.length > 0
            ? [
                {
                  type: "element" as const,
                  tagName: "p",
                  properties: { ...(firstChild.properties ?? {}) },
                  children: firstParagraphChildren,
                },
              ]
            : []),
          ...node.children.slice(firstChildIndex + 1).filter((child) => {
            return !(child.type === "text" && child.value.trim() === "");
          }),
        ];

        ctx.replaceNode(node, {
          type: "element",
          tagName: "div",
          properties: {
            className: ["markdown-alert", `markdown-alert-${type}`],
            dir: "auto",
          },
          children: [
            {
              type: "element",
              tagName: "p",
              properties: {
                className: ["markdown-alert-title"],
                dir: "auto",
              },
              children: [svgIcon(alert.path), text(alert.label)],
            },
            ...bodyChildren,
          ],
        });
      },
    },
  };
}

export function satteriSafeHtml(): SatteriHastPlugin {
  return {
    name: "sylvan-safe-html",
    raw(node, ctx) {
      const sanitized = sanitizeRawHtml(node.value);
      if (!sanitized) {
        ctx.removeNode(node);
        return;
      }

      if (sanitized !== node.value) {
        ctx.replaceNode(node, { type: "raw", value: sanitized });
      }
    },
    element: {
      filter: [],
      visit(node, ctx) {
        if (BLOCKED_HTML_TAGS.has(node.tagName.toLowerCase())) {
          ctx.removeNode(node);
          return;
        }

        const sanitized = sanitizeSatteriElementProperties(
          node.properties ?? {},
        );
        for (const key of Object.keys(node.properties ?? {})) {
          if (!(key in sanitized)) ctx.setProperty(node, key, null);
        }
      },
    },
  };
}

export function satteriImgProxy(): SatteriHastPlugin {
  return {
    name: "sylvan-img-proxy",
    element: {
      filter: ["img"],
      visit(node, ctx) {
        const next = applySatteriImgProxyProperties(node.properties ?? {});
        for (const [key, value] of Object.entries(next)) {
          if (node.properties?.[key] !== value)
            ctx.setProperty(node, key, value);
        }
      },
    },
  };
}

export function satteriKatex(): SatteriHastPlugin {
  return {
    name: `sylvan-katex-${KATEX_PLUGIN_CACHE_KEY}`,
    element: [
      {
        filter: ["pre"],
        visit(node, ctx) {
          const code = node.children?.find(
            (child): child is Element =>
              isElement(child) &&
              child.tagName === "code" &&
              isMathCode(child, "display"),
          );
          if (!code) return;

          const html = katex.renderToString(
            addDisplayMathRowSpacing(ctx.textContent(code)),
            KATEX_DISPLAY_OPTIONS,
          );
          ctx.replaceNode(node, { type: "raw", value: html });
        },
      },
      {
        filter: ["code"],
        visit(node, ctx) {
          if (!isMathCode(node, "inline")) return;

          const html = katex.renderToString(ctx.textContent(node), {
            displayMode: false,
            throwOnError: false,
          });
          ctx.replaceNode(node, { type: "raw", value: html });
        },
      },
    ],
  };
}

export function satteriKatexDisplay(): SatteriMdastPlugin {
  return {
    name: `sylvan-katex-display-${KATEX_PLUGIN_CACHE_KEY}`,
    math(node, ctx) {
      const html = katex.renderToString(
        addDisplayMathRowSpacing(node.value),
        KATEX_DISPLAY_OPTIONS,
      );
      ctx.replaceNode(node, { rawHtml: html });
    },
  };
}

export function satteriA11y(): SatteriHastPlugin {
  return {
    name: "sylvan-a11y",
    element: {
      filter: ["input", "h2", "h3", "h4", "h5", "h6"],
      visit(node, ctx) {
        if (
          node.tagName === "input" &&
          node.properties &&
          node.properties.type === "checkbox" &&
          node.properties.disabled !== undefined
        ) {
          const checked =
            node.properties.checked !== undefined &&
            node.properties.checked !== false;
          ctx.setProperty(
            node,
            "aria-label",
            checked ? "Completed task" : "Incomplete task",
          );
          return;
        }

        if (!/^h[2-6]$/.test(node.tagName)) return;

        const data = ctx.data as SatteriData;
        data.sylvanUsedHeadingIds ??= new Set<string>();
        data.sylvanHeadingIndex ??= 0;

        const existingId = node.properties?.id;
        let id = typeof existingId === "string" ? existingId : undefined;

        if (id) {
          if (data.sylvanUsedHeadingIds.has(id)) {
            id = buildHeadingId(
              id,
              data.sylvanUsedHeadingIds,
              `heading-${data.sylvanHeadingIndex}`,
            );
            ctx.setProperty(node, "id", id);
          } else {
            data.sylvanUsedHeadingIds.add(id);
          }
        } else {
          id = buildHeadingId(
            getTextContent(node),
            data.sylvanUsedHeadingIds,
            `heading-${data.sylvanHeadingIndex}`,
          );
          ctx.setProperty(node, "id", id);
        }

        data.sylvanHeadingIndex++;

        ctx.setProperty(
          node,
          "className",
          [...toClassList(node.properties?.className), "group"].filter(Boolean),
        );
        ctx.appendChild(node, {
          type: "element",
          tagName: "a",
          properties: {
            className: [
              "heading-link",
              "ms-2",
              "no-underline",
              "opacity-0",
              "md:group-hover:opacity-100",
              "md:focus:opacity-100",
            ],
            ariaLabel: "Jump to heading",
            href: `#${id}`,
          },
          children: [],
        });
      },
    },
  };
}

export function satteriCodeMetaPreprocess(): SatteriMdastPlugin {
  return {
    name: "sylvan-code-meta-preprocess",
    code(node, ctx) {
      const meta = parseCodeMeta(node.meta ?? undefined);
      if (!meta.file && !meta.collapse && !meta.nolines) return;

      // Keep meta syntax normalized for Shiki's highlighter and transformers.
      ctx.setProperty(node, "meta", node.meta ?? "");
    },
  };
}

export const satteriMdastPlugins = [
  satteriMermaid(),
  satteriKatexDisplay(),
  satteriCodeMetaPreprocess(),
];

export const satteriHastPlugins = [
  satteriGithubAlerts(),
  satteriSafeHtml(),
  satteriImgProxy(),
  satteriKatex(),
  satteriA11y(),
];
