#!/bin/bash
set -euo pipefail

APP_DIR="/opt/africagame"
REPO="https://github.com/Padojadi/Africagame.git"
BRANCH="${BRANCH:-cursor/tdr-regulation-platform-83c7}"
DB_NAME="africagame"
DB_USER="africagame"
DB_PASS="${DB_PASS:-africagame_prod_2026}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Africagame!@#2026}"
BACKEND_PORT=4000
FRONTEND_PORT=3002

echo "=== Déploiement Africa Game TDR ==="

# PostgreSQL
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# Clone / update
if [ ! -d "$APP_DIR" ]; then
  git clone -b "$BRANCH" "$REPO" "$APP_DIR"
else
  cd "$APP_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
fi
cd "$APP_DIR"

# Backend
cd backend
cat > .env <<EOF
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}?schema=public
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
PORT=${BACKEND_PORT}
CORS_ORIGIN=https://africagame.2ticglobal.com,http://localhost:${FRONTEND_PORT}
ADMIN_EMAIL=admin@africagame.2ticglobal.com
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF

npm install --omit=dev 2>/dev/null || npm install
npx prisma generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts 2>/dev/null || node -e "require('ts-node/register'); require('./prisma/seed.ts')"
npm run build

# Frontend
cd ../frontend
cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=https://africagame.2ticglobal.com/api
EOF
npm install
NEXT_PUBLIC_API_URL=https://africagame.2ticglobal.com/api npm run build
# postbuild copies .next/static into standalone (required for CSS/JS)
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public 2>/dev/null || true

# PM2
npm install -g pm2 2>/dev/null || true
pm2 delete africagame-api 2>/dev/null || true
pm2 delete africagame-web 2>/dev/null || true

cd "$APP_DIR/backend"
pm2 start dist/src/main.js --name africagame-api --cwd "$APP_DIR/backend"

cd "$APP_DIR/frontend"
PORT=${FRONTEND_PORT} pm2 start node --name africagame-web -- .next/standalone/server.js
pm2 save

# Nginx
cat > /etc/nginx/sites-available/africagame.2ticglobal.com <<'NGINX'
server {
    listen 80;
    server_name africagame.2ticglobal.com;

    client_max_body_size 20M;

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
NGINX

ln -sf /etc/nginx/sites-available/africagame.2ticglobal.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL
certbot --nginx -d africagame.2ticglobal.com --non-interactive --agree-tos -m padojadi@yahoo.fr --redirect 2>/dev/null || echo "Certbot: configurez SSL manuellement si nécessaire"

echo "=== Déploiement terminé ==="
echo "URL: https://africagame.2ticglobal.com"
pm2 list | grep africagame
