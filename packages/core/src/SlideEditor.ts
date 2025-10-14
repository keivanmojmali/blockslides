import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { schema } from './schema';
import { Extension } from './Extension';
import { ExtensionManager } from './ExtensionManager';
import { applyAllLayouts } from './utils/layoutParser';
import { createCommands } from './commands';
import { createMarkdownInputRules } from './plugins/markdownInputRules';
import type { DocNode, Commands } from './types';

/**
 * SlideEditor Options
 * 
 * Configuration options for the SlideEditor.
 * Supports both extensions (high-level) and raw plugins (low-level escape hatch).
 */
export interface SlideEditorOptions {
  // Content (required)
  content: DocNode;
  onChange?: (content: DocNode) => void;
  
  // Appearance
  editorTheme?: 'light' | 'dark';
  editorMode?: 'edit' | 'preview' | 'present';
  readOnly?: boolean;
  
  // Slide navigation
  currentSlide?: number;
  onSlideChange?: (slideIndex: number) => void;
  
  // History
  historyDepth?: number;
  newGroupDelay?: number;
  
  // Callbacks
  onCreate?: (editor: SlideEditor) => void;
  onDestroy?: () => void;
  onUpdate?: (params: any) => void;
  onContentChange?: (params: any) => void;
  onSelectionUpdate?: (params: any) => void;
  onFocus?: (params: any) => void;
  onBlur?: (params: any) => void;
  onTransaction?: (params: any) => void;
  onUndo?: (params: any) => void;
  onRedo?: (params: any) => void;
  onError?: (error: Error) => void;
  
  // Validation
  validationMode?: 'off' | 'lenient' | 'strict';
  autoFixContent?: boolean;
  onValidationError?: (result: any) => void;
  
  // Features
  enableMarkdown?: boolean;  // Enable markdown input rules (default: true)
  
  // Extensibility (BOTH patterns supported)
  extensions?: Extension[];  // High-level (recommended, TipTap-style)
  plugins?: Plugin[];        // Low-level (escape hatch for advanced users)
}

/**
 * SlideEditor
 * 
 * Main editor class for AutoArtifacts.
 * Follows TipTap's architecture:
 * - Creates plugins once in constructor
 * - Supports extensions (high-level) and raw plugins (low-level)
 * - Provides mount/unmount lifecycle
 */
export class SlideEditor {
  private options: SlideEditorOptions;
  public view: EditorView | null = null;
  private extensionManager: ExtensionManager | null = null;
  private plugins: Plugin[] = [];
  private mounted = false;
  public commands: Commands;
  
  constructor(options: SlideEditorOptions) {
    this.options = {
      editorTheme: 'light',
      editorMode: 'edit',
      readOnly: false,
      currentSlide: 0,
      historyDepth: 100,
      newGroupDelay: 500,
      validationMode: 'lenient',
      autoFixContent: false,
      ...options,
    };
    
    // Create extension manager if extensions provided
    if (this.options.extensions && this.options.extensions.length > 0) {
      this.extensionManager = new ExtensionManager(this.options.extensions, this);
    }
    
    // Create plugins once in constructor (fixes duplicate plugin error)
    this.plugins = this.createPlugins();
    
    // Initialize commands API - provide a getter for the view
    this.commands = createCommands(() => this.view);
  }
  
