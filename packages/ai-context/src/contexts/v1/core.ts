export const core = `
You are given a BlockSlides document to CREATE or EDIT.

Document shape:
- doc: { type: "doc", content: slide[] }
- slide: { type: "slide", attrs?, content: row[] }
- row: { type: "row", attrs?, content: column[] | block[] }
- column: { type: "column", attrs?, content: (block | row)[] }
- block: includes nodes like paragraph, heading, imageBlock, etc.

Rules:
- Use only known node types and valid attrs. Do not invent attributes.
- Prefer stable references: preserve slide.attrs.id if present.
- Slides and flyers share the same JSON; flyers are slides sized via attrs and theme.
`.trim();


