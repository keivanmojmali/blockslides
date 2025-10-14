# @autoartifacts/react

React components and hooks for AutoArtifacts slide editor.

## Installation

```bash
npm install @autoartifacts/react @autoartifacts/styles
```

## Components

### SlideEditor

Main editor component with full-featured slide editing.

```tsx
import { SlideEditor } from '@autoartifacts/react';
import '@autoartifacts/styles';

function App() {
  return (
    <SlideEditor
      content="<slide>...</slide>"
      onChange={(content) => console.log(content)}
      editable={true}
      theme="light"
    />
  );
}
```

### KeyboardShortcutsHelp

Modal showing available keyboard shortcuts.

```tsx
import { KeyboardShortcutsHelp } from '@autoartifacts/react';

<KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />
```

## Hooks

### useSlideEditor

Hook for managing editor instance.

```tsx
import { useSlideEditor } from '@autoartifacts/react';

const { ref, editor, currentSlide, totalSlides } = useSlideEditor({
  content: myContent,
  editable: true,
  onUpdate: (content) => console.log(content)
});

return <SlideEditor ref={ref} content={content} />;
```

### useHistoryState

Hook for tracking undo/redo state.

```tsx
import { useHistoryState } from '@autoartifacts/react';

const editorRef = useRef<SlideEditorRef>(null);
const { canUndo, canRedo, undoDepth, redoDepth } = useHistoryState(editorRef);

<button disabled={!canUndo} onClick={() => editorRef.current?.commands.undo()}>
  Undo ({undoDepth})
</button>
```

## Dependencies

- `@autoartifacts/core` - Core editor functionality
- `react` & `react-dom` (peer dependencies)

