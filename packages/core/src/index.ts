// Editor
export { SlideEditor } from "./SlideEditor";
export type { SlideEditorOptions } from "./SlideEditor";

// Event system
export { EventEmitter } from "./EventEmitter";

// Extension system
export { Extendable } from "./Extendable";
export type { ExtendableConfig } from "./Extendable";
export { Extension } from "./Extension";
export type { ExtensionConfig } from "./Extension";
export { Mark } from "./Mark";
export type { MarkConfig } from "./Mark";
export { Node } from "./Node";
export type { NodeConfig } from "./Node";
export { ExtensionManager } from "./ExtensionManager";

// Command system
export { CommandManager } from "./CommandManager";
// CoreCommands will be rewritten to use new Extension API in Step 10
// export { CoreCommands } from "./extensions/CoreCommands";

// Utilities
export { Tracker } from "./Tracker";
export type { TrackerResult } from "./Tracker";
export { style } from "./style";

// JSX Runtime
export {
  createElement,
  Fragment,
  h,
  jsx,
  jsxDEV,
  jsxs,
} from "./jsx-runtime";
export type {
  Attributes,
  DOMOutputSpecArray,
  DOMOutputSpecElement,
  JSXRenderer,
} from "./jsx-runtime";

// Schema
export { schema } from "./schema";

// Plugins
export { createMarkdownInputRules } from "./plugins/markdownInputRules";

// Utils
export * from "./utils";

// Types
export * from "./types";

// Validation
export * from "./validation";

// Actions
export { actions } from "./actions";

// Keyboard
export * from "./keyboard/defaultShortcuts";
