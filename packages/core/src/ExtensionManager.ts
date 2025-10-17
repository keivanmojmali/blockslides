/**
 * ExtensionManager
 * 
 * Manages all extensions, marks, and nodes for the SlideEditor.
 * Handles schema generation, command collection, plugin management, and lifecycle hooks.
 * 
 * @license MIT
 * Adapted from Tiptap (https://github.com/ueberdosis/tiptap)
 * Copyright © 2024 überdosis GmbH
 */

import { keymap } from 'prosemirror-keymap'
import type { Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { MarkViewConstructor, NodeViewConstructor } from 'prosemirror-view'

import type { SlideEditor } from './SlideEditor.js'
import type { MarkConfig, NodeConfig } from './Extendable.js'
import { Mark } from './Mark.js'
import type { AnyConfig, Extensions } from './types/extensions.js'
import type { RawCommands } from './types/commands.js'
import {
  flattenExtensions,
  getAttributesFromExtensions,
  getExtensionField,
  getRenderedAttributes,
  getSchemaByResolvedExtensions,
  getSchemaTypeByName,
  isExtensionRulesEnabled,
  resolveExtensions,
  sortExtensions,
  splitExtensions,
} from './helpers/index.js'
import { callOrReturn } from './utils/callOrReturn.js'

export class ExtensionManager {
  editor: SlideEditor
  schema: Schema

  /**
   * A flattened and sorted array of all extensions
   */
  extensions: Extensions

  /**
   * A non-flattened array of base extensions (no sub-extensions)
   */
  baseExtensions: Extensions

  splittableMarks: string[] = []

  constructor(extensions: Extensions, editor: SlideEditor) {
    this.editor = editor
    this.baseExtensions = extensions
    this.extensions = resolveExtensions(extensions)
    this.schema = getSchemaByResolvedExtensions(this.extensions, editor)
    this.setupExtensions()
  }

  static resolve = resolveExtensions
  static sort = sortExtensions
  static flatten = flattenExtensions

  /**
   * Get all commands from the extensions.
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  get commands(): RawCommands {
    return this.extensions.reduce((commands, extension) => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: (this.editor as any).extensionStorage?.[extension.name],
        editor: this.editor,
        type: getSchemaTypeByName(extension.name, this.schema),
      }

      const addCommands = getExtensionField<AnyConfig['addCommands']>(
        extension,
        'addCommands',
        context
      )

      if (!addCommands) {
        return commands
      }

      return {
        ...commands,
        ...addCommands(),
      }
    }, {} as RawCommands)
  }

  /**
   * Get all registered ProseMirror plugins from the extensions.
   * @returns An array of ProseMirror plugins
   */
  get plugins(): Plugin[] {
    const { editor } = this

    // With ProseMirror, first plugins within an array are executed first.
    // In Tiptap, we provide the ability to override plugins,
    // so it feels more natural to run plugins at the end of an array first.
    // That's why we have to reverse the `extensions` array and sort again
    // based on the `priority` option.
    const extensions = sortExtensions([...this.extensions].reverse())

    const allPlugins = extensions.flatMap((extension: any) => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: (this.editor as any).extensionStorage?.[extension.name],
        editor,
        type: getSchemaTypeByName(extension.name, this.schema),
      }

      const plugins: Plugin[] = []

      const addKeyboardShortcuts = getExtensionField<AnyConfig['addKeyboardShortcuts']>(
        extension,
        'addKeyboardShortcuts',
        context
      )

      let defaultBindings: Record<string, () => boolean> = {}

      // Bind exit handling for exitable marks
      if (
        extension.type === 'mark' &&
        getExtensionField<MarkConfig['exitable']>(extension, 'exitable', context)
      ) {
        defaultBindings.ArrowRight = () =>
          Mark.handleExit({ editor, mark: extension as Mark })
      }

      if (addKeyboardShortcuts) {
        const bindings = Object.fromEntries(
          Object.entries(addKeyboardShortcuts()).map(([shortcut, method]) => {
            return [shortcut, () => (method as any)({ editor })]
          })
        )

        defaultBindings = { ...defaultBindings, ...bindings }
      }

      const keyMapPlugin = keymap(defaultBindings)
      plugins.push(keyMapPlugin)

      // Input rules
      const addInputRules = getExtensionField<AnyConfig['addInputRules']>(
        extension,
        'addInputRules',
        context
      )

      if (
        isExtensionRulesEnabled(extension, (editor as any).options.enableInputRules ?? true) &&
        addInputRules
      ) {
        const rules = addInputRules()
        if (rules && rules.length) {
          // Note: inputRulesPlugin will need to be implemented or imported
          // For now, we'll skip this part
          // const inputResult = inputRulesPlugin({ editor, rules })
          // const inputPlugins = Array.isArray(inputResult) ? inputResult : [inputResult]
          // plugins.push(...inputPlugins)
        }
      }

      // Paste rules
      const addPasteRules = getExtensionField<AnyConfig['addPasteRules']>(
        extension,
        'addPasteRules',
        context
      )

      if (
        isExtensionRulesEnabled(extension, (editor as any).options.enablePasteRules ?? true) &&
        addPasteRules
      ) {
        const rules = addPasteRules()
        if (rules && rules.length) {
          // Note: pasteRulesPlugin will need to be implemented or imported
          // For now, we'll skip this part
          // const pasteRules = pasteRulesPlugin({ editor, rules })
          // plugins.push(...pasteRules)
        }
      }

      // ProseMirror plugins
      const addProseMirrorPlugins = getExtensionField<AnyConfig['addProseMirrorPlugins']>(
        extension,
        'addProseMirrorPlugins',
        context
      )

      if (addProseMirrorPlugins) {
        const proseMirrorPlugins = addProseMirrorPlugins()
        plugins.push(...proseMirrorPlugins)
      }

      return plugins
    })

    return allPlugins
  }

  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return getAttributesFromExtensions(this.extensions)
  }

  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews(): Record<string, NodeViewConstructor> {
    const { editor } = this
    const { nodeExtensions } = splitExtensions(this.extensions)

    return Object.fromEntries(
      nodeExtensions
        .filter((extension: any) => !!getExtensionField(extension, 'addNodeView'))
        .map((extension: any) => {
          const extensionAttributes = this.attributes.filter(
            (attribute: any) => attribute.type === extension.name
          )
          const context = {
            name: extension.name,
            options: extension.options,
            storage: (this.editor as any).extensionStorage?.[extension.name],
            editor,
            type: getSchemaTypeByName(extension.name, this.schema),
          }
          const addNodeView = getExtensionField<NodeConfig['addNodeView']>(
            extension,
            'addNodeView',
            context
          )

          if (!addNodeView) {
            return []
          }

          const nodeview: NodeViewConstructor = (
            node,
            view,
            getPos,
            decorations,
            innerDecorations
          ) => {
            const HTMLAttributes = getRenderedAttributes(node, extensionAttributes)

            return addNodeView()({
              // pass-through
              node,
              view,
              getPos: getPos as () => number,
              decorations,
              innerDecorations,
              // tiptap-specific
              editor,
              extension,
              HTMLAttributes,
            })
          }

          return [extension.name, nodeview]
        })
    )
  }

  /**
   * Get all mark views from the extensions.
   * @returns An object with all mark views where the key is the mark name and the value is the mark view function
   */
  get markViews(): Record<string, MarkViewConstructor> {
    const { editor } = this
    const { markExtensions } = splitExtensions(this.extensions)

    return Object.fromEntries(
      markExtensions
        .filter((extension: any) => !!getExtensionField(extension, 'addMarkView'))
        .map((extension: any) => {
          const extensionAttributes = this.attributes.filter(
            (attribute: any) => attribute.type === extension.name
          )
          const context = {
            name: extension.name,
            options: extension.options,
            storage: (this.editor as any).extensionStorage?.[extension.name],
            editor,
            type: getSchemaTypeByName(extension.name, this.schema),
          }
          const addMarkView = getExtensionField<MarkConfig['addMarkView']>(
            extension,
            'addMarkView',
            context
          )

          if (!addMarkView) {
            return []
          }

          const markView: MarkViewConstructor = (mark, view, inline) => {
            const HTMLAttributes = getRenderedAttributes(mark, extensionAttributes)

            return addMarkView()({
              // pass-through
              mark,
              view,
              inline,
              // tiptap-specific
              editor,
              extension,
              HTMLAttributes,
              updateAttributes: (attrs: Record<string, any>) => {
                // Note: updateMarkViewAttributes will need to be implemented
                // For now, we'll leave this as a placeholder
                console.warn('updateMarkViewAttributes not yet implemented')
              },
            })
          }

          return [extension.name, markView]
        })
    )
  }

  /**
   * Go through all extensions, create extension storages & setup marks
   * & bind editor event listener.
   */
  private setupExtensions() {
    const extensions = this.extensions
    
    // Re-initialize the extension storage object instance
    ;(this.editor as any).extensionStorage = Object.fromEntries(
      extensions.map(extension => [extension.name, extension.storage])
    )

    extensions.forEach(extension => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: (this.editor as any).extensionStorage?.[extension.name],
        editor: this.editor,
        type: getSchemaTypeByName(extension.name, this.schema),
      }

      if (extension.type === 'mark') {
        const keepOnSplit =
          callOrReturn(getExtensionField(extension, 'keepOnSplit', context)) ?? true

        if (keepOnSplit) {
          this.splittableMarks.push(extension.name)
        }
      }

      const onBeforeCreate = getExtensionField<AnyConfig['onBeforeCreate']>(
        extension,
        'onBeforeCreate',
        context
      )
      const onCreate = getExtensionField<AnyConfig['onCreate']>(extension, 'onCreate', context)
      const onUpdate = getExtensionField<AnyConfig['onUpdate']>(extension, 'onUpdate', context)
      const onSelectionUpdate = getExtensionField<AnyConfig['onSelectionUpdate']>(
        extension,
        'onSelectionUpdate',
        context
      )
      const onTransaction = getExtensionField<AnyConfig['onTransaction']>(
        extension,
        'onTransaction',
        context
      )
      const onFocus = getExtensionField<AnyConfig['onFocus']>(extension, 'onFocus', context)
      const onBlur = getExtensionField<AnyConfig['onBlur']>(extension, 'onBlur', context)
      const onDestroy = getExtensionField<AnyConfig['onDestroy']>(
        extension,
        'onDestroy',
        context
      )

      // Note: SlideEditor event system not yet implemented
      // These will be enabled once SlideEditor is updated in Step 13
      if (onBeforeCreate) {
        // this.editor.on('beforeCreate', onBeforeCreate)
      }

      if (onCreate) {
        // this.editor.on('create', onCreate)
      }

      if (onUpdate) {
        // this.editor.on('update', onUpdate)
      }

      if (onSelectionUpdate) {
        // this.editor.on('selectionUpdate', onSelectionUpdate)
      }

      if (onTransaction) {
        // this.editor.on('transaction', onTransaction)
      }

      if (onFocus) {
        // this.editor.on('focus', onFocus)
      }

      if (onBlur) {
        // this.editor.on('blur', onBlur)
      }

      if (onDestroy) {
        // this.editor.on('destroy', onDestroy)
      }
    })
  }
}

