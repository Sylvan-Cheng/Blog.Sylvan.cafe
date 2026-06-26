import type { CollectionEntry } from "astro:content";
import { getPostTranslationKey } from "./contentIdentity";
import {
  comparePostsByDateDesc,
  comparePostsByPubDateAsc,
  getPostDate,
} from "./postDates";
import { slugifyStr } from "./slugify";

type BlogPost = CollectionEntry<"blog">;

export type SeriesGroup = {
  key: string;
  sourceLabel: string;
  posts: BlogPost[];
  count: number;
  updatedAt: Date;
};

export function sortByUpdated(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(comparePostsByDateDesc);
}

export function buildSeriesGroups(posts: BlogPost[]): SeriesGroup[] {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const series = post.data.series;
    if (!series) continue;
    const key = slugifyStr(series);
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }

  return [...groups.entries()]
    .map(([key, groupPosts]) => {
      const sortedPosts = [...groupPosts].sort(comparePostsByPubDateAsc);
      return {
        key,
        sourceLabel: sortedPosts[0].data.series ?? key,
        posts: sortedPosts,
        count: sortedPosts.length,
        updatedAt: getPostDate(sortByUpdated(sortedPosts)[0]),
      };
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function getRecentlyUpdatedPosts(
  posts: BlogPost[],
  limit = 5,
): BlogPost[] {
  return sortByUpdated(posts).slice(0, limit);
}

export function getSameSeriesPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit = 3,
): BlogPost[] {
  const series = currentPost.data.series;
  const translationKey = getPostTranslationKey(currentPost);
  if (!series) return [];

  return posts
    .filter((post) => post.data.series === series)
    .filter((post) => getPostTranslationKey(post) !== translationKey)
    .sort(comparePostsByPubDateAsc)
    .slice(0, limit);
}
