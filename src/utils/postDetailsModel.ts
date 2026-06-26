import { type CollectionEntry, render } from "astro:content";
import type { Locale } from "@/i18n/config";
import { KATEX_PRELOAD_FONTS, loadKatexCss } from "./katexAssets";
import { buildPostNavigation, getLocalizedPostPath } from "./postNavigation";
import { buildPostReadingModel } from "./postReading";
import { buildPostLayoutProps } from "./postSeo";
import { countWords } from "./wordCount";

type BlogPost = CollectionEntry<"blog">;

type PostDetailsModelInput = {
  post: BlogPost;
  posts: BlogPost[];
  translationMap: Record<string, string>;
  locale: Locale;
};

function toPostLink(
  post: ReturnType<typeof buildPostNavigation>["prev"],
  locale: Locale,
) {
  if (!post) return null;
  return {
    title: post.title,
    url: getLocalizedPostPath(post, locale),
  };
}

export async function buildPostDetailsModel({
  post,
  posts,
  translationMap,
  locale,
}: PostDetailsModelInput) {
  const { Content, headings } = await render(post);
  const { prev, next } = buildPostNavigation(posts, post);
  const { continuePosts } = buildPostReadingModel(posts, post);

  return {
    Content,
    continuePosts,
    headings,
    kaTeXInlineCSS: loadKatexCss(post.data.math),
    katexPreloadFonts: KATEX_PRELOAD_FONTS,
    layoutProps: buildPostLayoutProps(post, translationMap),
    nextPost: toPostLink(next, locale),
    prevPost: toPostLink(prev, locale),
    wordCount: countWords(post.body ?? ""),
  };
}
