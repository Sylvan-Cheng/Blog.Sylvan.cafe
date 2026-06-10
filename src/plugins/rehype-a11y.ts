import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { getTextContent, toClassList } from "./hastUtils";
import { buildHeadingId } from "./markdownTransforms";

export function rehypeA11y() {
  return (tree: Root) => {
    let headingIndex = 0;
    const usedIds = new Set<string>();

    visit(tree, "element", (node: Element) => {
      // 1. Task list checkboxes — missing aria-label for screen readers
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

      // 2. Heading anchors — group class + ID + # link, single traversal
      if (!node.properties || !/^h[2-6]$/.test(node.tagName)) return;

      const existingId = node.properties.id;
      let id: string | undefined =
        typeof existingId === "string" ? existingId : undefined;

      if (!id) {
        const text = getTextContent(node);
        id = buildHeadingId(text, usedIds, `heading-${headingIndex}`);
        node.properties.id = id;
      }

      headingIndex++;

      const classList = toClassList(node.properties.className);
      node.properties.className = classList.concat("group").filter(Boolean);

      (node.children as Element[]).push({
        type: "element",
        tagName: "a",
        properties: {
          className:
            "heading-link ms-2 no-underline opacity-0 md:group-hover:opacity-100 md:focus:opacity-100",
          ariaLabel: "Jump to heading",
          href: `#${id}`,
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { ariaHidden: "true" },
            children: [{ type: "text", value: "#" }],
          },
        ],
      });
    });
  };
}
