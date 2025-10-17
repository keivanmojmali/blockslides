# Tiptap Architecture Migration Plan for AutoArtifacts Slide Editor

**Goal**: Adopt Tiptap's battle-tested architecture while maintaining slide editor functionality.

**Status**: ✅ Phase 1 Complete | 🔄 Phase 2 - Steps 4-5 Complete

**Last**: Extension.ts (base class complete)

---

## Phase 1: Core Utilities (Drop-in) ✅ COMPLETE

### Step 1: Tracker.ts ✅ COMPLETE

**Priority**: Low (optional utility)
**Effort**: 5 minutes
**Attribution**: Full file from Tiptap (MIT License)
**Status**: ✅ Implemented

**What**:

- Copy `Tracker.ts` from Tiptap as-is
- Pure utility class for tracking positions through transactions
- Useful for commands that need to track node positions during transformations

**Changes needed**:

- ✅ None - works as-is

**Integration**:

- ✅ Export from `index.ts`
- Use in future commands that transform documents (e.g., moving slides)

**Dependencies**: Only ProseMirror Transaction type

---

### Step 2: style.ts + CSS Injection ✅ COMPLETE

**Priority**: Low (nice-to-have)
**Effort**: 15 minutes
**Attribution**: Full file from Tiptap (MIT License)
**Status**: ✅ Implemented

**What**:

- Copy `style.ts` CSS string constant from Tiptap
- Provides default ProseMirror editor styles
- Created `createStyleTag` utility for DOM injection

**Changes needed**:

- ✅ None - just a CSS string

**Integration**:

- ✅ Import in `SlideEditor.ts` constructor
- ✅ Inject into DOM using `createStyleTag` utility
- ✅ Add `injectCSS: boolean` option to `SlideEditorOptions` (default: true)
- ✅ Add `injectNonce?: string` option for CSP compliance

**Dependencies**: None

**Files created**:

- ✅ `src/style.ts`
- ✅ `src/utils/createStyleTag.ts`

---

### Step 3: jsx-runtime.ts ✅ COMPLETE

**Priority**: Low (quality of life)
**Effort**: 10 minutes
**Attribution**: Full file from Tiptap (MIT License)
**Status**: ✅ Implemented with full build system

**What**:

- Copy `jsx-runtime.ts` from Tiptap as-is
- Enables JSX syntax in `renderHTML()` methods
- Better than array syntax: `<strong><slot /></strong>` vs `['strong', 0]`

**Changes needed**:

- ✅ None - works as-is

**Integration**:

- ✅ Export from `index.ts`
- ✅ Create subpath exports: `jsx-runtime/` and `jsx-dev-runtime/`
- ✅ Configure tsup for dual entry points
- ✅ Add package.json exports for subpath imports
- ✅ Update `tsconfig.json` to support JSX:
  ```json
  {
    "compilerOptions": {
      "jsx": "react-jsx",
      "jsxImportSource": "@autoartifacts/core"
    }
  }
  ```
- Optionally refactor marks/nodes to use JSX in future

**Dependencies**: None

**Files created**:

- ✅ `src/jsx-runtime.ts`
- ✅ `jsx-runtime/index.{js,cjs,d.ts,d.cts}`
- ✅ `jsx-dev-runtime/index.{js,cjs,d.ts,d.cts}`
- ✅ `tsup.config.ts` (dual entry configuration)

---

## Phase 2: Foundation Classes (No SlideEditor Changes Yet)

**Strategy**: Build all foundation classes first, then integrate into SlideEditor at the end.

### Step 4: Extendable.ts ✅ COMPLETE

**Priority**: HIGH - Required for Mark/Node/Extension refactor
**Effort**: 2 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)
**Status**: ✅ COMPLETE

**What**:

- Base class for Extension/Mark/Node
- Provides `.create()`, `.configure()`, `.extend()` factory pattern
- Adds 40+ lifecycle hooks (onCreate, onUpdate, onDestroy, etc.)
- Enables extension configuration and inheritance

**Changes needed**:

- ✅ Changed `Editor` → `SlideEditor` throughout
- ✅ Created ExtendableConfig interface with 40+ lifecycle hooks
- ✅ Implemented parent/child chain pattern for extension inheritance
- ✅ Created helper: getExtensionField for recursive field lookup
- ✅ Created utilities: callOrReturn, mergeDeep for configuration
- ✅ Added comprehensive type system: types/extensions.ts with 20+ types

**Integration**:

