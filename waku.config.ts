import { Continent } from 'continent'
import { defineConfig } from 'waku/config'
import { Drivel } from './src/content/drivel.js'
import { Essay } from './src/content/essay.js'
import { Frame } from './src/content/frame.js'
import { Module } from './src/content/module.js'
import { Scribble } from './src/content/scribble.js'
import { Site } from './src/content/site.js'

export default defineConfig({
  vite: {
    plugins: [Continent.continentPlugin({
      definitions: [Drivel, Essay, Frame, Module, Scribble, Site],
    })],
  },
})
