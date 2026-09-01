export function shouldIncludeInSitemap(page: string): boolean {
  const pathname = new URL(page).pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/") return false;
  if (/^\/[a-z]{2}\/(?:404|search)$/i.test(pathname)) return false;

  return true;
}
