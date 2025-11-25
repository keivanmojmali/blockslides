import { mergeAttributes, Node, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const baseRowStyles = `
.row {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

/* Background helpers (driven by data attributes + inline CSS vars) */
.row[data-bg-mode="color"] {
  background-color: var(--row-bg-color);
}

.row[data-bg-mode="image"],
.row[data-bg-mode="imageOverlay"] {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.row[data-bg-mode="imageOverlay"]::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: var(--row-bg-overlay-color, #000);
  opacity: var(--row-bg-overlay-opacity, 0.35);
}
`;

const layoutStyles = `
/* Default: equal width columns */
.row > .column {
  flex: 1;
}

/* Single column layout */
.row[data-layout="1"] > .column {
  flex: 1;
}

/* Two column layouts */
.row[data-layout="1-1"] > .column:nth-child(1) { flex: 1; }
.row[data-layout="1-1"] > .column:nth-child(2) { flex: 1; }

.row[data-layout="2-1"] > .column:nth-child(1) { flex: 2; }
.row[data-layout="2-1"] > .column:nth-child(2) { flex: 1; }

.row[data-layout="1-2"] > .column:nth-child(1) { flex: 1; }
.row[data-layout="1-2"] > .column:nth-child(2) { flex: 2; }

/* Three column layouts */
.row[data-layout="1-1-1"] > .column:nth-child(1) { flex: 1; }
.row[data-layout="1-1-1"] > .column:nth-child(2) { flex: 1; }
.row[data-layout="1-1-1"] > .column:nth-child(3) { flex: 1; }

.row[data-layout="2-1-1"] > .column:nth-child(1) { flex: 2; }
.row[data-layout="2-1-1"] > .column:nth-child(2) { flex: 1; }
.row[data-layout="2-1-1"] > .column:nth-child(3) { flex: 1; }

.row[data-layout="1-2-1"] > .column:nth-child(1) { flex: 1; }
.row[data-layout="1-2-1"] > .column:nth-child(2) { flex: 2; }
.row[data-layout="1-2-1"] > .column:nth-child(3) { flex: 1; }

.row[data-layout="1-1-2"] > .column:nth-child(1) { flex: 1; }
.row[data-layout="1-1-2"] > .column:nth-child(2) { flex: 1; }
.row[data-layout="1-1-2"] > .column:nth-child(3) { flex: 2; }

/* Four column layouts */
.row[data-layout="1-1-1-1"] > .column:nth-child(1) { flex: 1; }
.row[data-layout="1-1-1-1"] > .column:nth-child(2) { flex: 1; }
.row[data-layout="1-1-1-1"] > .column:nth-child(3) { flex: 1; }
.row[data-layout="1-1-1-1"] > .column:nth-child(4) { flex: 1; }
`;

export interface RowOptions {
  /**
   * The HTML attributes for a row node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
  /**
   * Whether to inject base CSS styles for row layout
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

const RowPluginKey = new PluginKey("row");

/**
 * The Row extension defines horizontal containers that can hold columns or blocks.
 */
export const Row = Node.create<RowOptions>({
  name: "row",

  content: "column+ | block+",

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
    return [{ tag: "div.row" }];
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
      styleParts.push(`--row-bg-color: ${backgroundColor}`);
    }

    if (backgroundImage) {
      const escaped = String(backgroundImage).replace(/"/g, '\\"');
      styleParts.push(`background-image: url("${escaped}")`);
    }

    if (backgroundOverlayColor) {
      styleParts.push(`--row-bg-overlay-color: ${backgroundOverlayColor}`);
    }

    if (backgroundOverlayOpacity != null) {
      styleParts.push(`--row-bg-overlay-opacity: ${backgroundOverlayOpacity}`);
    }

    const style = [rest.style, styleParts.join("; ")].filter(Boolean).join("; ");

    const className = [rest.class, rest.className, "row"].filter(Boolean).join(" ");

    delete (rest as any).className;
    delete (rest as any).class;

    return [
      "div",
      {
        ...rest,
        class: className,
        "data-node-type": "row",
        "data-bg-mode": backgroundMode || "none",
        style: style || undefined,
      },
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: RowPluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && document) {
              createStyleTag(baseRowStyles, this.options.injectNonce, "row");
            }
            if (this.options.enableLayoutCSS && document) {
              createStyleTag(layoutStyles, this.options.injectNonce, "row-layouts");
            }
            return {};
          },
          apply: (tr, pluginState) => pluginState,
        },
      }),
    ];
  },
});
