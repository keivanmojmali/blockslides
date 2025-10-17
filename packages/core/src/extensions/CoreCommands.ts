/**
 * CoreCommands Extension
 * 
 * Provides all core editing commands for AutoArtifacts.
 * This extension replaces the legacy commands/index.ts file with a proper
 * extension-based architecture.
 * 
 * Migrated from: src/commands/index.ts
 */

import { Extension } from "../Extension";
import { toggleMark, setBlockType } from "prosemirror-commands";
import { undo, redo } from "prosemirror-history";
import { AllSelection } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";
import type { AnyCommands } from "../types/commands";
import type { NavigationOptions } from "../types";
import {
  canUndo as canUndoUtil,
  canRedo as canRedoUtil,
  getUndoDepth as getUndoDepthUtil,
  getRedoDepth as getRedoDepthUtil,
  getHistoryState as getHistoryStateUtil,
  clearHistory as clearHistoryUtil,
} from "../utils/historyUtils";
import {
  nextSlide as navNextSlide,
  prevSlide as navPrevSlide,
  goToSlide as navGoToSlide,
  canGoNext as canGoNextUtil,
  canGoPrev as canGoPrevUtil,
  getSlideInfo as getSlideInfoUtil,
  getSlideCount,
} from "../utils/slideNavigation";
import {
  setTextSelection,
  selectSlide as selectSlideUtil,
  collapseSelection as collapseUtil,
  expandSelection as expandUtil,
  getSelectedText,
  isSelectionEmpty,
  isAtDocStart,
  isAtDocEnd,
} from "../utils/selectionUtils";
import { parseLayout, applyAllLayouts } from "../utils/layoutParser";
import {
  extractContentBlocks,
  redistributeContent,
} from "../utils/contentRedistribution";

/**
 * CoreCommands Extension
 * 
 * Provides comprehensive editing commands including:
 * - Text formatting (bold, italic, underline, etc.)
 * - Headings and paragraphs
 * - Links
 * - Lists (bullet, ordered)
 * - Media (images, videos)
 * - Slides (add, delete, duplicate)
 * - Slide navigation
 * - Layouts
 * - History (undo, redo)
 * - Focus and selection
 * - Content manipulation
 */
export class CoreCommands extends Extension {
  constructor() {
    super({});
    this.name = "CoreCommands";
    this.priority = 100; // High priority - core functionality
  }

