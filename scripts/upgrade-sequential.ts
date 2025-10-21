#!/usr/bin/env node --import tsx

/**
 * Upgrade Instagram photos using sequential Photos app export
 *
 * Assumes Photos app export is numbered 1.jpg, 2.jpg, etc. from oldest to newest.
 * Matches with photos.json (which is newest first) by reversing and counting through groups.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import type { PhotoCollection } from '../src/data/photographing/types.js'

const PHOTOS_APP_DIR = path.join(process.cwd(), 'data/numbered')
const PHOTOS_JSON = path.join(process.cwd(), 'src/data/photographing/photos.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public/photographing')

// Load current photos.json
const photoData: PhotoCollection = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'))

// Reverse to get oldest-first (matching sequential export)
const photosOldestFirst = [...photoData.photos].reverse()

console.log('📸 Sequential Photo Upgrade')
console.log('============================')
console.log(`Total photos in export: ${photosOldestFirst.length}`)
console.log('Processing from oldest to newest...\n')

let fileCounter = 1
let upgraded = 0
let skipped = 0
let errors = 0

for (const photo of photosOldestFirst) {
  const mediaCount = photo.media.length
  const isGroup = mediaCount > 1

  console.log(`\n📷 ${photo.id} (${photo.date.substring(0, 10)})`)
  console.log(`   Type: ${photo.type}, Media count: ${mediaCount}`)
  console.log(`   Files: ${fileCounter}${mediaCount > 1 ? `-${fileCounter + mediaCount - 1}` : ''}.jpeg`)

  // Process each media item in this photo/group
  for (let i = 0; i < mediaCount; i++) {
    const mediaItem = photo.media[i]
    const sourceFile = path.join(PHOTOS_APP_DIR, `${fileCounter}.jpeg`)
    const targetPath = path.join(PUBLIC_DIR, photo.id, `${i + 1}.jpg`)

    // Check if source exists
    if (!fs.existsSync(sourceFile)) {
      console.log(`   ⚠️  Source missing: ${fileCounter}.jpeg`)
      errors++
      fileCounter++
      continue
    }

    // Check if target exists
    if (!fs.existsSync(targetPath)) {
      console.log(`   ⚠️  Target missing: ${path.basename(targetPath)}`)
      skipped++
      fileCounter++
      continue
    }

    const sourceSize = fs.statSync(sourceFile).size
    const targetSize = fs.statSync(targetPath).size

    // Only upgrade if significantly larger (>10%)
    if (sourceSize > targetSize * 1.1) {
      fs.copyFileSync(sourceFile, targetPath)
      console.log(
        `   ✓ Upgraded ${i + 1}/${mediaCount}: ${Math.round(targetSize / 1024)}KB → ${Math.round(sourceSize / 1024)}KB`,
      )
      upgraded++
    } else {
      console.log(`   - Kept ${i + 1}/${mediaCount}: Already good quality`)
      skipped++
    }

    fileCounter++
  }
}

console.log('\n✨ Sequential Upgrade Complete!')
console.log('===============================')
console.log(`Processed: ${fileCounter - 1} files`)
console.log(`Upgraded: ${upgraded}`)
console.log(`Skipped: ${skipped} (already good quality)`)
console.log(`Errors: ${errors} (missing files)`)
