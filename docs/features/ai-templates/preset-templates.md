# Preset Templates

Preset templates are pre-built slide layouts provided by the `@blockslides/ai-context` package. They offer ready-made slide structures for common presentation patterns like two-column layouts, title slides, image galleries, and accent cards. Each template generates a complete slide JSON structure with configured columns, content blocks, and styling attributes.

## Installation

```bash
pnpm add @blockslides/ai-context
# or
npm install @blockslides/ai-context
```

## Using Preset Templates

Import the preset template functions from the templates module:

```ts
import { templatesV1 } from '@blockslides/ai-context'

// List all available templates
const templates = templatesV1.listPresetTemplates()

// Build a specific template
const slide = templatesV1.buildPresetTemplate('tpl.titleAndSubheader')
```

### Available preset keys

**Basic layouts:**
- `tpl.titleAndSubheader` - Centered title and subtitle
- `tpl.titleWithBullets` - Header with bullet list
- `tpl.fullImage` - Edge-to-edge image

**Two-column layouts:**
- `tpl.imageAndText` - Image left, text right
- `tpl.textAndImage` - Text left, image right
- `tpl.twoColumns` - Two balanced text columns
- `tpl.twoColumnsWithHeader` - Header with two columns below
- `tpl.twoImageColumns` - Header with two image cards
- `tpl.titleBulletsAndImage` - Bullets left, image right

**Multi-column layouts:**
- `tpl.threeColumns` - Three equal text columns
- `tpl.threeColumnsWithHeader` - Header with three columns
- `tpl.fourColumns` - Four equal text columns
- `tpl.fourColumnsWithHeader` - Header with four columns

**Accent layouts:**
- `tpl.accentLeft` - Full-height accent band left, text right
- `tpl.accentRight` - Full-height accent band right, text left
- `tpl.accentTop` - Full-width accent band top, text below
- `tpl.accentLeftFit` - Compact image card left, text right
- `tpl.accentRightFit` - Compact image card right, text left

## Template Metadata

Each template includes metadata describing its purpose and appearance:

```ts
const templates = templatesV1.listPresetTemplates()

templates.forEach(template => {
  console.log(template.key)          // Unique identifier
  console.log(template.label)        // Display name
  console.log(template.description)  // Description
  console.log(template.icon)         // SVG icon (optional)
})
```

## Building Templates

### Basic usage

```ts
import { templatesV1 } from '@blockslides/ai-context'

// Build a single template
const titleSlide = templatesV1.buildPresetTemplate('tpl.titleAndSubheader')

// Create a document with multiple templates
const doc = {
  type: 'doc',
  content: [
    templatesV1.buildPresetTemplate('tpl.titleAndSubheader'),
    templatesV1.buildPresetTemplate('tpl.twoColumns'),
    templatesV1.buildPresetTemplate('tpl.fullImage')
  ]
}
```

### Template structure

Each template returns a slide JSON object with the `slide` type and content blocks:

```ts
{
  type: 'slide',
  attrs: {
    id: 'slide-1',
    size: '16x9',
    className: ''
  },
  content: [
    // Column or columnGroup blocks
  ]
}
```

## Common Template Patterns

### Title slides

Templates designed for presentation covers and section dividers:

```ts
// Centered title and subtitle
const coverSlide = templatesV1.buildPresetTemplate('tpl.titleAndSubheader')
// Creates a centered column with heading and paragraph
```

### Two-column layouts

Balanced layouts for pairing content:

```ts
// Image with explanatory text
const imageTextSlide = templatesV1.buildPresetTemplate('tpl.imageAndText')

// Text with supporting image
const textImageSlide = templatesV1.buildPresetTemplate('tpl.textAndImage')

// Two text columns
const columnsSlide = templatesV1.buildPresetTemplate('tpl.twoColumns')
```

These templates use `columnGroup` with two columns arranged side-by-side.

### Multi-column grids

Templates for feature comparisons, lists, or data:

```ts
// Three equal columns
const threeColSlide = templatesV1.buildPresetTemplate('tpl.threeColumns')

// Four columns with header
const fourColSlide = templatesV1.buildPresetTemplate('tpl.fourColumnsWithHeader')
```

Multi-column templates distribute space equally across columns using `fill: true` on each column.

### Accent layouts

Templates with colored accent bands or image cards:

