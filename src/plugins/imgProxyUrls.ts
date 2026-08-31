import { buildImgProxyUrl } from "../utils/imgProxySigning";

const S3_BLOG_BASE = "https://s3.sylvan.cafe/img/blog/";

export function buildImgProxyUrls(
  src: string,
  width?: unknown,
  height?: unknown,
) {
  if (!src.startsWith(S3_BLOG_BASE)) return null;

  const path = src.slice(S3_BLOG_BASE.length);
  const fullUrl = buildImgProxyUrl(`plain/${path}`);
  const numericWidth = Number(width);
  const numericHeight = Number(height);
  const thumbUrl =
    width !== undefined &&
    height !== undefined &&
    numericWidth > 0 &&
    numericHeight > 0
      ? buildImgProxyUrl(
          `rs:fit:${numericWidth}:${numericHeight}/plain/${path}`,
        )
      : buildImgProxyUrl(`w:800/plain/${path}`);

  return { fullUrl, thumbUrl };
}
