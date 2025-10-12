/**
 * TypeScript Type Definitions for AutoArtifacts
 *
 * Export these types so developers get autocomplete and type safety
 */

import React from 'react';
import type {
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
} from './events';

// ===== BASE TYPES =====

/**
 * Base node structure
 */
export interface BaseNode {
  type: string;
  content?: ContentNode[];
  attrs?: Record<string, any>;
}

/**
 * Text node with optional marks
 */
export interface TextNode {
  type: "text";
  text: string;
  marks?: Mark[];
}

/**
 * Mark (text formatting)
 */
export interface Mark {
  type: string;
  attrs?: Record<string, any>;
}

// ===== CONTENT NODES =====

/**
 * Document node (root)
 */
export interface DocNode {
  type: "doc";
  content: SlideNode[];
}

/**
 * Slide node
 */
export interface SlideNode {
  type: "slide";
  attrs?: {
    className?: string;
  };
  content: RowNode[];
}

/**
 * Row node (horizontal container)
 */
export interface RowNode {
  type: "row";
  attrs?: {
    className?: string;
    layout?: string; // e.g., '2-1', '1-1-1'
  };
  content: (ColumnNode | BlockNode)[];
}

/**
 * Column node (vertical container)
 */
export interface ColumnNode {
  type: "column";
  attrs?: {
    className?: string;
    contentMode?: "default" | "cover" | "contain";
    verticalAlign?: "top" | "center" | "bottom";
    horizontalAlign?: "left" | "center" | "right";
    padding?: "none" | "small" | "medium" | "large";
  };
  content: (BlockNode | RowNode)[];
}

/**
 * Paragraph node
 */
export interface ParagraphNode {
  type: "paragraph";
  attrs?: {
    className?: string;
  };
  content?: (TextNode | InlineNode)[];
}

/**
 * Heading node
 */
export interface HeadingNode {
  type: "heading";
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
  };
  content?: (TextNode | InlineNode)[];
}

/**
 * Image node
 */
export interface ImageNode {
  type: "image";
  attrs: {
    src: string;
    alt?: string;
    width?: number | string;
    display?: "default" | "cover" | "contain" | "fill";
    align?: "left" | "center" | "right";
  };
}

/**
 * Video node
 */
export interface VideoNode {
  type: "video";
  attrs: {
    src: string;
    provider?: "youtube" | "vimeo" | "embed";
    width?: number | string;
    aspectRatio?: "16:9" | "4:3" | "1:1";
    align?: "left" | "center" | "right";
  };
}

/**
 * Bullet list node
 */
export interface BulletListNode {
  type: "bulletList";
  attrs?: {
    className?: string;
  };
  content: ListItemNode[];
}

/**
 * Ordered list node
 */
export interface OrderedListNode {
  type: "orderedList";
  attrs?: {
    className?: string;
    start?: number;
  };
  content: ListItemNode[];
}

/**
 * List item node
 */
export interface ListItemNode {
  type: "listItem";
  attrs?: {
    className?: string;
  };
  content: BlockNode[];
}

// ===== UNION TYPES =====

/**
 * Any block-level node
 */
export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | ImageNode
  | VideoNode
  | BulletListNode
  | OrderedListNode;

/**
 * Any inline-level node
 */
export type InlineNode = TextNode;

/**
 * Any content node
 */
export type ContentNode =
  | DocNode
  | SlideNode
  | RowNode
  | ColumnNode
  | BlockNode
  | InlineNode;

// ===== MARK TYPES =====

/**
 * Bold mark
 */
export interface BoldMark {
  type: "bold";
}

/**
 * Italic mark
 */
export interface ItalicMark {
  type: "italic";
}

/**
 * Link mark
 */
export interface LinkMark {
  type: "link";
  attrs: {
    href: string;
    title?: string;
    target?: string;
  };
}

/**
 * Underline mark
 */
export interface UnderlineMark {
  type: "underline";
}

/**
 * Strikethrough mark
 */
export interface StrikethroughMark {
  type: "strikethrough";
}

/**
 * Code mark (inline code)
 */
export interface CodeMark {
  type: "code";
}

/**
 * Text color mark
 */
export interface TextColorMark {
  type: "textColor";
  attrs: {
    color: string;
  };
}

/**
 * Highlight mark
 */
