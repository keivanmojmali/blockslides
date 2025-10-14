# Validation

Content validation system that ensures document structure integrity and provides auto-fix capabilities.

## 📁 Files

```
validation/
├── index.ts              # Public API exports
├── validator.ts          # Core validation logic
└── validatorInstance.ts  # Validator instance factory
```

## 🎯 Overview

The validation system provides:

1. **Structure Validation** - Ensures JSON follows schema rules
2. **Type Checking** - Validates node and mark types
3. **Attribute Validation** - Checks required attributes
4. **Content Rules** - Validates parent-child relationships
5. **Auto-Fix** - Automatically fixes common issues
6. **Detailed Reports** - Provides actionable error messages

## 📖 API Reference

### validateContent(content, options?)

Main validation function.

```typescript
function validateContent(
  content: any,
  options?: ValidationOptions
): ValidationResult

interface ValidationOptions {
  mode?: 'strict' | 'lenient';  // Default: 'lenient'
  autoFix?: boolean;             // Default: false
  throwOnError?: boolean;        // Default: false
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  fixed?: any;  // Auto-fixed content (if autoFix: true)
}
```

**Usage:**

```typescript
import { validateContent } from 'autoartifacts';

const result = validateContent(myContent, {
  mode: 'strict',
  autoFix: true
});

if (!result.valid) {
  console.error('Errors:', result.errors);
  console.warn('Warnings:', result.warnings);
  
  if (result.fixed) {
    console.log('Using fixed content:', result.fixed);
  }
}
```

### isValidContent(content)

Quick validation check (returns boolean).

```typescript
function isValidContent(content: any): boolean

// Usage
if (!isValidContent(myContent)) {
  console.error('Invalid content!');
}
```

### getValidationIssues(content)

Get all validation issues without fixing.

```typescript
function getValidationIssues(content: any): ValidationIssue[]

// Usage
const issues = getValidationIssues(myContent);
issues.forEach(issue => {
  console.log(`${issue.type}: ${issue.message} at ${issue.path}`);
});
```

### safeValidateContent(content)

Validation that never throws (returns result even if content is completely invalid).

```typescript
function safeValidateContent(content: any): ValidationResult

// Usage
const result = safeValidateContent(untrustedContent);
// Always returns a result, never throws
```

### ValidationError

Error class thrown when validation fails with `throwOnError: true`.

```typescript
class ValidationError extends Error {
  result: ValidationResult;
}

// Usage
try {
  validateContent(content, { throwOnError: true });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.result);
  }
}
```

### createValidator()

Create a validator instance (used by editor ref).

```typescript
interface ContentValidator {
  validate(content: any, options?: ValidationOptions): ValidationResult;
  isValid(content: any): boolean;
  getIssues(content: any): ValidationIssue[];
}

function createValidator(): ContentValidator

// Usage
const validator = createValidator();
const result = validator.validate(content);
```

## 📊 Validation Issue Types

### ValidationIssue

```typescript
interface ValidationIssue {
  type: 'error' | 'warning';
  path: string;              // JSON path like "content[0].content[1]"
  message: string;           // Human-readable message
  code: string;              // Error code
  expected?: any;            // What was expected
  received?: any;            // What was received
  autoFixable: boolean;      // Can be auto-fixed?
}
```

**Example Issue:**

```typescript
{
  type: 'error',
  path: 'content[0]',
  message: 'Missing required property: type',
  code: 'MISSING_TYPE',
  expected: 'string',
  received: undefined,
  autoFixable: true
}
```

## 🔍 Validation Modes

### Lenient Mode (Default)

- Validates structure and types
- Allows missing optional attributes
- Reports errors for critical issues
- Reports warnings for minor issues
- Returns `valid: true` if no errors (warnings OK)

**Use when:**
- Loading user content
- During editing
- When content might be incomplete

```typescript
validateContent(content, { mode: 'lenient' });
```

### Strict Mode

- Validates everything in lenient mode
- Treats warnings as errors
- Requires all optional attributes
- Returns `valid: false` for any issues

**Use when:**
- Exporting content
- Publishing presentations
- Need 100% valid content

```typescript
validateContent(content, { mode: 'strict' });
```

## 🔧 Auto-Fix Capabilities

Enable with `autoFix: true`:

```typescript
const result = validateContent(content, { autoFix: true });
if (result.fixed) {
  // Use the fixed content
  setContent(result.fixed);
}
```

**What Can Be Auto-Fixed:**

1. **Missing Type** - Adds default type based on context
2. **Missing Required Attrs** - Adds default attributes
3. **Invalid Content** - Wraps in proper container
4. **Empty Arrays** - Adds default content
5. **Wrong Node Placement** - Moves to correct parent

**Example:**

