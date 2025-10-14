/**
 * Actions API Tests
 * 
 * Tests for the Actions API - simple, declarative commands for editor interaction
 */

import { createTestEditor, typeText, createMockEditorElement, cleanupMockEditorElement } from '../../__tests__/testUtils';
import { TextSelection } from 'prosemirror-state';
import {
  undoAction,
  redoAction,
  boldAction,
  italicAction,
  addLinkAction,
  removeLinkAction,
  isBoldActive,
  isItalicActive,
  isLinkActive,
  getLinkHref,
  nextSlideAction,
  prevSlideAction,
  goToSlideAction,
  getSlideCountAction,
  getCurrentSlideAction,
  actions
} from '../index';

describe('Actions API', () => {
  describe('History Actions', () => {
    describe('undoAction', () => {
      it('should undo the last change', () => {
        const { view } = createTestEditor();
        const initialDoc = view.state.doc.toString();
        
        typeText(view, 'Test text');
        const afterChange = view.state.doc.toString();
        expect(afterChange).not.toBe(initialDoc);
        
        const result = undoAction(view);
        
        expect(result).toBe(true);
        expect(view.state.doc.toString()).toBe(initialDoc);
      });

      it('should return false when nothing to undo', () => {
        const { view } = createTestEditor();
        const result = undoAction(view);
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const result = undoAction(null);
        expect(result).toBe(false);
      });
    });

    describe('redoAction', () => {
      it('should redo undone change', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Test');
        const afterChange = view.state.doc.toString();
        
        undoAction(view);
        const result = redoAction(view);
        
        expect(result).toBe(true);
        expect(view.state.doc.toString()).toBe(afterChange);
      });

      it('should return false when nothing to redo', () => {
        const { view } = createTestEditor();
        const result = redoAction(view);
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const result = redoAction(null);
        expect(result).toBe(false);
      });
    });
  });

  describe('Text Formatting Actions', () => {
    describe('boldAction', () => {
      it('should apply bold mark to selection', () => {
        const { view, schema } = createTestEditor();
        
        typeText(view, 'Bold text');
        
        const from = 6;
        const to = from + 9;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = boldAction(view);
        
        expect(result).toBe(true);
        // Verify bold mark is in the document
        let hasBold = false;
        view.state.doc.nodesBetween(from, to, node => {
          if (node.marks.some(mark => mark.type.name === 'bold')) {
            hasBold = true;
          }
        });
        expect(hasBold).toBe(true);
      });

      it('should return false when view is null', () => {
        const result = boldAction(null);
        expect(result).toBe(false);
      });

      it('should toggle bold off if already bold', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        // Apply bold
        boldAction(view);
        
        // Toggle off
        const result = boldAction(view);
        expect(result).toBe(true);
      });
    });

    describe('italicAction', () => {
      it('should apply italic mark to selection', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Italic text');
        
        const from = 6;
        const to = from + 11;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = italicAction(view);
        
        expect(result).toBe(true);
        let hasItalic = false;
        view.state.doc.nodesBetween(from, to, node => {
          if (node.marks.some(mark => mark.type.name === 'italic')) {
            hasItalic = true;
          }
        });
        expect(hasItalic).toBe(true);
      });

      it('should return false when view is null', () => {
        const result = italicAction(null);
        expect(result).toBe(false);
      });
    });
  });

  describe('Link Actions', () => {
    describe('addLinkAction', () => {
      it('should add link to selection', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Click here');
        
        const from = 6;
        const to = from + 10;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = addLinkAction(view, 'https://example.com');
        
        expect(result).toBe(true);
        let hasLink = false;
        view.state.doc.nodesBetween(from, to, node => {
          if (node.marks.some(mark => mark.type.name === 'link')) {
            hasLink = true;
          }
        });
        expect(hasLink).toBe(true);
      });

      it('should add link with title', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Link');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = addLinkAction(view, 'https://example.com', 'Example');
        
        expect(result).toBe(true);
      });

      it('should return false when no text selected', () => {
        const { view } = createTestEditor();
        
        const result = addLinkAction(view, 'https://example.com');
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const result = addLinkAction(null, 'https://example.com');
        expect(result).toBe(false);
      });

      it('should return false when href is empty', () => {
        const { view } = createTestEditor();
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = addLinkAction(view, '');
        expect(result).toBe(false);
      });
    });

    describe('removeLinkAction', () => {
      it('should remove link from selection', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Link');
        
        const from = 6;
        const to = from + 4;
        let tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        // Add link first
        addLinkAction(view, 'https://example.com');
        
        // Remove link
        const result = removeLinkAction(view);
        
        expect(result).toBe(true);
      });

      it('should return false when view is null', () => {
        const result = removeLinkAction(null);
        expect(result).toBe(false);
      });
    });
  });

  describe('State Check Actions', () => {
    describe('isBoldActive', () => {
      it('should return true when bold is active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Bold');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        boldAction(view);
        
        const result = isBoldActive(view);
        expect(result).toBe(true);
      });

      it('should return false when bold is not active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = isBoldActive(view);
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const result = isBoldActive(null);
        expect(result).toBe(false);
      });
    });

    describe('isItalicActive', () => {
      it('should return true when italic is active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Italic');
        
        const from = 6;
        const to = from + 6;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        italicAction(view);
        
        const result = isItalicActive(view);
        expect(result).toBe(true);
      });

      it('should return false when italic is not active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = isItalicActive(view);
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const result = isItalicActive(null);
        expect(result).toBe(false);
      });
    });

    describe('isLinkActive', () => {
      it('should return true when link is active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Link');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        addLinkAction(view, 'https://example.com');
        
        const result = isLinkActive(view);
        expect(result).toBe(true);
      });

      it('should return false when link is not active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = isLinkActive(view);
        expect(result).toBe(false);
      });

      it('should return false when view is null', () => {
        const result = isLinkActive(null);
        expect(result).toBe(false);
      });
    });

    describe('getLinkHref', () => {
      it('should return href when link is active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Link');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        addLinkAction(view, 'https://example.com');
        
        const result = getLinkHref(view);
        expect(result).toBe('https://example.com');
      });

      it('should return null when no link is active', () => {
        const { view } = createTestEditor();
        
        typeText(view, 'Text');
        
        const from = 6;
        const to = from + 4;
        const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
        view.dispatch(tr);
        
        const result = getLinkHref(view);
        expect(result).toBe(null);
      });

      it('should return null when view is null', () => {
        const result = getLinkHref(null);
        expect(result).toBe(null);
      });
    });
  });

  describe('Navigation Actions', () => {
    let editorElement: HTMLElement;

    beforeEach(() => {
      editorElement = createMockEditorElement();
    });

    afterEach(() => {
      cleanupMockEditorElement(editorElement);
    });

    describe('nextSlideAction', () => {
      it('should call navigation function with editor element', () => {
        // This is a thin wrapper, just verify it doesn't throw
        expect(() => {
          nextSlideAction(editorElement);
        }).not.toThrow();
      });

      it('should handle null element gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        nextSlideAction(null);
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });

      it('should accept onSlideChange callback', () => {
        const callback = jest.fn();
        
        expect(() => {
          nextSlideAction(editorElement, callback);
        }).not.toThrow();
      });
    });

    describe('prevSlideAction', () => {
      it('should call navigation function with editor element', () => {
        expect(() => {
          prevSlideAction(editorElement);
        }).not.toThrow();
      });

      it('should handle null element gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        prevSlideAction(null);
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });

      it('should accept onSlideChange callback', () => {
        const callback = jest.fn();
        
        expect(() => {
          prevSlideAction(editorElement, callback);
        }).not.toThrow();
      });
    });

    describe('goToSlideAction', () => {
      it('should call navigation function with slide index', () => {
        expect(() => {
          goToSlideAction(editorElement, 0);
        }).not.toThrow();
      });

      it('should handle null element gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        goToSlideAction(null, 0);
        
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });

      it('should accept onSlideChange callback', () => {
        const callback = jest.fn();
        
        expect(() => {
          goToSlideAction(editorElement, 1, callback);
        }).not.toThrow();
      });
    });

    describe('getSlideCountAction', () => {
      it('should return 0 when element is null', () => {
        const result = getSlideCountAction(null);
        expect(result).toBe(0);
      });

      it('should return slide count from element', () => {
        // Add mock slides to element
        const slide1 = document.createElement('div');
        slide1.setAttribute('data-node-type', 'slide');
        const slide2 = document.createElement('div');
        slide2.setAttribute('data-node-type', 'slide');
        
        editorElement.appendChild(slide1);
        editorElement.appendChild(slide2);
        
        const result = getSlideCountAction(editorElement);
        expect(result).toBe(2);
      });
    });

    describe('getCurrentSlideAction', () => {
      it('should return 0 when element is null', () => {
        const result = getCurrentSlideAction(null);
        expect(result).toBe(0);
      });

      it('should return current slide index from element', () => {
        const result = getCurrentSlideAction(editorElement);
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('actions object', () => {
    it('should export all action functions', () => {
      expect(actions.undo).toBe(undoAction);
      expect(actions.redo).toBe(redoAction);
      expect(actions.bold).toBe(boldAction);
      expect(actions.italic).toBe(italicAction);
      expect(actions.addLink).toBe(addLinkAction);
      expect(actions.removeLink).toBe(removeLinkAction);
      expect(actions.isBoldActive).toBe(isBoldActive);
      expect(actions.isItalicActive).toBe(isItalicActive);
      expect(actions.isLinkActive).toBe(isLinkActive);
      expect(actions.getLinkHref).toBe(getLinkHref);
      expect(actions.nextSlide).toBe(nextSlideAction);
      expect(actions.prevSlide).toBe(prevSlideAction);
      expect(actions.goToSlide).toBe(goToSlideAction);
      expect(actions.getSlideCount).toBe(getSlideCountAction);
      expect(actions.getCurrentSlide).toBe(getCurrentSlideAction);
    });

    it('should allow calling actions via the actions object', () => {
      const { view } = createTestEditor();
      
      expect(() => {
        actions.bold(view);
        actions.italic(view);
        actions.undo(view);
      }).not.toThrow();
    });
  });

  describe('Integration with real editor', () => {
    it('should work with complete workflow', () => {
      const { view } = createTestEditor();
      
      // Type text
      typeText(view, 'Hello World');
      
      // Select text
      const from = 6;
      const to = from + 11;
      const tr = view.state.tr.setSelection(TextSelection.create(view.state.doc, from, to));
      view.dispatch(tr);
      
      // Apply formatting
      const boldResult = actions.bold(view);
      const italicResult = actions.italic(view);
      
      expect(boldResult).toBe(true);
      expect(italicResult).toBe(true);
      expect(actions.isBoldActive(view)).toBe(true);
      expect(actions.isItalicActive(view)).toBe(true);
      
      // Add link
      const linkResult = actions.addLink(view, 'https://example.com');
      expect(linkResult).toBe(true);
      expect(actions.isLinkActive(view)).toBe(true);
      expect(actions.getLinkHref(view)).toBe('https://example.com');
      
      // Remove link
      const removeLinkResult = actions.removeLink(view);
      expect(removeLinkResult).toBe(true);
      expect(actions.isLinkActive(view)).toBe(false);
    });
  });
});

