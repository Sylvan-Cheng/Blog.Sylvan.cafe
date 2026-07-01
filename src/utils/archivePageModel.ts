import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";
import { getLocalizedContent } from "./localizedContentIndex";
import { comparePostsByDateDesc } from "./postDates";

type BlogPost = CollectionEntry<"blog">;

export type ArchiveMonthGroup = {
  month: number;
  label: string;
  posts: BlogPost[];
};

export type ArchiveYearGroup = {
  year: number;
  count: number;
  months: ArchiveMonthGroup[];
};

function getArchiveYear(post: BlogPost): number {
  return post.data.pubDatetime.getFullYear();
}

function getArchiveMonth(post: BlogPost): number {
  return post.data.pubDatetime.getMonth() + 1;
}

function groupPostsByArchiveMonth(posts: BlogPost[]): Map<number, BlogPost[]> {
  const groups = new Map<number, BlogPost[]>();

  for (const post of posts) {
    const month = getArchiveMonth(post);
    groups.set(month, [...(groups.get(month) ?? []), post]);
  }

  return groups;
}

function buildArchiveMonths(
  posts: BlogPost[],
  monthLabels: readonly string[],
): ArchiveMonthGroup[] {
  return [...groupPostsByArchiveMonth(posts).entries()]
    .sort(([monthA], [monthB]) => monthB - monthA)
    .map(([month, monthPosts]) => ({
      month,
      label: monthLabels[month - 1] ?? String(month),
      posts: [...monthPosts].sort(comparePostsByDateDesc),
    }));
}

export function buildArchiveGroups(
  posts: BlogPost[],
  monthLabels: readonly string[],
): ArchiveYearGroup[] {
  const groups = new Map<number, BlogPost[]>();

  for (const post of posts) {
    const year = getArchiveYear(post);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }

  return [...groups.entries()]
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, yearPosts]) => {
      const months = buildArchiveMonths(yearPosts, monthLabels);

      return {
        year,
        count: yearPosts.length,
        months,
      };
    });
}

export async function buildArchivePageModel(
  locale: Locale,
  monthLabels: readonly string[],
) {
  const content = await getLocalizedContent(locale);

  return {
    archiveGroups: buildArchiveGroups(content?.posts ?? [], monthLabels),
  };
}
