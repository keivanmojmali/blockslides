import { mergeAttributes, Node, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const columnStyles = `
.column {
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
    };
  },

  parseHTML() {
    return [{ tag: "div.column" }];
  },

  renderHTML({ HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const { contentMode, verticalAlign, horizontalAlign, padding } = merged;
    const className = [merged.class, merged.className].filter(Boolean).join(" ");

    delete merged.className;

    return [
      "div",
      {
        ...merged,
        class: `column ${className} content-${contentMode} v-align-${verticalAlign} h-align-${horizontalAlign} padding-${padding}`.trim(),
        "data-node-type": "column",
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
