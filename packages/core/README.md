# @autoartifacts/core

Core ProseMirror-based slide editor with essential features.

## Installation

```bash
npm install @autoartifacts/core
```

## Features

- ✅ Complete slide schema (nodes and marks)
- ✅ Rich command API
- ✅ Essential plugins (placeholder, add-slide-button)
- ✅ Layout system with flexible ratios
- ✅ Content validation
- ✅ Keyboard shortcuts
- ✅ Export utilities (JSON, HTML, Markdown, Text)
- ✅ Framework-agnostic

## Usage

```typescript
import { schema, actions, createPlaceholderPlugin } from '@autoartifacts/core';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// Create editor state
const state = EditorState.create({
  schema,
  plugins: [
    createPlaceholderPlugin(),
    // ... your plugins
  ]
});

// Create editor view
const view = new EditorView(document.querySelector('#editor'), {
  state
});
```

## API

See the [main documentation](../../README.md) for complete API reference.

