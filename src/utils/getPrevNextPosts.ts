import type { CollectionEntry } from "astro:content";

interface PrevNext {
  prev: { id: string; title: string; filePath?: string } | null;
  next: { id: string; title: string; filePath?: string } | null;
}

export function getPrevNextPosts(
  posts: CollectionEntry<"blog">[],
  currentId: string,
): PrevNext {
  const allPosts = posts.map(({ data: { title }, id, filePath }) => ({
    id,
    title,
    filePath,
  }));
  const currentPostIndex = allPosts.findIndex((p) => p.id === currentId);
  if (currentPostIndex === -1) return { prev: null, next: null };
  return {
    prev: currentPostIndex !== 0 ? allPosts[currentPostIndex - 1] : null,
    next:
      currentPostIndex < allPosts.length - 1
        ? allPosts[currentPostIndex + 1]
        : null,
  };
}
