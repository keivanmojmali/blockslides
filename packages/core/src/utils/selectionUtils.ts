/**
 * Selection & Range Utilities
 * 
 * Provides functions to programmatically control and query text selection:
 * - Get detailed selection information
 * - Set selection programmatically
 * - Select specific nodes (slides)
 * - Manipulate selection (expand, collapse)
 * - Query selection state
 */

import { EditorView } from 'prosemirror-view';
import { TextSelection, AllSelection, NodeSelection } from 'prosemirror-state';
import type { SelectionInfo } from '../types/index';

/**
 * Get enhanced selection information
 * @param view - ProseMirror editor view
 * @returns Detailed selection info
 */
export function getSelectionInfo(view: EditorView): SelectionInfo {
  const { state } = view;
  const { from, to, empty, $from } = state.selection;
  const text = state.doc.textBetween(from, to, ' ');
  
  // Get active marks at selection
  const marks: string[] = [];
  $from.marks().forEach(mark => marks.push(mark.type.name));
  
  // Check if at document boundaries
  const isAtStart = from === 0;
  const isAtEnd = to === state.doc.content.size;
  
  // Get node type if selecting a node
  let nodeType: string | undefined;
  if (state.selection instanceof NodeSelection) {
    nodeType = state.selection.node.type.name;
  }
  
  return {
    from,
    to,
    empty,
    text,
    isAtStart,
    isAtEnd,
    marks,
    nodeType
  };
}

/**
 * Set text selection range
 * @param view - ProseMirror editor view
 * @param from - Start position
 * @param to - End position (defaults to from for cursor)
 * @returns True if successful
 */
export function setTextSelection(
  view: EditorView,
  from: number,
  to?: number
): boolean {
  try {
    const { state, dispatch } = view;
    const maxPos = state.doc.content.size;
    
    // Default to cursor position if 'to' not provided
    const actualTo = to !== undefined ? to : from;
    
    // Clamp positions to valid range
    const clampedFrom = Math.max(0, Math.min(from, maxPos));
    const clampedTo = Math.max(0, Math.min(actualTo, maxPos));
    
    // Create text selection
    const selection = TextSelection.create(state.doc, clampedFrom, clampedTo);
    const tr = state.tr.setSelection(selection);
    dispatch(tr);
    return true;
  } catch (e) {
    console.warn('[AutoArtifacts] Failed to set selection:', e);
    return false;
  }
}

/**
 * Select all content in the document
 * @param view - ProseMirror editor view
 * @returns True if successful
 */
export function selectAll(view: EditorView): boolean {
  try {
    const { state, dispatch } = view;
    const selection = new AllSelection(state.doc);
    const tr = state.tr.setSelection(selection);
    dispatch(tr);
    return true;
  } catch (e) {
    console.warn('[AutoArtifacts] Failed to select all:', e);
    return false;
  }
}

/**
 * Collapse selection to start or end
 * @param view - ProseMirror editor view
 * @param toStart - Collapse to start (true) or end (false)
 * @returns True if successful
 */
export function collapseSelection(view: EditorView, toStart: boolean = true): boolean {
  try {
    const { state, dispatch } = view;
    const { from, to } = state.selection;
    const position = toStart ? from : to;
    
    const selection = TextSelection.create(state.doc, position);
    const tr = state.tr.setSelection(selection);
    dispatch(tr);
    return true;
  } catch (e) {
    console.warn('[AutoArtifacts] Failed to collapse selection:', e);
    return false;
  }
}

/**
 * Expand selection to parent node
 * Useful for selecting entire blocks
 * @param view - ProseMirror editor view
 * @returns True if successful
 */
export function expandSelection(view: EditorView): boolean {
  try {
    const { state, dispatch } = view;
    const { $from, $to } = state.selection;
    
    // Find the shared depth
    const depth = $from.sharedDepth($to.pos);
    if (depth === 0) {
      // Already at top level, can't expand further
      return false;
    }
    
    // Get positions before and after the parent node at this depth
    const $start = state.doc.resolve($from.before(depth));
    const $end = state.doc.resolve($to.after(depth));
    
    const selection = TextSelection.create(state.doc, $start.pos, $end.pos);
    const tr = state.tr.setSelection(selection);
    dispatch(tr);
    return true;
  } catch (e) {
    console.warn('[AutoArtifacts] Failed to expand selection:', e);
    return false;
  }
}

/**
 * Get selected text
 * @param view - ProseMirror editor view
 * @returns Selected text or empty string
 */
export function getSelectedText(view: EditorView): string {
  const { from, to } = view.state.selection;
  return view.state.doc.textBetween(from, to, ' ');
}

/**
 * Check if selection is empty (cursor only)
 * @param view - ProseMirror editor view
 * @returns True if empty
 */
export function isSelectionEmpty(view: EditorView): boolean {
  return view.state.selection.empty;
}

/**
 * Check if cursor/selection is at document start
 * @param view - ProseMirror editor view
 * @returns True if at start
 */
export function isAtDocStart(view: EditorView): boolean {
  return view.state.selection.from === 0;
}

/**
 * Check if cursor/selection is at document end
 * @param view - ProseMirror editor view
 * @returns True if at end
 */
export function isAtDocEnd(view: EditorView): boolean {
  return view.state.selection.to === view.state.doc.content.size;
}

/**
 * Select a specific slide by index
 * @param view - ProseMirror editor view
 * @param slideIndex - Zero-based slide index
 * @returns True if successful
 */
export function selectSlide(view: EditorView, slideIndex: number): boolean {
  try {
    let currentIndex = 0;
    let slidePos = -1;
    let slideSize = 0;
    
    // Find the slide at the specified index
    view.state.doc.forEach((node, offset) => {
      if (node.type.name === 'slide') {
        if (currentIndex === slideIndex) {
          slidePos = offset;
          slideSize = node.nodeSize;
          return false; // Stop iterating
        }
        currentIndex++;
      }
    });
    
    if (slidePos === -1) {
      console.warn(`[AutoArtifacts] Slide ${slideIndex} not found`);
      return false;
    }
    
    // Select the entire slide
    return setTextSelection(view, slidePos, slidePos + slideSize);
  } catch (e) {
    console.warn('[AutoArtifacts] Failed to select slide:', e);
    return false;
  }
}

