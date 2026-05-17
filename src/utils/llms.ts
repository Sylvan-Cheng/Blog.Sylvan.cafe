import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "./getPath";

export function buildPostUrl(
  post: CollectionEntry<"blog">,
  base: string
): string {
  const path = `/${post.data.locale}${getPath(post.id, post.filePath)}index.md`;
  return new URL(path, base).href;
}

export function buildLlmsIndex(
  posts: CollectionEntry<"blog">[],
  base: string
): string[] {
  const lines: string[] = [];

  lines.push(`# ${SITE.title}`);
  lines.push("");
  lines.push(`> ${SITE.desc}`);
  lines.push("");

  lines.push("## Blog Posts");
  lines.push("");
  for (const post of posts) {
    const url = buildPostUrl(post, base);
    lines.push(`- [${post.data.title}](${url}): ${post.data.description}`);
  }
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [关于](${new URL("zh/about/", base).href})`);
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(`- [RSS Feed](${new URL("zh/rss.xml", base).href})`);
  lines.push(`- [Sitemap](${new URL("sitemap-index.xml", base).href})`);
  lines.push("");

  return lines;
}
