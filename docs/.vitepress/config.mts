import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blockslides",
  description: "Blockslides - a ProseMiror-based slide editor ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/markdown-examples' }
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
            text: 'Blocks and Extensions',
            items: [
              { text: 'Markdown', link: '/features/blocks-and-extensions/markdown' },
              {
                text: 'Extensions',
                items: [
                  {
                    text: 'Overview',
                    link: '/features/blocks-and-extensions/extensions/overview'
                  },
                  {
                    text: 'Slide',
                    link: '/features/blocks-and-extensions/extensions/slide'
                  },
                  {
                    text: 'Add Slide Button',
                    link: '/features/blocks-and-extensions/extensions/add-slide-button'
                  },
                  {
                    text: 'Bubble Menu',
                    link: '/features/blocks-and-extensions/extensions/bubble-menu'
                  },
                  {
                    text: 'Image Block',
                    link: '/features/blocks-and-extensions/extensions/image-block'
                  }
                ]
              }
            ]
          },
          { text: 'Import', link: '/features/import' },
          { text: 'Export', link: '/features/export' },
          { text: 'AI Context', link: '/features/ai-context' },
          { text: 'Editor API', link: '/features/editor-api' }
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
