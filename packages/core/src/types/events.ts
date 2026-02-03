/**
 * Event parameter types for SlideEditor callbacks
 * 
 * These interfaces define the data passed to event handlers.
 */

import type { SlideEditorRef, DocNode } from './index';
import type { Transaction, Selection } from '@blockslides/pm/state';

/**
 * Parameters passed to onCreate callback
 * Fired after editor is fully initialized
 */
export interface OnCreateParams {
  editor: SlideEditorRef;
}

/**
 * Parameters passed to onUpdate callback
 * Fired on every transaction that changes the document
 */
export interface OnUpdateParams {
  editor: SlideEditorRef;
  transaction: Transaction;
}

/**
 * Parameters passed to onContentChange callback
 * Fired when document content changes
 */
export interface OnContentChangeParams {
  editor: SlideEditorRef;
  content: DocNode;
}

/**
 * Parameters passed to onSlideChange callback
 * Fired when active slide changes
 */
export interface OnSlideChangeParams {
  editor: SlideEditorRef;
  slideIndex: number;
  previousIndex: number;
}

/**
 * Parameters passed to onSelectionUpdate callback
 * Fired when selection changes
 */
export interface OnSelectionUpdateParams {
  editor: SlideEditorRef;
  selection: Selection;
}

/**
 * Parameters passed to onFocus callback
 * Fired when editor gains focus
 */
export interface OnFocusParams {
  editor: SlideEditorRef;
  event: FocusEvent;
}

/**
 * Parameters passed to onBlur callback
 * Fired when editor loses focus
 */
export interface OnBlurParams {
  editor: SlideEditorRef;
  event: FocusEvent;
}

/**
 * Parameters passed to onTransaction callback
 * Fired for every ProseMirror transaction
 */
export interface OnTransactionParams {
  editor: SlideEditorRef;
  transaction: Transaction;
}

/**
 * Parameters passed to onUndo callback
 * Fired after undo is performed
 */
export interface OnUndoParams {
  editor: SlideEditorRef;
}

/**
 * Parameters passed to onRedo callback
 * Fired after redo is performed
 */
export interface OnRedoParams {
  editor: SlideEditorRef;
}

