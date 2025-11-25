import { mergeAttributes, Node, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const columnStyles = `
.column {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

/* Vertical alignment (main axis: column) */
.column.v-align-top {
  justify-content: flex-start;
}
.column.v-align-center {
  justify-content: center;
}
.column.v-align-bottom {
  justify-content: flex-end;
}

/* Horizontal alignment (cross axis) */
.column.h-align-left {
  align-items: flex-start;
  text-align: left;
}
.column.h-align-center {
  align-items: center;
  text-align: center;
}
.column.h-align-right {
  align-items: flex-end;
  text-align: right;
}

/* Background helpers (driven by data attributes + inline CSS vars) */
.column[data-bg-mode="color"] {
  background-color: var(--column-bg-color);
}

.column[data-bg-mode="image"],
.column[data-bg-mode="imageOverlay"] {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.column[data-bg-mode="imageOverlay"]::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: var(--column-bg-overlay-color, #000);
  opacity: var(--column-bg-overlay-opacity, 0.35);
}
`;

export interface ColumnOptions {
  /**
   * The HTML attributes for a column node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;
  /**
   * Whether to inject CSS styles
   * @default true
   */
  injectCSS: boolean;
  /**
   * Content Security Policy nonce
   */
  injectNonce?: string;
}

const ColumnPluginKey = new PluginKey("column");

/**
 * The Column extension defines vertical containers within rows.
 */
export const Column = Node.create<ColumnOptions>({
  name: "column",

  content: "(block | row)+",
  isolating: true,
  defining: true,
  selectable:true,
  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      injectNonce: undefined,
    };
  },

  addAttributes() {
    return {
      className: {
        default: "",
      },
      contentMode: {
        default: "default",
      },
      verticalAlign: {
        default: "top",
      },
      horizontalAlign: {
        default: "left",
      },
      padding: {
        default: "none",
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
    return [{ tag: "div.column" }];
  },

  renderHTML({ HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const {
      contentMode,
      verticalAlign,
      horizontalAlign,
      padding,
      backgroundMode,
      backgroundColor,
      backgroundImage,
      backgroundOverlayColor,
      backgroundOverlayOpacity,
      ...rest
    } = merged;

    const styleParts: string[] = [];

    if (backgroundColor) {
      styleParts.push(`--column-bg-color: ${backgroundColor}`);
    }

    if (backgroundImage) {
      const escaped = String(backgroundImage).replace(/"/g, '\\"');
      styleParts.push(`background-image: url("${escaped}")`);
    }

    if (backgroundOverlayColor) {
      styleParts.push(`--column-bg-overlay-color: ${backgroundOverlayColor}`);
    }

    if (backgroundOverlayOpacity != null) {
      styleParts.push(`--column-bg-overlay-opacity: ${backgroundOverlayOpacity}`);
    }

    const style = [rest.style, styleParts.join("; ")].filter(Boolean).join("; ");

    const className = [rest.class, rest.className].filter(Boolean).join(" ");

    delete (rest as any).className;
    delete (rest as any).class;

    return [
      "div",
      {
        ...rest,
        class: `column ${className} content-${contentMode} v-align-${verticalAlign} h-align-${horizontalAlign} padding-${padding}`.trim(),
        "data-node-type": "column",
        "data-bg-mode": backgroundMode || "none",
        style: style || undefined,
      },
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: ColumnPluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && document) {
              createStyleTag(columnStyles, this.options.injectNonce, "column");
            }
            return {};
          },
          apply: (tr, pluginState) => pluginState,
        },
      }),
    ];
  },
});
