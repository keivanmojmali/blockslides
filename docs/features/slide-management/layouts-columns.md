# Layouts & Columns

Blockslides uses a flexible **column-based layout system** to structure content within slides. Columns are the primary layout containers that hold blocks, and they can be arranged side-by-side using column groups to create multi-column layouts.

::: tip Column vs ColumnGroup
Use **Column** for full-width content sections or as containers within column groups. Use **ColumnGroup** to place multiple columns horizontally side-by-side with precise width ratios.
:::

## Installation

Column and ColumnGroup extensions are included in the ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

If you're building a custom extension setup, you can import them individually:

```ts
import { Column } from '@blockslides/extension-column'
import { ColumnGroup } from '@blockslides/extension-column-group'
import { BlockAttributes } from '@blockslides/extension-block-attributes'

const editor = useSlideEditor({
  extensions: [
    // BlockAttributes provides common attributes to columns
    BlockAttributes.configure({
      types: ['column', 'heading', 'paragraph', 'imageBlock']
    }),
    Column,
    ColumnGroup
  ]
})
```

### Disabling columns

You can disable column extensions by setting them to `false`:

```ts
ExtensionKit.configure({
  column: false,
  columnGroup: false
})
```

## Columns

Columns are versatile container blocks that hold other blocks like paragraphs, headings, images, and lists. They provide the foundation for both simple full-width layouts and complex multi-column arrangements.

### How columns work

Columns can be used in two ways:

1. **Standalone columns** - Direct children of slides, spanning the full width
2. **Grouped columns** - Children of a columnGroup, placed side-by-side horizontally

```ts
// Full-width layout
// Will stack vertically
{
  type: 'slide',
  content: [
    { type: 'column', content: [...] },  // Full width
    { type: 'column', content: [...] }   // Full width
  ]
}

// Multi-column layout
// Will be side by side
{
  type: 'slide',
  content: [
    {
      type: 'columnGroup',
      content: [
        { type: 'column', content: [...] },  // Left column
        { type: 'column', content: [...] }   // Right column
      ]
    }
  ]
}
```

### Column attributes

Columns inherit attributes from the BlockAttributes extension, providing extensive styling and layout control:

#### Alignment

Control horizontal alignment and self-alignment within flex containers:

```ts
// Align left
editor.commands.setBlockAlign('left')

// Center align (default for most content)
editor.commands.setBlockAlign('center')

// Align right
editor.commands.setBlockAlign('right')

// Stretch to fill width
editor.commands.setBlockAlign('stretch')
```

**Values:**
- **left** - Aligns content to the left edge
- **center** - Centers content horizontally
- **right** - Aligns content to the right edge
- **stretch** - Stretches to fill available width

#### Vertical distribution (justify)

Control how child blocks are distributed vertically within a column:

```ts
// Align children to top
editor.commands.updateAttributes('column', {
  justify: 'start'
})

// Center children vertically
editor.commands.updateAttributes('column', {
  justify: 'center'
})

// Align children to bottom
editor.commands.updateAttributes('column', {
  justify: 'end'
})

// Distribute with space between
editor.commands.updateAttributes('column', {
  justify: 'space-between'
})
```

**Values:**
- **start** - Children align to the top
- **center** - Children center vertically
- **end** - Children align to the bottom
- **space-between** - Maximum space between children, first and last children touch edges

#### Spacing

Control internal spacing (padding), external spacing (margin), and spacing between child blocks (gap):

```ts
// Set padding using semantic tokens
editor.commands.setBlockPadding('lg')

// Set padding using custom CSS values
editor.commands.setBlockPadding('2rem')

// Set gap between child blocks
editor.commands.setBlockGap('md')

// Set external margin
editor.commands.setBlockMargin('sm')
```

**Spacing tokens:**
- **none** - 0
- **sm** - 8px
- **md** - 16px
- **lg** - 32px

You can also use any CSS value like `"1.5rem"`, `"24px"`, or `"10%"`.

```ts
// Example: Column with padding and gap for card-like appearance
editor.commands.updateAttributes('column', {
  padding: 'lg',
  gap: 'md',
  borderRadius: 'md',
  backgroundColor: '#f8f9fa'
})
```

