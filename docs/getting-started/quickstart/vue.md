# Quickstart: Vue

Get a working slide editor running in your Vue 3 application in minutes using the pre-built `SlideEditor` component.

## Installation

Install the pre-built components package (includes all dependencies):

```bash
pnpm add @blockslides/vue-3-prebuilts @blockslides/core @blockslides/pm
```

::: tip Package structure
`@blockslides/vue-3-prebuilts` includes ready-to-use components like `SlideEditor` and `useSlideEditor`. For low-level primitives only, use `@blockslides/vue-3`.
:::

Blockslides requires **Vue 3.0 or higher** as a peer dependency.

## Your first editor

Add the following to your Vue component:

```ts
import { SlideEditor } from '@blockslides/vue-3-prebuilts'

  <SlideEditor 
    //:content="initialContent"
    //@change="handleChange"
  />
```

That's it. This gives you a fully-functional slide editor with 50+ extensions automatically configured (text formatting, images, videos, tables, layouts, and more).
