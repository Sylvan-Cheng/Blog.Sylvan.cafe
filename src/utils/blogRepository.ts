import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { LOCALES, type Locale } from "@/i18n/config";
import { comparePostsByDateDesc } from "./postDates";
import { groupPostsByTranslationKey } from "./postTranslations";

type BlogPost = CollectionEntry<"blog">;

export type PostIndex = {
  posts: BlogPost[];
  postsByKey: ReturnType<typeof groupPostsByTranslationKey>;
  sortedPostsByLocale: Record<Locale, BlogPost[]>;
};

export async function getPosts(): Promise<BlogPost[]> {
  return getCollection("blog");
}

export async function getPostsByLocale(
  locale: Locale | string,
): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.data.locale === locale);
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(comparePostsByDateDesc);
}

export async function getSortedPosts(
  locale?: Locale | string,
): Promise<BlogPost[]> {
  const posts = locale ? await getPostsByLocale(locale) : await getPosts();
  return sortPosts(posts);
}

export async function getPostIndex(): Promise<PostIndex> {
  const posts = await getPosts();
  const sortedPostsByLocale = Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      sortPosts(posts.filter((post) => post.data.locale === locale)),
    ]),
  ) as Record<Locale, BlogPost[]>;

  return {
    posts,
    postsByKey: groupPostsByTranslationKey(posts),
    sortedPostsByLocale,
  };
}
