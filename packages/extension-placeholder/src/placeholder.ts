import { Extension } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";
import { Decoration, DecorationSet } from "@autoartifacts/pm/view";
import type { EditorState } from "@autoartifacts/pm/state";
import type { Node as ProseMirrorNode } from "@autoartifacts/pm/model";

export interface PlaceholderOptions {
  /**
   * The placeholder text to show when the editor is empty.
   * @default 'Write something …'
   */
  placeholder: string;
  /**
   * Show the placeholder only when the editor is editable.
   * @default true
   */
  showOnlyWhenEditable: boolean;
  /**
   * Show the placeholder only for the current node.
   * @default true
   */
  showOnlyCurrent: boolean;
  /**
   * Include children in the check for emptiness.
   * @default true
   */
  includeChildren: boolean;
}

export const Placeholder = Extension.create<PlaceholderOptions>({
  name: "placeholder",

  addOptions() {
    return {
      placeholder: "Write something …",
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: true,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("placeholder"),
        props: {
          decorations: (state: EditorState) => {
            const decorations: Decoration[] = [];
            const { doc, selection } = state;
            const { showOnlyWhenEditable, showOnlyCurrent, includeChildren } =
              this.options;

            // Don't show placeholder if editor is not editable
            if (showOnlyWhenEditable && !this.editor.isEditable) {
              return DecorationSet.empty;
            }

            doc.descendants((node: ProseMirrorNode, pos: number) => {
              // Only process nodes with placeholder attribute
              if (!node.attrs.placeholder) {
                return;
              }

              const hasAnchor =
                selection.$anchor.pos >= pos &&
                selection.$anchor.pos <= pos + node.nodeSize;
              const isEmpty =
                !node.isLeaf && isNodeEmpty(node, includeChildren);

              // Show placeholder if:
              // 1. Node is empty
              // 2. Either showOnlyCurrent is false, or cursor is in this node
              if (isEmpty && (!showOnlyCurrent || hasAnchor)) {
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: "is-empty has-placeholder",
                  "data-placeholder": node.attrs.placeholder,
                });
                decorations.push(decoration);
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

/**
 * Check if a node is empty (no text content, only trailing breaks)
 */
function isNodeEmpty(node: ProseMirrorNode, includeChildren: boolean): boolean {
  if (node.isText) {
    return false;
  }

  if (node.textContent.length > 0) {
    return false;
  }

  if (!includeChildren && node.childCount > 0) {
    return false;
  }

  // Check if only contains trailing breaks
  if (node.childCount === 0) {
    return true;
  }

  // A node is empty if all children are hard breaks
  let isEmpty = true;
  node.forEach((child: ProseMirrorNode) => {
    if (child.type.name !== "hardBreak") {
      isEmpty = false;
    }
  });

  return isEmpty;
}
