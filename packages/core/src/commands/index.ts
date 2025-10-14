/**
 * Commands API Implementation
 * 
 * Comprehensive commands system for programmatic control of the editor.
 * All commands are null-safe and return boolean indicating success/failure.
 */

import { EditorView } from 'prosemirror-view';
import { toggleMark, setBlockType } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { AllSelection } from 'prosemirror-state';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import type { Commands, ChainedCommands, NavigationOptions } from '../types/index';
import {
  canUndo as canUndoUtil,
  canRedo as canRedoUtil,
  getUndoDepth as getUndoDepthUtil,
  getRedoDepth as getRedoDepthUtil,
  getHistoryState as getHistoryStateUtil,
  clearHistory as clearHistoryUtil
} from '../utils/historyUtils';
import {
  nextSlide as navNextSlide,
  prevSlide as navPrevSlide,
  goToSlide as navGoToSlide,
  canGoNext as canGoNextUtil,
  canGoPrev as canGoPrevUtil,
  getSlideInfo as getSlideInfoUtil,
  getSlideCount
} from '../utils/slideNavigation';
import {
  setTextSelection,
  selectSlide as selectSlideUtil,
  collapseSelection as collapseUtil,
  expandSelection as expandUtil,
  getSelectedText,
  isSelectionEmpty,
  isAtDocStart,
  isAtDocEnd
} from '../utils/selectionUtils';
import { parseLayout, applyAllLayouts } from '../utils/layoutParser';
import { extractContentBlocks, redistributeContent } from '../utils/contentRedistribution';

/**
 * Create commands object for a given editor view
 * 
 * @param getView - Function that returns the current EditorView
 * @returns Commands object with all available commands
 */
