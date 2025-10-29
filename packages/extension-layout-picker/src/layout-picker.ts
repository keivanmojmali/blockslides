/**
 * Layout Picker Extension
 *
 * Displays a visual template selector on empty/new slides.
 * Users can click a template to apply a specific column layout.
 * Uses a placeholder node that gets replaced with the chosen layout.
 */

import { Extension, Node } from "@autoartifacts/core";
import { applyAllLayouts } from "@autoartifacts/core";
import type { Node as ProseMirrorNode } from "@autoartifacts/pm/model";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";
import { NodeView } from "@autoartifacts/pm/view";
import type { EditorView } from "@autoartifacts/pm/view";

import type { LayoutTemplate } from "./layout-templates.js";
import { DEFAULT_LAYOUTS } from "./layout-templates.js";
import { layoutPickerStyles } from "./styles.js";

export interface LayoutPickerOptions {
  /**
   * Layout templates to show
   * @default DEFAULT_LAYOUTS
   */
  layouts: LayoutTemplate[];
  /**
   * Placeholder text for the heading
   * @default 'Slide Header'
   */
  placeholderHeader: string;
  /**
   * Subtitle text
   * @default 'Or start with a template'
   */
  subtitle: string;
  /**
   * Custom class for picker container
   * @default ''
   */
  className: string;
  /**
   * Custom inline styles for picker
   * @default {}
   */
  style: Record<string, string>;
  /**
   * Custom class for template cards
   * @default ''
   */
  templateClassName: string;
  /**
   * Custom inline styles for templates
   * @default {}
   */
  templateStyle: Record<string, string>;
  /**
   * Max width for icons
   * @default '100px'
   */
  iconMaxWidth: string;
  /**
   * Custom handler for layout selection
   */
  onLayoutSelect:
    | ((layoutId: string, slideElement: HTMLElement | null) => void)
    | null;
}

/**
 * The placeholder node that gets inserted into empty slides
 */
export const LayoutPickerPlaceholder = Node.create({
  name: "layoutPickerPlaceholder",

  group: "block",

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="layout-picker-placeholder"]',
      },
    ];
  },

  renderHTML() {
    return ["div", { "data-type": "layout-picker-placeholder" }, 0];
  },
});

class LayoutPickerPlaceholderNodeView implements NodeView {
  dom: HTMLElement;
  contentDOM?: HTMLElement;
  pickerContainer: HTMLElement;
  options: LayoutPickerOptions;
  view: EditorView;
  getPos: () => number | undefined;
  node: ProseMirrorNode;

  constructor(
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
    options: LayoutPickerOptions
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.options = options;

    // Create the picker container as the main dom
    this.dom = document.createElement("div");
    this.dom.classList.add("layout-picker-placeholder-wrapper");

    // Create and render the picker widget
    this.pickerContainer = this.createLayoutPickerWidget();
    this.dom.appendChild(this.pickerContainer);
  }

  createLayoutPickerWidget(): HTMLElement {
    const container = document.createElement("div");
    container.className = `layout-picker ${this.options.className}`.trim();
    container.contentEditable = "false";

    // Apply custom styles
    Object.entries(this.options.style).forEach(([key, value]) => {
      container.style[key as any] = value;
    });

    // Create header
    const headerEl = document.createElement("h3");
    headerEl.className = "layout-picker-header";
    headerEl.textContent = this.options.subtitle;
    container.appendChild(headerEl);

    // Create templates container
    const templatesContainer = document.createElement("div");
    templatesContainer.className = "layout-picker-templates";
    container.appendChild(templatesContainer);

    // Create template cards
    this.options.layouts.forEach((layout) => {
      const card = document.createElement("div");
      card.className =
        `layout-template ${this.options.templateClassName}`.trim();
      card.setAttribute("data-layout-id", layout.id);

      // Apply custom template styles
      Object.entries(this.options.templateStyle).forEach(([key, value]) => {
        card.style[key as any] = value;
      });

      // Create icon container
      const iconContainer = document.createElement("div");
      iconContainer.className = "layout-template-icon";
      iconContainer.style.maxWidth = this.options.iconMaxWidth;
      iconContainer.innerHTML = layout.icon;
      card.appendChild(iconContainer);

      // Create label
      const label = document.createElement("span");
      label.className = "layout-template-label";
      label.textContent = layout.label;
      card.appendChild(label);

      // Add click handler
      card.addEventListener("click", (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const pos = this.getPos();
        if (pos === undefined) return;

        if (this.options.onLayoutSelect) {
          // Use custom handler
          this.options.onLayoutSelect(layout.id, this.dom);
        } else {
          // Default behavior: apply the layout directly
          this.applyLayout(layout.id);
        }
      });

      templatesContainer.appendChild(card);
    });

    return container;
  }

