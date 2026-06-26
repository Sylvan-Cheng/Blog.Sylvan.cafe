import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";
import { getPath } from "./getPath";
import { getPrevNextPosts } from "./getPrevNextPosts";

type BlogPost = CollectionEntry<"blog">;
type PostPathEntry = Pick<BlogPost, "id" | "filePath">;

export function buildPostNavigation(posts: BlogPost[], post: BlogPost) {
  return getPrevNextPosts(posts, post.id);
}

export function getLocalizedPostPath(
  post: PostPathEntry,
  locale: Locale,
): string {
  return `/${locale}${getPath(post.id, post.filePath)}`;
}
