# Test Structure - Following Jest Best Practices

## ✅ Proper Test Organization

Following Jest best practices, the `__tests__` folder structure **mirrors the src folder structure**. This makes it easy to:
1. Find tests for any given source file
2. Understand what's being tested
3. Maintain tests alongside code

---

## 📁 Current Test Structure

```
packages/core/src/
├── __tests__/                          # Global test utilities & top-level integration
│   ├── setup.ts                        # Jest setup (runs before all tests)
│   ├── testUtils.ts                    # Shared test helpers
│   └── integration.test.ts             # Top-level integration tests
│
├── actions/
│   └── __tests__/                      # Tests for actions (to be added)
│
├── commands/
│   └── __tests__/                      # Tests for commands
│       ├── slideCommands.test.ts       # Slide manipulation commands
│       ├── formattingCommands.test.ts  # Text formatting commands
│       └── historyCommands.test.ts     # Undo/redo commands
│
├── keyboard/
│   └── __tests__/                      # Tests for keyboard shortcuts (to be added)
│
├── plugins/
│   └── __tests__/                      # Tests for core plugins (to be added)
│
├── schema/
│   ├── marks/
│   │   └── __tests__/                  # Tests for mark definitions
│   │       └── marks.test.ts           # All marks tested here
│   └── nodes/
│       └── __tests__/                  # Tests for node definitions
│           └── nodes.test.ts           # All nodes tested here
│
├── utils/
│   └── __tests__/                      # Tests for utility functions
│       └── layoutParser.test.ts        # Layout parsing utilities
│
└── validation/
    └── __tests__/                      # Tests for validation (to be added)
```

---

## 🎯 Why This Structure?

### 1. **Co-location**
Tests live near the code they test, making it easy to:
- Find tests when modifying code
- Keep tests updated when code changes
- Understand the codebase structure

### 2. **Mirror Structure**
The test structure mirrors the source structure:
```
src/schema/marks/bold.ts
src/schema/marks/__tests__/marks.test.ts  ✅
```

Not:
```
src/schema/marks/bold.ts
src/__tests__/schema/marks.test.ts  ❌
```

### 3. **Scalability**
As the codebase grows:
- Each module can have its own test directory
- Tests don't get lost in a single global `__tests__` folder
- Easy to run tests for specific modules

---

## 🧪 Test File Naming

### Convention
```
[sourceFileName].test.ts
```

### Examples
- `src/utils/layoutParser.ts` → `src/utils/__tests__/layoutParser.test.ts`
- `src/commands/index.ts` → `src/commands/__tests__/slideCommands.test.ts` (grouped by functionality)
- `src/schema/marks/` → `src/schema/marks/__tests__/marks.test.ts` (all marks in one file)

---

## 📊 Current Test Coverage by Directory

| Directory | Tests | Status |
|-----------|-------|--------|
| `__tests__/` (global) | 13 integration tests | ✅ |
| `commands/__tests__/` | 79 tests (slide, formatting, history) | ✅ |
| `schema/marks/__tests__/` | 18 tests | ✅ |
| `schema/nodes/__tests__/` | 45 tests | ✅ |
| `utils/__tests__/` | 22 tests (layoutParser) | ✅ |
| `actions/__tests__/` | 0 tests | 📝 To be added |
| `keyboard/__tests__/` | 0 tests | 📝 To be added |
| `plugins/__tests__/` | 0 tests | 📝 To be added |
| `validation/__tests__/` | 0 tests | 📝 To be added |
| **Total** | **159 tests** | **✅ All passing** |

---

## 🚀 Running Tests by Directory

```bash
# Run all tests
pnpm test

# Run tests for specific directory
pnpm test commands          # All command tests
pnpm test schema            # All schema tests  
pnpm test utils             # All utility tests

# Run specific test file
pnpm test slideCommands     # Just slide command tests
pnpm test marks             # Just mark tests
```

---

## 📝 Adding New Tests

When adding tests for a new module, follow this pattern:

### 1. Create `__tests__` directory next to the source
```bash
# For a new utility file
src/utils/newUtility.ts
src/utils/__tests__/newUtility.test.ts
```

### 2. Import test utilities
```typescript
import { createTestEditor, ... } from '../../__tests__/testUtils';
```

### 3. Import the code to test
```typescript
// Relative import from the test to the source
import { myFunction } from '../newUtility';
```

---

## ✨ Benefits of This Approach

1. **Clear Organization**: Easy to see what's tested and what's not
2. **Maintainability**: Tests live with the code they test
3. **Discoverability**: No hunting for test files
4. **Module Isolation**: Can run tests per module
5. **Industry Standard**: Follows Jest and React community best practices

---

## 🔍 Next Steps for Complete Coverage

Following the established structure, add tests to empty directories:

1. **`actions/__tests__/`** - Test the actions API
2. **`keyboard/__tests__/`** - Test keyboard shortcut registration
3. **`plugins/__tests__/`** - Test markdown input rules
4. **`validation/__tests__/`** - Test validation system
5. **`utils/__tests__/`** - Add more utility tests (exporters, slideNavigation, etc.)

Each new test file should follow the same patterns established in existing tests.
