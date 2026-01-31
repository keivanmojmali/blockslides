# Quickstart: React

Get a working slide editor running in your React application in minutes using the pre-built `ReactSlideEditor` component.

## Installation

Install the core packages:

```bash
pnpm add @blockslides/react @blockslides/core @blockslides/pm
```

Blockslides requires **React 17 or higher** as a peer dependency.

## Your first editor

Here's a complete example showing the essential features:

```tsx
import { ReactSlideEditor } from '@blockslides/react'
import type { JSONContent, Editor } from '@blockslides/react'

export default function MyEditor() {
  // Pass your initial content here
  const initialContent = {
    type: 'doc',
    content: [ 
      {
        type: 'slide',
        attrs: { size: '16x9', id: 'slide-1' },
        content: [
          {
            type: 'column',
            attrs: { align: 'center', justify: 'center' },
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Welcome' }]
              }
            ]
          }
        ]
      }
    ]
  }

  const handleChange = (doc: JSONContent, editor: Editor) => {
    console.log('Document updated:', doc)
    // Logs: { type: 'doc', content: [...] }
  }

  return (
    <ReactSlideEditor 
      // content={initialContent} Comes with example slide 
      onChange={handleChange}
      extensionKitOptions={{
        slide: { renderMode: 'dynamic' } // Scales to fit viewport
      }}
    />
  )
}
```

That's it. This gives you a fully-functional slide editor with 50+ extensions automatically configured (text formatting, images, videos, tables, layouts, and more).

::: tip Pre-built component
`ReactSlideEditor` includes everything to get started quickly. For complete control over layout and rendering, see [Using hooks](#using-hooks-for-more-control) below.
:::
