FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN npm install --workspace=apps/api --workspace=packages/shared

# Build shared package
FROM deps AS build-shared
COPY packages/shared/ packages/shared/
COPY tsconfig.base.json ./
RUN npm run build -w packages/shared

# Generate Prisma client
FROM build-shared AS prisma
COPY apps/api/prisma/ apps/api/prisma/
RUN npx prisma generate --schema=apps/api/prisma/schema.prisma

# Build API
FROM prisma AS build
COPY apps/api/ apps/api/
RUN npm run build -w apps/api

# Production
FROM base AS production
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build-shared /app/packages/shared/dist ./packages/shared/dist
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY apps/api/prisma/ apps/api/prisma/
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
COPY package.json ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "apps/api/dist/server.js"]