- ✅ Export from `index.ts`
- ✅ Create ExtensionConfig, MarkConfig, NodeConfig placeholder interfaces
- ✅ Export helper from helpers/index.ts
- ✅ Export types from types/index.ts
- Extension/Mark/Node classes will extend this (Steps 5-7)

**Dependencies**:

- ✅ helpers/getExtensionField.ts
- ✅ utils/callOrReturn.ts
- ✅ utils/mergeDeep.ts
- ✅ types/extensions.ts (ParentConfig, AnyConfig, etc.)

**Files created**:

- ✅ `src/Extendable.ts` (589 lines)
- ✅ `src/helpers/getExtensionField.ts` (40 lines)
- ✅ `src/helpers/index.ts` (export file)
- ✅ `src/utils/callOrReturn.ts` (36 lines)
- ✅ `src/utils/mergeDeep.ts` (44 lines)
- ✅ `src/types/extensions.ts` (comprehensive type definitions)
- ✅ Updated `src/types/index.ts` (re-export extension types)

- Export from `index.ts`
- Foundation for Steps 5, 6, 7
- Update type definitions in `types/` directory
- ⚠️ **NO SlideEditor changes yet** - just build the class

**Dependencies**:

- EventEmitter (✅ done)
- ProseMirror model/state types

**Files to create**:

- `src/Extendable.ts` (~528 lines from Tiptap)

**Files to update**:

- `src/index.ts` - Export Extendable and ExtendableConfig
- `src/types/index.ts` - Export new types (if needed)

---

### Step 5: Extension.ts ✅ COMPLETE

**Priority**: HIGH - Core architecture change
**Effort**: 3 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)
**Status**: ✅ COMPLETE

**What**:

- Rewrite current `Extension.ts` to extend `Extendable`
- Change from simple OOP class to factory-based pattern
- Add `type = 'extension'` property
- Implement `ExtensionConfig` interface

**Changes needed**:

- ✅ Extended `Extendable` instead of standalone class
- ✅ Added static `.create(config)` method
- ✅ Changed `Editor` → `SlideEditor`
- ✅ Implemented `.configure()` and `.extend()` methods
- ✅ Added comprehensive JSDoc documentation

**Integration**:

- ✅ Replaced existing `Extension.ts` (173 lines)
- ✅ ExtensionConfig interface defined in Extendable.ts (to avoid circular deps)
- ✅ Re-exported ExtensionConfig from Extension.ts for public API
- ✅ Exported from `index.ts`
- ⚠️ **Temporarily disabled** ExtensionManager and CoreCommands exports (old API)
  - Will be rewritten in Step 8 (ExtensionManager)
  - Will be rewritten in Step 10 (CoreCommands)

**Dependencies**:

- ✅ Step 4: Extendable.ts

**Files created**:

- ✅ `src/Extension.ts` (173 lines) - Complete rewrite extending Extendable

**Files updated**:

- ✅ `src/index.ts` - Export Extension, ExtensionConfig, Extendable, ExtendableConfig
- ✅ `src/Extendable.ts` - Added ExtensionConfig interface (avoid circular dependency)

**Build Status**: ✅ All TypeScript errors resolved, build succeeds

---

### Step 6: Mark.ts 🔥 MAJOR NEW FILE

**Priority**: HIGH - Schema architecture change
**Effort**: 2 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)
**Status**: ⏳ PENDING (after Step 5)

**What**:

- Create new `Mark.ts` class extending `Extendable`
- Factory pattern for creating marks: `Mark.create({ name: 'bold', ... })`
- Add `type = 'mark'` property
- Implement `MarkConfig` interface with mark-specific options

**Changes needed**:

- Change `Editor` → `SlideEditor`
- Adapt for slide editor use cases

**Integration**:

- Create new file `src/Mark.ts`
- Export from `index.ts`
- ⚠️ **NO conversion of existing marks yet** - just the base class
- ⚠️ **NO SlideEditor changes yet**

**Dependencies**:

- Step 4: Extendable.ts

**Files to create**:

- `src/Mark.ts` (~300-400 lines from Tiptap)

---

### Step 7: Node.ts 🔥 MAJOR NEW FILE

**Priority**: HIGH - Schema architecture change
**Effort**: 2 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)
**Status**: ⏳ PENDING (after Step 4)

**What**:

- Create new `Node.ts` class extending `Extendable`
- Factory pattern for creating nodes: `Node.create({ name: 'paragraph', ... })`
- Add `type = 'node'` property
- Implement `NodeConfig` interface with node-specific options

