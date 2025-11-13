import { Node, mergeAttributes, createStyleTag } from "@blockslides/core";
import { Plugin, PluginKey } from "@blockslides/pm/state";

const slideStyles = `
.slide {
  height: var(--slide-height, 100%);
  min-height: var(--slide-min-height, 250px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--slide-bg);
  border-radius: var(--slide-border-radius);
  box-shadow: var(--slide-shadow);
  margin-bottom: var(--slide-margin-bottom);
}
`;

export interface SlideOptions {
  /**
   * The HTML attributes for a slide node.
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

const SlidePluginKey = new PluginKey("slide");

export const Slide = Node.create<SlideOptions>({
  name: "slide",
  isolating: true,
  content: "row+",

  group: "slide",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      injectCSS: true,
      injectNonce: undefined,
    };
  },

  parseHTML() {
    return [{ tag: "div.slide" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "slide",
        "data-node-type": "slide",
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: SlidePluginKey,
        state: {
          init: () => {
            if (this.options.injectCSS && typeof document !== "undefined") {
              createStyleTag(slideStyles, this.options.injectNonce, "slide");
            }
            return {};
          },
          apply: (_tr, pluginState: Record<string, never>) => pluginState,
        },
      }),
    ];
  },
});
