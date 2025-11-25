export const column = `
<column>
Node: column
Attrs:
- className (optional): string
- contentMode (optional): "default" (future-friendly)
- verticalAlign (optional): "top" | "center" | "bottom" (default "top")
- horizontalAlign (optional): "left" | "center" | "right" | "stretch" (default "left")
- padding (optional): "none" (future-friendly)
- backgroundMode (optional): "none" | "color" | "image" | "imageOverlay"
- backgroundColor (optional): string (CSS color for the column background)
- backgroundImage (optional): string (URL for column-level background image)
- backgroundOverlayColor (optional): string (overlay color when using imageOverlay)
- backgroundOverlayOpacity (optional): number (0–1, overlay opacity)

Notes:
- Use className for spacing, colors, typography (e.g., Tailwind).
- Keep nesting shallow; columns can contain rows or blocks as needed.
</column>
`.trim();