**Changes needed**:

- Change `Editor` → `SlideEditor`
- Keep slide-specific node features (columns, layouts)

**Integration**:

- Create new file `src/Node.ts`
- Export from `index.ts`
- ⚠️ **NO conversion of existing nodes yet** - just the base class
- ⚠️ **NO SlideEditor changes yet**

**Dependencies**:

- Step 4: Extendable.ts

**Files to create**:

- `src/Node.ts` (~400-500 lines from Tiptap)

---

### Step 8: ExtensionManager.ts 🔥 MAJOR REWRITE

**Priority**: HIGH - Required for schema generation
**Effort**: 3 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)
**Status**: ⏳ PENDING (after Steps 4-7)

**What**:

- Rewrite to handle Extension/Mark/Node as siblings (not hierarchy)
- Add schema generation from extensions
- Implement `getSchemaByResolvedExtensions()`
- Add node view and mark view registry
- Keep command collection functionality

**Changes needed**:

- Change `Editor` → `SlideEditor`
- Filter extensions by type: `extensions.filter(e => e.type === 'extension')`
- Generate ProseMirror schema from Mark and Node extensions
- Merge attributes, commands, plugins from all extension types

**Integration**:

- Replace existing `ExtensionManager.ts`
- ⚠️ **NO SlideEditor changes yet** - just the ExtensionManager

**Dependencies**:

- Step 4: Extendable.ts
- Step 5: Extension.ts
- Step 6: Mark.ts
- Step 7: Node.ts

**Files to update**:

- `src/ExtensionManager.ts` - Complete rewrite

---

## Phase 3: Validation & Testing

### Step 9: Create Test Extension 🧪 NEW

**Priority**: HIGH - Validates architecture works
**Effort**: 30 minutes
**Status**: ⏳ PENDING (after Step 8)

**What**:

- Create ONE simple test extension using new system
- Example: A simple `Highlight` mark or `Callout` node
- Verify `.create()`, `.configure()`, `.extend()` all work
- Test that schema generation works

**Integration**:

- Create `src/__tests__/TestExtension.ts` or similar
- Don't integrate with SlideEditor yet
- Just verify the class system works in isolation

**Dependencies**:

- Steps 4-8 complete

**Success Criteria**:

- ✅ Can create extension with `.create()`
- ✅ Can configure with `.configure({ option: value })`
- ✅ Can extend with `.extend({ addAttributes: ... })`
- ✅ Schema generates correctly
- ✅ All types work

---

## Phase 4: Convert All Extensions (No SlideEditor Changes Yet)

### Step 10: Convert All Marks to Class-Based

**Priority**: HIGH
**Effort**: 2 hours
**Status**: ⏳ PENDING (after Step 9)

**What**:

- Convert all marks in `schema/marks/` to use `Mark.create()` pattern
- Keep same functionality, just new API

**Files to convert** (9 marks):

- `schema/marks/bold.ts`
- `schema/marks/italic.ts`
- `schema/marks/code.ts`
- `schema/marks/link.ts`
- `schema/marks/subscript.ts`
- `schema/marks/superscript.ts`
- `schema/marks/underline.ts`
- `schema/marks/highlight.ts`
- `schema/marks/textStyle.ts`

**Integration**:

- ⚠️ **NO SlideEditor changes yet**
- Just convert the mark definitions

---

### Step 11: Convert All Nodes to Class-Based

**Priority**: HIGH
**Effort**: 3 hours
**Status**: ⏳ PENDING (after Step 10)

**What**:

- Convert all nodes in `schema/nodes/` to use `Node.create()` pattern
- Keep same functionality, just new API

**Files to convert** (11 nodes):

- `schema/nodes/doc.ts`
- `schema/nodes/slide.ts`
- `schema/nodes/column.ts`
- `schema/nodes/paragraph.ts`
- `schema/nodes/heading.ts`
- `schema/nodes/bulletList.ts`
- `schema/nodes/orderedList.ts`
- `schema/nodes/listItem.ts`
- `schema/nodes/code.ts`
- `schema/nodes/image.ts`
- `schema/nodes/text.ts`

**Integration**:

- ⚠️ **NO SlideEditor changes yet**
- Just convert the node definitions

---

### Step 12: Convert All Extensions to Class-Based

**Priority**: HIGH
**Effort**: 2 hours
**Status**: ⏳ PENDING (after Step 11)

**What**:

- Convert all extensions in `extensions/` to use new `Extension` pattern
- Extend from new Extendable-based Extension class

