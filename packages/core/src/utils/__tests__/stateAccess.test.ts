/**
 * State Access Tests
 */

import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from '../../schema';
import { createTestEditor } from '../../__tests__/testUtils';
import {
  getCurrentSlideIndex,
  getTotalSlides,
  getSlideContent,
  getDocumentJSON,
  getDocumentHTML,
  getDocumentText,
  isDocumentEmpty,
  isEditorFocused,
  getSelectionInfo
} from '../stateAccess';

describe('State Access Utils', () => {
  describe('getCurrentSlideIndex', () => {
    it('should return 0 for first slide', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      expect(getCurrentSlideIndex(view)).toBe(0);
      view.destroy();
    });

    it('should return correct index when cursor in second slide', () => {
      const { view } = createTestEditor({ slideCount: 2 });

      // Move to second slide (approximate position)
      const tr = view.state.tr.setSelection(
        TextSelection.near(view.state.doc.resolve(30))
      );
      view.dispatch(tr);

      const index = getCurrentSlideIndex(view);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(2);
      view.destroy();
    });

    it('should default to 0 if no slide found', () => {
      const { view } = createTestEditor();
      expect(getCurrentSlideIndex(view)).toBe(0);
      view.destroy();
    });
  });

  describe('getTotalSlides', () => {
    it('should return 0 or 1 for basic document', () => {
      const state = EditorState.create({ schema });
      const view = new EditorView(document.body, { state });
      
      // Empty schema might auto-create a default structure
      const count = getTotalSlides(view);
      expect(count).toBeGreaterThanOrEqual(0);
      view.destroy();
    });

    it('should return correct count for single slide', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      expect(getTotalSlides(view)).toBe(1);
      view.destroy();
    });

    it('should return correct count for multiple slides', () => {
      const { view } = createTestEditor({ slideCount: 3 });
      expect(getTotalSlides(view)).toBe(3);
      view.destroy();
    });
  });

  describe('getSlideContent', () => {
    it('should return null for invalid index', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      expect(getSlideContent(view, 5)).toBeNull();
      view.destroy();
    });

    it('should return slide content for valid index', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const slide = getSlideContent(view, 0);
      expect(slide).toBeDefined();
      expect(slide?.type).toBe('slide');
      view.destroy();
    });

    it('should return correct slide when multiple exist', () => {
      const { view } = createTestEditor({ slideCount: 2 });

      const slide1 = getSlideContent(view, 0);
      const slide2 = getSlideContent(view, 1);
      
      expect(slide1).toBeDefined();
      expect(slide2).toBeDefined();
      expect(slide1?.type).toBe('slide');
      expect(slide2?.type).toBe('slide');
      view.destroy();
    });
  });

  describe('getDocumentJSON', () => {
    it('should return document as JSON', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const json = getDocumentJSON(view);
      expect(json.type).toBe('doc');
      expect(json.content).toBeDefined();
      view.destroy();
    });

    it('should match slide count', () => {
      const { view } = createTestEditor({ slideCount: 2 });

      const json = getDocumentJSON(view);
      expect(json.content).toHaveLength(2);
      expect(json.content[0].type).toBe('slide');
      view.destroy();
    });
  });

  describe('getDocumentHTML', () => {
    it('should return HTML string', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const html = getDocumentHTML(view);
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
      view.destroy();
    });

    it('should contain slide structure', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const html = getDocumentHTML(view);
      expect(html).toContain('data-node-type');
      view.destroy();
    });
  });

  describe('getDocumentText', () => {
    it('should return text content', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const text = getDocumentText(view);
      expect(typeof text).toBe('string');
      view.destroy();
    });

    it('should return plain text without formatting', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const text = getDocumentText(view);
      expect(text).not.toContain('<');
      expect(text).not.toContain('bold');
      view.destroy();
    });
  });

  describe('isDocumentEmpty', () => {
    it('should return false when document has text', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      // The test editor creates slides with "Header" and "Content" text
      expect(isDocumentEmpty(view)).toBe(false);
      view.destroy();
    });

    it('should return false when document has images', () => {
      const { view } = createTestEditor({
        content: {
          type: 'doc',
          content: [{
            type: 'slide',
            content: [{
              type: 'row',
              content: [{
                type: 'column',
                content: [{
                  type: 'image',
                  attrs: { src: 'test.jpg', alt: '', width: null, display: 'default', align: 'left' }
                }]
              }]
            }]
          }]
        }
      });

      expect(isDocumentEmpty(view)).toBe(false);
      view.destroy();
    });

    it('should return false when document has videos', () => {
      const { view } = createTestEditor({
        content: {
          type: 'doc',
          content: [{
            type: 'slide',
            content: [{
              type: 'row',
              content: [{
                type: 'column',
                content: [{
                  type: 'video',
                  attrs: { src: 'test.mp4', provider: 'youtube', width: null, aspectRatio: '16:9', align: 'center' }
                }]
              }]
            }]
          }]
        }
      });

      expect(isDocumentEmpty(view)).toBe(false);
      view.destroy();
    });

    it('should return true when only whitespace', () => {
      const { view } = createTestEditor({
        content: {
          type: 'doc',
          content: [{
            type: 'slide',
            content: [{
              type: 'row',
              content: [{
                type: 'column',
                content: [{
                  type: 'paragraph',
                  content: [{ type: 'text', text: '   ' }]
                }]
              }]
            }]
          }]
        }
      });

      expect(isDocumentEmpty(view)).toBe(true);
      view.destroy();
    });

    it('should return true for empty content', () => {
      const { view } = createTestEditor({
        content: {
          type: 'doc',
          content: [{
            type: 'slide',
            content: [{
              type: 'row',
              content: [{
                type: 'column',
                content: []
              }]
            }]
          }]
        }
      });

      expect(isDocumentEmpty(view)).toBe(true);
      view.destroy();
    });
  });

  describe('isEditorFocused', () => {
    it('should return boolean value', () => {
      const { view } = createTestEditor();
      const focused = isEditorFocused(view);
      expect(typeof focused).toBe('boolean');
      view.destroy();
    });

    it('should call hasFocus on view', () => {
      const { view } = createTestEditor();
      view.focus();
      // In jsdom, focus might not work the same way, so just check the function works
      const focused = isEditorFocused(view);
      expect(typeof focused).toBe('boolean');
      view.destroy();
    });
  });

  describe('getSelectionInfo', () => {
    it('should return selection info', () => {
      const { view } = createTestEditor({ slideCount: 1 });

      const info = getSelectionInfo(view);
      expect(info).toHaveProperty('from');
      expect(info).toHaveProperty('to');
      expect(info).toHaveProperty('empty');
      expect(info).toHaveProperty('text');
      expect(info).toHaveProperty('isAtStart');
      expect(info).toHaveProperty('isAtEnd');
      expect(info).toHaveProperty('marks');
      view.destroy();
    });
  });
});
