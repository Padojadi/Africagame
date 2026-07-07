#!/bin/sh
set -e
echo "Running migrations..."
npx prisma migrate deploy
echo "Seeding database..."
npx ts-node prisma/seed.ts
echo "Starting API..."
node dist/main.js
