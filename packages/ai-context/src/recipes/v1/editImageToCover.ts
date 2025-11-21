import { core, fullDocument, imageBlock, editingRules } from "../../contexts/v1";

export const editImageToCover = [
  core,
  fullDocument,
  imageBlock,
  editingRules,
  `
Update an existing imageBlock on the first slide so it uses layout "cover" and align "center". Preserve all other attributes.
`.trim(),
].join("\n\n");


