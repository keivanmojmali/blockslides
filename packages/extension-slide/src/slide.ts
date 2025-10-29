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

import { Node, mergeAttributes } from "@autoartifacts/core";
import "./slide.css";

export const Slide = Node.create({
  name: "slide",

  content: "row+",

  group: "slide",

  defining: true,

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
      mergeAttributes(HTMLAttributes, {
        class: "slide",
        "data-node-type": "slide",
      }),
      0,
    ];
  },
});
