/**
 * JSX Runtime for AutoArtifacts Slide Editor
 * 
 * Copied from @tiptap/core
 * Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 * https://github.com/ueberdosis/tiptap
 * 
 * Enables JSX/TSX syntax in renderHTML methods.
 * Use @jsxImportSource @autoartifacts/core in your tsconfig.json
 */

export type Attributes = Record<string, any>;

export type DOMOutputSpecElement = 0 | Attributes | DOMOutputSpecArray;

/**
 * Better describes the output of a `renderHTML` function in ProseMirror
 * @see https://prosemirror.net/docs/ref/#model.DOMOutputSpec
 */
export type DOMOutputSpecArray =
  | [string]
  | [string, Attributes]
  | [string, 0]
  | [string, Attributes, 0]
  | [string, Attributes, DOMOutputSpecArray | 0]
  | [string, DOMOutputSpecArray];

// JSX types for AutoArtifacts' JSX runtime
// These types only apply when using @jsxImportSource @autoartifacts/core
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = DOMOutputSpecArray;
  export interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  export interface ElementChildrenAttribute {
    children: unknown;
  }
}

export type JSXRenderer = (
  tag: 'slot' | string | ((props?: Attributes) => DOMOutputSpecArray | DOMOutputSpecElement),
  props?: Attributes,
  ...children: JSXRenderer[]
) => DOMOutputSpecArray | DOMOutputSpecElement;

/**
 * Fragment component for JSX
 * @param props - Props containing children
 * @returns The children array
 */
export function Fragment(props: { children: JSXRenderer[] }) {
  return props.children;
}

/**
 * JSX factory function (h / createElement)
 * Converts JSX to ProseMirror DOMOutputSpec arrays
 * 
 * @param tag - HTML tag name, 'slot' for content hole, or component function
 * @param attributes - HTML attributes and props
 * @returns DOMOutputSpec array for ProseMirror
 * 
 * @example
 * // Instead of: ['strong', { class: 'bold' }, 0]
 * // You can write:
 * <strong class="bold"><slot /></strong>
 */
export const h: JSXRenderer = (tag, attributes) => {
  // Treat the slot tag as the ProseMirror hole to render content into
  if (tag === 'slot') {
    return 0;
  }

  // If the tag is a function, call it with the props
  if (tag instanceof Function) {
    return tag(attributes);
  }

  const { children, ...rest } = attributes ?? {};

  if (tag === 'svg') {
    throw new Error('SVG elements are not supported in the JSX syntax, use the array syntax instead');
  }

  // Otherwise, return the tag, attributes, and children as DOMOutputSpec array
  return [tag, rest, children];
};

// See
// https://esbuild.github.io/api/#jsx-import-source
// https://www.typescriptlang.org/tsconfig/#jsxImportSource

export { h as createElement, h as jsx, h as jsxDEV, h as jsxs };
