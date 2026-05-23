import { SITE } from "@/config";
import { LOCALES } from "@/i18n/config";

export { LOCALES };

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: string;
}

export const SOCIALS = [
  {
    name: "GitHub",
    href: "https://github.com/Ruixi-Cheng",
    linkTitle: `${SITE.title} on GitHub`,
    icon: "tabler:brand-github",
  },
  {
    name: "Mail",
    href: "mailto:me@sylvan.cafe",
    linkTitle: `Send an email to ${SITE.title}`,
    icon: "tabler:mail",
  },
] as const satisfies readonly Social[];
