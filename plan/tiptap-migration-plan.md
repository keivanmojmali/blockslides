# Tiptap Architecture Migration Plan for AutoArtifacts Slide Editor

**Goal**: Adopt Tiptap's battle-tested architecture while maintaining slide editor functionality.

**Status**: ✅ EventEmitter.ts (complete), ✅ CommandManager.ts (complete)

**Last**: SlideEditor.ts (final integration)

---

## Phase 1: Core Utilities (Drop-in)

### Step 1: Tracker.ts ✨ NEW

**Priority**: Low (optional utility)
**Effort**: 5 minutes
**Attribution**: Full file from Tiptap (MIT License)

**What**:

- Copy `Tracker.ts` from Tiptap as-is
- Pure utility class for tracking positions through transactions
- Useful for commands that need to track node positions during transformations

**Changes needed**:

- ✅ None - works as-is

**Integration**:

- Export from `index.ts`
- Use in future commands that transform documents (e.g., moving slides)

**Dependencies**: Only ProseMirror Transaction type

---

### Step 2: style.ts ✨ NEW

**Priority**: Low (nice-to-have)
**Effort**: 10 minutes
**Attribution**: Full file from Tiptap (MIT License)

**What**:

- Copy `style.ts` CSS string constant from Tiptap
- Provides default ProseMirror editor styles

**Changes needed**:

- ✅ None - just a CSS string

**Integration**:

- Import in `SlideEditor.ts` constructor
- Inject into DOM using `createStyleTag` utility (copy from Tiptap utilities)
- Add `injectCSS: boolean` option to `SlideEditorOptions` (default: true)

**Dependencies**: None

---

### Step 3: jsx-runtime.ts ✨ NEW

**Priority**: Low (quality of life)
**Effort**: 10 minutes
**Attribution**: Full file from Tiptap (MIT License)

**What**:

- Copy `jsx-runtime.ts` from Tiptap as-is
- Enables JSX syntax in `renderHTML()` methods
- Better than array syntax: `<strong><slot /></strong>` vs `['strong', 0]`

**Changes needed**:

- ✅ None - works as-is

**Integration**:

- Export from `index.ts`
- Update `tsconfig.json` to support JSX:
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

---

## Phase 2: Foundation Classes

### Step 4: Extendable.ts 🔥 MAJOR

**Priority**: HIGH - Required for Mark/Node/Extension refactor
**Effort**: 2 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)

**What**:

- Base class for Extension/Mark/Node
- Provides `.create()`, `.configure()`, `.extend()` factory pattern
- Adds 40+ lifecycle hooks (onCreate, onUpdate, onDestroy, etc.)
- Enables extension configuration and inheritance

**Changes needed**:

- Change `Editor` → `SlideEditor` throughout
- Adapt `ExtendableConfig` interface for slide editor needs
- May simplify some hooks not needed for slides

**Integration**:

- Export from `index.ts`
- Foundation for Steps 5, 6, 7
- Update type definitions in `types/` directory

**Dependencies**:

- EventEmitter (✅ done)
- ProseMirror model/state types

**Files to update after**:

- `types/commands.ts` - Add hook types
- `types/index.ts` - Export new types

---

### Step 5: Extension.ts 🔥 MAJOR REWRITE

**Priority**: HIGH - Core architecture change
**Effort**: 3 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)

**What**:

- Rewrite current `Extension.ts` to extend `Extendable`
- Change from simple OOP class to factory-based pattern
- Add `type = 'extension'` property
- Implement `ExtensionConfig` interface

**Changes needed**:

- Extend `Extendable` instead of standalone class
- Add static `.create(config)` method
- Change `Editor` → `SlideEditor`
- Keep slide-specific features

**Integration**:

- Replace existing `Extension.ts`
- Update all existing extensions (CoreCommands, etc.)
- Update `ExtensionManager.ts` to use new pattern

**Dependencies**:

- Step 4: Extendable.ts

**Files to update after**:

- `extensions/CoreCommands.ts` - Refactor to new pattern
- All extension files in `extensions/` directory
- `ExtensionManager.ts` - Handle new Extension type

---

### Step 6: Mark.ts 🔥 MAJOR NEW FILE

**Priority**: HIGH - Schema architecture change
**Effort**: 4 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)

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
- Convert all marks in `schema/marks/` to use new pattern

**Dependencies**:

- Step 4: Extendable.ts

**Files to update after**:

