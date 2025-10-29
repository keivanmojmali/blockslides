/**
 * Slide Extension
 *
 * Defines individual slide nodes in AutoArtifacts presentations.
 * Each slide contains rows which contain columns or block content.
 *
 * Based on Tiptap's extension patterns
 * Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 */

import { Node, mergeAttributes, createStyleTag } from "@autoartifacts/core";
import { Plugin, PluginKey } from "@autoartifacts/pm/state";

const slideStyles = `
.slide {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

  addAttributes() {
    return {
      className: {
        default: "",
      },
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
            if (this.options.injectCSS && document) {
              createStyleTag(slideStyles, this.options.injectNonce, "slide");
            }
            return {};
          },
          apply: (tr, pluginState) => pluginState,
        },
      }),
    ];
  },
});
