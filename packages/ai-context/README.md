## @blockslides/ai-context

Versioned context atoms, examples, schemas, and types for guiding LLMs to create/edit **BlockSlides JSON** (slides, rows, columns, image blocks, sizing, etc).

This package is designed to be read by **LLMs** and **humans**: it gives you ready‑made prompt text, examples, and schemas so another AI can reliably generate and edit BlockSlides documents.

---

### Install

```bash
pnpm add @blockslides/ai-context
# or
npm install @blockslides/ai-context
```

---

### Exports overview

```ts
import {
  contextsV1,
  bundlesV1,
  examplesV1,
  recipesV1,
  schemasV1,
  // Types
  SizeKey,
  SlideAttrs,
  RowAttrs,
  ColumnAttrs,
  ImageBlockAttrs,
} from '@blockslides/ai-context';
```

- **contextsV1**: Small, focused instruction strings that describe:
  - **`core`**: global JSON rules and invariants.
  - **`fullDocument`**: how the root `doc` and its top‑level children are shaped.
  - **`slide`**, **`row`**, **`column`**, **`imageBlock`**: contracts for each node.
  - **`style`**: how to use styling and `className` safely (e.g. Tailwind).
  - **`editingRules`**: do/don’t rules for editing an existing document.
  - **`sizing`**: allowed slide `size` values and when to use them.

- **bundlesV1**: Pre‑composed context strings:
  - **`minimalCreate`** – core + full document + slide/row/column/style.  
    Good default for “create a deck” flows.
  - **`imageEditing`** – core + full document + imageBlock + editingRules.  
    Good for “edit image blocks” flows.
  - **`all`** – everything combined (heavier, but fully featured).

- **examplesV1**:
  - **`slides`**, **`flyers`** – realistic BlockSlides JSON examples that models can imitate.

- **recipesV1**:
  - **`createSlide`**, **`addTwoColumns`**, **`editImageToCover`** – textual recipes describing *how* to use the schema to perform common operations.

- **schemasV1**:
  - JSON Schemas for validating and tooling (`slide`, `row`, `column`, `imageBlock`, etc.).

- **Types**:
  - `SizeKey`, `SlideAttrs`, `RowAttrs`, `ColumnAttrs`, `ImageBlockAttrs` – TypeScript types that describe the attributes an LLM should output.

---

### Quick start: build a system prompt for an LLM

The typical pattern is to build a **single context string** and feed it as the **system prompt** (or “instructions”) to your LLM.

```ts
import { bundlesV1, examplesV1 } from '@blockslides/ai-context';

// Use a prebuilt bundle
const baseCtx = bundlesV1.minimalCreate;

// Optionally extend with examples
const systemContext = [
  'You are a BlockSlides layout assistant.',
  'You ONLY output JSON (no prose), following the schemas described below.',
  '',
  baseCtx,
  examplesV1.slides, // optional, but helps models learn good patterns
].join('\n\n');
```

Now pass `systemContext` to your LLM:

```ts
const messages = [
  { role: 'system', content: systemContext },
  {
    role: 'user',
    content:
      'Create a 3-slide presentation about electric vehicles. ' +
      'Use slide size "16x9" for all slides. Return ONLY JSON.',
  },
];

// Call your LLM client of choice with these messages.
// Then JSON.parse the result and feed it to BlockSlides.
```

---

### Using atomic contexts directly

If you need more control, you can assemble your own context from the atomic pieces:

```ts
import { contextsV1, examplesV1 } from '@blockslides/ai-context';

const ctx = [
  contextsV1.core,
  contextsV1.fullDocument,
  contextsV1.slide,
  contextsV1.row,
  contextsV1.column,
  contextsV1.style,
  contextsV1.sizing,
  examplesV1.slides,
].join('\n\n');
```

This is equivalent in spirit to `bundlesV1.minimalCreate`, but allows you to add/remove individual contexts as your use‑case evolves.

