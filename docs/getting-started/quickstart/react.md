# Quickstart: React

Get a working slide editor running in your React application in minutes using the pre-built `ReactSlideEditor` component.

## Installation

Install the pre-built components package (includes all dependencies):

```bash
pnpm add @blockslides/react-prebuilts @blockslides/core @blockslides/pm
```

::: tip Package structure
`@blockslides/react-prebuilts` includes ready-to-use components like `ReactSlideEditor` and `useSlideEditor`. For low-level primitives only, use `@blockslides/react`.
:::

Blockslides requires **React 17 or higher** as a peer dependency.

## Your first editor

Here's a complete example showing the essential features:

```tsx
"use client" // if on nextjs

import { ReactSlideEditor } from '@blockslides/react-prebuilts'

export default function App() {
  return <ReactSlideEditor 
    // content={initialContent}
    // onChange={(doc) => console.log(doc)}
  />
}
```

That's it. This gives you a fully-functional slide editor with 50+ extensions automatically configured (text formatting, images, videos, tables, layouts, and more).

::: tip Pre-built component
`ReactSlideEditor` includes everything to get started quickly. For complete control over layout and rendering, see [Using hooks](/react/hooks) below.
:::
