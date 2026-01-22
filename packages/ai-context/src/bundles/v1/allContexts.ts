import * as ctx from "../../contexts/v1";

/**
 * All v1 context atoms concatenated into a single string,
 * wrapped in a top-level <Context>…</Context> block.
 */
export const allContexts = `
<Context>
${[
  ctx.core,
  ctx.fullDocument,
  ctx.slide,
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
].join("\n\n")}
</Context>
`.trim();



