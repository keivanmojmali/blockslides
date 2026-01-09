import { Extension, createStyleTag } from "@blockslides/core";
import type { Node as ProseMirrorNode } from "@blockslides/pm/model";
import { Plugin, PluginKey } from "@blockslides/pm/state";
import { NodeView } from "@blockslides/pm/view";
import type { EditorView } from "@blockslides/pm/view";

//TODO: Add ability to easy choose a layout type like 1-1, 1-1-1, etc.

export interface PresetTemplateOption {
  key: string;
  label: string;
  icon?: string;
  build: () => any;
}

// Heroicons outline "window" to match requested default
const defaultTemplateIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 5.25A1.75 1.75 0 0 1 6.25 3.5h11.5A1.75 1.75 0 0 1 19.5 5.25v13.5a1.75 1.75 0 0 1-1.75 1.75H6.25A1.75 1.75 0 0 1 4.5 18.75Z"/><path d="M4.5 8.25h15M9 3.5v4.75"/></svg>';

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
   * Optional template chooser that renders a second button and modal.
   * @default false
   */
  showPresets?: boolean;
  /**
   * Background color for the preset modal content area.
   * @default '#ffffff'
   */
  presetBackground?: string;
  /**
   * Text/icon color for the preset modal content area.
   * @default '#000000'
   */
  presetForeground?: string;
  /**
   * Presets to show in the modal when showPresets is true.
   */
  presets?: PresetTemplateOption[];
  /**
   * Content for the template button (emoji or HTML).
   * @default '✨'
   */
  templateButtonContent?: string;
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
  presetModal?: HTMLElement | null;

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

    const createButton = (html: string) => {
      const btn = document.createElement("button");
      btn.className = "add-slide-button";
      btn.innerHTML = html;
      btn.setAttribute("type", "button");
      btn.contentEditable = "false";
      if (options.buttonStyle) {
        Object.entries(options.buttonStyle).forEach(([key, value]) => {
          const camelKey = key.replace(/-([a-z])/g, (_, letter) =>
            letter.toUpperCase()
          );
          (btn.style as any)[camelKey] = value;
        });
      }
      return btn;
    };

    const insertEmptySlide = (pos: number) => {
      const schema = this.view.state.schema;
      const slideType = schema.nodes.slide;
      const paragraphType = schema.nodes.paragraph;
      const slideContent = paragraphType.create();
      const slide = slideType.create(null, slideContent);
      const tr = this.view.state.tr.insert(pos + this.node.nodeSize, slide);
      this.view.dispatch(tr);
    };

    const handlePlusClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const pos = this.getPos();
      if (pos === undefined) return;

      if (options.onClick) {
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
        insertEmptySlide(pos);
      }
    };

    const openPresetModal = (pos: number) => {
      // Remove existing modal if present to avoid duplicates
      if (this.presetModal) {
        this.presetModal.remove();
      }

      const overlay = document.createElement("div");
      overlay.className = "add-slide-preset-modal";

      const dialog = document.createElement("div");
      dialog.className = "add-slide-preset-dialog";
      if (options.presetBackground) {
        dialog.style.setProperty("--add-slide-preset-bg", options.presetBackground);
      }
      if (options.presetForeground) {
        dialog.style.setProperty("--add-slide-preset-fg", options.presetForeground);
      }

      const search = document.createElement("input");
      search.className = "add-slide-preset-search";
      search.type = "search";
      search.placeholder = "Choose a template";
      dialog.appendChild(search);

      const list = document.createElement("div");
      list.className = "add-slide-preset-list";

      const items: HTMLElement[] = [];

      (options.presets || []).forEach((preset) => {
        const item = document.createElement("button");
        item.className = "add-slide-preset-item";
        item.setAttribute("type", "button");
        item.innerHTML = `
          <span class="add-slide-preset-icon">${preset.icon ?? ""}</span>
          <span class="add-slide-preset-label">${preset.label}</span>
        `;

        item.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          try {
            const nodeJSON = preset.build() as any;
            const newSlide = this.view.state.schema.nodeFromJSON(nodeJSON);
            const tr = this.view.state.tr.insert(
              pos + this.node.nodeSize,
              newSlide
            );
            this.view.dispatch(tr);
          } catch (err) {
            console.error("Failed to insert preset slide", err);
          } finally {
            overlay.remove();
            this.presetModal = null;
          }
        };

        list.appendChild(item);
        items.push(item);
      });

      search.oninput = () => {
        const term = search.value.toLowerCase();
        items.forEach((item) => {
          const label = item
            .querySelector(".add-slide-preset-label")
            ?.textContent?.toLowerCase();
          item.style.display = !term || label?.includes(term) ? "" : "none";
        });
      };

      dialog.appendChild(list);

      const close = () => {
        overlay.remove();
        this.presetModal = null;
      };

      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close();
        }
      };

      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape") {
            close();
          }
        },
        { once: true }
      );

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
      this.presetModal = overlay;
    };

    const plusButton = createButton(options.content);
    plusButton.onclick = handlePlusClick;
    this.button = plusButton;

    if (options.showPresets) {
      const templateButton = createButton(
        options.templateButtonContent ?? "✨"
      );
      templateButton.onclick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const pos = this.getPos();
        if (pos === undefined) return;
        openPresetModal(pos);
      };

      const group = document.createElement("div");
      group.className = "add-slide-button-group";
      group.appendChild(plusButton);
      group.appendChild(templateButton);

      this.dom.appendChild(this.contentDOM);
      this.dom.appendChild(group);
    } else {
      this.button = plusButton;
      this.dom.appendChild(this.contentDOM);
      this.dom.appendChild(this.button);
    }
  }

  update(node: ProseMirrorNode) {
    if (node.type.name !== "slide") return false;
    this.node = node;
    return true;
  }

  destroy() {
    if (this.button) {
      this.button.onclick = null;
    }

    if (this.presetModal) {
      this.presetModal.remove();
      this.presetModal = null;
    }
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

.add-slide-button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 180px;
  margin: 16px auto 32px auto;
  border: 1px solid var(--slide-border, #e5e5e5);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--slide-bg, #ffffff);
  box-shadow: var(--slide-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.add-slide-button-group .add-slide-button {
  margin: 0;
  border: none;
  border-radius: 0;
  width: 100%;
  height: 48px;
}

.add-slide-button-group .add-slide-button:first-child {
  border-right: 1px solid var(--slide-border, #e5e5e5);
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.add-slide-button-group .add-slide-button:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  white-space: nowrap;
  font-size: 14px;
  padding: 0 12px;
}

.add-slide-preset-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.add-slide-preset-dialog {
  background: var(--add-slide-preset-bg, #ffffff);
  color: var(--add-slide-preset-fg, #000000);
  border-radius: 8px;
  padding: 16px 16px 12px 16px;
  min-width: 140px;
  max-width: 480px;
  max-height: 60vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.add-slide-preset-search {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--add-slide-preset-fg, #000000) 18%, transparent);
  font-size: 14px;
  color: inherit;
  background: color-mix(in srgb, var(--add-slide-preset-bg, #ffffff) 90%, var(--add-slide-preset-fg, #000000) 10%);
}
.add-slide-preset-search:focus {
  outline: 2px solid color-mix(in srgb, var(--add-slide-preset-fg, #3b82f6) 35%, transparent);
  outline-offset: 1px;
}

.add-slide-preset-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 52vh;
  overflow: auto;
  scrollbar-width: none;
}

.add-slide-preset-list::-webkit-scrollbar {
  display: none;
}

.add-slide-preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: transparent;
  color: inherit;
  padding: 10px 0 12px 0;
  cursor: pointer;
  border-bottom: 1px solid color-mix(in srgb, var(--add-slide-preset-fg, #000000) 12%, transparent);
}

.add-slide-preset-item:last-child {
  border-bottom: none;
}

.add-slide-preset-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.add-slide-preset-icon {
  display: block;
  width: 100%;
  height: auto;
  line-height: 0;
}
.add-slide-preset-icon > svg {
  width: 100%;
  height: auto;
  display: block;
}

.add-slide-preset-label {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
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
      showPresets: false,
      presets: [],
      templateButtonContent: "Template +",
      onClick: null,
      presetBackground: "#ffffff",
      presetForeground: "#000000",
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
