import mdx from '@mdx-js/rollup'
import { reactRouter } from '@react-router/dev/vite'
import rehypeShiki from '@shikijs/rehype'
import react from '@vitejs/plugin-react'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import { designingDataPlugin, reposDataPlugin } from './vite-plugins/__.js'

export default defineConfig({
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
  plugins: [
    designingDataPlugin(),
    reposDataPlugin(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: {
                // Available light themes: vitesse-light, min-light, one-light, everforest-light,
                // solarized-light, material-theme-lighter, github-light-default,
                // github-light-high-contrast, gruvbox-light-soft/medium/hard
                light: 'min-light',
                dark: 'tokyo-night',
              },
              defaultColor: 'light',
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
    },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    reactRouter(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  server: {
    port: 5175,
  },
})
