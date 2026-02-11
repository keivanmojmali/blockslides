import { computed, watch, toRefs } from 'vue'
import { templatesV1 } from '@blockslides/ai-context'
import type { AnyExtension, Editor, JSONContent } from '@blockslides/core'
import type { SlideOptions } from '@blockslides/extension-slide'
import { ExtensionKit, type ExtensionKitOptions } from '@blockslides/extension-kit'

import { useEditor } from '@blockslides/vue-3'
import type { EditorOptions } from '@blockslides/core'

type PresetTemplates = ReturnType<typeof templatesV1.listPresetTemplates>

export interface UseSlideEditorProps {
  /**
   * Initial content for the editor. If omitted, a single preset slide is used.
   */
  content?: EditorOptions['content']
  /**
   * Called on every update with the current JSON document.
   */
  onChange?: (doc: JSONContent, editor: Editor) => void
  /**
   * Additional extensions to append after the ExtensionKit bundle.
   */
  extensions?: AnyExtension[]
  /**
   * Customize or disable pieces of ExtensionKit (e.g., bubbleMenu: false).
   */
  extensionKitOptions?: ExtensionKitOptions
  /**
   * Optional preset list to power the add-slide button.
   */
  presetTemplates?: PresetTemplates
  /**
   * Called once when an editor instance is ready.
   */
  onEditorReady?: (editor: Editor) => void
  /**
   * Editor theme for UI styling
   */
  theme?: EditorOptions['theme']
  /**
   * The editor's props
   */
  editorProps?: EditorOptions['editorProps']
  /**
   * Called on every update
   */
  onUpdate?: EditorOptions['onUpdate']
  /**
   * Additional editor options to pass through to the core editor.
   * This allows passing any EditorOptions without Vue auto-initializing them.
   */
  editorOptions?: Partial<EditorOptions>
}

const defaultSlide = () => ({
  /**
   * Placeholder slide if no content is provided.
   */
  type: 'doc',
  content: [
    {
      type: 'slide',
      attrs: {
        size: '16x9',
        className: '',
        id: 'slide-1',
        backgroundMode: 'none',
        backgroundColor: null,
        backgroundImage: null,
        backgroundOverlayColor: null,
        backgroundOverlayOpacity: null,
      },
      content: [
        {
          type: 'column',
          attrs: {
            align: 'center',
            padding: 'lg',
            margin: null,
            gap: 'md',
            backgroundColor: '#ffffff',
            backgroundImage: null,
            borderRadius: null,
            border: null,
            fill: true,
            width: null,
            height: null,
            justify: 'center',
          },
          content: [
            {
              type: 'heading',
              attrs: {
                align: null,
                padding: null,
                margin: null,
                gap: null,
                backgroundColor: null,
                backgroundImage: null,
                borderRadius: null,
                border: null,
                fill: null,
                width: null,
                height: null,
                justify: null,
                id: '1fc4664c-333d-4203-a3f1-3ad27a54c535',
                'data-toc-id': '1fc4664c-333d-4203-a3f1-3ad27a54c535',
                level: 1,
              },
              content: [
                {
                  type: 'text',
                  text: 'Lorem ipsum dolor sit amet',
                },
              ],
            },
            {
              type: 'paragraph',
              attrs: {
                align: null,
                padding: null,
                margin: null,
                gap: null,
                backgroundColor: null,
                backgroundImage: null,
                borderRadius: null,
                border: null,
                fill: null,
                width: null,
                height: null,
                justify: null,
              },
              content: [
                {
                  type: 'text',
                  text: 'Consectetur adipiscing elit. Sed do eiusmod tempor incididunt. ',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

const defaultAddSlideButton = (presets: PresetTemplates) => ({
  showPresets: true,
  presets,
  presetBackground: '#0f172a',
  presetForeground: '#e5e7eb',
})

const defaultSlideOptions: Partial<SlideOptions> = {
  renderMode: 'dynamic',
  hoverOutline: { color: '#3b82f6', width: '1.5px', offset: '4px' },
  hoverOutlineCascade: false,
}

export const useSlideEditor = (props: UseSlideEditorProps = {}) => {
  const {
    content,
    onChange,
    extensions,
    extensionKitOptions,
    presetTemplates,
    onEditorReady,
    theme = 'light',
    editorProps,
    onUpdate,
    editorOptions = {}
  } = props
  /**
   * Presets for add slide button.
   */
  const presets = computed<PresetTemplates>(
    () => presetTemplates ?? templatesV1.listPresetTemplates()
  )

  const mergedExtensionKitOptions = computed<ExtensionKitOptions>(() => {
    const addSlideButton =
      extensionKitOptions?.addSlideButton === false
        ? false
        : {
          ...defaultAddSlideButton(presets.value),
          ...(extensionKitOptions?.addSlideButton ?? {}),
        }

    const slide =
      extensionKitOptions?.slide === false
        ? false
        : {
          ...defaultSlideOptions,
          ...(extensionKitOptions?.slide ?? {}),
        }

    return {
      ...extensionKitOptions,
      addSlideButton,
      slide,
    }
  })

  const resolvedExtensions = computed<AnyExtension[]>(() => {
    const kit = ExtensionKit.configure(mergedExtensionKitOptions.value)
    return extensions ? [kit, ...extensions] : [kit]
  })

  /**
   * Initial content for the editor.
   */
  const initialContent = content ?? defaultSlide()

  console.log('resolvedExtensions', resolvedExtensions.value, resolvedExtensions);
  console.log('editorOptions (as single prop):', editorOptions);
  
  const editor = useEditor(
    {
      content: initialContent,
      extensions: resolvedExtensions.value,
      theme,
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full min-w-full',
          ...(editorProps?.attributes ?? {}),
        },
        ...editorProps,
      },
      ...editorOptions,
      onUpdate: (ctx: any) => {
        const json = ctx.editor.getJSON()
        onChange?.(json, ctx.editor)
        onUpdate?.(ctx)
      },
    }
  );

  watch(
    editor,
    newEditor => {
      if (newEditor && !newEditor.isDestroyed) {
        onEditorReady?.(newEditor)
      } else {
        console.log('[useSlideEditor] ❌ Editor not ready or destroyed')
      }
    },
    { immediate: true }
  )

  return { editor, presets }
}
