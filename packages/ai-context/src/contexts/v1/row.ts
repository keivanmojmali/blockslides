export const row = `
<row>
Node: row
Attrs:
- layout (optional): "", "1", "1-1", "2-1", "1-2", "1-1-1", "2-1-1", "1-2-1", "1-1-2", "1-1-1-1"
- className (optional): string (CSS classes)
- backgroundMode (optional): "none" | "color" | "image" | "imageOverlay"
- backgroundColor (optional): string (CSS color for row background)
- backgroundImage (optional): string (URL for row-level background image)
- backgroundOverlayColor (optional): string (overlay color when using imageOverlay)
- backgroundOverlayOpacity (optional): number (0–1, overlay opacity)

Semantics:
- Fractions determine relative column flex:
  - 1-1: two equal columns
  - 2-1: first column is double width
  - 1-2: second column is double width
  - 1-1-1: three equal columns
  - 1-1-1-1: four equal columns
- Empty layout ("", "1") acts as a single full-width column.
- Use row backgrounds for horizontal bands (e.g., header strip) instead of attaching everything to the slide.
</row>
`.trim();


