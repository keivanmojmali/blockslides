export const editingRules = `
<General editing rules>
- Preserve existing ids and valid attributes. Do not remove or rename known attrs.
- Use only allowed enum values. Do not invent new enum values.
- Avoid introducing new attributes that are not documented. If styling is needed, prefer className.
- Keep the document valid: slide > row > column > blocks.
</General editing rules>

<Centering content in a column>
- Columns are flex containers. Use their alignment attrs instead of per-block hacks.
- To center all content vertically and horizontally inside a column:
  - Set column.attrs.verticalAlign = "center".
  - Set column.attrs.horizontalAlign = "center".
- This will apply to headings, paragraphs, imageBlocks, and other blocks inside that column.
- Example:
  - Before: column.attrs = { verticalAlign: "top", horizontalAlign: "left", padding: "none" }
  - After:  column.attrs = { verticalAlign: "center", horizontalAlign: "center", padding: "none" }
</Centering content in a column>

<Backgrounds (slides, rows, columns)>
- Prefer structured background attrs over raw Tailwind bg-[url(...)] when setting background images.
- For slide-level backgrounds (hero/flyer):
  - Use slide.attrs.backgroundMode = "color" | "image" | "imageOverlay".
  - For images, set slide.attrs.backgroundImage to the image URL.
  - For overlays, set slide.attrs.backgroundOverlayColor (e.g., "rgba(0,0,0,0.8)") and slide.attrs.backgroundOverlayOpacity (0–1).
- For horizontal bands, use row-level backgrounds (row.attrs.background*).
- For panel-style sections, use column-level backgrounds (column.attrs.background*).
- Do not mix multiple background images on the same node; prefer one backgroundMode per slide/row/column and layer additional visuals as imageBlock nodes.
</Backgrounds (slides, rows, columns)>

<Text editing (headings and paragraphs)>
- Preserve semantic types: do not turn headings into paragraphs or vice versa unless explicitly asked.
- To change heading level, update heading.attrs.level (1–6) without changing its id.
- To change the text, edit the text nodes inside content, keeping marks and structure when possible.
- For alignment of text itself, prefer using the textAlign extension (textAlign: "left" | "center" | "right" | "justify") if configured.
- Do not introduce inline HTML; represent formatting via marks (bold, italic, underline, etc.).
</Text editing (headings and paragraphs)>

<Image blocks>
- Use imageBlock for rich images; preserve src, assetId, and metadata unless the user explicitly asks to change them.
- To change the alignment of an imageBlock within its column, set imageBlock.attrs.align to "left", "center", "right", or "stretch".
- To change how the image is fit, adjust imageBlock.attrs.layout (for example: "cover", "contain", "fill", "focus", or a configured layout key).
- When centering both text and image in a column, combine:
  - column verticalAlign/horizontalAlign for layout, and
  - imageBlock align for how the image itself sits in the column.
- Do not invent new layout or align values that are not documented in the schema.
</Image blocks>

`.trim();


