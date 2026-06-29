import type { GetStaticPathsOptions } from "astro";
import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";
import { getLocalizedContentIndex } from "./localizedContentIndex";

type Paginate = GetStaticPathsOptions["paginate"];

export async function buildTagStaticPaths(paginate: Paginate) {
  const results = [];
  const contentByLocale = await getLocalizedContentIndex();

  for (const locale of LOCALES) {
    for (const { tag, tagName, posts } of contentByLocale[locale].tags) {
      results.push(
        ...paginate(posts, {
          params: { locale, tag },
          props: { tagName },
          pageSize: SITE.postPerPage,
        }),
      );
    }
  }

  return results;
}
