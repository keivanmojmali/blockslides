import { useEffect, useMemo } from "react";
import type { DependencyList } from "react";
import { templatesV1 } from "@blockslides/ai-context";
import type { AnyExtension, Editor, JSONContent } from "@blockslides/core";
import type { SlideOptions } from "@blockslides/extension-slide";
import {
  ExtensionKit,
  type ExtensionKitOptions,
} from "@blockslides/extension-kit";

import {
  useEditor,
  type UseEditorOptions,
} from "./useEditor.js";

type PresetTemplates = ReturnType<typeof templatesV1.listPresetTemplates>;

export type UseSlideEditorProps = {
  /**
   * Initial content for the editor. If omitted, a single preset slide is used.
   */
  content?: UseEditorOptions["content"];
  /**
   * Called on every update with the current JSON document.
   */
  onChange?: (doc: JSONContent, editor: Editor) => void;
  /**
   * Additional extensions to append after the ExtensionKit bundle.
   */
  extensions?: AnyExtension[];
  /**
   * Customize or disable pieces of ExtensionKit (e.g., bubbleMenu: false).
   */
  extensionKitOptions?: ExtensionKitOptions;
  /**
   * Optional preset list to power the add-slide button.
   */
  presetTemplates?: PresetTemplates;
  /**
   * Dependencies array forwarded to useEditor for re-instantiation control.
   * Leave empty to avoid recreating the editor on prop changes.
   */
  deps?: DependencyList;
  /**
   * Called once when an editor instance is ready.
   */
  onEditorReady?: (editor: Editor) => void;
} & Omit<UseEditorOptions, "extensions" | "content">;

const defaultSlide = () => ({
  /**
   * Placeholder slide if no content is provided.
   */

  type: "doc",
  content: [
    {
      type: "slide",
      attrs: {
        size: "16x9",
        className: "",
        id: "slide-1",
        backgroundMode: "none",
        backgroundColor: null,
        backgroundImage: null,
        backgroundOverlayColor: null,
        backgroundOverlayOpacity: null,
      },
      content: [
        {
          type: "column",
          attrs: {
            align: "center",
            padding: "lg",
            margin: null,
            gap: "md",
            backgroundColor: "#ffffff",
            backgroundImage: null,
            borderRadius: null,
            border: null,
            fill: true,
            width: null,
            height: null,
            justify: "center",
          },
          content: [
            {
              type: "heading",
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
                id: "1fc4664c-333d-4203-a3f1-3ad27a54c535",
                "data-toc-id": "1fc4664c-333d-4203-a3f1-3ad27a54c535",
                level: 1,
              },
              content: [
                {
                  type: "text",
                  text: "Lorem ipsum dolor sit amet",
                },
              ],
            },
            {
              type: "paragraph",
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
                  type: "text",
                  text: "Consectetur adipiscing elit. Sed do eiusmod tempor incididunt. ",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const defaultAddSlideButton = (presets: PresetTemplates) => ({
  showPresets: true,
  presets,
  presetBackground: "#0f172a",
  presetForeground: "#e5e7eb",
});

const defaultSlideOptions: Partial<SlideOptions> = {
  renderMode: "dynamic",
  hoverOutline: { color: "#3b82f6", width: "1.5px", offset: "4px" },
  hoverOutlineCascade: false,
};

export const useSlideEditor = ({
  content,
  onChange,
  extensions,
  extensionKitOptions,
  presetTemplates,
  deps = [],
  onEditorReady,
  immediatelyRender = false,
  shouldRerenderOnTransaction = false,
  theme = "light",
  editorProps,
  onUpdate,
  ...editorOptions
}: UseSlideEditorProps = {}) => {


  /**
   * Presets for add slide button.
   */
  const presets = useMemo<PresetTemplates>(
    () => presetTemplates ?? templatesV1.listPresetTemplates(),
    [presetTemplates]
  );

  const mergedExtensionKitOptions = useMemo<ExtensionKitOptions>(() => {
    const addSlideButton =
      extensionKitOptions?.addSlideButton === false
        ? false
        : {
            ...defaultAddSlideButton(presets),
            ...(extensionKitOptions?.addSlideButton ?? {}),
          };

    const slide =
      extensionKitOptions?.slide === false
        ? false
        : {
            ...defaultSlideOptions,
            ...(extensionKitOptions?.slide ?? {}),
          };

    return {
      ...extensionKitOptions,
      addSlideButton,
      slide,
    };
  }, [extensionKitOptions, presets]);

  const resolvedExtensions = useMemo<AnyExtension[]>(() => {
    const kit = ExtensionKit.configure(mergedExtensionKitOptions);
    return extensions ? [kit, ...extensions] : [kit];
  }, [extensions, mergedExtensionKitOptions]);

  /**
   * Initial content for the editor.
   * content, initialContent, defaultValue, value etc are all the same thing
   */
  const initialContent = content ?? defaultSlide();

  const editor = useEditor(
    {
      content: initialContent,
      extensions: resolvedExtensions,
      immediatelyRender,
      shouldRerenderOnTransaction,
      theme,
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full min-w-full",
          ...(editorProps?.attributes ?? {}),
        },
        ...editorProps,
      },
      ...editorOptions,
      onUpdate: (ctx) => {
        const json = ctx.editor.getJSON();
        onChange?.(json, ctx.editor);
        onUpdate?.(ctx);
      },
    },
    deps
  );

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      onEditorReady?.(editor);
    }
  }, [editor, onEditorReady]);

  return { editor, presets };
};
