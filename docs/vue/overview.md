# Vue Overview

The `@blockslides/vue-3` package provides Vue 3 bindings for Blockslides, wrapping the core editor in Vue-friendly composables and components.

## Installation

For most slide editor use cases, install the prebuilts package:

```bash
pnpm install @blockslides/vue-3-prebuilts @blockslides/core @blockslides/pm @floating-ui/dom
```

For building custom editors from scratch, install the core Vue package:

```bash
pnpm install @blockslides/vue-3 @blockslides/core @blockslides/pm @floating-ui/dom
```

All packages require Vue 3.0+ as a peer dependency.

## Package Structure

Blockslides Vue support is split into two packages:

**@blockslides/vue-3** - Core primitives for building custom editors
- Low-level composables (`useEditor`)
- Vue renderers and node view components
- Includes `@blockslides/extension-kit` and `@blockslides/ai-context` as dependencies
- Re-exports all of `@blockslides/core`

**@blockslides/vue-3-prebuilts** - Ready-to-use slide editor components
- `SlideEditor` - Complete editor component
- `useSlideEditor` - Slide editor composable with ExtensionKit
- Menu components (`BubbleMenu`, `FloatingMenu`, `BubbleMenuPreset`)
- Re-exports everything from `@blockslides/vue-3`

::: info Package Dependencies
Unlike the React packages, `@blockslides/vue-3` includes `@blockslides/extension-kit` as a dependency, so ExtensionKit is available even when using the core package directly.
:::

Most users building slide editors should install `@blockslides/vue-3-prebuilts`. Use `@blockslides/vue-3` directly only if building a completely custom editor from scratch.

## What's included

### From @blockslides/vue-3

**Core Components:**

**EditorContent** - Renders the ProseMirror editor view and manages node view portals. Required for all editor implementations.

**NodeViewWrapper & NodeViewContent** - Components for building custom Vue node views.

**Core Composables:**

**useEditor** - Lower-level composable for editor instantiation. Use when you need full control over extensions.

**Renderers:**

**VueNodeViewRenderer** - Function that creates Vue-based node views for custom block rendering.

**VueRenderer** - Low-level component renderer used internally by node views.

### From @blockslides/vue-3-prebuilts

**Pre-built Components:**

**SlideEditor** - Drop-in component that bundles editor rendering, viewport scaling, and optional bubble menu preset. Handles instantiation, lifecycle, and common UI patterns.

**BubbleMenuPreset** - Pre-built bubble menu with formatting controls.

**BubbleMenu & FloatingMenu** - Positioning components for contextual menus.

**Slide Editor Composable:**

**useSlideEditor** - Creates and configures a slide editor with ExtensionKit. Returns editor instance and preset templates.

::: tip
Since `@blockslides/vue-3-prebuilts` re-exports everything from `@blockslides/vue-3`, you can import any component or composable from either package when using the prebuilts package.
:::

## Architecture

### ExtensionKit integration

The `useSlideEditor` composable automatically configures ExtensionKit, which bundles all extensions needed for slide editing:

- Text formatting (bold, italic, underline, strike, etc.)
- Block elements (headings, paragraphs, lists, blockquotes)
- Slide-specific features (columns, layouts, backgrounds)
- Media (images, videos, image blocks)
- Advanced features (tables, math, code blocks)
- Editor behaviors (undo/redo, drag and drop, markdown parsing)

Extensions can be disabled or configured via `extensionKitOptions`, and custom extensions can be appended via the `extensions` prop.

### Component vs Composable approach

Use `SlideEditor` for straightforward implementations where the default layout and behavior work for your use case.

Use `useSlideEditor` + `EditorContent` when you need:
- Custom wrapper layouts
- Multiple editors on the same page
- Integration with existing state management
- Custom viewport implementations

Both approaches use the same underlying editor instance and extension system.

## Server-side rendering

The editor depends on browser APIs and cannot render on the server. In Nuxt.js, wrap editor components in `ClientOnly`:

```html
  <ClientOnly>
    <SlideEditor 
      :content="content"
      :onChange="handleChange"
    />
  </ClientOnly>
```

Or use lazy loading:

```ts
const SlideEditor = defineAsyncComponent(() => 
  import('@blockslides/vue-3-prebuilts').then(m => m.SlideEditor)
)
```

## Custom node views

Vue node views let you render custom UI for specific node types using Vue components instead of vanilla DOM manipulation.

```ts
import { NodeViewWrapper, NodeViewContent } from '@blockslides/vue-3'

defineProps(['node', 'updateAttributes'])
```

```html
<NodeViewWrapper>
  <div class="custom-node">
    <NodeViewContent />
  </div>
</NodeViewWrapper>
```

Register the node view in your extension:

```ts
import { Node } from '@blockslides/core'
import { VueNodeViewRenderer } from '@blockslides/vue-3'
import CustomNode from './CustomNode.vue'

const CustomExtension = Node.create({
  name: 'customNode',
  // ... node definition
  addNodeView() {
    return VueNodeViewRenderer(CustomNode)
  }
})
```

`NodeViewWrapper` provides drag-and-drop support and marks the element as a node view container. `NodeViewContent` renders the editable content area for non-leaf nodes.

## Re-exports from core

The Vue package re-exports the entire `@blockslides/core` API:

```ts
import { 
  Extension,
  Mark,
  Node,
  mergeAttributes,
  getMarkRange,
  // ... all core exports
} from '@blockslides/vue-3'
```

This means you typically only need to install `@blockslides/vue-3` or `@blockslides/vue-3-prebuilts` - the core exports are available without a separate import.

## Reactivity patterns

Vue's reactivity system works seamlessly with Blockslides:

```ts
import { computed } from 'vue'
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()

// Derive reactive state from editor
const isBold = computed(() => editor.value?.isActive('bold'))
const canUndo = computed(() => editor.value?.can().undo())
const wordCount = computed(() => {
  const text = editor.value?.state.doc.textContent || ''
  return text.split(/\s+/).filter(Boolean).length
})
```

```html
<div>
  <button 
    @click="editor?.chain().focus().toggleBold().run()"
    :class="{ active: isBold }"
  >
    Bold
  </button>
  <span>{{ wordCount }} words</span>
</div>
```

The editor instance is returned as a `shallowRef`, which means Vue won't deeply watch internal ProseMirror state (for performance). Use `computed()` to derive reactive values from the editor when needed.
