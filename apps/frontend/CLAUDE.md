# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Vite dev server (http://localhost:5173)
pnpm mock:api     # json-server mock API (http://localhost:3001)
pnpm dev:all      # Both servers concurrently

# Build
pnpm build        # TypeScript check + Vite production build
pnpm preview      # Preview production build

# Lint & Format
pnpm lint         # Biome linter
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Format with Biome

# Test
pnpm test         # Watch mode
pnpm test:run     # Run once
pnpm test:cov     # With coverage
```

## Architecture

**Vertical slice structure** — each feature is self-contained under `src/features/`:

```
src/
├── app/              # Shell: providers, router, layout, error pages
├── features/         # Feature modules (pages, components, schemas, tests)
├── shared/           # Reusable UI components, hooks, Zustand store, utils
├── api/              # Axios client, service functions, TanStack Query hooks
├── i18n/             # i18next config + EN/FR translation files
└── tests/            # Vitest setup, custom render utility, MSW handlers
```

**State layers:**
- App state (theme, locale) → Zustand with localStorage persistence (`src/shared/stores/app.store.ts`)
- Server state → TanStack Query hooks in `src/api/queries/`
- Form state → React Hook Form + Zod schemas (`src/features/*/schemas/`)

**API layer:** Axios client → service functions → TanStack Query hooks. Never call Axios directly from components.

**Routing:** React Router v7 with lazy-loaded pages and Suspense fallback.

**Testing:** MSW intercepts API calls in tests. Use the custom `render` from `src/tests/test-utils.tsx` (wraps with all providers).

## Path Alias

`@/*` maps to `src/*` — use this for all imports.

## Environment

Copy `.env.example` to `.env`. Required variable:
```
VITE_API_BASE_URL=http://localhost:3001
```

## Security

> **IMPORTANT:** Credentials MUST NEVER be exposed in the codebase, documentation, or comments (including API keys, tokens, passwords, secrets, and private keys). They must NEVER be committed — store them exclusively in `.env` which is git-ignored.
