import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE } from "@/config";
import getSortedPosts from "@/utils/getSortedPosts";
import { buildLlmsIndex, buildPostUrl } from "@/utils/llms";

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href ?? SITE.website;
  const allPosts = await getCollection(
    "blog",
    ({ data }) => !data.draft && data.locale === "zh",
  );
  const sorted = getSortedPosts(allPosts);

  const lines = buildLlmsIndex(sorted, base);

  lines.push("---");
  lines.push("");

  for (const post of sorted) {
    const url = buildPostUrl(post, base);
    lines.push(`## ${post.data.title}`);
    lines.push("");
    lines.push(`> ${post.data.description}`);
    lines.push("");
    lines.push(`Source: ${url}`);
    lines.push("");
    lines.push(post.body ?? "");
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
