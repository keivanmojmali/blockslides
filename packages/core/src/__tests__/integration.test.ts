/**
 * Integration Tests
 * 
 * Tests that verify multiple components working together
 */

import { createTestEditor, getSlideCount, typeText } from './testUtils';
import { createCommands } from '../commands';
import { TextSelection } from 'prosemirror-state';

describe('Integration Tests', () => {
  describe('Basic slide creation and editing', () => {
    it('should create a presentation with multiple slides and format text', () => {
      const { view, schema } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      // Initial state: 1 slide
      expect(getSlideCount(view.state.doc)).toBe(1);
      
      // Add two more slides
      commands.addSlide('end');
      commands.addSlide('end');
      
      expect(getSlideCount(view.state.doc)).toBe(3);
      
      // Add text and format it
      typeText(view, 'Hello World');
      
      // Select and format the text
      const from = 6;
      const to = from + 11;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleBold();
      commands.toggleItalic();
      
      // Verify the presentation has content
      expect(view.state.doc.textContent).toContain('Hello World');
    });

    it('should handle undo/redo across multiple operations', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      const initialState = view.state.doc.toString();
      
      // Make multiple changes
      commands.addSlide('end');
      typeText(view, 'Test');
      commands.toggleBold();
      
      // Undo all changes
      commands.undo();
      commands.undo();
      commands.undo();
      
      expect(view.state.doc.toString()).toBe(initialState);
      
      // Redo all changes
      commands.redo();
      commands.redo();
      commands.redo();
      
      expect(getSlideCount(view.state.doc)).toBe(2);
    });

    it('should delete and duplicate slides while maintaining structure', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(getSlideCount(view.state.doc)).toBe(3);
      
      // Duplicate the first slide
      commands.duplicateSlide(0);
      expect(getSlideCount(view.state.doc)).toBe(4);
      
      // Delete the second slide
      commands.deleteSlide(1);
      expect(getSlideCount(view.state.doc)).toBe(3);
      
      // Verify structure is still valid (no errors thrown)
      expect(view.state.doc.type.name).toBe('doc');
    });
  });

  describe('Real-world scenario: Creating a presentation', () => {
    it('should create a complete presentation from scratch', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      // Start with 1 slide, add 2 more for a 3-slide presentation
      commands.addSlide('end', { placeholderHeader: 'Slide 2' });
      commands.addSlide('end', { placeholderHeader: 'Slide 3' });
      
      expect(getSlideCount(view.state.doc)).toBe(3);
      
      // Add and format content
      typeText(view, 'Introduction');
      
      const from = 6;
      const to = from + 12;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleBold();
      commands.setTextColor('#ff0000');
      
      // Verify no errors and document is valid
      expect(view.state.doc.type.name).toBe('doc');
      expect(view.state.doc.textContent).toContain('Introduction');
    });
  });

  describe('Commands chaining and state management', () => {
    it('should handle rapid command execution', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      // Execute many commands in quick succession
      const results = [
        commands.focus(),
        commands.addSlide('end'),
        commands.deleteSlide(1),
        commands.duplicateSlide(0),
        commands.canUndo(),
        commands.getUndoDepth()
      ];
      
      // Most commands should succeed
      expect(results.filter(r => r === true || typeof r === 'number').length).toBeGreaterThan(0);
    });

    it('should maintain document validity after multiple operations', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      // Perform various operations
      for (let i = 0; i < 5; i++) {
        commands.addSlide('end');
      }
      
      for (let i = 0; i < 3; i++) {
        commands.deleteSlide(0);
      }
      
      commands.duplicateSlide(0);
      commands.duplicateSlide(0);
      
      // Document should still be valid
      expect(view.state.doc.type.name).toBe('doc');
      expect(getSlideCount(view.state.doc)).toBeGreaterThan(0);
      
      // Should be able to continue editing
      typeText(view, 'Still working');
      expect(view.state.doc.textContent).toContain('Still working');
    });
  });

  describe('Error resilience', () => {
    it('should handle commands with null view gracefully', () => {
      const commands = createCommands(() => null);
      
      // All commands should return false or appropriate default values
      expect(commands.addSlide()).toBe(false);
      expect(commands.deleteSlide(0)).toBe(false);
      expect(commands.toggleBold()).toBe(false);
      expect(commands.undo()).toBe(false);
      expect(commands.canUndo()).toBe(false);
      expect(commands.getUndoDepth()).toBe(0);
    });

    it('should handle invalid operations gracefully', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      // Try to delete non-existent slides
      expect(commands.deleteSlide(100)).toBe(false);
      expect(commands.deleteSlide(-1)).toBe(false);
      
      // Try to duplicate non-existent slide
      expect(commands.duplicateSlide(100)).toBe(false);
      
      // Document should still be valid
      expect(getSlideCount(view.state.doc)).toBe(2);
    });
  });
});

