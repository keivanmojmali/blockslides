/**
 * Actions API for AutoArtifacts
 *
 * Provides simple, declarative commands for interacting with the editor.
 * Each action takes an EditorView instance and performs an operation.
 *
 * Usage:
 *   import { actions } from 'autoartifacts';
 *   actions.bold(editorView);
 */

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { undo, redo } from "prosemirror-history";
import { toggleMark } from "prosemirror-commands";
import { MarkType } from "prosemirror-model";
import {
  nextSlide as navNextSlide,
  prevSlide as navPrevSlide,
  goToSlide as navGoToSlide,
  getSlideCount,
  getCurrentSlideIndex,
} from "../utils/slideNavigation";

/**
 * Helper function to check if a mark is active in current selection
 */
function isMarkActive(state: EditorState, markType: MarkType): boolean {
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    // If selection is empty, check stored marks or marks at cursor position
    return !!markType.isInSet(state.storedMarks || $from.marks());
  }

  // If selection has content, check if mark exists anywhere in selection
  return state.doc.rangeHasMark(from, to, markType);
}

/**
 * Undo the last change
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if undo was successful, false if nothing to undo
 *
 * @example
 * actions.undo(editorView);
 */
export function undoAction(view: EditorView | null): boolean {
  if (!view) {
    console.warn("[AutoArtifacts] Cannot undo: editor view is null");
    return false;
  }

  return undo(view.state, view.dispatch);
}

/**
 * Redo the last undone change
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if redo was successful, false if nothing to redo
 *
 * @example
 * actions.redo(editorView);
 */
export function redoAction(view: EditorView | null): boolean {
  if (!view) {
    console.warn("[AutoArtifacts] Cannot redo: editor view is null");
    return false;
  }

  return redo(view.state, view.dispatch);
}

/**
 * Toggle bold mark on current selection
 * If text is already bold, removes bold. If not bold, makes it bold.
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if action was successful
 *
 * @example
 * actions.bold(editorView);
 */
export function boldAction(view: EditorView | null): boolean {
  if (!view) {
    console.warn("[AutoArtifacts] Cannot toggle bold: editor view is null");
    return false;
  }

  const markType = view.state.schema.marks.bold;
  if (!markType) {
    console.warn("[AutoArtifacts] Bold mark type not found in schema");
    return false;
  }

  const command = toggleMark(markType);
  return command(view.state, view.dispatch);
}

/**
 * Toggle italic mark on current selection
 * If text is already italic, removes italic. If not italic, makes it italic.
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if action was successful
 *
 * @example
 * actions.italic(editorView);
 */
export function italicAction(view: EditorView | null): boolean {
  if (!view) {
    console.warn("[AutoArtifacts] Cannot toggle italic: editor view is null");
    return false;
  }

  const markType = view.state.schema.marks.italic;
  if (!markType) {
    console.warn("[AutoArtifacts] Italic mark type not found in schema");
    return false;
  }

  const command = toggleMark(markType);
  return command(view.state, view.dispatch);
}

/**
 * Add or update a link on the current selection
 * If selection already has a link, updates the href. Otherwise, adds new link.
 *
 * @param view - The ProseMirror EditorView instance
 * @param href - The URL for the link
 * @param title - Optional title attribute for the link
 * @returns true if action was successful
 *
 * @example
 * // Add link to selected text
 * actions.addLink(editorView, 'https://example.com');
 *
 * // Add link with title
 * actions.addLink(editorView, 'https://example.com', 'Example Site');
 */
export function addLinkAction(
  view: EditorView | null,
  href: string,
  title?: string
): boolean {
  if (!view) {
    console.warn("[AutoArtifacts] Cannot add link: editor view is null");
    return false;
  }

  if (!href) {
    console.warn("[AutoArtifacts] Cannot add link: href is required");
    return false;
  }

  const { state, dispatch } = view;
  const { selection } = state;
  const markType = state.schema.marks.link;

  if (!markType) {
    console.warn("[AutoArtifacts] Link mark type not found in schema");
    return false;
  }

  // If nothing is selected, can't add a link
  if (selection.empty) {
    console.warn("[AutoArtifacts] Cannot add link: no text selected");
    return false;
  }

  // Create the link mark with attributes
  const attrs = {
    href,
    title: title || null,
    target: "_blank",
  };

  // Add the link mark to the selection
  const tr = state.tr.addMark(
    selection.from,
    selection.to,
    markType.create(attrs)
  );

  dispatch(tr);
  return true;
}

/**
 * Remove link from current selection
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if action was successful
 *
 * @example
 * actions.removeLink(editorView);
 */
