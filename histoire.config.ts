import { HstSvelte } from '@histoire/plugin-svelte'
import { defineConfig } from 'histoire'

export default defineConfig({
  plugins: [HstSvelte()],
  setupFile: '/src/histoire.setup.ts',
  theme: {
    title: 'Kuhrt Components',
    logoHref: '/',
  },
  vite: {
    server: {
      port: 6006,
    },
  },
})
