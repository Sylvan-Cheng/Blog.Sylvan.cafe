import type { CollectionEntry } from "astro:content";
import { getPath } from "./getPath";
import { slugifyStr } from "./slugify";

type BlogPost = CollectionEntry<"blog">;

export function getPostTranslationKey(postOrId: BlogPost | string): string {
  const id = typeof postOrId === "string" ? postOrId : postOrId.id;
  return id.split("/").slice(0, -1).join("/");
}

export function getPostSlugPath(post: BlogPost): string {
  return getPath(post.id, post.filePath, false);
}

export function getPostUrl(post: BlogPost, locale = post.data.locale): string {
  return `/${locale}${getPath(post.id, post.filePath)}`;
}

export function getPostMarkdownUrl(post: BlogPost, base: string): string {
  return new URL(`${getPostUrl(post)}index.md`, base).href;
}

export function getTagSlug(tagName: string): string {
  return slugifyStr(tagName);
}

export function postHasTag(post: BlogPost, tagSlug: string): boolean {
  return post.data.tags.some((tag) => getTagSlug(tag) === tagSlug);
}