export interface HighlightMark {
  type: "highlight";
  attrs: {
    color: string;
  };
}

// ===== COMPONENT TYPES =====

/**
 * SlideEditor component props
 */
export interface SlideEditorProps {
  // CONTROLLED MODE: content + onChange
  content?: DocNode;                     // External content (controlled)
  onChange?: (content: DocNode) => void; // Called on every change (controlled)
  
  // UNCONTROLLED MODE: defaultContent only
  defaultContent?: DocNode;              // Initial content only (uncontrolled)
  editorTheme?: "light" | "dark" | string;
  editorStyles?: string;
  editorMode?: "edit" | "present" | "preview";
  readOnly?: boolean;
  
  // Add Slide Button Configuration
  showAddSlideButtons?: boolean;
  addSlideButtonClassName?: string;
  addSlideButtonStyle?: React.CSSProperties;
  addSlideButtonContent?: string;
  onAddSlideButtonClick?: (params: {
    slideIndex: number;
    buttonElement: HTMLElement;
    event: MouseEvent;
  }) => void;
  currentSlide?: number;
  onSlideChange?: (slideIndex: number) => void;
  onError?: (error: Error) => void;
  
  // Lifecycle Events
  onCreate?: (params: OnCreateParams) => void;
  onDestroy?: () => void;
  onUpdate?: (params: OnUpdateParams) => void;
  
  // Content Events
  onContentChange?: (params: OnContentChangeParams) => void;
  
  // Selection Events
  onSelectionUpdate?: (params: OnSelectionUpdateParams) => void;
  
  // Focus Events
  onFocus?: (params: OnFocusParams) => void;
  onBlur?: (params: OnBlurParams) => void;
  
  // Transaction Events
  onTransaction?: (params: OnTransactionParams) => void;
  
  // History Events
  onUndo?: (params: OnUndoParams) => void;
  onRedo?: (params: OnRedoParams) => void;
  
  // History Configuration
  historyDepth?: number;        // Max number of undo steps (default: 100)
  newGroupDelay?: number;       // Time (ms) before starting new undo group (default: 500)
  
  // Validation Configuration
  validationMode?: 'strict' | 'lenient' | 'off';  // Validation mode (default: lenient)
  autoFixContent?: boolean;                        // Auto-fix common issues (default: false)
  onValidationError?: (result: ValidationResult) => void;  // Called when validation fails
  
  // Keyboard Shortcuts Configuration
  keyboardShortcuts?: KeyboardShortcutsConfig;     // Custom keyboard shortcuts
  showShortcutsHelp?: boolean;                     // Show shortcuts help modal on mount
}

/**
 * Selection information
 */
export interface SelectionInfo {
  from: number;      // Start position of selection
  to: number;        // End position of selection
  empty: boolean;    // True if nothing is selected (cursor only)
  text: string;      // Selected text content
  isAtStart: boolean;        // Is cursor at document start?
  isAtEnd: boolean;          // Is cursor at document end?
  marks: string[];           // Active marks at selection
  nodeType?: string;         // Type of selected node (if node selection)
}

/**
 * History state information
 */
export interface HistoryState {
  canUndo: boolean;    // Can undo be performed?
  canRedo: boolean;    // Can redo be performed?
  undoDepth: number;   // Number of undo steps available
  redoDepth: number;   // Number of redo steps available
}

/**
 * Validation issue (error or warning)
 */
export interface ValidationIssue {
  type: 'error' | 'warning';
  path: string;              // JSON path like "content[0].content[1]"
  message: string;
  code: string;              // Error code like "MISSING_TYPE"
  expected?: any;            // What was expected
  received?: any;            // What was received
  autoFixable: boolean;      // Can this be auto-fixed?
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  fixed?: any;               // Auto-fixed content (if requested)
}

/**
 * Validation options
 */
export interface ValidationOptions {
  mode?: 'strict' | 'lenient';  // Strict fails on warnings too
  autoFix?: boolean;             // Attempt to auto-fix issues
  throwOnError?: boolean;        // Throw ValidationError on failure
}

/**
 * Validator interface for ref API
 */
export interface ContentValidator {
  validate: (content: any, options?: ValidationOptions) => ValidationResult;
  isValid: (content: any) => boolean;
  getIssues: (content: any) => ValidationIssue[];
}

