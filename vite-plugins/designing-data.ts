import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:designing-data'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export function designingDataPlugin(): Plugin {
  return {
    name: 'vite-plugin-designing-data',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const designingDir = path.resolve(process.cwd(), 'public/designing')
        const dataPath = path.join(designingDir, 'data.json')

        // Read existing data for metadata
        const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

        // Get all project directories
        const projectDirs = fs.readdirSync(designingDir)
          .filter(name => {
            const fullPath = path.join(designingDir, name)
            return fs.statSync(fullPath).isDirectory()
          })

        const projects = projectDirs.map(projectId => {
          const projectDir = path.join(designingDir, projectId)

          // Find existing project data or use defaults
          const existing = existingData.projects.find((p: any) => p.id === projectId) || {
            title: projectId,
            description: '',
            date: new Date().toISOString().split('T')[0],
            appreciations: 0,
            views: 0,
            tags: [],
            hide: false,
          }

          // Get all image files
          const allFiles = fs.readdirSync(projectDir)

          // Determine cover file name
          const specifiedCover = existing.cover || 'cover.jpg'
          const coverExists = allFiles.includes(specifiedCover)

          // Get all image files (excluding cover file if it exists)
          const imageFiles = allFiles
            .filter(f => /\.(jpg|png|jpeg)$/i.test(f) && (!coverExists || f !== specifiedCover))
            .sort()

          // Determine cover image path
          // If specified cover doesn't exist, use first image as cover
          const coverFileName = coverExists ? specifiedCover : imageFiles[0]
          const coverImage = `/designing/${projectId}/${coverFileName}`

          // Build image paths (exclude cover if it's from imageFiles)
          const images = coverExists ?
            imageFiles.map(filename => `/designing/${projectId}/${filename}`) :
            imageFiles.slice(1).map(filename => `/designing/${projectId}/${filename}`) // Skip first image (used as cover)

          return {
            id: projectId,
            title: existing.title,
            description: existing.description,
            coverImage,
            ...(existing.cover && { cover: existing.cover }),
            images,
            date: existing.date,
            appreciations: existing.appreciations,
            views: existing.views,
            tags: existing.tags,
            ...(existing.hide && { hide: true }),
            ...(existing.order !== undefined && { order: existing.order }),
          }
        })

        const data = {
          projects,
          lastUpdated: new Date().toISOString(),
        }

        return `export default ${JSON.stringify(data, null, 2)}`
      }
    },

    // Watch for changes in the designing directory
    configureServer(server) {
      const designingDir = path.resolve(process.cwd(), 'public/designing')

      server.watcher.add(designingDir)

      server.watcher.on('all', (event, file) => {
        if (file.startsWith(designingDir)) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            server.ws.send({ type: 'full-reload' })
          }
        }
      })
    },
  }
}
