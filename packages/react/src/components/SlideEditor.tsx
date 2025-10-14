import { forwardRef, useImperativeHandle } from 'react';
import { useSlideEditor } from '../hooks/useSlideEditor';
import type { SlideEditorOptions } from '@autoartifacts/core';
import '@autoartifacts/styles';

export interface SlideEditorProps extends SlideEditorOptions {
  className?: string;
}

/**
 * SlideEditor Component
 * 
 * React component wrapper for the SlideEditor class.
 * Provides a declarative API for creating slide presentations.
 * 
 * @example
 * ```typescript
 * import { SlideEditor } from '@autoartifacts/react';
 * import { PlaceholderExtension } from '@autoartifacts/extension-placeholder';
 * 
 * function MyEditor() {
 *   const [content, setContent] = useState(initialContent);
 *   
 *   return (
 *     <SlideEditor
 *       content={content}
 *       onChange={setContent}
 *       extensions={[PlaceholderExtension.configure()]}
 *       editorTheme="light"
 *       editorMode="edit"
 *     />
 *   );
 * }
 * ```
 */
export const SlideEditor = forwardRef<any, SlideEditorProps>(
  ({ className, ...options }, ref) => {
    // Don't pass extensions/plugins as deps - they cause unnecessary recreations
    // Content changes will trigger updates via the onChange callback
    const { editor, ref: editorRef } = useSlideEditor(options, []);
    
    // Expose editor instance via ref
    useImperativeHandle(ref, () => editor, [editor]);
    
    const editorClassName = [
      'autoartifacts-editor',
      `theme-${options.editorTheme || 'light'}`,
      `mode-${options.editorMode || 'edit'}`,
      options.readOnly ? 'read-only' : '',
      className,
    ].filter(Boolean).join(' ');
    
    return <div ref={editorRef} className={editorClassName} />;
  }
);

SlideEditor.displayName = 'SlideEditor';
