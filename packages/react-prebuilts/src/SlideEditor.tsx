import React, { forwardRef, useMemo } from "react";
import type { CSSProperties } from "react";

import { EditorContent, type EditorContentProps } from "@blockslides/react";
import {
  BubbleMenuPreset,
  type BubbleMenuPresetProps,
} from "./menus/BubbleMenuPreset.js";
import {
  useSlideEditor,
  type UseSlideEditorProps,
} from "./useSlideEditor.js";

export type SlideEditorProps = UseSlideEditorProps & {
  /**
   * Toggle or customize the built-in BubbleMenuPreset.
   * - true (default): render with defaults
   * - false: disable entirely
   * - object: pass through to BubbleMenuPreset
   */
  bubbleMenuPreset?: boolean | BubbleMenuPresetProps;
  /**
   * Additional props forwarded to EditorContent.
   */
  editorContentProps?: Omit<EditorContentProps, "editor">;
  /**
   * Viewport scale factor applied to the slide viewport.
   * @default 1
   */
  viewportScale?: number;
  className?: string;
  style?: CSSProperties;
};

export const SlideEditor = forwardRef<HTMLDivElement, SlideEditorProps>(
  (
    {
      bubbleMenuPreset = true,
      editorContentProps,
      viewportScale = 1,
      className,
      style,
      ...hookProps
    },
    ref
  ) => {
    const { editor } = useSlideEditor(hookProps);

    const bubbleMenuProps = useMemo(() => {
      if (bubbleMenuPreset === false) return null;
      if (bubbleMenuPreset === true) return {};
      return bubbleMenuPreset;
    }, [bubbleMenuPreset]);

    if (!editor) return null;

    return (
      <div ref={ref} className={className} style={style}>
        <div
          className="bs-viewport"
          style={{ ["--zoom" as any]: viewportScale }}
        >
          <EditorContent editor={editor} {...editorContentProps} />
          {bubbleMenuProps && (
            <BubbleMenuPreset editor={editor} {...bubbleMenuProps} />
          )}
        </div>
      </div>
    );
  }
);

SlideEditor.displayName = "SlideEditor";
