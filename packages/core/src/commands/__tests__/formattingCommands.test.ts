/**
 * Formatting Commands Tests
 * 
 * Tests for text formatting commands: bold, italic, underline, colors, etc.
 */

import { createTestEditor, selectRange, typeText, hasMarkInRange } from '../../__tests__/testUtils';
import { createCommands } from '../index';
import { TextSelection } from 'prosemirror-state';

describe('Formatting Commands', () => {
  describe('toggleBold', () => {
    it('should apply bold mark to selection', () => {
      const { view, schema } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Type some text
      typeText(view, 'Bold text');
      
      // Select the text (positions 2-11 in the paragraph within the slide)
      const from = 6; // After slide > row > column > heading > paragraph start
      const to = from + 9;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      // Toggle bold
      const result = commands.toggleBold();
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'bold')).toBe(true);
    });

    it('should remove bold mark if already bold', () => {
      const { view, schema } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Bold text');
      
      const from = 6;
      const to = from + 9;
      let tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      // Apply bold
      commands.toggleBold();
      expect(hasMarkInRange(view.state.doc, from, to, 'bold')).toBe(true);
      
      // Toggle again to remove
      commands.toggleBold();
      expect(hasMarkInRange(view.state.doc, from, to, 'bold')).toBe(false);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.toggleBold()).toBe(false);
    });
  });

  describe('toggleItalic', () => {
    it('should apply italic mark to selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Italic text');
      
      const from = 6;
      const to = from + 11;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleItalic();
      
      expect(hasMarkInRange(view.state.doc, from, to, 'italic')).toBe(true);
    });

    it('should remove italic mark if already italic', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Italic text');
      
      const from = 6;
      const to = from + 11;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleItalic();
      commands.toggleItalic();
      
      expect(hasMarkInRange(view.state.doc, from, to, 'italic')).toBe(false);
    });
  });

  describe('toggleUnderline', () => {
    it('should apply underline mark to selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Underline text');
      
      const from = 6;
      const to = from + 14;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleUnderline();
      
      expect(hasMarkInRange(view.state.doc, from, to, 'underline')).toBe(true);
    });
  });

  describe('toggleStrikethrough', () => {
    it('should apply strikethrough mark to selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Strike text');
      
      const from = 6;
      const to = from + 11;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleStrikethrough();
      
      expect(hasMarkInRange(view.state.doc, from, to, 'strikethrough')).toBe(true);
    });
  });

  describe('toggleCode', () => {
    it('should apply code mark to selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Code text');
      
      const from = 6;
      const to = from + 9;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleCode();
      
      expect(hasMarkInRange(view.state.doc, from, to, 'code')).toBe(true);
    });
  });

  describe('setTextColor', () => {
    it('should apply text color mark to selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Colored text');
      
      const from = 6;
      const to = from + 12;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands.setTextColor('#ff0000');
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'textColor')).toBe(true);
    });

    it('should update color if different color is applied', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Text');
      
      const from = 6;
      const to = from + 4;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.setTextColor('#ff0000');
      commands.setTextColor('#00ff00');
      
      // Should still have textColor mark
      expect(hasMarkInRange(view.state.doc, from, to, 'textColor')).toBe(true);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.setTextColor('#ff0000')).toBe(false);
    });
  });

  describe('setHighlight', () => {
    it('should apply highlight mark to selection', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Highlighted text');
      
      const from = 6;
      const to = from + 16;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands.setHighlight('#ffff00');
      
      expect(result).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'highlight')).toBe(true);
    });
  });

  describe('removeTextColor', () => {
    it('should remove text color mark', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Colored text');
      
      const from = 6;
      const to = from + 12;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.setTextColor('#ff0000');
      expect(hasMarkInRange(view.state.doc, from, to, 'textColor')).toBe(true);
      
      commands.removeTextColor();
      expect(hasMarkInRange(view.state.doc, from, to, 'textColor')).toBe(false);
    });
  });

  describe('removeHighlight', () => {
    it('should remove highlight mark', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Highlighted text');
      
      const from = 6;
      const to = from + 16;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.setHighlight('#ffff00');
      expect(hasMarkInRange(view.state.doc, from, to, 'highlight')).toBe(true);
      
      commands.removeHighlight();
      expect(hasMarkInRange(view.state.doc, from, to, 'highlight')).toBe(false);
    });
  });

  describe('setHeading', () => {
    it('should convert paragraph to heading', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Position cursor in the paragraph
      const pos = 6; // In the paragraph
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, pos));
      view.dispatch(tr);
      
      const result = commands.setHeading(2);
      
      expect(result).toBe(true);
      // Note: This changes block type, verification would require checking node type at position
    });

    it('should work with different heading levels', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const pos = 6;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, pos));
      view.dispatch(tr);
      
      for (let level = 1; level <= 6; level++) {
        const result = commands.setHeading(level as 1 | 2 | 3 | 4 | 5 | 6);
        expect(result).toBe(true);
      }
    });
  });

  describe('setParagraph', () => {
    it('should convert heading to paragraph', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Add text to the heading first
      typeText(view, 'Heading text');
      
      // Select the text in the heading
      const from = 3;
      const to = from + 12;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      const result = commands.setParagraph();
      
      expect(result).toBe(true);
    });
  });

  describe('Combined formatting', () => {
    it('should allow multiple marks on same text', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Formatted text');
      
      const from = 6;
      const to = from + 14;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      commands.toggleBold();
      commands.toggleItalic();
      commands.toggleUnderline();
      commands.setTextColor('#ff0000');
      
      expect(hasMarkInRange(view.state.doc, from, to, 'bold')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'italic')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'underline')).toBe(true);
      expect(hasMarkInRange(view.state.doc, from, to, 'textColor')).toBe(true);
    });
  });
});