- `schema/marks/bold.ts` - Convert to `Mark.create()`
- `schema/marks/italic.ts` - Convert to `Mark.create()`
- `schema/marks/code.ts` - Convert to `Mark.create()`
- `schema/marks/link.ts` - Convert to `Mark.create()`
- `schema/marks/subscript.ts` - Convert to `Mark.create()`
- `schema/marks/superscript.ts` - Convert to `Mark.create()`
- `schema/marks/underline.ts` - Convert to `Mark.create()`
- `schema/marks/highlight.ts` - Convert to `Mark.create()`
- `schema/marks/textStyle.ts` - Convert to `Mark.create()`
- `schema/index.ts` - Generate marks from Mark extensions

---

### Step 7: Node.ts 🔥 MAJOR NEW FILE

**Priority**: HIGH - Schema architecture change
**Effort**: 5 hours (more nodes than marks)
**Attribution**: Heavily adapted from Tiptap (MIT License)

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
- Convert all nodes in `schema/nodes/` to use new pattern

**Dependencies**:

- Step 4: Extendable.ts

**Files to update after**:

- `schema/nodes/doc.ts` - Convert to `Node.create()`
- `schema/nodes/slide.ts` - Convert to `Node.create()`
- `schema/nodes/column.ts` - Convert to `Node.create()`
- `schema/nodes/paragraph.ts` - Convert to `Node.create()`
- `schema/nodes/heading.ts` - Convert to `Node.create()`
- `schema/nodes/bulletList.ts` - Convert to `Node.create()`
- `schema/nodes/orderedList.ts` - Convert to `Node.create()`
- `schema/nodes/listItem.ts` - Convert to `Node.create()`
- `schema/nodes/code.ts` - Convert to `Node.create()`
- `schema/nodes/image.ts` - Convert to `Node.create()`
- `schema/nodes/text.ts` - Convert to `Node.create()`
- `schema/index.ts` - Generate nodes from Node extensions

---

## Phase 3: Extension Manager Upgrade

### Step 8: ExtensionManager.ts 🔥 MAJOR REWRITE

**Priority**: HIGH - Required for schema generation
**Effort**: 3 hours
**Attribution**: Heavily adapted from Tiptap (MIT License)

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
- Update `SlideEditor.ts` to use schema from ExtensionManager

**Dependencies**:

- Step 4: Extendable.ts
- Step 5: Extension.ts
- Step 6: Mark.ts
- Step 7: Node.ts

**Files to update after**:

- `SlideEditor.ts` - Use `extensionManager.schema` instead of imported schema
- `schema/index.ts` - May become obsolete or just export defaults
- Remove direct schema imports, use extension-generated schema

---

## Phase 4: Advanced Features (Optional)

### Step 9: InputRule.ts ⚠️ UPGRADE (Optional)

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

### Step 10: PasteRule.ts ⚠️ NEW (Optional)

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

### Step 11: NodePos.ts ⚠️ NEW (Optional)

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

### Step 12: NodeView.ts & MarkView.ts (Skip for now)

**Priority**: VERY LOW - Not needed yet
**Effort**: 4 hours each
**Note**: Only implement when you need React/Vue custom node rendering

---

## Phase 5: Final Integration

### Step 13: SlideEditor.ts 🔥 MAJOR REWRITE (FINAL)

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

**Required Steps (Must do in order)**:

1. ✅ EventEmitter.ts (done)
2. ✅ CommandManager.ts (done)
3. Tracker.ts (drop-in)
4. style.ts (drop-in)
5. jsx-runtime.ts (drop-in)
6. **Extendable.ts** ← START HERE
7. **Extension.ts** (rewrite)
8. **Mark.ts** (new, refactor all marks)
9. **Node.ts** (new, refactor all nodes)
10. **ExtensionManager.ts** (rewrite)
11. **SlideEditor.ts** (final integration)

**Optional Steps (Can add later)**:

- InputRule.ts (standardize input rules)
- PasteRule.ts (add paste handling)
- NodePos.ts (query helper)
- NodeView.ts/MarkView.ts (custom rendering - skip for now)

---

## Estimated Timeline

- Phase 1 (Steps 1-3): 25 minutes
- Phase 2 (Steps 4-7): 14 hours (2-3 days)
- Phase 3 (Step 8): 3 hours
- Phase 4 (Steps 9-11): 5 hours (optional)
- Phase 5 (Step 13): 4 hours
- **Total Required**: ~22 hours (3-4 days)
- **Total with Optional**: ~27 hours (4-5 days)

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
