import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier.startsWith(".") &&
      !/\.[cm]?[jt]s$/i.test(specifier) &&
      context.parentURL?.startsWith(pathToFileURL(process.cwd()).href)
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }

    return nextResolve(specifier, context);
  },
});

const { satteriHastPlugins, satteriMdastPlugins } = await import(
  "../src/plugins/satteriMarkdown.ts"
);

const renderer = await createSatteriMarkdownProcessor({
  syntaxHighlight: "shiki",
  shikiConfig: {
    defaultColor: false,
    wrap: true,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  },
  features: {
    math: true,
  },
  mdastPlugins: satteriMdastPlugins,
  hastPlugins: satteriHastPlugins,
});

const probeMarkdown = `## Hello <em>World</em>

> [!NOTE]
> alert body

<img src="javascript:alert(1)" onerror="alert(1)">

![s3](https://s3.sylvan.cafe/a/b.png)

\`$x^2$\` and $x^2$

\`\`\`ts file="demo.ts" collapse nolines
const x = 1
\`\`\`

\`\`\`mermaid
graph TD
  A --> B
\`\`\`
`;

const result = await renderer.render(probeMarkdown, {
  fileURL: new URL("file:///satteri-probe.md"),
  frontmatter: {},
});

console.log(result.code);
console.log("\n--- metadata ---");
console.log(JSON.stringify(result.metadata, null, 2));
