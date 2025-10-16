# Command Manager Implementation Plan

## Executive Summary

**Goal:** Add a CommandManager to enable extensible commands while maintaining type safety and testability.

**Key Insight:** Tiptap doesn't have two systems - they define ALL commands (including bold, italic, etc.) through extensions using `addCommands()`. We currently have hardcoded commands; we'll migrate them to use the same extension system.

---

## 1. Understanding the Current vs Target Architecture

### Current Architecture (Ours)

```
SlideEditor constructor
  → createCommands(() => view)
    → Returns hardcoded Commands object
      → { toggleBold, addSlide, etc. }
  → editor.commands = hardcodedCommands

Extensions
  → Can add plugins only
  → CANNOT add commands
```

### Tiptap's Architecture (Target)

```
Editor constructor
  → ExtensionManager collects extensions
    → Extension.addCommands() for EACH extension
      → Bold extension adds .toggleBold()
      → Italic extension adds .toggleItalic()
      → CustomExtension adds .customCommand()
  → CommandManager wraps all commands
    → Provides .commands (direct execution)
    → Provides .chain() (chained execution)
    → Provides .can() (dry-run testing)
  → editor.commands = CommandManager.commands
```

**Key Point:** Tiptap's "preset" commands like `toggleBold` come from the Bold **extension**, not hardcoded. Every command flows through the same system.

---

## 2. Why This Change?

### Problem Statement

Users cannot add custom commands to `editor.commands.*` because:

1. Commands are hardcoded in `commands/index.ts`
2. Extensions have no `addCommands()` method
3. ExtensionManager doesn't collect commands
4. No mechanism to merge extension commands

### Benefits of CommandManager

1. **Extensibility:** Users can add custom commands via extensions
2. **Consistency:** All commands (core + custom) use same system
3. **Dry-run testing:** `editor.can().command()` checks without executing
4. **Better DX:** Matches Tiptap API, easier for developers familiar with it
5. **Type safety:** Proper TypeScript types for command context

---

## 3. Implementation Plan

### Phase 1: Foundation (Types & Interfaces)

**Goal:** Set up TypeScript types and interfaces without breaking existing code.

#### Step 1.1: Define Command Types

**File:** `packages/core/src/types/commands.ts` (new file)

**What to add:**

```typescript
import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { SlideEditor } from "../SlideEditor";

/**
 * Props passed to every command function
 */
export interface CommandProps {
  editor: SlideEditor;
  state: EditorState;
  view: EditorView;
  tr: Transaction;
  dispatch?: (tr: Transaction) => void;
  commands: SingleCommands;
  chain: () => ChainedCommands;
  can: () => CanCommands;
}

/**
 * A raw command function that receives CommandProps and returns success/failure
 */
export type RawCommand = (...args: any[]) => (props: CommandProps) => boolean;

/**
 * Object containing raw command definitions (from extensions)
 * Used in Extension.addCommands() and ExtensionManager.getCommands()
 */
export type AnyCommands = Record<string, RawCommand>;

/**
 * Commands that execute immediately and return boolean
 */
export type SingleCommands = Record<string, (...args: any[]) => boolean>;

/**
 * Commands that can be chained and executed later with .run()
 */
export type ChainedCommands = Record<
  string,
  (...args: any[]) => ChainedCommands
> & {
  run: () => boolean;
};

/**
 * Commands for dry-run testing (no dispatch)
 */
export type CanCommands = Record<string, (...args: any[]) => boolean> & {
  chain: () => ChainedCommands;
};
```

**Why:**

- Centralizes all command-related types
- Enables type-safe command definitions
- Used by Extension, ExtensionManager, and CommandManager
- `AnyCommands` is the key type imported by Extension and ExtensionManager
- Provides autocomplete and type checking for users

---

### Phase 2: Extension System Updates

**Goal:** Enable extensions to define commands.

#### Step 2.1: Update Extension Base Class

**File:** `packages/core/src/Extension.ts`

**What to add:**

```typescript
import type { AnyCommands } from "./types/commands";

export abstract class Extension<TOptions = any> {
  // ... existing properties and methods

  /**
   * Add commands that this extension provides
   * Commands will be merged into editor.commands
   */
  public addCommands?(): AnyCommands;
}
```

**Why:**

- Extensions can now define commands
- Optional method (backward compatible)
- Returns object of command definitions
- Type-safe with imported `AnyCommands` type from Phase 1

