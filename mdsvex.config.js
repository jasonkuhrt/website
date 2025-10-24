import rehypeSlug from 'rehype-slug'
import { createHighlighter } from 'shiki'

// Create a single shared highlighter instance (reused across all code blocks)
let highlighterPromise

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'tokyo-night'],
      langs: [
        'javascript',
        'typescript',
        'bash',
        'sh',
        'shell',
        'json',
        'html',
        'css',
        'yaml',
        'markdown',
        'haskell',
        'graphql',
        'diff',
        'dockerfile',
      ],
    })
  }
  return highlighterPromise
}

/** @type {import('mdsvex').MdsvexOptions} */
const config = {
  extensions: ['.md'],
  rehypePlugins: [rehypeSlug],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await getHighlighter()
      const html = highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: 'github-light',
          dark: 'tokyo-night',
        },
        defaultColor: false,
      })

      // Escape backticks and backslashes in HTML to prevent template literal syntax errors
      const escapedHtml = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
      return `{@html \`${escapedHtml}\` }`
    },
  },
}

export default config
