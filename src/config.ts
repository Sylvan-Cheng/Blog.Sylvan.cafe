export const THEME_DEFS = {
  gruvbox: {
    shiki: {
      light: "gruvbox-light-hard" as const,
      dark: "gruvbox-dark-hard" as const,
    },
    themeColor: {
      light: "#fbf1c7",
      dark: "#282828",
    },
    giscus: {
      light: "gruvbox_light" as const,
      dark: "gruvbox_dark" as const,
    },
  },
  nord: {
    shiki: {
      light: "github-light" as const,
      dark: "nord" as const,
    },
    themeColor: {
      light: "#eceff4",
      dark: "#2e3440",
    },
    giscus: {
      light: "nord" as const,
      dark: "nord" as const,
    },
  },
  dracula: {
    shiki: {
      light: "github-light" as const,
      dark: "dracula" as const,
    },
    themeColor: {
      light: "#f8f8f2",
      dark: "#282a36",
    },
    giscus: {
      light: "light" as const,
      dark: "dark_dimmed" as const,
    },
  },
  atom: {
    shiki: {
      light: "github-light" as const,
      dark: "one-dark-pro" as const,
    },
    themeColor: {
      light: "#fafafa",
      dark: "#282c34",
    },
    giscus: {
      light: "light" as const,
      dark: "dark_dimmed" as const,
    },
  },
  default: {
    shiki: {
      light: "github-light" as const,
      dark: "github-dark" as const,
    },
    themeColor: {
      light: "#fdfdfd",
      dark: "#212737",
    },
    giscus: {
      light: "light" as const,
      dark: "dark" as const,
    },
  },
} as const;

export type ThemeScheme = keyof typeof THEME_DEFS;

export const SITE = {
  website: "https://blog.sylvan.cafe/",
  author: "Sylvan",
  profile: "https://blog.sylvan.cafe/",
  desc: "A personal blog about technology, code, and life.",
  title: "Sylvan's Blog",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
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
  },
  dir: "ltr", // "rtl" | "auto"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format)
  analytics: {
    umami: {
      url: "https://umami.sylvan.cafe",
      websiteId: "636e674b-026b-4730-b2dc-cd79336f463c",
    },
  },
  themeScheme: "gruvbox" as ThemeScheme,
} as const;
