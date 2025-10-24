import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [rehypeSlug],
    }),
    reactRouter(),
    tailwindcss(),
  ],
  server: {
    port: 5175,
  },
})
