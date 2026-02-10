import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import CopyMarkdownButton from './components/CopyMarkdownButton.vue'
import HeroSlideEditor from './components/HeroSlideEditor.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(CopyMarkdownButton),
    }),
  enhanceApp({ app }) {
    // Register globally so it can be used in the hero section
    app.component('HeroSlideEditor', HeroSlideEditor)
  }
}
