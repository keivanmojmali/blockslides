// Export components
export { SlideEditor } from "./components/SlideEditor";
export { KeyboardShortcutsHelp } from "./components/KeyboardShortcutsHelp";

// Export hooks
export { useSlideEditor } from "./hooks/useSlideEditor";
export { useHistoryState } from "./hooks/useHistoryState";

// Export utilities
export { schema } from "./schema";
export { actions } from "./actions";

// Export plugins
export { createAddSlideButtonPlugin } from "./plugins/addSlideButtonPlugin";
export { createLayoutPickerPlugin } from "./plugins/layoutPickerPlugin";
export { createPlaceholderPlugin } from "./plugins/placeholderPlugin";
export { DEFAULT_LAYOUTS } from "./plugins/layoutPickerDefaults";
export type { LayoutTemplate } from "./plugins/layoutPickerDefaults";
export type { LayoutPickerOptions } from "./plugins/layoutPickerPlugin";

// Export control mode utilities
export { 
  isControlledMode, 
  isUncontrolledMode, 
  validateControlMode 
} from "./utils/controlMode";

// Export keyboard utilities
export { 
  DEFAULT_SHORTCUTS, 
  getKeyDisplay, 
  isMacOS 
} from "./keyboard/defaultShortcuts";

// Export validation (enhanced)
export { 
  validateContent, 
  isValidContent,
  getValidationIssues,
  safeValidateContent,
  ValidationError 
} from "./validation";

// Export serialization utilities
export { 
  exportToJSON, 
  exportToHTML, 
  exportToMarkdown, 
  exportToText,
  downloadFile 
} from './utils/exporters';

// Export selection utilities
export {
  getSelectionInfo,
  setTextSelection,
  selectAll,
  getSelectedText,
  isSelectionEmpty
} from './utils/selectionUtils';

// Export all types
export type {
  // Base types
  BaseNode,
  TextNode,
  Mark,

  // Content nodes
  DocNode,
  SlideNode,
  RowNode,
  ColumnNode,
  ParagraphNode,
  HeadingNode,
  ImageNode,
  VideoNode,
  BulletListNode,
  OrderedListNode,
  ListItemNode,

  // Union types
  BlockNode,
  InlineNode,
  ContentNode,

  // Marks
  BoldMark,
  ItalicMark,
  LinkMark,
  UnderlineMark,
  StrikethroughMark,
  CodeMark,
  TextColorMark,
  HighlightMark,

  // Component types
  SlideEditorProps,
  SlideEditorRef,
  
  // API types
  Commands,
  ChainedCommands,
  SelectionInfo,
  HistoryState,
  
  // Validation types
  ValidationIssue,
  ValidationResult,
  ValidationOptions,
  ContentValidator,
  
  // Navigation types
  NavigationOptions,
  SlideInfo,
  
  // Keyboard shortcuts types
  KeyboardShortcut,
  KeyboardShortcutsConfig,
  
  // Export types
  ExportFormat,
  ExportOptions,
  
  // Hook types
  UseSlideEditorOptions,
  UseSlideEditorReturn,
} from "./types";

// Export event types
export type {
  OnCreateParams,
  OnUpdateParams,
  OnContentChangeParams,
  OnSlideChangeParams,
  OnSelectionUpdateParams,
  OnFocusParams,
  OnBlurParams,
  OnTransactionParams,
  OnUndoParams,
  OnRedoParams
} from "./types/events";
