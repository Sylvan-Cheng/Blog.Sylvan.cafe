import type { GetStaticPathsOptions } from "astro";
import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";
import { getPostsByLocale, sortPosts } from "./blogRepository";
import { postHasTag } from "./contentIdentity";
import getUniqueTags from "./getUniqueTags";

type Paginate = GetStaticPathsOptions["paginate"];

export async function buildTagStaticPaths(paginate: Paginate) {
  const results = [];

  for (const locale of LOCALES) {
    const posts = await getPostsByLocale(locale);
    const tags = getUniqueTags(posts);

    for (const { tag, tagName } of tags) {
      const tagPosts = sortPosts(posts.filter((post) => postHasTag(post, tag)));
      if (tagPosts.length === 0) continue;

      results.push(
        ...paginate(tagPosts, {
          params: { locale, tag },
          props: { tagName },
          pageSize: SITE.postPerPage,
        }),
      );
    }
  }

  return results;
}
