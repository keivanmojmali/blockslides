/**
 * useSlideEditor Hook
 * 
 * TipTap-style React hook for managing SlideEditor instances.
 * Wraps the core SlideEditor class with React lifecycle management.
 */

import { useEffect, useState, useRef } from 'react';
import { SlideEditor } from '@autoartifacts/core';
import type { SlideEditorOptions } from '@autoartifacts/core';

/**
 * Hook for creating and managing a SlideEditor instance
 * 
 * @example
 * ```typescript
 * const { editor, ref } = useSlideEditor(
 *   {
 *     content: myContent,
 *     onChange: setContent,
 *     extensions: [PlaceholderExtension.configure()]
 *   },
 *   [myContent, extensions]
 * );
 * 
 * return <div ref={ref} />;
 * ```
 * 
 * @param options - SlideEditor configuration options
 * @param deps - React dependencies array (recreates editor when these change)
 * @returns Object containing the editor instance and DOM ref
 */
export function useSlideEditor(
  options: SlideEditorOptions,
  deps: React.DependencyList = []
) {
  const [editor, setEditor] = useState<SlideEditor | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<SlideEditor | null>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Destroy previous editor if it exists
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }
    
    // Create new editor instance
    const instance = new SlideEditor(options);
    instance.mount(elementRef.current);
    
    editorRef.current = instance;
    setEditor(instance);
    
    return () => {
      instance.destroy();
      editorRef.current = null;
      setEditor(null);
    };
  }, deps);
  
  return { editor, ref: elementRef };
}
