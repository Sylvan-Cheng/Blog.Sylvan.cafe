import type { CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";
import { getPostTranslationKey, getPostUrl } from "./contentIdentity";

type BlogPost = CollectionEntry<"blog">;
type PostsByTranslationKey = Record<string, BlogPost[]>;

export function groupPostsByTranslationKey(
  posts: BlogPost[],
): PostsByTranslationKey {
  const postsByKey: PostsByTranslationKey = {};

  for (const post of posts) {
    const key = getPostTranslationKey(post);
    if (!key) continue;
    postsByKey[key] ??= [];
    postsByKey[key].push(post);
  }

  return postsByKey;
}

export function buildTranslationMap(
  post: BlogPost,
  postsByKey: PostsByTranslationKey,
): Partial<Record<Locale, string>> {
  const key = getPostTranslationKey(post);
  const translationMap: Partial<Record<Locale, string>> = {};

  for (const translation of postsByKey[key] ?? []) {
    translationMap[translation.data.locale] = getPostUrl(translation);
  }

  return translationMap;
}