```ts
// Full-height accent with centered image
const accentSlide = templatesV1.buildPresetTemplate('tpl.accentLeft')
// Creates two columns: one with backgroundColor and fill, one with text

// Compact image card accent
const cardSlide = templatesV1.buildPresetTemplate('tpl.accentLeftFit')
// Creates a nested column structure for a card-like appearance
```

Accent templates use `backgroundColor` and `borderRadius` attributes for visual styling.

## Template Attributes

### Slide attributes

All templates generate slides with these default attributes:

```ts
{
  id: 'slide-1',      // Default ID
  size: '16x9',       // Aspect ratio
  className: ''       // Empty by default
}
```

### Column attributes

Templates use various column attributes from the BlockAttributes extension:

**Layout:**
- `align` - Horizontal alignment: `'left' | 'center' | 'right' | 'stretch'`
- `justify` - Vertical distribution: `'start' | 'center' | 'end' | 'space-between'`
- `fill` - Expand to fill available space: `boolean`

**Spacing:**
- `padding` - Internal spacing: `'none' | 'sm' | 'md' | 'lg'` (8px/16px/32px)
- `gap` - Space between children: `'none' | 'sm' | 'md' | 'lg'`
- `margin` - External spacing: `'none' | 'sm' | 'md' | 'lg'`

**Styling:**
- `backgroundColor` - Background color: CSS color string
- `borderRadius` - Corner rounding: `'none' | 'sm' | 'md' | 'lg'` (4px/8px/16px)
- `width` - Explicit width: CSS value
- `height` - Explicit height: CSS value

### Image block attributes

Templates that include images use these attributes:

```ts
{
  src: 'https://placehold.co/640x480/png',  // Image URL
  size: 'fit',                               // 'fill' | 'fit' | 'natural'
  crop: 'center'                             // Focal point (fill mode only)
}
```

**Size modes:**
- `fill` - Cover entire container (cropped to fit)
- `fit` - Fit inside container (letterboxed if needed)
- `natural` - Use image's natural dimensions

## Working with Templates Programmatically

### Listing templates

Get all available templates with their metadata:

```ts
import { templatesV1 } from '@blockslides/ai-context'

const allTemplates = templatesV1.listPresetTemplates()

// Filter by pattern
const accentTemplates = allTemplates.filter(t => 
  t.key.includes('accent')
)

// Group by type
const columnTemplates = allTemplates.filter(t =>
  t.key.includes('Columns')
)
```

### Building template selectors

Create UI for template selection:

```ts
const templates = templatesV1.listPresetTemplates()

// Build a template picker
templates.forEach(template => {
  const button = document.createElement('button')
  button.textContent = template.label
  button.title = template.description
  
  button.onclick = () => {
    const slide = templatesV1.buildPresetTemplate(template.key)
    // Insert slide into document
  }
})
```

### Modifying template output

Templates return standard JSON that you can modify:

```ts
const slide = templatesV1.buildPresetTemplate('tpl.titleAndSubheader')

// Change slide size
slide.attrs.size = '4x3'

// Modify column attributes
const column = slide.content[0]
column.attrs.backgroundColor = '#1e293b'

// Update content
column.content[0].content[0].text = 'Custom Title'
```

### Combining templates with schema builders

Use templates alongside the schema builders from the same package:

```ts
import { templatesV1 } from '@blockslides/ai-context'

// Start with a preset
const slide = templatesV1.buildPresetTemplate('tpl.twoColumns')

// The schema builders (blocks, slide helpers) are also available
// but templates are pre-built structures you can use directly
```

## Integration with AI Context

Preset templates are part of the `@blockslides/ai-context` package, which provides context strings, schemas, and builders for AI-assisted slide generation. While the templates themselves are JavaScript functions that return JSON, they're designed to work alongside the AI context system.

The templates demonstrate valid slide structures that match the schemas and contexts provided to LLMs:

```ts
import { templatesV1, bundlesV1 } from '@blockslides/ai-context'

// Templates show valid JSON structures
const exampleSlide = templatesV1.buildPresetTemplate('tpl.twoColumns')

// Context strings teach LLMs the same patterns
const aiContext = bundlesV1.minimalCreate
```

Templates use the same attribute names, layout patterns, and block structures described in the AI contexts, making them useful for both direct generation and as examples for LLM guidance.
