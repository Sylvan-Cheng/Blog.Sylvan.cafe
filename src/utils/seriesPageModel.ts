import type { Locale } from "@/i18n/config";
import { getPostsByLocale } from "./blogRepository";
import { buildSeriesGroups } from "./seriesModel";

export async function buildSeriesPageModel(locale: Locale) {
  const posts = await getPostsByLocale(locale);
  return {
    seriesGroups: buildSeriesGroups(posts),
  };
}
