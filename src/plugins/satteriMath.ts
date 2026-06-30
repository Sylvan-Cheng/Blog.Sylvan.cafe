import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import type { Element, ElementContent, RootContent } from "hast";
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
  return (
    classes.includes("language-math") &&
    classes.includes(kind === "inline" ? "math-inline" : "math-display")
  );
}

function addDisplayMathRowSpacing(value: string): string {
  if (!MULTILINE_MATH_ENV_PATTERN.test(value)) return value;
  return `\\def\\arraystretch{${KATEX_DISPLAY_ARRAYSTRETCH}}\n${value}`;
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

function satteriKatexDisplay(): SatteriMdastPlugin {
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

export const satteriMathMdastPlugins = [satteriKatexDisplay()];

export const satteriMathHastPlugins = [satteriKatex()];
