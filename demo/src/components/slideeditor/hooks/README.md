# useSlideEditor Hook

A custom React hook for creating and managing a SlideEditor instance in your application.

## Features

- ✅ Simple API with sensible defaults
- ✅ Content management (initial content, updates)
- ✅ Read-only mode support
- ✅ Auto-focus configuration
- ✅ Custom extension support
- ✅ Global editor instance for debugging
- ✅ TypeScript support

## Basic Usage

```typescript
import { useSlideEditor } from '@/components/slideeditor/hooks/useSlideEditor'

function MyEditor() {
  const { editor } = useSlideEditor()
  
  return <EditorContent editor={editor} />
}
```

## With ExtensionKit

```typescript
import { useSlideEditor } from '@/components/slideeditor/hooks/useSlideEditor'
import { ExtensionKit } from '@autoartifacts/extension-kit'

function MyEditor() {
  const { editor } = useSlideEditor({
    extensions: [
      ExtensionKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        placeholder: { placeholder: 'Start typing...' },
      })
    ]
  })
  
  return <EditorContent editor={editor} />
}
```

## With Content Updates

```typescript
function MyEditor() {
  const [content, setContent] = useState<string>('')
  
  const { editor } = useSlideEditor({
    content: initialContent,
    onUpdate: (updatedContent) => {
      setContent(updatedContent)
      // Save to database, etc.
    }
  })
  
  return <EditorContent editor={editor} />
}
```

## Read-Only Mode

```typescript
function MyEditor() {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { editor } = useSlideEditor({
    generating: isGenerating, // Editor becomes read-only when true
  })
  
  return (
    <>
      <button onClick={() => setIsGenerating(true)}>
        Start AI Generation
      </button>
      <EditorContent editor={editor} />
    </>
  )
}
```

## API Reference

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | `string \| object` | `undefined` | Initial content for the editor |
| `initialResponse` | `string` | `undefined` | Alternative to content (for SSE/streaming) |
| `onUpdate` | `(content: string) => void` | `undefined` | Called when content changes |
| `generating` | `boolean` | `false` | If true, editor is read-only |
| `extensions` | `AnyExtension[]` | `[ExtensionKit]` | Extensions to include |
| `autofocus` | `boolean` | `true` | Whether to auto-focus on mount |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `editor` | `Editor \| null` | The editor instance |

## Examples

### Minimal Editor

```typescript
const { editor } = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Only basic text editing
      bold: {},
      italic: {},
      paragraph: {},
      
      // Exclude everything else
      heading: false,
      link: false,
      image: false,
    })
  ]
})
```

### Presentation Editor

```typescript
const { editor } = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Slide support
      slide: {},
      addSlideButton: {},
      
      // Formatting
      heading: { levels: [1, 2] },
      bold: {},
      italic: {},
      bulletList: {},
      
      // Media
      image: { inline: true },
    })
  ]
})
```

### With Persistence

```typescript
function PersistentEditor({ documentId }: { documentId: string }) {
  const [initialContent, setInitialContent] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Load content on mount
  useEffect(() => {
    fetch(`/api/documents/${documentId}`)
      .then(res => res.json())
      .then(data => setInitialContent(data.content))
  }, [documentId])
  
  const { editor } = useSlideEditor({
    content: initialContent,
    onUpdate: async (content) => {
      setIsSaving(true)
      await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      })
      setIsSaving(false)
    }
  })
  
  return (
    <div>
      {isSaving && <span>Saving...</span>}
      <EditorContent editor={editor} />
    </div>
  )
}
```

## Notes

- The editor instance is exposed globally as `window.editor` for debugging
- Content updates are called on every transaction (debouncing coming soon)
- The hook uses `immediatelyRender: false` to avoid SSR hydration issues
- Extensions default to `ExtensionKit` if none provided

## Future Improvements

- [ ] Add debounce extension for performance optimization
- [ ] Add unsaved changes indicator
- [ ] Add collaboration support
- [ ] Add AI integration hooks
