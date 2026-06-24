import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";
import type { Locale } from "@/i18n/config";
import { getPath } from "./getPath";
import { getPrevNextPosts } from "./getPrevNextPosts";

type BlogPost = CollectionEntry<"blog">;
type PostPathEntry = Pick<BlogPost, "id" | "filePath">;

export const KATEX_PRELOAD_FONTS = [
  "KaTeX_Main-Regular.woff2",
  "KaTeX_Main-Bold.woff2",
  "KaTeX_Math-Italic.woff2",
  "KaTeX_Size1-Regular.woff2",
];

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
    canonicalURL: post.data.canonicalURL,
    hreflangs: translationMap,
  };
}

export function buildPostNavigation(posts: BlogPost[], post: BlogPost) {
  return getPrevNextPosts(posts, post.id);
}

export function getLocalizedPostPath(
  post: PostPathEntry,
  locale: Locale,
): string {
  return `/${locale}${getPath(post.id, post.filePath)}`;
}
