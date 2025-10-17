/**
 * Extension System Types for AutoArtifacts
 * 
 * These types support the extension architecture adapted from Tiptap v3
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import type { MarkType, NodeType, Schema } from 'prosemirror-model'
import type { Plugin, Transaction } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { SlideEditor } from '../SlideEditor.js'
import type { EditorEvents } from './index.js'

/**
 * Any configuration type (Extension, Mark, or Node)
 */
export type AnyConfig = Record<string, any>

/**
 * Array of any extension types
 */
export type Extensions = Array<any>

/**
 * Global attributes that can be added to all nodes/marks
 */
export type GlobalAttributes = Array<{
  types: string[]
  attributes: Record<string, any>
}>

/**
 * JSON content representation
 */
export interface JSONContent {
  type: string
  attrs?: Record<string, any>
  content?: JSONContent[]
  marks?: Array<{
    type: string
    attrs?: Record<string, any>
  }>
  text?: string
}

/**
 * Keyboard shortcut command function
 */
export type KeyboardShortcutCommand = (props: {
  editor: SlideEditor
  transaction: Transaction
  event: KeyboardEvent
}) => boolean

/**
 * Raw commands object
 */
export type RawCommands = Record<string, (...args: any[]) => boolean>

/**
 * Parent configuration wrapper
 * Used to wrap lifecycle methods from parent extensions
 * Maps each property to either return the value or null
 */
export type ParentConfig<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any
    ? (...args: Parameters<T[P]>) => ReturnType<T[P]> | null
    : T[P]
}

/**
 * Render context for node views
 */
export interface RenderContext {
  editor: SlideEditor
  view: EditorView
  getPos: () => number | undefined
  node: any
  decorations: any[]
}

/**
 * Markdown tokenizer function
 */
export type MarkdownTokenizer = (state: any, silent: boolean) => boolean

/**
 * Markdown token
 */
export interface MarkdownToken {
  type: string
  tag?: string
  attrs?: Record<string, any>
  content?: string
  markup?: string
  info?: string
  level?: number
  block?: boolean
  tight?: boolean
  children?: MarkdownToken[]
}

/**
 * Markdown parse helpers
 */
export interface MarkdownParseHelpers {
  Token: any // Token constructor class
}

/**
 * Markdown parse result
 */
export interface MarkdownParseResult {
  tokens: MarkdownToken[]
}

/**
 * Markdown renderer helpers
 */
export interface MarkdownRendererHelpers {
  esc: (text: string) => string
  repeat: (text: string, count: number) => string
}

/**
 * Attribute definition for nodes and marks
 */
export interface Attribute {
  default?: any | (() => any)
  rendered?: boolean
  renderHTML?: ((attributes: Record<string, any>) => Record<string, any> | null) | null
  parseHTML?: ((element: HTMLElement) => any) | null
  keepOnSplit?: boolean
  isRequired?: boolean
  validate?: (value: any) => boolean
}

/**
 * Attributes definition object
 */
export type Attributes = Record<string, Partial<Attribute>>

/**
 * Extension attribute definition with type and name
 */
export interface ExtensionAttribute {
  type: string
  name: string
  attribute: Required<Omit<Attribute, 'validate'>> & Pick<Attribute, 'validate'>
}

/**
 * Enable rules configuration for input/paste rules
 */
export type EnableRules = boolean | Array<string | AnyExtension>

/**
 * Maybe return type - extracts return type from function or uses type as-is
 */
export type MaybeReturnType<T> = T extends (...args: any[]) => infer R ? R : T

/**
 * Remove 'this' parameter from function type
 */
export type RemoveThis<T> = T extends (this: any, ...args: infer A) => infer R
  ? (...args: A) => R
  : T

/**
 * Maybe 'this' parameter type - extracts 'this' type if it exists
 */
export type MaybeThisParameterType<T> = T extends (this: infer This, ...args: any[]) => any
  ? This
  : Record<string, any>

/**
 * Any extension type (will be properly typed once Extension/Mark/Node are created)
 */
export type AnyExtension = any

/**
 * Extension-specific event types
 * Extends the base EditorEvents with extension lifecycle
 */
export interface ExtensionEvents extends EditorEvents {
  beforeCreate?: (event: { editor: SlideEditor }) => void
  create?: (event: { editor: SlideEditor }) => void
  update?: (event: { editor: SlideEditor; transaction: Transaction }) => void
  selectionUpdate?: (event: { editor: SlideEditor; transaction: Transaction }) => void
  transaction?: (event: { editor: SlideEditor; transaction: Transaction }) => void
  focus?: (event: { editor: SlideEditor; event: FocusEvent }) => void
  blur?: (event: { editor: SlideEditor; event: FocusEvent }) => void
  destroy?: (event: { editor: SlideEditor }) => void
}

/**
 * Command specification for extensions
 */
export type CommandSpec = (props: {
  editor: SlideEditor
  tr: Transaction
  dispatch: ((tr: Transaction) => void) | undefined
  view: EditorView
  state: any
}) => boolean

/**
 * Input rule match result
 */
export interface InputRuleMatch {
  index: number
  text: string
  match: RegExpMatchArray
}

/**
 * Paste rule match result
 */
export interface PasteRuleMatch {
  index: number
  text: string
  match: RegExpMatchArray
  pasteEvent: ClipboardEvent
}
