import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blockslides",
  description: "Blockslides - a ProseMiror-based slide editor ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/getting-started/overview' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/getting-started/overview' },
          {
            text: 'Quickstart',
            items: [
              { text: 'React', link: '/getting-started/quickstart/react' },
              { text: 'Vue (coming soon)', link: '/getting-started/quickstart/vue' }
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
              { text: 'Creating Custom Extensions', link: '/features/customization/creating-extensions' },
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
          { text: 'Themes', link: '/react/themes' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/keivanmojmali/blockslides' }
    ]
  }
})
