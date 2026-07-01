import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/config";
import {
  buildLocalizedContentIndex,
  getLocalizedContent,
  type LocalizedContentIndex,
} from "./localizedContentIndex";
import { comparePostsByDateDesc } from "./postDates";
import { groupPostsByTranslationKey } from "./postTranslations";

type BlogPost = CollectionEntry<"blog">;

export type PostIndex = {
  posts: BlogPost[];
  contentByLocale: LocalizedContentIndex;
  postsByKey: ReturnType<typeof groupPostsByTranslationKey>;
};

export async function getPosts(): Promise<BlogPost[]> {
  return getCollection("blog");
}

export async function getPostsByLocale(
  locale: Locale | string,
): Promise<BlogPost[]> {
  return (await getLocalizedContent(locale))?.posts ?? [];
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(comparePostsByDateDesc);
}

export async function getSortedPosts(
  locale?: Locale | string,
): Promise<BlogPost[]> {
  if (locale) return getPostsByLocale(locale);
  return sortPosts(await getPosts());
}

export async function getPostIndex(): Promise<PostIndex> {
  const posts = await getPosts();

  return {
    posts,
    contentByLocale: buildLocalizedContentIndex(posts),
    postsByKey: groupPostsByTranslationKey(posts),
  };
}
