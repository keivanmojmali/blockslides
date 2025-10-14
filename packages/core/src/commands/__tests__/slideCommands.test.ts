/**
 * Slide Commands Tests
 * 
 * Tests for slide manipulation commands: addSlide, deleteSlide, duplicateSlide
 */

import { createTestEditor, getSlideCount, getSlideAtIndex, assertValidSlideStructure, createSlideJSON } from '../../__tests__/testUtils';
import { createCommands } from '../index';
import { Node as ProseMirrorNode } from 'prosemirror-model';

describe('Slide Commands', () => {
  describe('addSlide', () => {
    it('should add slide at end by default', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      // Initial state: 1 slide
      expect(getSlideCount(view.state.doc)).toBe(1);
      
      // Execute command
      const result = commands.addSlide();
      
      // Assert: now 2 slides
      expect(result).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(2);
    });

    it('should add slide at end when position is "end"', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      expect(getSlideCount(view.state.doc)).toBe(2);
      
      commands.addSlide('end');
      
      expect(getSlideCount(view.state.doc)).toBe(3);
    });

    it('should add slide with correct structure', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      commands.addSlide('end');
      
      const lastSlide = getSlideAtIndex(view.state.doc, 1);
      expect(lastSlide).not.toBeNull();
      
      if (lastSlide) {
        assertValidSlideStructure(lastSlide);
        
        // Check for heading and paragraph
        const row = lastSlide.child(0);
        const column = row.child(0);
        expect(column.child(0).type.name).toBe('heading');
        expect(column.child(1).type.name).toBe('paragraph');
      }
    });

    it('should apply placeholder header text', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      commands.addSlide('end', { placeholderHeader: 'Test Header' });
      
      const lastSlide = getSlideAtIndex(view.state.doc, 1);
      expect(lastSlide).not.toBeNull();
      
      if (lastSlide) {
        const row = lastSlide.child(0);
        const column = row.child(0);
        const heading = column.child(0);
        // Placeholder is stored as an attribute, not text content
        expect(heading.attrs.placeholder).toBe('Test Header');
      }
    });

    it('should add slide at specific document position', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const initialCount = getSlideCount(view.state.doc);
      
      // Add slide at document position (position is a raw doc position, not slide index)
      // Position at end of document
      const endPos = view.state.doc.content.size;
      commands.addSlide(endPos);
      
      expect(getSlideCount(view.state.doc)).toBe(initialCount + 1);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      const result = commands.addSlide();
      expect(result).toBe(false);
    });
  });

  describe('deleteSlide', () => {
    it('should delete slide at specified index', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      expect(getSlideCount(view.state.doc)).toBe(3);
      
      // Delete the middle slide (index 1)
      const result = commands.deleteSlide(1);
      
      expect(result).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(2);
    });

    it('should delete first slide', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      commands.deleteSlide(0);
      
      expect(getSlideCount(view.state.doc)).toBe(1);
    });

    it('should delete last slide', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      commands.deleteSlide(2);
      
      expect(getSlideCount(view.state.doc)).toBe(2);
    });

    it('should maintain valid document structure after deletion', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      commands.deleteSlide(1);
      
      // Check remaining slides have valid structure
      const firstSlide = getSlideAtIndex(view.state.doc, 0);
      const secondSlide = getSlideAtIndex(view.state.doc, 1);
      
      expect(firstSlide).not.toBeNull();
      expect(secondSlide).not.toBeNull();
      
      if (firstSlide) assertValidSlideStructure(firstSlide);
      if (secondSlide) assertValidSlideStructure(secondSlide);
    });

    it('should return false for invalid slide index', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const result = commands.deleteSlide(10);
      expect(result).toBe(false);
      expect(getSlideCount(view.state.doc)).toBe(2);
    });

    it('should return false for negative index', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const result = commands.deleteSlide(-1);
      expect(result).toBe(false);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      const result = commands.deleteSlide(0);
      expect(result).toBe(false);
    });
  });

  describe('duplicateSlide', () => {
    it('should duplicate slide at specified index', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      expect(getSlideCount(view.state.doc)).toBe(2);
      
      const result = commands.duplicateSlide(0);
      
      expect(result).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(3);
    });

    it('should copy content from original slide', () => {
      const { view } = createTestEditor({
        content: {
          type: 'doc',
          content: [createSlideJSON('Original Header', 'Original Content')]
        }
      });
      const commands = createCommands(() => view);
      
      commands.duplicateSlide(0);
      
      const originalSlide = getSlideAtIndex(view.state.doc, 0);
      const duplicatedSlide = getSlideAtIndex(view.state.doc, 1);
      
      expect(originalSlide).not.toBeNull();
      expect(duplicatedSlide).not.toBeNull();
      
      if (originalSlide && duplicatedSlide) {
        // Check that content is the same
        expect(duplicatedSlide.textContent).toContain('Original Header');
        expect(duplicatedSlide.textContent).toContain('Original Content');
      }
    });

    it('should preserve slide structure', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      commands.duplicateSlide(0);
      
      const duplicatedSlide = getSlideAtIndex(view.state.doc, 1);
      expect(duplicatedSlide).not.toBeNull();
      
      if (duplicatedSlide) {
        assertValidSlideStructure(duplicatedSlide);
      }
    });

    it('should return false for invalid slide index', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const result = commands.duplicateSlide(10);
      expect(result).toBe(false);
      expect(getSlideCount(view.state.doc)).toBe(2);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      const result = commands.duplicateSlide(0);
      expect(result).toBe(false);
    });
  });
});

