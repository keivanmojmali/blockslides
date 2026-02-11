# React Overview

The `@blockslides/react` package provides React bindings for Blockslides, wrapping the core editor in React-friendly hooks and components.

## Installation

```bash
npm install @blockslides/react @blockslides/core @blockslides/pm
```

The package requires React 17+ as a peer dependency.

## What's included

### Components

**ReactSlideEditor** - Drop-in component that bundles editor rendering, viewport scaling, and optional bubble menu preset. Handles instantiation, lifecycle, and common UI patterns.

**EditorContent** - Renders the ProseMirror editor view and manages node view portals. Required for all editor implementations.

**EditorProvider** - Context provider for sharing editor state across component trees.

**BubbleMenu & FloatingMenu** - Positioning components for contextual menus.

**BubbleMenuPreset** - Pre-built bubble menu with formatting controls.

**NodeViewWrapper & NodeViewContent** - Components for building custom React node views.

### Hooks

**useSlideEditor** - Creates and configures a slide editor with ExtensionKit. Returns editor instance and preset templates.

**useEditor** - Lower-level hook for editor instantiation. Use when you need full control over extensions.

**useEditorState** - Subscribe to specific slices of editor state with custom selectors.

**useCurrentEditor** - Access editor from EditorProvider context.

**useReactNodeView** - Access node view context (drag handlers, content refs) in custom node views.

### Renderers

**ReactNodeViewRenderer** - Function that creates React-based node views for custom block rendering.

**ReactRenderer** - Low-level component renderer used internally by node views.

## Architecture

### ExtensionKit integration

The `useSlideEditor` hook automatically configures ExtensionKit, which bundles all extensions needed for slide editing:

- Text formatting (bold, italic, underline, strike, etc.)
- Block elements (headings, paragraphs, lists, blockquotes)
- Slide-specific features (columns, layouts, backgrounds)
- Media (images, videos, image blocks)
- Advanced features (tables, math, code blocks)
- Editor behaviors (undo/redo, drag and drop, markdown parsing)

Extensions can be disabled or configured via `extensionKitOptions`, and custom extensions can be appended via the `extensions` prop.

### Component vs Hook approach

Use `ReactSlideEditor` for straightforward implementations where the default layout and behavior work for your use case.

Use `useSlideEditor` + `EditorContent` when you need:
- Custom wrapper layouts
- Multiple editors on the same page
- Integration with existing state management
- Custom viewport implementations

Both approaches use the same underlying editor instance and extension system.

## Server-side rendering

The editor depends on browser APIs and cannot render on the server. Set `immediatelyRender: false` to prevent hydration mismatches:

```tsx
const { editor } = useSlideEditor({
  immediatelyRender: false
})
```

In Next.js, mark components using the editor as client components:

```tsx
'use client'

import { useSlideEditor, EditorContent } from '@blockslides/react-prebuilts'

export function Editor() {
  const { editor } = useSlideEditor({
    immediatelyRender: false
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
```

## Custom node views

React node views let you render custom UI for specific node types using React components instead of vanilla DOM manipulation.

```tsx
import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@blockslides/react'

const CustomNode = ({ node, updateAttributes }) => {
  return (
    <NodeViewWrapper>
      <div className="custom-node">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}

const CustomExtension = Node.create({
  name: 'customNode',
  // ... node definition
  addNodeView() {
    return ReactNodeViewRenderer(CustomNode)
  }
})
```

`NodeViewWrapper` provides drag-and-drop support and marks the element as a node view container. `NodeViewContent` renders the editable content area for non-leaf nodes.

## Re-exports from core

The React package re-exports the entire `@blockslides/core` API:

```ts
import { 
  Extension,
  Mark,
  Node,
  mergeAttributes,
  getMarkRange,
  // ... all core exports
} from '@blockslides/react'
```

This means you typically only need to install `@blockslides/react` - the core exports are available without a separate import.