  applyLayout(layoutId: string) {
    try {
      const pos = this.getPos();
      if (pos === undefined) return;

      const state = this.view.state;
      const $pos = state.doc.resolve(pos);

      // Find the parent slide node
      let slideDepth = -1;
      for (let d = $pos.depth; d >= 0; d--) {
        if ($pos.node(d).type.name === "slide") {
          slideDepth = d;
          break;
        }
      }

      if (slideDepth === -1) {
        console.warn("[LayoutPicker] Could not find parent slide");
        return;
      }

      const slideNode = $pos.node(slideDepth);
      const slidePos = $pos.before(slideDepth);

      // Parse layout
      const columnCount = layoutId.split("-").length;
      const ratios = parseLayout(layoutId, columnCount);

      if (!ratios || ratios.length === 0) {
        console.warn("[LayoutPicker] Invalid layout format");
        return;
      }

      // Create placeholder content for empty slide
      const newColumns = createPlaceholderContent(
        layoutId,
        state.schema,
        columnCount
      );

      if (newColumns.length === 0) {
        console.error("[LayoutPicker] Failed to create columns");
        return;
      }

      // Create new row and slide
      const rowType = state.schema.nodes.row;
      const slideType = state.schema.nodes.slide;

      if (!rowType || !slideType) {
        console.error("[LayoutPicker] Missing node types");
        return;
      }

      const newRow = rowType.create({ layout: layoutId }, newColumns);
      const newSlide = slideType.create({ ...slideNode.attrs }, [newRow]);

      // Replace the entire slide (which removes the placeholder)
      const tr = state.tr.replaceRangeWith(
        slidePos,
        slidePos + slideNode.nodeSize,
        newSlide
      );

      this.view.dispatch(tr);

      // Apply layout styles - need to wait for DOM update
      setTimeout(() => {
        const editorElement =
          (this.view.dom.closest(".autoartifacts-editor") as HTMLElement) ||
          this.view.dom;
        applyAllLayouts(editorElement);
      }, 10);
    } catch (error) {
      console.error("[LayoutPicker] Error applying layout:", error);
    }
  }

  update(node: ProseMirrorNode) {
    if (node.type.name !== "layoutPickerPlaceholder") return false;
    this.node = node;
    return true;
  }

  destroy() {
    // Cleanup if needed
  }
}

export const LayoutPicker = Extension.create<LayoutPickerOptions>({
  name: "layoutPicker",

  addOptions() {
    return {
      layouts: DEFAULT_LAYOUTS,
      placeholderHeader: "Untitled card",
      subtitle: "Or start with a template",
      className: "",
      style: {},
      templateClassName: "",
      templateStyle: {},
      iconMaxWidth: "100px",
      onLayoutSelect: null,
    };
  },

  onCreate() {
    // Inject styles
    const styleId = "layout-picker-styles";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = layoutPickerStyles;
      document.head.appendChild(styleEl);
    }
  },

  onDestroy() {
    // Clean up styles when extension is destroyed
    const styleEl = document.getElementById("layout-picker-styles");
    if (styleEl) {
      styleEl.remove();
    }
  },

  addProseMirrorPlugins() {
    const options = this.options;

    return [
      new Plugin({
        key: new PluginKey("layoutPicker"),
        props: {
          nodeViews: {
            layoutPickerPlaceholder: (node, view, getPos) => {
              return new LayoutPickerPlaceholderNodeView(
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

/**
 * Parse layout string to ratios
 */
function parseLayout(layout: string, _columnCount: number): number[] | null {
  return layout.split("-").map(Number);
}

/**
 * Create placeholder content for columns
 * The layout ratios are now stored on the row, not individual columns
 */
function createPlaceholderContent(
  layout: string,
  schema: any,
  columnCount: number
): ProseMirrorNode[] {
  const columnType = schema.nodes.column;
  const paragraphType = schema.nodes.paragraph;

  if (!columnType || !paragraphType) {
    return [];
  }

  const columns: ProseMirrorNode[] = [];

  // Create columns without width attribute
  // The layout ratios are applied via the row's layout attribute
  for (let i = 0; i < columnCount; i++) {
    const column = columnType.create(
      {
        // Use default column attributes
        className: "",
        contentMode: "default",
        verticalAlign: "top",
        horizontalAlign: "left",
        padding: "medium",
      },
      paragraphType.create()
    );
    columns.push(column);
  }

  return columns;
}
