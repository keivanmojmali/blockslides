import { core, fullDocument, row, column } from "../../contexts/v1";

export const addTwoColumns = [
  core,
  fullDocument,
  row,
  column,
  `
Return a full document where the first slide contains a row with layout "1-1" and two columns with simple text paragraphs.
`.trim(),
].join("\n\n");


