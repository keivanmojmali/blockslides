import { Extension, createStyleTag } from '@blockslides/core'

/**
 * Spacing token values
 */
export type SpacingToken = 'none' | 'sm' | 'md' | 'lg'

/**
 * Border radius token values
 */
export type BorderRadiusToken = 'none' | 'sm' | 'md' | 'lg'

/**
 * Alignment values
 */
export type AlignValue = 'left' | 'center' | 'right' | 'stretch'

/**
 * Justify values (vertical distribution)
 */
export type JustifyValue = 'start' | 'center' | 'end' | 'space-between'

export interface BlockAttributesOptions {
  /**
   * Block types that receive the base attributes
   * @default ['heading', 'paragraph', 'imageBlock', 'column', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'horizontalRule', 'youtube', 'table']
   */
  types: string[]

  /**
   * Spacing token values
   */
  spacing: Record<SpacingToken, string>

  /**
   * Border radius token values
   */
  borderRadius: Record<BorderRadiusToken, string>

  /**
   * Whether to inject CSS styles
   * @default true
   */
  injectCSS: boolean

  /**
   * Content Security Policy nonce
   */
  injectNonce?: string
}

declare module '@blockslides/core' {
  interface Commands<ReturnType> {
    blockAttributes: {
      /**
       * Set the align attribute on the current block
       */
      setBlockAlign: (align: AlignValue) => ReturnType
      /**
       * Set the padding attribute on the current block
       */
      setBlockPadding: (padding: SpacingToken | string) => ReturnType
      /**
       * Set the margin attribute on the current block
       */
      setBlockMargin: (margin: SpacingToken | string) => ReturnType
      /**
       * Set the gap attribute on the current block
       */
      setBlockGap: (gap: SpacingToken | string) => ReturnType
      /**
       * Set the background color on the current block
       */
      setBlockBackgroundColor: (color: string | null) => ReturnType
      /**
       * Set the background image on the current block
       */
      setBlockBackgroundImage: (url: string | null) => ReturnType
      /**
       * Set the border radius on the current block
       */
      setBlockBorderRadius: (radius: BorderRadiusToken | string) => ReturnType
      /**
       * Set the fill attribute on the current block
       */
      setBlockFill: (fill: boolean) => ReturnType
      /**
       * Set the width on the current block
       */
      setBlockWidth: (width: string | null) => ReturnType
      /**
       * Set the height on the current block
       */
      setBlockHeight: (height: string | null) => ReturnType
    }
  }
}

const blockAttributesStyles = `
/* ═══════════════════════════════════════════════════════════════ */
/* ALIGNMENT                                                        */
/* ═══════════════════════════════════════════════════════════════ */
[data-align="left"] {
  text-align: left;
  align-self: flex-start;
}
[data-align="center"] {
  text-align: center;
  align-self: center;
}
[data-align="right"] {
  text-align: right;
  align-self: flex-end;
}
[data-align="stretch"] {
  align-self: stretch;
}

/* ═══════════════════════════════════════════════════════════════ */
/* FILL BEHAVIOR                                                    */
/* ═══════════════════════════════════════════════════════════════ */
[data-fill="true"] {
  flex: 1 1 auto;
}

/* ═══════════════════════════════════════════════════════════════ */
/* JUSTIFY (vertical distribution for containers)                   */
/* ═══════════════════════════════════════════════════════════════ */
[data-justify="start"] {
  justify-content: flex-start;
}
[data-justify="center"] {
  justify-content: center;
}
[data-justify="end"] {
  justify-content: flex-end;
}
[data-justify="space-between"] {
  justify-content: space-between;
}
`

/**
 * BlockAttributes Extension
 * 
 * Adds common attributes (align, padding, margin, gap, backgroundColor, 
 * backgroundImage, borderRadius, border, fill, width, height) to all 
 * specified block types using addGlobalAttributes.
 */
