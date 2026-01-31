import 'vitepress'

declare module 'vitepress' {
  interface PageData {
    rawMarkdown?: string
  }
}
