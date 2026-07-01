import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/config";
import { LOCALES } from "@/i18n/config";
import { postHasTag } from "./contentIdentity";
import getUniqueTags from "./getUniqueTags";
import { comparePostsByDateDesc } from "./postDates";
import { buildSeriesGroups, type SeriesGroup } from "./seriesModel";

type BlogPost = CollectionEntry<"blog">;

export type LocalizedTagGroup = {
  tag: string;
  tagName: string;
  posts: BlogPost[];
};

export type LocalizedContent = {
  locale: Locale;
  posts: BlogPost[];
  tags: LocalizedTagGroup[];
  seriesGroups: SeriesGroup[];
};

export type LocalizedContentIndex = Record<Locale, LocalizedContent>;

function buildLocalizedContent(
  locale: Locale,
  posts: BlogPost[],
): LocalizedContent {
  const localizedPosts = posts
    .filter((post) => post.data.locale === locale)
    .sort(comparePostsByDateDesc);
  const tags = getUniqueTags(localizedPosts)
    .map(({ tag, tagName }) => ({
      tag,
      tagName,
      posts: localizedPosts.filter((post) => postHasTag(post, tag)),
    }))
    .filter(({ posts }) => posts.length > 0);

  return {
    locale,
    posts: localizedPosts,
    tags,
    seriesGroups: buildSeriesGroups(localizedPosts),
  };
}

export function buildLocalizedContentIndex(
  posts: BlogPost[],
): LocalizedContentIndex {
  return Object.fromEntries(
    LOCALES.map((locale) => [locale, buildLocalizedContent(locale, posts)]),
  ) as LocalizedContentIndex;
}

export async function getLocalizedContentIndex(): Promise<LocalizedContentIndex> {
  return buildLocalizedContentIndex(await getCollection("blog"));
}

export async function getLocalizedContent(
  locale: Locale | string,
): Promise<LocalizedContent | null> {
  const contentByLocale = await getLocalizedContentIndex();
  return contentByLocale[locale as Locale] ?? null;
}
