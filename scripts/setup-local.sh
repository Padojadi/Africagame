#!/bin/bash
# Clone les repos frontend et backend séparément pour développement local
set -euo pipefail

LOCAL_DIR="${1:-/Users/Paul Do Mac Folders/Protosen_Hostinger/Africa Game}"
mkdir -p "$LOCAL_DIR"

echo "Clonage vers $LOCAL_DIR..."

if [ ! -d "$LOCAL_DIR/backend" ]; then
  git clone https://github.com/padojadi/africagame-backend.git "$LOCAL_DIR/backend" 2>/dev/null || \
  git clone --depth 1 --filter=blob:none --sparse https://github.com/padojadi/africagame.git "$LOCAL_DIR/repo-tmp" && \
  cp -r "$LOCAL_DIR/repo-tmp/backend" "$LOCAL_DIR/backend" && rm -rf "$LOCAL_DIR/repo-tmp"
fi

if [ ! -d "$LOCAL_DIR/frontend" ]; then
  git clone https://github.com/padojadi/africagame-frontend.git "$LOCAL_DIR/frontend" 2>/dev/null || \
  git clone --depth 1 --filter=blob:none --sparse https://github.com/padojadi/africagame.git "$LOCAL_DIR/repo-tmp2" && \
  cp -r "$LOCAL_DIR/repo-tmp2/frontend" "$LOCAL_DIR/frontend" && rm -rf "$LOCAL_DIR/repo-tmp2"
fi

echo "Installation backend..."
cd "$LOCAL_DIR/backend"
cp -n .env.example .env 2>/dev/null || true
npm install

echo "Installation frontend..."
cd "$LOCAL_DIR/frontend"
cp -n .env.example .env.local 2>/dev/null || true
npm install

echo "Terminé ! Lancez avec: docker compose up -d (depuis le repo principal)"
