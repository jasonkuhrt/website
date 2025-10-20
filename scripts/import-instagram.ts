#!/usr/bin/env tsx

/**
 * One-time Instagram export import script
 *
 * This script converts Instagram export data to generic photo format.
 * After successful migration, this file can be deleted.
 *
 * Usage:
 *   tsx scripts/import-instagram.ts <path-to-instagram-export.zip>
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { Photo, PhotoCollection } from '../src/data/photographing/types.js'

interface InstagramPost {
  caption?: string
  taken_at?: string
  creation_timestamp?: number
  media?: Array<{ uri: string }>
  uri?: string
  title?: string
}

interface InstagramExport {
  photos?: InstagramPost[]
  videos?: InstagramPost[]
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error('Usage: tsx scripts/import-instagram.ts <path-to-export-directory>')
  console.error('')
  console.error('Example: tsx scripts/import-instagram.ts ./instagram-export')
  process.exit(1)
}

const exportPath = path.resolve(args[0])

if (!fs.existsSync(exportPath)) {
  console.error(`Error: Export path does not exist: ${exportPath}`)
  process.exit(1)
}

console.log('📸 Instagram to Photography Migration')
console.log('=====================================')
console.log(`Source: ${exportPath}`)
console.log('')

// Find Instagram JSON files
const findInstagramJson = (dir: string): string[] => {
  const files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findInstagramJson(fullPath))
    } else if (entry.name.endsWith('.json') && entry.name.includes('posts')) {
      files.push(fullPath)
    }
  }

  return files
}

// Parse Instagram timestamp
const parseInstagramDate = (post: InstagramPost): string => {
  if (post.taken_at) {
    return post.taken_at
  }
  if (post.creation_timestamp) {
    return new Date(post.creation_timestamp * 1000).toISOString()
  }
  return new Date().toISOString()
}

// Generate photo ID from timestamp
const generatePhotoId = (date: string): string => {
  return date.replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')
}

// Copy media files
const copyMediaFiles = (sourcePaths: string[], photoId: string, exportDir: string): string[] => {
  const destDir = path.join(process.cwd(), 'public', 'photographing', photoId)

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const copiedPaths: string[] = []

  for (let i = 0; i < sourcePaths.length; i++) {
    const sourcePath = path.join(exportDir, sourcePaths[i])

    if (!fs.existsSync(sourcePath)) {
      console.warn(`  ⚠️  Media file not found: ${sourcePaths[i]}`)
      continue
    }

    const ext = path.extname(sourcePath)
    const destFileName = `${i + 1}${ext}`
    const destPath = path.join(destDir, destFileName)

    fs.copyFileSync(sourcePath, destPath)
    copiedPaths.push(`/photographing/${photoId}/${destFileName}`)
  }

  return copiedPaths
}

// Process posts
const processPost = (post: InstagramPost, exportDir: string): Photo | null => {
  const date = parseInstagramDate(post)
  const photoId = generatePhotoId(date)
  const caption = post.caption || post.title || ''

  // Get media paths
  const mediaPaths: string[] = []

  if (post.media && post.media.length > 0) {
    mediaPaths.push(...post.media.map((m) => m.uri))
  } else if (post.uri) {
    mediaPaths.push(post.uri)
  }

  if (mediaPaths.length === 0) {
    console.warn(`  ⚠️  No media found for post at ${date}`)
    return null
  }

  const copiedPaths = copyMediaFiles(mediaPaths, photoId, exportDir)

  if (copiedPaths.length === 0) {
    console.warn(`  ⚠️  No media files could be copied for ${photoId}`)
    return null
  }

  // Determine type
  let type: Photo['type'] = 'single'
  const hasVideo = copiedPaths.some((p) => /\.(mp4|mov)$/i.test(p))

  if (hasVideo) {
    type = 'video'
  } else if (copiedPaths.length > 1) {
    type = 'series'
  }

  const media = copiedPaths.map((p) => ({
    type: /\.(mp4|mov)$/i.test(p) ? ('video' as const) : ('image' as const),
    path: p,
  }))

  return {
    id: photoId,
    type,
    caption,
    date,
    media,
  }
}

// Main processing
const jsonFiles = findInstagramJson(exportPath)

if (jsonFiles.length === 0) {
  console.error('Error: No Instagram JSON files found in export')
  console.error('Looking for files named *posts*.json')
  process.exit(1)
}

console.log(`Found ${jsonFiles.length} JSON file(s)`)
console.log('')

const allPhotos: Photo[] = []
let skipped = 0

for (const jsonFile of jsonFiles) {
  console.log(`Processing: ${path.basename(jsonFile)}`)

  const content = fs.readFileSync(jsonFile, 'utf-8')
  const data: InstagramExport = JSON.parse(content)

  const posts = [...(data.photos || []), ...(data.videos || [])]

  for (const post of posts) {
    const photo = processPost(post, path.dirname(jsonFile))

    if (photo) {
      allPhotos.push(photo)
      console.log(`  ✓ ${photo.id} (${photo.type})`)
    } else {
      skipped++
    }
  }
}

// Sort by date (newest first)
allPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// Create photo collection
const photoCollection: PhotoCollection = {
  photos: allPhotos,
  lastUpdated: new Date().toISOString(),
  totalCount: allPhotos.length,
}

// Write to photos.json
const outputPath = path.join(process.cwd(), 'src', 'data', 'photographing', 'photos.json')

fs.writeFileSync(outputPath, JSON.stringify(photoCollection, null, 2))

console.log('')
console.log('✨ Migration Complete!')
console.log('====================')
console.log(`Photos imported: ${allPhotos.length}`)
console.log(`Skipped: ${skipped}`)
console.log(`Output: ${outputPath}`)
console.log('')
console.log('Next steps:')
console.log('1. Run: pnpm build')
console.log('2. Check the photographing page')
console.log('3. Delete this script if everything looks good!')
