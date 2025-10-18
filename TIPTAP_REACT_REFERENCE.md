# Tiptap React Package Reference

## Overview

The `@tiptap/react` package is the React binding for Tiptap - a headless wrapper around ProseMirror for building rich text WYSIWYG editors.

### Why This Package Exists

**The Problem**: ProseMirror is an incredibly powerful but low-level rich text editing framework. It manages its own DOM for performance and doesn't play well with React's virtual DOM by default. Building a React editor with ProseMirror directly is complex:

1. **DOM Conflicts**: React wants to control the DOM, ProseMirror needs to control the DOM
2. **Lifecycle Mismatches**: ProseMirror has its own lifecycle, React has its own
3. **Custom Rendering**: Creating custom nodes/marks requires deep ProseMirror knowledge
4. **State Management**: Syncing ProseMirror state with React state is error-prone
5. **Performance**: Naive integration causes unnecessary re-renders

**The Solution**: `@tiptap/react` bridges these two worlds elegantly:

- **React Portals**: Node views render as React portals, avoiding DOM conflicts
- **Lifecycle Hooks**: `useEditor` manages editor lifecycle with React's useEffect
- **Component API**: Custom nodes/marks are just React components
- **Optimized Updates**: Smart subscription system prevents unnecessary re-renders
- **Developer Experience**: Simple, intuitive API that feels natural to React developers

### Architecture Overview

The package follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│  Developer API Layer                                     │
│  (EditorProvider, useEditor, NodeViewWrapper)           │
├─────────────────────────────────────────────────────────┤
│  React Integration Layer                                 │
│  (ReactRenderer, Context System)                         │
├─────────────────────────────────────────────────────────┤
│  Bridge Layer                                            │
│  (ReactNodeViewRenderer, EditorContent)                  │
├─────────────────────────────────────────────────────────┤
│  ProseMirror Core                                        │
│  (@tiptap/core wrapping ProseMirror)                     │
└─────────────────────────────────────────────────────────┘
```

**Key Design Principles**:

1. **Separation of Concerns**: Editor logic (ProseMirror) stays separate from UI (React)
2. **Declarative API**: React components, not imperative ProseMirror APIs
3. **Performance First**: Minimal re-renders through smart subscriptions
4. **Type Safety**: Full TypeScript support for all APIs
5. **Escape Hatches**: Advanced users can access ProseMirror directly when needed

## Package Structure

### Main Export Files (`/packages/react/src/`)

```
packages/react/
├── src/
│   ├── index.ts                      # Main exports
│   ├── Context.tsx                   # Editor context & provider
│   ├── Editor.ts                     # Editor type definitions
│   ├── EditorContent.tsx             # Main editor component
│   ├── NodeViewContent.tsx           # Node view content wrapper
│   ├── NodeViewWrapper.tsx           # Node view wrapper component
│   ├── ReactMarkViewRenderer.tsx     # Mark view renderer
│   ├── ReactNodeViewRenderer.tsx     # Node view renderer
│   ├── ReactRenderer.tsx             # Base React renderer
│   ├── types.ts                      # Type definitions
│   ├── useEditor.ts                  # Main editor hook
│   ├── useEditorState.ts             # Editor state hook
│   ├── useReactNodeView.ts           # Node view hook
│   └── menus/
│       ├── index.ts
│       ├── BubbleMenu.js             # Floating bubble menu
│       └── FloatingMenu.js           # Floating menu component
├── package.json
├── tsup.config.ts
└── README.md
```

## Key Exports

### From `index.ts`:

```typescript
export * from "./Context.js";
export * from "./EditorContent.js";
export * from "./NodeViewContent.js";
export * from "./NodeViewWrapper.js";
export * from "./ReactMarkViewRenderer.js";
export * from "./ReactNodeViewRenderer.js";
export * from "./ReactRenderer.js";
export * from "./types.js";
export * from "./useEditor.js";
export * from "./useEditorState.js";
export * from "./useReactNodeView.js";
export * from "@tiptap/core";
```

### From `menus/index.ts`:

```typescript
export * from "./BubbleMenu.js";
export * from "./FloatingMenu.js";
```

## Core Components

### 1. EditorContent

**Purpose**: The main React component that renders the ProseMirror editor's DOM into your React application.

**Why it exists**: ProseMirror manages its own DOM structure for optimal performance. EditorContent acts as a bridge between React's virtual DOM and ProseMirror's real DOM, ensuring they can coexist without conflicts. It creates a mounting point where ProseMirror can attach its editor view.

**Why it's needed**:

- Provides a React-friendly interface to mount the ProseMirror editor
- Handles lifecycle management (mounting, updating, unmounting)
- Uses React portals to render node views without breaking ProseMirror's DOM control
- Manages the contentComponent system for dynamic node view rendering
- Prevents React from trying to control ProseMirror's DOM, which would cause conflicts

**How it works**:

- Creates a ref to a div element where ProseMirror attaches
- Initializes the editor's view in componentDidMount
- Uses `useSyncExternalStore` for efficient portal rendering of node views
- Renders all node view components as React portals

```typescript
// Usage
import { EditorContent, useEditor } from "@tiptap/react";

