#!/usr/bin/env node --import tsx

/**
 * Rebuild photos.json from numbered Photos app export
 *
 * Uses numbered photos as source of truth, enriches with Instagram captions,
 * keeps Instagram videos (not in Photos app).
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'
import type { Photo, PhotoCollection } from '../src/data/photographing/types.js'

const NUMBERED_DIR = path.join(process.cwd(), 'data/numbered')
const PHOTOS_JSON = path.join(process.cwd(), 'src/data/photographing/photos.json')
const PUBLIC_DIR = path.join(process.cwd(), 'public/photographing')

// Load existing Instagram data for captions
const existingData: PhotoCollection = JSON.parse(fs.readFileSync(PHOTOS_JSON, 'utf-8'))

// Tolerance for timestamp matching (in seconds)
// Increased because EXIF dates (capture time) can differ from Instagram upload times
const TOLERANCE_SECONDS = 3600 // 1 hour

// Extract EXIF timestamp from a file
const getExifTimestamp = (filePath: string): Date | null => {
  try {
    const output = execSync(`exiftool -DateTimeOriginal -CreateDate -s -s -s "${filePath}"`, {
      encoding: 'utf-8',
    }).trim()

    if (!output) return null

    const firstLine = output.split('\n')[0]
    const match = firstLine.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)

    if (!match) return null

    const [, year, month, day, hour, minute, second] = match
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
  } catch (error) {
    return null
  }
}

// Generate photo ID from date
const generatePhotoId = (date: Date): string => {
  return date.toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')
}

// Find matching Instagram photo by date
const findInstaMatch = (date: Date) => {
  return existingData.photos.find((p) => {
    const photoDate = new Date(p.date)
    const diffSeconds = Math.abs((date.getTime() - photoDate.getTime()) / 1000)
    return diffSeconds <= TOLERANCE_SECONDS
  })
}

console.log('📸 Rebuilding photos from numbered export...\n')

// Get all numbered files
const numberedFiles = fs
  .readdirSync(NUMBERED_DIR)
  .filter((f) => f.match(/^\d+\.jpeg$/))
  .sort((a, b) => parseInt(a) - parseInt(b))

console.log(`Found ${numberedFiles.length} numbered photos`)

interface PhotoGroup {
  date: Date
  files: string[]
  caption: string
}

// Group consecutive photos by date (same timestamp = series)
const groups: PhotoGroup[] = []
let currentGroup: PhotoGroup | null = null

for (const filename of numberedFiles) {
  const fullPath = path.join(NUMBERED_DIR, filename)
  const timestamp = getExifTimestamp(fullPath)

  if (!timestamp) {
    console.log(`⚠️  No EXIF date: ${filename}`)
    continue
  }

  // Check if this belongs to current group (same date within 1 second)
  if (currentGroup && Math.abs(timestamp.getTime() - currentGroup.date.getTime()) <= 1000) {
    currentGroup.files.push(fullPath)
  } else {
    // Start new group
    if (currentGroup) groups.push(currentGroup)
    currentGroup = { date: timestamp, files: [fullPath], caption: '' }
  }
}

if (currentGroup) groups.push(currentGroup)

console.log(`Organized into ${groups.length} photo groups\n`)

// Enrich with Instagram captions
let captionMatches = 0
for (const group of groups) {
  const instaMatch = findInstaMatch(group.date)
  if (instaMatch?.caption) {
    group.caption = instaMatch.caption
    captionMatches++
  }
}

console.log(`Matched ${captionMatches} captions from Instagram\n`)

// Create new photos array
const newPhotos: Photo[] = []

for (const group of groups) {
  const photoId = generatePhotoId(group.date)
  const photoDir = path.join(PUBLIC_DIR, photoId)

  // Create directory and copy files
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true })
  }

  const media = group.files.map((filePath, index) => {
    const destPath = path.join(photoDir, `${index + 1}.jpg`)
    fs.copyFileSync(filePath, destPath)
    return {
      type: 'image' as const,
      path: `/photographing/${photoId}/${index + 1}.jpg`,
    }
  })

  const type = group.files.length > 1 ? 'series' : 'single'

  newPhotos.push({
    id: photoId,
    type,
    caption: group.caption,
    date: group.date.toISOString(),
    media,
  })

  console.log(`✓ ${photoId} (${type}, ${group.files.length} files)${group.caption ? ' - with caption' : ''}`)
}

// Add Instagram videos (not in Photos app)
console.log('\n📹 Adding Instagram videos...\n')

const instaVideos = existingData.photos.filter((p) => p.type === 'video')
let videosAdded = 0

for (const video of instaVideos) {
  // Check if we already have this date from numbered photos
  const videoDate = new Date(video.date)
  const alreadyExists = newPhotos.some((p) => {
    const photoDate = new Date(p.date)
    const diffSeconds = Math.abs(videoDate.getTime() - photoDate.getTime()) / 1000
    return diffSeconds <= TOLERANCE_SECONDS
  })

  if (!alreadyExists) {
    newPhotos.push(video)
    videosAdded++
    console.log(`✓ ${video.id} (video)`)
  }
}

console.log(`\nAdded ${videosAdded} videos from Instagram`)

// Sort by date (newest first)
newPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// Create new photo collection
const newPhotoCollection: PhotoCollection = {
  photos: newPhotos,
  lastUpdated: new Date().toISOString(),
  totalCount: newPhotos.length,
}

// Backup old photos.json
const backupPath = PHOTOS_JSON.replace('.json', '.backup.json')
fs.copyFileSync(PHOTOS_JSON, backupPath)
console.log(`\n💾 Backed up old photos.json to ${path.basename(backupPath)}`)

// Write new photos.json
fs.writeFileSync(PHOTOS_JSON, JSON.stringify(newPhotoCollection, null, 2))

console.log('\n✨ Rebuild Complete!')
console.log('===================')
console.log(`Total photos: ${newPhotos.length}`)
console.log(`  From numbered: ${groups.length}`)
console.log(`  Videos from Instagram: ${videosAdded}`)
console.log(`  With captions: ${captionMatches}`)
console.log(`\nNew photos.json written!`)
