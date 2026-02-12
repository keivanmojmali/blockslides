# UI Components

The React package provides components for building slide editors with full control over rendering, menus, and custom node views.

## Installation

```bash
# For pre-built components (includes everything from @blockslides/react)
pnpm install @blockslides/react-prebuilts @blockslides/core @blockslides/pm

# Or for core React bindings only
pnpm install @blockslides/react @blockslides/core @blockslides/pm
```

## ReactSlideEditor

`ReactSlideEditor` is a complete editor component that combines the editor content with a built-in bubble menu preset. Use this when you want a fully-featured editor with minimal setup.

```tsx
import { ReactSlideEditor } from '@blockslides/react-prebuilts'
import { ExtensionKit } from '@blockslides/extension-kit'

function MyEditor() {
  return (
    <ReactSlideEditor
      extensions={[ExtensionKit.configure({})]}
      content={{
        type: 'doc',
        content: []
      }}
      autofocus
    />
  )
}
```

### Props

All props from `useSlideEditor` are supported, plus:

**bubbleMenuPreset** (`boolean | BubbleMenuPresetProps`)
- `true` (default) — Renders the default bubble menu
- `false` — Disables the bubble menu entirely
- Object — Pass configuration to customize the bubble menu

**editorContentProps** (`Omit<EditorContentProps, "editor">`)
Additional props forwarded to the underlying `EditorContent` component.

**className** / **style**
Applied to the outer wrapper element.

### Customizing the bubble menu

```tsx
<ReactSlideEditor
  extensions={[ExtensionKit.configure({})]}
  bubbleMenuPreset={{
    items: ['bold', 'italic', 'underline', 'textColor', 'link'],
    textColors: ['#000000', '#ff0000', '#00ff00', '#0000ff'],
    fonts: ['Inter', 'Georgia', 'Courier New']
  }}
/>
```

### Disabling the bubble menu

```tsx
<ReactSlideEditor
  extensions={[ExtensionKit.configure({})]}
  bubbleMenuPreset={false}
/>
```

## EditorContent

`EditorContent` renders the ProseMirror editor view. Use this for complete control over your editor setup, typically combined with `useSlideEditor` or `useEditor`.

```tsx
import { EditorContent, useSlideEditor } from '@blockslides/react-prebuilts'
import { ExtensionKit } from '@blockslides/extension-kit'

function MyEditor() {
  const { editor } = useSlideEditor({
    extensions: [ExtensionKit.configure({})],
    content: { type: 'doc', content: [] }
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
```

### Props

**editor** (`Editor | null`, required)
The editor instance to render.

**innerRef** (`ForwardedRef<HTMLDivElement | null>`)
Ref to access the editor's DOM element.

Additional HTML div attributes are supported and applied to the wrapper element.

### Styling the editor

The component renders a div containing the ProseMirror editor. Apply styles directly:

```tsx
<EditorContent 
  editor={editor}
  className="my-editor"
  style={{ minHeight: '400px' }}
/>
```

## EditorProvider

`EditorProvider` creates an editor instance and makes it available to child components via context. This enables accessing the editor from anywhere in the component tree using `useCurrentEditor`.

```tsx
import { EditorProvider, useCurrentEditor } from '@blockslides/react'
import { ExtensionKit } from '@blockslides/extension-kit'

function Toolbar() {
  const { editor } = useCurrentEditor()
  
  return (
    <button onClick={() => editor?.chain().focus().toggleBold().run()}>
      Bold
    </button>
  )
}

function App() {
  return (
    <EditorProvider
      extensions={[ExtensionKit.configure({})]}
      content={{ type: 'doc', content: [] }}
      slotBefore={<Toolbar />}
    >
      <div>Additional content here</div>
    </EditorProvider>
  )
}
```

### Props

All props from `useEditor` are supported, plus:

**slotBefore** (`ReactNode`)
Rendered before the editor content.

**slotAfter** (`ReactNode`)
Rendered after the editor content.