export default () => {
  const editor = useEditor({
    extensions: [
      /* extensions */
    ],
    content: "<p>Hello World</p>",
  });

  return <EditorContent editor={editor} />;
};
```

**Location**: `packages/react/src/EditorContent.tsx`

---

### 2. EditorProvider

**Purpose**: A convenience wrapper that combines editor creation with React Context to make the editor instance available throughout your component tree.

**Why it exists**: When building complex editor UIs with toolbars, menus, and sidebars in separate components, passing the editor prop down through multiple levels becomes cumbersome. EditorProvider solves this by using React Context.

**Why it's needed**:

- Eliminates prop drilling when building complex editor UIs
- Automatically manages editor instance lifecycle
- Provides `useCurrentEditor` hook for accessing editor anywhere in the tree
- Simplifies component architecture for toolbar/menu components
- Handles editor initialization and cleanup automatically

**How it works**:

- Internally uses `useEditor` hook to create the editor
- Wraps children in EditorContext.Provider
- Renders EditorContent automatically
- Provides slots for custom content before/after the editor
- Memoizes context value to prevent unnecessary re-renders

```typescript
// Usage
import { EditorProvider } from "@tiptap/react";

export default () => {
  return (
    <EditorProvider
      extensions={
        [
          /* extensions */
        ]
      }
      content="<p>Hello World</p>"
    >
      {/* Your components can use useCurrentEditor() */}
    </EditorProvider>
  );
};
```

**Location**: `packages/react/src/Context.tsx`

---

### 3. NodeViewWrapper

**Purpose**: A specialized wrapper component that marks a React component as a valid node view container for ProseMirror.

**Why it exists**: ProseMirror expects node views to follow specific DOM conventions. NodeViewWrapper ensures your custom React components meet these requirements by adding necessary data attributes and event handlers.

**Why it's needed**:

- Adds `data-node-view-wrapper` attribute that ReactNodeView expects
- Handles drag-and-drop events properly (onDragStart)
- Sets correct default styling (whiteSpace: 'normal')
- Provides a consistent API for all custom node views
- Prevents React from interfering with ProseMirror's node view system
- Required by ReactNodeView.dom getter for validation

**How it works**:

- Uses `useReactNodeView` hook to access node view context
- Forwards drag events to ProseMirror's drag handler
- Can be rendered as any HTML element via the `as` prop
- Spreads all props to allow full customization
- Automatically applies necessary data attributes

```typescript
// Usage
import { NodeViewWrapper } from "@tiptap/react";

