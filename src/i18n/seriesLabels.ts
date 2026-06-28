import type { Locale } from "./config";

type SeriesLabelDictionary = Record<string, Partial<Record<Locale, string>>>;

const seriesLabels: SeriesLabelDictionary = {
  "annual-review": {
    zh: "年度回顾",
    en: "Annual Review",
    ja: "年次レビュー",
    ru: "Годовой обзор",
    eo: "Jara resumo",
  },
  "astro-blog-rendering": {
    zh: "Astro 博客渲染",
    en: "Astro Blog Rendering",
    ja: "Astro ブログレンダリング",
    ru: "Рендеринг блога Astro",
    eo: "Astro-bloga bildigo",
  },
};

export function formatSeriesLabel(key: string): string {
  return key
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSeriesLabel(key: string, locale: Locale): string {
  return seriesLabels[key]?.[locale] ?? formatSeriesLabel(key);
}
