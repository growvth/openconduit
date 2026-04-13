#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Setting up OpenConduit dev environment..."

# 1. Copy .env if it doesn't exist
if [ ! -f .env ]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
fi

# 2. Symlink .env into apps/api for Prisma
if [ ! -f apps/api/.env ]; then
  ln -sf ../../.env apps/api/.env
fi

# 3. Install dependencies
echo "==> Installing dependencies..."
npm install

# 4. Start database and redis
echo "==> Starting PostgreSQL and Redis..."
docker compose up db redis -d

# Wait for db to be healthy
echo "==> Waiting for database to be ready..."
until docker compose exec db pg_isready -U openconduit -q 2>/dev/null; do
  sleep 1
done
echo "==> Database is ready"

# 5. Generate Prisma client and push schema
echo "==> Setting up database schema..."
cd apps/api
npx prisma generate
npx prisma db push --accept-data-loss
cd "$ROOT_DIR"

# 6. Seed the database
echo "==> Seeding database..."
npm run db:seed

# 7. Start API and web app
echo ""
echo "==> Starting dev servers..."
echo "    API:  http://localhost:3000"
echo "    Web:  http://localhost:5173"
echo "    Login: admin@openconduit.dev / admin123"
echo ""

# Run API and web in parallel, kill both on exit
trap 'kill 0' EXIT
npm run dev:api &
npm run dev:web &
wait
