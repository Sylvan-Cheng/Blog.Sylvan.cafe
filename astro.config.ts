import { satteri } from "@astrojs/markdown-satteri";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import icon from "astro-icon";
import { SITE, THEME_DEFS } from "./src/config";
import { LOCALES } from "./src/i18n/config";
import {
  satteriHastPlugins,
  satteriMdastPlugins,
} from "./src/plugins/satteriMarkdown";
import { createSylvanShikiTransformers } from "./src/utils/transformers/shikiPreset";

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
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["math"],
    },
    processor: satteri({
      features: {
        math: true,
      },
      mdastPlugins: satteriMdastPlugins,
      hastPlugins: satteriHastPlugins,
    }),
    shikiConfig: {
      themes: theme.shiki,
      defaultColor: false,
      wrap: false,
      transformers: createSylvanShikiTransformers(),
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