/**
 * Navigation options for slide transitions
 */
export interface NavigationOptions {
  circular?: boolean;           // Enable wrap-around navigation
  transition?: 'none' | 'fade' | 'slide' | 'zoom';
  duration?: number;            // Animation duration in ms (default: 300)
}

/**
 * Slide info for navigation
 */
export interface SlideInfo {
  index: number;         // Current slide index (0-based)
  total: number;         // Total number of slides
  isFirst: boolean;      // Is this the first slide?
  isLast: boolean;       // Is this the last slide?
  canGoNext: boolean;    // Can navigate to next slide?
  canGoPrev: boolean;    // Can navigate to previous slide?
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  key: string;                    // e.g., 'Mod-b', 'Shift-Enter'
  command: string;                // Command name to execute
  description: string;            // Human-readable description
  category?: string;              // For grouping in help
}

/**
 * Keyboard shortcuts configuration
 */
export interface KeyboardShortcutsConfig {
  custom?: Record<string, KeyboardShortcut>;  // Add custom shortcuts
  disabled?: string[];                        // Disable specific shortcuts by key
  overrides?: Record<string, string>;         // Override default: key -> command name
}

/**
 * Export format types
 */
export type ExportFormat = 'json' | 'html' | 'markdown' | 'text';

/**
 * Export options
 */
export interface ExportOptions {
  pretty?: boolean;           // Pretty-print output (JSON)
  includeStyles?: boolean;    // Include CSS in HTML
  slideNumbers?: boolean;     // Add slide numbers (HTML)
}

/**
 * Commands API interface
 * All methods for controlling the editor programmatically
 */
export interface Commands {
  // Text formatting
  toggleBold: () => boolean;
  toggleItalic: () => boolean;
  toggleUnderline: () => boolean;
  toggleStrikethrough: () => boolean;
  toggleCode: () => boolean;
  setTextColor: (color: string) => boolean;
  setHighlight: (color: string) => boolean;
  removeTextColor: () => boolean;
  removeHighlight: () => boolean;
  
  // Headings
  setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
  toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
  setParagraph: () => boolean;
  
  // Links
  setLink: (href: string, title?: string) => boolean;
  updateLink: (href: string, title?: string) => boolean;
  removeLink: () => boolean;
  
  // Lists
  toggleBulletList: () => boolean;
  toggleOrderedList: () => boolean;
  
  // Media
  insertImage: (attrs: { src: string; alt?: string; width?: number | string }) => boolean;
  insertVideo: (attrs: { src: string; provider?: string; aspectRatio?: string }) => boolean;
  
  // Slides
  addSlide: (position?: 'before' | 'after' | 'end') => boolean;
  deleteSlide: (slideIndex?: number) => boolean;
  duplicateSlide: (slideIndex?: number) => boolean;
  
  // Slide navigation
  nextSlide: (options?: NavigationOptions) => void;
  prevSlide: (options?: NavigationOptions) => void;
  goToSlide: (slideIndex: number, options?: NavigationOptions) => void;
  goToFirstSlide: (options?: NavigationOptions) => void;
  goToLastSlide: (options?: NavigationOptions) => void;
  canGoNext: (circular?: boolean) => boolean;
  canGoPrev: (circular?: boolean) => boolean;
  getSlideInfo: () => SlideInfo;
  
  // Layouts
  setLayout: (layout: string) => boolean;
  
  // History
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getUndoDepth: () => number;
  getRedoDepth: () => number;
  getHistoryState: () => HistoryState;
  clearHistory: () => boolean;
  
  // Focus and selection
  focus: () => boolean;
  blur: () => boolean;
  selectAll: () => boolean;
  deleteSelection: () => boolean;
  
  // Selection commands
  setSelection: (from: number, to?: number) => boolean;
  selectSlide: (slideIndex: number) => boolean;
  collapseSelection: (toStart?: boolean) => boolean;
  expandSelection: () => boolean;
  getSelectedText: () => string;
  isSelectionEmpty: () => boolean;
  isAtStart: () => boolean;
  isAtEnd: () => boolean;
  
  // Content manipulation
  clearContent: () => boolean;
  
  // Chaining
  chain: () => ChainedCommands;
}

/**
 * Chainable commands interface
 * All commands return ChainedCommands for chaining
 */
