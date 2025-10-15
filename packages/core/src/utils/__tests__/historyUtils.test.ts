/**
 * History Utils Tests
 */

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from '../../schema';
import { history, undo, redo } from 'prosemirror-history';
import {
  canUndo,
  canRedo,
  getUndoDepth,
  getRedoDepth,
  getHistoryState,
  clearHistory
} from '../historyUtils';

describe('History Utils', () => {
  let view: EditorView;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    const state = EditorState.create({
      schema,
      plugins: [history()]
    });

    view = new EditorView(container, { state });
  });

  afterEach(() => {
    view.destroy();
    document.body.removeChild(container);
  });

  describe('canUndo', () => {
    it('should return false when no history', () => {
      expect(canUndo(view)).toBe(false);
    });

    it('should return true after making a change', () => {
      const { tr } = view.state;
      tr.insertText('test');
      view.dispatch(tr);

      expect(canUndo(view)).toBe(true);
    });
  });

  describe('canRedo', () => {
    it('should return false when no redo available', () => {
      expect(canRedo(view)).toBe(false);
    });

    it('should return true after undo', () => {
      // Make a change
      const { tr } = view.state;
      tr.insertText('test');
      view.dispatch(tr);

      // Undo it
      undo(view.state, view.dispatch);

      expect(canRedo(view)).toBe(true);
    });
  });

  describe('getUndoDepth', () => {
    it('should return 0 when no history', () => {
      expect(getUndoDepth(view)).toBe(0);
    });

    it('should return correct depth after changes', () => {
      // Make first change
      let tr = view.state.tr;
      tr.insertText('test1');
      view.dispatch(tr);

      expect(getUndoDepth(view)).toBeGreaterThan(0);

      // Make second change
      tr = view.state.tr;
      tr.insertText('test2');
      view.dispatch(tr);

      expect(getUndoDepth(view)).toBeGreaterThan(0);
    });
  });

  describe('getRedoDepth', () => {
    it('should return 0 when no redo available', () => {
      expect(getRedoDepth(view)).toBe(0);
    });

    it('should return correct depth after undo', () => {
      // Make changes
      let tr = view.state.tr;
      tr.insertText('test');
      view.dispatch(tr);

      // Undo
      undo(view.state, view.dispatch);

      expect(getRedoDepth(view)).toBeGreaterThan(0);
    });
  });

  describe('getHistoryState', () => {
    it('should return complete history state with no history', () => {
      const state = getHistoryState(view);

      expect(state).toEqual({
        canUndo: false,
        canRedo: false,
        undoDepth: 0,
        redoDepth: 0
      });
    });

    it('should return complete history state after changes', () => {
      // Make a change
      let tr = view.state.tr;
      tr.insertText('test');
      view.dispatch(tr);

      const state = getHistoryState(view);

      expect(state.canUndo).toBe(true);
      expect(state.canRedo).toBe(false);
      expect(state.undoDepth).toBeGreaterThan(0);
      expect(state.redoDepth).toBe(0);
    });

    it('should return complete history state after undo', () => {
      // Make a change
      let tr = view.state.tr;
      tr.insertText('test');
      view.dispatch(tr);

      // Undo
      undo(view.state, view.dispatch);

      const state = getHistoryState(view);

      expect(state.canUndo).toBe(false);
      expect(state.canRedo).toBe(true);
      expect(state.undoDepth).toBe(0);
      expect(state.redoDepth).toBeGreaterThan(0);
    });
  });

  describe('clearHistory', () => {
    it('should warn and return false', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = clearHistory(view);

      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('clearHistory is not fully implemented')
      );

      warnSpy.mockRestore();
    });
  });
});

