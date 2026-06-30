import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import type { Element, ElementContent, RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import katex from "katex";
import { toClassList } from "./hastUtils";

type SatteriMdastPlugin = NonNullable<
  SatteriProcessorOptions["mdastPlugins"]
>[number];
type SatteriHastPlugin = NonNullable<
  SatteriProcessorOptions["hastPlugins"]
>[number];

const KATEX_DISPLAY_OPTIONS = {
  displayMode: true,
  output: "htmlAndMathml",
  throwOnError: false,
} as const;

const KATEX_INLINE_OPTIONS = {
  displayMode: false,
  output: "htmlAndMathml",
  throwOnError: false,
} as const;

const KATEX_DISPLAY_ARRAYSTRETCH = "1.5";
const KATEX_PLUGIN_CACHE_KEY = `arraystretch-${KATEX_DISPLAY_ARRAYSTRETCH}`;
const MULTILINE_MATH_ENV_PATTERN =
  /\\begin\{(?:align\*?|aligned|alignedat|alignat\*?|gather\*?|gathered|split)\}/;

function isElement(node: RootContent | ElementContent): node is Element {
  return node.type === "element";
}

function isMathCode(node: Element, kind: "inline" | "display"): boolean {
  const classes = toClassList(node.properties?.className);
  if (!classes.includes("language-math")) return false;
  if (kind === "display") return true;
  return classes.includes("math-inline");
}

function addDisplayMathRowSpacing(value: string): string {
  if (!MULTILINE_MATH_ENV_PATTERN.test(value)) return value;
  return `\\def\\arraystretch{${KATEX_DISPLAY_ARRAYSTRETCH}}\n${value}`;
}

function katexToElement(html: string): Element {
  const node = fromHtml(html, { fragment: true }).children.find(isElement);
  if (!node) {
    throw new Error("Expected KaTeX to render an HTML element.");
  }
  return node;
}

function satteriKatexDisplayCode(): SatteriMdastPlugin {
  return {
    name: `sylvan-katex-display-code-${KATEX_PLUGIN_CACHE_KEY}`,
    math(node) {
      return {
        type: "code",
        lang: "math",
        meta: "display",
        value: node.value,
      };
    },
  };
}

function satteriKatex(): SatteriHastPlugin {
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
          ctx.replaceNode(node, katexToElement(html));
        },
      },
      {
        filter: ["code"],
        visit(node, ctx) {
          if (!isMathCode(node, "inline")) return;

          const html = katex.renderToString(ctx.textContent(node), {
            ...KATEX_INLINE_OPTIONS,
          });
          ctx.replaceNode(node, katexToElement(html));
        },
      },
    ],
  };
}

export const satteriMathMdastPlugins = [satteriKatexDisplayCode()];

export const satteriMathHastPlugins = [satteriKatex()];
