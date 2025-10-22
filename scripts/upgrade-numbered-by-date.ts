#!/usr/bin/env node --import tsx

/**
 * Upgrade Instagram photos using numbered Photos app export with EXIF matching
 *
 * Reads EXIF dates from numbered files and matches to Instagram photos by date.
 */

import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import type { PhotoCollection } from '../src/data/photographing/types.js'

const PHOTOS_APP_DIR = path.join(process.cwd(), 'data/numbered')
const PHOTOS_JSON = path.join(process.cwd(), 'src/data/photographing/photos.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public/photographing')

// Tolerance for timestamp matching (in seconds)
const TOLERANCE_SECONDS = 60

// Extract EXIF timestamp from a file
const getExifTimestamp = (filePath: string): Date | null => {
  try {
    const output = execSync(`exiftool -DateTimeOriginal -CreateDate -s -s -s "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()

    if (!output) return null

    // Parse first timestamp found (format: 2022:02:27 09:49:00)
    const firstLine = output.split('\n')[0]
    const match = firstLine.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)

    if (!match) return null

    const [, year, month, day, hour, minute, second] = match
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
  } catch {
    return null
  }
}

// Build index of numbered files with their timestamps
console.log('📸 Building numbered files index...')
const numberedFiles = fs
  .readdirSync(PHOTOS_APP_DIR)
  .filter((f) => f.match(/^\d+\.jpeg$/))
  .sort((a, b) => parseInt(a) - parseInt(b))

interface FileWithDate {
  filename: string
  fullPath: string
  timestamp: Date
  used: boolean
}

const filesWithDates: FileWithDate[] = []

for (const filename of numberedFiles) {
  const fullPath = path.join(PHOTOS_APP_DIR, filename)
  const timestamp = getExifTimestamp(fullPath)

  if (timestamp) filesWithDates.push({ filename, fullPath, timestamp, used: false })
  else console.log(`⚠️  No EXIF date: ${filename}`)
}

console.log(`Found ${filesWithDates.length} numbered files with EXIF dates\n`)

// Load current photos.json
const photoData: PhotoCollection = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'))

let upgraded = 0
let skipped = 0
let notFound = 0

console.log('🔍 Matching photos by date...\n')

for (const photo of photoData.photos) {
  const photoDate = new Date(photo.date)
  const mediaCount = photo.media.length

  console.log(`\n📷 ${photo.id} (${photo.date.substring(0, 19)})`)
  console.log(`   Needs ${mediaCount} file${mediaCount > 1 ? 's' : ''}`)

  // Find matching files for this photo's date
  const matches = filesWithDates.filter((f) => {
    if (f.used) return false
    const diffSeconds = Math.abs((photoDate.getTime() - f.timestamp.getTime()) / 1000)
    return diffSeconds <= TOLERANCE_SECONDS
  })

  if (matches.length === 0) {
    console.log(`   ❌ No matches found`)
    notFound += mediaCount
    continue
  }

  if (matches.length < mediaCount) console.log(`   ⚠️  Only found ${matches.length}/${mediaCount} files`)

  // Use the first N matches for this photo's media items
  const filesToUse = matches.slice(0, mediaCount)

  for (let i = 0; i < filesToUse.length; i++) {
    const file = filesToUse[i]
    const targetPath = path.join(PUBLIC_DIR, photo.id, `${i + 1}.jpg`)

    if (!fs.existsSync(targetPath)) {
      console.log(`   ⚠️  Target missing: ${path.basename(targetPath)}`)
      skipped++
      file.used = true
      continue
    }

    const sourceSize = fs.statSync(file.fullPath).size
    const targetSize = fs.statSync(targetPath).size

    // Only upgrade if significantly larger (>10%)
    if (sourceSize > targetSize * 1.1) {
      fs.copyFileSync(file.fullPath, targetPath)
      console.log(
        `   ✓ ${file.filename} → ${i + 1}.jpg (${Math.round(targetSize / 1024)}KB → ${
          Math.round(sourceSize / 1024)
        }KB)`,
      )
      upgraded++
    } else {
      console.log(`   - ${file.filename}: Already good quality`)
      skipped++
    }

    file.used = true
  }

  if (filesToUse.length < mediaCount) notFound += mediaCount - filesToUse.length
}

console.log('\n✨ EXIF Date Matching Complete!')
console.log('================================')
console.log(`Upgraded: ${upgraded}`)
console.log(`Skipped: ${skipped} (already good quality)`)
console.log(`Not found: ${notFound}`)
console.log(`\nFiles used: ${filesWithDates.filter((f) => f.used).length}/${filesWithDates.length}`)
