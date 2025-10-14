/**
 * Editor Commands Tests
 * 
 * Tests for basic editor commands: focus, blur, clearContent
 */

import { createTestEditor, typeText, getSlideCount } from '../../__tests__/testUtils';
import { createCommands } from '../index';

describe('Editor Commands', () => {
  describe('focus', () => {
    it('should focus the editor', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const result = commands.focus();
      
      expect(result).toBe(true);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.focus()).toBe(false);
    });
  });

  describe('blur', () => {
    it('should blur the editor', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const result = commands.blur();
      
      expect(result).toBe(true);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.blur()).toBe(false);
    });
  });

  describe('clearContent', () => {
    it('should clear all document content', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      // Verify initial content exists
      const initialSize = view.state.doc.content.size;
      const initialSlideCount = getSlideCount(view.state.doc);
      expect(initialSlideCount).toBe(2);
      expect(initialSize).toBeGreaterThan(0);
      
      const result = commands.clearContent();
      
      expect(result).toBe(true);
      // After clearing, doc still has minimal structure (size > 0 but much smaller)
      expect(view.state.doc.content.size).toBeLessThan(initialSize);
      // Slide count should be reduced (may not be 0 due to minimal doc structure)
      expect(getSlideCount(view.state.doc)).toBeLessThan(initialSlideCount);
    });

    it('should clear typed content', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'This will be cleared');
      
      const initialSize = view.state.doc.content.size;
      const initialContent = view.state.doc.textContent;
      expect(initialContent.length).toBeGreaterThan(0);
      
      const result = commands.clearContent();
      
      expect(result).toBe(true);
      // Doc size should be reduced significantly
      expect(view.state.doc.content.size).toBeLessThan(initialSize);
      expect(view.state.doc.textContent).toBe('');
    });

    it('should handle already empty document', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      // Clear once
      commands.clearContent();
      const sizeAfterFirstClear = view.state.doc.content.size;
      
      // Clear again
      const result = commands.clearContent();
      
      expect(result).toBe(true);
      expect(view.state.doc.content.size).toBe(sizeAfterFirstClear);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.clearContent()).toBe(false);
    });
  });

  describe('Editor state integration', () => {
    it('should allow focus then blur', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      expect(commands.focus()).toBe(true);
      expect(commands.blur()).toBe(true);
    });

    it('should allow clearing content multiple times', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const initialSize = view.state.doc.content.size;
      
      expect(commands.clearContent()).toBe(true);
      const clearedSize = view.state.doc.content.size;
      expect(clearedSize).toBeLessThan(initialSize);
      
      // Add new slide
      commands.addSlide();
      expect(view.state.doc.content.size).toBeGreaterThan(clearedSize);
      
      // Clear again
      expect(commands.clearContent()).toBe(true);
      expect(view.state.doc.content.size).toBe(clearedSize);
    });

    it('should maintain editor instance after operations', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      commands.focus();
      commands.clearContent();
      commands.blur();
      
      // Editor should still be functional
      expect(view.state).toBeDefined();
      expect(view.state.doc).toBeDefined();
    });
  });
});

