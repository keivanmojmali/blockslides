export const columnGroup = `
<columnGroup>
Node: columnGroup (horizontal container)
Purpose: Groups multiple columns side-by-side horizontally

Attrs:
- layout (optional): string - Layout ratio for columns (e.g., "1-1" for equal width, "2-1" for 2:1 ratio, "1-2-1" for three columns)
- fill (optional): boolean - Whether the columnGroup fills available vertical space
- className (optional): string - CSS classes
- backgroundMode (optional): "none" | "color" | "image" | "imageOverlay"
- backgroundColor (optional): string - CSS color for background
- backgroundImage (optional): string - URL for background image
- backgroundOverlayColor (optional): string - Color for overlay when using imageOverlay
- backgroundOverlayOpacity (optional): number (0-1) - Opacity for overlay

Content:
- Contains one or more column nodes
- Columns within a columnGroup are displayed side-by-side horizontally
- Each column shares the horizontal space (equal width by default, or based on layout attribute)

Usage:
- Use columnGroup when you want columns to appear next to each other horizontally
- For full-width content, use column directly in the slide (without columnGroup)
- You can have multiple columnGroups in a slide to create different rows of columns

Examples:
1. Two equal columns side-by-side:
   columnGroup { content: [column, column] }

2. Three columns with 2:1:1 ratio:
   columnGroup { attrs: { layout: "2-1-1" }, content: [column, column, column] }

3. Full-width content above and below a two-column section:
   slide {
     content: [
       column { ... },              // full-width
       columnGroup {                // side-by-side
         content: [column, column]
       },
       column { ... }               // full-width
     ]
   }
</columnGroup>
`.trim();
