# AutoArtifacts Monorepo

This repository has been restructured as a monorepo containing multiple packages.

## 📦 Packages

### Core Packages

#### `@autoartifacts/core`
**Location:** `packages/core`

The core ProseMirror-based slide editor with essential built-in features.

**Includes:**
- Complete schema (nodes and marks)
- All editor commands
- Essential plugins (placeholder, add-slide-button)
- Utilities (layout parser, content redistribution, navigation, etc.)
- Type definitions
- Validation system
- Keyboard shortcuts

**Dependencies:**
- ProseMirror packages

---

#### `@autoartifacts/react`
**Location:** `packages/react`

React components and hooks for AutoArtifacts.

**Includes:**
- `SlideEditor` component
- `KeyboardShortcutsHelp` component
- `useSlideEditor` hook
- `useHistoryState` hook

**Dependencies:**
- `@autoartifacts/core`
- `react` & `react-dom` (peer dependencies)

---

#### `@autoartifacts/styles`
**Location:** `packages/styles`

CSS styles for the editor.

**Includes:**
- Complete stylesheet for editor UI
- Theme support (light/dark)
- Layout styles
- Plugin styles

---

### Optional Plugins

#### `@autoartifacts/plugin-layout-picker`
**Location:** `packages/plugins/layout-picker`

Visual template selector for choosing slide layouts.

**Features:**
- Shows layout templates on empty slides
- Predefined layouts (1-1, 2-1, 1-2, 1-1-1)
- Customizable templates
- Automatic placeholder content generation

**Dependencies:**
- `@autoartifacts/core`

---

## 🚀 Getting Started

### Installation

Install all dependencies:
```bash
pnpm install
```

### Building

Build all packages:
```bash
pnpm run build
```

Build in watch mode:
```bash
pnpm run dev
```

### Running Demo

```bash
cd demo
pnpm run dev
```

---

## 📝 Usage

### Basic Setup (React)

```bash
npm install @autoartifacts/react @autoartifacts/styles
```

```tsx
import { SlideEditor } from '@autoartifacts/react';
import '@autoartifacts/styles';

function App() {
  return (
    <SlideEditor
      content="<slide>...</slide>"
      onChange={(content) => console.log(content)}
    />
  );
}
```

**What's included:**
- ✅ Core editor with all commands
- ✅ Essential plugins (placeholder, add-slide-button)
- ✅ Complete schema
- ✅ All utilities

---

### With Optional Plugins

```bash
npm install @autoartifacts/react @autoartifacts/styles \
  @autoartifacts/plugin-layout-picker
```

```tsx
import { SlideEditor } from '@autoartifacts/react';
import { createLayoutPickerPlugin, DEFAULT_LAYOUTS } from '@autoartifacts/plugin-layout-picker';
import '@autoartifacts/styles';

function App() {
  return (
    <SlideEditor
      plugins={[
        createLayoutPickerPlugin({
          layouts: DEFAULT_LAYOUTS,
          title: 'Choose a layout',
          subtitle: 'Select a template to get started'
        })
      ]}
    />
  );
}
```

---

## 🏗️ Structure

```
autoartifacts/
├── packages/
│   ├── core/                    # @autoartifacts/core
│   ├── react/                   # @autoartifacts/react
│   ├── plugins/
│   │   └── layout-picker/       # @autoartifacts/plugin-layout-picker
│   └── styles/                  # @autoartifacts/styles
├── demo/                        # Demo application
├── pnpm-workspace.yaml          # Workspace configuration
├── tsconfig.base.json           # Shared TypeScript config
└── package.json                 # Root package
```

---

## 🔧 Development

### Adding a New Package

1. Create package directory: `packages/your-package/`
2. Add `package.json` with workspace dependencies
3. Add `tsconfig.json` extending `tsconfig.base.json`
4. Add to `pnpm-workspace.yaml` if needed
5. Run `pnpm install` to link packages

### Building Individual Packages

```bash
# Build core
cd packages/core && pnpm run build

# Build React
cd packages/react && pnpm run build

# Build plugin
cd packages/plugins/layout-picker && pnpm run build
```

---

## 📦 Publishing

Each package can be published independently:

```bash
# Publish all packages
pnpm run publish --filter @autoartifacts/*

# Publish specific package
cd packages/core && npm publish --access public
```

---

## 🎯 Benefits of Monorepo

1. **Tree-shakeable** - Users only bundle what they import
2. **Independent versioning** - Update packages independently
3. **Framework-agnostic core** - Works with React, Vue, Svelte, etc.
4. **Plugin ecosystem** - Easy to create and share plugins
5. **Clear dependencies** - Each package declares what it needs
6. **Shared tooling** - TypeScript config, linting, etc.

---

## 📚 Documentation

- [Core API](packages/core/README.md)
- [React Components](packages/react/README.md)
- [Layout Picker Plugin](packages/plugins/layout-picker/README.md)

---

## ⚠️ Migration Notes

The old `src/` directory structure has been reorganized:

**Before:**
```
src/
├── schema/
├── commands/
├── components/      # React components
├── hooks/           # React hooks
├── plugins/         # All plugins
└── ...
```

**After:**
```
packages/
├── core/src/        # Framework-agnostic
│   ├── schema/
│   ├── commands/
│   ├── plugins/     # Essential plugins only
│   └── ...
├── react/src/       # React-specific
│   ├── components/
│   └── hooks/
└── plugins/         # Optional plugins
    └── layout-picker/
```

**Import Changes:**
```typescript
// Before
import { schema } from '../schema';
import { SlideEditor } from '../components/SlideEditor';

// After
import { schema } from '@autoartifacts/core';
import { SlideEditor } from '@autoartifacts/react';
```

