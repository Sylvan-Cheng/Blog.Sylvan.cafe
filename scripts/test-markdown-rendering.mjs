import assert from "node:assert/strict";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";

process.env.IMGPROXY_KEY = "00".repeat(32);
process.env.IMGPROXY_SALT = "11".repeat(32);

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
const { buildImgProxyUrls } = await import(
  "../src/plugins/imgProxyUrls.ts"
);
const { createSylvanShikiTransformers } = await import(
  "../src/utils/transformers/shikiPreset.ts"
);

const renderer = await createSatteriMarkdownProcessor({
  syntaxHighlight: {
    type: "shiki",
    excludeLangs: ["math"],
  },
  shikiConfig: {
    defaultColor: false,
    wrap: false,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    transformers: createSylvanShikiTransformers(),
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

~~~mermaid
flowchart TD
  A[Start] --> B{Ready?}
  B -- yes --> C[Ship]
~~~

~~~ts file="example.ts"
const answer = 42;
~~~

~~~ts
const defaultCodeBlockShouldScroll = "without wrap meta ".repeat(20);
~~~

~~~ts collapse file="scroll-fold.ts"
const collapsedCodeBlockShouldScroll = "collapse keeps default horizontal scrolling ".repeat(20);
~~~

~~~ts wrap collapse file="wrapped-example.ts"
const wrappedCodeBlockShouldOptIn = "with wrap, collapse, and file metadata";
~~~

<style>body { background: red; }</style>

<div style="position: fixed; inset: 0;" onclick="alert(1)">Unsafe style</div>

<pre class="astro-code" style="position: fixed; --shiki-light: #fff;"><code><span style="color: red; --shiki-light: #fff;">Fake generated code</span></code></pre>

![Signed image](https://s3.sylvan.cafe/img/blog/2026/05/photo.avif)
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
assert.doesNotMatch(html, /background:\s*red/i, "raw HTML style tag content is removed");
assert.match(
  html,
  /<figure class="mermaid-diagram">[\s\S]*<style>[\s\S]*--_node-fill/i,
  "trusted Mermaid SVG styles are preserved",
);
assert.doesNotMatch(
  html,
  /data-sylvan-mermaid-token/i,
  "internal Mermaid trust token is removed from rendered HTML",
);
assert.match(
  html,
  /<pre[^>]*class="[^"]*\bastro-code\b[^"]*"[^>]*style="[^"]*--file-name-offset/i,
  "Shiki code block keeps renderer-owned filename offset style",
);
assert.doesNotMatch(
  html,
  /<pre(?=[^>]*class="[^"]*\bastro-code\b)(?=[^>]*>[\s\S]*defaultCodeBlockShouldScroll)[^>]*\sdata-wrap=/i,
  "code blocks do not wrap unless wrap meta is present",
);
assert.match(
  html,
  /<pre(?=[^>]*class="[^"]*\bastro-code\b)(?=[^>]*\sdata-collapse="true")(?=[^>]*\sdata-filename="true")(?=[^>]*>[\s\S]*collapsedCodeBlockShouldScroll)[^>]*>/i,
  "collapse and filename metadata are preserved without requiring wrap",
);
assert.doesNotMatch(
  html,
  /<pre(?=[^>]*class="[^"]*\bastro-code\b)(?=[^>]*>[\s\S]*collapsedCodeBlockShouldScroll)[^>]*\sdata-wrap=/i,
  "collapsed code blocks keep default scroll behavior unless wrap meta is present",
);
assert.match(
  html,
  /<pre(?=[^>]*class="[^"]*\bastro-code\b)(?=[^>]*\sdata-wrap="true")(?=[^>]*\sdata-collapse="true")(?=[^>]*\sdata-filename="true")[^>]*>[\s\S]*wrappedCodeBlockShouldOptIn/i,
  "wrap meta is preserved alongside collapse and filename metadata",
);
assert.match(
  html,
  /<span style="--shiki-light:[^"]*--shiki-dark:/i,
  "Shiki token spans keep renderer-owned color variables",
);
assert.doesNotMatch(
  html,
  /position:\s*fixed/i,
  "raw HTML style attributes are removed without rejecting renderer-owned styles",
);
assert.doesNotMatch(
  html,
  /color:\s*red/i,
  "raw HTML cannot smuggle non-whitelisted styles through generated code classes",
);
assert.doesNotMatch(
  html,
  /\sonclick=/i,
  "raw HTML event handler attributes are removed",
);
assert.match(
  html,
  /https:\/\/img\.sylvan\.cafe\/[A-Za-z0-9_-]{16}\/w:800\/plain\/2026\/05\/photo\.avif/,
  "S3 blog images use a 16-character signed imgproxy thumbnail URL",
);
assert.doesNotMatch(
  html,
  /img\.sylvan\.cafe\/[^"']*\/plain\/img\/blog\//,
  "imgproxy URLs omit the base RustFS bucket and blog prefix",
);

const signedImageUrls = buildImgProxyUrls(
  "https://s3.sylvan.cafe/img/blog/2026/05/photo.avif",
);
assert.ok(signedImageUrls, "S3 blog images produce imgproxy URLs");
assert.match(
  signedImageUrls.fullUrl,
  /^https:\/\/img\.sylvan\.cafe\/[A-Za-z0-9_-]{16}\/plain\/2026\/05\/photo\.avif$/,
  "full image URL uses the compact signed path",
);
assert.match(
  signedImageUrls.thumbUrl,
  /^https:\/\/img\.sylvan\.cafe\/[A-Za-z0-9_-]{16}\/w:800\/plain\/2026\/05\/photo\.avif$/,
  "thumbnail URL signs its processing options and compact source path",
);

console.log("Markdown rendering regression tests passed.");