**editorContainerProps** (`HTMLAttributes<HTMLDivElement>`)
Props applied to the `EditorContent` wrapper.

**children** (`ReactNode`)
Rendered after the editor but has access to the editor context.

### useCurrentEditor

Hook to access the editor instance from any component within an `EditorProvider`:

```tsx
function MyToolbar() {
  const { editor } = useCurrentEditor()
  
  if (!editor) return null
  
  return (
    <div>
      <button 
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().toggleBold()}
      >
        Bold
      </button>
    </div>
  )
}
```

## BubbleMenuPreset

A fully-featured bubble menu with text formatting controls (bold, italic, underline, colors, fonts, alignment) and image editing tools (replace, align, crop, dimensions). Appears when text is selected or an image is clicked.

```tsx
import { BubbleMenuPreset, EditorContent, useSlideEditor } from '@blockslides/react-prebuilts'
import { ExtensionKit } from '@blockslides/extension-kit'

function MyEditor() {
  const { editor } = useSlideEditor({
    extensions: [ExtensionKit.configure({})]
  })

  if (!editor) return null

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenuPreset editor={editor} />
    </>
  )
}
```

### Configuration

**items** (`BubbleMenuPresetItem[]`)
Controls and their display order. Available items:
- `'undo'` / `'redo'` — History controls
- `'fontFamily'` — Font picker dropdown
- `'fontSize'` — Font size dropdown
- `'bold'` / `'italic'` / `'underline'` — Text formatting
- `'textColor'` — Text color picker
- `'highlightColor'` — Background highlight picker
- `'link'` — Link editor
- `'align'` — Text alignment dropdown

```tsx
<BubbleMenuPreset
  editor={editor}
  items={['bold', 'italic', 'underline', 'link', 'textColor']}
/>
```

**textColors** / **highlightColors** (`string[]`)
Color palettes for the color pickers. Accepts any valid CSS color.

```tsx
<BubbleMenuPreset
  editor={editor}
  textColors={['#000000', '#666666', '#ff0000', '#00ff00', '#0000ff']}
  highlightColors={['#ffff00', '#00ffff', '#ff00ff']}
/>
```

**fonts** (`string[]`)
Font families for the font picker.

```tsx
<BubbleMenuPreset
  editor={editor}
  fonts={['Inter', 'Georgia', 'Courier New', 'Arial']}
/>
```

**fontSizes** (`string[]`)
Font size options (any CSS length).

```tsx
<BubbleMenuPreset
  editor={editor}
  fontSizes={['12px', '16px', '20px', '24px', '32px', '48px']}
/>
```

**alignments** (`('left' | 'center' | 'right' | 'justify')[]`)
Text alignment options.

```tsx
<BubbleMenuPreset
  editor={editor}
  alignments={['left', 'center', 'right']}
/>
```

**injectStyles** (`boolean`, default: `true`)
Automatically inject default styles. Set to `false` if providing your own styles.

**className** (`string`)
Additional CSS classes for the menu element.

### Advanced: Intercepting actions

**onTextAction** — Override default behavior for text formatting buttons:

```tsx
<BubbleMenuPreset
  editor={editor}
  onTextAction={(action, ctx) => {
    if (action === 'bold') {
      // Custom bold logic
      console.log('Bold clicked')
      ctx.defaultAction() // Call default if needed
    } else {
      ctx.defaultAction()
    }
  }}
/>
```

The context object provides:
- `editor` — Editor instance
- `element` — Menu element
- `trigger` — Button that was clicked
- `getTriggerRect()` / `getMenuRect()` / `getSelectionRect()` — Position information
- `closePopovers()` — Close any open popovers
- `defaultAction()` — Run the built-in action

**onImageReplace** — Override image replacement behavior:

```tsx
<BubbleMenuPreset
  editor={editor}
  onImageReplace={(ctx) => {
    // Open your custom image picker
    openImagePicker((url) => {
      ctx.replaceWith(url)
    })
    
    // Or use the built-in popover
    // ctx.showDefaultPopover()
  }}
/>
```

