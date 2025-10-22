#!/usr/bin/env node --import tsx

/**
 * Upgrade Instagram photos to high-res Photos app versions (V2 - filename matching)
 *
 * Matches photos by date prefix in filename and replaces low-res Instagram
 * exports with original high-res Photos app versions.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { PhotoCollection } from '../src/data/photographing/types.js'

const PHOTOS_APP_DIR = path.join(process.cwd(), 'data/from-photos-app')
const PHOTOS_JSON = path.join(process.cwd(), 'src/data/photographing/photos.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public/photographing')

// Build index of Photos app images by date prefix
console.log('📸 Building Photos app image index...')
const photosAppFiles = fs
  .readdirSync(PHOTOS_APP_DIR)
  .filter((f) => f.toLowerCase().endsWith('.jpg') && f.match(/^\d{4}-\d{2}-\d{2}/))

const photosAppByDate = new Map<string, string>()

for (const filename of photosAppFiles) {
  // Extract date prefix: 2023-07-26_17-18-33_... -> 2023-07-26
  const datePrefix = filename.substring(0, 10)
  const fullPath = path.join(PHOTOS_APP_DIR, filename)
  photosAppByDate.set(datePrefix, fullPath)
}

console.log(`Found ${photosAppByDate.size} Photos app images with dates`)

// Load current photos.json
const photoData: PhotoCollection = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'))

let matched = 0
let upgraded = 0
let notFound = 0

console.log('\n🔍 Matching and upgrading photos...\n')

for (const photo of photoData.photos) {
  // Extract date from ISO string: 2023-07-26T17:18:33.000Z -> 2023-07-26
  const photoDate = photo.date.substring(0, 10)

  const hiresPath = photosAppByDate.get(photoDate)

  if (hiresPath) {
    matched++

    // Check if this is actually higher resolution
    const currentPath = path.join(PUBLIC_DIR, photo.id, '1.jpg')

    if (fs.existsSync(currentPath)) {
      const currentSize = fs.statSync(currentPath).size
      const newSize = fs.statSync(hiresPath).size

      if (newSize > currentSize * 1.1) {
        // Only upgrade if >10% larger
        // Replace with high-res version
        fs.copyFileSync(hiresPath, currentPath)
        console.log(
          `✓ ${photo.id} - Upgraded (${Math.round(currentSize / 1024)}KB → ${Math.round(newSize / 1024)}KB)`,
        )
        upgraded++
      } else {
        console.log(`  ${photo.id} - Already good quality`)
      }
    }
  } else {
    notFound++
    if (notFound <= 10) console.log(`  ${photo.id} - No match (${photoDate})`)
  }
}

console.log('\n✨ Upgrade Complete!')
console.log('===================')
console.log(`Matched: ${matched}/${photoData.photos.length}`)
console.log(`Upgraded: ${upgraded}`)
console.log(`Not found: ${notFound}${notFound > 10 ? ` (showing first 10)` : ''}`)
console.log(`\nNote: Only dates with hires versions: ${photosAppByDate.size} days`)
