# Components

The Vue package provides components for building slide editors with full control over rendering, menus, and custom node views.

## Installation

```bash
# For pre-built components (includes everything from @blockslides/vue-3)
pnpm install @blockslides/vue-3-prebuilts @blockslides/core @blockslides/pm 

# Or for core Vue bindings only
pnpm install @blockslides/vue-3 @blockslides/core @blockslides/pm
```

## SlideEditor

`SlideEditor` is a complete editor component that combines the editor content with a built-in bubble menu preset. Use this when you want a fully-featured editor with minimal setup.

```ts
import { SlideEditor } from '@blockslides/vue-3-prebuilts'
import { ref } from 'vue'

const content = ref({
  type: 'doc',
  content: []
})

const handleChange = (doc) => {
  console.log('Content changed:', doc)
}
```

```html
<SlideEditor 
  :content="content"
  :onChange="handleChange"
  :editorOptions="{ autofocus: true, editable: true }"
/>
```

### Props

**content** (`JSONContent`)
Initial document content.

**extensions** (`AnyExtension[]`)
Additional extensions to append after ExtensionKit.

**extensionKitOptions** (`ExtensionKitOptions`)
Customize or disable ExtensionKit features.

**bubbleMenuPreset** (`boolean | BubbleMenuPresetProps`)
- `true` (default) — Renders the default bubble menu
- `false` — Disables the bubble menu entirely
- Object — Pass configuration to customize the bubble menu

**presetTemplates** (`PresetTemplates`)
Custom template list for the add-slide button.

**theme** (`'light' | 'dark'`)
Theme name applied as CSS class.

**editorProps** (`EditorProps`)
ProseMirror EditorProps for advanced configuration.

**editorOptions** (`Partial<EditorOptions>`)
Additional editor options to pass through to the core editor. Use this to pass options like `autofocus`, `editable`, etc.

**class** / **style**
Applied to the outer wrapper element.

### Events / Callbacks

**onChange** (`(doc: JSONContent, editor: Editor) => void`)
Called on every document update with the current JSON. Pass as a prop (`:onChange`).

**onUpdate** (`({ editor, transaction }) => void`)
Called on every editor transaction. Pass as a prop (`:onUpdate`).

**onEditorReady** (`(editor: Editor) => void`)
Called once when the editor instance is created. Pass as a prop (`:onEditorReady`).

**Other lifecycle hooks**
Pass `onCreate`, `onBeforeCreate`, `onDestroy`, `onFocus`, `onBlur`, `onSelectionUpdate`, `onTransaction` via the `:editorOptions` prop:

```html
<SlideEditor
  :content="content"
  :editorOptions="{
    onCreate: ({ editor }) => console.log('Created'),
    onDestroy: () => console.log('Destroyed')
  }"
/>
```

### Customizing the bubble menu

```html
<SlideEditor
  :content="content"
  :bubbleMenuPreset="{
    items: ['bold', 'italic', 'underline', 'textColor', 'link'],
    textColors: ['#000000', '#ff0000', '#00ff00', '#0000ff'],
    fonts: ['Inter', 'Georgia', 'Courier New']
  }"
/>
```

### Disabling the bubble menu

```html
<SlideEditor
  :content="content"
  :bubbleMenuPreset="false"
/>
```

### Configuring editor options

Pass additional editor configuration through `editorOptions`:

```html
<SlideEditor
  :content="content"
  :editorOptions="{
    autofocus: 'end',
    editable: false,
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    }
  }"
/>
```

Common options:
- `autofocus`: `boolean | 'start' | 'end' | number` - Control initial focus
- `editable`: `boolean` - Toggle edit/read-only mode  
- `editorProps`: `EditorProps` - ProseMirror editor properties
- `injectCSS`: `boolean` - Control CSS injection

## EditorContent

`EditorContent` renders the ProseMirror editor view. Use this for complete control over your editor setup, typically combined with `useSlideEditor` or `useEditor`.

```ts
import { EditorContent, useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor({
  content: { type: 'doc', content: [] }
})
```

```html
<EditorContent 
  v-if="editor" 
  :editor="editor" 
  class="my-editor"
/>
```

### Props

**editor** (`Editor | null`, required)
The editor instance to render.

**class** (`string`)
CSS classes applied to the wrapper element.

**style** (`StyleValue`)
Inline styles applied to the wrapper element.

### Styling the editor

The component renders a div containing the ProseMirror editor. Apply styles directly:

