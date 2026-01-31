# Drag & Drop

Blockslides provides a complete drag and drop system for reordering content blocks and handling file uploads. The system consists of three main components: **DragHandle** for block reordering, **Dropcursor** for visual feedback, and **FileHandler** for file operations.

## Overview

The drag and drop functionality includes:

- **Block reordering** - Drag handles that appear next to blocks for intuitive reordering
- **Visual feedback** - Drop cursor showing where content will be placed
- **File handling** - Drag files from your file system directly into the editor
- **Multi-block selection** - Drag multiple selected blocks at once

All drag and drop extensions work together seamlessly to provide a polished editing experience.

## Installation

### Using ExtensionKit

The drop cursor is included in ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Drop cursor is enabled by default
      dropcursor: {
        color: '#3b82f6',
        width: 2
      }
    })
  ]
})
```

### Individual Extensions

For custom setups, import extensions individually:

```ts
import { DragHandle } from '@blockslides/extension-drag-handle'
import { Dropcursor } from '@blockslides/extensions'
import { FileHandler } from '@blockslides/extension-file-handler'

const editor = useSlideEditor({
  extensions: [
    DragHandle.configure({
      render: () => {
        const element = document.createElement('div')
        element.innerHTML = '⋮⋮'
        return element
      }
    }),
    Dropcursor.configure({
      color: '#3b82f6',
      width: 2
    }),
    FileHandler.configure({
      onDrop: (editor, files, pos) => {
        // Handle file drops
      }
    })
  ]
})
```

### Framework-Specific Drag Handles

Blockslides provides framework-specific implementations for the drag handle:

**React:**

```ts
import { DragHandle } from '@blockslides/extension-drag-handle-react'
```

**Vue 3:**

```ts
import { DragHandle } from '@blockslides/extension-drag-handle-vue-3'
```

**Vue 2:**

```ts
import { DragHandle } from '@blockslides/extension-drag-handle-vue-2'
```

## DragHandle Extension

The DragHandle extension adds interactive drag handles that appear next to content blocks when you hover over them. Users can drag these handles to reorder content.

### Basic Configuration

Configure the drag handle appearance and behavior:

```ts
DragHandle.configure({
  // Custom render function
  render: () => {
    const element = document.createElement('div')
    element.classList.add('my-drag-handle')
    element.innerHTML = '⋮⋮'
    return element
  },
  
  // Position configuration using floating-ui
  computePositionConfig: {
    placement: 'left-start',
    strategy: 'absolute'
  },
  
  // Lock the handle in place
  locked: false
})
```

**Options:**

- **render** (`() => HTMLElement`) - Function that returns the drag handle element
- **computePositionConfig** (`ComputePositionConfig`) - Floating-ui configuration for handle positioning
- **locked** (`boolean`) - When true, prevents the handle from being dragged
- **onNodeChange** (`(data: { node: Node | null; editor: Editor; pos: number }) => void`) - Callback fired when hovering over different nodes
- **onElementDragStart** (`(e: DragEvent) => void`) - Callback fired when drag starts
- **onElementDragEnd** (`(e: DragEvent) => void`) - Callback fired when drag ends

### React Implementation

Use the React-specific DragHandle component for better integration:

```tsx
import { DragHandle } from '@blockslides/extension-drag-handle-react'
import { useSlideEditor } from '@blockslides/react'

function Editor() {
  const editor = useSlideEditor({
    extensions: [/* your extensions */]
  })

  return (
    <>
      <EditorContent editor={editor} />
      <DragHandle editor={editor}>
        <div className="drag-handle-icon">⋮⋮</div>
      </DragHandle>
    </>
  )
}
```

**Props:**

- **editor** (required) - The editor instance
- **className** (`string`) - CSS class for the drag handle wrapper
- **pluginKey** (`PluginKey | string`) - Custom plugin key
- **computePositionConfig** (`ComputePositionConfig`) - Positioning configuration
- **onNodeChange** - Callback when hovering over different nodes
- **onElementDragStart** - Callback when drag starts
- **onElementDragEnd** - Callback when drag ends
- **children** - React children to render inside the drag handle

### Commands

The DragHandle extension provides commands to control its behavior:

```ts
// Lock the drag handle in place
editor.commands.lockDragHandle()

// Unlock the drag handle
editor.commands.unlockDragHandle()

