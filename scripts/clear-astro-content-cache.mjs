import { rm } from "node:fs/promises";
import { join } from "node:path";

await rm(join("node_modules", ".astro", "data-store.json"), {
  force: true,
});
