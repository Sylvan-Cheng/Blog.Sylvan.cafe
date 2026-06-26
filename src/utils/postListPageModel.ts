import type { GetStaticPathsOptions } from "astro";
import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";
import { getPostsByLocale, sortPosts } from "./blogRepository";

type Paginate = GetStaticPathsOptions["paginate"];

export async function buildPostListStaticPaths(paginate: Paginate) {
  const results = [];

  for (const locale of LOCALES) {
    const posts = await getPostsByLocale(locale);
    results.push(
      ...paginate(sortPosts(posts), {
        params: { locale },
        pageSize: SITE.postPerPage,
      }),
    );
  }

  return results;
}
