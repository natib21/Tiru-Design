# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS base
WORKDIR /app
COPY tsconfig.base.json ./
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl1.1 curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS dev
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --ignore-scripts
EXPOSE 4000
CMD ["sh", "-lc", "pnpm --filter @tirudesign/api-app prisma:generate && pnpm --filter @tirudesign/api-app dev"]

FROM base AS test
WORKDIR /app
EXPOSE 4000
CMD ["sh", "-lc", "pnpm --filter @tirudesign/api-app prisma:generate && pnpm --filter @tirudesign/api-app test"]

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN pnpm --filter @tirudesign/api-app prisma:generate && pnpm --filter @tirudesign/api-app build

FROM node:20-bullseye-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl1.1 curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./app/apps/api/dist
COPY --from=build /app/apps/api/prisma ./app/apps/api/prisma
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
