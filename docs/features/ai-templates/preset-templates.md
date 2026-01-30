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

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="22" width="60" height="12" rx="2" fill="#D4D4D8"/><rect x="26" y="38" width="44" height="8" rx="2" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.titleAndSubheader</code><br>
    <span style="color: #666; font-size: 0.9em;">Centered title and subtitle</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="20" width="60" height="6" rx="1.5" fill="#D4D4D8"/><circle cx="22" cy="32" r="2" fill="#D4D4D8"/><rect x="28" y="30" width="44" height="4" rx="1" fill="#E5E7EB"/><circle cx="22" cy="39" r="2" fill="#D4D4D8"/><rect x="28" y="37" width="44" height="4" rx="1" fill="#E5E7EB"/><circle cx="22" cy="46" r="2" fill="#D4D4D8"/><rect x="28" y="44" width="36" height="4" rx="1" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.titleWithBullets</code><br>
    <span style="color: #666; font-size: 0.9em;">Header with bullet list</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="14" y="14" width="68" height="44" rx="3" fill="#E5E7EB"/><path d="M18 50 34 32l12 14 8-10 16 14H18Z" fill="#D4D4D8"/><circle cx="32" cy="26" r="4" fill="#D4D4D8"/></svg>
  <div>
    <code>tpl.fullImage</code><br>
    <span style="color: #666; font-size: 0.9em;">Edge-to-edge image</span>
  </div>
</div>

**Two-column layouts:**

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="26" width="24" height="16" rx="2" fill="#E5E7EB"/><rect x="21" y="31" width="14" height="6" rx="1" fill="#D4D4D8"/><rect x="46" y="24" width="34" height="6" rx="1.5" fill="#D4D4D8"/><rect x="46" y="33" width="34" height="5" rx="1.5" fill="#E5E7EB"/><rect x="46" y="41" width="28" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.imageAndText</code><br>
    <span style="color: #666; font-size: 0.9em;">Image left, text right</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="24" width="34" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="33" width="34" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="41" width="28" height="5" rx="1.5" fill="#E5E7EB"/><rect x="56" y="26" width="24" height="16" rx="2" fill="#E5E7EB"/><rect x="61" y="31" width="14" height="6" rx="1" fill="#D4D4D8"/></svg>
  <div>
    <code>tpl.textAndImage</code><br>
    <span style="color: #666; font-size: 0.9em;">Text left, image right</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="22" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="31" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="39" width="22" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="22" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="31" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="39" width="22" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.twoColumns</code><br>
    <span style="color: #666; font-size: 0.9em;">Two balanced text columns</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="18" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="28" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="37" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="45" width="22" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="28" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="37" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="45" width="22" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.twoColumnsWithHeader</code><br>
    <span style="color: #666; font-size: 0.9em;">Header with two columns below</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="18" width="64" height="6" rx="1.5" fill="#D4D4D8"/><rect x="16" y="28" width="28" height="14" rx="2" fill="#E5E7EB"/><rect x="52" y="28" width="28" height="14" rx="2" fill="#E5E7EB"/><rect x="16" y="46" width="20" height="4" rx="1" fill="#D4D4D8"/><rect x="52" y="46" width="20" height="4" rx="1" fill="#D4D4D8"/></svg>
  <div>
    <code>tpl.twoImageColumns</code><br>
    <span style="color: #666; font-size: 0.9em;">Header with two image cards</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="18" width="64" height="6" rx="1.5" fill="#D4D4D8"/><circle cx="20" cy="31" r="2" fill="#D4D4D8"/><rect x="26" y="29" width="24" height="4" rx="1" fill="#E5E7EB"/><circle cx="20" cy="38" r="2" fill="#D4D4D8"/><rect x="26" y="36" width="24" height="4" rx="1" fill="#E5E7EB"/><circle cx="20" cy="45" r="2" fill="#D4D4D8"/><rect x="26" y="43" width="20" height="4" rx="1" fill="#E5E7EB"/><rect x="56" y="31" width="24" height="16" rx="2" fill="#E5E7EB"/><rect x="61" y="36" width="14" height="6" rx="1" fill="#D4D4D8"/></svg>
  <div>
    <code>tpl.titleBulletsAndImage</code><br>
    <span style="color: #666; font-size: 0.9em;">Bullets left, image right</span>
  </div>
</div>

**Multi-column layouts:**

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="14" y="22" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="31" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="14" y="39" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="22" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="38" y="31" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="39" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="22" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="62" y="31" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="39" width="18" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.threeColumns</code><br>
    <span style="color: #666; font-size: 0.9em;">Three equal text columns</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="16" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="28" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="37" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="14" y="45" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="28" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="38" y="37" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="45" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="28" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="62" y="37" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="45" width="18" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.threeColumnsWithHeader</code><br>
    <span style="color: #666; font-size: 0.9em;">Header with three columns</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="12" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="12" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="12" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="32" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="72" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.fourColumns</code><br>
    <span style="color: #666; font-size: 0.9em;">Four equal text columns</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="16" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="12" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="12" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="12" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="32" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="72" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.fourColumnsWithHeader</code><br>
    <span style="color: #666; font-size: 0.9em;">Header with four columns</span>
  </div>
</div>

**Accent layouts:**

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="12" y="18" width="20" height="36" rx="2" fill="#EFEFEF"/><rect x="18" y="30" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="36" y="26" width="42" height="6" rx="1.5" fill="#D4D4D8"/><rect x="36" y="36" width="38" height="5" rx="1.5" fill="#E5E7EB"/><rect x="36" y="44" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.accentLeft</code><br>
    <span style="color: #666; font-size: 0.9em;">Full-height accent band left, text right</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="64" y="18" width="20" height="36" rx="2" fill="#EFEFEF"/><rect x="70" y="30" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="16" y="26" width="42" height="6" rx="1.5" fill="#D4D4D8"/><rect x="16" y="36" width="38" height="5" rx="1.5" fill="#E5E7EB"/><rect x="16" y="44" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.accentRight</code><br>
    <span style="color: #666; font-size: 0.9em;">Full-height accent band right, text left</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="14" y="14" width="68" height="16" rx="2" fill="#EFEFEF"/><rect x="44" y="18" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="18" y="36" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="46" width="56" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="54" width="48" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.accentTop</code><br>
    <span style="color: #666; font-size: 0.9em;">Full-width accent band top, text below</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="24" width="16" height="20" rx="2" fill="#E5E7EB"/><rect x="20" y="28" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="36" y="28" width="44" height="6" rx="1.5" fill="#D4D4D8"/><rect x="36" y="38" width="40" height="5" rx="1.5" fill="#E5E7EB"/><rect x="36" y="46" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.accentLeftFit</code><br>
    <span style="color: #666; font-size: 0.9em;">Compact image card left, text right</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 12px; margin: 12px 0;">
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="64" y="24" width="16" height="20" rx="2" fill="#E5E7EB"/><rect x="68" y="28" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="14" y="28" width="44" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="38" width="40" height="5" rx="1.5" fill="#E5E7EB"/><rect x="14" y="46" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>
  <div>
    <code>tpl.accentRightFit</code><br>
    <span style="color: #666; font-size: 0.9em;">Compact image card right, text left</span>
  </div>
</div>

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
