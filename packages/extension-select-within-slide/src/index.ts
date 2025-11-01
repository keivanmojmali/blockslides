import { createStyleTag, Extension } from '@autoartifacts/core';
import {
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  Plugin,
  PluginKey,
  Transaction,
} from '@autoartifacts/pm/state';
import { Decoration, DecorationSet } from '@autoartifacts/pm/view';

export interface SelectWithinSlideOptions {
  injectCSS: boolean;
  injectNonce?: string;
  outlineColor: string;
  outlineOffset: string;
  outlineRadius: string;
}

const SelectWithinSlideStylesKey = new PluginKey('selectWithinSlideStyles');

function createSelectionAtDepth(
  state: EditorState,
  depth: number,
): Selection | null {
  const { selection } = state;
  const $pos =
    selection instanceof NodeSelection
      ? state.doc.resolve(selection.from + 1)
      : selection.$from;

  const node = $pos.node(depth)
  if (!node) {
    return null;
  }

  if (node.isTextblock) {
    return TextSelection.create(state.doc, $pos.start(depth), $pos.end(depth));
  }

  if (node.isBlock && node.type.spec.selectable !== false) {
    return NodeSelection.create(state.doc, $pos.before(depth));
  }

  return null;
}

function nextSelection(state: EditorState): Selection | null {
  const { selection, schema } = state;
  const $from =
    selection instanceof NodeSelection
      ? state.doc.resolve(selection.from + 1)
      : selection.$from;

  const slideType = schema.nodes?.slide;
  if (!slideType) {
    return null;
  }

  let slideDepth = -1;
  for (let depth = $from.depth; depth >= 0; depth -= 1) {
    if ($from.node(depth).type === slideType) {
      slideDepth = depth;
      break;
    }
  }

  if (slideDepth === -1) {
    return null;
  }

  let targetDepth =
    selection instanceof NodeSelection
      ? selection.$from.depth + 1
      : $from.depth;

  const coveringTextblock =
    selection instanceof TextSelection &&
    selection.from === $from.start(targetDepth) &&
    selection.to === $from.end(targetDepth);

  const coveringNodeSelection =
    selection instanceof NodeSelection &&
    selection.$from.depth + 1 === targetDepth;


  if (coveringTextblock || coveringNodeSelection) {
    targetDepth -= 1;
  }

  if (targetDepth < slideDepth) {
    targetDepth = slideDepth;
  }

  while (targetDepth >= slideDepth) {
    const next = createSelectionAtDepth(state, targetDepth);
    if (next) {
      return next;
    }
    targetDepth -= 1;
  }

  return null;
}

export const SelectWithinSlide = Extension.create<SelectWithinSlideOptions>({
  name: 'selectWithinSlide',

  addOptions() {
    return {
      injectCSS: true,
      injectNonce: undefined,
      outlineColor: 'var(--aa-selection-outline, #3b82f6)',
      outlineOffset: '2px',
      outlineRadius: '8px',
    };
  },
  

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SelectWithinSlideStylesKey,
        state: {
          init: () => {
            if (this.options.injectCSS && typeof document !== 'undefined') {
              const css = `
              .ProseMirror-selectednode {
                outline: 2px solid ${this.options.outlineColor} !important;
                outline-offset: ${this.options.outlineOffset};
                border-radius: ${this.options.outlineRadius};
              }
              .ProseMirror-selectednode * {
                background-color: rgba(59, 130, 246, 0.1) !important;
              }
            `;
              createStyleTag(css, this.options.injectNonce, 'select-within-slide');
            }

            return {};
          },
          apply: (_tr: Transaction, value: Record<string, never>) => value,
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    console.log('SelectWithinSlide shortcut loaded');
    return {
      'Mod-a': ({ editor }) => {
        const { state, view } = editor;
        const selection = nextSelection(state);

        if (!view) {
          return true;
        }

        if (!selection) {
          return true;
        }

        view.dispatch(state.tr.setSelection(selection));

        requestAnimationFrame(() => {
          console.log(
            '[selectWithinSlide] node selection DOM',
            Array.from(document.querySelectorAll('.ProseMirror-selectednode')),
          );
        });

        return true;
      },
    };
  },
});

export default SelectWithinSlide;