Additional context methods:
- `getCurrentValue()` — Get current image URL
- `replaceWith(url)` — Update image source
- `showDefaultPopover()` — Show built-in URL input

### Positioning

The bubble menu uses Floating UI for positioning. Configure via the `options` prop:

```tsx
<BubbleMenuPreset
  editor={editor}
  options={{
    placement: 'top',
    offset: 12,
    flip: {},
    shift: { padding: 8 }
  }}
/>
```

## BubbleMenu

A lower-level bubble menu component for building custom menus. Provides positioning and visibility logic without built-in controls.

```tsx
import { BubbleMenu } from '@blockslides/react-prebuilts/menus'
import { EditorContent, useSlideEditor } from '@blockslides/react-prebuilts'

function MyEditor() {
  const { editor } = useSlideEditor({
    extensions: [ExtensionKit.configure({})]
  })

  if (!editor) return null

  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>
      </BubbleMenu>
    </>
  )
}
```

### Props

**editor** (`Editor | null`, optional)
Editor instance. Can be omitted if used within `EditorProvider` — the component will use `useCurrentEditor()` to get the editor from context.

**pluginKey** (`string`, default: `'bubbleMenu'`)
Unique identifier if using multiple bubble menus.

**updateDelay** (`number`, default: `250ms`)
Debounce delay for position updates.

**resizeDelay** (`number`, default: `60ms`)
Throttle delay for resize events.

**shouldShow** (`({ editor, state, view, from, to }) => boolean`)
Controls menu visibility. By default, shows when text is selected.

```tsx
<BubbleMenu
  editor={editor}
  shouldShow={({ editor, state }) => {
    // Only show for headings
    return editor.isActive('heading')
  }}
>
  <HeadingControls />
</BubbleMenu>
```

**appendTo** (`HTMLElement | (() => HTMLElement)`)
Container element for the menu. Defaults to `document.body`.

**options** (`Partial<ComputePositionConfig>`)
Floating UI positioning options.

```tsx
<BubbleMenu
  editor={editor}
  options={{
    placement: 'bottom',
    offset: 8,
    flip: { fallbackPlacements: ['top', 'left', 'right'] }
  }}
>
  {children}
</BubbleMenu>
```

## FloatingMenu

A menu that appears on empty lines, useful for inserting new content blocks.

```tsx
import { FloatingMenu } from '@blockslides/react-prebuilts/menus'
import { EditorContent, useSlideEditor } from '@blockslides/react-prebuilts'

function MyEditor() {
  const { editor } = useSlideEditor({
    extensions: [ExtensionKit.configure({})]
  })

  if (!editor) return null

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          List
        </button>
      </FloatingMenu>
    </>
  )
}
```

### Props

Same as `BubbleMenu`, except `shouldShow` defaults to showing on empty lines.

::: tip
Note: The `editor` prop is technically required in the TypeScript type definition, but the component falls back to `useCurrentEditor()` if omitted when used within `EditorProvider`.
:::

**shouldShow** — Override default empty-line detection:

```tsx
<FloatingMenu
  editor={editor}
  shouldShow={({ editor, state }) => {
    const { $anchor } = state.selection
    const node = $anchor.parent
    // Only show in paragraphs
    return node.type.name === 'paragraph' && node.content.size === 0
  }}
>
  {children}
</FloatingMenu>
```

## Custom Node Views

Build custom React components for specific node types using `ReactNodeViewRenderer`, `NodeViewWrapper`, and `NodeViewContent`.

### Creating a custom node view

```tsx
import { NodeViewWrapper, NodeViewContent } from '@blockslides/react'
import type { ReactNodeViewProps } from '@blockslides/react'

function CustomParagraph({ node, updateAttributes }: ReactNodeViewProps) {
  return (
    <NodeViewWrapper>
      <div style={{ backgroundColor: node.attrs.bgColor || 'transparent' }}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}
```

