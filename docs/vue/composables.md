# Composables

Blockslides provides Vue composables for creating and managing editor instances with full integration into Vue's reactivity system.

## useSlideEditor

The primary composable for initializing a slide editor with the ExtensionKit bundle. This composable handles all the configuration needed for a fully-featured slide editor.

```ts
import { useSlideEditor, EditorContent } from '@blockslides/vue-3-prebuilts'

const { editor, presets } = useSlideEditor({
  content: initialContent,
  onChange: (doc, editor) => {
    console.log('Content changed:', doc)
  }
})
```

```html
<EditorContent v-if="editor" :editor="editor" />
```

### Configuration

```ts
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor, presets } = useSlideEditor({
  // Initial content (defaults to a single blank slide)
  content: {
    type: 'doc',
    content: [/* slides */]
  },
  
  // Called on every document update
  onChange: (doc, editor) => {
    saveToDatabase(doc)
  },
  
  // Additional extensions beyond ExtensionKit
  extensions: [MyCustomExtension],
  
  // Configure or disable ExtensionKit features
  extensionKitOptions: {
    bubbleMenu: false,
    youtube: { autoplay: false }
  },
  
  // Custom preset templates for add-slide button
  presetTemplates: customPresets,
  
  // Theme (applies CSS class)
  theme: 'light',
  
  // Lifecycle hooks
  onEditorReady: (editor) => {
    console.log('Editor initialized')
  },
  
  // Additional editor options
  editorOptions: {
    autofocus: true,
    editable: true
  }
})
```

**Parameters:**

- **content** (`JSONContent`) - Initial document content. Omit to start with a default blank slide.
- **onChange** (`(doc: JSONContent, editor: Editor) => void`) - Callback fired after each update with the current document JSON.
- **extensions** (`AnyExtension[]`) - Additional extensions appended after ExtensionKit.
- **extensionKitOptions** (`ExtensionKitOptions`) - Customize ExtensionKit configuration or disable specific extensions.
- **presetTemplates** (`PresetTemplates`) - Custom template list for the add-slide button. Defaults to built-in presets.
- **theme** (`'light' | 'dark'`) - Theme name applied as CSS class to editor.
- **editorProps** (`EditorProps`) - ProseMirror EditorProps for advanced configuration.
- **editorOptions** (`Partial<EditorOptions>`) - Additional editor options to pass through to the core editor (e.g., `autofocus`, `editable`). Also used to pass lifecycle hooks like `onCreate`, `onBeforeCreate`, `onDestroy`, `onFocus`, `onBlur`, `onSelectionUpdate`, `onTransaction`.
- **onEditorReady** (`(editor: Editor) => void`) - Called once when the editor instance is ready.
- **onUpdate** (`(props: EditorEvents['update']) => void`) - Called on every editor update. Can be passed directly or via `editorOptions`.

**Returns:**

```ts
{
  editor: ShallowRef<Editor | undefined>
  presets: PresetTemplates
}
```

- **editor** (`ShallowRef<Editor | undefined>`) - The editor instance wrapped in a shallow ref. Will be `undefined` until mounted.
- **presets** - Preset templates list used by the add-slide button.

### Server-Side Rendering

For SSR frameworks like Nuxt.js, wrap the editor in `ClientOnly`:

```html
  <ClientOnly>
    <EditorContent v-if="editor" :editor="editor" />
  </ClientOnly>
```

Or use lazy loading:

```ts
import { defineAsyncComponent } from 'vue'

const SlideEditor = defineAsyncComponent(() => 
  import('@blockslides/vue-3-prebuilts').then(m => m.SlideEditor)
)
```

```html
<SlideEditor :content="content" :onChange="handleChange" />
```

### Managing Updates

The composable provides two ways to capture content changes:

**onChange callback:**

```ts
const { editor } = useSlideEditor({
  onChange: (doc, editor) => {
    // Receives JSON on every update
    autosave(doc)
  }
})
```