#### Step 2.2: Update ExtensionManager

**File:** `packages/core/src/ExtensionManager.ts`

**What to add:**

```typescript
import type { AnyCommands } from "./types/commands";
import { getExtensionField } from "./helpers/getExtensionField";

export class ExtensionManager {
  // ... existing properties and methods

  /**
   * Get all commands from all extensions
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  public getCommands(): AnyCommands {
    return this.extensions.reduce((commands, extension) => {
      const context = {
        name: extension.name,
        options: extension.options,
        storage: this.editor.extensionStorage[extension.name],
        editor: this.editor,
        type: getSchemaTypeByName(extension.name, this.schema),
      };

      const addCommands = getExtensionField(extension, "addCommands", context);

      if (!addCommands) {
        return commands;
      }

      return {
        ...commands,
        ...addCommands(),
      };
    }, {} as AnyCommands);
  }
}
```

**How it works (matching Tiptap exactly):**

- Uses `reduce()` to iterate through all extensions
- For each extension, creates context object with extension metadata
- Calls `getExtensionField()` to get the `addCommands` method (handles inheritance)
- If extension has commands, spreads them into accumulator
- Returns merged command object

**About duplicate command names:**

- Tiptap does NOT warn about duplicate command names in `ExtensionManager.commands`
- Instead, later extensions simply **overwrite** earlier ones (object spread behavior)
- This is intentional: allows extensions to override/replace commands from other extensions
- Warning happens at extension registration level, not command merging level

**Note on warnings:**
Tiptap warns about duplicate **extension names** (not command names):

- Location: `helpers/resolveExtensions.ts`
- Warning: `"Duplicate extension names found: ['foo']. This can lead to issues."`
- This prevents two extensions with same name being loaded
- Commands can have duplicates (last one wins via object spread)

**Why this approach:**

- Centralized command collection
- Allows extension composition and overrides
- Uses existing Tiptap helper functions (`getExtensionField`, `getSchemaTypeByName`)
- Consistent with how Tiptap collects plugins, attributes, etc.
- Handles conflicts (duplicate names)
- Single source of truth for all commands
- Type-safe with imported `AnyCommands` type from Phase 1

---

### Phase 3: CommandManager Implementation

**Goal:** Create the command orchestration layer.

#### Step 3.1: Create CommandManager Class

**File:** `packages/core/src/CommandManager.ts` (new file)

**Properties:**

- `editor: SlideEditor` - Reference to editor instance
- `rawCommands: AnyCommands` - Command definitions from extensions
- `customState?: EditorState` - Optional state for testing

**Methods:**

- `get commands(): SingleCommands` - Direct execution mode
- `chain(): ChainedCommands` - Chaining mode
- `can(): CanCommands` - Dry-run mode
- `buildProps(tr, shouldDispatch): CommandProps` - Helper to build context
- `createChain(startTr?): ChainedCommands` - Chain builder
- `createCan(startTr?): CanCommands` - Can builder

**Key Logic:**

**`commands` getter:**

1. Get current transaction
2. Build command props (editor, state, tr, dispatch, etc.)
3. Wrap each raw command in executor function
4. Execute command → get result → dispatch transaction
5. Return boolean success/failure

**`chain()` method:**

1. Create empty callbacks array
2. Wrap each command to push callback instead of executing
3. Return chain object with `.run()` method
4. `.run()` executes all callbacks in order
5. Stops on first failure
6. Dispatches transaction only once at end

**`can()` method:**

1. Create transaction (same as commands)
2. Build props but set `dispatch = undefined`
3. Execute command logic without dispatching
4. Return boolean result

**Why this design:**

- Three execution modes solve different use cases
- Lazy evaluation for chaining (better performance)
- Dry-run testing enables UI state management
- Single transaction for chains (atomic operations)

#### Step 3.2: Create createChainableState Helper

**File:** `packages/core/src/helpers/createChainableState.ts` (new file)

**Purpose:** Create a proxy EditorState that tracks transaction changes for chaining

**Implementation:**

