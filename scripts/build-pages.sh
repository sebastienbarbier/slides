#!/usr/bin/env bash
# Assemble the GitHub Pages site in _site/.
#
# A deck is a directory with package.json and either index.html (reveal.js)
# or open-slide.config.ts.
#
# Static decks are copied as-is after install, which is how the Vibehuus
# reveal.js deck publishes today. Its build script is exactly "npm ci", so
# running it would only reinstall. It is not a static-site build.
#
# A deck that declares slidesPages.output (for example "dist") is built, and
# that folder is what gets published. If slidesPages is absent but the build
# script is not "npm ci", the script still runs the build and publishes dist/
# when dist/index.html appears.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

mkdir -p _site

npx --yes marked README.md > _site/body.html
cat > _site/index.html <<'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>slides</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; color: #1f5a99; }
    a { color: #2e72b8; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #8aaed0; padding: 0.5rem 0.75rem; text-align: left; }
    th { background: #f4f6f9; }
    code { font-size: 0.9em; }
  </style>
</head>
<body>
EOF
cat _site/body.html >> _site/index.html
echo '</body></html>' >> _site/index.html
rm _site/body.html

touch _site/.nojekyll
cp CNAME _site/CNAME

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@10.33.3 --activate
fi

for dir in */; do
  name="${dir%/}"
  [ -f "$name/package.json" ] || continue
  if [ ! -f "$name/index.html" ] && [ ! -f "$name/open-slide.config.ts" ]; then
    continue
  fi

  echo "Building $name…"
  manager="$(node -e "const p=require('./$name/package.json'); const m=String(p.packageManager||''); console.log(m.startsWith('pnpm')?'pnpm':'npm')")"
  build_script="$(node -e "const p=require('./$name/package.json'); console.log((p.scripts&&p.scripts.build)||'')")"
  pages_output="$(node -e "const p=require('./$name/package.json'); console.log((p.slidesPages&&p.slidesPages.output)||'')")"

  if [ "$manager" = "pnpm" ]; then
    pnpm install --frozen-lockfile --dir "$name"
  else
    npm ci --prefix "$name"
  fi

  publish_dist=""
  if [ -n "$pages_output" ]; then
    publish_dist="$pages_output"
  elif [ -n "$build_script" ] && [ "$build_script" != "npm ci" ]; then
    publish_dist="dist"
  fi

  if [ -n "$publish_dist" ]; then
    echo "Running build for $name (publish $publish_dist/)…"
    if [ "$manager" = "pnpm" ]; then
      SLIDE_BASE="/${name}/" pnpm --dir "$name" run build
    else
      SLIDE_BASE="/${name}/" npm --prefix "$name" run build
    fi
    if [ -f "$name/$publish_dist/index.html" ]; then
      mkdir -p "_site/$name"
      cp -a "$name/$publish_dist/." "_site/$name/"
      touch "_site/$name/.nojekyll"
      # GitHub Pages has no SPA fallback. open-slide navigates to
      # /s/<id> and /s/<id>/presenter, so those paths need a real index.html.
      if [ -d "$name/slides" ]; then
        for slide in "$name"/slides/*/index.tsx; do
          [ -f "$slide" ] || continue
          id="$(basename "$(dirname "$slide")")"
          for route in "s/$id" "s/$id/presenter"; do
            mkdir -p "_site/$name/$route"
            cp "$name/$publish_dist/index.html" "_site/$name/$route/index.html"
          done
        done
      fi
      continue
    fi
    if [ -n "$pages_output" ]; then
      echo "Expected $name/$pages_output/index.html after build" >&2
      exit 1
    fi
    echo "No $name/dist/index.html after build. Publishing the folder as-is."
  fi

  cp -a "$name" "_site/$name"
  touch "_site/$name/.nojekyll"
done