#### Background styling

Add background colors and images to columns:

```ts
// Solid background color
editor.commands.setBlockBackgroundColor('#3b82f6')

// Background image
editor.commands.setBlockBackgroundImage('https://example.com/bg.jpg')

// Remove background
editor.commands.setBlockBackgroundColor(null)
```

```ts
// Example: Hero column with background image
editor.commands.updateAttributes('column', {
  backgroundImage: 'https://example.com/hero-bg.jpg',
  padding: 'lg',
  justify: 'center',
  align: 'center'
})
```

#### Border styling

Control corner rounding and borders:

```ts
// Border radius using tokens
editor.commands.setBlockBorderRadius('md')

// Custom border radius
editor.commands.setBlockBorderRadius('20px')

// Custom border
editor.commands.updateAttributes('column', {
  border: '2px solid #e5e7eb'
})
```

**Border radius tokens:**
- **none** - 0
- **sm** - 4px
- **md** - 8px
- **lg** - 16px

#### Sizing

Control column dimensions and flex behavior:

```ts
// Make column fill available vertical space
editor.commands.setBlockFill(true)

// Set explicit width
editor.commands.setBlockWidth('400px')

// Set explicit height
editor.commands.setBlockHeight('500px')

// Remove dimension constraints
editor.commands.setBlockWidth(null)
editor.commands.setBlockHeight(null)
```

The `fill` attribute makes columns expand to fill available space using `flex: 1 1 auto`. This is useful for creating columns that take up remaining vertical space in a slide.

```ts
// Example: Fixed-width sidebar column
editor.commands.updateAttributes('column', {
  width: '250px',
  fill: false
})
```

### Configuration options

Customize the Column extension:

```ts
Column.configure({
  // Add custom HTML attributes
  HTMLAttributes: {
    class: 'custom-column'
  },
  
  // Control CSS injection
  injectCSS: true,
  
  // Add CSP nonce for injected styles
  injectNonce: 'your-nonce-value'
})
```

## Column Groups

Column groups arrange multiple columns horizontally side-by-side with precise control over their relative widths. They support predefined layout ratios and offer additional styling options like backgrounds and overlays.

### Layout ratios

Column groups use layout strings to define the relative width of each column. The numbers represent flex ratios that determine how horizontal space is distributed.

#### Predefined layouts

**Single column:**
- **`"1"`** - One column (equivalent to a standalone column)

**Two columns:**
- **`"1-1"`** - Equal width columns (50% / 50%)
- **`"2-1"`** - Left column twice as wide (66.67% / 33.33%)
- **`"1-2"`** - Right column twice as wide (33.33% / 66.67%)

**Three columns:**
- **`"1-1-1"`** - Three equal columns (33.33% each)
- **`"2-1-1"`** - Large left, two smaller (50% / 25% / 25%)
- **`"1-2-1"`** - Large center (25% / 50% / 25%)
- **`"1-1-2"`** - Large right (25% / 25% / 50%)

**Four columns:**
- **`"1-1-1-1"`** - Four equal columns (25% each)

```ts
// Set layout on a columnGroup
editor.commands.updateAttributes('columnGroup', {
  layout: '2-1'
})
```

#### How layout ratios work

Layout ratios use flex values to distribute space proportionally:

- `"1-1"` → Each column gets `flex: 1`, splitting space equally
- `"2-1"` → First column gets `flex: 2`, second gets `flex: 1` (2:1 ratio)
- `"1-2-1"` → Ratios of 1:2:1 distribute space as 25% / 50% / 25%

The total ratio (sum of numbers) determines each column's percentage:
- `"2-1"` = 3 total → 2/3 and 1/3
- `"3-1"` = 4 total → 3/4 and 1/4
- `"5-3-2"` = 10 total → 50%, 30%, 20%

### Setting layouts

Update the layout attribute when your cursor is in a columnGroup:

```ts
// Two equal columns
editor.commands.updateAttributes('columnGroup', {
  layout: '1-1'
})

// 2:1 ratio for content and sidebar
editor.commands.updateAttributes('columnGroup', {
  layout: '2-1'
})

// Three equal columns for features
editor.commands.updateAttributes('columnGroup', {
  layout: '1-1-1'
})
```

