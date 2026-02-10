# Quickstart: Vue

Get a working slide editor running in your Vue 3 application in minutes using the pre-built `SlideEditor` component.

## Installation

Install the core packages:

```bash
pnpm add @blockslides/vue-3 @blockslides/core @blockslides/pm
```

Blockslides requires **Vue 3.0 or higher** as a peer dependency.

## Your first editor

Here's a complete example showing the essential features:

```typescript
import { SlideEditor } from '@blockslides/vue-3'
import type { JSONContent, Editor } from '@blockslides/vue-3'


//Styled container for demo - delete if you want
  <div style="background-color: #f3f4f6; height: 100%; padding: 3rem; display: flex; justify-content: center;">
    <SlideEditor 
      :content="initialContent"
      :onChange="handleChange"
      :extensionKitOptions="{
        slide: { renderMode: 'dynamic' } // Scales to fit viewport
      }"
    />
  </div>
```

That's it. This gives you a fully-functional slide editor with 50+ extensions automatically configured (text formatting, images, videos, tables, layouts, and more).

::: tip Pre-built component
`SlideEditor` includes everything to get started quickly. For complete control over layout and rendering, see [Using composables](/vue/composables) below.
:::
