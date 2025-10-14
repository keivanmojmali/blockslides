import { Extension } from '@autoartifacts/core';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { SlideEditor } from '@autoartifacts/core';

export interface AddSlideButtonOptions {
  className?: string;
  style?: any;
  content?: string;
  onClick?: (params: {
    slideIndex: number;
    buttonElement: HTMLElement;
    event: MouseEvent;
  }) => void;
}

/**
 * AddSlideButtonExtension
 * 
 * Adds buttons between slides to insert new slides.
 * 
 * Usage:
 * ```typescript
 * import { AddSlideButtonExtension } from '@autoartifacts/extension-add-slide-button';
 * 
 * <SlideEditor
 *   extensions={[
 *     AddSlideButtonExtension.configure({
 *       className: 'my-add-btn',
 *       content: '+',
 *       onClick: ({ slideIndex }) => console.log('Add at', slideIndex)
 *     })
 *   ]}
 * />
 * ```
 */
export class AddSlideButtonExtension extends Extension<AddSlideButtonOptions> {
  public name = 'addSlideButton';
  public priority = 50;
  
  constructor(options: AddSlideButtonOptions = {}) {
    super(options);
  }
  
  plugins(editor: SlideEditor): Plugin[] {
    const options = this.options;
    
    return [
      new Plugin({
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            
            state.doc.forEach((node, offset) => {
              if (node.type.name === 'slide') {
                const pos = offset + node.nodeSize;
                
                const widget = Decoration.widget(pos, () => {
                  const button = document.createElement('button');
                  button.className = options.className || 'autoartifacts-add-slide-btn';
                  button.innerHTML = options.content || '+';
                  
                  if (options.style) {
                    Object.assign(button.style, options.style);
                  }
                  
                  button.onclick = (event) => {
                    event.preventDefault();
                    
                    if (options.onClick) {
                      // User custom handler - they have full control
                      const slideIndex = getSlideIndexFromPos(state, offset);
                      options.onClick({
                        slideIndex,
                        buttonElement: button,
                        event
                      });
                    } else {
                      // Default behavior - add slide at this button's position
                      const view = editor.editorView;
                      if (view) {
                        const tr = view.state.tr;
                        const slideType = view.state.schema.nodes.slide;
                        const newSlide = slideType.create();
                        tr.insert(pos, newSlide);
                        view.dispatch(tr);
                      }
                    }
                  };
                  
                  return button;
                }, { side: 1 });
                
                decorations.push(widget);
              }
            });
            
            return DecorationSet.create(state.doc, decorations);
          }
        }
      })
    ];
  }
}

function getSlideIndexFromPos(state: any, pos: number) {
  let index = 0;
  state.doc.forEach((node: any, offset: number) => {
    if (node.type.name === 'slide' && offset <= pos) {
      index++;
    }
  });
  return index - 1;
}


