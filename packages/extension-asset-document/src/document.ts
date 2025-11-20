import { Node } from "@blockslides/core";

/**
 * Asset-focused document node that accepts generic block content.
 * Same as the default document, but allows `block+` instead of `slide+`.
 */
export const AssetDocument = Node.create({
  name: "doc",
  topNode: true,
  content: "block+",

  renderMarkdown: (node, h) => {
    if (!node.content) {
      return "";
    }

    return h.renderChildren(node.content, "\n\n");
  },
});