// Toggle lock state
editor.commands.toggleDragHandle()
```

These commands are useful when you want to temporarily disable dragging, such as when a popup menu is open.

### Tracking Node Changes

Use the `onNodeChange` callback to track which node is being hovered:

```ts
DragHandle.configure({
  onNodeChange: ({ node, editor, pos }) => {
    if (node) {
      console.log('Hovering over:', node.type.name)
      console.log('Node position:', pos)
      // Update UI to show node-specific actions
    } else {
      console.log('Not hovering over any node')
    }
  }
})
```

### Drag Lifecycle Callbacks

Monitor the drag lifecycle with start and end callbacks:

```ts
DragHandle.configure({
  onElementDragStart: (e) => {
    // Fired when user starts dragging
    // Hide tooltips, close menus, etc.
  },
  
  onElementDragEnd: (e) => {
    // Fired when drag operation completes
    // Restore UI state
  }
})
```

### Custom Positioning

Control where the drag handle appears using floating-ui configuration:

```ts
DragHandle.configure({
  computePositionConfig: {
    placement: 'left-start',  // Position on left side
    strategy: 'absolute',
    middleware: [
      offset(5),  // 5px offset from the block
      flip(),     // Flip if not enough space
    ]
  }
})
```

## Dropcursor Extension

The Dropcursor extension displays a visual line indicator showing where content will be dropped when dragging between blocks.

### Configuration

Customize the drop cursor appearance:

```ts
Dropcursor.configure({
  // Cursor color
  color: '#3b82f6',
  
  // Cursor width in pixels
  width: 2,
  
  // CSS class for styling
  class: 'custom-drop-cursor'
})
```

**Options:**

- **color** (`string | false`) - CSS color value, or `false` to disable default color
- **width** (`number`) - Width in pixels (default: 1)
- **class** (`string`) - CSS class applied to the drop cursor element

### Styling with CSS

When using a custom class, style the drop cursor with CSS:

```ts
Dropcursor.configure({
  class: 'my-drop-cursor',
  color: false  // Disable default color
})
```

```css
.my-drop-cursor {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  height: 2px;
  border-radius: 1px;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}
```

### Disabling Drop Cursor

Disable the drop cursor in ExtensionKit:

```ts
ExtensionKit.configure({
  dropcursor: false
})
```

## FileHandler Extension

The FileHandler extension enables drag-and-drop and paste support for files like images and videos.

::: tip Full Documentation
For complete FileHandler documentation including setup, callbacks, and examples, see the [Media & Embeds](/features/working-with-content/media-embeds#file-handling) guide.
:::

## Drop Events

Blockslides fires a `drop` event whenever content is dropped in the editor, whether from dragging blocks or external content.

### Listening to Drop Events

Use the editor's event system to listen for drops:

```ts
const editor = useSlideEditor({
  onDrop: (event, slice, moved) => {
    // event - Native DragEvent
    // slice - ProseMirror Slice of dropped content
    // moved - Boolean indicating if content was moved within editor
    
    console.log('Content dropped:', slice)
    console.log('Was moved internally:', moved)
  }
})
```

Or subscribe after initialization:

```ts
editor.on('drop', ({ event, slice, moved }) => {
  // Handle drop event
})
```

### Drop Event Parameters

- **event** (`DragEvent`) - The native browser drag event
- **slice** (`Slice`) - ProseMirror slice containing the dropped content structure
- **moved** (`boolean`) - `true` if content was moved from within the same editor, `false` if from external source

### Use Cases

Drop events are useful for:

- **Analytics** - Track how users reorganize content
- **Validation** - Prevent drops in certain locations
- **Side effects** - Update related data when content moves

```ts
editor.on('drop', ({ event, slice, moved }) => {
  if (moved) {
    // Track internal reorganization
    analytics.track('content_reordered')
  } else {
    // Track external content drops
    analytics.track('content_dropped_from_external')
  }
})
```

## Multi-Block Dragging

The DragHandle extension supports dragging multiple blocks when they're selected:

1. Select multiple blocks using Shift+Click or Cmd/Ctrl+A
2. Drag any of the selected blocks' handles
3. All selected blocks move together

The drag handle automatically detects if it's within the current selection and drags all selected content.

## Styling

### Drag Handle Styles

Style the drag handle element returned by your `render` function:

```css
.my-drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: grab;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.my-drag-handle:hover {
  opacity: 1;
}

.my-drag-handle:active {
  cursor: grabbing;
}
```

### Drag State

The drag handle includes a `data-dragging` attribute that changes during drag operations:

```css
.drag-handle[data-dragging="true"] {
  opacity: 0.5;
}
```

### Drop Cursor Styles

Customize the drop cursor for your theme:

```css
.drop-cursor {
  background: linear-gradient(90deg, 
    transparent 0%, 
    #3b82f6 20%, 
    #3b82f6 80%, 
    transparent 100%
  );
  height: 2px;
  pointer-events: none;
}
```