**Files to convert** (existing extensions):

- `extensions/CoreCommands.ts`
- All other extension files

**Integration**:

- ⚠️ **NO SlideEditor changes yet**
- Just convert the extension definitions

---

## Phase 5: Final SlideEditor Integration (ONE BIG STEP)

### Step 13: SlideEditor.ts 🔥 FINAL INTEGRATION

**Priority**: CRITICAL - Last step
**Effort**: 4 hours
**Status**: ⏳ PENDING (after Steps 10-12)

**What**:

- Integrate all new components into SlideEditor
- Use schema from ExtensionManager
- Add lifecycle hook emission
- Keep slide-specific functionality
- Keep mount/unmount pattern

**Changes needed**:

- Use `extensionManager.schema` instead of imported schema
- Emit lifecycle events: onCreate, onUpdate, onSelectionUpdate, etc.
- Pass extensions (Extension/Mark/Node) instead of just Extension
- Keep slide navigation features
- Keep validation features

**Integration**:

- This is the FINAL integration point
- All previous steps lead to this
- Update demo app to use new extension pattern

**Dependencies**:

- ALL previous steps (1-12)

**Files to update**:

- `src/SlideEditor.ts` - Major rewrite
- `src/index.ts` - Ensure all new exports are present
- `schema/index.ts` - May become obsolete or just export defaults
- Update demo app
- Update documentation

---

## Phase 6: Advanced Features (Optional - After SlideEditor Integration)

### Step 14: InputRule.ts ⚠️ UPGRADE (Optional)

**Priority**: Medium (you have markdown input rules)
**Effort**: 2 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)

**What**:

- Standardize input rule pattern
- Copy Tiptap's `InputRule.ts` class
- Add `inputRulesPlugin()` factory
- Helper functions: `markInputRule()`, `nodeInputRule()`, `textInputRule()`

**Changes needed**:

- Change `Editor` → `SlideEditor`
- Integrate with existing markdown input rules

**Integration**:

- Create new file `src/InputRule.ts`
- Export from `index.ts`
- Refactor `plugins/markdownInputRules.ts` to use new pattern
- Extensions can add input rules via `addInputRules()` hook

**Dependencies**:

- Step 4: Extendable.ts (for addInputRules hook)

**Files to update after**:

- `plugins/markdownInputRules.ts` - Use new InputRule class
- Extensions can now add input rules declaratively

---

### Step 15: PasteRule.ts ⚠️ NEW (Optional)

**Priority**: Low (nice-to-have)
**Effort**: 2 hours
**Attribution**: Full file from Tiptap (MIT License)

**What**:

- Copy Tiptap's `PasteRule.ts` class
- Add paste/drop content handling
- Helper functions: `markPasteRule()`, `nodePasteRule()`

**Changes needed**:

- Change `Editor` → `SlideEditor`

**Integration**:

- Create new file `src/PasteRule.ts`
- Export from `index.ts`
- Extensions can add paste rules via `addPasteRules()` hook

**Dependencies**:

- Step 4: Extendable.ts (for addPasteRules hook)

**Files to update after**:

- Extensions can now handle paste events declaratively

---

### Step 16: NodePos.ts ⚠️ NEW (Optional)

**Priority**: Low (quality of life)
**Effort**: 1 hour
**Attribution**: Full file from Tiptap with minor changes (MIT License)

**What**:

- Copy Tiptap's `NodePos.ts` helper class
- CSS-like node querying: `editor.$node('paragraph')`, `editor.$nodes('[data-layout]')`
- Methods: `querySelector()`, `querySelectorAll()`, `closest()`, `setAttribute()`

**Changes needed**:

- Change `Editor` → `SlideEditor`

**Integration**:

- Create new file `src/NodePos.ts`
- Export from `index.ts`
- Add methods to SlideEditor: `$node()`, `$nodes()`, `$pos()`, `$doc`

**Dependencies**: None (can be added anytime)

**Files to update after**:

- `SlideEditor.ts` - Add query methods

---

### Step 17: NodeView.ts & MarkView.ts (Skip for now)

**Priority**: VERY LOW - Not needed yet
**Effort**: 4 hours each
**Note**: Only implement when you need React/Vue custom node rendering

---

## Phase 5: Final SlideEditor Integration (ONE BIG STEP)

### Step 13: SlideEditor.ts 🔥 FINAL INTEGRATION