```typescript
import type { EditorState, Transaction } from "@tiptap/pm/state";

export function createChainableState(config: {
  transaction: Transaction;
  state: EditorState;
}): EditorState {
  const { state, transaction } = config;
  let { selection } = transaction;
  let { doc } = transaction;
  let { storedMarks } = transaction;

  return {
    ...state,
    apply: state.apply.bind(state),
    applyTransaction: state.applyTransaction.bind(state),
    plugins: state.plugins,
    schema: state.schema,
    reconfigure: state.reconfigure.bind(state),
    toJSON: state.toJSON.bind(state),
    get storedMarks() {
      return storedMarks;
    },
    get selection() {
      return selection;
    },
    get doc() {
      return doc;
    },
    get tr() {
      selection = transaction.selection;
      doc = transaction.doc;
      storedMarks = transaction.storedMarks;
      return transaction;
    },
  };
}
```

**Why needed:**

- Allows commands to see intermediate state during chaining
- Tracks selection/doc/marks changes across multiple commands
- Enables proper transaction building without premature dispatch

#### Step 3.3: Implement CommandManager (Tiptap-Compatible)

**File:** `packages/core/src/CommandManager.ts`

**Full implementation matching Tiptap's battle-tested code:**

```typescript
import type { EditorState, Transaction } from "@tiptap/pm/state";
import type { SlideEditor } from "./SlideEditor";
import { createChainableState } from "./helpers/createChainableState";
import type {
  AnyCommands,
  CanCommands,
  ChainedCommands,
  CommandProps,
  SingleCommands,
} from "./types/commands";

export class CommandManager {
  editor: SlideEditor;
  rawCommands: AnyCommands;
  customState?: EditorState;

  constructor(props: { editor: SlideEditor; state?: EditorState }) {
    this.editor = props.editor;
    this.rawCommands = this.editor.extensionManager.getCommands();
    this.customState = props.state;
  }

  get hasCustomState(): boolean {
    return !!this.customState;
  }

  get state(): EditorState {
    return this.customState || this.editor.state;
  }

  get commands(): SingleCommands {
    const { rawCommands, editor, state } = this;
    const { view } = editor;
    const { tr } = state;
    const props = this.buildProps(tr);

    return Object.fromEntries(
      Object.entries(rawCommands).map(([name, command]) => {
        const method = (...args: any[]) => {
          const callback = command(...args)(props);

          if (!tr.getMeta("preventDispatch") && !this.hasCustomState) {
            view.dispatch(tr);
          }

          return callback;
        };

        return [name, method];
      })
    ) as unknown as SingleCommands;
  }

  get chain(): () => ChainedCommands {
    return () => this.createChain();
  }

  get can(): () => CanCommands {
    return () => this.createCan();
  }

  public createChain(
    startTr?: Transaction,
    shouldDispatch = true
  ): ChainedCommands {
    const { rawCommands, editor, state } = this;
    const { view } = editor;
    const callbacks: boolean[] = [];
    const hasStartTransaction = !!startTr;
    const tr = startTr || state.tr;

    const run = () => {
      if (
        !hasStartTransaction &&
        shouldDispatch &&
        !tr.getMeta("preventDispatch") &&
        !this.hasCustomState
      ) {
        view.dispatch(tr);
      }

      return callbacks.every((callback) => callback === true);
    };

    const chain = {
      ...Object.fromEntries(
        Object.entries(rawCommands).map(([name, command]) => {
          const chainedCommand = (...args: never[]) => {
            const props = this.buildProps(tr, shouldDispatch);
            const callback = command(...args)(props);

            callbacks.push(callback);

            return chain;
          };

          return [name, chainedCommand];
        })
      ),
      run,
    } as unknown as ChainedCommands;

    return chain;
  }

  public createCan(startTr?: Transaction): CanCommands {
    const { rawCommands, state } = this;
    const dispatch = false;
    const tr = startTr || state.tr;
    const props = this.buildProps(tr, dispatch);

    const formattedCommands = Object.fromEntries(
      Object.entries(rawCommands).map(([name, command]) => {
        return [
          name,
          (...args: never[]) =>
            command(...args)({ ...props, dispatch: undefined }),
        ];
      })
    ) as unknown as SingleCommands;

    return {
      ...formattedCommands,
      chain: () => this.createChain(tr, dispatch),
    } as CanCommands;
  }

  public buildProps(tr: Transaction, shouldDispatch = true): CommandProps {
    const { rawCommands, editor, state } = this;
    const { view } = editor;

    const props: CommandProps = {
      tr,
      editor,
      view,
      state: createChainableState({
        state,
        transaction: tr,
      }),
      dispatch: shouldDispatch ? () => undefined : undefined,
      chain: () => this.createChain(tr, shouldDispatch),
      can: () => this.createCan(tr),
      get commands() {
        return Object.fromEntries(
          Object.entries(rawCommands).map(([name, command]) => {
            return [name, (...args: never[]) => command(...args)(props)];
          })
        ) as unknown as SingleCommands;
      },
    };

    return props;
  }
}
```

