import React from 'react';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { SlideEditorRef } from '../types';

interface AddSlideButtonOptions {
  className?: string;
  style?: React.CSSProperties;
  content?: string;
  onClick?: (params: {
    slideIndex: number;
    buttonElement: HTMLElement;
    event: MouseEvent;
  }) => void;
}

export function createAddSlideButtonPlugin(
  getEditorRef: () => SlideEditorRef | null,
  options: AddSlideButtonOptions
) {
  return new Plugin({
    props: {
      decorations(state) {
        const decorations: Decoration[] = [];
        
        state.doc.forEach((node, offset) => {
          if (node.type.name === 'slide') {
            const pos = offset + node.nodeSize;
            
            const widget = Decoration.widget(pos, () => {
              const button = document.createElement('button');
              // If custom className provided, it completely replaces default
              button.className = options.className || 'autoartifacts-add-slide-btn';
              
              // Set button content (default to '+')
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
                  const editorRef = getEditorRef();
                  if (editorRef) {
                    // Pass the button's position directly to addSlide
                    editorRef.commands.addSlide(pos);
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
  });
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

