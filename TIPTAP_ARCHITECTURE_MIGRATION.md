# TipTap-Style Architecture Migration Plan

## Goal
Restructure AutoArtifacts to match TipTap's architecture exactly:
- **Core package**: Editor class + Extension system (no built-in extensions)
- **Separate extension packages**: Each feature as its own package
- **React package**: useSlideEditor hook (like TipTap's useEditor)

## TipTap Architecture Analysis

### TipTap's Structure
```
@tiptap/core/
├── Editor.ts               # Main editor class
├── Extension.ts            # Base extension class
├── ExtensionManager.ts     # Manages extensions
├── extensions/             # Core framework extensions only
│   ├── Commands.ts         # Command system
│   ├── Editable.ts         # Editability
│   └── FocusEvents.ts      # Focus handling
└── ...

@tiptap/react/
└── useEditor.ts            # React hook wrapping Editor

@tiptap/extension-bold/     # Separate package
@tiptap/extension-italic/   # Separate package
@tiptap-pro/extension-ai/   # Separate package
```

### What We'll Build
```
@autoartifacts/core/
├── SlideEditor.ts          # Main editor class (like TipTap's Editor)
├── Extension.ts            # Base extension class
├── ExtensionManager.ts     # Manages extensions
└── extensions/             # Core framework extensions ONLY
    └── (empty for now - no required extensions)

@autoartifacts/react/
└── useSlideEditor.ts       # React hook wrapping SlideEditor

@autoartifacts/extension-placeholder/      # NEW separate package
@autoartifacts/extension-add-slide-button/ # NEW separate package
@autoartifacts/extension-layout-picker/    # Convert existing plugin package
```

## Key Architecture Principles

1. **Core = Framework only** (Editor, Extension system, NO features)
2. **Extensions = Separate packages** (like TipTap's extension-*)
3. **Support both patterns**:
   - Extensions (high-level, recommended)
   - Raw plugins (low-level escape hatch)

## Implementation Plan

### Phase 1: Core Package - Editor Infrastructure

#### 1.1 Create Extension Base Class
**File**: `packages/core/src/Extension.ts`

```typescript
import type { Plugin } from 'prosemirror-state';
import type { SlideEditor } from './SlideEditor';

export abstract class Extension<TOptions = any> {
  public name: string;
  public options: TOptions;
  public priority: number;
  
  constructor(options: TOptions = {} as TOptions) {
    this.options = options;
    this.name = this.constructor.name;
    this.priority = 100;
  }
  
  // Extensions provide ProseMirror plugins
  public plugins(editor: SlideEditor): Plugin[] {
    return [];
  }
  
  // Lifecycle hooks
  public onCreate?(editor: SlideEditor): void;
  public onDestroy?(editor: SlideEditor): void;
  
  // TipTap-style configure method
  public static configure<T extends Extension>(
    this: new (options?: any) => T,
    options?: any
  ): T {
    return new this(options);
  }
}
```

#### 1.2 Create ExtensionManager
**File**: `packages/core/src/ExtensionManager.ts`

```typescript
import type { Plugin } from 'prosemirror-state';
import type { Extension } from './Extension';
import type { SlideEditor } from './SlideEditor';

export class ExtensionManager {
  private extensions: Extension[];
  private editor: SlideEditor;
  
  constructor(extensions: Extension[], editor: SlideEditor) {
    this.extensions = extensions.sort((a, b) => b.priority - a.priority);
    this.editor = editor;
  }
  
  public getPlugins(): Plugin[] {
    return this.extensions.flatMap(ext => ext.plugins(this.editor));
  }
  
  public onCreate(): void {
    this.extensions.forEach(ext => ext.onCreate?.(this.editor));
  }
  
  public onDestroy(): void {
    this.extensions.forEach(ext => ext.onDestroy?.(this.editor));
  }
}
```

#### 1.3 Create SlideEditor Class
**File**: `packages/core/src/SlideEditor.ts`

```typescript
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
import type { DocNode } from './types';

export interface SlideEditorOptions {
  content: DocNode;
  onChange?: (content: DocNode) => void;
  
  // Appearance
  editorTheme?: 'light' | 'dark';
  editorMode?: 'edit' | 'preview' | 'present';
  readOnly?: boolean;
  
  // History
  historyDepth?: number;
  newGroupDelay?: number;
  
  // Callbacks
  onCreate?: (editor: SlideEditor) => void;
  onDestroy?: () => void;
  onUpdate?: (params: any) => void;
  onError?: (error: Error) => void;
  
  // Extensibility (BOTH patterns supported)
  extensions?: Extension[];  // High-level (TipTap-style)
  plugins?: Plugin[];        // Low-level (escape hatch)
}

export class SlideEditor {
  private options: SlideEditorOptions;
  public view: EditorView | null = null;
  private extensionManager: ExtensionManager | null = null;
  private plugins: Plugin[] = [];
  private mounted = false;
  
  constructor(options: SlideEditorOptions) {
    this.options = {
      editorTheme: 'light',
      editorMode: 'edit',
      readOnly: false,
      historyDepth: 100,
      newGroupDelay: 500,
      ...options,
    };
    
    // Create extension manager if extensions provided
    if (this.options.extensions && this.options.extensions.length > 0) {
      this.extensionManager = new ExtensionManager(this.options.extensions, this);
    }
    
    // Create plugins once
    this.plugins = this.createPlugins();
  }
  
  private createPlugins(): Plugin[] {
    // 1. Core ProseMirror plugins (always included)
    const corePlugins: Plugin[] = [
      history({
        depth: this.options.historyDepth,
        newGroupDelay: this.options.newGroupDelay,
      }),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
      }),
      keymap(baseKeymap),
    ];
    
    // 2. Extension plugins (from user-provided extensions)
    const extensionPlugins = this.extensionManager?.getPlugins() || [];
    
    // 3. Raw plugins (escape hatch for advanced users)
    const rawPlugins = this.options.plugins || [];
    
    return [...corePlugins, ...extensionPlugins, ...rawPlugins];
  }
  
  public mount(element: HTMLElement): void {
    if (this.mounted) {
      console.warn('[AutoArtifacts] Editor already mounted');
      return;
    }
    
    try {
      const state = EditorState.create({
        doc: schema.nodeFromJSON(this.options.content),
        schema,
        plugins: this.plugins,
      });
      
      this.view = new EditorView(element, {
        state,
        editable: () => this.options.editorMode === 'edit' && !this.options.readOnly,
        dispatchTransaction: this.dispatchTransaction.bind(this),
      });
      
      this.mounted = true;
      
      setTimeout(() => {
        applyAllLayouts(element);
        
        if (this.options.onCreate) {
          this.options.onCreate(this);
        }
        
        this.extensionManager?.onCreate();
      }, 0);
      
    } catch (error) {
      if (this.options.onError && error instanceof Error) {
        this.options.onError(error);
      }
    }
  }
  
  public unmount(): void {
    if (!this.mounted) return;
    
    if (this.options.onDestroy) {
      this.options.onDestroy();
    }
    
    this.extensionManager?.onDestroy();
    this.view?.destroy();
    this.view = null;
    this.mounted = false;
  }
  
  private dispatchTransaction(transaction: Transaction): void {
    if (!this.view) return;
    
    const newState = this.view.state.apply(transaction);
    this.view.updateState(newState);
    
    if (transaction.docChanged) {
      const newContent = newState.doc.toJSON();
      
      if (this.options.onUpdate) {
        this.options.onUpdate({ editor: this, transaction });
      }
      
      if (this.options.onChange) {
        this.options.onChange(newContent as DocNode);
      }
    }
  }
  
  // Public API
  public get editorView(): EditorView | null {
    return this.view;
  }
  
  public getJSON(): DocNode {
    return this.view?.state.doc.toJSON() as DocNode || { type: 'doc', content: [] };
  }
  
  public setContent(content: DocNode): void {
    if (!this.view) return;
    
    const newState = EditorState.create({
      doc: schema.nodeFromJSON(content),
      schema,
      plugins: this.view.state.plugins,
    });
    
    this.view.updateState(newState);
  }
  
  public destroy(): void {
    this.unmount();
  }
}
```

#### 1.4 Update Core Exports
**File**: `packages/core/src/index.ts`

```typescript
// Editor
export { SlideEditor } from './SlideEditor';
export type { SlideEditorOptions } from './SlideEditor';

// Extension system
export { Extension } from './Extension';
export { ExtensionManager } from './ExtensionManager';

// Schema, commands, utils (keep existing)
export { schema } from './schema';
export * from './commands';
export * from './utils';
export * from './types';
export * from './validation';
```

#### 1.5 Delete Old Plugin Factories
- Delete `packages/core/src/plugins/placeholderPlugin.ts`
- Delete `packages/core/src/plugins/addSlideButtonPlugin.ts`
- Update or delete `packages/core/src/plugins/index.ts`

### Phase 2: React Package - TipTap-Style Hook

#### 2.1 Create useSlideEditor Hook
**File**: `packages/react/src/hooks/useSlideEditor.ts`

```typescript
import { useEffect, useState, useRef } from 'react';
import { SlideEditor, SlideEditorOptions } from '@autoartifacts/core';

export function useSlideEditor(
  options: SlideEditorOptions,
  deps: React.DependencyList = []
) {
  const [editor, setEditor] = useState<SlideEditor | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<SlideEditor | null>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    // Destroy previous
    if (editorRef.current) {
      editorRef.current.destroy();
    }
    
    // Create new
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
```

#### 2.2 Simplify React Component
**File**: `packages/react/src/components/SlideEditor.tsx`

```typescript
import React, { forwardRef, useImperativeHandle } from 'react';
import { useSlideEditor } from '../hooks/useSlideEditor';
import type { SlideEditorOptions } from '@autoartifacts/core';
import '@autoartifacts/styles';

export interface SlideEditorProps extends SlideEditorOptions {
  className?: string;
}

export const SlideEditor = forwardRef<any, SlideEditorProps>(
  ({ className, ...options }, ref) => {
    const { editor, ref: editorRef } = useSlideEditor(options, [
      options.content,
      options.extensions,
      options.plugins,
    ]);
    
    useImperativeHandle(ref, () => editor, [editor]);
    
    const editorClassName = [
      'autoartifacts-editor',
      `theme-${options.editorTheme || 'light'}`,
      `mode-${options.editorMode || 'edit'}`,
      className,
    ].filter(Boolean).join(' ');
    
    return <div ref={editorRef} className={editorClassName} />;
  }
);

SlideEditor.displayName = 'SlideEditor';
```

### Phase 3: Convert Plugins to Extension Packages

#### 3.1 Create Placeholder Extension Package

**New package**: `packages/extensions/placeholder/`

**File**: `packages/extensions/placeholder/package.json`
```json
{
  "name": "@autoartifacts/extension-placeholder",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "dependencies": {
    "@autoartifacts/core": "workspace:*",
    "prosemirror-state": "^1.4.3",
    "prosemirror-view": "^1.41.2"
  }
}
```

**File**: `packages/extensions/placeholder/src/index.ts`
```typescript
import { Extension } from '@autoartifacts/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { SlideEditor } from '@autoartifacts/core';

const placeholderPluginKey = new PluginKey('placeholder');

export class PlaceholderExtension extends Extension {
  public name = 'placeholder';
  public priority = 50;
  
  plugins(editor: SlideEditor): Plugin[] {
    return [
      new Plugin({
        key: placeholderPluginKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            
            state.doc.descendants((node, pos) => {
              if (!node.attrs.placeholder) return;
              
              const isEmpty = node.content.size === 0 || 
                (node.textContent === '' && node.content.size <= 1);
              
              if (isEmpty) {
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    class: 'has-placeholder',
                    'data-placeholder-text': node.attrs.placeholder
                  })
                );
              }
            });
            
            return DecorationSet.create(state.doc, decorations);
          }
        }
      })
    ];
  }
}
```

#### 3.2 Create AddSlideButton Extension Package

**New package**: `packages/extensions/add-slide-button/`

**File**: `packages/extensions/add-slide-button/package.json`
```json
{
  "name": "@autoartifacts/extension-add-slide-button",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "dependencies": {
    "@autoartifacts/core": "workspace:*",
    "prosemirror-state": "^1.4.3",
    "prosemirror-view": "^1.41.2"
  }
}
```

**File**: `packages/extensions/add-slide-button/src/index.ts`
```typescript
import { Extension } from '@autoartifacts/core';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { SlideEditor } from '@autoartifacts/core';

export interface AddSlideButtonOptions {
  className?: string;
  style?: any;
  content?: string;
  onClick?: (params: { slideIndex: number; buttonElement: HTMLElement; event: MouseEvent }) => void;
}

export class AddSlideButtonExtension extends Extension<AddSlideButtonOptions> {
  public name = 'addSlideButton';
  public priority = 50;
  
  constructor(options: AddSlideButtonOptions = {}) {
    super(options);
  }
  
  plugins(editor: SlideEditor): Plugin[] {
    const options = this.options;
    
    return [
      new Plugin({
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            
            state.doc.forEach((node, offset) => {
              if (node.type.name === 'slide') {
                const pos = offset + node.nodeSize;
                
                decorations.push(
                  Decoration.widget(pos, () => {
                    const button = document.createElement('button');
                    button.className = options.className || 'autoartifacts-add-slide-btn';
                    button.innerHTML = options.content || '+';
                    
                    if (options.style) {
                      Object.assign(button.style, options.style);
                    }
                    
                    button.onclick = (event) => {
                      event.preventDefault();
                      
                      if (options.onClick) {
                        // User custom handler
                        const slideIndex = getSlideIndexFromPos(state, offset);
                        options.onClick({ slideIndex, buttonElement: button, event });
                      } else {
                        // Default: add slide
                        const view = editor.editorView;
                        if (view) {
                          const tr = view.state.tr;
                          const slideType = view.state.schema.nodes.slide;
                          tr.insert(pos, slideType.create());
                          view.dispatch(tr);
                        }
                      }
                    };
                    
                    return button;
                  }, { side: 1 })
                );
              }
            });
            
            return DecorationSet.create(state.doc, decorations);
          }
        }
      })
    ];
  }
}

function getSlideIndexFromPos(state: any, pos: number) {
  let index = 0;
  state.doc.forEach((node: any, offset: number) => {
    if (node.type.name === 'slide' && offset <= pos) index++;
  });
  return index - 1;
}
```

#### 3.3 Convert Layout Picker to Extension

**Update**: `packages/plugins/layout-picker/` → `packages/extensions/layout-picker/`

**File**: `packages/extensions/layout-picker/src/index.ts`
```typescript
import { Extension } from '@autoartifacts/core';
import { Plugin } from 'prosemirror-state';
import type { SlideEditor } from '@autoartifacts/core';

export interface LayoutPickerOptions {
  layouts: Layout[];
  placeholderHeader?: string;
  subtitle?: string;
}

export class LayoutPickerExtension extends Extension<LayoutPickerOptions> {
  public name = 'layoutPicker';
  
  constructor(options: LayoutPickerOptions) {
    super(options);
  }
  
  plugins(editor: SlideEditor): Plugin[] {
    // Move existing plugin logic here
    return [/* ... */];
  }
}

// DEPRECATED: Keep for backward compatibility
export function createLayoutPickerPlugin(options: LayoutPickerOptions) {
  console.warn('createLayoutPickerPlugin is deprecated. Use LayoutPickerExtension.configure() instead.');
  return LayoutPickerExtension.configure(options).plugins(null as any)[0];
}
```

### Phase 4: Update Demo

**File**: `demo/src/demo/SlidePage.tsx`

```typescript
import React, { useState } from 'react';
import { SlideEditor } from '@autoartifacts/react';
import { PlaceholderExtension } from '@autoartifacts/extension-placeholder';
import { AddSlideButtonExtension } from '@autoartifacts/extension-add-slide-button';
import { LayoutPickerExtension } from '@autoartifacts/extension-layout-picker';
import type { DocNode } from '@autoartifacts/core';
import { sampleContent, DEFAULT_LAYOUTS } from './sampleContent';

const SlidePage: React.FC = () => {
  const [content, setContent] = useState<DocNode>(sampleContent);
  
  return (
    <div className="slide-page">
      <SlideEditor
        content={content}
        onChange={setContent}
        editorMode="edit"
        editorTheme="light"
        extensions={[
          PlaceholderExtension.configure(),
          AddSlideButtonExtension.configure({
            className: 'my-add-btn',
            content: '+'
          }),
          LayoutPickerExtension.configure({
            layouts: DEFAULT_LAYOUTS,
            placeholderHeader: 'New Slide',
          })
        ]}
      />
    </div>
  );
};
```

### Phase 5: Update Workspace Configuration

**File**: `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
  - 'packages/extensions/*'  # NEW
  - 'demo'
```

**File**: `package.json` (root)
- Update to include new extension packages in scripts

## Usage Examples

### Basic Usage (No Extensions)
```typescript
import { SlideEditor } from '@autoartifacts/react';

<SlideEditor 
  content={content}
  onChange={setContent}
/>
```

### With Extensions (TipTap-style)
```typescript
import { SlideEditor } from '@autoartifacts/react';
import { PlaceholderExtension } from '@autoartifacts/extension-placeholder';
import { AddSlideButtonExtension } from '@autoartifacts/extension-add-slide-button';

<SlideEditor
  content={content}
  onChange={setContent}
  extensions={[
    PlaceholderExtension.configure(),
    AddSlideButtonExtension.configure({ className: 'my-btn' })
  ]}
/>
```

### With Raw Plugins (Escape Hatch)
```typescript
import { Plugin } from 'prosemirror-state';

const myPlugin = new Plugin({ /* ... */ });

<SlideEditor
  content={content}
  plugins={[myPlugin]}
/>
```

### Mixed (Both Extensions and Plugins)
```typescript
<SlideEditor
  content={content}
  extensions={[PlaceholderExtension.configure()]}
  plugins={[myRawPlugin]}
/>
```

## Package Structure After Migration

```
@autoartifacts/
├── core/                           # Editor framework
│   ├── SlideEditor.ts
│   ├── Extension.ts
│   └── ExtensionManager.ts
│
├── react/                          # React integration
│   ├── useSlideEditor.ts
│   └── SlideEditor.tsx
│
├── extension-placeholder/          # Separate extension
├── extension-add-slide-button/     # Separate extension
├── extension-layout-picker/        # Separate extension
│
└── styles/                         # Shared styles
```

## Breaking Changes

1. **Removed factory functions**: `createPlaceholderPlugin()` deleted
2. **New extension packages**: Must install separately
3. **No default extensions**: Must explicitly add extensions you want
4. **API change**: `defaultContent` → `content`

## Migration Guide

**Before:**
```typescript
import { createLayoutPickerPlugin } from '@autoartifacts/plugin-layout-picker';

<SlideEditor 
  defaultContent={content}
  plugins={[createLayoutPickerPlugin(...)]}
/>
```

**After:**
```typescript
import { LayoutPickerExtension } from '@autoartifacts/extension-layout-picker';

<SlideEditor
  content={content}
  extensions={[LayoutPickerExtension.configure(...)]}
/>
```

## Benefits

1. **Matches TipTap exactly** - Industry-standard architecture
2. **Modular** - Install only extensions you need
3. **Extensible** - Easy to create custom extensions
4. **Flexible** - Support both extensions and raw plugins
5. **Clean separation** - Core = framework, extensions = features


