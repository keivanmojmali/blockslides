export const slide = `
<slide>
Node: slide
Attrs:
- id (optional): string (stable identifier; preserve if present)
- className (optional): string (styling)
- size (optional): "16x9" | "4x3" | "a4-portrait" | "a4-landscape" | "letter-portrait" | "letter-landscape" | "linkedin-banner"
- backgroundMode (optional): "none" | "color" | "image" | "imageOverlay"
- backgroundColor (optional): string (CSS color for solid backgrounds)
- backgroundImage (optional): string (URL for slide-level background image)
- backgroundOverlayColor (optional): string (color for the overlay when using imageOverlay)
- backgroundOverlayOpacity (optional): number (0–1, opacity for the overlay)

Content:
- slide can contain columns, columnGroups, or any block-level content (heading, paragraph, imageBlock, bulletList, codeBlock, etc.)
- Use column directly for full-width content
- Use columnGroup to place multiple columns side-by-side
- You can mix columns, columnGroups, and other blocks in any order

Notes:
- Flyers are slides sized for paper (e.g., size: "a4-portrait").
- Set size to control canvas dimensions; theme applies the exact width/height.
- For background images, prefer backgroundMode/backgroundImage over Tailwind bg-[url(...)]; the extension will inject the correct CSS.
- To create multi-column layouts, wrap columns in a columnGroup
</slide>
`.trim();


