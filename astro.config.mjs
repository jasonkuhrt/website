import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://jasonkuhrt.com',
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    svelte({
      onwarn(warning, handler) {
        // Suppress performance-impacting warnings in dev
        if (warning.code.startsWith('a11y_')) return
        if (warning.code === 'css_unused_selector') return
        if (warning.code === 'svelte_component_deprecated') return
        if (warning.code === 'element_invalid_self_closing_tag') return
        handler(warning)
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['svelte', 'lucide-svelte'],
    },
    server: {
      warmup: {
        clientFiles: [
          './src/components/PhotoGrid.svelte',
          './src/components/Timeline.svelte',
          './src/components/ThemeControl.svelte',
          './src/components/PhotoGallery.svelte',
          './src/components/RepoRefreshTimer.svelte',
        ],
      },
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
})
