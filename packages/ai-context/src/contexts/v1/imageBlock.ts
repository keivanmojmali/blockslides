export const imageBlock = `
<imageBlock>
Node: imageBlock (block group)
Attrs (required):
- src (required): string (image URL)

Attrs (optional - image-specific):
- alt (optional): string - alt text for accessibility
- caption (optional): string - image caption
- credit (optional): string - image credit/attribution
- assetId (optional): string - asset reference
- size (optional): "fill" | "fit" | "natural" - how image fills container
  - fill: Cover entire container (width:100%, height:100%, object-fit:cover)
  - fit: Fit inside container with letterboxing (object-fit:contain)
  - natural: Use image's natural dimensions
- crop (optional): "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
  - Focal point for fill/fit modes (default: "center")

Attrs (inherited from BaseBlockAttributes):
- align (optional): "left" | "center" | "right" | "stretch" - block alignment
- padding (optional): "none" | "sm" | "md" | "lg" - internal padding
- margin (optional): "none" | "sm" | "md" | "lg" - external margin
- backgroundColor (optional): string - background color
- borderRadius (optional): "none" | "sm" | "md" | "lg" - corner rounding
- width (optional): string - explicit width override (CSS value)
- height (optional): string - explicit height override (CSS value)

Deprecated attributes (kept for backwards compatibility, do not use):
- layout, fullBleed, focalX, focalY

Notes:
- Default size is "fill" if not specified
- Use crop to control which part of the image is visible when cropped
- width/height overrides apply on top of size mode
</imageBlock>
`.trim();


