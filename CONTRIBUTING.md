# Contributing to OpenConduit

Thanks for your interest in contributing. This guide covers how to get the project running locally and how to submit changes.

## Project Structure

```
openconduit/
├── apps/
│   ├── api/          # Backend API (Fastify + Prisma)
│   ├── web/          # Frontend app (React + Vite)
│   └── website/      # Marketing site (openconduit.dev)
├── packages/
│   └── shared/       # Shared types, constants, validation
├── docker-compose.yml
├── Caddyfile
└── .env.example
```

This is an npm workspaces monorepo. The `packages/shared` package is consumed by both `apps/api` and `apps/web`.

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker for a local instance)
- Redis (or Docker)

### 1. Clone and install

```bash
git clone https://github.com/growvth/openconduit.git
cd openconduit
npm install
```

### 2. Set up the database

Start PostgreSQL and Redis locally, or use Docker:

```bash
docker run -d --name oc-postgres \
  -e POSTGRES_USER=openconduit \
  -e POSTGRES_PASSWORD=openconduit \
  -e POSTGRES_DB=openconduit \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d --name oc-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 3. Configure environment

```bash
cp .env.example .env
```

For local development, the defaults in `.env.example` should work as-is if you used the Docker commands above.

### 4. Run database migrations and seed

```bash
npm run db:generate -w apps/api
npm run db:migrate:dev -w apps/api
npm run db:seed -w apps/api
```

This creates all tables and seeds default pipeline stages, tags, and an admin user.

### 5. Start development servers

```bash
# Terminal 1: API server (http://localhost:3000)
npm run dev:api

# Terminal 2: Frontend (http://localhost:5173)
npm run dev:web

# Terminal 3 (optional): Marketing site (http://localhost:5174)
npm run dev:website
```

The frontend dev server proxies `/api` requests to the API server automatically.

### 6. Build the shared package

If you modify anything in `packages/shared`, rebuild it:

```bash
npm run build -w packages/shared
```

## Common Tasks

### Adding a new API route

1. Create a route file in `apps/api/src/routes/`
2. Register it in `apps/api/src/server.ts`
3. Add request/response types to `packages/shared/src/types.ts` if they're shared with the frontend

### Modifying the database schema

1. Edit `apps/api/prisma/schema.prisma`
2. Run `npm run db:migrate:dev -w apps/api` to generate a migration
3. Update seed data in `apps/api/prisma/seed.ts` if needed

### Adding a new frontend page

1. Create the page component in `apps/web/src/pages/`
2. Add the route in `apps/web/src/App.tsx`
3. Add a navigation link in `apps/web/src/components/Layout.tsx` if needed

## Code Guidelines

- **TypeScript everywhere.** No `any` types unless absolutely unavoidable.
- **Validate all input.** Every API route should validate request bodies with Zod schemas.
- **Keep routes thin.** Business logic goes in service files, not route handlers. Route handlers parse input, call services, and return responses.
- **No secrets in code.** All sensitive config goes through environment variables.
- **Test your changes.** Make sure the app builds and runs before submitting a PR.

## Submitting Changes

1. Fork the repository
2. Create a branch from `main` (`git checkout -b my-change`)
3. Make your changes and commit with a clear message
4. Push to your fork and open a pull request against `main`
5. Describe what you changed and why in the PR description

### Commit Messages

Write commit messages that describe the change clearly. Use the imperative mood ("Add contact export" not "Added contact export"). Keep the first line under 72 characters.

### Pull Requests

- Keep PRs focused. One logical change per PR.
- If your change touches the database schema, include the migration.
- If your change adds a new feature, update any relevant documentation.
- Make sure the build passes before requesting review.

## Reporting Bugs

Open an issue on GitHub with:

- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, Docker version if applicable)

## Security Issues

If you find a security vulnerability, **do not open a public issue.** Follow the instructions in [SECURITY.md](SECURITY.md) instead.
