import type { APIRoute } from "astro";
import { SITE } from "@/config";
import { getSortedPosts } from "@/utils/blogRepository";
import { buildLlmsIndex } from "@/utils/llms";

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? SITE.website;
  const sorted = await getSortedPosts("zh");

  return new Response(buildLlmsIndex(sorted, base).join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