export function removeLinkAction(view: EditorView | null): boolean {
  if (!view) {
    console.warn("[AutoArtifacts] Cannot remove link: editor view is null");
    return false;
  }

  const { state, dispatch } = view;
  const { selection } = state;
  const markType = state.schema.marks.link;

  if (!markType) {
    console.warn("[AutoArtifacts] Link mark type not found in schema");
    return false;
  }

  // Remove the link mark from the selection
  const tr = state.tr.removeMark(selection.from, selection.to, markType);

  dispatch(tr);
  return true;
}

/**
 * Check if bold is active in current selection
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if bold is active
 */
export function isBoldActive(view: EditorView | null): boolean {
  if (!view) return false;
  const markType = view.state.schema.marks.bold;
  if (!markType) return false;
  return isMarkActive(view.state, markType);
}

/**
 * Check if italic is active in current selection
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if italic is active
 */
export function isItalicActive(view: EditorView | null): boolean {
  if (!view) return false;
  const markType = view.state.schema.marks.italic;
  if (!markType) return false;
  return isMarkActive(view.state, markType);
}

/**
 * Check if link is active in current selection
 *
 * @param view - The ProseMirror EditorView instance
 * @returns true if link is active
 */
export function isLinkActive(view: EditorView | null): boolean {
  if (!view) return false;
  const markType = view.state.schema.marks.link;
  if (!markType) return false;
  return isMarkActive(view.state, markType);
}

/**
 * Get the href of the link at current selection (if any)
 *
 * @param view - The ProseMirror EditorView instance
 * @returns href string if link is active, null otherwise
 */
export function getLinkHref(view: EditorView | null): string | null {
  if (!view) return null;

  const { state } = view;
  const { from, to } = state.selection;
  const markType = state.schema.marks.link;

  if (!markType) return null;

  let href: string | null = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (href) return false; // Already found, stop searching

    const linkMark = markType.isInSet(node.marks);
    if (linkMark) {
      href = linkMark.attrs.href;
      return false;
    }
  });

  return href;
}

/**
 * Navigate to next slide (presentation mode)
 *
 * @param editorElement - The editor DOM element
 * @param onSlideChange - Optional callback when slide changes
 */
export function nextSlideAction(
  editorElement: HTMLElement | null,
  onSlideChange?: (index: number) => void
): void {
  if (!editorElement) {
    console.warn("[AutoArtifacts] Cannot navigate: editor element is null");
    return;
  }
  navNextSlide(editorElement, onSlideChange);
}

/**
 * Navigate to previous slide (presentation mode)
 *
 * @param editorElement - The editor DOM element
 * @param onSlideChange - Optional callback when slide changes
 */
export function prevSlideAction(
  editorElement: HTMLElement | null,
  onSlideChange?: (index: number) => void
): void {
  if (!editorElement) {
    console.warn("[AutoArtifacts] Cannot navigate: editor element is null");
    return;
  }
  navPrevSlide(editorElement, onSlideChange);
}

/**
 * Go to specific slide (presentation mode)
 *
 * @param editorElement - The editor DOM element
 * @param slideIndex - Zero-based slide index
 * @param onSlideChange - Optional callback when slide changes
 */
export function goToSlideAction(
  editorElement: HTMLElement | null,
  slideIndex: number,
  onSlideChange?: (index: number) => void
): void {
  if (!editorElement) {
    console.warn("[AutoArtifacts] Cannot navigate: editor element is null");
    return;
  }
  navGoToSlide(editorElement, slideIndex, onSlideChange);
}

/**
 * Get total number of slides
 *
 * @param editorElement - The editor DOM element
 * @returns Number of slides
 */
export function getSlideCountAction(editorElement: HTMLElement | null): number {
  if (!editorElement) return 0;
  return getSlideCount(editorElement);
}

/**
 * Get current slide index (presentation mode)
 *
 * @param editorElement - The editor DOM element
 * @returns Current slide index (zero-based)
 */
export function getCurrentSlideAction(
  editorElement: HTMLElement | null
): number {
  if (!editorElement) return 0;
  return getCurrentSlideIndex(editorElement);
}

// Export all actions as a single object for convenience
export const actions = {
  undo: undoAction,
  redo: redoAction,
  bold: boldAction,
  italic: italicAction,
  addLink: addLinkAction,
  removeLink: removeLinkAction,
  isBoldActive,
  isItalicActive,
  isLinkActive,
  getLinkHref,
  // Navigation actions
  nextSlide: nextSlideAction,
  prevSlide: prevSlideAction,
  goToSlide: goToSlideAction,
  getSlideCount: getSlideCountAction,
  getCurrentSlide: getCurrentSlideAction,
};
