import { renderMermaidSVG } from "beautiful-mermaid";
import type { Root, RootContent } from "mdast";
import { injectMermaidStyle, wrapMermaidSvg } from "./mermaidMarkup";

export function remarkMermaid() {
  return (tree: Root) => {
    walk(tree);
  };
}

function walk(node: Root | RootContent): void {
  if (!("children" in node) || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (
      child.type === "code" &&
      child.lang?.trim().toLowerCase() === "mermaid"
    ) {
      try {
        let svg = renderMermaidSVG(child.value || "", {
          bg: "var(--background)",
          fg: "var(--foreground)",
          transparent: true,
        });

        svg = injectMermaidStyle(svg);

        node.children.splice(i, 1, {
          type: "html",
          value: wrapMermaidSvg(svg),
        });
      } catch {
        // Keep the original code block — Shiki will syntax-highlight it as plain text
      }
      continue;
    }

    if ("children" in child && Array.isArray(child.children)) {
      walk(child);
    }
  }
}
