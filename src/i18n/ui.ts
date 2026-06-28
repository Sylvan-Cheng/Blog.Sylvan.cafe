import { homeSection } from "./ui-home";
import { miscSection } from "./ui-misc";
import { navSection } from "./ui-nav";
import { postSection } from "./ui-post";
import { seriesSection } from "./ui-series";
import { shareSection } from "./ui-share";

export const UI = {
  ...navSection,
  ...postSection,
  ...homeSection,
  ...seriesSection,
  ...shareSection,
  ...miscSection,
};