**Key implementation details:**

- `commands` getter: Wraps commands, executes immediately, dispatches transaction
- `createChain()`: Collects callbacks, returns chain object with `.run()` method
- `createCan()`: Sets `dispatch: undefined`, returns dry-run results
- `buildProps()`: Builds CommandProps with chainable state
- `customState`: Enables testing without actual editor instance

#### Step 3.4: Verification Against Tiptap

**Goal:** Ensure implementation is production-ready and matches Tiptap's quality

**Comparison Checklist:**

1. **Structure Comparison** ✓

   - [ ] Same class properties (editor, rawCommands, customState)
   - [ ] Same getter methods (commands, chain, can, state, hasCustomState)
   - [ ] Same public methods (createChain, createCan, buildProps)
   - [ ] Same method signatures and parameter types

2. **Logic Comparison** ✓

   - [ ] `commands` getter: identical wrapping and dispatch logic
   - [ ] `createChain()`: identical callback collection and run() method
   - [ ] `createCan()`: identical dispatch=undefined logic
   - [ ] `buildProps()`: identical CommandProps construction
   - [ ] Transaction handling: same preventDispatch meta check
   - [ ] State management: same customState fallback logic

3. **Edge Cases** ✓

   - [ ] Handles `preventDispatch` meta correctly
   - [ ] Handles customState for testing
   - [ ] Handles empty/undefined transactions
   - [ ] Chain stops on first failure (callbacks.every())
   - [ ] Single dispatch per chain (only at .run())
   - [ ] Lazy getter evaluation (chain/can return functions)

4. **Type Safety** ✓

   - [ ] All types imported from ./types/commands
   - [ ] Proper casting (as unknown as SingleCommands)
   - [ ] Never[] for args in map functions
   - [ ] Optional parameters typed correctly

5. **Code Review Items** ✓
   - [ ] No logic differences from Tiptap
   - [ ] Same performance characteristics
   - [ ] Same error handling approach
   - [ ] Comments match Tiptap's clarity
   - [ ] Variable names consistent with Tiptap

**Refinement Process:**

1. **Initial Implementation:**

   - Write CommandManager following Step 3.3 code exactly
   - Write createChainableState helper following Step 3.2 code

2. **Side-by-Side Comparison:**

   - Open Tiptap's CommandManager.ts in one pane
   - Open your implementation in another pane
   - Line-by-line comparison of:
     - Method order
     - Logic flow
     - Variable names
     - Comments
     - Edge case handling

3. **Refinement Criteria:**

   - If Tiptap has it → you must have it
   - If you added something Tiptap doesn't have → remove it (probably not needed)
   - If there's a difference → use Tiptap's approach (battle-tested)
   - Only acceptable changes:
     - `Editor` → `SlideEditor` (type rename)
     - `this.editor.extensionManager.commands` → `this.editor.extensionManager.getCommands()` (method name)

4. **Testing Verification:**

   - Test direct execution: `editor.commands.toggleBold()`
   - Test chaining: `editor.chain().toggleBold().toggleItalic().run()`
   - Test can: `editor.can().toggleBold()`
   - Test nested chains: `editor.chain().chain().run()`
   - Test preventDispatch meta
   - Test with customState

5. **Final Sign-Off:**
   - [ ] Human review confirms match with Tiptap
   - [ ] AI review confirms match with Tiptap
   - [ ] All tests pass
   - [ ] No regressions in existing functionality
   - [ ] TypeScript compiles without errors

**Success Criteria:**

- Implementation is functionally identical to Tiptap's CommandManager
- Only differences are necessary adaptations (SlideEditor vs Editor)
- Code review by both AI and human confirms quality
- Ready for production use

---

### Phase 4: Core Commands Migration

**Goal:** Move hardcoded commands to extension-based system and delete old commands folder.

#### Step 4.1: Create CoreCommandsExtension

**File:** `packages/core/src/extensions/CoreCommands.ts` (new file)

**What to do:**

