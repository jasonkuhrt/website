import type { Config } from '@react-router/dev/config'
import { glob } from 'glob'
import portfolioData from './public/designing/data.json'

export default {
  ssr: false,
  async prerender() {
    // Use glob to find all MDX files
    const essayFiles = await glob('content/essays/*.mdx')
    const drivelFiles = await glob('content/drivel/*.mdx')
    const scribbleFiles = await glob('content/scribbles/entries/*.mdx')

    const essaySlugs = essayFiles.map((file) => {
      const slug = file.replace('content/essays/', '').replace('.mdx', '')
      return `/writing/essays/${slug}`
    })

    const drivelSlugs = drivelFiles.map((file) => {
      const slug = file.replace('content/drivel/', '').replace('.mdx', '')
      return `/writing/drivel/${slug}`
    })

    const scribbleSlugs = scribbleFiles.map((file) => {
      const slug = file.replace('content/scribbles/entries/', '').replace('.mdx', '')
      return `/writing/scribbles/${slug}`
    })

    // Add designing project pages (exclude hidden)
    const designingSlugs = portfolioData.projects
      .filter((project) => !project.hide)
      .map((project) => `/designing/${project.id}`)

    return [
      '/',
      '/bio',
      '/crafting',
      '/designing',
      '/capturing',
      '/speaking',
      '/writing',
      ...essaySlugs,
      ...drivelSlugs,
      ...scribbleSlugs,
      ...designingSlugs,
    ]
  },
} satisfies Config