**Watching editor updates:**

```ts
import { watch } from 'vue'

const { editor } = useSlideEditor()

watch(editor, (editorInstance) => {
  if (!editorInstance) return
  
  editorInstance.on('update', () => {
    const json = editorInstance.getJSON()
    const html = editorInstance.getHTML()
    console.log('Updated:', json)
  })
}, { immediate: true })
```

### Customizing ExtensionKit

```ts
const { editor } = useSlideEditor({
  extensionKitOptions: {
    youtube: false,
    bubbleMenu: false,
    fileHandler: {
      onDrop: (editor, files, pos) => {
        handleFileUpload(files, pos)
      }
    }
  }
})
```

::: tip Full Configuration Options
See [Extension Kit Overview](/features/customization/extension-kit-overview) for all available configuration options.
:::

### Passing Editor Options

Use the `editorOptions` parameter to pass additional editor configuration:

```ts
const { editor } = useSlideEditor({
  editorOptions: {
    autofocus: 'end', // Focus at end of document
    editable: false,  // Read-only mode
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    },
    // Lifecycle hooks
    onCreate: ({ editor }) => {
      console.log('Editor created:', editor)
    },
    onDestroy: () => {
      console.log('Editor destroyed')
    },
    onFocus: ({ editor, event }) => {
      console.log('Editor focused')
    },
    onBlur: ({ editor, event }) => {
      console.log('Editor blurred')
    }
  }
})
```

This is particularly useful for:
- `autofocus` - Control initial focus behavior
- `editable` - Toggle edit/read-only mode
- `editorProps` - Pass custom attributes or handlers
- `injectCSS` - Control CSS injection
- Lifecycle hooks - `onCreate`, `onBeforeCreate`, `onDestroy`, `onFocus`, `onBlur`, `onSelectionUpdate`, `onTransaction`
- Any other `EditorOptions` from `@blockslides/core`

### Adding Custom Extensions

Extend the editor with your own extensions:

```ts
import { MyCustomNode } from './extensions/MyCustomNode'

const { editor } = useSlideEditor({
  extensions: [
    MyCustomNode.configure({
      // custom options
    })
  ]
})
```

Extensions in the `extensions` array are appended after ExtensionKit, allowing your extensions to override or extend default behavior.

## useEditor

Lower-level composable for creating an editor instance without ExtensionKit. Use this when building a custom editor from scratch.

```ts
import { useEditor, EditorContent } from '@blockslides/vue-3'
import { Document } from '@blockslides/extension-document'
import { Paragraph } from '@blockslides/extension-paragraph'
import { Text } from '@blockslides/extension-text'

const editor = useEditor({
  extensions: [Document, Paragraph, Text],
  content: '<p>Hello world</p>',
  autofocus: true,
  editable: true
})
```

```html
<EditorContent v-if="editor" :editor="editor" />
```

### Configuration

```ts
import { useEditor } from '@blockslides/vue-3'
import { Document } from '@blockslides/extension-document'
import { Paragraph } from '@blockslides/extension-paragraph'
import { Text } from '@blockslides/extension-text'
import { Bold } from '@blockslides/extension-bold'
import { Italic } from '@blockslides/extension-italic'

const editor = useEditor({
  // Required: Extensions array
  extensions: [Document, Paragraph, Text, Bold, Italic],
  
  // Initial content
  content: '<p>Hello</p>',
  
  // Editor configuration
  autofocus: true,
  editable: true,
  editorProps: {
    attributes: {
      class: 'prose'
    }
  },
  
  // Lifecycle callbacks
  onCreate: ({ editor }) => {
    console.log('Created')
  },
  onUpdate: ({ editor, transaction }) => {
    console.log('Updated')
  }
})
```

**Parameters:**

All parameters from `EditorOptions` are supported, including:

