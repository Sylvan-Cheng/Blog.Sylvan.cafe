import type { CollectionEntry } from "astro:content";
import { getPostTranslationKey } from "./contentIdentity";
import { slugifyStr } from "./slugify";

type BlogPost = CollectionEntry<"blog">;

export type SeriesGroup = {
  key: string;
  sourceLabel: string;
  posts: BlogPost[];
  count: number;
  updatedAt: Date;
};

function updatedAt(post: BlogPost): Date {
  return post.data.modDatetime ?? post.data.pubDatetime;
}

export function sortByUpdated(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => updatedAt(b).getTime() - updatedAt(a).getTime(),
  );
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
      const sortedPosts = [...groupPosts].sort(
        (a, b) => a.data.pubDatetime.getTime() - b.data.pubDatetime.getTime(),
      );
      return {
        key,
        sourceLabel: sortedPosts[0].data.series ?? key,
        posts: sortedPosts,
        count: sortedPosts.length,
        updatedAt: updatedAt(sortByUpdated(sortedPosts)[0]),
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
    .sort((a, b) => a.data.pubDatetime.getTime() - b.data.pubDatetime.getTime())
    .slice(0, limit);
}
