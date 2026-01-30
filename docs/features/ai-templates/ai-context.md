# AI Context

The `@blockslides/ai-context` package provides versioned context strings, JSON schemas, and TypeScript types for instructing Large Language Models (LLMs) to generate and edit BlockSlides documents. It packages the structural rules and constraints of BlockSlides into consumable formats that can be used as system prompts or tool definitions.

::: tip Why AI Context?
When working with LLMs to generate presentations, you need to teach the model the exact JSON structure BlockSlides expects—node types, attribute constraints, layout rules, and semantic patterns. This package bundles those instructions so you don't need to maintain prompt engineering logic yourself.
:::

## Installation

```bash
npm install @blockslides/ai-context
# or
pnpm add @blockslides/ai-context
```

## Package Structure

The package exports four main categories under versioned namespaces:

```ts
import {
  contextsV1,     // Individual instruction strings for specific nodes
  bundlesV1,      // Pre-composed context bundles for common workflows
  schemasV1,      // JSON Schemas for validation
  templatesV1,    // Template builders and presets
  // TypeScript types
  SizeKey,
  SlideAttrs,
  ColumnAttrs,
  ImageBlockAttrs,
  BaseBlockAttrs
} from '@blockslides/ai-context'
```

**Contexts** are instruction strings that describe individual nodes (slide, column, imageBlock) and their attributes. **Bundles** combine multiple contexts into ready-to-use prompt content for specific use cases. **Schemas** provide JSON Schema definitions for runtime validation. **Templates** offer programmatic helpers for building slide JSON structures.

## Using Context Bundles

Bundles are pre-composed strings designed for common LLM workflows. They concatenate relevant context atoms and can be used directly as system prompts.

### Available bundles

```ts
import { bundlesV1 } from '@blockslides/ai-context'

// Minimal set for creating new presentations
const createContext = bundlesV1.minimalCreate

// Focused set for editing image blocks
const imageEditingContext = bundlesV1.imageEditing

// Full set including all node types and editing rules
const fullContext = bundlesV1.all

// All contexts wrapped in <Context> tags
const taggedContexts = bundlesV1.allContexts

// All JSON schemas wrapped in <Schemas> tags
const allSchemas = bundlesV1.allSchemas
```

### minimalCreate bundle

Best for **"create a new presentation"** workflows. Includes core document structure, slide definitions, column layouts, and styling guidance.

```ts
import { bundlesV1 } from '@blockslides/ai-context'

const systemPrompt = [
  'You are a BlockSlides presentation builder.',
  'Output only valid JSON matching the structure below.',
  '',
  bundlesV1.minimalCreate
].join('\n\n')
```

The `minimalCreate` bundle combines:
- `core` - Document hierarchy and base block attributes
- `fullDocument` - Output contract for complete JSON documents
- `slide` - Slide node structure and attributes
- `column` - Column layout attributes
- `style` - Styling guidance for className usage

### imageEditing bundle

Best for **editing existing image blocks** in presentations. Includes image-specific attributes and editing rules.

```ts
import { bundlesV1 } from '@blockslides/ai-context'

const editPrompt = [
  bundlesV1.imageEditing,
  '',
  'Current document:',
  JSON.stringify(currentDoc, null, 2),
  '',
  'Task: Set the first image to fill mode with center crop.'
].join('\n')
```

The `imageEditing` bundle combines:
- `core` - Base rules and document structure
- `fullDocument` - Output contract
- `imageBlock` - Image node attributes (src, size, crop, caption, credit)
- `editingRules` - Rules for modifying existing documents

### all bundle

Comprehensive context including all node types, editing rules, and layout patterns. Use when you need full BlockSlides functionality.

```ts
import { bundlesV1 } from '@blockslides/ai-context'

const fullPrompt = bundlesV1.all
```

The `all` bundle includes every available context: core, fullDocument, slide, column, columnGroup, style, sizing, imageBlock, blockquote, bulletList, heading, paragraph, image, codeBlock, hardBreak, horizontalRule, youtube, and editingRules.

## Composing Custom Contexts

For specialized workflows, compose contexts from individual atoms:

```ts
import { contextsV1 } from '@blockslides/ai-context'

// Custom bundle for YouTube-heavy presentations
const videoContext = [
  contextsV1.core,
  contextsV1.fullDocument,
  contextsV1.slide,
  contextsV1.column,
  contextsV1.youtube,
  contextsV1.style
].join('\n\n')
```

### Available context atoms

All contexts are available under `contextsV1`:

