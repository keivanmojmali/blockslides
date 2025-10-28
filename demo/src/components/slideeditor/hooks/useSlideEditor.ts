"use client";

import { useEditor } from "@autoartifacts/react";
import { ExtensionKit } from "@autoartifacts/extension-kit";
import type { AnyExtension, Editor } from "@autoartifacts/core";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

type UseSlideEditorProps = {
  onUpdate?: (content: string) => void;
  content?: string | object;
  extensions?: AnyExtension[];
};

export type { UseSlideEditorProps };

export const useSlideEditor = ({
  content,
  onUpdate,
}: UseSlideEditorProps = {}) => {
  // TODO: Add debounce extension for performance optimization
  const handleUpdate = onUpdate ?? (() => {});

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      content,
      theme: "dark", //TODO: Test to make sure we can extend/customize themes here
      onUpdate: (ctx: { editor: Editor }) => {
        // When debounce is added, use: debouncedUpdate(JSON.stringify(ctx.editor.getJSON()))
        handleUpdate(JSON.stringify(ctx.editor.getJSON()));
      },
      extensions: [
        ExtensionKit.configure({
          // Disable everything except the essentials
          invisibleCharacters: false, //TODO: FIX THESE - they throw an error
          layoutPicker: false, //TODO: FIX THESE - they throw an error
        }),
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
