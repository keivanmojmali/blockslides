import * as ctx from "../../contexts/v1";

/**
 * All v1 context atoms concatenated into a single string.
 *
 * Intended for:
 * - LLMs that should know about every supported node type and layout primitive
 * - Power users who want a “maximal” context (structure + nodes + editing rules + sizing)
 */
export const allContexts = [
  ctx.core,
  ctx.fullDocument,
  ctx.slide,
  ctx.row,
  ctx.column,
  ctx.style,
  ctx.sizing,
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
  ctx.editingRules,
].join("\n\n");



