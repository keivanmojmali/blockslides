export const heading = `
<heading>
Node: heading
Attrs:
- level (required): 1 | 2 | 3 | 4 | 5 | 6.

Content:
- Inline content (text, marks, inline nodes).

Semantics:
- Renders as <h1>…<h6> depending on level.
- Use level 1–2 for main slide titles, 3–4 for section headings, 5–6 for subtle labels.
- Do not invent other attrs; typography/styling should come from className on columns/slides.
</heading>
`.trim();


