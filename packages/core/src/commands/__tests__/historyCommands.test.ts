/**
 * History Commands Tests
 * 
 * Tests for undo/redo and history-related commands
 */

import { createTestEditor, typeText } from '../../__tests__/testUtils';
import { createCommands } from '../index';
import { TextSelection } from 'prosemirror-state';

describe('History Commands', () => {
  describe('undo', () => {
    it('should undo last change', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const initialDoc = view.state.doc.toString();
      
      // Make a change
      typeText(view, 'Test text');
      
      const afterChangeDoc = view.state.doc.toString();
      expect(afterChangeDoc).not.toBe(initialDoc);
      
      // Undo
      const result = commands.undo();
      
      expect(result).toBe(true);
      expect(view.state.doc.toString()).toBe(initialDoc);
    });

    it('should return false when nothing to undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Try to undo with no history
      const result = commands.undo();
      
      expect(result).toBe(false);
    });

    it('should undo multiple changes in sequence', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const initialDoc = view.state.doc.toString();
      
      // Make three changes
      typeText(view, 'First');
      typeText(view, ' Second');
      typeText(view, ' Third');
      
      // Undo all three
      commands.undo();
      commands.undo();
      commands.undo();
      
      expect(view.state.doc.toString()).toBe(initialDoc);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.undo()).toBe(false);
    });
  });

  describe('redo', () => {
    it('should redo undone change', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Make a change
      typeText(view, 'Test text');
      const afterChangeDoc = view.state.doc.toString();
      
      // Undo it
      commands.undo();
      
      // Redo
      const result = commands.redo();
      
      expect(result).toBe(true);
      expect(view.state.doc.toString()).toBe(afterChangeDoc);
    });

    it('should return false when nothing to redo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const result = commands.redo();
      
      expect(result).toBe(false);
    });

    it('should redo multiple changes in sequence', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      // Make changes
      typeText(view, 'First');
      typeText(view, ' Second');
      const finalDoc = view.state.doc.toString();
      
      // Undo both
      commands.undo();
      commands.undo();
      
      // Redo both
      commands.redo();
      commands.redo();
      
      expect(view.state.doc.toString()).toBe(finalDoc);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.redo()).toBe(false);
    });
  });

  describe('canUndo', () => {
    it('should return true when there are changes to undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      
      expect(commands.canUndo()).toBe(true);
    });

    it('should return false when there is no history', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      expect(commands.canUndo()).toBe(false);
    });

    it('should return false after undoing all changes', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      commands.undo();
      
      expect(commands.canUndo()).toBe(false);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.canUndo()).toBe(false);
    });
  });

  describe('canRedo', () => {
    it('should return true after undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      commands.undo();
      
      expect(commands.canRedo()).toBe(true);
    });

    it('should return false when there is nothing to redo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      expect(commands.canRedo()).toBe(false);
    });

    it('should return false after redoing all changes', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      commands.undo();
      commands.redo();
      
      expect(commands.canRedo()).toBe(false);
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.canRedo()).toBe(false);
    });
  });

  describe('getUndoDepth', () => {
    it('should return 0 with no history', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      expect(commands.getUndoDepth()).toBe(0);
    });

    it('should return correct depth after changes', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'First');
      const depth1 = commands.getUndoDepth();
      
      typeText(view, 'Second');
      const depth2 = commands.getUndoDepth();
      
      // Both should have history
      expect(depth2).toBeGreaterThanOrEqual(depth1);
      expect(depth1).toBeGreaterThan(0);
    });

    it('should decrease after undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      const beforeUndo = commands.getUndoDepth();
      
      commands.undo();
      const afterUndo = commands.getUndoDepth();
      
      expect(afterUndo).toBeLessThan(beforeUndo);
    });

    it('should return 0 when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.getUndoDepth()).toBe(0);
    });
  });

  describe('getRedoDepth', () => {
    it('should return 0 with no redo history', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      expect(commands.getRedoDepth()).toBe(0);
    });

    it('should return correct depth after undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'First');
      typeText(view, 'Second');
      
      commands.undo();
      expect(commands.getRedoDepth()).toBeGreaterThan(0);
      
      commands.undo();
      expect(commands.getRedoDepth()).toBeGreaterThan(0);
    });

    it('should decrease after redo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      commands.undo();
      
      const beforeRedo = commands.getRedoDepth();
      commands.redo();
      const afterRedo = commands.getRedoDepth();
      
      expect(afterRedo).toBeLessThan(beforeRedo);
    });

    it('should return 0 when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.getRedoDepth()).toBe(0);
    });
  });

  describe('getHistoryState', () => {
    it('should return history state with undo and redo depths', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const state = commands.getHistoryState();
      
      expect(state).toHaveProperty('undoDepth');
      expect(state).toHaveProperty('redoDepth');
      expect(state).toHaveProperty('canUndo');
      expect(state).toHaveProperty('canRedo');
    });

    it('should reflect current state correctly', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      commands.undo();
      
      const state = commands.getHistoryState();
      
      expect(state.canUndo).toBe(false);
      expect(state.canRedo).toBe(true);
      expect(state.undoDepth).toBe(0);
      expect(state.redoDepth).toBeGreaterThan(0);
    });
  });

  describe('clearHistory', () => {
    it('should return false as clearHistory is not fully implemented', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'Test');
      expect(commands.canUndo()).toBe(true);
      
      // clearHistory is not fully implemented in ProseMirror
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = commands.clearHistory();
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('clearHistory is not fully implemented')
      );
      
      consoleSpy.mockRestore();
    });

    it('should return false when view is null', () => {
      const commands = createCommands(() => null);
      expect(commands.clearHistory()).toBe(false);
    });
  });

  describe('Undo/Redo integration', () => {
    it('should handle complex undo/redo sequences', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      const initial = view.state.doc.toString();
      
      // Use separate transactions that will be tracked in history
      typeText(view, 'A');
      typeText(view, 'B');
      typeText(view, 'C');
      
      const stateABC = view.state.doc.toString();
      
      // Undo three times
      commands.undo();
      commands.undo();
      commands.undo();
      
      // Should be back to initial
      expect(view.state.doc.toString()).toBe(initial);
      
      // Redo all three
      commands.redo();
      commands.redo();
      commands.redo();
      
      expect(view.state.doc.toString()).toBe(stateABC);
    });

    it('should clear redo stack when new change is made after undo', () => {
      const { view } = createTestEditor();
      const commands = createCommands(() => view);
      
      typeText(view, 'A');
      typeText(view, 'B');
      
      commands.undo();
      expect(commands.canRedo()).toBe(true);
      
      // Make new change
      typeText(view, 'C');
      
      // Redo stack should be cleared
      expect(commands.canRedo()).toBe(false);
    });
  });
});

