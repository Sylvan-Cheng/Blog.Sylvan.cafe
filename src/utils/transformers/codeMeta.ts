import type { Element } from "hast";
import { parseCodeMeta } from "./codeMetaParser";

interface TransformerCtx {
  options: { meta?: { __raw?: string } };
  addClassToHast(node: Element, cls: string): void;
}

interface CodeMetaOptions {
  style?: "v1" | "v2";
  hideDot?: boolean;
}

/**
 * Shiki transformer：解析 Markdown 代码块 meta 字符串，添加属性到 <pre>。
 *
 * 支持的 meta 键：
 *   file="name"   → 文件名牌照 + data-filename
 *   collapse      → data-collapse="true"（无 = 默认为 true）
 *   nolines       → data-nolines="true"（关闭行号）
 *   wrap          → data-wrap="true"（启用自动换行）
 */
export const transformerCodeMeta = ({
  style = "v2",
  hideDot = false,
}: CodeMetaOptions = {}) => ({
  pre(node: Element) {
    const meta = parseCodeMeta(
      (this as unknown as TransformerCtx).options.meta?.__raw,
    );

    if (meta.collapse) {
      node.properties["data-collapse"] = "true";
    }

    if (meta.nolines) {
      node.properties["data-nolines"] = "true";
    }

    if (meta.wrap) {
      node.properties["data-wrap"] = "true";
    }

    const file = meta.file;

    if (!file) return;

    const fileNameOffset = style === "v1" ? "0.75rem" : "-0.75rem";
    const existingStyle = Array.isArray(node.properties.style)
      ? `${node.properties.style.join(";")};`
      : (node.properties.style as string) || "";
    node.properties.style = `${existingStyle}--file-name-offset: ${fileNameOffset};`;

    // 标记 copy 按钮需偏移（避免运行时 getComputedStyle 强制重排）
    node.properties["data-filename"] = "true";

    (this as unknown as TransformerCtx).addClassToHast(
      node,
      `mt-8 ${style === "v1" ? "rounded-tl-none" : ""}`,
    );

    node.children.push({
      type: "element",
      tagName: "span",
      properties: {
        class: [
          "absolute py-1 text-foreground text-xs font-medium leading-4 z-10",
          hideDot
            ? "px-2"
            : "pl-4 pr-2 before:inline-block before:size-1 before:bg-accent before:rounded-full before:absolute before:top-[45%] before:left-2",
          style === "v1"
            ? "left-0 -top-6 rounded-t-md border border-b-0 bg-surface-muted/50"
            : "left-2 top-(--file-name-offset) border rounded-md bg-background",
        ],
      },
      children: [{ type: "text", value: file }],
    });
  },
});
