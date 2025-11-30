import { Continent } from 'continent'
import { defineConfig } from 'waku/config'
import { Drivel } from './src/content/drivel.js'
import { Essays } from './src/content/essays.js'
import { Scribbles } from './src/content/scribbles.js'

export default defineConfig({
  vite: {
    plugins: [Continent.assetsPlugin({
      definitions: [Essays, Drivel, Scribbles],
    })],
  },
})
