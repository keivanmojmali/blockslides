/**
 * Chain Commands Tests
 * 
 * Tests for the chainable commands API
 */

import { createTestEditor, typeText, hasMarkInRange, getSlideCount } from '../../__tests__/testUtils';
import { createCommands } from '../index';
import { TextSelection } from 'prosemirror-state';

describe('Chain Commands', () => {
  describe('chain()', () => {
    it('should create chainable command object', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const chain = commands.chain();
      
      expect(chain).toBeDefined();
      expect(typeof chain.run).toBe('function');
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      const chain = commands.chain();
      
      expect(chain).toBeDefined();
    });
  });

  describe('Chaining formatting commands', () => {
    it('should chain multiple formatting commands', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Format me');
      
      const from = 6;
      const to = from + 9;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands
        .chain()
        .toggleBold()
        .toggleItalic()
        .run();
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'bold')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'italic')).toBe(true);
    });

    it('should apply color and highlight in chain', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Color me');
      
      const from = 6;
      const to = from + 8;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands
        .chain()
        .setTextColor('#ff0000')
        .setHighlight('#ffff00')
        .run();
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'textColor')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'highlight')).toBe(true);
    });

    it('should chain heading and paragraph changes', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const pos = 6;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, pos));
      view.dispatch(tr);
      
      const result = commands
        .chain()
        .setHeading(2)
        .run();
      
      expect(result).toBe(true);
    });
  });

  describe('Chaining slide commands', () => {
    it('should chain multiple slide operations', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      expect(getSlideCount(view.state.doc)).toBe(1);
      
      const result = commands
        .chain()
        .addSlide()
        .addSlide()
        .run();
      
      expect(result).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(3);
    });

    it('should chain add and duplicate', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      const result = commands
        .chain()
        .addSlide()
        .duplicateSlide(0)
        .run();
      
      expect(result).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(3);
    });
  });

  describe('Chaining selection commands', () => {
    it('should chain selection operations', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Select me');
      
      const result = commands
        .chain()
        .selectAll()
        .toggleBold()
        .run();
      
      expect(result).toBe(true);
    });

    it('should chain setSelection with formatting', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test text');
      
      const from = 6;
      const to = from + 4;
      
      const result = commands
        .chain()
        .setSelection(from, to)
        .toggleItalic()
        .run();
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'italic')).toBe(true);
    });
  });

  describe('Chaining with history', () => {
    it('should chain commands with undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      
      const initialDoc = view.state.doc.toString();
      
      commands
        .chain()
        .addSlide()
        .run();
      
      const afterAddDoc = view.state.doc.toString();
      expect(afterAddDoc).not.toBe(initialDoc);
      
      const undoResult = commands.undo();
      expect(undoResult).toBe(true);
    });
  });

  describe('Chain error handling', () => {
    it('should stop on first failure', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      // deleteSlide(99) should fail, preventing addSlide from running
      const initialCount = getSlideCount(view.state.doc);
      
      const result = commands
        .chain()
        .deleteSlide(99) // This will fail
        .addSlide()      // This should not execute
        .run();
      
      expect(result).toBe(false);
      // Count should be unchanged
      expect(getSlideCount(view.state.doc)).toBe(initialCount);
    });

    it('should return false if any command fails', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // setTextColor requires selection
      const result = commands
        .chain()
        .toggleBold()
        .setTextColor('#ff0000') // Will fail - no selection
        .run();
      
      expect(result).toBe(false);
    });
  });

  describe('Complex chains', () => {
    it('should handle long command chains', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      typeText(view, 'Complex test');
      
      const from = 6;
      const to = from + 7;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands
        .chain()
        .toggleBold()
        .toggleItalic()
        .toggleUnderline()
        .setTextColor('#ff0000')
        .setHighlight('#ffff00')
        .run();
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'bold')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'italic')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'underline')).toBe(true);
    });

    it('should combine different command types', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      const result = commands
        .chain()
        .addSlide()
        .focus()
        .selectAll()
        .run();
      
      expect(result).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(2);
    });
  });

  describe('Chain reusability', () => {
    it('should clear queue after run', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const commands = createCommands(() => view);
      
      const chain = commands.chain();
      
      // First run
      const result1 = chain.addSlide().run();
      expect(result1).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(2);
      
      // Second run should not repeat first commands
      const result2 = chain.addSlide().run();
      expect(result2).toBe(true);
      expect(getSlideCount(view.state.doc)).toBe(3);
    });
  });

  describe('Chain with null view', () => {
    it('should handle null view in chain', () => {
      const commands = createCommands(() => null);
      
      const result = commands
        .chain()
        .toggleBold()
        .addSlide()
        .run();
      
      expect(result).toBe(false);
    });
  });
});

