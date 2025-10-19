import { useEditor } from "@autoartifacts/react";
import type { AnyExtension, Editor } from "@autoartifacts/core";
import { ExtensionKit } from "@autoartifacts/extension-kit";

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
  extensions = [ExtensionKit], // ✅ Default to ExtensionKit here!
}: UseSlideEditorProps = {}) => {
  // TODO: Add debounce extension for performance optimization

  const handleUpdate = onUpdate ?? (() => {});

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      content,
      onUpdate: (ctx: { editor: Editor }) => {
        // When debounce is added, use: debouncedUpdate(JSON.stringify(ctx.editor.getJSON()))
        handleUpdate(JSON.stringify(ctx.editor.getJSON()));
      },
      extensions: [ExtensionKit],
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