```ts
contextsV1.core              // Document hierarchy and base attributes
contextsV1.fullDocument      // Output contract
contextsV1.slide             // Slide node and attributes
contextsV1.column            // Column attributes
contextsV1.columnGroup       // ColumnGroup attributes
contextsV1.style             // Styling guidance
contextsV1.sizing            // Size options (16x9, 4x3, etc.)
contextsV1.imageBlock        // ImageBlock attributes
contextsV1.blockquote        // Blockquote node
contextsV1.bulletList        // BulletList node
contextsV1.heading           // Heading node
contextsV1.paragraph         // Paragraph node
contextsV1.image             // Inline image node
contextsV1.codeBlock         // CodeBlock node
contextsV1.hardBreak         // HardBreak node
contextsV1.horizontalRule    // HorizontalRule node
contextsV1.youtube           // YouTube embed node
contextsV1.editingRules      // Rules for editing existing documents
```

Each context string includes:
- Node type name
- Required and optional attributes
- Attribute types and allowed enum values
- Behavioral notes and constraints

## JSON Schema Validation

Validate LLM output against the BlockSlides structure using JSON Schemas:

```ts
import { schemasV1 } from '@blockslides/ai-context'
```

### Available schemas

```ts
schemasV1.slide
schemasV1.column
schemasV1.columnGroup
schemasV1.imageBlock
schemasV1.blockquote
schemasV1.bulletList
schemasV1.codeBlock
schemasV1.hardBreak
schemasV1.horizontalRule
schemasV1.image
schemasV1.heading
schemasV1.paragraph
schemasV1.youtube
```

### Schema structure

Each schema is a JSON Schema object that can be used with standard validation libraries. The schemas define:
- Node type constraints
- Required vs optional attributes
- Enum values for constrained fields
- Nested content structure

Use `bundlesV1.allSchemas` to get all schemas as a formatted string for LLM consumption.

## TypeScript Types

Type-safe interfaces for all BlockSlides attributes:

```ts
import {
  SizeKey,
  SlideAttrs,
  ColumnAttrs,
  ImageBlockAttrs,
  BaseBlockAttrs,
  SpacingToken,
  BorderRadiusToken,
  AlignValue,
  JustifyValue,
  ImageBlockSize,
  ImageBlockCrop
} from '@blockslides/ai-context'
```

### Size types

```ts
type SizeKey = 
  | "16x9" 
  | "4x3" 
  | "a4-portrait" 
  | "a4-landscape" 
  | "letter-portrait" 
  | "letter-landscape" 
  | "linkedin-banner"
```

### Base block attributes

All block-level nodes inherit from `BaseBlockAttrs`:

```ts
interface BaseBlockAttrs {
  align?: AlignValue | null              // "left" | "center" | "right" | "stretch"
  justify?: JustifyValue | null          // "start" | "center" | "end" | "space-between"
  padding?: SpacingToken | string | null // "none" | "sm" | "md" | "lg" or CSS value
  margin?: SpacingToken | string | null
  gap?: SpacingToken | string | null
  backgroundColor?: string | null
  backgroundImage?: string | null
  borderRadius?: BorderRadiusToken | string | null // "none" | "sm" | "md" | "lg" or CSS value
  border?: string | null
  fill?: boolean | null
  width?: string | null
  height?: string | null
}
```

### Slide attributes

```ts
interface SlideAttrs extends BaseBlockAttrs {
  id?: string | null
  className?: string | null
  size?: SizeKey | null
}
```

### Column attributes

```ts
interface ColumnAttrs extends BaseBlockAttrs {
  // Inherits all BaseBlockAttrs
}
```

### ImageBlock attributes

```ts
interface ImageBlockAttrs extends BaseBlockAttrs {
  src: string                           // Required
  assetId?: string | null
  alt?: string
  caption?: string
  credit?: string
  size?: ImageBlockSize | null          // "fill" | "fit" | "natural"
  crop?: ImageBlockCrop | null          // "center" | "top" | "bottom" | "left" | "right" | corners
}
```

## Template Builders

The `templatesV1` namespace provides programmatic helpers for building slide JSON:

```ts
import { templatesV1 } from '@blockslides/ai-context'

const { blocks, slide, createTemplate, listTemplates, templatesV1Context } = templatesV1
```

### Block helpers

```ts
// Text blocks
blocks.paragraph('Text content')
blocks.heading('Title', 2)  // level 1-6

// Lists
blocks.bulletList(['Item 1', 'Item 2', 'Item 3'])

// Media
blocks.imageBlock({
  src: 'https://example.com/image.jpg',
  size: 'fill',
  crop: 'center'
})

blocks.youtube({
  src: 'https://youtube.com/watch?v=VIDEO_ID',
  width: 1280,
  height: 720
})

// Layout
blocks.column(
  [blocks.heading('Title'), blocks.paragraph('Content')],
  { padding: 'lg', align: 'center' }
)

blocks.columnGroup([col1, col2], { fill: true })

// Other
blocks.codeBlock('const x = 1', 'javascript')
blocks.horizontalRule()
blocks.hardBreak()
blocks.blockquote([blocks.paragraph('Quote text')])
```