```typescript
// Before
const invalid = {
  content: [
    { text: 'Hello' }  // Missing type
  ]
};

// After auto-fix
const fixed = {
  type: 'doc',
  content: [
    {
      type: 'slide',
      content: [
        {
          type: 'row',
          content: [
            {
              type: 'column',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Hello' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
```

## 🎯 Common Validation Errors

### MISSING_TYPE

```typescript
// ❌ Error
{ content: [] }

// ✅ Fixed
{ type: 'doc', content: [] }
```

### INVALID_TYPE

```typescript
// ❌ Error
{ type: 'invalid', content: [] }

// ✅ Fixed
{ type: 'doc', content: [] }
```

### MISSING_REQUIRED_ATTR

```typescript
// ❌ Error (heading requires level)
{ type: 'heading', content: [] }

// ✅ Fixed
{ type: 'heading', attrs: { level: 1 }, content: [] }
```

### INVALID_CONTENT_TYPE

```typescript
// ❌ Error (doc can only contain slides)
{
  type: 'doc',
  content: [
    { type: 'paragraph', content: [] }  // Wrong!
  ]
}

// ✅ Fixed (wrapped in proper structure)
{
  type: 'doc',
  content: [
    {
      type: 'slide',
      content: [
        {
          type: 'row',
          content: [
            {
              type: 'column',
              content: [
                { type: 'paragraph', content: [] }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### EMPTY_CONTENT

```typescript
// ❌ Warning
{ type: 'paragraph', content: [] }

// ✅ Fixed
{ type: 'paragraph', content: [{ type: 'text', text: '' }] }
```

## 🎯 Usage in Components

### In SlideEditor

The SlideEditor automatically validates content:

```tsx
<SlideEditor
  content={content}
  validationMode="lenient"     // or 'strict' or 'off'
  autoFixContent={true}        // Auto-fix issues
  onValidationError={(result) => {
    console.error('Validation failed:', result);
  }}
/>
```

### Manual Validation

```tsx
import { validateContent, ValidationError } from 'autoartifacts';

function MyEditor() {
  const handleSave = () => {
    const result = validateContent(content, {
      mode: 'strict',
      autoFix: true
    });
    
    if (!result.valid) {
      // Show errors to user
      alert(`Cannot save: ${result.errors.length} errors`);
      return;
    }
    
    // Save the content (use fixed if available)
    const contentToSave = result.fixed || content;
    saveToServer(contentToSave);
  };
  
  return (
    <>
      <SlideEditor content={content} />
      <button onClick={handleSave}>Save</button>
    </>
  );
}
```

### Using the Validator Instance

Access via editor ref:

```tsx
function ValidationPanel({ editorRef }) {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  
  const validateNow = () => {
    const validator = editorRef.current?.validator;
    if (!validator) return;
    
    const content = editorRef.current.getJSON();
    const allIssues = validator.getIssues(content);
    setIssues(allIssues);
  };
  
  return (
    <div>
      <button onClick={validateNow}>Validate</button>
      {issues.map((issue, i) => (
        <div key={i} className={issue.type}>
          {issue.message} at {issue.path}
        </div>
      ))}
    </div>
  );
}
```

## 🔒 Safety & Performance

### Null Safety

All validation functions handle null/undefined:

```typescript
const result = validateContent(null);
// Returns: { valid: false, errors: [...], warnings: [] }

const isValid = isValidContent(undefined);
// Returns: false
```

### Performance

- Validation is fast (< 1ms for typical documents)
- Uses single-pass traversal
- Caches validation results (when appropriate)
- Non-blocking (doesn't freeze UI)

### Memory

- Auto-fix creates new objects (immutable)
- Original content is never mutated
- Fixed content shares structure where possible

## 🧪 Testing

### Test Valid Content

```typescript
const validContent = {
  type: 'doc',
  content: [
    {
      type: 'slide',
      content: [
        {
          type: 'row',
          attrs: { layout: '1' },
          content: [
            {
              type: 'column',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Hello' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const result = validateContent(validContent);
console.assert(result.valid === true);
console.assert(result.errors.length === 0);
```

### Test Invalid Content

```typescript
const invalidContent = {
  content: [
    { text: 'Hello' }  // Missing types
  ]
};

const result = validateContent(invalidContent, { autoFix: true });
console.assert(result.valid === false);
console.assert(result.errors.length > 0);
console.assert(result.fixed !== undefined);
```

### Test Error Handling

```typescript
try {
  validateContent(invalidContent, { 
    mode: 'strict',
    throwOnError: true 
  });
} catch (error) {
  console.assert(error instanceof ValidationError);
  console.log('Errors:', error.result.errors);
}
```

## 📚 Related Documentation

- [Schema Documentation](../schema/README.md) - Schema rules
- [Types Documentation](../types/README.md) - Type definitions
- [Components Documentation](../components/README.md) - Usage in components
- [Main README](../../README.md)

---

For more examples, see the [demo application](../../demo/README.md).

