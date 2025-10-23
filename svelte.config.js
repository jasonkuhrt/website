import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
      '$lib/*': 'src/lib/*',
      $components: 'src/lib/components',
      '$components/*': 'src/lib/components/*',
      $data: 'src/data',
      '$data/*': 'src/data/*',
    },
    prerender: {
      // Disable prerendering in CI environments to avoid memory issues
      // Pages are rendered on-demand at runtime instead
      entries: (process.env.GITHUB_ACTIONS || process.env.CF_PAGES) ? [] : ['*'],
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      handleUnseenRoutes: (process.env.GITHUB_ACTIONS || process.env.CF_PAGES) ? 'ignore' : 'fail',
    },
  },
}

export default config
