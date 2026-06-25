import type { Dict } from "./config";

export const homeSection = {
  /** Home page */
  home: {
    greeting: {
      zh: "你好，欢迎来访 👋",
      en: "Hello, welcome! 👋",
      ja: "こんにちは、ようこそ！👋",
      ru: "Привет, добро пожаловать! 👋",
      eo: "Saluton, bonvenon! 👋",
    } satisfies Dict,
    desc: {
      zh: "这是 Sylvan 的个人博客。这里记录关于技术、代码和生活的思考。",
      en: "Sylvan's personal blog. Thoughts on technology, code, and life.",
      ja: "Sylvan の個人ブログです。技術、コード、そして生活についての考えを綴っています。",
      ru: "Личный блог Sylvan. Мысли о технологиях, коде и жизни.",
      eo: "Persona blogo de Sylvan. Pensoj pri teknologio, kodo kaj vivo.",
    } satisfies Dict,
    recent: {
      zh: "最近文章",
      en: "Recent Posts",
      ja: "最近の記事",
      ru: "Недавние записи",
      eo: "Lastatempaj afiŝoj",
    } satisfies Dict,
    allPosts: {
      zh: "全部文章",
      en: "All Posts",
      ja: "全ての記事",
      ru: "Все записи",
      eo: "Ĉiuj afiŝoj",
    } satisfies Dict,
    socialLinks: {
      zh: "社交链接：",
      en: "Social Links:",
      ja: "ソーシャルリンク:",
      ru: "Соцсети:",
      eo: "Sociaj ligiloj:",
    } satisfies Dict,
  },

  /** RSS */
  rss: {
    subscribe: {
      zh: "欢迎订阅 RSS 以获取最新文章。",
      en: "Subscribe to RSS for the latest posts.",
      ja: "RSSで最新記事を購読してください。",
      ru: "Подпишитесь на RSS, чтобы получать новые записи.",
      eo: "Abonu RSS por ricevi la plej novajn afiŝojn.",
    } satisfies Dict,
  },
};
