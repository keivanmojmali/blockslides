import { Extension, createStyleTag } from "@autoartifacts/core";
import type { Node as ProseMirrorNode } from "@autoartifacts/pm/model";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";
import { NodeView } from "@autoartifacts/pm/view";
import type { EditorView } from "@autoartifacts/pm/view";

//TODO: Add ability to easy choose a layout type like 1-1, 1-1-1, etc.

export interface AddSlideButtonOptions {
  /**
   * Whether to inject CSS styles for the button.
   * @default true
   */
  injectCSS?: boolean;
  /**
   * Nonce for Content Security Policy.
   * @default undefined
   */
  injectNonce?: string;
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

    // Use the slide node's type to render the correct DOM from Slide extension
    const slideSpec = node.type.spec;
    const rendered = slideSpec.toDOM ? slideSpec.toDOM(node) : null;

    if (rendered && Array.isArray(rendered)) {
      const [tag, attrs] = rendered;
      this.contentDOM = document.createElement(tag as string);

      // Apply all attributes from the Slide extension's renderHTML
      if (attrs && typeof attrs === "object") {
        Object.entries(attrs).forEach(([key, value]) => {
          if (key === "class") {
            this.contentDOM.className = value as string;
          } else {
            this.contentDOM.setAttribute(key, String(value));
          }
        });
      }
    } else {
      // Fallback if toDOM isn't defined (shouldn't happen)
      this.contentDOM = document.createElement("div");
      this.contentDOM.className = "slide";
      this.contentDOM.setAttribute("data-node-type", "slide");
    }

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
        const schema = this.view.state.schema;
        const slideType = schema.nodes.slide;
        const paragraphType = schema.nodes.paragraph;

        // Insert slide with empty paragraph
        const slideContent = paragraphType.create();

        const slide = slideType.create(null, slideContent);
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

const addSlideButtonStyles = `
.slide-wrapper {
  position: relative;
}

.add-slide-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 16px auto 32px auto;
  padding: 0;
  border: 2px solid var(--slide-border, #e5e5e5);
  border-radius: 25%;
  background-color: var(--slide-bg, #ffffff);
  color: var(--editor-fg, #1a1a1a);
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--slide-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.add-slide-button:hover {
  background-color: var(--editor-hover, #f0f0f0);
  border-color: var(--editor-selection, #3b82f6);
  transform: scale(1.05);
}

.add-slide-button:active {
  background-color: var(--editor-active, #e8e8e8);
  transform: scale(0.95);
}

.add-slide-button:focus {
  outline: 2px solid var(--editor-focus, #3b82f6);
  outline-offset: 2px;
}
`;

export const AddSlideButton = Extension.create<AddSlideButtonOptions>({
  name: "addSlideButton",

  addOptions() {
    return {
      injectCSS: true,
      injectNonce: undefined,
      buttonStyle: {},
      content: "+",
      onClick: null,
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;

    // Inject CSS styles if enabled
    if (options.injectCSS) {
      createStyleTag(
        addSlideButtonStyles,
        options.injectNonce,
        "add-slide-button"
      );
    }

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
