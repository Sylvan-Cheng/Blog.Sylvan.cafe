import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@/config";
import getSortedPosts from "@/utils/getSortedPosts";
import { buildLlmsIndex } from "@/utils/llms";

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? SITE.website;
  const allPosts = await getCollection("blog", ({ data }) => !data.draft && data.locale === "zh");
  const sorted = getSortedPosts(allPosts);

  return new Response(buildLlmsIndex(sorted, base).join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
