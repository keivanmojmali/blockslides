"use client";

import { useMemo } from "react";
import { useEditor } from "@blockslides/react";
import { ExtensionKit } from "@blockslides/extension-kit";
import type { AnyExtension, Editor } from "@blockslides/core";
import { templatesV1 } from "@blockslides/ai-context";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

type UseSlideEditorProps = {
  onUpdate?: (content: string) => void;
  content?: string | object;
  extensions?: AnyExtension[];
  presetTemplates?: ReturnType<typeof templatesV1.listPresetTemplates>;
  templateButtonContent?: string;
  showPresetButton?: boolean;
};

export type { UseSlideEditorProps };

export const useSlideEditor = ({
  content,
  onUpdate,
  presetTemplates,
}: UseSlideEditorProps = {}) => {
  const defaultPresets = useMemo(
    () => templatesV1.listPresetTemplates(),
    []
  );




  const presets = useMemo(
    () => presetTemplates ?? defaultPresets,
    [presetTemplates, defaultPresets]
  );
  // TODO: Add debounce extension for performance optimization
  const handleUpdate = onUpdate ?? (() => {});

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      content,
      theme: "dark",
      onUpdate: (ctx: { editor: Editor }) => {
        // When debounce is added, use: debouncedUpdate(JSON.stringify(ctx.editor.getJSON()))
        handleUpdate(JSON.stringify(ctx.editor.getJSON()));
      },
      extensions: [
        ExtensionKit.configure(
          { 
            addSlideButton: {
              showPresets: true,
              presets,
              presetBackground: "#0f172a",
              presetForeground: "#e5e7eb",
            },
            slide: {
              renderMode: "dynamic",
              hoverOutline: { color: "#3b82f6", width: "1.5px", offset: "4px" },
              hoverOutlineCascade: false,
            },
            bubbleMenuPreset: false,
          })
        ],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full min-w-full",
        },
      },
    },
    []
  );

  // Expose editor instance globally for debugging
  if (typeof window !== "undefined") {
    window.editor = editor;
  }

  return { editor };
};
