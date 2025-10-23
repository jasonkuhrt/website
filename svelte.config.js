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
      // Disable prerendering in CI to avoid memory issues
      // Cloudflare Pages will still prerender in production
      entries: process.env.CI ? [] : ['*'],
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      handleUnseenRoutes: process.env.CI ? 'ignore' : 'fail',
    },
  },
}

export default config
