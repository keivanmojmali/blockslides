import { Extension } from "@autoartifacts/core";
import type { Node as ProseMirrorNode } from "@autoartifacts/pm/model";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";
import { NodeView } from "@autoartifacts/pm/view";
import type { EditorView } from "@autoartifacts/pm/view";

//TODO: Add ability to easy choose a layout type like 1-1, 1-1-1, etc.

export interface AddSlideButtonOptions {
  /**
   * Custom CSS styles for the button element.
   * These will override or extend the default theme styles.
   * Supports both camelCase (React) and kebab-case (Vue/CSS) property names.
   * @default {}
   * @example { backgroundColor: '#000', color: '#fff' } // React/camelCase
   * @example { 'background-color': '#000', 'color': '#fff' } // Vue/kebab-case
   */
  buttonStyle: Record<string, string>;
  /**
   * Button content - can be text, HTML, icon, emoji, etc.
   * @default '+'
   * @example '+' | 'Add Slide' | '➕' | '<svg>...</svg>'
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

class SlideNodeView implements NodeView {
  dom: HTMLElement;
  contentDOM: HTMLElement;
  button: HTMLElement;
  options: AddSlideButtonOptions;
  view: EditorView;
  getPos: () => number | undefined;
  node: ProseMirrorNode;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
    options: AddSlideButtonOptions
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.options = options;

    // Create wrapper div
    this.dom = document.createElement("div");
    this.dom.classList.add("slide-wrapper");

    // Create the actual slide section (contentDOM)
    this.contentDOM = document.createElement("section");

    // Create the add button
    this.button = document.createElement("button");
    this.button.className = "add-slide-button";
    this.button.innerHTML = options.content;
    this.button.setAttribute("type", "button");
    this.button.contentEditable = "false";

    // Apply custom styles
    if (options.buttonStyle) {
      Object.entries(options.buttonStyle).forEach(([key, value]) => {
        const camelKey = key.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );
        (this.button.style as any)[camelKey] = value;
      });
    }

    this.button.onclick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const pos = this.getPos();
      if (pos === undefined) return;

      if (options.onClick) {
        // Calculate slide index
        let slideIndex = 0;
        this.view.state.doc.nodesBetween(0, pos, (n) => {
          if (n.type.name === "slide") slideIndex++;
        });

        options.onClick({
          slideIndex,
          position: pos + this.node.nodeSize,
          view: this.view,
          event,
        });
      } else {
        // Default: insert new slide after current one
        const slide = this.view.state.schema.nodes.slide.create(
          null,
          this.view.state.schema.nodes.paragraph.create()
        );
        const tr = this.view.state.tr.insert(pos + this.node.nodeSize, slide);
        this.view.dispatch(tr);
      }
    };

    // Append to wrapper
    this.dom.appendChild(this.contentDOM);
    this.dom.appendChild(this.button);
  }

  update(node: ProseMirrorNode) {
    if (node.type.name !== "slide") return false;
    this.node = node;
    return true;
  }

  destroy() {
    this.button.onclick = null;
  }
}

export const AddSlideButton = Extension.create<AddSlideButtonOptions>({
  name: "addSlideButton",

  addOptions() {
    return {
      buttonStyle: {},
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
          nodeViews: {
            slide: (node, view, getPos) => {
              return new SlideNodeView(
                node,
                view,
                getPos as () => number,
                options
              );
            },
          },
        },
      }),
    ];
  },
});
