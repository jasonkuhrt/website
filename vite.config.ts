import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import rehypeShiki from '@shikijs/rehype'
import tailwindcss from '@tailwindcss/vite'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import { designingDataPlugin } from './vite-plugin-designing-data'

export default defineConfig({
  plugins: [
    designingDataPlugin(),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeShiki,
          {
            theme: 'tokyo-night',
            langs: [
              'bash',
              'diff',
              'docker',
              'graphql',
              'haskell',
              'json',
              'python',
              'typescript',
              'yaml',
            ],
          },
        ],
      ],
    }),
    reactRouter(),
    tailwindcss(),
  ],
  server: {
    port: 5175,
  },
})
