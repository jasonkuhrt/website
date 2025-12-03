import { continentPlugin } from 'continent'
import { defineConfig } from 'waku/config'
import { Drivel } from './src/content/drivel.js'
import { Essay } from './src/content/essay.js'
import { Experience } from './src/content/experience.js'
import { Frame } from './src/content/frame.js'
import { Module } from './src/content/module.js'
import { Profile } from './src/content/profile.js'
import { Scribble } from './src/content/scribble.js'
import { Site } from './src/content/site.js'

export default defineConfig({
  vite: {
    plugins: [
      continentPlugin({
        definitions: [Essay, Drivel, Scribble, Site, Profile, Experience, Frame, Module],
      }),
    ],
  },
})
