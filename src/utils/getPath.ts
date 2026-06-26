import { BLOG_PATH } from "@/content.config";
import { LOCALES } from "@/i18n/config";
import { slugifyStr } from "./slugify";

const LOCALE_LIST: readonly string[] = LOCALES;

/**
 * Get full path of a blog post
 * @param id - id of the blog post (from glob loader, e.g. "hello-world/zh" or "zh/hello-world")
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path (e.g. "/posts/hello-world")
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true,
) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter((path) => path !== "")
    .filter((path) => !path.startsWith("_"))
    .filter((path) => !LOCALE_LIST.includes(path))
    .slice(0, -1) // remove the filename, keep only directory segments
    .map((segment) => slugifyStr(segment));

  const basePath = includeBase ? "/posts" : "";

  // Strip known locale from the end of the id (e.g. "hello-world/zh" → "hello-world")
  const blogId = id.split("/");
  const lastPart = blogId[blogId.length - 1];
  const cleanParts = LOCALE_LIST.includes(lastPart)
    ? blogId.slice(0, -1)
    : blogId;
  const slug = cleanParts.slice(-1);

  // Dedupe: if the last path segment matches the slug (post lives in its own directory),
  // remove it from pathSegments to avoid "/hello-world/hello-world"
  if (
    pathSegments &&
    pathSegments.length >= 1 &&
    pathSegments[pathSegments.length - 1] === slugifyStr(slug[0])
  ) {
    pathSegments.pop();
  }

  const parts =
    !pathSegments || pathSegments.length < 1
      ? [...slug]
      : [...pathSegments, ...slug];
  const raw = includeBase ? [basePath, ...parts].join("/") : parts.join("/");

  return includeBase ? `${raw}/` : raw;
}