export default (props) => {
  return (
    <NodeViewWrapper className="custom-node">
      {/* Your custom node content */}
    </NodeViewWrapper>
  );
};
```

**Location**: `packages/react/src/NodeViewWrapper.tsx`

---

### 4. NodeViewContent

**Purpose**: Marks where the editable content should be rendered within a custom node view.

**Why it exists**: Many custom nodes need to wrap editable content (like a custom callout box containing paragraphs). NodeViewContent tells ProseMirror exactly where to place the contentDOM - the part of the node that users can edit.

**Why it's needed**:

- Creates the mounting point for ProseMirror's contentDOM
- Adds `data-node-view-content` attribute for ReactNodeView to find
- Preserves whitespace correctly (whiteSpace: 'pre-wrap')
- Allows mixing React UI elements with editable ProseMirror content
- Essential for block-level custom nodes that contain other nodes
- Without it, custom nodes can only display static content

**How it works**:

- Uses `useReactNodeView` hook to access contentDOM reference
- Renders with `data-node-view-content` attribute
- ReactNodeView appends ProseMirror's contentDOM into this element
- Can render as any HTML element via the `as` prop
- Displays children provided via ReactNodeViewContentProvider (for static rendering)

**Important**: You cannot edit the content inside NodeViewContent from React - ProseMirror controls that DOM entirely.

```typescript
// Usage
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  return (
    <NodeViewWrapper className="custom-node">
      <label>Custom Node</label>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};
```

**Location**: `packages/react/src/NodeViewContent.tsx`

## Core Hooks

### 1. useEditor

**Purpose**: The primary hook for creating and managing a Tiptap editor instance within a React component.

**Why it exists**: React components need a way to create editor instances that are properly tied to the component lifecycle. Direct instantiation would leak memory and cause stale closures.

**Why it's needed**:

- Manages editor lifecycle (creation, updates, cleanup)
- Ensures editor is created only once per component mount
- Properly destroys editor on unmount to prevent memory leaks
- Handles dependencies for editor recreation when config changes
- Returns null initially to support SSR (Server-Side Rendering)
- Provides React-friendly API for Tiptap's core Editor class

**How it works**:

- Creates editor instance on first render with provided config
- Uses useEffect to manage editor lifecycle
- Supports `shouldRerenderOnTransaction` for performance tuning
- Re-creates editor when dependencies change
- Integrates with React's concurrent rendering
- Returns editor instance (or null) for use in components

**Key features**:

- Accepts all Editor configuration options
- Optional dependency array for controlled re-creation
- Immediate update mode via `immediatelyRender`
- Proper cleanup on unmount

```typescript
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
  extensions: [StarterKit],
  content: "<p>Hello World</p>",
  onUpdate: ({ editor }) => {
    // Handle updates
  },
});
```

**Location**: `packages/react/src/useEditor.ts`

---

### 2. useEditorState

**Purpose**: A performance-optimized hook for subscribing to specific parts of the editor state.

**Why it exists**: Editor updates can be frequent (on every keystroke). Re-rendering your entire React component tree on each update is wasteful. This hook lets you subscribe only to the state you care about.

**Why it's needed**:

- Prevents unnecessary re-renders of parent components
- Allows fine-grained subscriptions to editor state
- Supports selector functions to derive specific values
- Improves performance in complex editor UIs
- Essential for real-time UI updates (like character count, active marks)
- Decouples UI updates from editor transactions

**How it works**:

- Uses `useSyncExternalStore` for efficient subscriptions
- Accepts a selector function to extract specific state
- Accepts an equality function for custom comparison
- Only triggers re-render when selected state changes
- Handles editor null state gracefully

**Use cases**:

- Character/word counters
- Active formatting indicators (bold, italic)
- Current heading level
- Selection state
- Can-do checks for button states

```typescript
import { useEditorState } from "@tiptap/react";

// Example: Subscribe to character count
const characterCount = useEditorState({
  editor,
  selector: (ctx) => ctx.editor?.storage.characterCount?.characters() ?? 0,
});

// Example: Subscribe to active marks
const isBold = useEditorState({
  editor,
  selector: (ctx) => ctx.editor?.isActive("bold") ?? false,
});
```

**Location**: `packages/react/src/useEditorState.ts`

---

### 3. useReactNodeView

**Purpose**: Provides access to the node view context when building custom React node view components.

**Why it exists**: Custom node views need access to ProseMirror-specific functionality (like drag handlers) and need to coordinate with ReactNodeViewRenderer. This hook exposes that context.

**Why it's needed**:

- Provides `onDragStart` handler for drag-and-drop functionality
- Gives `nodeViewContentRef` to mark where contentDOM should be placed
- Access to `nodeViewContentChildren` for static rendering scenarios
- Enables communication between React components and ProseMirror
- Required by NodeViewWrapper and NodeViewContent
- Maintains proper integration with ProseMirror's node view system

**How it works**:

- Accesses ReactNodeViewContext via useContext
- Context is provided by ReactNodeViewRenderer's component wrapper
- Values are stable references to prevent unnecessary re-renders
- No-op defaults prevent crashes when used outside node view context

**Returned values**:

- `onDragStart`: Function to handle drag events properly
- `nodeViewContentRef`: Callback ref for contentDOM placement
- `nodeViewContentChildren`: React nodes for static rendering

```typescript
import { useReactNodeView } from "@tiptap/react";

