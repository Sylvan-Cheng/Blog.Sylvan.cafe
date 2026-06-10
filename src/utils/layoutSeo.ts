import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";

type Hreflangs = Record<string, string> | undefined;

export function buildHreflangPath(
  currentPath: string,
  targetLocale: string,
  hreflangs?: Hreflangs,
): string {
  if (hreflangs?.[targetLocale]) return hreflangs[targetLocale];

  const segments = currentPath.replace(/^\//, "").split("/");
  if ((LOCALES as readonly string[]).includes(segments[0])) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }

  const path = `/${segments.join("/")}`;
  return path.endsWith("/") ? path : `${path}/`;
}

type StructuredDataInput = {
  title: string;
  author: string;
  profile?: string;
  description: string;
  socialImageURL: URL;
  canonicalURL: string | URL;
  locale: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
};

export function buildStructuredData({
  title,
  author,
  profile,
  description,
  socialImageURL,
  canonicalURL,
  locale,
  pubDatetime,
  modDatetime,
}: StructuredDataInput) {
  if (!pubDatetime) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalURL}#article`,
    headline: title,
    description,
    image: `${socialImageURL}`,
    inLanguage: locale,
    datePublished: pubDatetime.toISOString(),
    ...(modDatetime && { dateModified: modDatetime.toISOString() }),
    mainEntityOfPage: { "@id": `${canonicalURL}` },
    author: [
      {
        "@type": "Person",
        name: author,
        ...(profile && { url: profile }),
      },
    ],
  };
}

export function getDefaultOgImage(): string {
  return SITE.ogImage ? `/${SITE.ogImage}` : "/og.png";
}
