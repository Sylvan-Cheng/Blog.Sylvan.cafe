import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

export function rehypeA11y() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      /*
       * 1. Task list checkboxes
       *    Astro 的 GFM task list 渲染 <input type="checkbox" disabled>
       *    缺少 label 关联或 aria-label，屏幕阅读器无法识别其含义。
       */
      if (
        node.tagName === "input" &&
        node.properties &&
        node.properties.type === "checkbox" &&
        node.properties.disabled !== undefined
      ) {
        const checked =
          node.properties.checked !== undefined &&
          node.properties.checked !== false;
        node.properties["aria-label"] = checked
          ? "Completed task"
          : "Incomplete task";
      }

      /*
       * 2. Heading group class
       *    给 h2-h6 添加 `group` 类，配合 rehype-autolink-headings 的
       *    md:group-hover:opacity-100 实现悬停时显示锚点链接。
       */
      if (
        node.tagName &&
        /^h[2-6]$/.test(node.tagName) &&
        node.properties
      ) {
        const cls = node.properties.className;
        const classList = Array.isArray(cls)
          ? cls
          : typeof cls === "string"
            ? [cls]
            : [];
        node.properties.className = classList
          .concat("group")
          .filter(Boolean);
      }
    });
  };
}
