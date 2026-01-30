# Hooks

Blockslides provides React hooks for creating and managing editor instances, subscribing to state changes, and accessing editor context throughout your component tree.

## useSlideEditor

The primary hook for initializing a slide editor with the ExtensionKit bundle. This hook handles all the configuration needed for a fully-featured slide editor.

```tsx
import { useSlideEditor } from '@blockslides/react'

function Editor() {
  const { editor, presets } = useSlideEditor({
    content: initialContent,
    onChange: (doc, editor) => {
      console.log('Content changed:', doc)
    }
  })

  return <EditorContent editor={editor} />
}
```

### Configuration

```tsx
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
  
  // SSR configuration
  immediatelyRender: false,
  
  // Theme (applies CSS class)
  theme: 'light',
  
  // Lifecycle hooks
  onEditorReady: (editor) => {
    console.log('Editor initialized')
  },
  
  // Dependencies for re-instantiation
  deps: []
})
```

**Parameters:**

- **content** (`JSONContent`) - Initial document content. Omit to start with a default blank slide.
- **onChange** (`(doc: JSONContent, editor: Editor) => void`) - Callback fired after each update with the current document JSON.
- **extensions** (`AnyExtension[]`) - Additional extensions appended after ExtensionKit.
- **extensionKitOptions** (`ExtensionKitOptions`) - Customize ExtensionKit configuration or disable specific extensions.
- **presetTemplates** (`PresetTemplates`) - Custom template list for the add-slide button. Defaults to built-in presets.
- **immediatelyRender** (`boolean`) - Set to `false` for SSR to prevent hydration mismatches.
- **shouldRerenderOnTransaction** (`boolean`) - Legacy mode that re-renders on every transaction. Defaults to `false`.
- **theme** (`'light' | 'dark'`) - Theme name applied as CSS class to editor.
- **editorProps** (`EditorProps`) - ProseMirror EditorProps for advanced configuration.
- **deps** (`DependencyList`) - Dependencies array that triggers editor re-instantiation when changed. Leave empty to prevent recreation.
- **onEditorReady** (`(editor: Editor) => void`) - Called once when the editor instance is ready.
- **onUpdate** - Additional update callback (runs alongside `onChange`).
- **onCreate**, **onBeforeCreate**, **onDestroy**, **onFocus**, **onBlur**, **onSelectionUpdate**, **onTransaction** - Standard editor lifecycle hooks.

**Returns:**

- **editor** (`Editor | null`) - The editor instance, or `null` during SSR or initial render with `immediatelyRender: false`.
- **presets** - Preset templates list used by the add-slide button.

### Server-Side Rendering

For SSR frameworks like Next.js, set `immediatelyRender: false` to avoid hydration errors:

```tsx
const { editor } = useSlideEditor({
  immediatelyRender: false,
  content: initialContent
})

// Editor will be null on the server
if (!editor) {
  return <div>Loading editor...</div>
}
```

### Managing Updates

The hook provides two ways to capture content changes:

**onChange callback:**

```tsx
const { editor } = useSlideEditor({
  onChange: (doc, editor) => {
    // Receives JSON on every update
    autosave(doc)
  }
})
```

**Manual extraction:**

```tsx
const { editor } = useSlideEditor({
  onEditorReady: (editor) => {
    editor.on('update', () => {
      const json = editor.getJSON()
      const html = editor.getHTML()
    })
  }
})
```

### Customizing ExtensionKit

Configure or disable individual ExtensionKit extensions:

```tsx
const { editor } = useSlideEditor({
  extensionKitOptions: {
    // Disable specific extensions
    youtube: false,
    bubbleMenu: false,
    
    // Configure extensions
    fileHandler: {
      onDrop: (editor, files, pos) => {
        handleFileUpload(files, pos)
      },
      allowedMimeTypes: ['image/jpeg', 'image/png']
    },
    
    // Configure add-slide button
    addSlideButton: {
      showPresets: true,
      presetBackground: '#1e293b',
      presetForeground: '#f1f5f9'
    },
    
    // Configure slide extension
    slide: {
      renderMode: 'dynamic',
      hoverOutline: { 
        color: '#3b82f6', 
        width: '2px' 
      }
    }
  }
})
```

### Adding Custom Extensions

Extend the editor with your own extensions:

```tsx
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

### Controlling Re-instantiation

By default, the editor instance persists across re-renders. Use `deps` to control when the editor is destroyed and recreated:

```tsx
// Never recreate (default)
const { editor } = useSlideEditor({
  extensions: [MyExtension]
})

// Recreate when userId changes
const { editor } = useSlideEditor({
  extensions: [MyExtension],
  deps: [userId]
})
```

Without `deps`, changing `extensions` or other options will update the existing editor instance without recreating it. This is faster but may not work for all configuration changes.

## useEditor

Lower-level hook for creating an editor instance without ExtensionKit. Use this when building a custom editor from scratch.

```tsx
import { useEditor } from '@blockslides/react'
import { Document, Paragraph, Text } from '@blockslides/extensions'

