import { mergeAttributes, Node, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const baseColumnGroupStyles = `
.column-group {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  min-height: 0;
  gap: var(--slide-column-gap, 16px);
}

/* When fill is true, the group should take remaining space */
.column-group[data-fill="true"] {
  flex: 1 1 auto;
}

/* Columns within a group share space equally by default */
.column-group > .column {
  flex: 1;
  min-width: 0;
}

/* Background helpers (driven by data attributes + inline CSS vars) */
.column-group[data-bg-mode="color"] {
  background-color: var(--column-group-bg-color);
}

.column-group[data-bg-mode="image"],
.column-group[data-bg-mode="imageOverlay"] {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.column-group[data-bg-mode="imageOverlay"]::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: var(--column-group-bg-overlay-color, #000);
  opacity: var(--column-group-bg-overlay-opacity, 0.35);
}
`;

const layoutStyles = `
/* Default: equal width columns */
.column-group > .column {
  flex: 1;
}

/* Single column layout */
.column-group[data-layout="1"] > .column {
  flex: 1;
}

/* Two column layouts */
.column-group[data-layout="1-1"] > .column:nth-child(1) { flex: 1; }
.column-group[data-layout="1-1"] > .column:nth-child(2) { flex: 1; }

.column-group[data-layout="2-1"] > .column:nth-child(1) { flex: 2; }
.column-group[data-layout="2-1"] > .column:nth-child(2) { flex: 1; }

.column-group[data-layout="1-2"] > .column:nth-child(1) { flex: 1; }
.column-group[data-layout="1-2"] > .column:nth-child(2) { flex: 2; }

/* Three column layouts */
.column-group[data-layout="1-1-1"] > .column:nth-child(1) { flex: 1; }
.column-group[data-layout="1-1-1"] > .column:nth-child(2) { flex: 1; }
.column-group[data-layout="1-1-1"] > .column:nth-child(3) { flex: 1; }

.column-group[data-layout="2-1-1"] > .column:nth-child(1) { flex: 2; }
.column-group[data-layout="2-1-1"] > .column:nth-child(2) { flex: 1; }
.column-group[data-layout="2-1-1"] > .column:nth-child(3) { flex: 1; }

.column-group[data-layout="1-2-1"] > .column:nth-child(1) { flex: 1; }
.column-group[data-layout="1-2-1"] > .column:nth-child(2) { flex: 2; }
.column-group[data-layout="1-2-1"] > .column:nth-child(3) { flex: 1; }

.column-group[data-layout="1-1-2"] > .column:nth-child(1) { flex: 1; }
.column-group[data-layout="1-1-2"] > .column:nth-child(2) { flex: 1; }
.column-group[data-layout="1-1-2"] > .column:nth-child(3) { flex: 2; }

/* Four column layouts */
.column-group[data-layout="1-1-1-1"] > .column:nth-child(1) { flex: 1; }
.column-group[data-layout="1-1-1-1"] > .column:nth-child(2) { flex: 1; }
.column-group[data-layout="1-1-1-1"] > .column:nth-child(3) { flex: 1; }
.column-group[data-layout="1-1-1-1"] > .column:nth-child(4) { flex: 1; }
`;

export interface ColumnGroupOptions {
  /**
   * The HTML attributes for a columnGroup node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
  /**
   * Whether to inject base CSS styles for columnGroup layout
   * @default true
   */
  injectCSS: boolean;
  /**
   * Whether to inject layout-specific CSS (data-layout selectors)
   * @default true
   */
  enableLayoutCSS: boolean;
  /**
   * Content Security Policy nonce
   */
  injectNonce?: string;
}

const ColumnGroupPluginKey = new PluginKey("columnGroup");

/**
 * The ColumnGroup extension groups columns horizontally side-by-side.
 * 
 * - Use column directly in slide for full-width blocks
 * - Use columnGroup to place multiple columns side-by-side
 * 
 * Example:
 * ```
 * slide
 *   column (full width)
 *   columnGroup [column, column] (side-by-side)
 *   column (full width)
 * ```
 */
export const ColumnGroup = Node.create<ColumnGroupOptions>({
  name: "columnGroup",

  group: "block",

  content: "column+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      enableLayoutCSS: true,
      injectNonce: undefined,
    };
  },

  

  addAttributes() {
    return {
      layout: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-layout"),
        renderHTML: (attributes) => {
          if (!attributes.layout) {
            return {};
          }

          return {
            "data-layout": attributes.layout,
          };
        },
      },
      fill: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-fill") === "true",
        renderHTML: (attributes) => {
          if (!attributes.fill) {
            return {};
          }
          return {
            "data-fill": "true",
          };
        },
      },
      className: {
        default: "",
      },
      backgroundMode: {
        default: "none",
      },
      backgroundColor: {
        default: null,
      },
      backgroundImage: {
        default: null,
      },
      backgroundOverlayColor: {
        default: null,
      },
      backgroundOverlayOpacity: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.column-group" }];
  },

  renderHTML({ HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const {
      backgroundMode,
      backgroundColor,
      backgroundImage,
      backgroundOverlayColor,
      backgroundOverlayOpacity,
      ...rest
    } = merged;

    const styleParts: string[] = [];

    if (backgroundColor) {
      styleParts.push(`--column-group-bg-color: ${backgroundColor}`);
    }

    if (backgroundImage) {
      const escaped = String(backgroundImage).replace(/"/g, '\\"');
      styleParts.push(`background-image: url("${escaped}")`);
    }

    if (backgroundOverlayColor) {
      styleParts.push(`--column-group-bg-overlay-color: ${backgroundOverlayColor}`);
    }

    if (backgroundOverlayOpacity != null) {
      styleParts.push(`--column-group-bg-overlay-opacity: ${backgroundOverlayOpacity}`);
    }

    const style = [rest.style, styleParts.join("; ")].filter(Boolean).join("; ");

    const className = [rest.class, rest.className, "column-group"].filter(Boolean).join(" ");

    delete (rest as any).className;
    delete (rest as any).class;

    return [
      "div",
      {
        ...rest,
        class: className,
        "data-node-type": "columnGroup",
        "data-bg-mode": backgroundMode || "none",
        style: style || undefined,
      },
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ColumnGroupPluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && document) {
              createStyleTag(baseColumnGroupStyles, this.options.injectNonce, "column-group");
            }
            if (this.options.enableLayoutCSS && document) {
              createStyleTag(layoutStyles, this.options.injectNonce, "column-group-layouts");
            }
            return {};
          },
          apply: (tr, pluginState) => pluginState,
        },
      }),
    ];
  },
});