  addCommands(): AnyCommands {
    return {
      // =========================
      // TEXT FORMATTING COMMANDS
      // =========================

      toggleBold: () => ({ state, dispatch }) => {
        const markType = state.schema.marks.bold;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },

      toggleItalic: () => ({ state, dispatch }) => {
        const markType = state.schema.marks.italic;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },

      toggleUnderline: () => ({ state, dispatch }) => {
        const markType = state.schema.marks.underline;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },

      toggleStrikethrough: () => ({ state, dispatch }) => {
        const markType = state.schema.marks.strikethrough;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },

      toggleCode: () => ({ state, dispatch }) => {
        const markType = state.schema.marks.code;
        if (!markType) return false;
        return toggleMark(markType)(state, dispatch);
      },

      setTextColor: (color: string) => ({ state, dispatch, tr }) => {
        const markType = state.schema.marks.textColor;
        if (!markType) return false;

        const { from, to } = state.selection;
        if (from === to) return false; // Nothing selected

        if (dispatch) {
          const mark = markType.create({ color });
          dispatch(tr.addMark(from, to, mark));
        }
        return true;
      },

      setHighlight: (color: string) => ({ state, dispatch, tr }) => {
        const markType = state.schema.marks.highlight;
        if (!markType) return false;

        const { from, to } = state.selection;
        if (from === to) return false;

        if (dispatch) {
          const mark = markType.create({ color });
          dispatch(tr.addMark(from, to, mark));
        }
        return true;
      },

      removeTextColor: () => ({ state, dispatch, tr }) => {
        const markType = state.schema.marks.textColor;
        if (!markType) return false;

        if (dispatch) {
          const { from, to } = state.selection;
          dispatch(tr.removeMark(from, to, markType));
        }
        return true;
      },

      removeHighlight: () => ({ state, dispatch, tr }) => {
        const markType = state.schema.marks.highlight;
        if (!markType) return false;

        if (dispatch) {
          const { from, to } = state.selection;
          dispatch(tr.removeMark(from, to, markType));
        }
        return true;
      },

      // =========================
      // HEADING COMMANDS
      // =========================

      setHeading:
        (level: 1 | 2 | 3 | 4 | 5 | 6) =>
        ({ state, dispatch }) => {
          const nodeType = state.schema.nodes.heading;
          if (!nodeType) return false;
          return setBlockType(nodeType, { level })(state, dispatch);
        },

      toggleHeading:
        (level: 1 | 2 | 3 | 4 | 5 | 6) =>
        ({ state, commands }) => {
          const { $from } = state.selection;
          const node = $from.parent;

          // If already this heading level, convert to paragraph
          if (node.type.name === "heading" && node.attrs.level === level) {
            return commands.setParagraph();
          }

          return commands.setHeading(level);
        },

      setParagraph: () => ({ state, dispatch }) => {
        const nodeType = state.schema.nodes.paragraph;
        if (!nodeType) return false;
        return setBlockType(nodeType)(state, dispatch);
      },

      // =========================
      // LINK COMMANDS
      // =========================

      setLink:
        (href: string, title?: string) =>
        ({ state, dispatch, tr }) => {
          const markType = state.schema.marks.link;
          if (!markType) return false;

          const { from, to } = state.selection;
          if (from === to) return false; // Nothing selected

          if (dispatch) {
            const mark = markType.create({ href, title, target: "_blank" });
            dispatch(tr.addMark(from, to, mark));
          }
          return true;
        },

      updateLink:
        (href: string, title?: string) =>
        ({ commands }) => {
          // Same as setLink - it updates if already exists
          return commands.setLink(href, title);
        },

      removeLink: () => ({ state, dispatch, tr }) => {
        const markType = state.schema.marks.link;
        if (!markType) return false;

        if (dispatch) {
          const { from, to } = state.selection;
          dispatch(tr.removeMark(from, to, markType));
        }
        return true;
      },

      // =========================
      // LIST COMMANDS
      // =========================

      toggleBulletList: () => () => {
        // TODO: Implement proper list toggling
        // This requires prosemirror-schema-list utilities
        console.warn(
          "[AutoArtifacts] toggleBulletList not yet implemented - requires prosemirror-schema-list package"
        );
        return false;
      },

      toggleOrderedList: () => () => {
        // TODO: Implement proper list toggling
        console.warn(
          "[AutoArtifacts] toggleOrderedList not yet implemented - requires prosemirror-schema-list package"
        );
        return false;
      },

      // =========================
      // MEDIA COMMANDS
      // =========================

      insertImage: (attrs: any) => ({ state, dispatch, tr }) => {
        const nodeType = state.schema.nodes.image;
        if (!nodeType) return false;

        if (dispatch) {
          const node = nodeType.create(attrs);
          dispatch(tr.replaceSelectionWith(node));
        }
        return true;
      },

      insertVideo: (attrs: any) => ({ state, dispatch, tr }) => {
        const nodeType = state.schema.nodes.video;
        if (!nodeType) return false;

        if (dispatch) {
          const node = nodeType.create(attrs);
          dispatch(tr.replaceSelectionWith(node));
        }
        return true;
      },

      // =========================
      // SLIDE COMMANDS
      // =========================

      addSlide:
        (
          position: "end" | "before" | "after" | number = "end",
          options?: { placeholderHeader?: string }
        ) =>
        ({ state, dispatch, tr }) => {
          const slideType = state.schema.nodes.slide;
          const rowType = state.schema.nodes.row;
          const columnType = state.schema.nodes.column;
          const paragraphType = state.schema.nodes.paragraph;
          const headingType = state.schema.nodes.heading;

          if (
            !slideType ||
            !rowType ||
            !columnType ||
            !paragraphType ||
            !headingType
          )
            return false;

          // Create empty slide with heading + paragraph
          const placeholderText = options?.placeholderHeader || "Slide Header";
          const emptyHeading = headingType.create({
            level: 1,
            placeholder: placeholderText,
          });
          const emptyParagraph = paragraphType.create();
          const emptyColumn = columnType.create(null, [
            emptyHeading,
            emptyParagraph,
          ]);
          const emptyRow = rowType.create(null, emptyColumn);
          const newSlide = slideType.create(null, emptyRow);

          let insertPos: number;

          // If position is a number, use it directly
          if (typeof position === "number") {
            insertPos = position;
          } else if (position === "end") {
            insertPos = state.doc.content.size;
          } else {
            // Find current slide for 'before' or 'after'
            const { $from } = state.selection;
            let slideDepth = -1;

            for (let d = $from.depth; d > 0; d--) {
              if ($from.node(d).type === slideType) {
                slideDepth = d;
                break;
              }
            }

            if (slideDepth === -1) {
              insertPos = state.doc.content.size;
            } else {
              const slidePos = $from.before(slideDepth);
              insertPos =
                position === "before" ? slidePos : $from.after(slideDepth);
            }
          }

          if (dispatch) {
            dispatch(tr.insert(insertPos, newSlide));
          }
          return true;
        },

      deleteSlide: (slideIndex?: number) => ({ state, dispatch, tr }) => {
        const slideType = state.schema.nodes.slide;
        if (!slideType) return false;

        let currentIndex = 0;
        let deletePos = -1;
        let deleteSize = 0;

        state.doc.forEach((node, offset) => {
          if (node.type === slideType) {
            if (slideIndex === undefined) {
              // Delete current slide based on cursor
              const { $from } = state.selection;
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

        if (dispatch) {
          dispatch(tr.delete(deletePos, deletePos + deleteSize));
        }
        return true;
      },

      duplicateSlide: (slideIndex?: number) => ({ state, dispatch, tr }) => {
        const slideType = state.schema.nodes.slide;
        if (!slideType) return false;

        let currentIndex = 0;
        let slideNode: ProseMirrorNode | null = null;
        let insertPos = -1;

        state.doc.forEach((node, offset) => {
          if (node.type === slideType) {
            if (slideIndex === undefined) {
              const { $from } = state.selection;
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

        if (dispatch) {
          const validSlideNode = slideNode as ProseMirrorNode;
          dispatch(
            tr.insert(insertPos, validSlideNode.copy(validSlideNode.content))
          );
        }
        return true;
      },

      // =========================
      // SLIDE NAVIGATION COMMANDS
      // =========================

      nextSlide: (options?: NavigationOptions) => ({ view }) => {
        navNextSlide(view.dom as HTMLElement, undefined, options);
        return true;
      },

      prevSlide: (options?: NavigationOptions) => ({ view }) => {
        navPrevSlide(view.dom as HTMLElement, undefined, options);
        return true;
      },

      goToSlide:
        (slideIndex: number, options?: NavigationOptions) =>
        ({ view }) => {
          navGoToSlide(view.dom as HTMLElement, slideIndex, undefined, options);
          return true;
        },

      goToFirstSlide: (options?: NavigationOptions) => ({ view }) => {
        navGoToSlide(view.dom as HTMLElement, 0, undefined, options);
        return true;
      },

      goToLastSlide: (options?: NavigationOptions) => ({ view }) => {
        const total = getSlideCount(view.dom as HTMLElement);
        if (total > 0) {
          navGoToSlide(view.dom as HTMLElement, total - 1, undefined, options);
        }
        return true;
      },

      canGoNext: (circular = false) => ({ view }) => {
        return canGoNextUtil(view.dom as HTMLElement, circular);
      },

      canGoPrev: (circular = false) => ({ view }) => {
        return canGoPrevUtil(view.dom as HTMLElement, circular);
      },

      getSlideInfo: () => ({ view }) => {
        return getSlideInfoUtil(view.dom as HTMLElement);
      },

      // =========================
      // LAYOUT COMMANDS
      // =========================

      setLayout: (layout: string) => ({ state, dispatch, tr, view }) => {
        const { $from } = state.selection;

        // Find parent row
        let rowDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === "row") {
            rowDepth = d;
            break;
          }
        }

        if (rowDepth === -1) return false;

        if (dispatch) {
          const rowPos = $from.before(rowDepth);
          dispatch(tr.setNodeMarkup(rowPos, null, { layout }));

          // Trigger layout recalculation
          setTimeout(() => {
            applyAllLayouts(view.dom);
          }, 0);
        }

        return true;
      },

      setSlideLayout: (layout: string) => ({ state, dispatch, tr, view }) => {
        const { $from } = state.selection;

        // Find parent slide
        let slideDepth = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === "slide") {
            slideDepth = d;
            break;
          }
        }

        if (slideDepth === -1) {
          console.warn(
            "[AutoArtifacts] setSlideLayout: No slide found at cursor position"
          );
          return false;
        }

        const slideNode = $from.node(slideDepth);
        const slidePos = $from.before(slideDepth);

        // Validate layout string
        const tempColumnCount = layout.split("-").length;
        const ratios = parseLayout(layout, tempColumnCount);
        if (!ratios || ratios.length === 0) {
          console.warn(
            "[AutoArtifacts] setSlideLayout: Invalid layout format"
          );
          return false;
        }

        const columnCount = ratios.length;

        // Extract existing content from all columns
        const existingBlocks = extractContentBlocks(slideNode);

        // Create new columns with redistributed content
        const newColumns = redistributeContent(
          existingBlocks,
          columnCount,
          state.schema
        );

        if (newColumns.length === 0) {
          console.error(
            "[AutoArtifacts] setSlideLayout: Failed to create columns"
          );
          return false;
        }

        // Create new row with layout and columns
        const rowType = state.schema.nodes.row;
        if (!rowType) return false;

        const newRow = rowType.create({ layout }, newColumns);

        // Create new slide with updated layout attribute and new row
        const slideType = state.schema.nodes.slide;
        if (!slideType) return false;

        const newSlide = slideType.create(
          { ...slideNode.attrs, layout },
          [newRow]
        );

        if (dispatch) {
          // Replace the slide
          dispatch(tr.replaceRangeWith(slidePos, slidePos + slideNode.nodeSize, newSlide));

          // Apply layout styles - need to wait for DOM update
          setTimeout(() => {
            // Use closest to find the editor wrapper, or view.dom itself
            const editorElement =
              (view.dom.closest(".autoartifacts-editor") as HTMLElement) ||
              view.dom;
            applyAllLayouts(editorElement);
          }, 10);
        }

        return true;
      },

      // =========================
      // HISTORY COMMANDS
      // =========================

      undo: () => ({ state, dispatch }) => {
        return undo(state, dispatch);
      },

      redo: () => ({ state, dispatch }) => {
        return redo(state, dispatch);
      },

      canUndo: () => ({ view }) => {
        return canUndoUtil(view);
      },

      canRedo: () => ({ view }) => {
        return canRedoUtil(view);
      },

      getUndoDepth: () => ({ view }) => {
        return getUndoDepthUtil(view);
      },

      getRedoDepth: () => ({ view }) => {
        return getRedoDepthUtil(view);
      },

      getHistoryState: () => ({ view }) => {
        return getHistoryStateUtil(view);
      },

      clearHistory: () => ({ view }) => {
        return clearHistoryUtil(view);
      },

      // =========================
      // FOCUS AND SELECTION
      // =========================

      focus: () => ({ view }) => {
        view.focus();
        return true;
      },

      blur: () => ({ view }) => {
        (view.dom as HTMLElement).blur();
        return true;
      },

      selectAll: () => ({ state, dispatch, tr }) => {
        if (dispatch) {
          dispatch(tr.setSelection(new AllSelection(state.doc)));
        }
        return true;
      },

      deleteSelection: () => ({ dispatch, tr }) => {
        if (dispatch) {
          dispatch(tr.deleteSelection());
        }
        return true;
      },

      // =========================
      // SELECTION COMMANDS
      // =========================

      setSelection: (from: number, to?: number) => ({ view }) => {
        return setTextSelection(view, from, to);
      },

      selectSlide: (slideIndex: number) => ({ view }) => {
        return selectSlideUtil(view, slideIndex);
      },

      collapseSelection: (toStart = true) => ({ view }) => {
        return collapseUtil(view, toStart);
      },

      expandSelection: () => ({ view }) => {
        return expandUtil(view);
      },

      getSelectedText: () => ({ view }) => {
        return getSelectedText(view);
      },

      isSelectionEmpty: () => ({ view }) => {
        return isSelectionEmpty(view);
      },

      isAtStart: () => ({ view }) => {
        return isAtDocStart(view);
      },

      isAtEnd: () => ({ view }) => {
        return isAtDocEnd(view);
      },

      // =========================
      // CONTENT MANIPULATION
      // =========================

      clearContent: () => ({ state, dispatch, tr }) => {
        if (dispatch) {
          dispatch(tr.delete(0, state.doc.content.size));
        }
        return true;
      },
    };
  }
}
