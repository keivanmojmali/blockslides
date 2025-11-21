export const imageBlock = `
Node: imageBlock
Attrs:
- src (required): string (URL)
- alt (optional): string
- caption (optional): string
- credit (optional): string
- layout (optional): "cover" | "contain" | "fill" | "focus" | "pattern"
- align (optional): "left" | "center" | "right" | "stretch" (default "center")
- width (optional): number (px) or string ("%"/"px")
- height (optional): number (px) or string ("%"/"px")
- fullBleed (optional): boolean (removes radius; stretches width)
- assetId (optional): string
- focalX, focalY (optional): 0–100; spotlight position (when relevant)

Behavior:
- Numbers for width/height are interpreted as pixels.
- layout:
  - cover: Fill container; crop edges as needed.
  - contain: Fit entirely; may letterbox.
  - fill: Stretch to container (may distort).
  - focus: Cover + radial spotlight at focalX/focalY.
  - pattern: Hide <img>; use tiled background (from src).
- Do not set unknown attributes. Preserve existing valid attrs.
`.trim();