### Background options

Column groups support three background modes with additional overlay capabilities:

```ts
// Solid color background
editor.commands.updateAttributes('columnGroup', {
  backgroundMode: 'color',
  backgroundColor: '#1e293b'
})

// Background image
editor.commands.updateAttributes('columnGroup', {
  backgroundMode: 'image',
  backgroundImage: 'https://example.com/pattern.jpg'
})

// Background image with color overlay
editor.commands.updateAttributes('columnGroup', {
  backgroundMode: 'imageOverlay',
  backgroundImage: 'https://example.com/photo.jpg',
  backgroundOverlayColor: '#000000',
  backgroundOverlayOpacity: 0.5
})

// No background
editor.commands.updateAttributes('columnGroup', {
  backgroundMode: 'none'
})
```

**Background modes:**
- **none** - No background (default)
- **color** - Solid color background
- **image** - Background image (cover, centered, no-repeat)
- **imageOverlay** - Background image with semi-transparent color overlay

The overlay is useful for ensuring text readability over images:

```ts
// Example: Hero section with readable text over image
editor.commands.updateAttributes('columnGroup', {
  backgroundMode: 'imageOverlay',
  backgroundImage: 'https://example.com/hero.jpg',
  backgroundOverlayColor: '#000000',
  backgroundOverlayOpacity: 0.4  // 40% black overlay
})
```

### Fill behavior

Control whether a column group expands to fill available vertical space:

```ts
// Fill remaining vertical space
editor.commands.updateAttributes('columnGroup', {
  fill: true
})

// Use natural height
editor.commands.updateAttributes('columnGroup', {
  fill: false
})
```

When `fill: true`, the column group uses `flex: 1 1 auto` to expand and take up remaining space in the slide. This is useful for creating full-height sections.

### Configuration options

Customize the ColumnGroup extension:

```ts
ColumnGroup.configure({
  // Add custom HTML attributes
  HTMLAttributes: {
    class: 'custom-column-group'
  },
  
  // Control base CSS injection
  injectCSS: true,
  
  // Control layout-specific CSS (data-layout selectors)
  enableLayoutCSS: true,
  
  // Add CSP nonce for injected styles
  injectNonce: 'your-nonce-value'
})
```

## Working with Layouts Programmatically

### Querying columns and column groups

Find and inspect layout elements in your document:

```ts
// Find all columns
const columns: any[] = []
editor.state.doc.descendants((node) => {
  if (node.type.name === 'column') {
    columns.push({
      padding: node.attrs.padding,
      align: node.attrs.align,
      backgroundColor: node.attrs.backgroundColor
    })
  }
})

console.log('Found columns:', columns)
```

```ts
// Find all column groups with their layouts
const columnGroups: any[] = []
editor.state.doc.descendants((node) => {
  if (node.type.name === 'columnGroup') {
    columnGroups.push({
      layout: node.attrs.layout,
      fill: node.attrs.fill,
      backgroundMode: node.attrs.backgroundMode
    })
  }
})

console.log('Found column groups:', columnGroups)
```

### Getting layout at cursor position

Check if the current selection is within a column or column group:

```ts
const { from } = editor.state.selection
let pos = from

// Walk up the tree to find parent column/columnGroup
editor.state.doc.nodesBetween(from, from, (node, nodePos) => {
  if (node.type.name === 'column') {
    console.log('Inside column at position:', nodePos)
    console.log('Column attributes:', node.attrs)
  }
  
  if (node.type.name === 'columnGroup') {
    console.log('Inside column group with layout:', node.attrs.layout)
  }
})
```

### Updating layouts dynamically

Programmatically update column and column group attributes:

```ts
// Find and update all columnGroups to use 2-1 layout
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'columnGroup') {
    // Select the columnGroup node
    editor.commands.setTextSelection(pos)
    
    // Update its layout
    editor.commands.updateAttributes('columnGroup', {
      layout: '2-1'
    })
  }
})
```

```ts
// Update all columns to have consistent padding
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'column') {
    editor.commands.setTextSelection(pos)
    editor.commands.setBlockPadding('md')
  }
})
```