export const MyNodeView = () => {
  const { nodeViewContentRef, onDragStart } = useReactNodeView();

  return (
    <div onDragStart={onDragStart}>
      <div ref={nodeViewContentRef} data-node-view-content="" />
    </div>
  );
};
```

**Location**: `packages/react/src/useReactNodeView.ts`

## Renderers

### 1. ReactNodeViewRenderer

**Purpose**: Factory function that creates a ProseMirror node view renderer using React components.

**Why it exists**: ProseMirror's node view system is framework-agnostic and expects vanilla JavaScript. ReactNodeViewRenderer bridges this gap, allowing you to use React components with all their features (hooks, state, context) as node views.

**Why it's needed**:

- Translates ProseMirror's node view API into React component props
- Manages the lifecycle of React components within ProseMirror's DOM
- Handles complex interactions (selection, drag-drop, updates)
- Enables use of React ecosystem (hooks, state management) in node views
- Provides performance optimizations (memoization, selective updates)
- Essential for building rich, interactive custom nodes with React

**How it works**:

1. Returns a function that ProseMirror calls to create node views
2. Instantiates ReactNodeView class for each node instance
3. ReactNodeView creates a ReactRenderer to mount your component
4. Uses React portals to render components in EditorContent
5. Syncs ProseMirror node data with React component props
6. Handles all ProseMirror node view lifecycle methods

**Key Class: ReactNodeView**

- **mount()**: Creates React component, sets up event handlers
- **dom**: Returns the DOM element for ProseMirror to use
- **contentDOM**: Returns where editable content should go
- **update()**: Syncs node changes to React props, calls optional update function
- **selectNode()**: Adds selected styles when node is selected
- **deselectNode()**: Removes selected styles
- **destroy()**: Cleans up React renderer and event handlers

**Advanced features**:

- Optional `update` callback for controlling when node view updates
- Custom `contentDOMElementTag` for the contentDOM wrapper
- `stopEvent` callback for event handling control
- Proper handling of decorations and inner decorations

```typescript
import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MyComponent from "./MyComponent";

export default Node.create({
  name: "customNode",

  addNodeView() {
    return ReactNodeViewRenderer(MyComponent, {
      // Optional: Control updates
      update: ({ oldNode, newNode, updateProps }) => {
        if (oldNode.type !== newNode.type) return false;
        updateProps();
        return true;
      },
    });
  },
});
```

**Location**: `packages/react/src/ReactNodeViewRenderer.tsx`

---

### 2. ReactMarkViewRenderer

**Purpose**: Factory function that creates a ProseMirror mark view renderer using React components.

**Why it exists**: Similar to nodes, marks (inline formatting like bold, italic) can also have custom rendering. ReactMarkViewRenderer allows using React components to render marks, enabling rich interactive inline elements.

**Why it's needed**:

- Extends mark functionality beyond simple HTML wrappers
- Enables interactive marks (e.g., comments with hover UI, interactive links)
- Allows stateful mark rendering (e.g., link preview on hover)
- Provides access to React ecosystem for mark rendering
- Essential for collaborative editing features (user mentions, comments)
- Supports complex mark UI that vanilla DOM can't easily provide

**How it works**:

- Similar to ReactNodeViewRenderer but for marks (inline formatting)
- Creates ReactMarkView instances for each mark range
- Handles mark spanning across multiple DOM nodes
- Syncs mark attributes with React component props
- Uses React portals for rendering mark components
- Properly handles mark merging and splitting

**Use cases**:

- Comment systems with user avatars
- Interactive mentions/tags
- Custom link previews
- Collaborative cursor indicators
- Inline annotations with metadata

```typescript
import { Mark } from "@tiptap/core";
import { ReactMarkViewRenderer } from "@tiptap/react";
import MyMarkComponent from "./MyMarkComponent";

