import { Continent } from 'continent'
import { defineConfig } from 'waku/config'
import { Capturing } from './src/content/capturing.js'
import { Drivel } from './src/content/drivel.js'
import { Essays } from './src/content/essays.js'
import { Scribbles } from './src/content/scribbles.js'

export default defineConfig({
  vite: {
    plugins: [Continent.continentPlugin({
      definitions: [Essays, Drivel, Scribbles, Capturing],
    })],
  },
})
