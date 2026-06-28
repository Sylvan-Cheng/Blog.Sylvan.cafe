const S3_BASE = "https://s3.sylvan.cafe/";
const PROXY_BASE = "https://img.sylvan.cafe/unsafe/";

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
