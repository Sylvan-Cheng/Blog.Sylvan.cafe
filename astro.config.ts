import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import icon from "astro-icon";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import { SITE } from "./src/config";
import { LOCALES } from "./src/i18n/config";
import { rehypeA11y } from "./src/plugins/rehype-a11y";
import { rehypeImgProxy } from "./src/plugins/rehypeImgProxy";
import { remarkMermaid } from "./src/plugins/remarkMermaid";
import { transformerCodeMeta } from "./src/utils/transformers/codeMeta";
import { transformerLineNumbers } from "./src/utils/transformers/lineNumbers";

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
      filter: (page) =>
        SITE.showArchives || !page.replace(/\/$/, "").endsWith("/archives"),
    }),
    icon(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkMath,
      remarkMermaid,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [rehypeRaw, rehypeImgProxy, rehypeKatex, rehypeA11y],
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
      wrap: true,
      transformers: [
        transformerCodeMeta({ style: "v2", hideDot: false }),
        transformerLineNumbers(),
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