### Registering the node view

```tsx
import { Paragraph } from '@blockslides/extension-paragraph'
import { ReactNodeViewRenderer } from '@blockslides/react'

const CustomParagraphExtension = Paragraph.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CustomParagraph)
  },
  
  addAttributes() {
    return {
      ...this.parent?.(),
      bgColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-bg-color'),
        renderHTML: attributes => ({
          'data-bg-color': attributes.bgColor
        })
      }
    }
  }
})
```

### NodeViewWrapper

Required wrapper for all custom node views. Handles drag behavior and proper DOM structure.

**as** (`React.ElementType`, default: `'div'`)
HTML element or React component to render.

```tsx
<NodeViewWrapper as="section" className="my-node">
  {children}
</NodeViewWrapper>
```

### NodeViewContent

Marks where editable content should render. Required for nodes that have content.

**as** (`keyof React.JSX.IntrinsicElements`, default: `'div'`)
HTML element to render.

```tsx
<NodeViewContent as="span" />
```

::: tip
For leaf nodes (like images or horizontal rules), omit `NodeViewContent` entirely.
:::

### ReactNodeViewProps

All custom node view components receive these props:

- `editor` — Editor instance
- `node` — ProseMirror node
- `decorations` — Decorations array
- `innerDecorations` — Inner decorations
- `view` — EditorView instance
- `selected` — Whether node is selected
- `extension` — The extension definition
- `HTMLAttributes` — Computed HTML attributes
- `getPos()` — Get node position
- `updateAttributes(attrs)` — Update node attributes
- `deleteNode()` — Delete this node
- `ref` — React ref for the wrapper element

### ReactNodeViewRenderer options

**update** — Control when the component re-renders:

```tsx
ReactNodeViewRenderer(CustomNode, {
  update({ oldNode, newNode, updateProps }) {
    // Only re-render if specific attributes changed
    if (oldNode.attrs.src !== newNode.attrs.src) {
      updateProps()
      return true
    }
    // Don't re-render, node hasn't changed meaningfully
    return true
  }
})
```

**as** / **className** — Customize the wrapper element:

```tsx
ReactNodeViewRenderer(CustomNode, {
  as: 'span',
  className: 'custom-node-wrapper'
})
```

**attrs** — Apply dynamic attributes to the wrapper:

```tsx
ReactNodeViewRenderer(CustomNode, {
  attrs: ({ node, HTMLAttributes }) => ({
    'data-type': node.type.name,
    'data-id': node.attrs.id,
    ...HTMLAttributes
  })
})
```

## ReactRenderer

Low-level class for rendering React components anywhere in your editor. Useful for tooltips, popovers, or other UI elements that need to interact with the editor.

```tsx
import { ReactRenderer } from '@blockslides/react'

function MyTooltip({ text }: { text: string }) {
  return <div className="tooltip">{text}</div>
}

// In your extension or plugin
const renderer = new ReactRenderer(MyTooltip, {
  editor,
  props: { text: 'Hello' },
  as: 'div',
  className: 'tooltip-container'
})

// Append to DOM
document.body.appendChild(renderer.element)

// Update props
renderer.updateProps({ text: 'Updated' })

// Cleanup
renderer.destroy()
```

### Constructor options

**editor** (`Editor`, required)
The editor instance.

**props** (`Record<string, any>`)
Props passed to the component.

**as** (`string`, default: `'div'`)
Wrapper element tag name.

**className** (`string`)
Classes added to the wrapper element.

### Methods

**updateProps(props)** — Update component props and trigger re-render.

**updateAttributes(attributes)** — Update wrapper element's HTML attributes.

**destroy()** — Unmount component and cleanup.

### Properties

- `element` — The wrapper DOM element
- `ref` — React ref to the component instance (for class components or forwardRef)
- `reactElement` — The React element being rendered
