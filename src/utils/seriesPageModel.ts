import type { Locale } from "@/i18n/config";
import { getLocalizedContentIndex } from "./localizedContentIndex";

export async function buildSeriesPageModel(locale: Locale) {
  const contentByLocale = await getLocalizedContentIndex();

  return {
    seriesGroups: contentByLocale[locale].seriesGroups,
  };
}
