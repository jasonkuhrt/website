# Photography Archive Migration

## Overview

Migrate photography content from Instagram archive to the website's photography section. This is a **one-time-only migration** from a closed Instagram account. After migration, the photography section will use a generic structure that supports adding new photos manually in the future (not from Instagram).

## User Journeys

### Primary Journey: Viewing Photography

1. User navigates to the photographing page
2. User sees a grid gallery displaying all photos
3. For single photos:
   - User sees the photo in the grid
   - Caption and date are visible below or on hover
4. For photo series (multiple related photos):
   - User sees the first photo in the grid with a visual indicator (e.g., series icon/badge)
   - User clicks the photo series
   - All photos from the series expand inline within the grid (grid cell becomes multiple cells)
   - Photos maintain consistent grid sizing
   - Caption and date are displayed with the expanded series
   - User can collapse back to single cell showing first photo only
5. For video content:
   - User sees the video thumbnail in the grid
   - User clicks to play the video
   - Caption and date are displayed

### Secondary Journey: One-Time Archive Migration

1. Administrator requests Instagram data export from Instagram (account is being closed)
2. Administrator downloads the export archive (JSON + media files)
3. Administrator runs import script once with path to export archive
4. Script processes the export:
   - Parses Instagram JSON metadata
   - Converts to generic photo data structure
   - Copies media files to `/public/photographing/`
   - Generates `photos.json` data file
5. Administrator rebuilds/redeploys the website
6. Photography content appears permanently on the photographing page
7. Import script and temporary files can be deleted (no longer needed)

## Failure States

| Failure Scenario                        | User Impact              | System Behavior                       | User Feedback                                                                                                       |
| --------------------------------------- | ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Instagram export file missing/corrupted | Import fails             | Script exits with error               | Error message: "Unable to read Instagram export file. Please ensure the export archive is valid and complete."      |
| Media file missing in export            | Partial import           | Skip the post, continue with others   | Warning message: "Skipped N posts due to missing media files. See log for details."                                 |
| Invalid JSON structure in export        | Import fails             | Script exits with error               | Error message: "Instagram export format not recognized. Please ensure you're using a recent Instagram data export." |
| Insufficient disk space for media       | Import fails mid-process | Script stops, cleanup may be needed   | Error message: "Insufficient disk space. Required: X GB, Available: Y GB."                                          |
| Unsupported media format                | Partial import           | Skip unsupported files, import others | Warning message: "Skipped N items with unsupported formats: [list formats]"                                         |
| Caption contains problematic characters | Display issue            | Content displays with encoding issues | Silent failure (displays garbled text) - may need sanitization                                                      |

## Architecture

### Data Flow

```
Instagram Export Archive (.zip)
  ├── media.json (or posts.json)
  ├── photos/
  │   ├── [timestamp]_[id].jpg
  │   └── ...
  └── videos/
      ├── [timestamp]_[id].mp4
      └── ...

            ↓ (import-instagram.ts - one-time use)

Website Photography Structure (generic, future-proof)
  ├── public/photographing/
  │   ├── [photo-id]/
  │   │   ├── 1.jpg
  │   │   ├── 2.jpg (if series)
  │   │   └── ...
  │   └── ...
  └── src/data/photographing/
      └── photos.json
```

### Data Model

Generic photography data structure (not Instagram-specific):

```typescript
interface Photo {
  id: string
  type: 'single' | 'series' | 'video'
  caption: string
  date: string // ISO 8601 format
  media: MediaItem[]
}

interface MediaItem {
  type: 'image' | 'video'
  path: string // relative path: /photographing/[photo-id]/1.jpg
}

interface PhotoCollection {
  photos: Photo[]
  lastUpdated: string // ISO 8601 timestamp
  totalCount: number
}
```

**Note**: This structure is generic and supports future manual additions. The import script converts Instagram data to this format.

### File System Structure

```
website/
├── public/
│   └── photographing/
│       ├── [photo-id-1]/
│       │   ├── 1.jpg
│       │   └── 2.jpg (if series)
│       ├── [photo-id-2]/
│       │   └── 1.mp4
│       └── ...
├── src/
│   ├── data/
│   │   └── photographing/
│   │       └── photos.json
│   ├── pages/
│   │   └── photographing.astro (existing page)
│   └── components/
│       ├── PhotoGrid.astro (handles grid display and series expansion)
│       └── PhotoCell.astro (individual photo cell)
└── scripts/
    └── import-instagram.ts (one-time use, can be deleted after)
```

### Import Script Process

The import script is Instagram-specific but outputs to generic photo structure:

1. **Extract Archive**: Unzip Instagram export to temporary directory
2. **Parse Instagram Metadata**: Read Instagram JSON file(s) containing post metadata
3. **Convert Each Instagram Post to Generic Photo**:
   - Create unique photo ID (from Instagram ID or generate from timestamp)
   - Create directory: `public/photographing/[photo-id]/`
   - Copy media files to photo directory
   - Rename files sequentially (1.jpg, 2.jpg, etc.)
   - Build generic `Photo` objects (not Instagram-specific)
   - Map Instagram fields: `taken_at` → `date`, `caption` → `caption`, `carousel` → `series`
