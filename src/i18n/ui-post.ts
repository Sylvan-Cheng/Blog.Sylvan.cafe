import type { Dict, TemplateDict } from "./config";

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
      zh: (count: string) => `${count} 字`,
      en: (count: string) => `${count} words`,
      ja: (count: string) => `${count} 文字`,
      ru: (count: string) => {
        const n = parseInt(count, 10);
        const lastDigit = n % 10;
        const lastTwo = n % 100;
        if (lastTwo >= 11 && lastTwo <= 14) return `${count} слов`;
        if (lastDigit === 1) return `${count} слово`;
        if (lastDigit >= 2 && lastDigit <= 4) return `${count} слова`;
        return `${count} слов`;
      },
      eo: (count: string) => `${count} vortoj`,
    } satisfies TemplateDict,
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