  /**
   * Create all plugins (core + extensions + raw)
   * This is called once in the constructor
   */
  private createPlugins(): Plugin[] {
    // 1. Core ProseMirror plugins (always included)
    const corePlugins: Plugin[] = [
      history({
        depth: this.options.historyDepth,
        newGroupDelay: this.options.newGroupDelay,
      }),
    ];
    
    // Add markdown input rules if enabled (default: true)
    if (this.options.enableMarkdown !== false) {
      corePlugins.push(createMarkdownInputRules(schema));
    }
    
    corePlugins.push(
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
      }),
      keymap(baseKeymap)
    );
    
    // 2. Extension plugins (from user-provided extensions)
    const extensionPlugins = this.extensionManager?.getPlugins() || [];
    
    // 3. Raw plugins (escape hatch for advanced users)
    const rawPlugins = this.options.plugins || [];
    
    // Combine all plugins
    const allPlugins = [...corePlugins, ...extensionPlugins, ...rawPlugins];
    
    // 4. DEDUPLICATE: Filter out plugins with duplicate keys
    // ProseMirror identifies plugins by their PluginKey - keep only the first instance
    const seenKeys = new Set<any>();
    const uniquePlugins = allPlugins.filter(plugin => {
      const key = (plugin as any).key;
      if (!key) return true; // Keep plugins without keys (they're not tracked)
      
      if (seenKeys.has(key)) {
        console.warn(`[AutoArtifacts] Skipping duplicate plugin with key: ${key}`);
        return false; // Skip duplicate
      }
      
      seenKeys.add(key);
      return true; // Keep first instance
    });
    
    return uniquePlugins;
  }
  
  /**
   * Mount the editor to a DOM element
   */
  public mount(element: HTMLElement): void {
    if (this.mounted) {
      console.warn('[AutoArtifacts] Editor already mounted');
      return;
    }
    
    try {
      // TODO: Add validation logic here if needed
      const contentToUse = this.options.content;
      
      // Create ProseMirror state
      const state = EditorState.create({
        doc: schema.nodeFromJSON(contentToUse),
        schema,
        plugins: this.plugins, // Use plugins created in constructor
      });
      
      // Create ProseMirror view
      this.view = new EditorView(element, {
        state,
        editable: () => this.options.editorMode === 'edit' && !this.options.readOnly,
        dispatchTransaction: this.dispatchTransaction.bind(this),
        
        // Handle focus/blur events
        handleDOMEvents: {
          focus: (_view, event) => {
            if (this.options.onFocus) {
              this.options.onFocus({
                editor: this,
                event: event as FocusEvent
              });
            }
            return false;
          },
          
          blur: (_view, event) => {
            if (this.options.onBlur) {
              this.options.onBlur({
                editor: this,
                event: event as FocusEvent
              });
            }
            return false;
          }
        }
      });
      
      this.mounted = true;
      
      // Post-mount setup
      setTimeout(() => {
        applyAllLayouts(element);
        
        // Fire onCreate callback
        if (this.options.onCreate) {
          this.options.onCreate(this);
        }
        
        // Fire extension onCreate hooks
        this.extensionManager?.onCreate();
      }, 0);
      
    } catch (error) {
      if (this.options.onError && error instanceof Error) {
        this.options.onError(error);
      } else {
        console.error('[AutoArtifacts] Error mounting editor:', error);
      }
    }
  }
  
  /**
   * Unmount the editor from the DOM
   */
  public unmount(): void {
    if (!this.mounted) return;
    
    // Fire onDestroy callback
    if (this.options.onDestroy) {
      this.options.onDestroy();
    }
    
    // Fire extension onDestroy hooks
    this.extensionManager?.onDestroy();
    
    // Destroy ProseMirror view
    this.view?.destroy();
    this.view = null;
    this.mounted = false;
  }
  
  /**
   * Handle ProseMirror transactions
   */
  private dispatchTransaction(transaction: Transaction): void {
    if (!this.view) return;
    
    const oldState = this.view.state;
    const newState = this.view.state.apply(transaction);
    this.view.updateState(newState);
    
    // Fire onTransaction callback
    if (this.options.onTransaction) {
      this.options.onTransaction({ editor: this, transaction });
    }
    
    // Handle document changes
    if (transaction.docChanged) {
      const newContent = newState.doc.toJSON();
      
      if (this.options.onUpdate) {
        this.options.onUpdate({ editor: this, transaction });
      }
      
      if (this.options.onChange) {
        this.options.onChange(newContent as DocNode);
      }
      
      if (this.options.onContentChange) {
        this.options.onContentChange({ editor: this, content: newContent });
      }
    }
    
    // Handle selection changes
    if (!oldState.selection.eq(newState.selection)) {
      if (this.options.onSelectionUpdate) {
        this.options.onSelectionUpdate({ editor: this, selection: newState.selection });
      }
    }
    
    // Handle undo/redo
    const historyMeta = transaction.getMeta('history$');
    if (historyMeta) {
      if (historyMeta.undo && this.options.onUndo) {
        this.options.onUndo({ editor: this });
      } else if (historyMeta.redo && this.options.onRedo) {
        this.options.onRedo({ editor: this });
      }
    }
  }
  
  // Public API
  
  /**
   * Get the ProseMirror EditorView
   */
  public get editorView(): EditorView | null {
    return this.view;
  }
  
  /**
   * Get document as JSON
   */
  public getJSON(): DocNode {
    return this.view?.state.doc.toJSON() as DocNode || { type: 'doc', content: [] };
  }
  
  /**
   * Set document content
   */
  public setContent(content: DocNode): void {
    if (!this.view) return;
    
    const newState = EditorState.create({
      doc: schema.nodeFromJSON(content),
      schema,
      plugins: this.view.state.plugins,
    });
    
    this.view.updateState(newState);
  }
  
  /**
   * Set editable state
   */
  public setEditable(editable: boolean): void {
    if (!this.view) return;
    this.view.setProps({ editable: () => editable });
  }
  
  /**
   * Destroy the editor
   */
  public destroy(): void {
    this.unmount();
  }
}


