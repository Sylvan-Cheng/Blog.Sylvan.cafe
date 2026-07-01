import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerCodeMeta } from "./codeMeta";
import { transformerLineNumbers } from "./lineNumbers";

export function createSylvanShikiTransformers() {
  return [
    // codeMeta sets data-nolines before lineNumbers decides whether to skip.
    transformerCodeMeta({ style: "v2", hideDot: false }),
    transformerLineNumbers(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
    transformerNotationDiff({ matchAlgorithm: "v3" }),
  ];
}
