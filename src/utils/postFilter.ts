import type { CollectionEntry } from "astro:content";
import { isPostPublishable } from "./blogRepository";

export const postFilter = ({ data }: CollectionEntry<"blog">) => {
  return isPostPublishable(data);
};
