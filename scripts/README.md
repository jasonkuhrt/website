# Instagram Import Script

This directory contains a one-time-use script for importing Instagram archive data to the website's photography section.

## Usage

### 1. Request Instagram Data Export

1. Go to Instagram Settings → Privacy and Security → Data Download
2. Request a download of your data
3. Wait for Instagram to email you the download link (can take up to 48 hours)
4. Download and extract the ZIP file

### 2. Run the Import Script

```bash
tsx scripts/import-instagram.ts /path/to/instagram-export-folder
```

The script will:

- Parse Instagram JSON metadata
- Convert to generic photo data structure
- Copy media files to `public/photographing/`
- Generate `src/data/photographing/photos.json`
- Sort photos by date (newest first)

### 3. Build and Deploy

```bash
pnpm build
```

Check the photographing page at `/photographing` to verify the import.

### 4. Clean Up (Optional)

After successful import, you can delete:

- This entire `scripts/` directory
- The Instagram export folder
- Any temporary files

The imported photos are now part of your static site and will never need to be re-imported.

## Instagram Export Structure

The script expects Instagram export data in this format:

```
instagram-export/
├── posts_1.json          # or similar JSON files containing post metadata
├── photos/
│   ├── photo1.jpg
│   └── photo2.jpg
└── videos/
    └── video1.mp4
```

The exact structure may vary depending on when you requested the export. The script is flexible and will search for JSON files containing post metadata.

## Future Photo Additions

After the Instagram import, you can add new photos manually:

1. Create a directory in `public/photographing/` (e.g., `public/photographing/my-photo-id/`)
2. Add your images (name them 1.jpg, 2.jpg for series)
3. Edit `src/data/photographing/photos.json` to add metadata:

```json
{
  "id": "my-photo-id",
  "type": "single",
  "caption": "My new photo",
  "date": "2025-10-20T12:00:00.000Z",
  "media": [
    {
      "type": "image",
      "path": "/photographing/my-photo-id/1.jpg"
    }
  ]
}
```

4. Rebuild and deploy

## Troubleshooting

**No JSON files found**

- Make sure you're pointing to the extracted Instagram export folder
- Look for files with names like `posts_*.json` or `media.json`

**Missing media files**

- The script will skip posts with missing media and continue
- Check the output for warnings about skipped items

**Type errors during build**

- Ensure `photos.json` follows the `PhotoCollection` interface
- Check that all photo objects have required fields: `id`, `type`, `caption`, `date`, `media`
