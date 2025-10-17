import { Extension } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";
import { Decoration, DecorationSet } from "@autoartifacts/pm/view";
import type { EditorState } from "@autoartifacts/pm/state";
import type { EditorView } from "@autoartifacts/pm/view";
import type { Node as ProseMirrorNode } from "@autoartifacts/pm/model";

export interface AddSlideButtonOptions {
  /**
   * CSS class name for the button element.
   * @default 'add-slide-button'
   */
  className: string;
  /**
   * HTML content for the button.
   * @default '+'
   */
  content: string;
  /**
   * Custom click handler for the button.
   * If not provided, will insert a new slide at the clicked position.
   */
  onClick:
    | ((params: {
        slideIndex: number;
        position: number;
        view: EditorView;
        event: MouseEvent;
      }) => void)
    | null;
}

export const AddSlideButton = Extension.create<AddSlideButtonOptions>({
  name: "addSlideButton",

  addOptions() {
    return {
      className: "add-slide-button",
      content: "+",
      onClick: null,
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;

    return [
      new Plugin({
        key: new PluginKey("addSlideButton"),
        props: {
          decorations: (state: EditorState) => {
            const decorations: Decoration[] = [];
            const { doc } = state;

            doc.descendants((node: ProseMirrorNode, pos: number) => {
              if (node.type.name === "slide") {
                const endPos = pos + node.nodeSize;

                const widget = Decoration.widget(
                  endPos,
                  (view: EditorView) => {
                    const button = document.createElement("button");
                    button.className = options.className;
                    button.innerHTML = options.content;
                    button.type = "button";
                    button.contentEditable = "false";

                    button.onclick = (event: MouseEvent) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if (options.onClick) {
                        const slideIndex = getSlideIndexAtPos(doc, pos);
                        options.onClick({
                          slideIndex,
                          position: endPos,
                          view,
                          event,
                        });
                      } else {
                        // Default: insert new slide after current one
                        insertSlideAfter(view, endPos);
                      }
                    };

                    return button;
                  },
                  {
                    side: 1,
                    stopEvent: () => true,
                  }
                );

                decorations.push(widget);
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

function getSlideIndexAtPos(doc: ProseMirrorNode, pos: number): number {
  let index = 0;
  doc.descendants((node: ProseMirrorNode, nodePos: number) => {
    if (node.type.name === "slide" && nodePos < pos) {
      index++;
    }
    return nodePos < pos;
  });
  return index;
}

function insertSlideAfter(view: EditorView, pos: number): void {
  const { state } = view;
  const { tr, schema } = state;
  const slideType = schema.nodes.slide;
  const paragraphType = schema.nodes.paragraph;

  if (!slideType || !paragraphType) {
    return;
  }

  // Create a new slide with empty paragraph
  const newSlide = slideType.create(null, paragraphType.create());
  tr.insert(pos, newSlide);
  view.dispatch(tr);
}
