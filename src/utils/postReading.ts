import type { CollectionEntry } from "astro:content";
import { getRecentlyUpdatedPosts, getSameSeriesPosts } from "./seriesModel";

type BlogPost = CollectionEntry<"blog">;

export function buildPostReadingModel(posts: BlogPost[], post: BlogPost) {
  const sameSeriesPosts = getSameSeriesPosts(posts, post, 3);
  const continuePosts =
    sameSeriesPosts.length > 0
      ? sameSeriesPosts
      : getRecentlyUpdatedPosts(posts, 4)
          .filter((relatedPost) => relatedPost.id !== post.id)
          .slice(0, 3);

  return { continuePosts };
}