4. **Generate Output**: Write `src/data/photographing/photos.json` with generic photo data
5. **Cleanup**: Remove temporary extraction directory
6. **Report**: Display summary (photos migrated, files copied, warnings/errors)

### Instagram Export Format

Instagram provides data exports in JSON format. The exact structure varies, but typically includes:

```json
{
  "photos": [
    {
      "caption": "Photo caption text",
      "taken_at": "2024-01-15T10:30:00.000Z",
      "uri": "instagram://media?id=123456789",
      "media_list_data": [
        {
          "uri": "photos/photo1.jpg"
        }
      ]
    }
  ],
  "videos": [
    {
      "caption": "Video caption",
      "taken_at": "2024-01-20T15:45:00.000Z",
      "uri": "instagram://media?id=987654321",
      "media_list_data": [
        {
          "uri": "videos/video1.mp4"
        }
      ]
    }
  ]
}
```

**Note**: The exact schema depends on Instagram's current export format version. The import script must be flexible to handle variations.

### Display Implementation

#### Photo Grid Component

- Uses existing grid system from photographing page
- Each grid cell represents one photo (single, series, or video)
- Visual indicators for:
  - Photo series: series icon overlay
  - Video content: play button overlay
- Caption and date displayed below thumbnail or on hover

#### Series Expansion (for multi-photo series)

- Inline expansion within the grid (no modal/overlay)
- Collapsed state: Shows first photo with series indicator badge
- Expanded state: All photos from the series displayed as consecutive grid cells
- Clicking collapsed series expands it inline
- Clicking expanded series (or close button) collapses back to first photo only
- All photos maintain consistent grid cell sizing
- Caption and date displayed once for the entire series (not per photo)

#### Video Player

- HTML5 video element
- Standard playback controls
- Poster image (first frame or thumbnail)
- Caption and date displayed

## Technical Considerations

### Media Storage

- All media files stored in `public/photographing/`
- Organized by photo ID to group series images together
- Sequential numbering (1.jpg, 2.jpg, etc.) for clarity
- Preserve original aspect ratios
- Structure supports future manual additions (just add new photo directories)

### Build Integration

- Static site generation: JSON data imported at build time
- Media files committed to repository (permanent archival content)
- No runtime API calls needed (static content)
- Import script can be deleted after successful migration (one-time use)
- Future photos can be added manually using the same directory structure

### Deployment

- Site deployed via **Cloudflare Pages** (automatic deployments from GitHub)
- All static assets in `public/photographing/` will be deployed automatically
- Cloudflare Pages free tier limits:
  - Up to 20,000 files per deployment
  - 25 MB maximum file size
  - 500 deployments per month
- Photography media files are well within these limits for typical personal photo collections
- No special configuration needed - Astro builds to `dist/` and Cloudflare Pages deploys it

### Performance

- Images should be optimized (consider using Astro's Image component)
- Lazy loading for grid items
- Video files may be large - consider size warnings or compression

### Data Validation

Import script should validate:

- Required fields present (caption, timestamp, media)
- Media files exist at specified paths
- Timestamps are valid ISO 8601 format
- File extensions match expected types (jpg, png, mp4, etc.)

## Design Principles

### Instagram-Specific vs. Generic

**Instagram-Specific (one-time use, can be deleted):**

- Import script: `scripts/import-instagram.ts`
- Instagram export parsing logic
- Field mappings from Instagram format to generic photo format

**Generic (permanent, future-proof):**

- Data model: `Photo`, `MediaItem`, `PhotoCollection` interfaces
- Directory structure: `public/photographing/`
- Data file: `src/data/photographing/photos.json`
- Components: `PhotoGrid.astro`, `PhotoCell.astro`
- All terminology: "photos", "series", not "posts", "carousels"

**Rationale**: The Instagram account is closed and will never be used again. All Instagram-specific code is temporary scaffolding to get data into a clean, generic structure that supports future manual photo additions.

## Decisions

### Image Optimization

**Decision**: Use Astro's built-in Image component for optimization

- Import script stores original files in `public/photographing/`
- Astro handles optimization at build time (automatic resizing, format conversion, responsive images)
- No manual optimization needed during import
- Benefits: Automatic optimization, multiple formats/sizes, better DX

### Photo Sorting

**Decision**: Newest first (reverse chronological order)

- Photos sorted by date in descending order
- Most recent photos appear at the top of the grid
- Matches typical photography portfolio conventions

### Caption Processing

**Decision**: Keep captions as-is (no processing)

- Preserve original caption text including hashtags and @mentions
- No automatic stripping, styling, or truncation
- Simple, preserves authenticity of original posts
- Can be manually edited in `photos.json` if needed after import

### Future Manual Photo Additions

**Decision**: Start with manual workflow, create helper script if needed later

- For now: Manually create directories in `public/photographing/` and edit `photos.json`
- If this becomes tedious, create a helper script in the future
- Keeps initial implementation simple
- Helper script can be added as a separate enhancement if needed
