import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const outputPath = resolve("public/og.png");
const nodeModules = resolve(process.cwd(), "node_modules/@fontsource");

const site = {
  desc: "A personal blog about technology, code, and life.",
  title: "Sylvan's Blog",
  website: "https://blog.sylvan.cafe/",
};

const og = {
  bg: "#fbf1c7",
  border: "#ebdbb2",
};

const ogImageOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
};

async function loadLocalFont(pkg, fileName) {
  const filePath = resolve(nodeModules, pkg, "files", fileName);
  const buffer = await readFile(filePath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

async function loadLocalFonts() {
  return Promise.all([
    loadLocalFont("noto-sans", "noto-sans-latin-400-normal.woff").then(
      (data) => ({
        name: "Noto Sans",
        data,
        weight: 400,
        style: "normal",
      }),
    ),
    loadLocalFont("noto-sans", "noto-sans-latin-700-normal.woff").then(
      (data) => ({
        name: "Noto Sans",
        data,
        weight: 700,
        style: "normal",
      }),
    ),
    loadLocalFont(
      "noto-sans-sc",
      "noto-sans-sc-chinese-simplified-400-normal.woff",
    ).then((data) => ({
      name: "Noto Sans SC",
      data,
      weight: 400,
      style: "normal",
    })),
    loadLocalFont("noto-sans-jp", "noto-sans-jp-japanese-400-normal.woff").then(
      (data) => ({
        name: "Noto Sans JP",
        data,
        weight: 400,
        style: "normal",
      }),
    ),
    loadLocalFont("noto-sans", "noto-sans-cyrillic-400-normal.woff").then(
      (data) => ({
        name: "Noto Sans",
        data,
        weight: 400,
        style: "normal",
      }),
    ),
  ]);
}

function createOgFrame(children) {
  return {
    type: "div",
    props: {
      style: {
        background: og.bg,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "-1px",
              right: "-1px",
              border: "4px solid #000",
              background: og.border,
              opacity: "0.9",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2.5rem",
              width: "88%",
              height: "80%",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              border: "4px solid #000",
              background: og.bg,
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
              width: "88%",
              height: "80%",
            },
            children,
          },
        },
      ],
    },
  };
}

function siteHostname() {
  try {
    return new URL(site.website).hostname;
  } catch {
    return site.website;
  }
}

async function siteOgImage() {
  return satori(
    createOgFrame({
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          margin: "20px",
          width: "90%",
          height: "90%",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "90%",
                maxHeight: "90%",
                overflow: "hidden",
                textAlign: "center",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: { fontSize: 72, fontWeight: "bold" },
                    children: site.title,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: { fontSize: 28 },
                    children: site.desc,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                marginBottom: "8px",
                fontSize: 28,
              },
              children: {
                type: "span",
                props: {
                  style: { overflow: "hidden", fontWeight: "bold" },
                  children: siteHostname(),
                },
              },
            },
          },
        ],
      },
    }),
    {
      ...ogImageOptions,
      fonts: await loadLocalFonts(),
    },
  );
}

const svg = await siteOgImage();
const png = new Resvg(svg).render().asPng();

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, png);

console.log(`Generated ${outputPath} (${ogImageOptions.width}x${ogImageOptions.height}, png)`);