### Slide builders

```ts
// Empty slide
slide({
  slideAttrs: { size: '16x9', id: 'intro' },
  content: []
})

// Single column layout
slide.singleCol({
  slideAttrs: { size: '16x9' },
  columnAttrs: { padding: 'lg', align: 'center' },
  content: [
    blocks.heading('Welcome', 1),
    blocks.paragraph('Introduction text')
  ]
})

// Two column layout
slide.twoCol(
  blocks.column([blocks.heading('Left')], { width: '40%' }),
  blocks.column([blocks.heading('Right')], { width: '60%' }),
  { size: '16x9' }
)

// Three/four column layouts
slide.threeCol(col1, col2, col3)
slide.fourCol(col1, col2, col3, col4)
```

### Template presets

```ts
// Available preset types
type TemplatePreset =
  | "slide.empty"
  | "slide.singleCol"
  | "slide.twoCol"
  | "slide.hero"
  | "slide.imageCover"
  | "slide.quote"
  | "slide.agenda"
  | "slide.grid3"
  | "slide.grid4"
  | "slide.oneTwo"
  | "slide.twoOne"
  | "slide.oneTwoOne"
  | "slide.textMedia"
  | "slide.mediaText"
  | "slide.stack2"
```

The template builders are primarily designed for **internal tooling and LLM-based code generation**. They provide a type-safe way to construct valid slide JSON programmatically.

## Workflow Patterns

### Creating new presentations

```ts
import { bundlesV1 } from '@blockslides/ai-context'

const systemPrompt = [
  'You create BlockSlides presentations.',
  'Output only JSON. No prose, markdown, or code fences.',
  '',
  bundlesV1.minimalCreate
].join('\n\n')

// Use systemPrompt with your LLM client
// Parse the response and load into BlockSlides
```

### Editing existing documents

```ts
import { bundlesV1 } from '@blockslides/ai-context'

const editingPrompt = [
  bundlesV1.imageEditing,
  '',
  'Current document:',
  JSON.stringify(currentDoc, null, 2),
  '',
  'Task: Make the first image full bleed with top crop.',
  'Return the complete modified JSON.'
].join('\n')
```

When editing, the `editingRules` context instructs the model to:
- Preserve existing IDs and valid attributes
- Use only documented enum values
- Minimize changes to unaffected content
- Maintain document structure validity

### Targeted editing

For workflows that only modify specific node types:

```ts
import { contextsV1 } from '@blockslides/ai-context'

// Only allow YouTube embed changes
const youtubeEditContext = [
  contextsV1.core,
  contextsV1.fullDocument,
  contextsV1.youtube,
  contextsV1.editingRules
].join('\n\n')
```

By including only relevant contexts, you constrain the model's scope and improve output quality.

## Versioning

All exports use versioned namespaces (`contextsV1`, `bundlesV1`, `schemasV1`, `templatesV1`). This allows:

- Side-by-side usage of different context versions
- Stable LLM prompts that won't break when the package updates
- Clear migration paths when new versions are released

When constructing prompts, explicitly reference the version:

```ts
const prompt = `You are using @blockslides/ai-context v1.\n\n${bundlesV1.minimalCreate}`
```

## Configuration Options

### Combining schemas with contexts

Provide both human-readable instructions and structured schemas:

```ts
import { bundlesV1 } from '@blockslides/ai-context'

const fullPrompt = [
  bundlesV1.all,
  '',
  'JSON Schemas:',
  bundlesV1.allSchemas
].join('\n\n')
```

This gives the model:
1. Natural language descriptions of nodes and rules
2. Formal JSON Schema definitions for validation

### Tailoring for specific use cases

```ts
import { contextsV1 } from '@blockslides/ai-context'

// Marketing flyer creation
const flyerContext = [
  contextsV1.core,
  contextsV1.fullDocument,
  contextsV1.slide,
  contextsV1.sizing,      // Include size options
  contextsV1.column,
  contextsV1.imageBlock,
  contextsV1.heading,
  contextsV1.paragraph,
  contextsV1.style
].join('\n\n')

// Video-heavy presentation
const videoContext = [
  contextsV1.core,
  contextsV1.fullDocument,
  contextsV1.slide,
  contextsV1.column,
  contextsV1.youtube,
  contextsV1.heading,
  contextsV1.paragraph
].join('\n\n')
```

### Including template context

For models that need to understand template helpers:

```ts
import { bundlesV1, templatesV1 } from '@blockslides/ai-context'

const templatePrompt = [
  bundlesV1.minimalCreate,
  '',
  templatesV1.templatesV1Context  // Template builder documentation
].join('\n\n')
```

The `templatesV1Context` string teaches the model about `blocks.*` and `slide.*` helpers, enabling it to generate code that uses the template builders instead of raw JSON.
