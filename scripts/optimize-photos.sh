#!/bin/bash

# Script to optimize hi-res photos to web-res
# - Deletes orphaned files in web-res (files that don't exist in hi-res)
# - Optimizes all hi-res photos to web-res (1200px max, 85% quality)

set -e

for dir in professional hiking; do
  hi_res_dir="public/bio/hi-res/$dir"
  web_res_dir="public/bio/web-res/$dir"

  echo "Processing $dir photos..."

  # Delete orphaned files in web-res
  if [ -d "$web_res_dir" ]; then
    for web_file in "$web_res_dir"/*; do
      if [ -f "$web_file" ]; then
        filename=$(basename "$web_file")
        hi_res_file="$hi_res_dir/$filename"

        if [ ! -f "$hi_res_file" ]; then
          echo "  Removing orphaned file: $filename"
          rm "$web_file"
        fi
      fi
    done
  fi

  # Optimize all hi-res photos to web-res
  if [ -d "$hi_res_dir" ]; then
    for hi_res_file in "$hi_res_dir"/*; do
      if [ -f "$hi_res_file" ]; then
        filename=$(basename "$hi_res_file")
        web_res_file="$web_res_dir/$filename"

        echo "  Optimizing: $filename"
        sips -Z 1200 -s formatOptions 85 "$hi_res_file" --out "$web_res_file" > /dev/null 2>&1
      fi
    done
  fi
done

echo "✓ Photo optimization complete!"
