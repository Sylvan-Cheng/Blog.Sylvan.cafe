import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

type BlogPost = CollectionEntry<"blog">;

export function buildPostLayoutProps(
  post: BlogPost,
  translationMap: Record<string, string>,
) {
  return {
    title: `${post.data.title} | ${SITE.title}`,
    author: post.data.author,
    description: post.data.description,
    pubDatetime: post.data.pubDatetime,
    modDatetime: post.data.modDatetime,
    hreflangs: translationMap,
  };
}
