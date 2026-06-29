import type { AstroGlobal } from "astro";
import { SITE, THEME_DEFS } from "@/config";
import type { Locale } from "@/i18n/config";
import { LOCALE_META, LOCALES } from "@/i18n/config";
import {
  buildHreflangPath,
  buildStructuredData,
  getDefaultOgImage,
} from "./layoutSeo";

type FontAssetMap = {
  cyrillic400: string;
  jp400: string;
  sc400: string;
};

export type DocumentHeadProps = {
  title?: string;
  author?: string;
  profile?: string;
  description?: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
  hreflangs?: Record<string, string>;
};

export type DocumentHeadModelInput = {
  astro: Pick<AstroGlobal, "props" | "url" | "site" | "generator">;
  locale: Locale;
  fontAssets: FontAssetMap;
};

export function getScriptFont(locale: Locale, fontAssets: FontAssetMap) {
  const scriptFonts: Partial<Record<Locale, string>> = {
    ja: fontAssets.jp400,
    ru: fontAssets.cyrillic400,
    zh: fontAssets.sc400,
  };

  return scriptFonts[locale];
}

export function buildDocumentHeadModel({
  astro,
  locale,
  fontAssets,
}: DocumentHeadModelInput) {
  const {
    title = SITE.title,
    author = SITE.author,
    profile = SITE.profile,
    description = SITE.desc,
    pubDatetime,
    modDatetime,
    hreflangs,
  } = astro.props as DocumentHeadProps;

  const currentPath = astro.url.pathname;
  const canonicalURL = new URL(currentPath, astro.url);
  const socialImageURL = new URL(getDefaultOgImage(), astro.url);
  const themeColors = THEME_DEFS[SITE.themeScheme].themeColor;
  const scriptFont = getScriptFont(locale, fontAssets);
  const hreflangUrl = (targetLocale: Locale) =>
    buildHreflangPath(currentPath, targetLocale, hreflangs);

  return {
    title,
    author,
    profile,
    description,
    pubDatetime,
    modDatetime,
    canonicalURL,
    generator: astro.generator,
    hreflangLinks: LOCALES.map((targetLocale) => ({
      locale: targetLocale,
      lang: LOCALE_META[targetLocale].lang,
      url: new URL(hreflangUrl(targetLocale), astro.site),
    })),
    xDefaultUrl: new URL(hreflangUrl(LOCALES[0]), astro.site),
    socialImageURL,
    structuredData: buildStructuredData({
      title,
      author,
      profile,
      description,
      socialImageURL,
      canonicalURL,
      locale,
      pubDatetime,
      modDatetime,
    }),
    themeColors,
    scriptFont,
    analyticsUrl: SITE.analytics.umami.url,
    umamiWebsiteId: SITE.analytics.umami.websiteId,
    isArticle: Boolean(pubDatetime),
  };
}