function Editor() {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    content: '<p>Hello world</p>'
  })

  return <EditorContent editor={editor} />
}
```

### Configuration

```tsx
const editor = useEditor({
  // Required: Extensions array
  extensions: [Document, Paragraph, Text, Bold, Italic],
  
  // Initial content
  content: '<p>Hello</p>',
  
  // SSR configuration
  immediatelyRender: false,
  
  // Re-render on every transaction (legacy mode)
  shouldRerenderOnTransaction: false,
  
  // Lifecycle callbacks
  onCreate: ({ editor }) => {
    console.log('Created')
  },
  onUpdate: ({ editor, transaction }) => {
    console.log('Updated')
  },
  
  // Editor configuration
  editable: true,
  editorProps: {
    attributes: {
      class: 'prose'
    }
  }
}, [/* deps */])
```

**Parameters:**

All parameters from `EditorOptions` plus:

- **immediatelyRender** (`boolean`) - Set `false` for SSR compatibility.
- **shouldRerenderOnTransaction** (`boolean`) - Enable legacy re-render behavior. Defaults to `false`.

**Returns:**

- `Editor | null` - Editor instance, or `null` during SSR.

### useEditor vs useSlideEditor

| Feature | useEditor | useSlideEditor |
|---------|-----------|----------------|
| ExtensionKit included | ❌ No | ✅ Yes |
| Add-slide button | ❌ Manual | ✅ Built-in |
| Preset templates | ❌ Manual | ✅ Built-in |
| Return value | Editor only | Editor + presets |
| Use case | Custom editors | Slide presentations |

Use `useEditor` when you need full control over the extension stack. Use `useSlideEditor` for slide presentation editors with sensible defaults.

## useEditorState

Subscribe to specific parts of editor state and re-render only when those parts change. This hook is essential for building reactive UI components that respond to editor changes.

```tsx
import { useEditorState } from '@blockslides/react'

function BoldButton({ editor }) {
  const { isBold } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor.isActive('bold')
    })
  })

  return (
    <button 
      onClick={() => editor.chain().focus().toggleBold().run()}
      data-active={isBold}
    >
      Bold
    </button>
  )
}
```

### Selector Function

The selector receives a snapshot containing the editor instance and transaction number:

```tsx
const state = useEditorState({
  editor,
  selector: ({ editor, transactionNumber }) => {
    return {
      // Subscribe to specific state
      selection: editor.state.selection,
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
      wordCount: editor.state.doc.textContent.split(/\s+/).length
    }
  }
})
```

The component only re-renders when the returned value changes, determined by deep equality comparison.

### Custom Equality Function

Provide a custom equality function for fine-grained control:

```tsx
const { selection } = useEditorState({
  editor,
  selector: ({ editor }) => ({
    selection: editor.state.selection
  }),
  equalityFn: (a, b) => {
    // Only re-render if selection position changed
    return a.selection.from === b.selection.from && 
           a.selection.to === b.selection.to
  }
})
```

### Performance Optimization

Use `useEditorState` to prevent unnecessary re-renders when building toolbar components:

```tsx
function Toolbar({ editor }) {
  // Each button subscribes to only its own state
  return (
    <div>
      <BoldButton editor={editor} />
      <ItalicButton editor={editor} />
      <UndoButton editor={editor} />
    </div>
  )
}

function BoldButton({ editor }) {
  // Only re-renders when bold state changes
  const isBold = useEditorState({
    editor,
    selector: ({ editor }) => editor.isActive('bold')
  })

  return (
    <button onClick={() => editor.chain().focus().toggleBold().run()}>
      {isBold ? 'Bold ✓' : 'Bold'}
    </button>
  )
}

function ItalicButton({ editor }) {
  // Only re-renders when italic state changes
  const isItalic = useEditorState({
    editor,
    selector: ({ editor }) => editor.isActive('italic')
  })

  return (
    <button onClick={() => editor.chain().focus().toggleItalic().run()}>
      {isItalic ? 'Italic ✓' : 'Italic'}
    </button>
  )
}
```

Without `useEditorState`, all toolbar buttons would re-render on every editor transaction.

### Transaction Number

Access the transaction number for debugging or tracking changes:

```tsx
const { count } = useEditorState({
  editor,
  selector: ({ transactionNumber }) => ({
    count: transactionNumber
  })
})

console.log(`${count} transactions executed`)
```

### Multiple Selectors

Call `useEditorState` multiple times with different selectors for granular subscriptions:

```tsx
function EditorStats({ editor }) {
  const wordCount = useEditorState({
    editor,
    selector: ({ editor }) => 
      editor.state.doc.textContent.split(/\s+/).filter(Boolean).length
  })

  const charCount = useEditorState({
    editor,
    selector: ({ editor }) => 
      editor.state.doc.textContent.length
  })

  const slideCount = useEditorState({
    editor,
    selector: ({ editor }) => {
      let count = 0
      editor.state.doc.descendants(node => {
        if (node.type.name === 'slide') count++
      })
      return count
    }
  })

  return (
    <div>
      <span>{wordCount} words</span>
      <span>{charCount} characters</span>
      <span>{slideCount} slides</span>
    </div>
  )
}
```

## useCurrentEditor

Access the editor instance from context when using `EditorProvider`. This enables editor access deep in the component tree without prop drilling.

```tsx
import { EditorProvider, useCurrentEditor } from '@blockslides/react'

