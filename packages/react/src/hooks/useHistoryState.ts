/**
 * useHistoryState Hook
 * 
 * Reactive hook for tracking editor history state.
 * Provides live updates of undo/redo availability and depth.
 */

import { useState, useEffect, useRef } from 'react';
import type { SlideEditorRef, HistoryState } from '@autoartifacts/core';

/**
 * Hook to track history state reactively
 * 
 * @param editorRef - Reference to the SlideEditor instance
 * @returns Current history state (canUndo, canRedo, undoDepth, redoDepth)
 * 
 * @example
 * const editorRef = useRef<SlideEditorRef>(null);
 * const { canUndo, canRedo, undoDepth, redoDepth } = useHistoryState(editorRef);
 * 
 * return (
 *   <>
 *     <button disabled={!canUndo} onClick={() => editorRef.current?.commands.undo()}>
 *       Undo ({undoDepth})
 *     </button>
 *     <button disabled={!canRedo} onClick={() => editorRef.current?.commands.redo()}>
 *       Redo ({redoDepth})
 *     </button>
 *   </>
 * );
 */
export function useHistoryState(
  editorRef: React.RefObject<SlideEditorRef>
): HistoryState {
  const [historyState, setHistoryState] = useState<HistoryState>({
    canUndo: false,
    canRedo: false,
    undoDepth: 0,
    redoDepth: 0
  });

  // Store previous state to avoid unnecessary updates
  const prevStateRef = useRef<HistoryState>(historyState);

  useEffect(() => {
    const updateHistoryState = () => {
      if (editorRef.current) {
        const newState = editorRef.current.getHistoryState();
        
        // Only update if state actually changed
        if (
          newState.canUndo !== prevStateRef.current.canUndo ||
          newState.canRedo !== prevStateRef.current.canRedo ||
          newState.undoDepth !== prevStateRef.current.undoDepth ||
          newState.redoDepth !== prevStateRef.current.redoDepth
        ) {
          prevStateRef.current = newState;
          setHistoryState(newState);
        }
      }
    };

    // Update on mount
    updateHistoryState();

    // Poll for updates
    // Note: This is not ideal but works. In production, you'd want to
    // subscribe to editor updates instead of polling.
    const interval = setInterval(updateHistoryState, 100);

    return () => clearInterval(interval);
  }, [editorRef]);

  return historyState;
}

