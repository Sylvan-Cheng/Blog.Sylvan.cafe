import { slugifyStr } from "../utils/slugify";

const S3_BASE = "https://s3.sylvan.cafe/";
const PROXY_BASE = "https://img.sylvan.cafe/unsafe/";

export function buildHeadingId(
  text: string,
  usedIds: Set<string>,
  fallback: string,
): string {
  const baseId = slugifyStr(text) || fallback;
  let id = baseId;

  if (usedIds.has(id)) {
    let suffix = 2;
    while (usedIds.has(`${baseId}-${suffix}`)) suffix++;
    id = `${baseId}-${suffix}`;
  }

  usedIds.add(id);
  return id;
}

export function buildImgProxyUrls(
  src: string,
  width?: unknown,
  height?: unknown,
) {
  if (!src.startsWith(S3_BASE)) return null;

  const path = src.slice(S3_BASE.length);
  const fullUrl = `${PROXY_BASE}plain/${path}`;
  const numericWidth = Number(width);
  const numericHeight = Number(height);
  const thumbUrl =
    width !== undefined &&
    height !== undefined &&
    numericWidth > 0 &&
    numericHeight > 0
      ? `${PROXY_BASE}rs:fit:${numericWidth}:${numericHeight}/plain/${path}`
      : `${PROXY_BASE}w:800/plain/${path}`;

  return { fullUrl, thumbUrl };
}

export function wrapMermaidSvg(svg: string): string {
  return `<figure class="mermaid-diagram">${svg}</figure>`;
}
