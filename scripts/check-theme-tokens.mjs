import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const configPath = join(root, "src", "config.ts");
const themePath = join(root, "src", "styles", "theme.css");

const semanticTokens = [
  "background",
  "surface",
  "surface-muted",
  "surface-raised",
  "foreground",
  "text-secondary",
  "text-muted",
  "border",
  "selection",
  "selection-foreground",
  "accent",
  "accent-contrast",
  "link",
  "focus",
  "important",
  "info",
  "success",
  "warning",
  "danger",
];

const diagramTokens = [
  "diagram-bg",
  "diagram-fg",
  "diagram-line",
  "diagram-node-fill",
  "diagram-node-stroke",
  "diagram-group-fill",
  "diagram-group-hdr",
  "diagram-inner-stroke",
  "diagram-success",
  "diagram-danger",
  "diagram-warning",
  "diagram-info",
  "diagram-accent",
];

const requiredTokens = [...semanticTokens, ...diagramTokens];
const expectedSchemes = [
  "gruvbox",
  "nord",
  "dracula",
  "catppuccin",
  "ayu",
  "solarized",
  "tokyo-night",
  "atom",
];

function fail(messages) {
  console.error("Theme token contract check failed:");
  for (const message of messages) console.error(`- ${message}`);
  process.exit(1);
}

function extractBalancedBlock(source, openBraceIndex) {
  let depth = 0;
  let inString = null;
  let isEscaped = false;

  for (let index = openBraceIndex; index < source.length; index++) {
    const char = source[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }
      if (char === "\\") {
        isEscaped = true;
        continue;
      }
      if (char === inString) inString = null;
      continue;
    }

    if (char === '"' || char === "'") {
      inString = char;
      continue;
    }

    if (char === "{") depth++;
    if (char === "}") {
      depth--;
      if (depth === 0) return source.slice(openBraceIndex + 1, index);
    }
  }

  return null;
}

function extractBlockAfter(source, marker, startIndex = 0) {
  const markerIndex = source.indexOf(marker, startIndex);
  if (markerIndex === -1) return null;

  const openBraceIndex = source.indexOf("{", markerIndex);
  if (openBraceIndex === -1) return null;

  return extractBalancedBlock(source, openBraceIndex);
}

function getConfigSchemes(configSource) {
  const themeDefsBlock = extractBlockAfter(
    configSource,
    "export const THEME_DEFS =",
  );
  if (!themeDefsBlock) return [];

  const schemes = [];
  const pattern = /^  (?:"([^"]+)"|([a-zA-Z0-9_-]+)):\s*\{/gm;
  let match;

  while ((match = pattern.exec(themeDefsBlock))) {
    schemes.push(match[1] ?? match[2]);
  }

  return schemes;
}

function getCssSchemes(themeSource) {
  return [...themeSource.matchAll(/html\[data-scheme="([^"]+)"\]/g)].map(
    (match) => match[1],
  );
}

function findMissingTokens(block) {
  return requiredTokens.filter((token) => {
    return !new RegExp(`--${token}\\s*:`).test(block);
  });
}

const configSource = readFileSync(configPath, "utf8");
const themeSource = readFileSync(themePath, "utf8");
const errors = [];

const configSchemes = getConfigSchemes(configSource);
const cssSchemes = getCssSchemes(themeSource);

for (const expectedScheme of expectedSchemes) {
  if (!configSchemes.includes(expectedScheme)) {
    errors.push(`THEME_DEFS is missing "${expectedScheme}".`);
  }
  if (!cssSchemes.includes(expectedScheme)) {
    errors.push(`theme.css is missing html[data-scheme="${expectedScheme}"].`);
  }
}

for (const configScheme of configSchemes) {
  if (!expectedSchemes.includes(configScheme)) {
    errors.push(`THEME_DEFS includes unsupported scheme "${configScheme}".`);
  }
}

for (const cssScheme of cssSchemes) {
  if (!expectedSchemes.includes(cssScheme)) {
    errors.push(`theme.css includes unsupported scheme "${cssScheme}".`);
  }
}

const uniqueCssSchemes = new Set(cssSchemes);
if (uniqueCssSchemes.size !== cssSchemes.length) {
  errors.push("theme.css contains duplicate data-scheme selectors.");
}

for (const scheme of expectedSchemes) {
  const schemeBlock = extractBlockAfter(
    themeSource,
    `html[data-scheme="${scheme}"]`,
  );
  if (!schemeBlock) continue;

  const lightBlock = extractBlockAfter(schemeBlock, '&[data-theme="light"]');
  const darkBlock = extractBlockAfter(schemeBlock, '&[data-theme="dark"]');

  if (!lightBlock) {
    errors.push(`${scheme} is missing a light theme block.`);
  } else {
    const missingLight = findMissingTokens(lightBlock);
    if (missingLight.length > 0) {
      errors.push(`${scheme} light is missing: ${missingLight.join(", ")}.`);
    }
  }

  if (!darkBlock) {
    errors.push(`${scheme} is missing a dark theme block.`);
  } else {
    const missingDark = findMissingTokens(darkBlock);
    if (missingDark.length > 0) {
      errors.push(`${scheme} dark is missing: ${missingDark.join(", ")}.`);
    }
  }
}

if (errors.length > 0) fail(errors);

console.log("Theme token contract check passed.");
