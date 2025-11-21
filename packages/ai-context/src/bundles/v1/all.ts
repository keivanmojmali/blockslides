import * as ctx from "../../contexts/v1";

export const all = [
  ctx.core,
  ctx.fullDocument,
  ctx.slide,
  ctx.row,
  ctx.column,
  ctx.style,
  ctx.sizing,
   // Core content blocks and media
  ctx.imageBlock,
  ctx.blockquote,
  ctx.bulletList,
  ctx.heading,
  ctx.paragraph,
  ctx.image,
  ctx.codeBlock,
  ctx.hardBreak,
  ctx.horizontalRule,
  ctx.youtube,
  // Editing behavior
  ctx.editingRules,
].join("\n\n");


