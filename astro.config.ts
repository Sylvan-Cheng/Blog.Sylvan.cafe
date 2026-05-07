import { defineConfig, envField } from "astro/config";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";
import { LOCALES } from "./src/i18n/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  build: {
    inlineStylesheets: "always",
  },
  i18n: {
    defaultLocale: "zh",
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  integrations: [
    partytown(),
    sitemap({
      filter: page => SITE.showArchives || !page.replace(/\/$/, "").endsWith("/archives"),
    }),
    icon(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, remarkMath, [remarkCollapse, { test: "Table of contents" }]],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      /*
      Shiki 在构建时静态编译，不支持运行时跟随 data-scheme 切换。
      换色板后需重新构建。备选主题对:
        Default:  { light: "github-light",  dark: "github-dark" }
        Nord:     { light: "github-light",  dark: "nord" }
        Gruvbox:  { light: "gruvbox-light-hard", dark: "gruvbox-dark-hard" }  // ← 当前
      */
      themes: { light: "gruvbox-light-hard", dark: "gruvbox-dark-hard" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
});