1. Create new Extension class: `CoreCommands`
2. Implement `addCommands()` method
3. Copy ALL command logic from `commands/index.ts`
4. Convert each command from old format → new format:

   ```
   // Old format (functional with closure):
   toggleBold: () => exec(() => {
     const v = view()!;  // Get view from closure
     const markType = v.state.schema.marks.bold;
     return toggleMark(markType)(v.state, v.dispatch);
   })

   // New format (extension-based with CommandProps):
   toggleBold: () => ({ state, view }) => {
     const markType = state.schema.marks.bold;
     return toggleMark(markType)(state, view.dispatch);
   }
   ```

5. Remove `exec()` wrapper (not needed - CommandManager handles safety)
6. Use `CommandProps` parameters instead of `getView()` closure
7. Set high priority (e.g., 1000) so core commands load first

**Commands to migrate (50+ total):**

- Text formatting (toggleBold, toggleItalic, toggleUnderline, toggleStrikethrough, toggleCode)
- Colors (setTextColor, setHighlight, removeTextColor, removeHighlight)
- Headings (setHeading, toggleHeading, setParagraph)
- Links (setLink, updateLink, removeLink)
- Lists (toggleBulletList, toggleOrderedList)
- Media (insertImage, insertVideo)
- Slides (addSlide, deleteSlide, duplicateSlide)
- Navigation (nextSlide, prevSlide, goToSlide, goToFirstSlide, goToLastSlide, canGoNext, canGoPrev, getSlideInfo)
- Layouts (setLayout, setSlideLayout)
- History (undo, redo, canUndo, canRedo, getUndoDepth, getRedoDepth, getHistoryState, clearHistory)
- Selection (focus, blur, selectAll, deleteSelection, setSelection, selectSlide, collapseSelection, expandSelection, getSelectedText, isSelectionEmpty, isAtStart, isAtEnd)
- Content (clearContent)
- Chaining (chain - handled by CommandManager)

**Why:**

- Treats core commands same as extension commands
- Single code path for all commands
- Easier to maintain and extend
- Commands have access to full CommandProps context
- No duplication of safety/error handling logic

#### Step 4.2: Delete Old Commands Folder

**Files to delete:**

- `packages/core/src/commands/index.ts` (entire file - ~758 lines)
- `packages/core/src/commands/README.md`
- `packages/core/src/commands/` (entire folder after moving tests)

**Files to move:**

- Move tests from `packages/core/src/commands/__tests__/*.test.ts`
- To `packages/core/src/extensions/__tests__/CoreCommands.test.ts`

**Additional cleanup in SlideEditor.ts:**

- Remove `import { createCommands } from './commands'` (line 11)
- Remove `this.commands = createCommands(() => this.view)` (line 104)
- Remove `Commands` type import from old system (if it conflicts with new types)

**Additional cleanup in exports:**

- Remove `export * from './commands'` from `packages/core/src/index.ts`
- Remove any references to `createCommands` function
- Update test imports to use new CoreCommands extension

**Why:**

- Eliminates code duplication
- Single source of truth for commands
- All commands flow through same system
- Cleaner codebase

#### Step 4.3: Register CoreCommands as Extension

**File:** `packages/core/src/SlideEditor.ts`

**What to change:**

1. Import CoreCommands extension
2. Add CoreCommands to default extensions array (auto-loaded)
3. Ensure it's loaded before user extensions
4. Set high priority (e.g., 1000) so it executes first

**Why:**