export interface ChainedCommands {
  toggleBold: () => ChainedCommands;
  toggleItalic: () => ChainedCommands;
  toggleUnderline: () => ChainedCommands;
  toggleStrikethrough: () => ChainedCommands;
  toggleCode: () => ChainedCommands;
  setTextColor: (color: string) => ChainedCommands;
  setHighlight: (color: string) => ChainedCommands;
  removeTextColor: () => ChainedCommands;
  removeHighlight: () => ChainedCommands;
  
  setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => ChainedCommands;
  toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => ChainedCommands;
  setParagraph: () => ChainedCommands;
  
  setLink: (href: string, title?: string) => ChainedCommands;
  updateLink: (href: string, title?: string) => ChainedCommands;
  removeLink: () => ChainedCommands;
  
  toggleBulletList: () => ChainedCommands;
  toggleOrderedList: () => ChainedCommands;
  
  insertImage: (attrs: { src: string; alt?: string; width?: number | string }) => ChainedCommands;
  insertVideo: (attrs: { src: string; provider?: string; aspectRatio?: string }) => ChainedCommands;
  
  addSlide: (position?: 'before' | 'after' | 'end') => ChainedCommands;
  deleteSlide: (slideIndex?: number) => ChainedCommands;
  duplicateSlide: (slideIndex?: number) => ChainedCommands;
  
  nextSlide: (options?: NavigationOptions) => ChainedCommands;
  prevSlide: (options?: NavigationOptions) => ChainedCommands;
  goToSlide: (slideIndex: number, options?: NavigationOptions) => ChainedCommands;
  goToFirstSlide: (options?: NavigationOptions) => ChainedCommands;
  goToLastSlide: (options?: NavigationOptions) => ChainedCommands;
  
  setLayout: (layout: string) => ChainedCommands;
  
  undo: () => ChainedCommands;
  redo: () => ChainedCommands;
  
  focus: () => ChainedCommands;
  blur: () => ChainedCommands;
  selectAll: () => ChainedCommands;
  deleteSelection: () => ChainedCommands;
  
  setSelection: (from: number, to?: number) => ChainedCommands;
  selectSlide: (slideIndex: number) => ChainedCommands;
  collapseSelection: (toStart?: boolean) => ChainedCommands;
  expandSelection: () => ChainedCommands;
  
  clearContent: () => ChainedCommands;
  
  // Execute the command chain
  run: () => boolean;
}

/**
 * SlideEditor ref type
 */
export interface SlideEditorRef {
  view: any; // EditorView from prosemirror-view
  
  // Editability control
  setEditable: (editable: boolean) => void;
  isEditable: () => boolean;
  
  // State access methods
  getCurrentSlide: () => number;
  getTotalSlides: () => number;
  getSlideContent: (slideIndex: number) => SlideNode | null;
  getJSON: () => DocNode;
  getHTML: () => string;
  getText: () => string;
  isEmpty: () => boolean;
  isFocused: () => boolean;
  getSelection: () => SelectionInfo | null;
  
  // Commands API
  commands: Commands;
  
  // History state access (direct methods)
  canUndo: () => boolean;
  canRedo: () => boolean;
  getHistoryState: () => HistoryState;
  
  // Validation API
  validator: ContentValidator;
  
  // Content Management
  /**
   * Set content programmatically
   * Works best in uncontrolled mode
   * WARNING: In controlled mode, will be overwritten by next prop update
   */
  setContent: (content: DocNode) => void;
  
  // Export methods
  exportAs: (format: ExportFormat, options?: ExportOptions) => string;
  downloadAs: (format: ExportFormat, filename: string, options?: ExportOptions) => void;
  
  // Utility methods
  destroy: () => void;
  getElement: () => HTMLElement | null;
}

/**
 * Options for useSlideEditor hook
 */
export interface UseSlideEditorOptions {
  content: DocNode;
  editable?: boolean;
  onUpdate?: (content: DocNode) => void;
  onCreate?: (editor: SlideEditorRef) => void;
  onDestroy?: () => void;
}

/**
 * Return value from useSlideEditor hook
 */
export interface UseSlideEditorReturn {
  ref: React.RefObject<SlideEditorRef>;
  editor: SlideEditorRef | null;
  isEmpty: boolean;
  isFocused: boolean;
  currentSlide: number;
  totalSlides: number;
}
