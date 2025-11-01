import { mergeAttributes, Node, createStyleTag } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";

const baseRowStyles = `
.row {
  display: flex;
  flex: 1;
  min-height: 0;
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
    };
  },

  parseHTML() {
    return [{ tag: "div.row" }];
  },

  renderHTML({ HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const className = [merged.class, merged.className, "row"].filter(Boolean).join(" ");

    delete merged.className;

    return [
      "div",
      {
        ...merged,
        class: className,
        "data-node-type": "row",
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
