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
 * - Deduplicating extensions by name
 */
export class ExtensionManager {
  private extensions: Extension[];
  private editor: SlideEditor;
  
  constructor(extensions: Extension[], editor: SlideEditor) {
    // Deduplicate extensions by name (keep first instance)
    const seenNames = new Set<string>();
    const uniqueExtensions = extensions.filter(ext => {
      if (seenNames.has(ext.name)) {
        console.warn(`[AutoArtifacts] Skipping duplicate extension: ${ext.name}`);
        return false;
      }
      seenNames.add(ext.name);
      return true;
    });
    
    // Sort by priority (higher priority first)
    this.extensions = uniqueExtensions.sort((a, b) => b.priority - a.priority);
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


