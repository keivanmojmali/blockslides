# AI Context

The `@blockslides/ai-context` package provides versioned context strings, JSON schemas, and TypeScript types for instructing Large Language Models (LLMs) to generate and edit BlockSlides documents. It packages the structural rules and constraints of BlockSlides into consumable formats that can be used as system prompts or tool definitions.


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
  'You are a Blockslides presentation builder.',
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
