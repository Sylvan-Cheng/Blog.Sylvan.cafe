import type { GetStaticPathsOptions } from "astro";
import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";
import { getLocalizedContentIndex } from "./localizedContentIndex";

type Paginate = GetStaticPathsOptions["paginate"];

export async function buildPostListStaticPaths(paginate: Paginate) {
  const results = [];
  const contentByLocale = await getLocalizedContentIndex();

  for (const locale of LOCALES) {
    results.push(
      ...paginate(contentByLocale[locale].posts, {
        params: { locale },
        pageSize: SITE.postPerPage,
      }),
    );
  }

  return results;
}
