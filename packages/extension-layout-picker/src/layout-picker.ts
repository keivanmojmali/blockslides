/**
 * Layout Picker Extension
 *
 * Displays a visual template selector on empty/new slides.
 * Users can click a template to apply a specific column layout.
 * Framework-agnostic using ProseMirror widgets.
 */

import { Extension } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";
import { Decoration, DecorationSet } from "@autoartifacts/pm/view";
import type { EditorState } from "@autoartifacts/pm/state";
import type { EditorView } from "@autoartifacts/pm/view";
import type { Node as ProseMirrorNode } from "@autoartifacts/pm/model";

import type { LayoutTemplate } from "./layout-templates.js";
import { DEFAULT_LAYOUTS } from "./layout-templates.js";

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

export const LayoutPicker = Extension.create<LayoutPickerOptions>({
  name: "layoutPicker",

  addOptions() {
    return {
      layouts: DEFAULT_LAYOUTS,
      placeholderHeader: "Slide Header",
      subtitle: "Or start with a template",
      className: "",
      style: {},
      templateClassName: "",
      templateStyle: {},
      iconMaxWidth: "100px",
      onLayoutSelect: null,
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    let editorView: EditorView | null = null;

    return [
      new Plugin({
        key: new PluginKey("layoutPicker"),
        view(view: EditorView) {
          editorView = view;
          return {
            update(view: EditorView) {
              editorView = view;
            },
            destroy() {
              editorView = null;
            },
          };
        },
        props: {
          decorations: (state: EditorState) => {
            const decorations: Decoration[] = [];

            // Find all empty slides
            state.doc.forEach((node: ProseMirrorNode, offset: number) => {
              if (node.type.name === "slide" && isSlideEmpty(node)) {
                // Find position after the heading
                // Structure: slide > row > column > [heading, paragraph]
                const rowNode = node.child(0);
                if (rowNode && rowNode.type.name === "row") {
                  const columnNode = rowNode.child(0);
                  if (
                    columnNode &&
                    columnNode.type.name === "column" &&
                    columnNode.childCount >= 1
                  ) {
                    const headingNode = columnNode.child(0);
                    if (headingNode && headingNode.type.name === "heading") {
                      // Calculate position: offset + slide_start + row_start + column_start + heading_size
                      const widgetPos =
                        offset + 1 + 1 + 1 + headingNode.nodeSize;

                      const widget = Decoration.widget(
                        widgetPos,
                        () => {
                          return createLayoutPickerWidget(
                            options.layouts,
                            options.subtitle,
                            options.className,
                            options.style,
                            options.templateClassName,
                            options.templateStyle,
                            options.iconMaxWidth,
                            options.onLayoutSelect,
                            offset,
                            () => editorView
                          );
                        },
                        {
                          side: 1,
                          ignoreSelection: true,
                        }
                      );

                      decorations.push(widget);
                    }
                  }
                }
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});

/**
 * Check if a slide is empty (only has placeholder content)
 */
function isSlideEmpty(node: ProseMirrorNode): boolean {
  // TODO: Import from @autoartifacts/core if available
  // For now, basic implementation
  if (!node.textContent || node.textContent.trim() === "") {
    return true;
  }
  return false;
}

/**
 * Creates the layout picker widget DOM element
 */
function createLayoutPickerWidget(
  layouts: LayoutTemplate[],
  subtitle: string,
  className: string,
  style: Record<string, string>,
  templateClassName: string,
  templateStyle: Record<string, string>,
  iconMaxWidth: string,
  onLayoutSelect:
    | ((layoutId: string, slideElement: HTMLElement | null) => void)
    | null,
  slideOffset: number,
  getView: () => EditorView | null
): HTMLElement {
  // Create main container
  const container = document.createElement("div");
  container.className = `layout-picker ${className}`.trim();
  container.contentEditable = "false";

  // Apply custom styles
  Object.entries(style).forEach(([key, value]) => {
    container.style[key as any] = value;
  });

  // Create subtitle
  const subtitleEl = document.createElement("p");
  subtitleEl.className = "layout-picker-subtitle";
  subtitleEl.textContent = subtitle;
  container.appendChild(subtitleEl);

  // Create templates container
  const templatesContainer = document.createElement("div");
  templatesContainer.className = "layout-picker-templates";
  container.appendChild(templatesContainer);

  // Create template cards
  layouts.forEach((layout) => {
    const card = document.createElement("div");
    card.className = `layout-template ${templateClassName}`.trim();
    card.setAttribute("data-layout-id", layout.id);

    // Apply custom template styles
    Object.entries(templateStyle).forEach(([key, value]) => {
      card.style[key as any] = value;
    });

    // Create icon container
    const iconContainer = document.createElement("div");
    iconContainer.className = "layout-template-icon";
    iconContainer.style.maxWidth = iconMaxWidth;
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

      // Get the editor view from the closure
      const editorView = getView();
      if (!editorView) {
        console.warn("[AutoArtifacts] Could not find editor view");
        return;
      }

      const slideElement = card.closest(
        '[data-node-type="slide"]'
      ) as HTMLElement;

      if (onLayoutSelect) {
        // Use custom handler
        onLayoutSelect(layout.id, slideElement);
      } else {
        // Default behavior: apply the layout directly
        applySlideLayoutDirect(editorView, slideOffset, layout.id);
      }
    });

    templatesContainer.appendChild(card);
  });

  return container;
}

/**
 * Applies slide layout directly using transaction
 * This is called when no custom handler is provided
 */
function applySlideLayoutDirect(
  view: EditorView,
  slideOffset: number,
  layout: string
): void {
  try {
    const state = view.state;
    const $pos = state.doc.resolve(slideOffset + 1);

    // Find the slide node
    let slideDepth = -1;
    for (let d = $pos.depth; d >= 0; d--) {
      if ($pos.node(d).type.name === "slide") {
        slideDepth = d;
        break;
      }
    }

    if (slideDepth === -1) {
      console.warn("[AutoArtifacts] Slide not found");
      return;
    }

    const slideNode = $pos.node(slideDepth);
    const slidePos = $pos.before(slideDepth);

    // Parse layout
    const columnCount = layout.split("-").length;
    const ratios = parseLayout(layout, columnCount);

    if (!ratios || ratios.length === 0) {
      console.warn("[AutoArtifacts] Invalid layout format");
      return;
    }

    // Check if slide is empty - use placeholder content if so
    const isEmpty = isSlideEmpty(slideNode);
    let newColumns: ProseMirrorNode[];

    if (isEmpty) {
      // Create placeholder content for empty slide
      newColumns = createPlaceholderContent(layout, state.schema);
    } else {
      // Redistribute existing content
      const existingBlocks = extractContentBlocks(slideNode);
      newColumns = redistributeContent(
        existingBlocks,
        columnCount,
        state.schema
      );
    }

    if (newColumns.length === 0) {
      console.error("[AutoArtifacts] Failed to create columns");
      return;
    }

    // Create new row and slide
    const rowType = state.schema.nodes.row;
    const slideType = state.schema.nodes.slide;

    if (!rowType || !slideType) {
      console.error("[AutoArtifacts] Missing node types");
      return;
    }

    const newRow = rowType.create({ layout }, newColumns);
    const newSlide = slideType.create({ ...slideNode.attrs, layout }, [newRow]);

    // Replace the slide
    const tr = state.tr.replaceRangeWith(
      slidePos,
      slidePos + slideNode.nodeSize,
      newSlide
    );

    view.dispatch(tr);

    // Apply layout styles - need to wait for DOM update
    setTimeout(() => {
      // Use view.dom.parentElement to get the editor wrapper, or view.dom itself
      const editorElement =
        (view.dom.closest(".autoartifacts-editor") as HTMLElement) || view.dom;
      applyAllLayouts(editorElement);
    }, 10);
  } catch (error) {
    console.error("[AutoArtifacts] Error applying layout:", error);
  }
}

// TODO: Import these from @autoartifacts/core when available
function parseLayout(layout: string, _columnCount: number): number[] | null {
  // Placeholder implementation
  return layout.split("-").map(Number);
}

function createPlaceholderContent(
  _layout: string,
  schema: any
): ProseMirrorNode[] {
  // Placeholder implementation
  const paragraphType = schema.nodes.paragraph;
  return [paragraphType.create()];
}

function extractContentBlocks(_node: ProseMirrorNode): ProseMirrorNode[] {
  // Placeholder implementation
  return [];
}

function redistributeContent(
  _blocks: ProseMirrorNode[],
  _count: number,
  schema: any
): ProseMirrorNode[] {
  // Placeholder implementation
  const paragraphType = schema.nodes.paragraph;
  return [paragraphType.create()];
}

function applyAllLayouts(_element: HTMLElement): void {
  // Placeholder implementation
  console.log("[AutoArtifacts] Apply layouts called");
}