export default Mark.create({
  name: "customMark",

  addMarkView() {
    return ReactMarkViewRenderer(MyMarkComponent);
  },
});
```

**Location**: `packages/react/src/ReactMarkViewRenderer.tsx`

---

### 3. ReactRenderer

**Purpose**: Low-level utility class that handles rendering and lifecycle of any React component outside the normal React tree.

**Why it exists**: Both ReactNodeViewRenderer and ReactMarkViewRenderer need a way to mount React components in ProseMirror's DOM. ReactRenderer provides this foundation, handling the complexity of portal rendering and prop updates.

**Why it's needed**:

- Creates a React root in a specific DOM element
- Manages component lifecycle (mount, update, unmount)
- Handles prop updates efficiently with flushSync for synchronous rendering
- Provides portal-based rendering for EditorContent integration
- Used internally by node/mark view renderers
- Can be used directly for custom rendering scenarios (menus, tooltips)

**How it works**:

- Creates a container element (configurable via `as` prop)
- Uses React 18's createRoot or legacy render methods
- Wraps components with error boundaries
- Updates props synchronously to stay in sync with ProseMirror
- Properly cleans up on unmount
- Detects component type (class, function, forwardRef) for proper ref handling

**Key methods**:

- **updateProps()**: Efficiently updates component props
- **destroy()**: Unmounts component and cleans up

**Internal use**:

- Foundation for ReactNodeView and ReactMarkView
- Handles the React-ProseMirror integration complexity
- Ensures synchronous updates when ProseMirror changes

```typescript
import { ReactRenderer } from "@tiptap/react";

// Direct usage (advanced)
const renderer = new ReactRenderer(MyComponent, {
  editor,
  props: {
    /* component props */
  },
  as: "div",
  className: "custom-class",
});

// Update props
renderer.updateProps({ newProp: "value" });

