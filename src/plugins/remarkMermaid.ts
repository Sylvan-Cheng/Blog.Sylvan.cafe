import { renderMermaidSVG } from "beautiful-mermaid";
import type { Root, RootContent } from "mdast";
import { wrapMermaidSvg } from "./mermaidMarkup";

const STYLE_INJECTION = `<style>
  svg {
    --_text:         var(--mermaid-fg);
    --_text-sec:     var(--mermaid-fg);
    --_text-muted:   var(--mermaid-fg);
    --_text-faint:   var(--mermaid-fg);
    --_line:         var(--mermaid-line);
    --_arrow:        var(--mermaid-line);
    --_node-fill:    var(--mermaid-node-fill);
    --_node-stroke:  var(--mermaid-node-stroke);
    --_group-fill:   var(--mermaid-group-fill);
    --_group-hdr:    var(--mermaid-group-hdr);
    --_inner-stroke: var(--mermaid-inner-stroke);
    --_key-badge:    var(--mermaid-inner-stroke);
  }
  text { font-family: var(--font-body), system-ui, sans-serif; }
</style>`;

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

        svg = svg.replace(/<style\b[^>]*>[\s\S]*?<\/style>/, STYLE_INJECTION);

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
