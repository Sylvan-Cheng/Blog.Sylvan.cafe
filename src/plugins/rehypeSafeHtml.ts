import type { Element, Root, RootContent } from "hast";

const BLOCKED_TAGS = new Set([
  "embed",
  "foreignobject",
  "iframe",
  "object",
  "script",
]);

const URL_PROPERTIES = new Set([
  "action",
  "cite",
  "formaction",
  "href",
  "poster",
  "src",
  "xlinkhref",
]);

function isElement(node: Root | RootContent): node is Element {
  return node.type === "element";
}

function hasChildren(
  node: Root | RootContent,
): node is (Root | Element) & { children: RootContent[] } {
  return "children" in node && Array.isArray(node.children);
}

function normalizeUrl(value: string): string {
  let normalized = "";
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f || /\s/u.test(char)) continue;
    normalized += char;
  }
  return normalized.toLowerCase();
}

function isSafeDataImage(value: string): boolean {
  return /^data:image\/(?:avif|gif|jpe?g|png|webp);base64,/i.test(value);
}

function isDangerousUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const normalized = normalizeUrl(value);
  return (
    normalized.startsWith("javascript:") ||
    normalized.startsWith("vbscript:") ||
    (normalized.startsWith("data:") && !isSafeDataImage(normalized))
  );
}

function sanitizeElement(node: Element): void {
  const properties = node.properties ?? {};
  for (const key of Object.keys(properties)) {
    const normalizedKey = key.toLowerCase();
    const value = properties[key];
    if (
      normalizedKey === "srcdoc" ||
      normalizedKey.startsWith("on") ||
      (URL_PROPERTIES.has(normalizedKey) &&
        (Array.isArray(value)
          ? value.some((item) => isDangerousUrl(item))
          : isDangerousUrl(value)))
    ) {
      delete properties[key];
    }
  }
}

function sanitizeChildren(node: Root | RootContent): void {
  if (!hasChildren(node)) return;

  node.children = node.children.filter((child) => {
    if (isElement(child)) {
      if (BLOCKED_TAGS.has(child.tagName.toLowerCase())) return false;
      sanitizeElement(child);
    }

    sanitizeChildren(child);
    return true;
  });
}

export function sanitizeHtmlTree(tree: Root): void {
  sanitizeChildren(tree);
}

export function rehypeSafeHtml() {
  return sanitizeHtmlTree;
}