// Cleanup
renderer.destroy();
```

**Location**: `packages/react/src/ReactRenderer.tsx`

## Type Definitions

### ReactNodeViewProps

**Purpose**: TypeScript type definition for the props automatically passed to React node view components.

**Why it exists**: Node view components receive props from ProseMirror via ReactNodeViewRenderer. This type ensures type safety and provides IntelliSense/autocomplete when building custom node views.

**Why it's needed**:

- Provides type safety for node view component props
- Documents available props for developers
- Enables IDE autocomplete and error checking
- Extends core ProseMirror node view props with React-specific additions
- Prevents runtime errors from incorrect prop access
- Essential for TypeScript-based editor development

**Props included** (from CoreNodeViewProps):

- **editor**: The editor instance
- **node**: The ProseMirror node being rendered
- **decorations**: Decorations applied to this node
- **innerDecorations**: Decorations for the node's content
- **view**: The ProseMirror editor view
- **getPos**: Function returning the node's position in document
- **updateAttributes**: Function to update the node's attributes
- **deleteNode**: Function to delete this node
- **selected**: Boolean indicating if node is selected
- **extension**: The Tiptap extension that created this node
- **HTMLAttributes**: Computed HTML attributes for the node

**React-specific additions**:

- **ref**: React ref object for accessing the DOM element (typed generically)

**Generic type parameter**:

- `T = HTMLElement`: Type of the DOM element, useful for specific element types like HTMLDivElement, HTMLButtonElement, etc.

**Usage in components**:

```typescript
import type { ReactNodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

// Typed component
export const MyNodeView = (props: ReactNodeViewProps) => {
  // props.node - the ProseMirror node
  // props.updateAttributes - update node attrs
  // props.editor - editor instance
  // etc.

  return (
    <NodeViewWrapper>
      <button
        onClick={() =>
          props.updateAttributes({ count: props.node.attrs.count + 1 })
        }
      >
        Clicks: {props.node.attrs.count}
      </button>
    </NodeViewWrapper>
  );
};

// With specific element type
export const MyCustomDiv = (props: ReactNodeViewProps<HTMLDivElement>) => {
  // props.ref is typed as React.RefObject<HTMLDivElement | null>
  return <NodeViewWrapper ref={props.ref}>Content</NodeViewWrapper>;
};
```

```typescript
export type ReactNodeViewProps<T = HTMLElement> = CoreNodeViewProps & {
  ref: React.RefObject<T | null>;
};
```

**Location**: `packages/react/src/types.ts`

## Context System

### EditorContext

**Purpose**: React Context that makes the editor instance accessible throughout your component tree without prop drilling.

**Why it exists**: Complex editor UIs often have many separate components (toolbars, sidebars, floating menus, status bars) that all need access to the same editor instance. Passing the editor as a prop through every intermediate component is tedious and error-prone.

**Why it's needed**:

- Eliminates prop drilling in complex editor UIs
- Enables building modular, reusable editor components
- Allows child components to access editor without coupling to parent
- Powers the EditorProvider convenience wrapper
- Enables `useCurrentEditor` hook for easy editor access
- Essential for building composable editor architectures

**How it works**:

- Created with `createContext` with null editor default
- Provided by EditorProvider component
- Consumed via `useCurrentEditor` hook or EditorConsumer
- Value is memoized to prevent unnecessary re-renders
- Returns `{ editor }` object for consistent API

**Components**:

- **EditorContext**: The context object itself
- **EditorConsumer**: Legacy context consumer component
- **useCurrentEditor**: Hook for accessing editor from context
- **EditorProvider**: Wrapper that provides the context

**Usage pattern**:

```typescript
// Provider (usually at app root or editor wrapper)
<EditorProvider extensions={extensions}>
  <Toolbar />
  <EditorArea />
  <StatusBar />
</EditorProvider>;

// Consumer (in any child component)
function Toolbar() {
  const { editor } = useCurrentEditor();

  return (
    <button onClick={() => editor?.chain().focus().toggleBold().run()}>
      Bold
    </button>
  );
}
```

```typescript
export const EditorContext = createContext<{ editor: Editor | null }>({
  editor: null,
});

export const EditorConsumer = EditorContext.Consumer;
export const useCurrentEditor = () => useContext(EditorContext);
```

**Location**: `packages/react/src/Context.tsx`

---

### ReactNodeViewContext

**Purpose**: Specialized context that provides node view-specific utilities to React components rendered as ProseMirror node views.

**Why it exists**: Node view components need access to ProseMirror-specific functionality (drag handlers, contentDOM refs) that aren't normal React props. This context bridges that gap without polluting the component's prop interface.

**Why it's needed**:

- Provides drag-and-drop integration with ProseMirror
- Supplies contentDOM reference callback for NodeViewContent
- Enables static rendering with ReactNodeViewContentProvider
- Keeps node view infrastructure separate from component logic
- Allows NodeViewWrapper and NodeViewContent to work automatically
- Essential for proper node view functionality

**How it works**:

- Created by ReactNodeView when mounting a component
- Provides onDragStart handler from ProseMirror
- Provides nodeViewContentRef callback for contentDOM placement
- Consumed by useReactNodeView hook
- NodeViewWrapper and NodeViewContent use this internally
- Has safe no-op defaults to prevent crashes

**Context values**:

- **onDragStart**: Forwards drag events to ProseMirror's drag handler
- **nodeViewContentRef**: Callback ref where contentDOM should be inserted
- **nodeViewContentChildren**: React nodes for static rendering scenarios

**Two usage patterns**:

1. **Interactive node views** (in editor): Context provides drag handlers and refs
2. **Static rendering** (outside editor): ReactNodeViewContentProvider supplies content children

```typescript
export interface ReactNodeViewContextProps {
  onDragStart?: (event: DragEvent) => void;
  nodeViewContentRef?: (element: HTMLElement | null) => void;
  nodeViewContentChildren?: ReactNode;
}

export const ReactNodeViewContext = createContext<ReactNodeViewContextProps>({
  onDragStart: () => {},
  nodeViewContentChildren: undefined,
  nodeViewContentRef: () => {},
});

// For interactive node views
export const useReactNodeView = () => useContext(ReactNodeViewContext);

// For static rendering
export const ReactNodeViewContentProvider = ({ children, content }) => {
  return createElement(
    ReactNodeViewContext.Provider,
    { value: { nodeViewContentChildren: content } },
    children
  );
};
```

**Location**: `packages/react/src/useReactNodeView.ts`

## Menu Components

### BubbleMenu

**Purpose**: A floating menu component that appears near selected text, similar to Medium's inline formatting toolbar.

**Why it exists**: Inline formatting UIs are more intuitive and contextual than traditional toolbars. Users can format text without moving their cursor away from their content. This pattern has become standard in modern WYSIWYG editors.

**Why it's needed**:

- Provides contextual formatting options at selection point
- Reduces UI clutter by showing only when relevant
- Follows user's selection for seamless experience
- Better UX than requiring users to look at top toolbar
- Essential for mobile-friendly editor interfaces
- Common pattern in modern text editors (Medium, Notion, Google Docs)

**How it works**:

- Uses Tippy.js underneath for positioning and animations
- Listens to ProseMirror selection changes
- Shows menu when text is selected (or based on `shouldShow` function)
- Positions itself relative to the selection
- Updates position as selection changes
- Hides when selection is cleared or conditions not met
- Uses React portal for rendering outside editor DOM

**Configuration options**:

- **pluginKey**: Unique identifier if using multiple bubble menus
- **editor**: The editor instance (required)
- **shouldShow**: Function to control visibility
- **updateDelay**: Debounce updates for performance
- **tippyOptions**: Full control over Tippy.js behavior (placement, offset, etc.)

**Common use cases**:

- Text formatting (bold, italic, underline)
- Link editing
- Text color/highlight pickers
- Comment/annotation tools
- Quick actions on selected content

```typescript
import { BubbleMenu } from "@tiptap/react";

<BubbleMenu
  editor={editor}
  tippyOptions={{ duration: 100 }}
  shouldShow={({ editor, state, from, to }) => {
    // Custom logic for when to show
    return from !== to && editor.isActive("paragraph");
  }}
>
  <button onClick={() => editor.chain().focus().toggleBold().run()}>
    Bold
  </button>
  <button onClick={() => editor.chain().focus().toggleItalic().run()}>
    Italic
  </button>
</BubbleMenu>;
```

**Location**: `packages/react/src/menus/BubbleMenu.js`

---

### FloatingMenu

**Purpose**: A floating menu that appears when the cursor is on an empty line, providing quick access to insert blocks.

**Why it exists**: Empty lines are perfect opportunities to prompt users for content insertion (images, code blocks, embeds). Notion popularized this pattern with their "/" slash command menu. FloatingMenu provides the positioning infrastructure.

**Why it's needed**:

- Guides users on what they can insert at empty positions
- Reduces learning curve for discovering features
- More discoverable than keyboard shortcuts alone
- Perfect for block-level insertions (images, videos, embeds)
- Complements slash commands or can replace them
- Essential for Notion-like editor experiences

**How it works**:

- Also uses Tippy.js for positioning
- Shows when selection is in an empty node (or based on `shouldShow`)
- Positions itself near the empty line
- Hides when user starts typing or moves cursor
- Uses React portal for rendering
- Can be configured to show in specific scenarios

**Configuration options**:

- **pluginKey**: Unique identifier for multiple floating menus
- **editor**: The editor instance (required)
- **shouldShow**: Custom visibility logic
- **tippyOptions**: Control positioning, animations, etc.

**Common use cases**:

- Block insertion menus (+ button in Notion)
- Slash command results
- Template/snippet pickers
- Quick insert shortcuts
- Content suggestions

**Difference from BubbleMenu**:

- BubbleMenu: Shows on text **selection**
- FloatingMenu: Shows on **empty lines** or specific conditions

```typescript
import { FloatingMenu } from "@tiptap/react";

<FloatingMenu
  editor={editor}
  shouldShow={({ state }) => {
    // Show only on empty paragraphs
    const { $from } = state.selection;
    const isRootDepth = $from.depth === 1;
    const isEmptyParagraph =
      $from.parent.type.name === "paragraph" && $from.parent.content.size === 0;

    return isRootDepth && isEmptyParagraph;
  }}
>
  <button
    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
  >
    H1
  </button>
  <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
    Code
  </button>
</FloatingMenu>;
```

**Location**: `packages/react/src/menus/FloatingMenu.js`

## Build Configuration

### tsup.config.ts

**Purpose**: Configures the build process for the React package using tsup (a TypeScript bundler powered by esbuild).

**Why it exists**: Modern npm packages need to support multiple module formats (ESM, CommonJS) and provide TypeScript definitions. tsup automates this complex build process with minimal configuration.

**Why it's needed**:

- Generates both ESM (import) and CJS (require) bundles for compatibility
- Creates TypeScript declaration files (.d.ts) for type checking
- Generates source maps for debugging
- Ensures proper tree-shaking for optimal bundle sizes
- Handles TypeScript compilation with proper type checking
- Maintains separate entry points for main package and menus
- Keeps external dependencies as peer dependencies (not bundled)

**Configuration breakdown**:

**Two entry points**:

1. `src/index.ts` → Main package exports
2. `src/menus/index.ts` → Menu components (separate import path)

**This allows users to import**:

```typescript
import { useEditor } from "@tiptap/react"; // Main
import { BubbleMenu } from "@tiptap/react/menus"; // Menus
```

**Build options**:

- **entry**: Entry point file(s) to bundle
- **tsconfig**: Uses monorepo's shared build config
- **outDir**: Smart output directory matching source structure
  - `src/index.ts` → `dist/index.js`
  - `src/menus/index.ts` → `dist/menus/index.js`
- **dts**: Generate TypeScript declarations
- **sourcemap**: Generate source maps for debugging
- **format**: ['esm', 'cjs'] - Dual module format support
- **external**: Don't bundle external packages (regex matches node_modules imports)

**Why dual format?**

- **ESM**: Modern bundlers, tree-shaking, future of JavaScript
- **CJS**: Node.js compatibility, older tools, backward compatibility

**Why separate menus entry?**

- Reduces main bundle size (menus are optional)
- Better tree-shaking (users who don't use menus don't load them)
- Clear API separation

```typescript
import { defineConfig } from "tsup";

export default defineConfig(
  ["src/index.ts", "src/menus/index.ts"].map((entry) => ({
    entry: [entry],
    tsconfig: "../../tsconfig.build.json",
    outDir: `dist${entry.replace("src", "").split("/").slice(0, -1).join("/")}`,
    dts: true,
    sourcemap: true,
    format: ["esm", "cjs"],
    external: [/^[^./]/], // Externalize all imports from node_modules
  }))
);
```

**Output structure**:

```
dist/
├── index.js              # ESM bundle
├── index.cjs             # CommonJS bundle
├── index.d.ts            # TypeScript declarations
├── index.js.map          # Source map
├── menus/
│   ├── index.js          # ESM bundle
│   ├── index.cjs         # CommonJS bundle
│   ├── index.d.ts        # TypeScript declarations
│   └── index.js.map      # Source map
```

**Location**: `packages/react/tsup.config.ts`

## Usage Examples

### Basic Editor

```tsx
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World</p>",
  });

  return <EditorContent editor={editor} />;
};
```

### Custom Node View

```tsx
import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

const MyComponent = (props) => {
  return (
    <NodeViewWrapper className="custom-component">
      <button
        onClick={() =>
          props.updateAttributes({ count: props.node.attrs.count + 1 })
        }
      >
        Clicked {props.node.attrs.count} times
      </button>
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: "customNode",

  addAttributes() {
    return {
      count: { default: 0 },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MyComponent);
  },
});
```

### Node View with Editable Content

```tsx
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default () => {
  return (
    <NodeViewWrapper className="custom-node">
      <label contentEditable={false}>Custom Node</label>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};
```

### Using Context

```tsx
import { EditorProvider, useCurrentEditor } from "@tiptap/react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <div>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
    </div>
  );
};

export default () => {
  return (
    <EditorProvider extensions={[StarterKit]}>
      <MenuBar />
    </EditorProvider>
  );
};
```

## Dependencies

- `@tiptap/core` - Core Tiptap functionality
- `react` - React library
- `react-dom` - React DOM rendering
- `use-sync-external-store` - React hook for external store sync

## Links

- GitHub: https://github.com/ueberdosis/tiptap
- Package: `@tiptap/react`
- Documentation: https://tiptap.dev
- License: MIT
