import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DataFilters TypeScript',
  description: 'TypeScript implementation of DataFilters',
  outDir: './dist',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' }
        ]
      }
    ]
  }
})
