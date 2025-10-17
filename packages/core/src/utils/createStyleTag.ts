/**
 * CSS injection utility for AutoArtifacts Slide Editor
 * 
 * Adapted from @tiptap/core
 * Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 * https://github.com/ueberdosis/tiptap
 */

/**
 * Creates a style tag and injects CSS into the document head.
 * Checks if the style tag already exists to prevent duplicates.
 * 
 * @param style - The CSS string to inject
 * @param nonce - Optional nonce for CSP (Content Security Policy)
 * @param suffix - Optional suffix for the data attribute (for multiple style tags)
 * @returns The created or existing style element
 */
export function createStyleTag(
  style: string,
  nonce?: string,
  suffix?: string
): HTMLStyleElement {
  const dataAttribute = `data-autoartifacts-style${suffix ? `-${suffix}` : ""}`;
  const existingStyleTag = document.querySelector<HTMLStyleElement>(
    `style[${dataAttribute}]`
  );

  // Return existing tag if already injected
  if (existingStyleTag !== null) {
    return existingStyleTag;
  }

  // Create new style tag
  const styleNode = document.createElement("style");

  // Add nonce for CSP if provided
  if (nonce) {
    styleNode.setAttribute("nonce", nonce);
  }

  // Mark as AutoArtifacts style
  styleNode.setAttribute(dataAttribute, "");
  styleNode.innerHTML = style;

  // Inject into head
  document.getElementsByTagName("head")[0].appendChild(styleNode);

  return styleNode;
}
