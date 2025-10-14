/**
 * History Utilities
 * 
 * Helper functions for working with ProseMirror history plugin.
 * Provides easy access to undo/redo state information.
 */

import { EditorView } from 'prosemirror-view';
import { undoDepth, redoDepth } from 'prosemirror-history';
import type { HistoryState } from '../types/index';

/**
 * Check if undo is available
 * 
 * @param view - The ProseMirror EditorView
 * @returns true if undo can be performed
 */
export function canUndo(view: EditorView): boolean {
  return undoDepth(view.state) > 0;
}

/**
 * Check if redo is available
 * 
 * @param view - The ProseMirror EditorView
 * @returns true if redo can be performed
 */
export function canRedo(view: EditorView): boolean {
  return redoDepth(view.state) > 0;
}

/**
 * Get the number of undo steps available
 * 
 * @param view - The ProseMirror EditorView
 * @returns Number of undo steps in the history stack
 */
export function getUndoDepth(view: EditorView): number {
  return undoDepth(view.state);
}

/**
 * Get the number of redo steps available
 * 
 * @param view - The ProseMirror EditorView
 * @returns Number of redo steps in the history stack
 */
export function getRedoDepth(view: EditorView): number {
  return redoDepth(view.state);
}

/**
 * Get complete history state
 * 
 * @param view - The ProseMirror EditorView
 * @returns Complete history state with all information
 */
export function getHistoryState(view: EditorView): HistoryState {
  return {
    canUndo: canUndo(view),
    canRedo: canRedo(view),
    undoDepth: getUndoDepth(view),
    redoDepth: getRedoDepth(view)
  };
}

/**
 * Clear history
 * 
 * Note: ProseMirror doesn't have a built-in clear history function.
 * This is a placeholder for future implementation.
 * 
 * @param view - The ProseMirror EditorView
 * @returns false (not implemented)
 */
export function clearHistory(_view: EditorView): boolean {
  console.warn('[AutoArtifacts] clearHistory is not fully implemented yet. ProseMirror does not provide a built-in method to clear history.');
  return false;
}

