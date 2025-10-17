/**
 * Slide Extension
 *
 * Defines individual slide nodes in AutoArtifacts presentations.
 * Each slide contains block content (paragraphs, headings, lists, etc.)
 *
 * Based on Tiptap's extension patterns
 * Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 */

import { Node } from "@autoartifacts/core";

/**
 * The Slide extension defines individual slides in a presentation.
 * @see https://tiptap.dev/api/nodes
 */
export const Slide = Node.create({
  name: "slide",

  content: "block+",

  group: "slide",

  defining: true,

  parseHTML() {
    return [{ tag: "section" }];
  },

  renderHTML() {
    return ["section", 0];
  },
});
