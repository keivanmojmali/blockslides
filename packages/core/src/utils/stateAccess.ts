/**
 * State Access API
 * 
 * Utility functions for reading editor state without modifying it.
 * These provide a clean, user-friendly interface to ProseMirror's internal state.
 */

import { EditorView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { DOMSerializer } from 'prosemirror-model';
import type { SlideNode, DocNode, SelectionInfo } from '../types/index';
import { getSelectionInfo as getSelectionInfoUtil } from './selectionUtils';

/**
 * Get the current slide index based on cursor position
 * 
 * @param view - The ProseMirror EditorView
 * @returns Zero-based index of the current slide
 */
export function getCurrentSlideIndex(view: EditorView): number {
  const { $from } = view.state.selection;
  
  // Walk up the document tree to find the slide node
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'slide') {
      // Count how many slides come before this one
      const parent = $from.node(depth - 1);
      let slideIndex = 0;
      
      for (let i = 0; i < $from.index(depth - 1); i++) {
        if (parent.child(i).type.name === 'slide') {
          slideIndex++;
        }
      }
      
      return slideIndex;
    }
  }
  
  // Default to first slide if not found
  return 0;
}

/**
 * Get total number of slides in the document
 * 
 * @param view - The ProseMirror EditorView
 * @returns Total slide count
 */
export function getTotalSlides(view: EditorView): number {
  let count = 0;
  
  view.state.doc.forEach((node) => {
    if (node.type.name === 'slide') {
      count++;
    }
  });
  
  return count;
}

/**
 * Get the content of a specific slide as JSON
 * 
 * @param view - The ProseMirror EditorView
 * @param slideIndex - Zero-based slide index
 * @returns SlideNode JSON or null if not found
 */
export function getSlideContent(view: EditorView, slideIndex: number): SlideNode | null {
  let currentIndex = 0;
  let slideNode: ProseMirrorNode | undefined;
  
  view.state.doc.forEach((node) => {
    if (node.type.name === 'slide') {
      if (currentIndex === slideIndex) {
        slideNode = node;
        return false; // Stop iteration
      }
      currentIndex++;
    }
  });
  
  if (!slideNode) return null;
  
  return slideNode.toJSON() as SlideNode;
}

/**
 * Get the full document as ProseMirror JSON
 * 
 * @param view - The ProseMirror EditorView
 * @returns Complete document as DocNode
 */
export function getDocumentJSON(view: EditorView): DocNode {
  return view.state.doc.toJSON() as DocNode;
}

/**
 * Get the document as HTML string
 * 
 * @param view - The ProseMirror EditorView
 * @returns HTML string representation
 */
export function getDocumentHTML(view: EditorView): string {
  const div = document.createElement('div');
  
  // Use ProseMirror's DOMSerializer to convert to HTML
  const serializer = DOMSerializer.fromSchema(view.state.schema);
  const domFragment = serializer.serializeFragment(view.state.doc.content);
  
  div.appendChild(domFragment);
  return div.innerHTML;
}

/**
 * Get plain text content of the document
 * 
 * @param view - The ProseMirror EditorView
 * @returns Plain text without formatting
 */
export function getDocumentText(view: EditorView): string {
  return view.state.doc.textContent;
}

/**
 * Check if the document is empty
 * 
 * A document is considered empty if it has no text content and no media.
 * 
 * @param view - The ProseMirror EditorView
 * @returns true if document is empty
 */
export function isDocumentEmpty(view: EditorView): boolean {
  // Check for text content
  const text = view.state.doc.textContent.trim();
  if (text.length > 0) return false;
  
  // Check for media nodes (images, videos)
  let hasMedia = false;
  view.state.doc.descendants((node) => {
    if (node.type.name === 'image' || node.type.name === 'video') {
      hasMedia = true;
      return false; // Stop traversal
    }
  });
  
  return !hasMedia;
}

/**
 * Check if the editor is currently focused
 * 
 * @param view - The ProseMirror EditorView
 * @returns true if editor has focus
 */
export function isEditorFocused(view: EditorView): boolean {
  return view.hasFocus();
}

/**
 * Get information about the current selection
 * 
 * @param view - The ProseMirror EditorView
 * @returns Selection information
 */
export function getSelectionInfo(view: EditorView): SelectionInfo {
  return getSelectionInfoUtil(view);
}

