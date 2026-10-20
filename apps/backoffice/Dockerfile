# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app
COPY tsconfig.base.json ./
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/backoffice/package.json ./apps/backoffice/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS dev
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/backoffice/package.json ./apps/backoffice/
COPY packages ./packages
RUN pnpm install --frozen-lockfile --ignore-scripts
EXPOSE 5173
CMD ["pnpm", "--filter", "@tirudesign/backoffice", "dev", "--host"]

FROM base AS test
WORKDIR /app
EXPOSE 5173
CMD ["pnpm", "--filter", "@tirudesign/backoffice", "test"]

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/backoffice ./apps/backoffice
COPY packages ./packages
RUN pnpm --filter @tirudesign/backoffice build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/backoffice/package.json ./apps/backoffice/
COPY packages ./packages
COPY --from=build /app/apps/backoffice/dist ./app/apps/backoffice/dist
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
EXPOSE 4173
CMD ["sh", "-lc", "pnpm --filter @tirudesign/backoffice exec vite preview --host --port 4173"]

FROM mcr.microsoft.com/playwright:v1.55.0-jammy AS e2e
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY apps/backoffice/package.json ./apps/backoffice/
COPY packages ./packages
RUN pnpm install --frozen-lockfile
COPY apps/backoffice ./apps/backoffice
CMD ["sh", "-lc", "pnpm --filter @tirudesign/backoffice test"]
