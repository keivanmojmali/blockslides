import { useEffect, useState } from "react";
import { useEditor } from "@autoartifacts/react";
import type { AnyExtension, Editor } from "@autoartifacts/core";
import { ExtensionKit } from "@autoartifacts/extension-kit";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

type UseSlideEditorProps = {
  /** Called when user types in the editor */
  onUpdate?: (content: string) => void;
  /** Initial content for the editor */
  content?: string | object;
  /** If true, editor will be read-only */
  generating?: boolean;
  /** Initial response content (alternative to content) */
  initialResponse?: string;
  /** Extensions to include in the editor */
  extensions?: AnyExtension[];
  /** Whether to auto-focus the editor */
  autofocus?: boolean;
};

export type { UseSlideEditorProps };

/**
 * Custom hook for creating a SlideEditor instance
 * 
 * @example
 * ```typescript
 * const { editor } = useSlideEditor({
 *   content: initialContent,
 *   onUpdate: (content) => console.log('Updated:', content),
 *   extensions: [
 *     ExtensionKit.configure({
 *       heading: { levels: [1, 2, 3] },
 *       codeBlock: false,
 *     })
 *   ]
 * })
 * ```
 */
export const useSlideEditor = ({
  content,
  generating = false,
  initialResponse,
  onUpdate,
  extensions = [],
  autofocus = true,
}: UseSlideEditorProps = {}) => {
  const [hasLoadedContent, setHasLoadedContent] = useState(false);

  // TODO: Add debounce extension for performance optimization
  // const { handleChange: debouncedUpdate } = useDebounce({
  //   callback: onUpdate ?? (() => {}),
  //   delay: 300,
  // });

  const handleUpdate = onUpdate ?? (() => {});

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      autofocus,
      editable: !generating,
      onUpdate: (ctx: { editor: Editor }) => {
        if (!hasLoadedContent) return;
        // When debounce is added, use: debouncedUpdate(JSON.stringify(ctx.editor.getJSON()))
        handleUpdate(JSON.stringify(ctx.editor.getJSON()));
      },
      onCreate: (ctx: { editor: Editor }) => {
        // Determine which content to load
        let editorContent: any;
        if (content) {
          editorContent = content;
        } else if (initialResponse) {
          editorContent = initialResponse;
        }

        if (editorContent) {
          if (ctx.editor.isEmpty) {
            ctx.editor.commands.setContent(editorContent);
            if (autofocus) {
              ctx.editor.commands.focus("start", { scrollIntoView: true });
            }
          }
        }

        setHasLoadedContent(true);
      },
      extensions: [
        // Default to ExtensionKit if no extensions provided
        ...(extensions.length > 0 ? extensions : [ExtensionKit]),
      ].filter((e): e is AnyExtension => e !== undefined),
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

  // Switch editing on/off if `generating` changes
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!generating);
  }, [editor, generating]);

  // Expose editor instance globally for debugging
  if (typeof window !== "undefined") {
    window.editor = editor;
  }

  return { editor };
};
