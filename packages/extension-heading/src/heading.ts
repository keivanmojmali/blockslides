import { mergeAttributes, Node, textblockTypeInputRule } from '@blockslides/core'

/**
 * The heading level options.
 */
export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingOptions {
  /**
   * The available heading levels.
   * @default [1, 2, 3, 4, 5, 6]
   * @example [1, 2, 3]
   */
  levels: Level[]

  /**
   * The HTML attributes for a heading node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>

  /**
   * Inject opinionated CSS for headings.
   * @default true
   */
  injectCSS: boolean

  /**
   * The CSS string injected when `injectCSS` is true.
   */
  styles: string
}

declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    heading: {
      /**
       * Set a heading node
       * @param attributes The heading attributes
       * @example editor.commands.setHeading({ level: 1 })
       */
      setHeading: (attributes: { level: Level }) => ReturnType
      /**
       * Toggle a heading node
       * @param attributes The heading attributes
       * @example editor.commands.toggleHeading({ level: 1 })
       */
      toggleHeading: (attributes: { level: Level }) => ReturnType
    }
  }
}

/**
 * This extension allows you to create headings.
 * @see https://www.tiptap.dev/api/nodes/heading
 */
export const Heading = Node.create<HeadingOptions>({
  name: 'heading',

  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {},
      injectCSS: true,
      styles: `
      [data-node-type="slide"] h1 {
        font-weight: 700;
        font-size: 2.8rem;
        line-height: 3.5rem;
        letter-spacing: -0.08rem;
        font-variant-ligatures: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
    
      [data-node-type="slide"] h2 {
        font-weight: 700;
        font-size: 2.2rem;
        line-height: 2.8rem;
        letter-spacing: -0.06rem;
        font-variant-ligatures: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
      }
    
      [data-node-type="slide"] h3 {
        font-weight: 600;
        font-size: 1.8rem;
        line-height: 2.2rem;
        letter-spacing: -0.04rem;
        font-variant-ligatures: none;
      }
    
      [data-node-type="slide"] h4 {
        font-weight: 600;
        font-size: 1.5rem;
        line-height: 2rem;
        letter-spacing: -0.02rem;
      }
    
      [data-node-type="slide"] h5 {
        font-weight: 600;
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
    
      [data-node-type="slide"] h6 {
        font-weight: 600;
        font-size: 1.05rem;
        line-height: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 0.08rem;
      }
    
      [data-node-type="slide"] h1 + p,
      [data-node-type="slide"] h2 + p,
      [data-node-type="slide"] h3 + p {
        margin-top: 0.75rem;
      }
    `,
    }
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    }
  },

  onCreate() {
    if (!this.options.injectCSS || typeof document === 'undefined') {
      return
    }

    const styleId = 'blockslides-heading-defaults'
    if (document.getElementById(styleId)) {
      return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = this.options.styles.trim()
    document.head.appendChild(style)
  },

  parseHTML() {
    return this.options.levels.map((level: Level) => ({
      tag: `h${level}`,
      attrs: { level },
    }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel ? node.attrs.level : this.options.levels[0]

    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  parseMarkdown: (token, helpers) => {
    // Convert 'heading' token to heading node
    // marked provides 'depth' property (1-6) for heading level
    return helpers.createNode('heading', { level: token.depth || 1 }, helpers.parseInline(token.tokens || []))
  },

  renderMarkdown: (node, h) => {
    const level = node.attrs?.level ? parseInt(node.attrs.level as string, 10) : 1
    const headingChars = '#'.repeat(level)

    if (!node.content) {
      return ''
    }

    // Use current context for proper joining/spacing
    return `${headingChars} ${h.renderChildren(node.content)}`
  },

  addCommands() {
    return {
      setHeading:
        attributes =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }

          return commands.setNode(this.name, attributes)
        },
      toggleHeading:
        attributes =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }

          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
    }
  },

  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level }),
        },
      }),
      {},
    )
  },

  addInputRules() {
    return this.options.levels.map(level => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{${Math.min(...this.options.levels)},${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level,
        },
      })
    })
  },
})