- **extensions** (`AnyExtension[]`, required) - Array of extensions to use
- **content** (`string | JSONContent`) - Initial editor content
- **autofocus** (`boolean | 'start' | 'end' | number`) - Focus the editor on mount
- **editable** (`boolean`) - Whether the editor is editable
- **editorProps** (`EditorProps`) - ProseMirror EditorProps for advanced configuration
- **onCreate**, **onUpdate**, **onDestroy**, **onFocus**, **onBlur**, **onSelectionUpdate**, **onTransaction** - Lifecycle callbacks

**Returns:**

- `ShallowRef<Editor | undefined>` - Editor instance wrapped in a shallow ref, or `undefined` during initial render.

### useEditor vs useSlideEditor

| Feature | useEditor | useSlideEditor |
|---------|-----------|----------------|
| ExtensionKit included | ❌ No | ✅ Yes |
| Add-slide button | ❌ Manual | ✅ Built-in |
| Preset templates | ❌ Manual | ✅ Built-in |
| Return value | Editor ref only | Editor ref + presets |
| Use case | Custom editors | Slide presentations |

Use `useEditor` when you need full control over the extension stack. Use `useSlideEditor` for slide presentation editors with sensible defaults.

## Reactivity Patterns

Vue's reactivity system works seamlessly with Blockslides. The editor instance is returned as a `shallowRef`, which means Vue won't deeply watch internal ProseMirror state (for performance). Use `computed()` to derive reactive values from the editor.

### Building Reactive Toolbar Buttons

```ts
import { computed } from 'vue'
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()

// Derive reactive state
const isBold = computed(() => editor.value?.isActive('bold') ?? false)
const isItalic = computed(() => editor.value?.isActive('italic') ?? false)
const canUndo = computed(() => editor.value?.can().undo() ?? false)
const canRedo = computed(() => editor.value?.can().redo() ?? false)
```

```html
<div class="toolbar">
  <button 
    @click="editor?.chain().focus().toggleBold().run()"
    :class="{ active: isBold }"
    :disabled="!editor"
  >
    Bold
  </button>
  
  <button 
    @click="editor?.chain().focus().toggleItalic().run()"
    :class="{ active: isItalic }"
    :disabled="!editor"
  >
    Italic
  </button>
  
  <button 
    @click="editor?.chain().focus().undo().run()"
    :disabled="!canUndo"
  >
    Undo
  </button>
  
  <button 
    @click="editor?.chain().focus().redo().run()"
    :disabled="!canRedo"
  >
    Redo
  </button>
</div>
```

```css
.toolbar button.active {
  background-color: #0066ff;
  color: white;
}
```

### Watching Editor State

Use `watch` to react to editor changes:

```ts
import { ref, watch } from 'vue'
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()
const wordCount = ref(0)
const charCount = ref(0)

// Watch for editor updates
watch(editor, (editorInstance) => {
  if (!editorInstance) return
  
  // Set up update listener
  editorInstance.on('update', () => {
    const text = editorInstance.state.doc.textContent
    wordCount.value = text.split(/\s+/).filter(Boolean).length
    charCount.value = text.length
  })
  
  // Initial count
  const text = editorInstance.state.doc.textContent
  wordCount.value = text.split(/\s+/).filter(Boolean).length
  charCount.value = text.length
}, { immediate: true })
```

```html
<div class="stats">
  <span>{{ wordCount }} words</span>
  <span>{{ charCount }} characters</span>
</div>
```

### Computing Node Counts

```ts
import { computed } from 'vue'
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()

const slideCount = computed(() => {
  if (!editor.value) return 0
  
  let count = 0
  editor.value.state.doc.descendants(node => {
    if (node.type.name === 'slide') count++
  })
  return count
})

const imageCount = computed(() => {
  if (!editor.value) return 0
  
  let count = 0
  editor.value.state.doc.descendants(node => {
    if (node.type.name === 'image') count++
  })
  return count
})
```

```html
<div class="document-stats">
  <div>Slides: {{ slideCount }}</div>
  <div>Images: {{ imageCount }}</div>
</div>
```

### Performance Optimization

