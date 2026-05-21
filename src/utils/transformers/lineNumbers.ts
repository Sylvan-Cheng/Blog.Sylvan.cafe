import type { Element } from "hast";

/**
 * Shiki transformer：给每行代码添加行号，跳过 nolines 标记的代码块。
 */
export function transformerLineNumbers() {
  return {
    name: "line-numbers",
    pre(node: Element) {
      if (node.properties["data-nolines"] !== undefined) return node;
      const code = (node.children || []).find(
        (c): c is Element => c.type === "element" && c.tagName === "code",
      );
      if (!code) return node;

      let n = 1;
      const visit = (el: Element) => {
        if (el.type === "element" && el.properties?.class) {
          const classes = Array.isArray(el.properties.class)
            ? el.properties.class
            : String(el.properties.class).split(" ");
          if (classes.includes("line")) {
            (el.children as Element[]).unshift({
              type: "element",
              tagName: "span",
              properties: { class: "line-number", ariaHidden: "true" },
              children: [{ type: "text", value: String(n++) }],
            });
          }
        }
        if (el.children)
          el.children.forEach((c) => {
            if (c.type === "element") visit(c);
          });
      };
      visit(code);
      return node;
    },
  };
}
