#!/usr/bin/env bash
# day1/cleanup.sh — remove committed junk from the repo.
# Run from the repo root.
set -euo pipefail

echo "[cleanup] removing .DS_Store files..."
find . -name ".DS_Store" -not -path "./node_modules/*" -print -delete || true

echo "[cleanup] removing legacy *.old files..."
find . \
  \( -name "*.old" -o -name "*.old.ts" -o -name "*.old.tsx" -o -name "fly.toml.old" -o -name "route old.ts" \) \
  -not -path "./node_modules/*" -print -delete || true

echo "[cleanup] git rm --cached for any tracked .DS_Store..."
git ls-files | grep -E '\.DS_Store$' | xargs -r git rm --cached || true

echo "[cleanup] git rm --cached for any tracked *.old / fly.toml.old..."
git ls-files | grep -E '\.(old|old\.ts|old\.tsx)$|fly\.toml\.old' | xargs -r git rm --cached || true

echo "[cleanup] done. Review with: git status"
