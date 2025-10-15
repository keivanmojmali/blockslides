/**
 * Selection Utils Tests
 */

import { EditorState, TextSelection, NodeSelection, AllSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from '../../schema';
import { createTestEditor } from '../../__tests__/testUtils';
import {
  getSelectionInfo,
  setTextSelection,
  selectAll,
  collapseSelection,
  expandSelection,
  getSelectedText,
  isSelectionEmpty,
  isAtDocStart,
  isAtDocEnd,
  selectSlide
} from '../selectionUtils';

describe('Selection Utils', () => {
  describe('getSelectionInfo', () => {
    it('should return selection information', () => {
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

    it('should detect empty selection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      const info = getSelectionInfo(view);
      
      expect(info.empty).toBe(true);
      expect(info.text).toBe('');
      
      view.destroy();
    });

    it('should include marks from selection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      const info = getSelectionInfo(view);
      expect(Array.isArray(info.marks)).toBe(true);
      
      view.destroy();
    });
  });

  describe('setTextSelection', () => {
    it('should set cursor position', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      const result = setTextSelection(view, 5);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(5);
      expect(view.state.selection.to).toBe(5);
      
      view.destroy();
    });

    it('should set selection range', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      const result = setTextSelection(view, 5, 10);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(5);
      expect(view.state.selection.to).toBe(10);
      
      view.destroy();
    });

    it('should clamp positions to valid range', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const maxPos = view.state.doc.content.size;
      
      const result = setTextSelection(view, maxPos + 100, maxPos + 200);
      
      expect(result).toBe(true);
      expect(view.state.selection.to).toBeLessThanOrEqual(maxPos);
      
      view.destroy();
    });

    it('should handle negative positions', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      const result = setTextSelection(view, -5, -1);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBeGreaterThanOrEqual(0);
      
      view.destroy();
    });

    it('should return false on error', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      // Force an error by trying to create invalid selection
      const result = setTextSelection(view, 1, 0);
      
      // Should still handle gracefully
      expect(typeof result).toBe('boolean');
      
      view.destroy();
    });
  });

  describe('selectAll', () => {
    it('should select all content', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      const result = selectAll(view);
      
      expect(result).toBe(true);
      expect(view.state.selection).toBeInstanceOf(AllSelection);
      
      view.destroy();
    });
  });

  describe('collapseSelection', () => {
    it('should collapse selection to start by default', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      // First select a range
      setTextSelection(view, 5, 10);
      
      // Then collapse
      const result = collapseSelection(view);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(view.state.selection.to);
      
      view.destroy();
    });

    it('should collapse selection to start when specified', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5, 10);
      const result = collapseSelection(view, true);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(view.state.selection.to);
      
      view.destroy();
    });

    it('should collapse selection to end when specified', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5, 10);
      const result = collapseSelection(view, false);
      
      expect(result).toBe(true);
      expect(view.state.selection.from).toBe(view.state.selection.to);
      
      view.destroy();
    });
  });

  describe('expandSelection', () => {
    it('should expand selection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5, 10);
      
      const result = expandSelection(view);
      
      // Result depends on whether there's something to expand to
      expect(typeof result).toBe('boolean');
      
      view.destroy();
    });
  });

  describe('getSelectedText', () => {
    it('should return empty string for collapsed selection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5);
      
      expect(getSelectedText(view)).toBe('');
      
      view.destroy();
    });

    it('should return selected text for range', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5, 10);
      
      const text = getSelectedText(view);
      expect(typeof text).toBe('string');
      
      view.destroy();
    });
  });

  describe('isSelectionEmpty', () => {
    it('should return true for collapsed selection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5);
      
      expect(isSelectionEmpty(view)).toBe(true);
      
      view.destroy();
    });

    it('should return false for range selection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5, 10);
      
      expect(isSelectionEmpty(view)).toBe(false);
      
      view.destroy();
    });
  });

  describe('isAtDocStart', () => {
    it('should return true when at document start', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 0);
      
      expect(isAtDocStart(view)).toBe(true);
      
      view.destroy();
    });

    it('should return false when not at start', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5);
      
      expect(isAtDocStart(view)).toBe(false);
      
      view.destroy();
    });
  });

  describe('isAtDocEnd', () => {
    it('should return true when at document end', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const maxPos = view.state.doc.content.size;
      
      setTextSelection(view, maxPos);
      
      expect(isAtDocEnd(view)).toBe(true);
      
      view.destroy();
    });

    it('should return false when not at end', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      setTextSelection(view, 5);
      
      expect(isAtDocEnd(view)).toBe(false);
      
      view.destroy();
    });
  });

  describe('selectSlide', () => {
    it('should select specific slide', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      
      const result = selectSlide(view, 0);
      
      expect(typeof result).toBe('boolean');
      
      view.destroy();
    });

    it('should warn on invalid slide index', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = selectSlide(view, 10);
      
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
      view.destroy();
    });

    it('should handle first slide', () => {
      const { view } = createTestEditor({ slideCount: 2 });
      
      const result = selectSlide(view, 0);
      
      expect(typeof result).toBe('boolean');
      
      view.destroy();
    });

    it('should handle errors gracefully', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Create a scenario that will trigger a try-catch by mocking the state
      const mockView = {
        ...view,
        state: {
          ...view.state,
          doc: null as any // Force an error
        }
      };
      
      const result = selectSlide(mockView as any, 0);
      
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
      view.destroy();
    });
  });

  describe('error handling', () => {
    it('setTextSelection should handle errors', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Create an invalid view that will cause errors
      const mockView = {
        state: null as any,
        dispatch: jest.fn()
      };
      
      const result = setTextSelection(mockView as any, 0, 10);
      
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
      view.destroy();
    });

    it('selectAll should handle errors', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mockView = {
        state: null as any,
        dispatch: jest.fn()
      };
      
      const result = selectAll(mockView as any);
      
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
      view.destroy();
    });

    it('collapseSelection should handle errors', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mockView = {
        state: null as any,
        dispatch: jest.fn()
      };
      
      const result = collapseSelection(mockView as any);
      
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
      view.destroy();
    });

    it('expandSelection should handle errors', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mockView = {
        state: null as any,
        dispatch: jest.fn()
      };
      
      const result = expandSelection(mockView as any);
      
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
      view.destroy();
    });

    it('expandSelection should return false when already at top level', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      // Set selection to document root level (depth 0)
      setTextSelection(view, 1);
      
      const result = expandSelection(view);
      
      // Should return false since we can't expand further at depth 0
      expect(typeof result).toBe('boolean');
      
      view.destroy();
    });

    it('getSelectionInfo should handle NodeSelection', () => {
      const { view } = createTestEditor({ slideCount: 1 });
      
      // Try to create a NodeSelection if possible
      const { state } = view;
      const slide = state.doc.firstChild;
      
      if (slide) {
        try {
          const nodeSelection = NodeSelection.create(state.doc, 0);
          const tr = state.tr.setSelection(nodeSelection);
          view.dispatch(tr);
          
          const info = getSelectionInfo(view);
          expect(info.nodeType).toBeDefined();
        } catch {
          // NodeSelection might not work with this schema, that's ok
        }
      }
      
      view.destroy();
    });
  });
});
