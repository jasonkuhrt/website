import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import mdsvexConfig from './mdsvex.config.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: [
          '<build>',
          '<prerendered>',
          '/photographing/*',
          '/bio/*',
          '/images/*',
          '/favicon.ico',
          '/favicon.svg',
          '/robots.txt',
        ],
      },
    }),
    alias: {
      $lib: 'src/lib',
      '$lib/*': 'src/lib/*',
      $components: 'src/lib/components',
      '$components/*': 'src/lib/components/*',
      $data: 'src/data',
      '$data/*': 'src/data/*',
    },
    prerender: {
      entries: ['*'],
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      handleUnseenRoutes: 'fail',
      concurrency: 1,
    },
  },
}

export default config
