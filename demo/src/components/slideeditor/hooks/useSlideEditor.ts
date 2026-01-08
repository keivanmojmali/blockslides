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
  templateButtonContent,
  showPresetButton,
}: UseSlideEditorProps = {}) => {
  const defaultPresets = useMemo(
    () => templatesV1.listPresetTemplates(),
    []
  );


  this is where we are at 
  1. we need to make sure the add ne slide button is how we want it - it seems to be working pretty well 
  2. we need to make sure that the presets are good to go which they seem to be 
  3. the final one is lets spend like 20 mins figuring out the fixed width 
  experimental one. lets not spend too much time we can ship that for now since its under unstasble release 
  then lets figure out how we can implement this stuff - update it to npm 
  update the semvars 
  then we can map the agent and get that flow going 
  !!!! do not spend an enormous time on the agent since we want to pass the eye test and for now we 
  want to get it going so that the app can be marketed and we can start gaining some traction 
  then lets release the blockslide asap with some good docs 




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
              showPresets: showPresetButton ?? true,
              presets,
              templateButtonContent,
            },
            slide: {
              renderMode: "fixed",
              hoverOutline: { color: "#3b82f6", width: "1.5px", offset: "4px" },
              hoverOutlineCascade: false,
              // experimental: {
              //   scale: "dynamic",
              //   maxScale: 1,
              //   minScale: 0.1,
              // },
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
