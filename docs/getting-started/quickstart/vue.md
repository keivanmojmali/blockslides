# Quickstart: Vue

Get a working slide editor running in your Vue 3 application in minutes using the pre-built `SlideEditor` component.

we need to double check this vue component -> install it make sure it works and test it 
then lets publish it 
also lets stop publishing right on main 


## Installation

Install the core packages:

```bash
pnpm add @blockslides/vue-3 @blockslides/core @blockslides/pm
```

Blockslides requires **Vue 3.0 or higher** as a peer dependency.

## Your first editor

Here's a complete example showing the essential features:

<div v-pre>
```vue
<script setup lang="ts">
import { SlideEditor } from '@blockslides/vue-3'
import type { JSONContent, Editor } from '@blockslides/vue-3'

// Pass your initial content here
const initialContent: JSONContent = {
  type: 'doc',
  content: [ 
    {
      type: 'slide',
      attrs: { size: '16x9', id: 'slide-1' },
      content: [
        {
          type: 'column',
          attrs: { align: 'center', justify: 'center' },
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Welcome' }]
            }
          ]
        }
      ]
    }
  ]
}

const handleChange = (doc: JSONContent, editor: Editor) => {
  console.log('Document updated:', doc)
  // Logs: { type: 'doc', content: [...] }
}
</script>

<template>
  <!-- Styled container for demo - delete if you want -->
  <div style="background-color: #f3f4f6; height: 100%; padding: 3rem; display: flex; justify-content: center;">
    <SlideEditor 
      :content="initialContent"
      :onChange="handleChange"
      :extensionKitOptions="{
        slide: { renderMode: 'dynamic' }
      }"
    />
  </div>
</template>
```
</div>

That's it. This gives you a fully-functional slide editor with 50+ extensions automatically configured (text formatting, images, videos, tables, layouts, and more).

::: tip Pre-built component
`SlideEditor` includes everything to get started quickly. For complete control over layout and rendering, see [Using composables for more control](#using-composables-for-more-control) below.
:::

## Component props

The `SlideEditor` component accepts these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `JSONContent` | Example slide | Initial document content |
| `onChange` | `(doc: JSONContent, editor: Editor) => void` | - | Called on every update |
| `onEditorReady` | `(editor: Editor) => void` | - | Called once when editor is ready |
| `extensionKitOptions` | `ExtensionKitOptions` | `{}` | Customize or disable extensions |
| `extensions` | `AnyExtension[]` | `[]` | Additional extensions to add |
| `presetTemplates` | `PresetTemplates` | Default presets | Custom slide templates |
| `theme` | `'light' \| 'dark'` | `'light'` | Editor theme |
| `editorProps` | `EditorProps` | - | Additional ProseMirror props |
| `bubbleMenuPreset` | `boolean \| object` | `true` | Toggle/customize bubble menu |
| `className` | `string` | - | CSS class for wrapper |
| `style` | `any` | - | Inline styles for wrapper |

## Using composables for more control

For advanced use cases where you need more control over the editor's layout and rendering, use the `useSlideEditor` composable directly:

<div v-pre>
```vue
<script setup lang="ts">
import { EditorContent, useSlideEditor } from '@blockslides/vue-3'
import type { JSONContent, Editor } from '@blockslides/vue-3'

const initialContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'slide',
      attrs: { size: '16x9', id: 'slide-1' },
      content: [
        {
          type: 'column',
          attrs: { align: 'center', justify: 'center' },
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: 'Custom Layout' }]
            }
          ]
        }
      ]
    }
  ]
}

const handleChange = (doc: JSONContent, editor: Editor) => {
  console.log('Document changed:', doc)
}

const { editor } = useSlideEditor({
  content: initialContent,
  onChange: handleChange,
  extensionKitOptions: {
    slide: { renderMode: 'dynamic' }
  }
})
</script>

<template>
  <div v-if="editor" class="my-custom-layout">
    <!-- Your custom UI here -->
    <header>
      <h1>My Custom Editor</h1>
    </header>
    
    <!-- The editor content -->
    <div class="bs-viewport">
      <EditorContent :editor="editor" />
    </div>
    
    <!-- Your custom toolbar, sidebar, etc. -->
  </div>
</template>
```
</div>

### Why use composables?

- **Custom layouts** - Build your own editor chrome, toolbars, and panels
- **Multiple editor instances** - Manage several editors in one component
- **Access to editor instance** - Full control over editor state and commands
- **Custom rendering** - Integrate with your own design system

## Extension options

Customize the built-in extensions via `extensionKitOptions`:

<div v-pre>
```vue
<script setup lang="ts">
import { SlideEditor } from '@blockslides/vue-3'

const extensionKitOptions = {
  // Slide rendering behavior
  slide: { 
    renderMode: 'dynamic', // or 'fixed'
    hoverOutline: { 
      color: '#3b82f6', 
      width: '2px' 
    }
  },
  
  // Disable bubble menu if you want
  bubbleMenu: false,
  
  // Customize add-slide button
  addSlideButton: {
    showPresets: true,
    presetBackground: '#0f172a',
    presetForeground: '#e5e7eb'
  }
}
</script>

<template>
  <SlideEditor :extensionKitOptions="extensionKitOptions" />
</template>
```
</div>

## Next steps

- **Learn the basics**: Understand [blocks](/foundations/what-are-blocks) and [extensions](/foundations/what-are-extensions)
- **Explore features**: Check out [layouts](/features/slide-management/layouts-columns), [media embeds](/features/working-with-content/media-embeds), and more
- **Build custom extensions**: Create [your own extensions](/features/customization/creating-extensions)
- **Vue components**: Explore the full [Vue API](/vue/overview) (coming soon)
