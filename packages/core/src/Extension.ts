import type { Plugin } from 'prosemirror-state';
import type { SlideEditor } from './SlideEditor';

/**
 * Base Extension class for AutoArtifacts
 * 
 * Extensions are high-level abstractions that can provide:
 * - ProseMirror plugins
 * - Lifecycle hooks (onCreate, onDestroy)
 * - Configuration options
 * 
 * This follows the TipTap extension pattern.
 */
export abstract class Extension<TOptions = any> {
  public name: string;
  public options: TOptions;
  public priority: number;
  
  constructor(options: TOptions = {} as TOptions) {
    this.options = options;
    this.name = this.constructor.name;
    this.priority = 100;
  }
  
  /**
   * Return ProseMirror plugins that this extension provides
   * Override this method to provide custom plugins
   */
  public plugins(_editor: SlideEditor): Plugin[] {
    return [];
  }
  
  /**
   * Called when the editor is created
   * Override this method to run initialization logic
   */
  public onCreate?(editor: SlideEditor): void;
  
  /**
   * Called when the editor is destroyed
   * Override this method to run cleanup logic
   */
  public onDestroy?(editor: SlideEditor): void;
  
  /**
   * TipTap-style configure method
   * Returns a new instance with the provided options
   */
  public static configure<T extends Extension>(
    this: new (options?: any) => T,
    options?: any
  ): T {
    return new this(options);
  }
}


