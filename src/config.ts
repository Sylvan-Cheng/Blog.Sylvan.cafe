export const SITE = {
  website: "https://blog.sylvan.cafe/",
  author: "Sylvan",
  profile: "https://blog.sylvan.cafe/",
  desc: "A personal blog about technology, code, and life.",
  title: "Sylvan's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  giscus: {
    enabled: true,
    repo: "giscus/giscus-component",
    repoId: "MDEwOlJlcG9zaXRvcnkzOTEzMTMwMjA=",
    category: "Announcements",
    categoryId: "DIC_kwDOF1kCJM4CWMMY",
    mapping: "pathname",
    strict: true,
    reactionsEnabled: "1",
    emitMetadata: false,
    inputPosition: "bottom",
    lang: "zh-CN",
    lightTheme: "light",
    darkTheme: "dark",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
