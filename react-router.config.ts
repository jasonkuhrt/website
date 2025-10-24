import type { Config } from '@react-router/dev/config'
import { glob } from 'glob'
import { join } from 'node:path'

export default {
  ssr: false,
  async prerender() {
    // Use glob to find all MDX files
    const essayFiles = await glob('content/essays/*.mdx')
    const logFiles = await glob('content/logs/*.mdx')
    const scribbleFiles = await glob('content/scribbles/entries/*.mdx')

    const essaySlugs = essayFiles.map((file) => {
      const slug = file.replace('content/essays/', '').replace('.mdx', '')
      return `/writing/essays/${slug}`
    })

    const logSlugs = logFiles.map((file) => {
      const slug = file.replace('content/logs/', '').replace('.mdx', '')
      return `/writing/logs/${slug}`
    })

    const scribbleSlugs = scribbleFiles.map((file) => {
      const slug = file.replace('content/scribbles/entries/', '').replace('.mdx', '')
      return `/writing/scribbles/${slug}`
    })

    return [
      '/',
      '/bio',
      '/coding',
      '/drawing',
      '/photographing',
      '/speaking',
      '/writing',
      ...essaySlugs,
      ...logSlugs,
      ...scribbleSlugs,
    ]
  },
} satisfies Config
