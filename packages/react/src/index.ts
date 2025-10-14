// Components
export { SlideEditor } from './components/SlideEditor';
export type { SlideEditorProps } from './components/SlideEditor';
export { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';

// Hooks
export { useSlideEditor } from './hooks/useSlideEditor';
export { useHistoryState } from './hooks/useHistoryState';

// Re-export core types for convenience
export type {
  Commands,
  ChainedCommands,
  NavigationOptions,
  EditorEvents,
  SlideNode,
  RowNode,
  ColumnNode,
  SlideEditorOptions,
  DocNode
} from '@autoartifacts/core';

// Re-export Extension system for users who want to create extensions
export { Extension, ExtensionManager } from '@autoartifacts/core';

// Re-export SlideEditor class as SlideEditorCore to avoid naming conflict
export { SlideEditor as SlideEditorCore } from '@autoartifacts/core';

