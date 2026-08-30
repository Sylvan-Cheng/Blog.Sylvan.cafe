import type { Element, Properties, Root, RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { toClassList } from "./hastUtils";
import { getS3ImageMetadata } from "./imageMetadata";
import { buildImgProxyUrls } from "./imgProxyUrls";
import { MERMAID_TRUST_ATTRIBUTE, MERMAID_TRUST_TOKEN } from "./mermaidMarkup";

export const BLOCKED_HTML_TAGS = new Set([
  "embed",
  "foreignobject",
  "iframe",
  "object",
  "script",
  "style",
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
export const IMAGE_LIGHTBOX_BLOCKING_PARENTS = new Set(["a", "picture"]);
const PARTIAL_RAW_HTML_CONTAINER_TAGS = new Set(["details"]);
const SHIKI_STYLE_PROPERTIES = new Set([
  "--shiki-dark",
  "--shiki-dark-bg",
  "--shiki-light",
  "--shiki-light-bg",
]);
const SHIKI_PRE_STYLE_VALUES = new Map([
  ["overflow-x", "auto"],
  ["white-space", "pre-wrap"],
  ["word-wrap", "break-word"],
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

function isElementWithTag(
  node: Root | RootContent,
  tagNames: Set<string>,
): node is Element {
  return node.type === "element" && tagNames.has(node.tagName.toLowerCase());
}

function isTrustedRawHtmlContainer(node: Root | RootContent): boolean {
  if (node.type !== "element") return false;
  const classNames = toClassList(node.properties?.className);
  const token =
    node.properties?.[MERMAID_TRUST_ATTRIBUTE] ??
    node.properties?.dataSylvanMermaidToken;
  return (
    classNames.includes("mermaid-diagram") && token === MERMAID_TRUST_TOKEN
  );
}

function isGeneratedCodeContainer(node: Root | RootContent): boolean {
  if (node.type !== "element" || node.tagName.toLowerCase() !== "pre") {
    return false;
  }
  return toClassList(node.properties?.className).includes("astro-code");
}

function hasChildren(
  node: Root | RootContent,
): node is (Root | Element) & { children: RootContent[] } {
  return "children" in node && Array.isArray(node.children);
}

function getStyleValue(properties: Properties): string | null {
  const style = properties.style;
  if (typeof style === "string") return style;
  return null;
}

function isUnsafeStyleValue(value: string): boolean {
  return /(?:@import|expression\s*\(|url\s*\(|[<>])/i.test(value);
}

function sanitizeGeneratedCodeStyle(
  style: string,
  tagName: string,
): string | null {
  const declarations: string[] = [];

  for (const declaration of style.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator === -1) continue;

    const property = declaration.slice(0, separator).trim().toLowerCase();
    const value = declaration.slice(separator + 1).trim();
    if (!property || !value || isUnsafeStyleValue(value)) continue;

    if (SHIKI_STYLE_PROPERTIES.has(property)) {
      declarations.push(`${property}: ${value}`);
      continue;
    }

    if (
      tagName === "pre" &&
      property === "--file-name-offset" &&
      /^-?\d*\.?\d+(?:px|rem|em)$/i.test(value)
    ) {
      declarations.push(`${property}: ${value}`);
      continue;
    }

    if (tagName === "pre" && SHIKI_PRE_STYLE_VALUES.get(property) === value) {
      declarations.push(`${property}: ${value}`);
    }
  }

  return declarations.length > 0 ? `${declarations.join("; ")};` : null;
}

function sanitizeGeneratedCodeProperties(
  tagName: string,
  properties: Properties,
): Properties {
  const style = getStyleValue(properties);
  if (!style) return properties;

  const sanitizedStyle = sanitizeGeneratedCodeStyle(style, tagName);
  if (!sanitizedStyle) {
    const { style: _style, ...rest } = properties;
    return rest;
  }

  return { ...properties, style: sanitizedStyle };
}

export function sanitizeSatteriElementProperties(
  properties: Properties,
  options: { allowStyle?: boolean } = {},
): Properties {
  const sanitized: Properties = { ...properties };
  for (const key of Object.keys(sanitized)) {
    const normalizedKey = key.toLowerCase();
    const value = sanitized[key];
    if (
      normalizedKey === "srcdoc" ||
      (!options.allowStyle && normalizedKey === "style") ||
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
    className: [
      ...toClassList(properties.className),
      "img-lightboxable",
    ].filter(Boolean),
  };
}

export function buildSatteriImageLightboxElement(
  properties: Properties,
): Element | null {
  const src = properties.src;
  if (typeof src !== "string") return null;

  const urls = buildImgProxyUrls(src, properties.width, properties.height);
  const metadata = getS3ImageMetadata(src);
  if (!urls || !metadata) return null;

  const imageProperties = applySatteriImgProxyProperties(properties);

  return {
    type: "element",
    tagName: "a",
    properties: {
      className: ["image-lightbox-link"],
      href: urls.fullUrl,
      "data-pswp-height": metadata.height,
      "data-pswp-width": metadata.width,
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    },
    children: [
      {
        type: "element",
        tagName: "img",
        properties: imageProperties,
        children: [],
      },
    ],
  };
}

type SatteriImageEnhancement =
  | { kind: "none"; properties: Properties }
  | { kind: "properties"; properties: Properties }
  | { kind: "element"; element: Element };

export function enhanceSatteriImage(
  properties: Properties,
  options: { allowLightbox: boolean },
): SatteriImageEnhancement {
  const lightboxElement = options.allowLightbox
    ? buildSatteriImageLightboxElement(properties)
    : null;
  if (lightboxElement) return { kind: "element", element: lightboxElement };

  const nextProperties = applySatteriImgProxyProperties(properties);
  return nextProperties === properties
    ? { kind: "none", properties }
    : { kind: "properties", properties: nextProperties };
}

export function sanitizeHtmlTree(
  node: Root | RootContent,
  context: { trustedMermaid: boolean; generatedCode: boolean } = {
    trustedMermaid: false,
    generatedCode: false,
  },
): void {
  if (!hasChildren(node)) return;

  const nextChildren: RootContent[] = [];
  const trustedMermaid =
    context.trustedMermaid || isTrustedRawHtmlContainer(node);
  const generatedCode = context.generatedCode || isGeneratedCodeContainer(node);
  const canWrapChildImages = !isElementWithTag(
    node,
    IMAGE_LIGHTBOX_BLOCKING_PARENTS,
  );

  for (const child of node.children) {
    let nextChild = child;
    let childTrustedMermaid = trustedMermaid;

    if (isElement(child)) {
      const tagName = child.tagName.toLowerCase();
      childTrustedMermaid = trustedMermaid || isTrustedRawHtmlContainer(child);
      const childGeneratedCode =
        generatedCode || isGeneratedCodeContainer(child);
      const isBlockedTag =
        BLOCKED_HTML_TAGS.has(tagName) &&
        !(tagName === "style" && childTrustedMermaid);
      if (isBlockedTag) continue;

      child.properties = sanitizeSatteriElementProperties(
        child.properties ?? {},
        {
          allowStyle: childTrustedMermaid || childGeneratedCode,
        },
      );
      if (childGeneratedCode && !childTrustedMermaid) {
        child.properties = sanitizeGeneratedCodeProperties(
          tagName,
          child.properties,
        );
      }
      delete child.properties[MERMAID_TRUST_ATTRIBUTE];
      delete child.properties.dataSylvanMermaidToken;

      if (tagName === "img") {
        const enhancement = enhanceSatteriImage(child.properties, {
          allowLightbox: canWrapChildImages,
        });
        if (enhancement.kind === "element") {
          nextChild = enhancement.element;
        } else if (enhancement.kind === "properties") {
          child.properties = enhancement.properties;
        }
      }
    }

    sanitizeHtmlTree(nextChild, {
      generatedCode: generatedCode || isGeneratedCodeContainer(nextChild),
      trustedMermaid: childTrustedMermaid,
    });
    nextChildren.push(nextChild);
  }

  node.children = nextChildren;
}

export function sanitizeRawHtml(raw: string): string {
  const closingTag = raw.match(/^\s*<\/([a-z][a-z0-9-]*)\s*>\s*$/i);
  if (closingTag) {
    const tagName = closingTag[1].toLowerCase();
    return PARTIAL_RAW_HTML_CONTAINER_TAGS.has(tagName) ? `</${tagName}>` : "";
  }

  const partialContainerTag = [...PARTIAL_RAW_HTML_CONTAINER_TAGS].find(
    (tagName) =>
      new RegExp(`<${tagName}\\b`, "i").test(raw) &&
      !new RegExp(`</${tagName}\\s*>`, "i").test(raw),
  );
  const tree = fromHtml(raw, { fragment: true });
  sanitizeHtmlTree(tree);
  const sanitized = toHtml(tree);

  if (partialContainerTag) {
    return sanitized.replace(
      new RegExp(`</${partialContainerTag}>\\s*$`, "i"),
      "",
    );
  }

  return sanitized;
}
