/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "keyframes-name-pattern": null,
    "custom-property-pattern": null,
    "custom-property-no-missing-var-function": null,
    "import-notation": null,
    "media-feature-range-notation": null,
    "property-no-vendor-prefix": null,
    "property-no-deprecated": null,
    "no-invalid-position-declaration": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "custom-variant",
          "theme",
          "utility",
          "plugin",
          "apply",
          "tailwind",
          "config",
          "layer",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"],
      },
    ],
  },
  overrides: [
    {
      files: ["*.astro"],
      customSyntax: "postcss-html",
    },
  ],
  ignoreFiles: [
    "dist/**",
    "node_modules/**",
    "public/assets/katex.min.css",
    "src/layouts/PostDetails.astro",
  ],
};
