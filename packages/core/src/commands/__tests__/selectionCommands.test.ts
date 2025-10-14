/**
 * Selection Commands Tests
 * 
 * Tests for selection manipulation commands: selectAll, setSelection, selectSlide, etc.
 */

import { createTestEditor, typeText, getSlideAtIndex } from '../../__tests__/testUtils';
import { createCommands } from '../index';
import { TextSelection } from 'prosemirror-state';

describe('Selection Commands', () => {
  describe('selectAll', () => {
    it('should select entire document', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const result = commands.selectAll();
      
      expect(result).toBe(true);
      // AllSelection selects from 0 to doc.content.size
      expect(view.state.selection.from).toBe(0);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.selectAll()).toBe(false);
    });
  });

  describe('deleteSelection', () => {
    it('should delete selected content', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Type some text
      typeText(view, 'Delete me');
      
      // Select all text in paragraph
      const from = 6; // After slide structure
      const to = from + 9;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const initialContent = view.state.doc.textContent;
      
      // Delete selection
      const result = commands.deleteSelection();
      
      expect(result).toBe(true);
      expect(view.state.doc.textContent).not.toBe(initialContent);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.deleteSelection()).toBe(false);
    });
  });

  describe('setSelection', () => {
    it('should set selection range', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Some text');
      
      const from = 6;
      const to = from + 4;
      const result = commands.setSelection(from, to);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(from);
      expect(view.state.selection.to).toBe(to);
    });

    it('should set cursor position when only from is provided', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const pos = 6;
      const result = commands.setSelection(pos);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(pos);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.setSelection(0, 10)).toBe(false);
    });
  });

  describe('selectSlide', () => {
    it('should select slide at index', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      const commands = createCommands(() => view);
      
      const result = commands.selectSlide(1);
      
      expect(result).toBe(true);
    });

    it('should return false for invalid slide index', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      const commands = createCommands(() => view);
      
      const result = commands.selectSlide(10);
      
      expect(result).toBe(false);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.selectSlide(0)).toBe(false);
    });
  });

  describe('collapseSelection', () => {
    it('should collapse selection to start by default', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Text');
      
      // Select a range
      const from = 6;
      const to = from + 4;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands.collapseSelection();
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(view.state.selection.to);
    });

    it('should collapse selection to end when toStart is false', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Text');
      
      const from = 6;
      const to = from + 4;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands.collapseSelection(false);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(view.state.selection.to);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.collapseSelection()).toBe(false);
    });
  });

  describe('expandSelection', () => {
    it('should expand selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Text');
      
      const result = commands.expandSelection();
      
      expect(result).toBe(true);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.expandSelection()).toBe(false);
    });
  });

  describe('getSelectedText', () => {
    it('should return selected text', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Hello World');
      
      // Get the actual text content to verify it's there
      const allText = view.state.doc.textContent;
      expect(allText).toContain('Hello World');
      
      // Select all text  
      commands.selectAll();
      
      const selectedText = commands.getSelectedText();
      
      // Should contain our typed text
      expect(selectedText).toContain('Hello World');
    });

    it('should return empty string when nothing selected', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const selectedText = commands.getSelectedText();
      
      expect(selectedText).toBe('');
    });

    it('should return empty string when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.getSelectedText()).toBe('');
    });
  });

  describe('isSelectionEmpty', () => {
    it('should return true when selection is empty', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const result = commands.isSelectionEmpty();
      
      expect(result).toBe(true);
    });

    it('should return false when text is selected', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Text');
      
      const from = 6;
      const to = from + 4;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands.isSelectionEmpty();
      
      expect(result).toBe(false);
    });

    it('should return true when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.isSelectionEmpty()).toBe(true);
    });
  });

  describe('isAtStart', () => {
    it('should return boolean', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const result = commands.isAtStart();
      
      expect(typeof result).toBe('boolean');
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.isAtStart()).toBe(false);
    });
  });

  describe('isAtEnd', () => {
    it('should return boolean', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const result = commands.isAtEnd();
      
      expect(typeof result).toBe('boolean');
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.isAtEnd()).toBe(false);
    });
  });
});