```html
<EditorContent 
  :editor="editor"
  class="my-editor"
  :style="{ minHeight: '400px' }"
/>
```

```css
.my-editor {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}
```

## BubbleMenuPreset

A fully-featured bubble menu with text formatting controls (bold, italic, underline, colors, fonts, alignment) and image editing tools (replace, align, crop, dimensions). Appears when text is selected or an image is clicked.

```ts
import { BubbleMenuPreset, EditorContent, useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()
```

```html
<div v-if="editor">
  <EditorContent :editor="editor" />
  <BubbleMenuPreset :editor="editor" />
</div>
```

### Props

**editor** (`Editor`, required)
The editor instance.

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

```html
  <BubbleMenuPreset
    :editor="editor"
    :items="['bold', 'italic', 'underline', 'link', 'textColor']"
  />
```

**textColors** / **highlightColors** (`string[]`)
Color palettes for the color pickers. Accepts any valid CSS color.

```html
  <BubbleMenuPreset
    :editor="editor"
    :textColors="['#000000', '#666666', '#ff0000', '#00ff00', '#0000ff']"
    :highlightColors="['#ffff00', '#00ffff', '#ff00ff']"
  />
```

**fonts** (`string[]`)
Font families for the font picker.

```html
  <BubbleMenuPreset
    :editor="editor"
    :fonts="['Inter', 'Georgia', 'Courier New', 'Arial']"
  />
```

**fontSizes** (`string[]`)
Font size options (any CSS length).

```html
  <BubbleMenuPreset
    :editor="editor"
    :fontSizes="['12px', '16px', '20px', '24px', '32px', '48px']"
  />
```

**alignments** (`('left' | 'center' | 'right' | 'justify')[]`)
Text alignment options.

```html
  <BubbleMenuPreset
    :editor="editor"
    :alignments="['left', 'center', 'right']"
  />
```

**injectStyles** (`boolean`, default: `true`)
Automatically inject default styles. Set to `false` if providing your own styles.

**class** (`string`)
Additional CSS classes for the menu element.

### Advanced: Intercepting actions

**onTextAction** — Override default behavior for text formatting buttons:

```html
<BubbleMenuPreset
  :editor="editor"
  :onTextAction="handleTextAction"
/>
```

```ts
const handleTextAction = (action, ctx) => {
  if (action === 'bold') {
    // Custom bold logic
    console.log('Bold clicked')
    ctx.defaultAction() // Call default if needed
  } else {
    ctx.defaultAction()
  }
}
```

The context object provides:
- `editor` — Editor instance
- `element` — Menu element
- `trigger` — Button that was clicked
- `getTriggerRect()` / `getMenuRect()` / `getSelectionRect()` — Position information
- `closePopovers()` — Close any open popovers
- `defaultAction()` — Run the built-in action

**onImageReplace** — Override image replacement behavior:

```html
<BubbleMenuPreset
  :editor="editor"
  :onImageReplace="handleImageReplace"
/>
```

```ts
const handleImageReplace = (ctx) => {
  // Open your custom image picker
  openImagePicker((url) => {
    ctx.replaceWith(url)
  })
  
  // Or use the built-in popover
  // ctx.showDefaultPopover()
}
```

Additional context methods:
- `getCurrentValue()` — Get current image URL
- `replaceWith(url)` — Update image source
- `showDefaultPopover()` — Show built-in URL input

### Positioning

The bubble menu uses Floating UI for positioning. Configure via the `options` prop:

```html
  <BubbleMenuPreset
    :editor="editor"
    :options="{
      placement: 'top',
      offset: 12,
      flip: {},
      shift: { padding: 8 }
    }"
  />
```

## BubbleMenu

A lower-level bubble menu component for building custom menus. Provides positioning and visibility logic without built-in controls.

```ts
import { BubbleMenu } from '@blockslides/vue-3-prebuilts/menus'
import { EditorContent, useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()
```

```html
<div v-if="editor">
  <EditorContent :editor="editor" />
  <BubbleMenu :editor="editor">
    <button @click="editor.chain().focus().toggleBold().run()">
      Bold
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()">
      Italic
    </button>
  </BubbleMenu>
</div>
```

### Props

**editor** (`Editor`, required)
Editor instance.

**pluginKey** (`string`, default: `'bubbleMenu'`)
Unique identifier if using multiple bubble menus.

**updateDelay** (`number`, default: `250`)
Debounce delay for position updates (in milliseconds).

