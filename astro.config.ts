import { defineConfig, envField } from "astro/config";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeA11y } from "./src/utils/rehype-a11y";
import { rehypeImgProxy } from "./src/plugins/rehypeImgProxy";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerCodeMeta } from "./src/utils/transformers/codeMeta.js";
import { transformerLineNumbers } from "./src/utils/transformers/lineNumbers.js";
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
    rehypePlugins: [
      rehypeRaw,
      rehypeImgProxy,
      rehypeKatex,
      rehypeA11y,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className:
              "heading-link ms-2 no-underline opacity-75 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100",
            ariaLabel: "Jump to heading",
          },
          content: {
            type: "element",
            tagName: "span",
            properties: { ariaHidden: "true" },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
    ],
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
