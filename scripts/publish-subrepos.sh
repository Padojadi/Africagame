#!/bin/bash
# Publie backend/ et frontend/ vers des dépôts GitHub séparés
# Prérequis : créer d'abord les repos vides sur GitHub :
#   - Padojadi/africagame-backend
#   - Padojadi/africagame-frontend
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

publish_subdir() {
  local dir="$1"
  local repo="$2"
  local tmpdir
  tmpdir=$(mktemp -d)

  echo "=== Publication de $dir vers $repo ==="
  cp -r "$dir/." "$tmpdir/"
  cd "$tmpdir"
  git init -b main
  git add -A
  git commit -m "Initial commit from Africagame monorepo"
  git remote add origin "https://github.com/$repo.git"
  git push -u origin main --force

  cd "$ROOT"
  rm -rf "$tmpdir"
  echo "OK: $repo"
}

publish_subdir "backend" "Padojadi/africagame-backend"
publish_subdir "frontend" "Padojadi/africagame-frontend"

echo "Dépôts séparés publiés."
