import { unified } from "@astrojs/markdown-remark";
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
import remarkGithubBlockquoteAlert from "remark-github-blockquote-alert";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import { SITE, THEME_DEFS } from "./src/config";
import { LOCALES } from "./src/i18n/config";
import { rehypeA11y } from "./src/plugins/rehype-a11y";
import { rehypeImgProxy } from "./src/plugins/rehypeImgProxy";
import { rehypeSafeHtml } from "./src/plugins/rehypeSafeHtml";
import { remarkMermaid } from "./src/plugins/remarkMermaid";
import { transformerCodeMeta } from "./src/utils/transformers/codeMeta";
import { transformerLineNumbers } from "./src/utils/transformers/lineNumbers";

const theme = THEME_DEFS[SITE.themeScheme];

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
      redirectToDefaultLocale: false,
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
    processor: unified({
      remarkPlugins: [
        remarkToc,
        remarkMath,
        remarkMermaid,
        remarkGithubBlockquoteAlert,
      ],
      rehypePlugins: [
        rehypeRaw,
        rehypeSafeHtml,
        rehypeImgProxy,
        rehypeKatex,
        rehypeA11y,
      ],
    }),
    shikiConfig: {
      themes: theme.shiki,
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
