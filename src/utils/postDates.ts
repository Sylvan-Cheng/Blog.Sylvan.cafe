import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

export function getPostDate(post: BlogPost): Date {
  return post.data.modDatetime ?? post.data.pubDatetime;
}

export function comparePostsByDateDesc(a: BlogPost, b: BlogPost): number {
  return getPostDate(b).getTime() - getPostDate(a).getTime();
}

export function comparePostsByPubDateAsc(a: BlogPost, b: BlogPost): number {
  return a.data.pubDatetime.getTime() - b.data.pubDatetime.getTime();
}
