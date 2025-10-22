#!/usr/bin/env node --import tsx

/**
 * Upgrade Instagram photos to high-res Photos app versions
 *
 * Matches photos by EXIF timestamp and replaces low-res Instagram
 * exports with original high-res Photos app versions.
 */

import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { PhotoCollection } from '../src/data/photographing/types.js'

const PHOTOS_APP_DIR = path.join(process.cwd(), 'data/from-photos-app')
const PHOTOS_JSON = path.join(process.cwd(), 'src/data/photographing/photos.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public/photographing')

// Tolerance for timestamp matching (in seconds)
const TOLERANCE_SECONDS = 60

interface PhotoWithExif {
  filename: string
  fullPath: string
  timestamp: Date | null
}

// Extract EXIF timestamp from a file
const getExifTimestamp = (filePath: string): Date | null => {
  try {
    const output = execSync(`exiftool -DateTimeOriginal -CreateDate -s -s -s "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()

    if (!output) return null

    // Parse first timestamp found (format: 2023:07:26 17:18:33)
    const firstLine = output.split('\n')[0]
    const match = firstLine.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)

    if (!match) return null

    const [, year, month, day, hour, minute, second] = match
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
  } catch {
    return null
  }
}

// Build index of Photos app images with their timestamps
console.log('📸 Building Photos app image index...')
const photosAppFiles = fs.readdirSync(PHOTOS_APP_DIR).filter((f) => f.toLowerCase().endsWith('.jpg'))

const photosAppIndex: PhotoWithExif[] = []

for (const filename of photosAppFiles) {
  const fullPath = path.join(PHOTOS_APP_DIR, filename)
  const timestamp = getExifTimestamp(fullPath)

  if (timestamp) photosAppIndex.push({ filename, fullPath, timestamp })
}

console.log(`Found ${photosAppIndex.length} Photos app images with EXIF timestamps`)

// Load current photos.json
const photoData: PhotoCollection = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'))

let matched = 0
let upgraded = 0
let notFound = 0

console.log('\n🔍 Matching and upgrading photos...\n')

for (const photo of photoData.photos) {
  const photoDate = new Date(photo.date)

  // Find matching Photos app image by timestamp
  const match = photosAppIndex.find((pa) => {
    if (!pa.timestamp) return false
    const diffSeconds = Math.abs((photoDate.getTime() - pa.timestamp.getTime()) / 1000)
    return diffSeconds <= TOLERANCE_SECONDS
  })

  if (match) {
    matched++

    // Check if this is actually higher resolution
    const currentPath = path.join(PUBLIC_DIR, photo.id, '1.jpg')

    if (fs.existsSync(currentPath)) {
      const currentSize = fs.statSync(currentPath).size
      const newSize = fs.statSync(match.fullPath).size

      if (newSize > currentSize) {
        // Replace with high-res version
        fs.copyFileSync(match.fullPath, currentPath)
        console.log(
          `✓ ${photo.id} - Upgraded (${Math.round(currentSize / 1024)}KB → ${Math.round(newSize / 1024)}KB)`,
        )
        upgraded++
      } else {
        console.log(`  ${photo.id} - Instagram version is already better or same`)
      }
    }
  } else {
    notFound++
    if (notFound <= 5) console.log(`  ${photo.id} - No match found (${photo.date})`)
  }
}

console.log('\n✨ Upgrade Complete!')
console.log('===================')
console.log(`Matched: ${matched}/${photoData.photos.length}`)
console.log(`Upgraded: ${upgraded}`)
console.log(`Not found: ${notFound}${notFound > 5 ? ' (showing first 5)' : ''}`)