**Priority**: CRITICAL - Last step
**Effort**: 4 hours
**Attribution**: Heavily adapted from Tiptap's Editor.ts (MIT License)

**What**:

- Integrate all new components
- Keep slide-specific functionality
- Use schema from ExtensionManager
- Add lifecycle hook emission
- Keep mount/unmount pattern

**Changes needed**:

- Use `extensionManager.schema` instead of imported schema
- Emit lifecycle events: onCreate, onUpdate, onSelectionUpdate, etc.
- Pass extensions (Extension/Mark/Node) instead of just Extension
- Keep slide navigation features
- Keep validation features

**Integration**:

- This is the final integration point
- All previous steps lead to this

**Dependencies**:

- ALL previous steps (1-8 required, 9-11 optional)

**Files to update after**:

- `index.ts` - Ensure all new exports are present
- Update demo app to use new extension pattern
- Update documentation

---

## Testing Strategy (After Each Step)

After each step, run:

```bash
# Type check
pnpm typecheck

# Run tests
pnpm test

# Build
pnpm build

# Run demo app
cd demo && pnpm dev
```

---

## Migration Order Summary

**Phase 1: Utilities** ✅ COMPLETE:

1. ✅ Tracker.ts (drop-in)
2. ✅ style.ts + CSS injection (drop-in)
3. ✅ jsx-runtime.ts (drop-in with build system)

**Phase 2: Foundation Classes** (No SlideEditor changes): 4. **Extendable.ts** ← 🔄 NEXT (base class) 5. **Extension.ts** (rewrite, extends Extendable) 6. **Mark.ts** (new class, extends Extendable) 7. **Node.ts** (new class, extends Extendable) 8. **ExtensionManager.ts** (rewrite for schema generation)

**Phase 3: Validation**: 9. **Create test extension** (verify system works)

**Phase 4: Convert Extensions** (No SlideEditor changes): 10. **Convert all marks** to `Mark.create()` pattern 11. **Convert all nodes** to `Node.create()` pattern 12. **Convert all extensions** to new Extension pattern

**Phase 5: Final Integration**: 13. **SlideEditor.ts** - ONE BIG INTEGRATION (use schema from ExtensionManager, add lifecycle hooks)

**Phase 6: Optional Features** (After integration): 14. InputRule.ts (standardize input rules) 15. PasteRule.ts (add paste handling) 16. NodePos.ts (query helper) 17. NodeView.ts/MarkView.ts (custom rendering - skip for now)

---

## Estimated Timeline

- **Phase 1** (Steps 1-3): ✅ Complete (30 minutes)
- **Phase 2** (Steps 4-8): 14 hours (2-3 days) - Foundation classes
- **Phase 3** (Step 9): 30 minutes - Validation
- **Phase 4** (Steps 10-12): 7 hours (1 day) - Convert extensions
- **Phase 5** (Step 13): 4 hours - Final SlideEditor integration
- **Phase 6** (Steps 14-17): 5 hours (optional)

**Total Required**: ~26 hours (3-4 days)
**Total with Optional**: ~31 hours (4-5 days)

---

## Attribution Template

For files copied heavily from Tiptap, add this header:

```typescript
/**
 * [FileName] for AutoArtifacts Slide Editor
 *
 * Adapted from @tiptap/core
 * Original Copyright (c) 2025, Tiptap GmbH
 * Licensed under MIT License
 * https://github.com/ueberdosis/tiptap
 *
 * Modifications for slide editor use case
 */
```

---

## Success Criteria

By the end of this migration:

- ✅ Extensions are configurable: `.configure({ option: value })`
- ✅ Extensions are extendable: `.extend({ addAttributes: ... })`
- ✅ Marks and nodes are class-based with factory pattern
- ✅ Schema is generated from extensions (no more manual schema file)
- ✅ Lifecycle hooks work (onCreate, onUpdate, etc.)
- ✅ All existing functionality preserved
- ✅ Tests pass
- ✅ Demo app works
- ✅ Type-safe throughout

---

## Notes

- We're keeping slide-specific features (navigation, layouts, validation)
- We're NOT becoming a general-purpose editor
- This migration gives us Tiptap's patterns while maintaining slide focus
- Future extensions will be much easier to write
- Configuration and extension will be more powerful

---

## Next Steps After Migration

Once migration is complete:

1. Create extension library (`@autoartifacts/extension-markdown`, etc.)
2. Document extension API
3. Add more lifecycle hooks as needed
4. Consider adopting Tiptap's command helpers
5. Evaluate Tiptap's utility functions for adoption
