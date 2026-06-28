import type { Dict, TemplateDict } from "./config";
import { ruPlural } from "./plurals";

export const seriesSection = {
  series: {
    title: {
      zh: "系列",
      en: "Series",
      ja: "シリーズ",
      ru: "Серии",
      eo: "Serioj",
    } satisfies Dict,
    desc: {
      zh: "按阅读顺序组织的文章路径。",
      en: "Article paths organized in reading order.",
      ja: "読む順序で整理された記事の経路です。",
      ru: "Маршруты статей, организованные в порядке чтения.",
      eo: "Artikolaj vojoj organizitaj laŭ lega ordo.",
    } satisfies Dict,
    postCount: {
      zh: (count) => `${count} 篇文章`,
      en: (count) => `${count} ${count === 1 ? "post" : "posts"}`,
      ja: (count) => `${count} 記事`,
      ru: (count) => ruPlural(count, "запись", "записи", "записей"),
      eo: (count) => `${count} afiŝoj`,
    } satisfies TemplateDict<number>,
    updated: {
      zh: "更新于",
      en: "updated",
      ja: "更新",
      ru: "обновлено",
      eo: "ĝisdatigita",
    } satisfies Dict,
    empty: {
      zh: "还没有显式系列。给文章 frontmatter 添加 series 字段即可生成阅读路径。",
      en: "No explicit series yet. Add series to post frontmatter to build paths.",
      ja: "明示的なシリーズはまだありません。記事の frontmatter に series を追加すると読書経路を生成できます。",
      ru: "Явных серий пока нет. Добавьте series во frontmatter записи, чтобы построить маршруты чтения.",
      eo: "Ankoraŭ ne estas eksplicitaj serioj. Aldonu series al la frontmatter de artikolo por krei legajn vojojn.",
    } satisfies Dict,
  },
};
