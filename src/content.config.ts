import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({
    pattern: ["**/[^_]*.md", "!**/_*/**"],
    base: `./${BLOG_PATH}`,
  }),
  schema: z.object({
    // === Required ===
    locale: z.enum(LOCALES).default("zh"),
    title: z.string().min(1, "Title is required"),
    pubDatetime: z.coerce.date(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(320, "Description too long for SEO"),

    // === Optional ===
    author: z.string().default(SITE.author),
    modDatetime: z.coerce.date().optional(),
    tags: z.array(z.string()).default(["others"]),
    series: z.string().optional(),
    math: z.boolean().optional().default(false),
    timezone: z.string().optional(),
    license: z.enum(["cc-by-nc-sa-4.0", "copyright"]).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: ["**/[^_]*.md", "!**/_*/**"],
    base: "./src/data/pages",
  }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(LOCALES),
  }),
});

export const collections = { blog, pages };
