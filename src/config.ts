export const SITE = {
  website: "https://blog.sylvan.cafe/",
  author: "Sylvan",
  profile: "https://blog.sylvan.cafe/",
  desc: "A personal blog about technology, code, and life.",
  title: "Sylvan's Blog",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    url: "https://github.com/Sylvan-Cheng/Blog.Sylvan.cafe/edit/main/",
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
  analytics: {
    umami: {
      url: "https://umami.sylvan.cafe",
      websiteId: "636e674b-026b-4730-b2dc-cd79336f463c",
    },
  },
  themeScheme: "gruvbox", // "gruvbox" | "nord" | "default"
  ogColors: {
    bg: "#fbf1c7",
    border: "#ebdbb2",
  } as const,
} as const;
