import assert from "node:assert/strict";
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
  syntaxHighlight: {
    type: "shiki",
    excludeLangs: ["math"],
  },
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

const markdown = String.raw`
Inline math should render as KaTeX: $x^2 + y^2 = z^2$.

Block math should render as display KaTeX:

$$
E = mc^2
$$

Aligned display math should preserve nested KaTeX and MathML:

$$
\begin{aligned}
a &= b + c \\
d &= e + f
\end{aligned}
$$

<details>
<summary>Click for details</summary>

Hidden **content** should stay inside the details element.

- first item
- second item

</details>
`;

const result = await renderer.render(markdown, {
  fileURL: new URL("file:///markdown-rendering-regression.md"),
  frontmatter: {},
});

const html = result.code;
const mathMlCount = html.match(/<math\b/g)?.length ?? 0;
const displayMathCount = html.match(/<span class="katex-display">/g)?.length ?? 0;

assert.match(html, /<span class="katex">/, "inline math renders with KaTeX");
assert.equal(displayMathCount, 2, "block and aligned math render as display math");
assert.ok(mathMlCount >= 3, "inline, block, and aligned math include MathML");
assert.doesNotMatch(html, /<pre[^>]*>\s*<code[^>]*language-math/, "display math is not left as a code block");
assert.doesNotMatch(html, /<span class="katex-display"><\/span>/, "display math is not flattened into an empty KaTeX node");
assert.match(
  html,
  /<details>[\s\S]*<summary>Click for details<\/summary>[\s\S]*Hidden <strong>content<\/strong> should stay inside the details element\.[\s\S]*<ul>[\s\S]*first item[\s\S]*second item[\s\S]*<\/ul>[\s\S]*<\/details>/,
  "details preserve rendered Markdown content inside the collapsible element",
);
assert.doesNotMatch(
  html,
  /<\/details>\s*<p>Hidden/,
  "details content is not emitted after the closing details tag",
);

console.log("Markdown rendering regression tests passed.");
