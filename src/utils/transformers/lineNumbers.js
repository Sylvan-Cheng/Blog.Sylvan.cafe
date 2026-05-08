/**
 * Shiki transformer：给每行代码添加行号，跳过 nolines 标记的代码块。
 */
export function transformerLineNumbers() {
  return {
    name: "line-numbers",
    pre(node) {
      if (node.properties["data-nolines"] !== undefined) return node;
      const code = node.children.find(
        (c) => c.type === "element" && c.tagName === "code"
      );
      if (!code) return node;

      let n = 1;
      const visit = (el) => {
        if (el.type === "element" && el.properties?.class) {
          const classes = Array.isArray(el.properties.class)
            ? el.properties.class
            : String(el.properties.class).split(" ");
          if (classes.includes("line")) {
            el.children.unshift({
              type: "element",
              tagName: "span",
              properties: { class: "line-number", ariaHidden: "true" },
              children: [{ type: "text", value: String(n++) }],
            });
          }
        }
        if (el.children) el.children.forEach(visit);
      };
      visit(code);
      return node;
    },
  };
}
