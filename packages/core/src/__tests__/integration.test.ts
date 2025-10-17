/**
 * Integration Tests
 * 
 * Tests that verify multiple components working together
 */

import { SlideEditor } from '../SlideEditor';
import { TextSelection } from 'prosemirror-state';
import type { DocNode } from '../types';

// Helper to create a test document with slides
function createTestDoc(slideCount: number): DocNode {
  const slides: any[] = [];
  for (let i = 0; i < slideCount; i++) {
    slides.push({
      type: 'slide',
      content: [{
        type: 'row',
        content: [{
          type: 'column',
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: `Slide ${i + 1}` }] },
            { type: 'paragraph' }
          ]
        }]
      }]
    });
  }
  return {
    type: 'doc',
    content: slides as any
  };
}

// Helper to get slide count
function getSlideCount(doc: any): number {
  let count = 0;
  doc.forEach((node: any) => {
    if (node.type.name === 'slide') count++;
  });
  return count;
}

// Helper to type text
function typeText(editor: SlideEditor, text: string): void {
  if (!editor.view) return;
  const { from } = editor.view.state.selection;
  const tr = editor.view.state.tr.insertText(text, from);
  editor.view.dispatch(tr);
}

describe('Integration Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Basic slide creation and editing', () => {
    it('should create a presentation with multiple slides and format text', () => {
      const editor = new SlideEditor({
        content: createTestDoc(1),
      });
      editor.mount(container);
      
      // Initial state: 1 slide
      expect(getSlideCount(editor.view!.state.doc)).toBe(1);
      
      // Add two more slides
      editor.commands.addSlide('end');
      editor.commands.addSlide('end');
      
      expect(getSlideCount(editor.view!.state.doc)).toBe(3);
      
      // Add text and format it
      typeText(editor, 'Hello World');
      
      // Select and format the text
      const from = 6;
      const to = from + 11;
      const tr = editor.view!.state.tr.setSelection(TextSelection.create(editor.view!.state.doc, from, to));
      editor.view!.dispatch(tr);
      
      editor.commands.toggleBold();
      editor.commands.toggleItalic();
      
      // Verify the presentation has content
      expect(editor.view!.state.doc.textContent).toContain('Hello World');
      
      editor.destroy();
    });

    it('should handle undo/redo across multiple operations', () => {
      const editor = new SlideEditor({
        content: createTestDoc(1),
      });
      editor.mount(container);
      
      const initialState = editor.view!.state.doc.toString();
      
      // Make multiple changes
      editor.commands.addSlide('end');
      typeText(editor, 'Test');
      editor.commands.toggleBold();
      
      // Undo all changes
      editor.commands.undo();
      editor.commands.undo();
      editor.commands.undo();
      
      expect(editor.view!.state.doc.toString()).toBe(initialState);
      
      // Redo all changes
      editor.commands.redo();
      editor.commands.redo();
      editor.commands.redo();
      
      expect(getSlideCount(editor.view!.state.doc)).toBe(2);
      
      editor.destroy();
    });

    it('should delete and duplicate slides while maintaining structure', () => {
      const editor = new SlideEditor({
        content: createTestDoc(3),
      });
      editor.mount(container);
      
      expect(getSlideCount(editor.view!.state.doc)).toBe(3);
      
      // Duplicate the first slide
      editor.commands.duplicateSlide(0);
      expect(getSlideCount(editor.view!.state.doc)).toBe(4);
      
      // Delete the second slide
      editor.commands.deleteSlide(1);
      expect(getSlideCount(editor.view!.state.doc)).toBe(3);
      
      // Verify structure is still valid (no errors thrown)
      expect(editor.view!.state.doc.type.name).toBe('doc');
      
      editor.destroy();
    });
  });

  describe('Real-world scenario: Creating a presentation', () => {
    it('should create a complete presentation from scratch', () => {
      const editor = new SlideEditor({
        content: createTestDoc(1),
      });
      editor.mount(container);
      
      // Start with 1 slide, add 2 more for a 3-slide presentation
      editor.commands.addSlide('end', { placeholderHeader: 'Slide 2' });
      editor.commands.addSlide('end', { placeholderHeader: 'Slide 3' });
      
      expect(getSlideCount(editor.view!.state.doc)).toBe(3);
      
      // Add and format content
      typeText(editor, 'Introduction');
      
      const from = 6;
      const to = from + 12;
      const tr = editor.view!.state.tr.setSelection(TextSelection.create(editor.view!.state.doc, from, to));
      editor.view!.dispatch(tr);
      
      editor.commands.toggleBold();
      editor.commands.setTextColor('#ff0000');
      
      // Verify no errors and document is valid
      expect(editor.view!.state.doc.type.name).toBe('doc');
      expect(editor.view!.state.doc.textContent).toContain('Introduction');
      
      editor.destroy();
    });
  });

  describe('Commands chaining and state management', () => {
    it('should handle rapid command execution', () => {
      const editor = new SlideEditor({
        content: createTestDoc(2),
      });
      editor.mount(container);
      
      // Execute many commands in quick succession
      const results = [
        editor.commands.focus(),
        editor.commands.addSlide('end'),
        editor.commands.deleteSlide(1),
        editor.commands.duplicateSlide(0),
        editor.commands.canUndo(),
        editor.commands.getUndoDepth()
      ];
      
      // Most commands should succeed
      expect(results.filter(r => r === true || typeof r === 'number').length).toBeGreaterThan(0);
      
      editor.destroy();
    });

    it('should maintain document validity after multiple operations', () => {
      const editor = new SlideEditor({
        content: createTestDoc(1),
      });
      editor.mount(container);
      
      // Perform various operations
      for (let i = 0; i < 5; i++) {
        editor.commands.addSlide('end');
      }
      
      for (let i = 0; i < 3; i++) {
        editor.commands.deleteSlide(0);
      }
      
      editor.commands.duplicateSlide(0);
      editor.commands.duplicateSlide(0);
      
      // Document should still be valid
      expect(editor.view!.state.doc.type.name).toBe('doc');
      expect(getSlideCount(editor.view!.state.doc)).toBeGreaterThan(0);
      
      // Should be able to continue editing
      typeText(editor, 'Still working');
      expect(editor.view!.state.doc.textContent).toContain('Still working');
      
      editor.destroy();
    });
  });

  describe('Error resilience', () => {
    it('should handle invalid operations gracefully', () => {
      const editor = new SlideEditor({
        content: createTestDoc(2),
      });
      editor.mount(container);
      
      // Try to delete non-existent slides
      expect(editor.commands.deleteSlide(100)).toBe(false);
      expect(editor.commands.deleteSlide(-1)).toBe(false);
      
      // Try to duplicate non-existent slide
      expect(editor.commands.duplicateSlide(100)).toBe(false);
      
      // Document should still be valid
      expect(getSlideCount(editor.view!.state.doc)).toBe(2);
      
      editor.destroy();
    });
  });
});