export const BlockAttributes = Extension.create<BlockAttributesOptions>({
  name: 'blockAttributes',

  addOptions() {
    return {
      types: [
        'heading',
        'paragraph',
        'imageBlock',
        'column',
        'bulletList',
        'orderedList',
        'blockquote',
        'codeBlock',
        'horizontalRule',
        'youtube',
        'table',
      ],
      spacing: {
        none: '0',
        sm: '8px',
        md: '16px',
        lg: '32px',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      injectCSS: true,
      injectNonce: undefined,
    }
  },

  onCreate() {
    if (!this.options.injectCSS || typeof document === 'undefined') {
      return
    }
    createStyleTag(blockAttributesStyles, this.options.injectNonce, 'block-attributes')
  },

  addGlobalAttributes() {
    const { spacing, borderRadius } = this.options

    const resolveSpacing = (value: string | null | undefined): string | null => {
      if (!value) return null
      return spacing[value as SpacingToken] || value
    }

    const resolveBorderRadius = (value: string | null | undefined): string | null => {
      if (!value) return null
      return borderRadius[value as BorderRadiusToken] || value
    }

    return [
      {
        types: this.options.types,
        attributes: {
          // ═══════════════════════════════════════════════════════════════
          // ALIGNMENT
          // ═══════════════════════════════════════════════════════════════
          align: {
            default: null,
            parseHTML: element => element.getAttribute('data-align'),
            renderHTML: attributes => {
              if (!attributes.align) return {}
              return { 'data-align': attributes.align }
            },
          },

          // ═══════════════════════════════════════════════════════════════
          // SPACING
          // ═══════════════════════════════════════════════════════════════
          padding: {
            default: null,
            parseHTML: element => element.getAttribute('data-padding'),
            renderHTML: attributes => {
              if (!attributes.padding) return {}
              const value = resolveSpacing(attributes.padding)
              return {
                'data-padding': attributes.padding,
                style: value ? `padding: ${value}` : undefined,
              }
            },
          },

          margin: {
            default: null,
            parseHTML: element => element.getAttribute('data-margin'),
            renderHTML: attributes => {
              if (!attributes.margin) return {}
              const value = resolveSpacing(attributes.margin)
              return {
                'data-margin': attributes.margin,
                style: value ? `margin: ${value}` : undefined,
              }
            },
          },

          gap: {
            default: null,
            parseHTML: element => element.getAttribute('data-gap'),
            renderHTML: attributes => {
              if (!attributes.gap) return {}
              const value = resolveSpacing(attributes.gap)
              return {
                'data-gap': attributes.gap,
                style: value ? `gap: ${value}` : undefined,
              }
            },
          },

          // ═══════════════════════════════════════════════════════════════
          // BACKGROUND
          // ═══════════════════════════════════════════════════════════════
          backgroundColor: {
            default: null,
            parseHTML: element => element.getAttribute('data-bg-color'),
            renderHTML: attributes => {
              if (!attributes.backgroundColor) return {}
              return {
                'data-bg-color': attributes.backgroundColor,
                style: `background-color: ${attributes.backgroundColor}`,
              }
            },
          },

          backgroundImage: {
            default: null,
            parseHTML: element => element.getAttribute('data-bg-image'),
            renderHTML: attributes => {
              if (!attributes.backgroundImage) return {}
              const escaped = String(attributes.backgroundImage).replace(/"/g, '\\"')
              return {
                'data-bg-image': attributes.backgroundImage,
                style: `background-image: url("${escaped}"); background-size: cover; background-position: center; background-repeat: no-repeat`,
              }
            },
          },

          // ═══════════════════════════════════════════════════════════════
          // DECORATION
          // ═══════════════════════════════════════════════════════════════
          borderRadius: {
            default: null,
            parseHTML: element => element.getAttribute('data-border-radius'),
            renderHTML: attributes => {
              if (!attributes.borderRadius) return {}
              const value = resolveBorderRadius(attributes.borderRadius)
              return {
                'data-border-radius': attributes.borderRadius,
                style: value ? `border-radius: ${value}` : undefined,
              }
            },
          },

          border: {
            default: null,
            parseHTML: element => element.getAttribute('data-border'),
            renderHTML: attributes => {
              if (!attributes.border) return {}
              return {
                'data-border': attributes.border,
                style: `border: ${attributes.border}`,
              }
            },
          },

          // ═══════════════════════════════════════════════════════════════
          // SIZING
          // ═══════════════════════════════════════════════════════════════
          fill: {
            default: null,
            parseHTML: element => element.getAttribute('data-fill') === 'true',
            renderHTML: attributes => {
              if (!attributes.fill) return {}
              return { 'data-fill': 'true' }
            },
          },

          width: {
            default: null,
            parseHTML: element => element.getAttribute('data-width'),
            renderHTML: attributes => {
              if (!attributes.width) return {}
              return {
                'data-width': attributes.width,
                style: `width: ${attributes.width}`,
              }
            },
          },

          height: {
            default: null,
            parseHTML: element => element.getAttribute('data-height'),
            renderHTML: attributes => {
              if (!attributes.height) return {}
              return {
                'data-height': attributes.height,
                style: `height: ${attributes.height}`,
              }
            },
          },

          // ═══════════════════════════════════════════════════════════════
          // JUSTIFY (for container blocks like column)
          // ═══════════════════════════════════════════════════════════════
          justify: {
            default: null,
            parseHTML: element => element.getAttribute('data-justify'),
            renderHTML: attributes => {
              if (!attributes.justify) return {}
              return { 'data-justify': attributes.justify }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setBlockAlign:
        (align: AlignValue) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { align }))
            .every(r => r)
        },

      setBlockPadding:
        (padding: SpacingToken | string) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { padding }))
            .every(r => r)
        },

      setBlockMargin:
        (margin: SpacingToken | string) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { margin }))
            .every(r => r)
        },

      setBlockGap:
        (gap: SpacingToken | string) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { gap }))
            .every(r => r)
        },

      setBlockBackgroundColor:
        (color: string | null) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { backgroundColor: color }))
            .every(r => r)
        },

      setBlockBackgroundImage:
        (url: string | null) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { backgroundImage: url }))
            .every(r => r)
        },

      setBlockBorderRadius:
        (radius: BorderRadiusToken | string) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { borderRadius: radius }))
            .every(r => r)
        },

      setBlockFill:
        (fill: boolean) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { fill }))
            .every(r => r)
        },

      setBlockWidth:
        (width: string | null) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { width }))
            .every(r => r)
        },

      setBlockHeight:
        (height: string | null) =>
        ({ commands }) => {
          return this.options.types
            .map(type => commands.updateAttributes(type, { height }))
            .every(r => r)
        },
    }
  },
})