function App() {
  return (
    <EditorProvider 
      extensions={[/* extensions */]}
      content="<p>Hello</p>"
    >
      <Toolbar />
      <Sidebar />
    </EditorProvider>
  )
}

function Toolbar() {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  return (
    <button onClick={() => editor.chain().focus().toggleBold().run()}>
      Bold
    </button>
  )
}

function Sidebar() {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  return (
    <div>
      Word count: {editor.state.doc.textContent.split(/\s+/).length}
    </div>
  )
}
```

**Returns:**

- **editor** (`Editor | null`) - Current editor instance from context, or `null` if outside provider.

### EditorProvider

The `EditorProvider` component creates an editor and makes it available to child components:

```tsx
<EditorProvider
  extensions={[Document, Paragraph, Text]}
  content="<p>Initial content</p>"
  immediatelyRender={false}
  onCreate={({ editor }) => {
    console.log('Editor created')
  }}
>
  <YourComponents />
</EditorProvider>
```

`EditorProvider` accepts all `useEditor` options and renders `EditorContent` automatically. The editor instance is accessible via `useCurrentEditor` anywhere in the tree.

### Slots

Add content before or after the editor:

```tsx
<EditorProvider
  extensions={[/* extensions */]}
  slotBefore={<MenuBar />}
  slotAfter={<StatusBar />}
>
  <FloatingToolbar />
</EditorProvider>
```

- **slotBefore** - Rendered before editor content
- **slotAfter** - Rendered after editor content
- **children** - Rendered after slotAfter

### Editor Container Props

Customize the `EditorContent` wrapper:

```tsx
<EditorProvider
  extensions={[/* extensions */]}
  editorContainerProps={{
    className: 'prose max-w-none',
    style: { minHeight: '500px' }
  }}
/>
```

## useReactNodeView

Access React node view context when building custom node views. This hook provides callbacks for drag handling and content rendering.

```tsx
import { useReactNodeView } from '@blockslides/react'

function MyCustomNodeView() {
  const { onDragStart, nodeViewContentRef, nodeViewContentChildren } = useReactNodeView()

  return (
    <div draggable onDragStart={onDragStart}>
      <div ref={nodeViewContentRef}>
        {nodeViewContentChildren}
      </div>
    </div>
  )
}
```

**Returns:**

- **onDragStart** (`(event: DragEvent) => void`) - Callback to handle drag start events
- **nodeViewContentRef** (`(element: HTMLElement | null) => void`) - Ref callback for the content container
- **nodeViewContentChildren** (`ReactNode`) - Children to render inside the node view content

This hook is used internally by `NodeViewWrapper` and `NodeViewContent` components. Most custom node views should use those components instead of calling this hook directly.

## Pattern: Form Controls

Build form controls that sync with editor state:

```tsx
function HeadingLevelSelect({ editor }) {
  const level = useEditorState({
    editor,
    selector: ({ editor }) => {
      const attrs = editor.getAttributes('heading')
      return attrs.level || 0
    }
  })

  return (
    <select
      value={level}
      onChange={(e) => {
        const newLevel = parseInt(e.target.value)
        if (newLevel === 0) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().setHeading({ level: newLevel }).run()
        }
      }}
    >
      <option value={0}>Paragraph</option>
      <option value={1}>Heading 1</option>
      <option value={2}>Heading 2</option>
      <option value={3}>Heading 3</option>
    </select>
  )
}
```

## Pattern: Real-time Collaboration UI

Track active users and cursor positions:

```tsx
function CollaboratorsList({ editor }) {
  const collaborators = useEditorState({
    editor,
    selector: ({ editor }) => 
      editor.storage.collaborationCursor?.users || []
  })

  return (
    <div>
      {collaborators.map(user => (
        <div key={user.clientId}>
          <span style={{ color: user.color }}>{user.name}</span>
        </div>
      ))}
    </div>
  )
}
```

## Pattern: Content Statistics

Display live document statistics:

```tsx
function DocumentStats({ editor }) {
  const stats = useEditorState({
    editor,
    selector: ({ editor }) => {
      const doc = editor.state.doc
      let words = 0
      let chars = 0
      let images = 0

      doc.descendants(node => {
        if (node.isText) {
          const text = node.text || ''
          chars += text.length
          words += text.split(/\s+/).filter(Boolean).length
        }
        if (node.type.name === 'image' || node.type.name === 'imageBlock') {
          images++
        }
      })

      return { words, chars, images }
    }
  })

  return (
    <aside>
      <dl>
        <dt>Words</dt>
        <dd>{stats.words}</dd>
        
        <dt>Characters</dt>
        <dd>{stats.chars}</dd>
        
        <dt>Images</dt>
        <dd>{stats.images}</dd>
      </dl>
    </aside>
  )
}
```
