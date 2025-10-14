/**
 * Test Utilities for AutoArtifacts Core
 * 
 * Provides helpers for creating editor instances, test documents,
 * and common assertions used across test suites.
 */

import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node as ProseMirrorNode } from 'prosemirror-model';
import { schema } from '../schema';
import { history } from 'prosemirror-history';

/**
 * Create a test editor view with the AutoArtifacts schema
 */
export function createTestEditor(options: {
  doc?: ProseMirrorNode;
  content?: any;
  slideCount?: number;
} = {}) {
  let doc: ProseMirrorNode;
  
  if (options.doc) {
    doc = options.doc;
  } else if (options.content) {
    doc = ProseMirrorNode.fromJSON(schema, options.content);
  } else {
    // Create default document with specified number of slides
    const slideCount = options.slideCount || 1;
    const slides = [];
    
    for (let i = 0; i < slideCount; i++) {
      slides.push(createSlideJSON(`Slide ${i + 1}`, `Content ${i + 1}`));
    }
    
    doc = ProseMirrorNode.fromJSON(schema, {
      type: 'doc',
      content: slides
    });
  }
  
  const state = EditorState.create({
    doc,
    schema,
    plugins: [history()]
  });
  
  const view = new EditorView(document.createElement('div'), {
    state
  });
  
  return { view, state, schema };
}

/**
 * Create a simple slide JSON structure
 */
export function createSlideJSON(headerText = 'Header', bodyText = 'Content') {
  return {
    type: 'slide',
    attrs: { layout: '1' },
    content: [
      {
        type: 'row',
        attrs: { layout: '1' },
        content: [
          {
            type: 'column',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: headerText }]
              },
              {
                type: 'paragraph',
                content: [{ type: 'text', text: bodyText }]
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Create an empty slide JSON structure
 */
export function createEmptySlideJSON() {
  return {
    type: 'slide',
    attrs: { layout: '1' },
    content: [
      {
        type: 'row',
        attrs: { layout: '1' },
        content: [
          {
            type: 'column',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: []
              },
              {
                type: 'paragraph',
                content: []
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Get slide count from document
 */
export function getSlideCount(doc: ProseMirrorNode): number {
  let count = 0;
  doc.forEach(node => {
    if (node.type.name === 'slide') {
      count++;
    }
  });
  return count;
}

/**
 * Get slide at specific index
 */
export function getSlideAtIndex(doc: ProseMirrorNode, index: number): ProseMirrorNode | null {
  let currentIndex = 0;
  let foundSlide: ProseMirrorNode | null = null;
  
  doc.forEach(node => {
    if (node.type.name === 'slide') {
      if (currentIndex === index) {
        foundSlide = node;
        return false; // Stop iteration
      }
      currentIndex++;
    }
  });
  
  return foundSlide;
}

/**
 * Get text content from a node
 */
export function getTextContent(node: ProseMirrorNode): string {
  return node.textContent;
}

/**
 * Check if a mark is present in a range
 */
export function hasMarkInRange(
  doc: ProseMirrorNode,
  from: number,
  to: number,
  markType: string
): boolean {
  let hasMark = false;
  doc.nodesBetween(from, to, node => {
    if (node.marks.some(mark => mark.type.name === markType)) {
      hasMark = true;
      return false;
    }
  });
  return hasMark;
}

/**
 * Find position of first slide
 */
export function findFirstSlidePos(doc: ProseMirrorNode): number {
  return 0;
}

/**
 * Find position after last slide
 */
export function findLastSlidePos(doc: ProseMirrorNode): number {
  let lastPos = 0;
  doc.forEach((node, offset) => {
    if (node.type.name === 'slide') {
      lastPos = offset + node.nodeSize;
    }
  });
  return lastPos;
}

/**
 * Apply transaction and return new state
 */
export function applyTransaction(view: EditorView, tr: any): EditorState {
  const newState = view.state.apply(tr);
  view.updateState(newState);
  return newState;
}

/**
 * Select text range in editor
 */
export function selectRange(view: EditorView, from: number, to: number) {
  const tr = view.state.tr.setSelection(
    TextSelection.create(view.state.doc, from, to)
  );
  view.dispatch(tr);
}

/**
 * Type text at current cursor position
 */
export function typeText(view: EditorView, text: string) {
  const { state } = view;
  const tr = state.tr.insertText(text, state.selection.from, state.selection.to);
  view.dispatch(tr);
}

/**
 * Assert node structure matches expected
 */
export function assertNodeStructure(
  node: ProseMirrorNode,
  expectedType: string,
  expectedChildCount?: number
) {
  expect(node.type.name).toBe(expectedType);
  if (expectedChildCount !== undefined) {
    expect(node.childCount).toBe(expectedChildCount);
  }
}

/**
 * Assert slide has correct structure: slide > row > column > heading + paragraph
 */
export function assertValidSlideStructure(slide: ProseMirrorNode) {
  expect(slide.type.name).toBe('slide');
  expect(slide.childCount).toBeGreaterThan(0);
  
  const row = slide.child(0);
  expect(row.type.name).toBe('row');
  expect(row.childCount).toBeGreaterThan(0);
  
  const column = row.child(0);
  expect(column.type.name).toBe('column');
  expect(column.childCount).toBeGreaterThan(0);
}

/**
 * Create a mock editor element for DOM-based tests
 */
export function createMockEditorElement(): HTMLElement {
  const element = document.createElement('div');
  element.className = 'autoartifacts-editor';
  document.body.appendChild(element);
  return element;
}

/**
 * Cleanup mock editor element
 */
export function cleanupMockEditorElement(element: HTMLElement) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Wait for async operations
 */
export function wait(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