For frequently updating UI that depends on editor state, use `computed()` to avoid unnecessary recalculations:

```ts
import { computed } from 'vue'

const { editor } = useSlideEditor()

// Efficiently compute active states
const formattingState = computed(() => {
  if (!editor.value) {
    return {
      bold: false,
      italic: false,
      underline: false,
      strike: false
    }
  }
  
  return {
    bold: editor.value.isActive('bold'),
    italic: editor.value.isActive('italic'),
    underline: editor.value.isActive('underline'),
    strike: editor.value.isActive('strike')
  }
})
```

```html
<div class="toolbar">
  <button :class="{ active: formattingState.bold }">Bold</button>
  <button :class="{ active: formattingState.italic }">Italic</button>
  <button :class="{ active: formattingState.underline }">Underline</button>
  <button :class="{ active: formattingState.strike }">Strike</button>
</div>
```

### Reactive Content Binding

While you can't use `v-model` directly with the editor, you can create a two-way sync pattern:

```ts
import { ref, watch } from 'vue'
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const { editor } = useSlideEditor({
  content: props.modelValue,
  onChange: (doc) => {
    emit('update:modelValue', doc)
  }
})

// Sync external changes to editor
watch(() => props.modelValue, (newContent) => {
  if (!editor.value) return
  
  const currentContent = editor.value.getJSON()
  if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
    editor.value.commands.setContent(newContent, false)
  }
})
```

### Accessing Editor in Lifecycle Hooks

```ts
import { onMounted, onUnmounted } from 'vue'
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor()

onMounted(() => {
  // Editor is available in onMounted
  if (editor.value) {
    editor.value.commands.focus()
  }
})

onUnmounted(() => {
  // Cleanup is handled automatically, but you can do additional cleanup here
  console.log('Editor component unmounting')
})
```

### Custom Event Handlers

```ts
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor } = useSlideEditor({
  // Direct callback props
  onChange: (doc, editor) => {
    console.log('Content changed:', doc)
  },
  
  onUpdate: ({ editor, transaction }) => {
    console.log('Editor updated:', editor)
    console.log('Transaction:', transaction)
  },
  
  onEditorReady: (editor) => {
    console.log('Editor ready:', editor)
  },
  
  // Other lifecycle hooks via editorOptions
  editorOptions: {
    onCreate: ({ editor }) => {
      console.log('Editor created:', editor)
    },
    
    onSelectionUpdate: ({ editor }) => {
      console.log('Selection changed:', editor.state.selection)
    },
    
    onFocus: ({ editor, event }) => {
      console.log('Editor focused')
    },
    
    onBlur: ({ editor, event }) => {
      console.log('Editor blurred')
    },
    
    onDestroy: () => {
      console.log('Editor destroyed')
    }
  }
})
```

## Composing Multiple Editors

You can use multiple editor instances on the same page:

```ts
import { EditorContent, useSlideEditor } from '@blockslides/vue-3-prebuilts'

const { editor: editor1 } = useSlideEditor({
  content: content1
})

const { editor: editor2 } = useSlideEditor({
  content: content2
})
```

```html
<div class="multi-editor">
  <div class="editor-panel">
    <h3>Editor 1</h3>
    <EditorContent v-if="editor1" :editor="editor1" />
  </div>
  
  <div class="editor-panel">
    <h3>Editor 2</h3>
    <EditorContent v-if="editor2" :editor="editor2" />
  </div>
</div>
```

## TypeScript Support

All composables are fully typed:

```ts
import { useSlideEditor } from '@blockslides/vue-3-prebuilts'
import type { Editor, JSONContent } from '@blockslides/core'

const { editor, presets } = useSlideEditor({
  content: {
    type: 'doc',
    content: []
  } as JSONContent,
  
  onChange: (doc: JSONContent, editor: Editor) => {
    console.log('Changed:', doc)
  }
})

// editor has type: ShallowRef<Editor | undefined>
// presets has type: PresetTemplates
```
