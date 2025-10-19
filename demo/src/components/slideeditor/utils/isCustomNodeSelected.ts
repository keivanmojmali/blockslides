import type { SlideEditor as Editor } from "@autoartifacts/core";

/**
 * TODO: When you create custom extensions, import them here
 *
 * Examples of custom extensions you might create:
 * - AiWriter: AI writing assistant node
 * - AiImage: AI image generation node
 * - Figcaption: Image caption component
 * - ImageBlock: Custom image block with controls
 * - ImageUpload: Image upload placeholder/widget
 * - TableOfContentsNode: Auto-generated table of contents
 *
 * import {
 *   AiWriter,
 *   AiImage,
 *   Figcaption,
 *   ImageBlock,
 *   ImageUpload,
 * } from '@demo/components/slideeditor/extensions'
 * import { TableOfContentsNode } from '@demo/components/slideeditor/extensions/TableOfContentsNode'
 */

/**
 * Checks if a table cell's row or column grip handle is selected
 * Used to determine if table manipulation UI should be shown
 *
 * @param node - The HTML element to check
 * @returns true if a table grip is selected, false otherwise
 */
export const isTableGripSelected = (node: HTMLElement) => {
  let container = node;

  // Traverse up the DOM tree until we find a table cell (TD or TH)
  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement!;
  }

  // Check if column grip is selected
  const gripColumn =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-column.selected");

  // Check if row grip is selected
  const gripRow =
    container &&
    container.querySelector &&
    container.querySelector("a.grip-row.selected");

  if (gripColumn || gripRow) {
    return true;
  }

  return false;
};

/**
 * Checks if any custom node type is currently selected/active in the editor
 * This is useful for hiding the text formatting bubble menu when special nodes are selected
 *
 * @param editor - The editor instance
 * @param node - The HTML element to check for table grips
 * @returns true if a custom node is active or table grip is selected
 */
export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  /**
   * TODO: Add your custom node names here as you create them
   * Use the extension's `.name` property to get the node type name
   *
   * Standard extensions from @autoartifacts/extension-kit that you might want to check:
   * - 'horizontalRule'
   * - 'codeBlock'
   * - 'image'
   * - 'link' (this is a mark, not a node)
   * - 'tableOfContents'
   *
   * Custom extensions you might create:
   * - 'aiWriter'
   * - 'aiImage'
   * - 'figcaption'
   * - 'imageBlock'
   * - 'imageUpload'
   */
  const customNodes: string[] = [
    "horizontalRule",
    "codeBlock",
    "image",
    // 'link', // Note: Link is a mark, not a node - use editor.isActive('link') separately if needed
    // Add custom node names here as you create them:
    // AiWriter.name,
    // AiImage.name,
    // Figcaption.name,
    // ImageBlock.name,
    // ImageUpload.name,
    // TableOfContentsNode.name,
  ];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  );
};

export default isCustomNodeSelected;
