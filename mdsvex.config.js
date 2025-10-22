import { codeToHtml } from 'shiki'

/** @type {import('mdsvex').MdsvexOptions} */
const config = {
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const html = await codeToHtml(code, {
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
