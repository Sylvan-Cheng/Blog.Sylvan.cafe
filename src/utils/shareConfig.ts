import type { Locale } from "@/i18n/config";
import { UI } from "@/i18n/ui";
import { t } from "@/i18n/utils";

export type SharePlatform =
  | "brand-facebook"
  | "brand-line"
  | "brand-qq"
  | "brand-reddit"
  | "brand-telegram"
  | "brand-wechat"
  | "brand-whatsapp"
  | "brand-x"
  | "copy"
  | "mail";

export type SharePlatformSet = {
  primary: SharePlatform[];
  more: SharePlatform[];
};

const shareConfig: Record<Locale, SharePlatformSet> = {
  zh: {
    primary: ["copy", "brand-wechat", "brand-telegram", "brand-qq"],
    more: [
      "brand-x",
      "brand-reddit",
      "brand-whatsapp",
      "brand-line",
      "brand-facebook",
      "mail",
    ],
  },
  en: {
    primary: ["copy", "brand-x", "brand-reddit", "mail"],
    more: [
      "brand-whatsapp",
      "brand-telegram",
      "brand-facebook",
      "brand-wechat",
      "brand-line",
      "brand-qq",
    ],
  },
  ja: {
    primary: ["copy", "brand-x", "brand-line", "brand-facebook"],
    more: [
      "brand-reddit",
      "brand-whatsapp",
      "brand-telegram",
      "brand-wechat",
      "brand-qq",
      "mail",
    ],
  },
  ru: {
    primary: ["copy", "brand-telegram", "brand-x", "mail"],
    more: [
      "brand-whatsapp",
      "brand-reddit",
      "brand-facebook",
      "brand-line",
      "brand-wechat",
      "brand-qq",
    ],
  },
  eo: {
    primary: ["copy", "brand-x", "brand-reddit", "mail"],
    more: [
      "brand-whatsapp",
      "brand-telegram",
      "brand-facebook",
      "brand-wechat",
      "brand-line",
      "brand-qq",
    ],
  },
};

const platformKeyMap: Record<SharePlatform, keyof typeof UI.share.platforms> = {
  copy: "copy",
  "brand-facebook": "facebook",
  "brand-line": "line",
  "brand-qq": "qq",
  "brand-reddit": "reddit",
  "brand-telegram": "telegram",
  "brand-wechat": "wechat",
  "brand-whatsapp": "whatsapp",
  "brand-x": "x",
  mail: "mail",
};

const shareUrls: Partial<Record<SharePlatform, string>> = {
  "brand-facebook": "https://www.facebook.com/sharer.php?u=",
  "brand-line": "https://social-plugins.line.me/lineit/share?url=",
  "brand-reddit": "https://www.reddit.com/submit?url=",
  "brand-telegram": "https://t.me/share/url?url=",
  "brand-whatsapp": "https://wa.me/?text=",
  "brand-x": "https://x.com/intent/post?url=",
  mail: "mailto:?subject=&body=",
};

export function getSharePlatforms(locale: Locale): SharePlatformSet {
  return shareConfig[locale];
}

export function getShareHref(platform: SharePlatform, pageUrl: string): string {
  const base = shareUrls[platform];
  return base ? base + encodeURIComponent(pageUrl) : "#";
}

export function getShareLabel(platform: SharePlatform, locale: Locale): string {
  return t(UI.share.platforms[platformKeyMap[platform]], locale);
}
