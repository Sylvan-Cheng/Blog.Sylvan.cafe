import { type CollectionEntry, render } from "astro:content";
import { SITE } from "@/config";
import type { Locale } from "@/i18n/config";
import type { PostIndex } from "./blogRepository";
import { getPostUrl } from "./contentIdentity";
import { KATEX_PRELOAD_FONTS, KATEX_STYLESHEET_HREF } from "./katexAssets";
import { buildTranslationMap } from "./postTranslations";
import { countWords } from "./wordCount";

type BlogPost = CollectionEntry<"blog">;
type PostLink = { title: string; url: string } | null;

type PostDetailsModelInput = {
  post: BlogPost;
  postIndex: PostIndex;
  locale: Locale;
};

function toPostLink(post: BlogPost | undefined, locale: Locale): PostLink {
  if (!post) return null;
  return {
    title: post.data.title,
    url: getPostUrl(post, locale),
  };
}

function getAdjacentPosts(posts: BlogPost[], post: BlogPost, locale: Locale) {
  const currentPostIndex = posts.findIndex((entry) => entry.id === post.id);
  if (currentPostIndex === -1) return { prev: null, next: null };

  return {
    prev: toPostLink(posts[currentPostIndex - 1], locale),
    next: toPostLink(posts[currentPostIndex + 1], locale),
  };
}

function buildLayoutProps(post: BlogPost, postIndex: PostIndex) {
  return {
    title: `${post.data.title} | ${SITE.title}`,
    articleHeadline: post.data.title,
    author: post.data.author,
    description: post.data.description,
    pubDatetime: post.data.pubDatetime,
    modDatetime: post.data.modDatetime,
    hreflangs: buildTranslationMap(post, postIndex.postsByKey),
  };
}

export async function buildPostDetailsModel({
  post,
  postIndex,
  locale,
}: PostDetailsModelInput) {
  const { Content, headings } = await render(post);
  const posts = postIndex.contentByLocale[locale].posts;
  const { prev, next } = getAdjacentPosts(posts, post, locale);

  return {
    Content,
    headings,
    katexStylesheetHref: post.data.math ? KATEX_STYLESHEET_HREF : null,
    katexPreloadFonts: KATEX_PRELOAD_FONTS,
    layoutProps: buildLayoutProps(post, postIndex),
    nextPost: next,
    prevPost: prev,
    wordCount: countWords(post.body ?? ""),
  };
}
