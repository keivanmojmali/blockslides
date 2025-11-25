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
- slide contains one or more rows.

Notes:
- Flyers are slides sized for paper (e.g., size: "a4-portrait").
- Set size to control canvas dimensions; theme applies the exact width/height.
- For background images, prefer backgroundMode/backgroundImage over Tailwind bg-[url(...)]; the extension will inject the correct CSS.
</slide>
`.trim();


