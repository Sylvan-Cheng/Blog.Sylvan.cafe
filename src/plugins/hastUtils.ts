import type { Element } from "hast";

export function getTextContent(node: Element): string {
  return node.children
    .map((child) =>
      child.type === "text"
        ? child.value
        : "children" in child
          ? getTextContent(child as Element)
          : "",
    )
    .join("");
}

export function toClassList(className: unknown): string[] {
  if (Array.isArray(className)) return className.filter(Boolean).map(String);
  if (typeof className === "string") return [className];
  return [];
}
