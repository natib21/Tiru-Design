# TiruDesign

Ethiopia-focused SaaS platform. This repository is a pnpm workspace.

## Applications

- [`apps/client`](apps/client) — customer-facing Client (in progress)
- [`apps/backoffice`](apps/backoffice) — internal Backoffice (not started)

## Client development

Requires Node.js 22+ and pnpm 10 (`corepack pnpm` if pnpm is not on PATH).

```bash
corepack pnpm install
cp apps/client/.env.example apps/client/.env
corepack pnpm dev
```

Environment:

- `VITE_API_BASE_URL` — backend origin only. Never put private credentials in Vite env vars.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Client Vite dev server |
| `pnpm typecheck` | TypeScript |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest |
| `pnpm test:e2e` | Playwright |
