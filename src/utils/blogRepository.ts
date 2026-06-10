import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import type { Locale } from "@/i18n/config";

type BlogPost = CollectionEntry<"blog">;

export type PublishOptions = {
  now?: number;
  dev?: boolean;
  scheduledPostMargin?: number;
};

export function isPostPublishable(
  data: BlogPost["data"],
  options: PublishOptions = {},
): boolean {
  const now = options.now ?? Date.now();
  const dev = options.dev ?? import.meta.env.DEV;
  const scheduledPostMargin =
    options.scheduledPostMargin ?? SITE.scheduledPostMargin;
  const isPublishTimePassed =
    now > data.pubDatetime.getTime() - scheduledPostMargin;

  return !data.draft && (dev || isPublishTimePassed);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return getCollection("blog");
}

export async function getPublishedPosts(
  options?: PublishOptions,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter(({ data }) => isPostPublishable(data, options));
}

export async function getPublishedPostsByLocale(
  locale: Locale | string,
  options?: PublishOptions,
): Promise<BlogPost[]> {
  const posts = await getPublishedPosts(options);
  return posts.filter((post) => post.data.locale === locale);
}

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      (b.data.modDatetime ?? b.data.pubDatetime ?? new Date(0)).getTime() -
      (a.data.modDatetime ?? a.data.pubDatetime ?? new Date(0)).getTime(),
  );
}

export async function getSortedPublishedPosts(
  locale?: Locale | string,
  options?: PublishOptions,
): Promise<BlogPost[]> {
  const posts = locale
    ? await getPublishedPostsByLocale(locale, options)
    : await getPublishedPosts(options);
  return sortPosts(posts);
}