export function createCommands(getView: () => EditorView | null): Commands {
  
  /**
   * Helper: Get view or return null
   */
  const view = (): EditorView | null => {
    return getView();
  };

  /**
   * Helper: Safely execute a command
   */
  const exec = (fn: () => boolean): boolean => {
    try {
      const v = view();
      if (!v) {
        console.warn('[AutoArtifacts] Command failed: editor not initialized');
        return false;
      }
      return fn();
    } catch (e) {
      console.warn('[AutoArtifacts] Command failed:', e);
      return false;
    }
  };

  const commands: Commands = {
    // =========================
    // TEXT FORMATTING COMMANDS
    // =========================
    
    toggleBold: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.bold;
      if (!markType) return false;
      return toggleMark(markType)(v.state, v.dispatch);
    }),

    toggleItalic: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.italic;
      if (!markType) return false;
      return toggleMark(markType)(v.state, v.dispatch);
    }),

    toggleUnderline: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.underline;
      if (!markType) return false;
      return toggleMark(markType)(v.state, v.dispatch);
    }),

    toggleStrikethrough: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.strikethrough;
      if (!markType) return false;
      return toggleMark(markType)(v.state, v.dispatch);
    }),

    toggleCode: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.code;
      if (!markType) return false;
      return toggleMark(markType)(v.state, v.dispatch);
    }),

    setTextColor: (color: string) => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.textColor;
      if (!markType) return false;
      
      const { from, to } = v.state.selection;
      if (from === to) return false; // Nothing selected
      
      const mark = markType.create({ color });
      const tr = v.state.tr.addMark(from, to, mark);
      v.dispatch(tr);
      return true;
    }),

    setHighlight: (color: string) => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.highlight;
      if (!markType) return false;
      
      const { from, to } = v.state.selection;
      if (from === to) return false;
      
      const mark = markType.create({ color });
      const tr = v.state.tr.addMark(from, to, mark);
      v.dispatch(tr);
      return true;
    }),

    removeTextColor: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.textColor;
      if (!markType) return false;
      
      const { from, to } = v.state.selection;
      const tr = v.state.tr.removeMark(from, to, markType);
      v.dispatch(tr);
      return true;
    }),

    removeHighlight: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.highlight;
      if (!markType) return false;
      
      const { from, to } = v.state.selection;
      const tr = v.state.tr.removeMark(from, to, markType);
      v.dispatch(tr);
      return true;
    }),

    // =========================
    // HEADING COMMANDS
    // =========================

    setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => exec(() => {
      const v = view()!;
      const nodeType = v.state.schema.nodes.heading;
      if (!nodeType) return false;
      return setBlockType(nodeType, { level })(v.state, v.dispatch);
    }),

    toggleHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => exec(() => {
      const v = view()!;
      const { $from } = v.state.selection;
      const node = $from.parent;
      
      // If already this heading level, convert to paragraph
      if (node.type.name === 'heading' && node.attrs.level === level) {
        return commands.setParagraph();
      }
      
      return commands.setHeading(level);
    }),

    setParagraph: () => exec(() => {
      const v = view()!;
      const nodeType = v.state.schema.nodes.paragraph;
      if (!nodeType) return false;
      return setBlockType(nodeType)(v.state, v.dispatch);
    }),

    // =========================
    // LINK COMMANDS
    // =========================

    setLink: (href: string, title?: string) => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.link;
      if (!markType) return false;
      
      const { from, to } = v.state.selection;
      if (from === to) return false; // Nothing selected
      
      const mark = markType.create({ href, title, target: '_blank' });
      const tr = v.state.tr.addMark(from, to, mark);
      v.dispatch(tr);
      return true;
    }),

    updateLink: (href: string, title?: string) => {
      // Same as setLink - it updates if already exists
      return commands.setLink(href, title);
    },

    removeLink: () => exec(() => {
      const v = view()!;
      const markType = v.state.schema.marks.link;
      if (!markType) return false;
      
      const { from, to } = v.state.selection;
      const tr = v.state.tr.removeMark(from, to, markType);
      v.dispatch(tr);
      return true;
    }),

    // =========================
    // LIST COMMANDS
    // =========================

    toggleBulletList: () => exec(() => {
      // TODO: Implement proper list toggling
      // This requires prosemirror-schema-list utilities
      console.warn('[AutoArtifacts] toggleBulletList not yet implemented - requires prosemirror-schema-list package');
      return false;
    }),

    toggleOrderedList: () => exec(() => {
      // TODO: Implement proper list toggling
      console.warn('[AutoArtifacts] toggleOrderedList not yet implemented - requires prosemirror-schema-list package');
      return false;
    }),

    // =========================
    // MEDIA COMMANDS
    // =========================

    insertImage: (attrs) => exec(() => {
      const v = view()!;
      const nodeType = v.state.schema.nodes.image;
      if (!nodeType) return false;
      
      const node = nodeType.create(attrs);
      const tr = v.state.tr.replaceSelectionWith(node);
      v.dispatch(tr);
      return true;
    }),

    insertVideo: (attrs) => exec(() => {
      const v = view()!;
      const nodeType = v.state.schema.nodes.video;
      if (!nodeType) return false;
      
      const node = nodeType.create(attrs);
      const tr = v.state.tr.replaceSelectionWith(node);
      v.dispatch(tr);
      return true;
    }),

    // =========================
    // SLIDE COMMANDS
    // =========================

    addSlide: (position: 'end' | 'before' | 'after' | number = 'end', options?: { placeholderHeader?: string }) => exec(() => {
      const v = view()!;
      const slideType = v.state.schema.nodes.slide;
      const rowType = v.state.schema.nodes.row;
      const columnType = v.state.schema.nodes.column;
      const paragraphType = v.state.schema.nodes.paragraph;
      const headingType = v.state.schema.nodes.heading;
      
      if (!slideType || !rowType || !columnType || !paragraphType || !headingType) return false;
      
      // Create empty slide with heading + paragraph: slide > row > column > [heading, paragraph]
      const placeholderText = options?.placeholderHeader || 'Slide Header';
      const emptyHeading = headingType.create({ level: 1, placeholder: placeholderText });
      const emptyParagraph = paragraphType.create();
      const emptyColumn = columnType.create(null, [emptyHeading, emptyParagraph]);
      const emptyRow = rowType.create(null, emptyColumn);
      const newSlide = slideType.create(null, emptyRow);
      
      let insertPos: number;
      
      // If position is a number, use it directly
      if (typeof position === 'number') {
        insertPos = position;
      } else if (position === 'end') {
        insertPos = v.state.doc.content.size;
      } else {
        // Find current slide for 'before' or 'after'
        const { $from } = v.state.selection;
        let slideDepth = -1;
        
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type === slideType) {
            slideDepth = d;
            break;
          }
        }
        
        if (slideDepth === -1) {
          insertPos = v.state.doc.content.size;
        } else {
          const slidePos = $from.before(slideDepth);
          insertPos = position === 'before' ? slidePos : $from.after(slideDepth);
        }
      }
      
      const tr = v.state.tr.insert(insertPos, newSlide);
      v.dispatch(tr);
      return true;
    }),

    deleteSlide: (slideIndex) => exec(() => {
      const v = view()!;
      const slideType = v.state.schema.nodes.slide;
      if (!slideType) return false;
      
      let currentIndex = 0;
      let deletePos = -1;
      let deleteSize = 0;
      
      v.state.doc.forEach((node, offset) => {
        if (node.type === slideType) {
          if (slideIndex === undefined) {
            // Delete current slide based on cursor
            const { $from } = v.state.selection;
            if (offset <= $from.pos && $from.pos <= offset + node.nodeSize) {
              deletePos = offset;
              deleteSize = node.nodeSize;
              return false;
            }
          } else if (currentIndex === slideIndex) {
            deletePos = offset;
            deleteSize = node.nodeSize;
            return false;
          }
          currentIndex++;
        }
      });
      
      if (deletePos === -1) return false;
      
      const tr = v.state.tr.delete(deletePos, deletePos + deleteSize);
      v.dispatch(tr);
      return true;
    }),

    duplicateSlide: (slideIndex) => exec(() => {
      const v = view()!;
      const slideType = v.state.schema.nodes.slide;
      if (!slideType) return false;
      
      let currentIndex = 0;
      let slideNode: ProseMirrorNode | null = null;
      let insertPos = -1;
      
      v.state.doc.forEach((node, offset) => {
        if (node.type === slideType) {
          if (slideIndex === undefined) {
            const { $from } = v.state.selection;
            if (offset <= $from.pos && $from.pos <= offset + node.nodeSize) {
              slideNode = node;
              insertPos = offset + node.nodeSize;
              return false;
            }
          } else if (currentIndex === slideIndex) {
            slideNode = node;
            insertPos = offset + node.nodeSize;
            return false;
          }
          currentIndex++;
        }
      });
      
      if (!slideNode || insertPos === -1) return false;
      
      // TypeScript needs this explicit check
      const validSlideNode = slideNode as ProseMirrorNode;
      const tr = v.state.tr.insert(insertPos, validSlideNode.copy(validSlideNode.content));
      v.dispatch(tr);
      return true;
    }),

    // =========================
    // SLIDE NAVIGATION COMMANDS
    // =========================

    nextSlide: (options?: NavigationOptions) => {
      const v = view();
      if (!v) return;
      navNextSlide(v.dom as HTMLElement, undefined, options);
    },

    prevSlide: (options?: NavigationOptions) => {
      const v = view();
      if (!v) return;
      navPrevSlide(v.dom as HTMLElement, undefined, options);
    },

    goToSlide: (slideIndex: number, options?: NavigationOptions) => {
      const v = view();
      if (!v) return;
      navGoToSlide(v.dom as HTMLElement, slideIndex, undefined, options);
    },

    goToFirstSlide: (options?: NavigationOptions) => {
      const v = view();
      if (!v) return;
      navGoToSlide(v.dom as HTMLElement, 0, undefined, options);
    },

    goToLastSlide: (options?: NavigationOptions) => {
      const v = view();
      if (!v) return;
      const total = getSlideCount(v.dom as HTMLElement);
      if (total > 0) {
        navGoToSlide(v.dom as HTMLElement, total - 1, undefined, options);
      }
    },

    canGoNext: (circular = false) => {
      const v = view();
      if (!v) return false;
      return canGoNextUtil(v.dom as HTMLElement, circular);
    },

    canGoPrev: (circular = false) => {
      const v = view();
      if (!v) return false;
      return canGoPrevUtil(v.dom as HTMLElement, circular);
    },

    getSlideInfo: () => {
      const v = view();
      if (!v) {
        return {
          index: 0,
          total: 0,
          isFirst: true,
          isLast: true,
          canGoNext: false,
          canGoPrev: false
        };
      }
      return getSlideInfoUtil(v.dom as HTMLElement);
    },

    // =========================
    // LAYOUT COMMANDS
    // =========================

    setLayout: (layout: string) => exec(() => {
      const v = view()!;
      const { $from } = v.state.selection;
      
      // Find parent row
      let rowDepth = -1;
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === 'row') {
          rowDepth = d;
          break;
        }
      }
      
      if (rowDepth === -1) return false;
      
      const rowPos = $from.before(rowDepth);
      const tr = v.state.tr.setNodeMarkup(rowPos, null, { layout });
      v.dispatch(tr);
      
      // Trigger layout recalculation
      setTimeout(() => {
        applyAllLayouts(v.dom);
      }, 0);
      
      return true;
    }),

    setSlideLayout: (layout: string) => exec(() => {
      const v = view()!;
      const { $from } = v.state.selection;
      
      // Find parent slide
      let slideDepth = -1;
      for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === 'slide') {
          slideDepth = d;
          break;
        }
      }
      
      if (slideDepth === -1) {
        console.warn('[AutoArtifacts] setSlideLayout: No slide found at cursor position');
        return false;
      }
      
      const slideNode = $from.node(slideDepth);
      const slidePos = $from.before(slideDepth);
      
      // Validate layout string
      const tempColumnCount = layout.split('-').length;
      const ratios = parseLayout(layout, tempColumnCount);
      if (!ratios || ratios.length === 0) {
        console.warn('[AutoArtifacts] setSlideLayout: Invalid layout format');
        return false;
      }
      
      const columnCount = ratios.length;
      
      // Extract existing content from all columns
      const existingBlocks = extractContentBlocks(slideNode);
      
      // Create new columns with redistributed content
      const newColumns = redistributeContent(existingBlocks, columnCount, v.state.schema);
      
      if (newColumns.length === 0) {
        console.error('[AutoArtifacts] setSlideLayout: Failed to create columns');
        return false;
      }
      
      // Create new row with layout and columns
      const rowType = v.state.schema.nodes.row;
      if (!rowType) return false;
      
      const newRow = rowType.create({ layout }, newColumns);
      
      // Create new slide with updated layout attribute and new row
      const slideType = v.state.schema.nodes.slide;
      if (!slideType) return false;
      
      const newSlide = slideType.create({ ...slideNode.attrs, layout }, [newRow]);
      
      // Replace the slide
      const tr = v.state.tr.replaceRangeWith(
        slidePos,
        slidePos + slideNode.nodeSize,
        newSlide
      );
      
      v.dispatch(tr);
      
      // Apply layout styles - need to wait for DOM update
      setTimeout(() => {
        // Use closest to find the editor wrapper, or v.dom itself
        const editorElement = (v.dom.closest('.autoartifacts-editor') as HTMLElement) || v.dom;
        applyAllLayouts(editorElement);
      }, 10);
      
      return true;
    }),

    // =========================
    // HISTORY COMMANDS
    // =========================

    undo: () => exec(() => {
      const v = view()!;
      return undo(v.state, v.dispatch);
    }),

    redo: () => exec(() => {
      const v = view()!;
      return redo(v.state, v.dispatch);
    }),

    canUndo: () => {
      const v = view();
      if (!v) return false;
      return canUndoUtil(v);
    },

    canRedo: () => {
      const v = view();
      if (!v) return false;
      return canRedoUtil(v);
    },

    getUndoDepth: () => {
      const v = view();
      if (!v) return 0;
      return getUndoDepthUtil(v);
    },

    getRedoDepth: () => {
      const v = view();
      if (!v) return 0;
      return getRedoDepthUtil(v);
    },

    getHistoryState: () => {
      const v = view();
      if (!v) {
        return {
          canUndo: false,
          canRedo: false,
          undoDepth: 0,
          redoDepth: 0
        };
      }
      return getHistoryStateUtil(v);
    },

    clearHistory: () => exec(() => {
      const v = view()!;
      return clearHistoryUtil(v);
    }),

    // =========================
    // FOCUS AND SELECTION
    // =========================

    focus: () => exec(() => {
      const v = view()!;
      v.focus();
      return true;
    }),

    blur: () => exec(() => {
      const v = view()!;
      (v.dom as HTMLElement).blur();
      return true;
    }),

    selectAll: () => exec(() => {
      const v = view()!;
      const tr = v.state.tr.setSelection(new AllSelection(v.state.doc));
      v.dispatch(tr);
      return true;
    }),

    deleteSelection: () => exec(() => {
      const v = view()!;
      const tr = v.state.tr.deleteSelection();
      v.dispatch(tr);
      return true;
    }),

    // =========================
    // SELECTION COMMANDS
    // =========================

    setSelection: (from: number, to?: number) => exec(() => {
      const v = view()!;
      return setTextSelection(v, from, to);
    }),

    selectSlide: (slideIndex: number) => exec(() => {
      const v = view()!;
      return selectSlideUtil(v, slideIndex);
    }),

    collapseSelection: (toStart = true) => exec(() => {
      const v = view()!;
      return collapseUtil(v, toStart);
    }),

    expandSelection: () => exec(() => {
      const v = view()!;
      return expandUtil(v);
    }),

    getSelectedText: () => {
      const v = view();
      if (!v) return '';
      return getSelectedText(v);
    },

    isSelectionEmpty: () => {
      const v = view();
      if (!v) return true;
      return isSelectionEmpty(v);
    },

    isAtStart: () => {
      const v = view();
      if (!v) return false;
      return isAtDocStart(v);
    },

    isAtEnd: () => {
      const v = view();
      if (!v) return false;
      return isAtDocEnd(v);
    },

    // =========================
    // CONTENT MANIPULATION
    // =========================

    clearContent: () => exec(() => {
      const v = view()!;
      const tr = v.state.tr.delete(0, v.state.doc.content.size);
      v.dispatch(tr);
      return true;
    }),

    // =========================
    // CHAINING
    // =========================

    chain: () => createChainedCommands(getView, commands)
  };

  return commands;
}

/**
 * Create chainable commands implementation
 */
function createChainedCommands(
  _getView: () => EditorView | null,
  commands: Commands
): ChainedCommands {
  const commandQueue: Array<() => boolean> = [];

  const chain: any = {
    run: () => {
      let success = true;
      for (const command of commandQueue) {
        if (!command()) {
          success = false;
          break; // Stop on first failure
        }
      }
      commandQueue.length = 0; // Clear queue
      return success;
    }
  };

  // Create chainable versions of all commands
  Object.keys(commands).forEach((key) => {
    if (key !== 'chain') {
      chain[key] = (...args: any[]) => {
        commandQueue.push(() => (commands as any)[key](...args));
        return chain;
      };
    }
  });

  return chain as ChainedCommands;
}

