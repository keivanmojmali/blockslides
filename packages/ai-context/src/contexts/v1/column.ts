export const column = `
<column>
Node: column (block group)
Attrs (inherits from BaseBlockAttributes):
- align (optional): "left" | "center" | "right" | "stretch" - horizontal alignment
- justify (optional): "start" | "center" | "end" | "space-between" - vertical distribution of children
- padding (optional): "none" | "sm" | "md" | "lg" - internal spacing (semantic tokens)
- margin (optional): "none" | "sm" | "md" | "lg" - external spacing
- gap (optional): "none" | "sm" | "md" | "lg" - space between child blocks
- backgroundColor (optional): string - CSS color
- backgroundImage (optional): string - background image URL
- borderRadius (optional): "none" | "sm" | "md" | "lg" - corner rounding
- border (optional): string - CSS border value
- fill (optional): boolean - whether to fill available space
- width (optional): string - explicit width (CSS value)
- height (optional): string - explicit height (CSS value)

Content:
- Contains one or more blocks (heading, paragraph, imageBlock, bulletList, etc.)
- Columns cannot nest other columns

Spacing tokens:
- none: 0
- sm: 8px
- md: 16px
- lg: 32px

Border radius tokens:
- none: 0
- sm: 4px
- md: 8px
- lg: 16px

Notes:
- Use column directly in slide for full-width content
- Wrap columns in columnGroup to place them side-by-side
- Use justify to control vertical distribution of child blocks
- Use gap for spacing between children instead of margins
</column>
`.trim();