- Core commands always available (users don't need to import)
- Loaded automatically, transparent to users
- Users can still add custom commands
- Existing toolbar code continues to work unchanged

---

### Phase 5: SlideEditor Integration

**Goal:** Wire CommandManager into the editor.

#### Step 5.1: Update SlideEditor Constructor

**File:** `packages/core/src/SlideEditor.ts`

**Current flow:**

```
1. Create ExtensionManager (if extensions provided)
2. Create plugins
3. this.commands = createCommands(() => this.view)
```

**New flow:**

```
1. Add CoreCommands to extensions array
2. Create ExtensionManager with ALL extensions (core + user)
3. Create CommandManager with editor reference
4. Create plugins
5. this.commands = this.commandManager.commands
```

**What to change:**

- Remove `createCommands()` call
- Add `this.commandManager = new CommandManager({ editor: this })`
- Update `this.commands` to use commandManager
- Add `chain()` and `can()` public methods

**Why:**

- Single source of commands (via CommandManager)
- Extensions now control all commands
- Cleaner separation of concerns

#### Step 5.2: Add Public API Methods

**File:** `packages/core/src/SlideEditor.ts`

**What to add:**

```typescript
public chain(): ChainedCommands {
  return this.commandManager.chain();
}

public can(): CanCommands {
  return this.commandManager.can();
}
```

**Why:**

- Matches Tiptap API surface
- Users can chain commands
- Users can test commands before executing

---

### Phase 6: Update Exports

**Goal:** Clean up public API and remove old commands.

#### Step 6.1: Update Exports

**File:** `packages/core/src/index.ts`

**What to change:**

- Remove `export * from './commands'` (folder no longer exists)
- Remove `createCommands` function export (no longer exists)
- Add `export { CommandManager } from './CommandManager'`
- Add `export { CoreCommands } from './extensions/CoreCommands'` (optional - users don't need it, but good for transparency)
- Ensure command types are exported from types folder

**Why:**

- Clean public API
- No confusion about which system to use
- Type safety for consumers
- CoreCommands is auto-loaded, but users can import if they want to see what's included

---

### Phase 7: Testing Strategy

**Goal:** Ensure all functionality works and is type-safe.

#### Step 7.1: CommandManager Unit Tests

**File:** `packages/core/src/__tests__/CommandManager.test.ts` (new file)

**Test cases:**

- ✅ Creates command manager with editor
- ✅ Collects commands from extensions
- ✅ Direct execution (.commands.toggleBold())
- ✅ Chained execution (.chain().bold().italic().run())
- ✅ Dry-run testing (.can().toggleBold())
- ✅ Handles missing view gracefully
- ✅ Builds correct CommandProps
- ✅ Dispatches transactions correctly
- ✅ Stops chain on first failure
- ✅ Handles duplicate command names

#### Step 7.2: Extension Command Tests

**File:** `packages/core/src/__tests__/ExtensionCommands.test.ts` (new file)

**Test cases:**

- ✅ Extensions can define commands
- ✅ Commands registered in editor.commands
- ✅ Custom commands execute correctly
- ✅ Custom commands can use other commands
- ✅ Custom commands can be chained
- ✅ Custom commands can be tested with .can()

#### Step 7.3: CoreCommands Tests

**File:** `packages/core/src/extensions/__tests__/CoreCommands.test.ts` (new file)

**Test cases:**

- ✅ All core commands registered
- ✅ toggleBold works
- ✅ addSlide works
- ✅ setLayout works
- ✅ (Test ALL migrated commands)

#### Step 7.4: Integration Tests

**File:** `packages/core/src/__tests__/CommandIntegration.test.ts` (new file)

**Test cases:**

- ✅ Core commands + custom commands work together
- ✅ Can chain core and custom commands
- ✅ Command priority respected
- ✅ Duplicate names handled correctly

#### Step 7.5: Update Existing Tests

**Files:** `packages/core/src/commands/__tests__/*.test.ts`

**What to do:**

- Update tests to use new command system
- Ensure tests still pass
- Add tests for new functionality (chain, can)

---

### Phase 8: Documentation

**Goal:** Help users understand and use the new system.

#### Step 8.1: Update README

**File:** `packages/core/README.md`

**What to add:**

- Section on custom commands
- Example of creating command extension
- Example of using chain()
- Example of using can()

#### Step 8.2: Add Migration Guide

**File:** `MIGRATION_COMMAND_MANAGER.md` (new file in root)

**What to include:**

- Why we made this change
- What changed
- How to create custom commands
- Examples of before/after code
- Breaking changes (if any)

#### Step 8.3: Add JSDoc Comments

**Files:** All new/modified files

**What to add:**

- Detailed JSDoc on CommandManager methods
- Examples in comments
- Type documentation
- Parameter descriptions

---

## 4. Execution Order

### Week 1: Foundation

- [ ] Day 1-2: Define command types (Phase 1)
- [ ] Day 3: Update Extension base class (Phase 2.1)
- [ ] Day 4: Update ExtensionManager (Phase 2.2)
- [ ] Day 5: Review & fix type errors

### Week 2: Core Implementation

- [ ] Day 1-3: Implement CommandManager (Phase 3)
- [ ] Day 4-5: Create CoreCommandsExtension (Phase 4.1)

### Week 3: Integration & Migration

- [ ] Day 1-2: Integrate CommandManager into SlideEditor (Phase 5)
- [ ] Day 3: Update exports and deprecate old code (Phase 6)
- [ ] Day 4-5: Fix any runtime issues

### Week 4: Testing & Documentation

- [ ] Day 1-2: Write all tests (Phase 7)
- [ ] Day 3: Update documentation (Phase 8)
- [ ] Day 4: Final review and polish
- [ ] Day 5: Merge to main

---

## 5. Type Safety Checklist

### Must Have Strong Types For:

- [ ] CommandProps interface
- [ ] RawCommand type
- [ ] SingleCommands type (every command returns boolean)
- [ ] ChainedCommands type (every command returns chain, .run() returns boolean)
- [ ] CanCommands type (every command returns boolean)
- [ ] AnyCommands type (raw command definitions)
- [ ] Extension.addCommands() return type
- [ ] CommandManager.commands getter
- [ ] CommandManager.chain() return type
- [ ] CommandManager.can() return type

### Type Inference Should Work:

- [ ] editor.commands.toggleBold() - autocomplete available
- [ ] editor.chain().toggleBold() - autocomplete available
- [ ] editor.can().toggleBold() - autocomplete available
- [ ] Custom commands appear in autocomplete
- [ ] Command parameters are type-checked

---

## 6. Testing Checklist

### Unit Tests

- [ ] CommandManager creation
- [ ] Command collection from extensions
- [ ] Direct execution
- [ ] Chained execution
- [ ] Dry-run testing
- [ ] Transaction dispatch
- [ ] Error handling
- [ ] Edge cases (no view, no commands, etc.)

### Integration Tests

- [ ] Core commands work
- [ ] Custom commands work
- [ ] Core + custom commands together
- [ ] Chaining works end-to-end
- [ ] Can() works end-to-end
- [ ] Priority/order respected

### Regression Tests

- [ ] All existing tests still pass
- [ ] No breaking changes for users
- [ ] Extensions without addCommands() still work

---

## 7. Success Criteria

### Functionality

- ✅ Users can define custom commands in extensions
- ✅ Custom commands available at `editor.commands.customCommand()`
- ✅ Commands can be chained: `editor.chain().cmd1().cmd2().run()`
- ✅ Commands can be tested: `editor.can().command()`
- ✅ All existing core commands work
- ✅ No breaking changes for existing code

### Code Quality

- ✅ 100% type safe (no `any` types)
- ✅ All tests pass
- ✅ Test coverage > 90%
- ✅ No runtime errors
- ✅ No console warnings

### Documentation

- ✅ README updated with examples
- ✅ Migration guide written
- ✅ JSDoc comments on all public APIs
- ✅ TypeScript types exported correctly

---

## 8. Potential Risks & Mitigations

### Risk 1: Breaking Changes

**Risk:** Existing code might break
**Mitigation:**

- Keep backward compatibility
- Test extensively
- Provide migration guide

### Risk 2: Type Complexity

**Risk:** TypeScript types might be too complex
**Mitigation:**

- Start simple, iterate
- Use utility types
- Add good JSDoc examples

### Risk 3: Performance

**Risk:** Command execution might be slower
**Mitigation:**

- Profile before/after
- Optimize hot paths
- Lazy evaluation where possible

### Risk 4: Testing Complexity

**Risk:** Hard to test all combinations
**Mitigation:**

- Focus on critical paths first
- Use property-based testing
- Test common workflows

---

## 9. Open Questions

### Q1: Command Priority/Ordering

**Question:** If two extensions define the same command name, which wins?
**Options:**

1. First one wins (current plan)
2. Last one wins (allows overriding)
3. Throw error (strict)

**Decision:** First one wins + warning (safe default)

### Q2: Command Context Access

**Question:** Should commands have access to editor instance directly?
**Options:**

1. Yes, include in CommandProps
2. No, only state/tr/view

**Decision:** Yes, include editor (matches Tiptap, more flexible)

### Q3: Async Commands

**Question:** Should we support async commands?
**Options:**

1. No, all commands are sync (simpler)
2. Yes, return Promise<boolean> (more flexible)

**Decision:** Start with sync only, add async later if needed

---

## 10. Next Steps

1. **Review this plan** - Ensure we agree on approach
2. **Approve or modify** - Make any necessary changes
3. **Start with Phase 1** - Define types first
4. **Implement incrementally** - One phase at a time
5. **Test continuously** - Don't wait until end
6. **Document as we go** - Write docs while fresh

---

## Appendix A: Key Differences from Current System

| Aspect          | Current                        | After CommandManager                     |
| --------------- | ------------------------------ | ---------------------------------------- |
| Command source  | Hardcoded in commands/index.ts | From extensions via addCommands()        |
| Extensibility   | Cannot add commands            | Can add via extensions                   |
| Core commands   | createCommands() function      | CoreCommands extension                   |
| Execution modes | Direct only                    | Direct, chain, can                       |
| Type safety     | Partial                        | Full                                     |
| Command context | Limited (view only)            | Full (editor, state, tr, dispatch, etc.) |

---

## Appendix B: Example Usage After Implementation

### Defining a Custom Command

```typescript
export class MyExtension extends Extension {
  addCommands() {
    return {
      insertGreeting:
        (name: string) =>
        ({ commands, tr }) => {
          // Can use other commands
          commands.focus();

          // Can manipulate transaction
          tr.insertText(`Hello, ${name}!`);

          // Can chain commands
          commands.toggleBold();

          return true; // Success
        },
    };
  }
}
```

### Using Custom Commands

```typescript
// Direct execution
editor.commands.insertGreeting("Alice");

// Chaining
editor.chain().insertGreeting("Bob").toggleItalic().run();

// Testing
if (editor.can().insertGreeting("Charlie")) {
  showGreetingButton();
}
```

---

## Appendix C: Future @autoartifacts/pm Package

**Note:** This plan is compatible with creating a `@autoartifacts/pm` package similar to Tiptap's `@tiptap/pm`.

### What is @tiptap/pm?

Tiptap created `@tiptap/pm` as a **wrapper/re-export package** for ProseMirror packages:

- Centralizes all ProseMirror dependencies
- Users import from `@tiptap/pm/state` instead of `prosemirror-state`
- Allows version locking and easier dependency management
- Provides single source of truth for ProseMirror versions

### How it works in Tiptap:

```typescript
// Instead of:
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

// Users (and Tiptap internally) import from:
import { EditorState } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";
```

### Impact on this CommandManager plan:

**No impact! ✅** The plan is already compatible because:

1. **Import paths are isolated:**

   - CommandManager uses: `import type { EditorState, Transaction } from '@tiptap/pm/state'`
   - This can easily become: `import type { EditorState, Transaction } from '@autoartifacts/pm/state'`
   - Just a find-and-replace operation

2. **Types are already using ProseMirror correctly:**

   - All ProseMirror types are imported at the top
   - No direct usage of ProseMirror constructors in public API
   - CommandProps already wraps ProseMirror types

3. **Migration path is straightforward:**

   ```typescript
   // Step 1: Create @autoartifacts/pm package
   packages/pm/
     state/index.ts         → export * from 'prosemirror-state'
     view/index.ts          → export * from 'prosemirror-view'
     model/index.ts         → export * from 'prosemirror-model'
     commands/index.ts      → export * from 'prosemirror-commands'
     // ... etc

   // Step 2: Update imports throughout @autoartifacts/core
   // From:
   import { EditorState } from 'prosemirror-state';
   // To:
   import { EditorState } from '@autoartifacts/pm/state';
   ```

4. **When to create @autoartifacts/pm:**

   - **Not now** - Do this AFTER CommandManager is working
   - **Why wait:** Avoid changing too many things at once
   - **Timeline:** Phase 9 or later (after everything is stable)
   - **Benefit:** Better dependency management, version locking, cleaner imports

5. **What stays the same:**
   - CommandManager logic (zero changes)
   - Extension system (zero changes)
   - Type definitions (zero changes)
   - Only import statements change (mechanical refactor)

### Recommended approach:

1. ✅ **Now:** Implement CommandManager with direct ProseMirror imports
2. ✅ **After Phase 8:** Verify everything works perfectly
3. ✅ **Later (Phase 9+):** Create `@autoartifacts/pm` package
4. ✅ **Then:** Run find-and-replace to update all imports
5. ✅ **Finally:** Test to ensure nothing broke

**Bottom line:** Creating `@autoartifacts/pm` is a future **quality-of-life improvement** that won't affect this plan's architecture. It's just a packaging/import reorganization that can happen later without breaking changes.

---

**End of Plan**
