/**
 * ExtensionKit Examples
 * 
 * This file contains various examples of how to use the ExtensionKit
 * with different configurations.
 */

import { useSlideEditor } from '@autoartifacts/react'
import { ExtensionKit } from '@autoartifacts/extension-kit'

// Example 1: Use all extensions with defaults
const editor1 = useSlideEditor({
  extensions: [
    ExtensionKit
  ]
})

// Example 2: Exclude specific extensions
const editor2 = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Exclude extensions you don't need
      document: false,
      dropcursor: false,
      heading: false,
      horizontalRule: false,
      blockquote: false,
    })
  ]
})

// Example 3: Configure extensions with custom options
const editor3 = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      heading: {
        levels: [2, 3], // Only allow h2 and h3
      },
      link: {
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'custom-link',
        },
      },
      placeholder: {
        placeholder: 'Start typing your presentation...',
      },
      image: {
        inline: true,
        allowBase64: true,
      },
    })
  ]
})

// Example 4: Minimal editor (only basic text editing)
const editor4 = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Only keep essential extensions
      bold: {},
      italic: {},
      underline: {},
      paragraph: {},
      hardBreak: {},
      undoRedo: {},
      
      // Exclude everything else
      heading: false,
      blockquote: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
      listKeymap: false,
      code: false,
      codeBlock: false,
      strike: false,
      link: false,
      image: false,
      table: false,
    })
  ]
})

// Example 5: Presentation editor (slide-focused)
const editor5 = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Keep slide extensions
      slide: {},
      addSlideButton: {},
      
      // Configure text formatting
      heading: { levels: [1, 2, 3] },
      bold: {},
      italic: {},
      underline: {},
      
      // Configure lists
      bulletList: {},
      orderedList: {},
      listItem: {},
      listKeymap: {},
      
      // Add media
      image: { inline: true },
      youtube: {},
      
      // Exclude advanced features
      table: false,
      codeBlock: false,
      codeBlockLowlight: false,
      mathematics: false,
      emoji: false,
    })
  ]
})

// Example 6: Rich content editor (all features)
const editor6 = useSlideEditor({
  extensions: [
    ExtensionKit.configure({
      // Text formatting
      bold: {},
      italic: {},
      underline: {},
      strike: {},
      code: {},
      subscript: {},
      superscript: {},
      
      // Text styling
      color: { types: ['textStyle'] },
      highlight: { multicolor: true },
      textAlign: {
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      },
      
      // Blocks
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      paragraph: {},
      blockquote: {},
      codeBlockLowlight: {
        defaultLanguage: 'javascript',
      },
      
      // Lists
      bulletList: {},
      orderedList: {},
      listItem: {},
      listKeymap: {},
      
      // Media
      image: { inline: true, allowBase64: true },
      youtube: {},
      
      // Advanced
      table: { resizable: true },
      mathematics: {},
      emoji: {},
      
      // UI
      placeholder: { placeholder: 'Type something amazing...' },
      bubbleMenu: {},
      floatingMenu: {},
    })
  ]
})

export {
  editor1,
  editor2,
  editor3,
  editor4,
  editor5,
  editor6,
}
