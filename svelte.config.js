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
      // Disable prerendering in GitHub Actions CI to avoid memory issues
      // Cloudflare Pages will still prerender in production
      entries: process.env.GITHUB_ACTIONS ? [] : ['*'],
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      handleUnseenRoutes: process.env.GITHUB_ACTIONS ? 'ignore' : 'fail',
    },
  },
}

export default config
