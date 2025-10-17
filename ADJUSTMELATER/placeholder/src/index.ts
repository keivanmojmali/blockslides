import { Extension } from '@autoartifacts/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { SlideEditor } from '@autoartifacts/core';

const placeholderPluginKey = new PluginKey('placeholder');

/**
 * PlaceholderExtension
 * 
 * Shows placeholder text in empty nodes that have a placeholder attribute.
 * Works correctly with ProseMirror's trailing break elements.
 * 
 * Usage:
 * ```typescript
 * import { PlaceholderExtension } from '@autoartifacts/extension-placeholder';
 * 
 * <SlideEditor
 *   extensions={[PlaceholderExtension.configure()]}
 * />
 * ```
 */
export class PlaceholderExtension extends Extension {
  public name = 'placeholder';
  public priority = 50;
  
  plugins(editor: SlideEditor): Plugin[] {
    return [
      new Plugin({
        key: placeholderPluginKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            
            state.doc.descendants((node, pos) => {
              // Only process nodes with placeholder attribute
              if (!node.attrs.placeholder) {
                return;
              }
              
              // Check if node is effectively empty (no text content, only trailing breaks)
              const isEmpty = node.content.size === 0 || 
                             (node.textContent === '' && node.content.size <= 1);
              
              if (isEmpty) {
                // Add a decoration to show the placeholder
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: 'has-placeholder',
                  'data-placeholder-text': node.attrs.placeholder
                });
                decorations.push(decoration);
              }
            });
            
            return DecorationSet.create(state.doc, decorations);
          }
        }
      })
    ];
  }
}


