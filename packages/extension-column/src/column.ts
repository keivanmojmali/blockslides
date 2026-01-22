import { mergeAttributes, Node, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const columnStyles = `
.column {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

/* Column is a block that contains other blocks */
.column[data-node-type="column"] {
  /* Default: stack children vertically */
}

/* Adjacent columns in a slide form a horizontal row */
/* This is handled via the slide's column-row-group wrapper */
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
 * The Column extension defines a container block that can hold other blocks.
 * It's the primary layout container in BlockSlides.
 * 
 * Common attributes (align, padding, gap, backgroundColor, etc.) are provided
 * by the BlockAttributes extension via addGlobalAttributes.
 */
export const Column = Node.create<ColumnOptions>({
  name: "column",

  group: "block",

  content: "block+",

  isolating: true,
  defining: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      injectNonce: undefined,
    };
  },

  // Note: Most attributes (align, padding, gap, backgroundColor, borderRadius, 
  // fill, width, height, justify) are provided by the BlockAttributes extension.
  // Only column-specific attributes that aren't in BlockAttributes go here.
  addAttributes() {
    return {};
  },

  parseHTML() {
    return [{ tag: "div.column" }];
  },

  renderHTML({ HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    
    // Extract class/className for proper handling
    const { class: classAttr, className, ...rest } = merged;
    const combinedClassName = [classAttr, className, "column"].filter(Boolean).join(" ");

    return [
      "div",
      {
        ...rest,
        class: combinedClassName,
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
