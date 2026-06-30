import type { Element, Properties, Root, RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { toClassList } from "./hastUtils";
import { buildImgProxyUrls } from "./imgProxyUrls";

export const BLOCKED_HTML_TAGS = new Set([
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
  "xlink:href",
  "xlinkhref",
]);

const HTML_ENTITY_DECODE_MAP: Record<string, string> = {
  amp: "&",
  apos: "'",
  colon: ":",
  gt: ">",
  lt: "<",
  nbsp: "\u00a0",
  quot: '"',
};

function decodeHtmlAttribute(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([0-9a-f]+)|([a-z][a-z0-9]+));?/gi,
    (
      match,
      decimal: string | undefined,
      hex: string | undefined,
      named: string | undefined,
    ) => {
      if (decimal) {
        const codePoint = Number.parseInt(decimal, 10);
        return Number.isFinite(codePoint) && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : match;
      }

      if (hex) {
        const codePoint = Number.parseInt(hex, 16);
        return Number.isFinite(codePoint) && codePoint <= 0x10ffff
          ? String.fromCodePoint(codePoint)
          : match;
      }

      const decoded = HTML_ENTITY_DECODE_MAP[named?.toLowerCase() ?? ""];
      return decoded ?? match;
    },
  );
}

function normalizeUrl(value: string): string {
  let normalized = "";
  for (const char of decodeHtmlAttribute(value)) {
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

function isElement(node: RootContent): node is Element {
  return node.type === "element";
}

function hasChildren(
  node: Root | RootContent,
): node is (Root | Element) & { children: RootContent[] } {
  return "children" in node && Array.isArray(node.children);
}

export function sanitizeSatteriElementProperties(
  properties: Properties,
): Properties {
  const sanitized: Properties = { ...properties };
  for (const key of Object.keys(sanitized)) {
    const normalizedKey = key.toLowerCase();
    const value = sanitized[key];
    if (
      normalizedKey === "srcdoc" ||
      normalizedKey.startsWith("on") ||
      (URL_PROPERTIES.has(normalizedKey) &&
        (Array.isArray(value)
          ? value.some((item) => isDangerousUrl(item))
          : isDangerousUrl(value)))
    ) {
      delete sanitized[key];
    }
  }
  return sanitized;
}

export function applySatteriImgProxyProperties(
  properties: Properties,
): Properties {
  const src = properties.src;
  if (typeof src !== "string") return properties;

  const urls = buildImgProxyUrls(src, properties.width, properties.height);
  if (!urls) return properties;

  return {
    ...properties,
    src: urls.thumbUrl,
    "data-zoom-src": urls.fullUrl,
    className: [...toClassList(properties.className), "img-zoomable"].filter(
      Boolean,
    ),
  };
}

export function sanitizeHtmlTree(node: Root | RootContent): void {
  if (!hasChildren(node)) return;

  node.children = node.children.filter((child) => {
    if (isElement(child)) {
      const tagName = child.tagName.toLowerCase();
      if (BLOCKED_HTML_TAGS.has(tagName)) return false;

      child.properties = sanitizeSatteriElementProperties(
        child.properties ?? {},
      );

      if (tagName === "img") {
        child.properties = applySatteriImgProxyProperties(child.properties);
      }
    }

    sanitizeHtmlTree(child);
    return true;
  });
}

export function sanitizeRawHtml(raw: string): string {
  const tree = fromHtml(raw, { fragment: true });
  sanitizeHtmlTree(tree);
  return toHtml(tree);
}
