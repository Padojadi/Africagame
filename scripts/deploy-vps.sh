#!/bin/bash
set -euo pipefail

DOMAIN="africagame.2ticglobal.com"
APP_DIR="${APP_DIR:-/opt/africagame}"
REPO_URL="https://github.com/padojadi/africagame.git"

echo "=== Déploiement Africa Game sur $DOMAIN ==="

if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
git pull origin main

export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-africagame_secret}"
export JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-Africagame!@#2026}"

docker compose down || true
docker compose build --no-cache
docker compose up -d

echo "=== Déploiement terminé ==="
echo "URL: https://$DOMAIN"
echo "Admin: admin@africagame.2ticglobal.com"
echo "API docs: https://$DOMAIN/api/docs"
