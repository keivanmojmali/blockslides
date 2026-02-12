import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const docsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blockslides",
  appearance: 'dark',
  description: "Blockslides - a ProseMiror-based slide editor ",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
  ],
  transformPageData: async (pageData) => {
    if (!pageData.filePath) return
    const fullPath = path.resolve(docsDir, pageData.filePath)
    ;(pageData as { rawMarkdown?: string }).rawMarkdown = await readFile(
      fullPath,
      'utf-8'
    )
  },
  themeConfig: {
    logo: '/favicon-32x32.png',
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 3], // Show h2 and h3 headers in "on this page"
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/getting-started/overview' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Start here', link: '/getting-started/overview' },
          {
            text: 'Quickstart',
            items: [
              { text: 'React', link: '/getting-started/quickstart/react' },
              { text: 'Vue', link: '/getting-started/quickstart/vue' },
            ]
          }
        ]
      },
      {
        text: 'Foundations',
        items: [
          {
            text: 'What can you make?',
            link: '/foundations/what-can-you-make'
          },
          { text: 'What are the schemas?', link: '/foundations/what-are-the-schemas' },
          { text: 'What are blocks?', link: '/foundations/what-are-blocks' },
          { text: 'What are extensions?', link: '/foundations/what-are-extensions' },
        ]
      },
      {
        text: 'Features',
        items: [
          {
            text: 'Working with Content',
            items: [
              { text: 'Markdown Support', link: '/features/working-with-content/markdown-support' },
              { text: 'Rich Text Formatting', link: '/features/working-with-content/rich-text-formatting' },
              { text: 'Media & Embeds', link: '/features/working-with-content/media-embeds' },
              { text: 'Tables & Math', link: '/features/working-with-content/tables-math' }
            ]
          },
          {
            text: 'Slide Management',
            items: [
              { text: 'Creating & Organizing', link: '/features/slide-management/creating-organizing' },
              { text: 'Layouts & Columns', link: '/features/slide-management/layouts-columns' },
              { text: 'Theming & Styling', link: '/features/slide-management/theming-styling' }
            ]
          },
          {
            text: 'Import & Export',
            items: [
              { text: 'Import', link: '/features/import-export/import' },
              { text: 'Export', link: '/features/import-export/export' }
            ]
          },
          {
            text: 'Editor Features',
            items: [
              { text: 'Commands API', link: '/features/editor-features/commands-api' },
              { text: 'Keyboard Shortcuts', link: '/features/editor-features/keyboard-shortcuts' },
              { text: 'Undo/Redo & History', link: '/features/editor-features/undo-redo' },
              { text: 'Drag & Drop', link: '/features/editor-features/drag-drop' }
            ]
          },
          {
            text: 'AI & Templates',
            items: [
              { text: 'AI Context', link: '/features/ai-templates/ai-context' },
              { text: 'Preset Templates', link: '/features/ai-templates/preset-templates' }
            ]
          },
          {
            text: 'Customization',
            items: [
              { text: 'Extension Kit Overview', link: '/features/customization/extension-kit-overview' },
              { text: 'Custom Extensions', link: '/features/customization/creating-extensions' },
              { text: 'Custom Blocks & Marks', link: '/features/customization/custom-blocks-marks' }
            ]
          }
        ]
      },
      {
        text: 'React',
        items: [
          { text: 'Overview', link: '/react/overview' },
          { text: 'UI Components', link: '/react/ui-components' },
          { text: 'Hooks', link: '/react/hooks' },
        ]
      },
      {
        text: 'Vue',
        items: [
          { text: 'Overview', link: '/vue/overview' },
          { text: 'Components', link: '/vue/components' },
          { text: 'Composables', link: '/vue/composables' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/keivanmojmali/blockslides' }
    ]
  }
})
