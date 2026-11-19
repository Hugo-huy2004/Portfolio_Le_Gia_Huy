#!/usr/bin/env bash
# One photo in, three WebP files out for /journey (public/journey-photos/):
#   <name>.webp       HD, longest useful width 1600px (never upscaled)
#   <name>-800.webp   800px, what phones and polaroids load
#   <name>-bg.webp    32px, blown up and blurred as the page backdrop (< 1 KB)
# Usage: scripts/journey-photo.sh <input> <name> [crop "x y w h"]
set -euo pipefail
in=$1; name=$2; crop=${3:-}
out=public/journey-photos
mkdir -p "$out"
w=$(sips -g pixelWidth "$in" | awk '/pixelWidth/{print $2}')
[ -n "$crop" ] && w=$(echo "$crop" | awk '{print $3}')
big=$(( w < 1600 ? w : 1600 ))
c=(); [ -n "$crop" ] && c=(-crop $crop)
enc() { cwebp -quiet -mt -m 6 -sharp_yuv -af ${c[@]+"${c[@]}"} "$@"; }  # bash 3.2-safe empty array
enc -q 78 -resize "$big" 0 "$in" -o "$out/$name.webp"
enc -q 74 -resize 800 0 "$in" -o "$out/$name-800.webp"
enc -q 50 -resize 32 0 "$in" -o "$out/$name-bg.webp"
