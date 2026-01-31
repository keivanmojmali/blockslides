import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CopyMarkdownButton from './components/CopyMarkdownButton.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(CopyMarkdownButton),
    }),
}
