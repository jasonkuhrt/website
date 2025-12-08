import { continentPlugin } from 'continent'
import { defineConfig } from 'waku/config'

export default defineConfig({
  vite: {
    plugins: [
      continentPlugin(),
    ],
  },
})
