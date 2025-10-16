import type { Plugin } from 'prosemirror-state';
import type { Extension } from './Extension';
import type { SlideEditor } from './SlideEditor';
import type { AnyCommands } from './types/commands';

/**
 * ExtensionManager
 * 
 * Manages a collection of extensions and coordinates their lifecycle.
 * Responsible for:
 * - Collecting plugins from all extensions
 * - Collecting commands from all extensions
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
   * Get all commands from all extensions
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  public getCommands(): AnyCommands {
    return this.extensions.reduce((commands, extension) => {
      // Check if extension has addCommands method
      if (!extension.addCommands) {
        return commands;
      }

      // Get commands from this extension
      const extensionCommands = extension.addCommands();

      // Merge commands (later extensions overwrite earlier ones via object spread)
      return {
        ...commands,
        ...extensionCommands,
      };
    }, {} as AnyCommands);
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