---

### Prebuilt bundles (recommended starting points)

```ts
import { bundlesV1 } from '@blockslides/ai-context';

// Minimal set for creating new documents
const createCtx = bundlesV1.minimalCreate;

// Focused set for editing image blocks in an existing doc
const imageEditingCtx = bundlesV1.imageEditing;

// Full set of all V1 contexts
const fullCtx = bundlesV1.all;
```

Use these directly as your system prompt content, or combine them with additional project‑specific instructions.

---

### Editing existing documents

For “edit this JSON” workflows, include **editing rules** and the current document:

```ts
import { bundlesV1 } from '@blockslides/ai-context';

const editCtx = [
  bundlesV1.imageEditing, // core + fullDocument + imageBlock + editingRules
].join('\n\n');

const messages = [
  { role: 'system', content: editCtx },
  {
    role: 'user',
    content: [
      'Here is the current document JSON:',
      JSON.stringify(currentDoc, null, 2),
      '',
      'Task: Change only the first slide’s image to layout="cover" and fullBleed=true.',
      'Return the FULL updated JSON document.',
    ].join('\n'),
  },
];
```

The LLM is instructed to **minimize changes** and respect the existing IDs/structure.

---

### Using recipes to steer behavior

Recipes are textual “playbooks” that describe multi‑step operations.

```ts
import { bundlesV1, recipesV1 } from '@blockslides/ai-context';

const systemContext = [
  bundlesV1.minimalCreate,
  '',
  'You may follow these high-level recipes:',
  recipesV1.createSlide,
  recipesV1.addTwoColumns,
].join('\n\n');
```

This helps the model understand how to translate user intentions (“add two columns below the hero image”) into valid BlockSlides JSON operations.

---

### Validating AI output with schemas

`schemasV1` exposes JSON Schemas you can plug into tools like AJV, Zod (via adapters), or your own validator.

```ts
import { schemasV1 } from '@blockslides/ai-context';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });
const validateSlide = ajv.compile(schemasV1.slide);

const isValid = validateSlide(candidateSlide);

if (!isValid) {
  console.error('Invalid slide:', validateSlide.errors);
}
```

You can validate:

- Individual nodes (`schemasV1.slide`, `schemasV1.row`, `schemasV1.column`, `schemasV1.imageBlock`).
- Or a whole document by:
  - Ensuring `doc.type === "doc"`.
  - Ensuring each top‑level node validates against `schemasV1.slide`.

---

### Types for tooling and safety

The TypeScript types exported from `types/v1` mirror what the LLM is expected to produce:

```ts
import {
  SizeKey,
  SlideAttrs,
  RowAttrs,
  ColumnAttrs,
  ImageBlockAttrs,
} from '@blockslides/ai-context';

const size: SizeKey = '16x9'; // or '4x3', 'a4-portrait', etc.

const slideAttrs: SlideAttrs = {
  id: 'intro',
  size: '16x9',
  className: 'bg-slate-950 text-white',
};

const imageAttrs: ImageBlockAttrs = {
  src: 'https://example.com/hero.jpg',
  layout: 'cover',
  align: 'center',
  fullBleed: true,
};
```

Use these in your app or integration layer to:

- Strongly type the content you send to / receive from the model.
- Drive form builders or visual editors that sit in front of the LLM.
- Narrow the surface area of what the model is allowed to change.

---

### Versioning notes (for humans and AIs)

- All exports in this package are **versioned** under `*V1` (e.g. `contextsV1`, `bundlesV1`).
- When constructing prompts, it’s a good idea to say explicitly:  
  **“You are using @blockslides/ai-context v1.”**
- If/when a V2 is added, you will be able to run V1 and V2 side‑by‑side by choosing the appropriate namespace.

This README is safe for LLM ingestion: you can copy its text directly into a system prompt to teach a new AI how to work with BlockSlides JSON via `@blockslides/ai-context`.