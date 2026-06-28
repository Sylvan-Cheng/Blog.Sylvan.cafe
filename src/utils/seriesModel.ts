import type { CollectionEntry } from "astro:content";
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