**resizeDelay** (`number`, default: `60`)
Throttle delay for resize events (in milliseconds).

**shouldShow** (`({ editor, state, view, from, to }) => boolean`)
Controls menu visibility. By default, shows when text is selected.

```html
  <BubbleMenu
    :editor="editor"
    :shouldShow="({ editor }) => editor.isActive('heading')"
  >
    <HeadingControls />
  </BubbleMenu>
```

**appendTo** (`HTMLElement | (() => HTMLElement)`)
Container element for the menu. Defaults to `document.body`.

**options** (`Partial<ComputePositionConfig>`)
Floating UI positioning options.

```html
  <BubbleMenu
    :editor="editor"
    :options="{
      placement: 'bottom',
      offset: 8,
      flip: { fallbackPlacements: ['top', 'left', 'right'] }
    }"
  >
    <slot />
  </BubbleMenu>
```

## FloatingMenu

A menu that appears on empty lines, useful for inserting new content blocks.

```ts
import { FloatingMenu } from '@blockslides/vue-3-prebuilts/menus'
import { EditorContent, useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()
```

```html
<div v-if="editor">
  <EditorContent :editor="editor" />
  <FloatingMenu :editor="editor">
    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
      H1
    </button>
    <button @click="editor.chain().focus().toggleBulletList().run()">
      List
    </button>
  </FloatingMenu>
</div>
```

### Props

Same as `BubbleMenu`, except `shouldShow` defaults to showing on empty lines.

**shouldShow** — Override default empty-line detection:

```html
  <FloatingMenu
    :editor="editor"
    :shouldShow="({ editor, state }) => {
      const { $anchor } = state.selection
      const node = $anchor.parent
      // Only show in paragraphs
      return node.type.name === 'paragraph' && node.content.size === 0
    }"
  >
    <slot />
  </FloatingMenu>
```

## Custom Node Views

Build custom Vue components for specific node types using `VueNodeViewRenderer`, `NodeViewWrapper`, and `NodeViewContent`.

### Creating a custom node view

```ts
import { NodeViewWrapper, NodeViewContent } from '@blockslides/vue-3'

const props = defineProps(['node', 'updateAttributes'])
```

```html
<NodeViewWrapper>
  <div :style="{ backgroundColor: node.attrs.bgColor || 'transparent' }">
    <NodeViewContent />
  </div>
</NodeViewWrapper>
```

### Registering the node view

```ts
import { Paragraph } from '@blockslides/extension-paragraph'
import { VueNodeViewRenderer } from '@blockslides/vue-3'
import CustomParagraph from './CustomParagraph.vue'

const CustomParagraphExtension = Paragraph.extend({
  addNodeView() {
    return VueNodeViewRenderer(CustomParagraph)
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

**as** (`string`, default: `'div'`)
HTML element to render.

```html
  <NodeViewWrapper as="section" class="my-node">
    <slot />
  </NodeViewWrapper>
```

### NodeViewContent

Marks where editable content should render. Required for nodes that have content.

**as** (`string`, default: `'div'`)
HTML element to render.

```html
  <NodeViewContent as="span" />
```

::: tip
For leaf nodes (like images or horizontal rules), omit `NodeViewContent` entirely.
:::

### Node View Props

All custom node view components receive these props:

- `editor` — Editor instance
- `node` — ProseMirror node
- `decorations` — Decorations array
- `selected` — Whether node is selected
- `extension` — The extension definition
- `getPos()` — Get node position
- `updateAttributes(attrs)` — Update node attributes
- `deleteNode()` — Delete this node

### VueNodeViewRenderer options

**update** — Control when the component re-renders:

```ts
VueNodeViewRenderer(CustomNode, {
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

**className** — Customize the wrapper element:

```ts
VueNodeViewRenderer(CustomNode, {
  className: 'custom-node-wrapper'
})
```

## VueRenderer

Low-level class for rendering Vue components anywhere in your editor. Useful for tooltips, popovers, or other UI elements that need to interact with the editor.

```ts
import { VueRenderer } from '@blockslides/vue-3'
import MyTooltip from './MyTooltip.vue'

// In your extension or plugin
const renderer = new VueRenderer(MyTooltip, {
  editor,
  props: { text: 'Hello' }
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

### Methods

**updateProps(props)** — Update component props and trigger re-render.

**destroy()** — Unmount component and cleanup.

### Properties

- `element` — The wrapper DOM element
- `vueInstance` — The Vue app instance
