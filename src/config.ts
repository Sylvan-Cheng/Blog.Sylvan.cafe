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
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  giscus: {
    enabled: true,
    repo: "Sylvan-Cheng/Blog.Sylvan.cafe",
    repoId: "R_kgDOSUmCeg",
    category: "Comments",
    categoryId: "DIC_kwDOSUmCes4C8X-G",
    mapping: "specific",
    strict: false,
    reactionsEnabled: "1",
    emitMetadata: false,
    inputPosition: "top",
    lightTheme: "gruvbox_light",
    darkTheme: "gruvbox_dark",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format)
} as const;
