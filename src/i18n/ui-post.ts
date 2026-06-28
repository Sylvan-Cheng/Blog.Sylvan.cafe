import type { Dict, TemplateDict } from "./config";
import { ruPlural } from "./plurals";

export const postSection = {
  /** Post detail */
  post: {
    prev: {
      zh: "上一篇",
      en: "Previous Post",
      ja: "前の記事",
      ru: "Предыдущая",
      eo: "Antaŭa afiŝo",
    } satisfies Dict,
    next: {
      zh: "下一篇",
      en: "Next Post",
      ja: "次の記事",
      ru: "Следующая",
      eo: "Sekva afiŝo",
    } satisfies Dict,
    goBack: {
      zh: "返回",
      en: "Go back",
      ja: "戻る",
      ru: "Назад",
      eo: "Reiri",
    } satisfies Dict,
    updated: {
      zh: "更新：",
      en: "Updated:",
      ja: "更新：",
      ru: "Обновлено:",
      eo: "Ĝisdatigita:",
    } satisfies Dict,
    wordsCount: {
      zh: (count) => `${count} 字`,
      en: (count) => `${count} words`,
      ja: (count) => `${count} 文字`,
      ru: (count) => ruPlural(count, "слово", "слова", "слов"),
      eo: (count) => `${count} vortoj`,
    } satisfies TemplateDict<number>,
    continueReading: {
      zh: "继续阅读",
      en: "Continue Reading",
      ja: "続きを読む",
      ru: "Продолжить чтение",
      eo: "Daŭrigi legadon",
    } satisfies Dict,
  },

  codeBlock: {
    expand: {
      zh: "展开",
      en: "Expand",
      ja: "展開",
      ru: "Развернуть",
      eo: "Etendi",
    } satisfies Dict,
    collapse: {
      zh: "折叠",
      en: "Collapse",
      ja: "折りたたむ",
      ru: "Свернуть",
      eo: "Faldi",
    } satisfies Dict,
    copy: {
      zh: "复制",
      en: "Copy",
      ja: "コピー",
      ru: "Копировать",
      eo: "Kopii",
    } satisfies Dict,
    copied: {
      zh: "已复制",
      en: "Copied",
      ja: "コピー済み",
      ru: "Скопировано",
      eo: "Kopiite",
    } satisfies Dict,
  },

  /** License page */
  license: {
    title: {
      zh: "License",
      en: "License",
      ja: "License",
      ru: "License",
      eo: "Permesilo",
    } satisfies Dict,
    desc: {
      zh: "了解本站内容的许可规则。",
      en: "Learn about the licensing terms for this site.",
      ja: "このサイトのライセンス規約について。",
      ru: "Узнайте о правилах лицензирования контента.",
      eo: "Eksciu pri la licencaj kondiĉoj de ĉi tiu retejo.",
    } satisfies Dict,
  },
};
