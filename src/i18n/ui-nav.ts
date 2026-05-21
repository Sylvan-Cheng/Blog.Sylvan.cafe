import type { Dict } from "./config";

export const navSection = {
  /** Header / Navigation */
  nav: {
    skipToContent: {
      zh: "跳转到内容",
      en: "Skip to content",
      ja: "コンテンツへスキップ",
      ru: "Перейти к содержимому",
      eo: "Salti al enhavo",
    } satisfies Dict,
    posts: {
      zh: "文章",
      en: "Posts",
      ja: "記事",
      ru: "Записи",
      eo: "Afiŝoj",
    } satisfies Dict,
    tags: {
      zh: "标签",
      en: "Tags",
      ja: "タグ",
      ru: "Теги",
      eo: "Etikedoj",
    } satisfies Dict,
    about: {
      zh: "关于",
      en: "About",
      ja: "概要",
      ru: "О сайте",
      eo: "Pri",
    } satisfies Dict,
    archives: {
      zh: "归档",
      en: "Archives",
      ja: "アーカイブ",
      ru: "Архив",
      eo: "Arkivoj",
    } satisfies Dict,
    search: {
      zh: "搜索",
      en: "Search",
      ja: "検索",
      ru: "Поиск",
      eo: "Serĉi",
    } satisfies Dict,
  },

  /** Theme toggle */
  themeToggle: {
    zh: "切换亮色/暗色模式",
    en: "Toggle light & dark mode",
    ja: "ライト/ダークモード切替",
    ru: "Переключить светлую/тёмную тему",
    eo: "Ŝalti helan/malhelan reĝimon",
  } satisfies Dict,

  openMenu: {
    zh: "打开菜单",
    en: "Open Menu",
    ja: "メニューを開く",
    ru: "Открыть меню",
    eo: "Malfermi menuon",
  } satisfies Dict,
  closeMenu: {
    zh: "关闭菜单",
    en: "Close Menu",
    ja: "メニューを閉じる",
    ru: "Закрыть меню",
    eo: "Fermi menuon",
  } satisfies Dict,
  selectLanguage: {
    zh: "选择语言",
    en: "Select language",
    ja: "言語を選択",
    ru: "Выбрать язык",
    eo: "Elekti lingvon",
  } satisfies Dict,
};
