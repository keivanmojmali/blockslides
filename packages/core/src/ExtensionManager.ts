import type { Plugin } from 'prosemirror-state';
import type { Extension } from './Extension';
import type { SlideEditor } from './SlideEditor';

/**
 * ExtensionManager
 * 
 * Manages a collection of extensions and coordinates their lifecycle.
 * Responsible for:
 * - Collecting plugins from all extensions
 * - Calling onCreate/onDestroy hooks
 * - Sorting extensions by priority
 */
export class ExtensionManager {
  private extensions: Extension[];
  private editor: SlideEditor;
  
  constructor(extensions: Extension[], editor: SlideEditor) {
    // Sort by priority (higher priority first)
    this.extensions = extensions.sort((a, b) => b.priority - a.priority);
    this.editor = editor;
  }
  
  /**
   * Get all plugins from all extensions
   */
  public getPlugins(): Plugin[] {
    return this.extensions.flatMap(ext => ext.plugins(this.editor));
  }
  
  /**
   * Call onCreate on all extensions
   */
  public onCreate(): void {
    this.extensions.forEach(ext => {
      if (ext.onCreate) {
        ext.onCreate(this.editor);
      }
    });
  }
  
  /**
   * Call onDestroy on all extensions
   */
  public onDestroy(): void {
    this.extensions.forEach(ext => {
      if (ext.onDestroy) {
        ext.onDestroy(this.editor);
      }
    });
  }
}


