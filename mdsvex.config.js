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

      return `{@html \`${html}\` }`
    },
  },
}

export default config
