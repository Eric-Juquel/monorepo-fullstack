# monorepo-fullstack

Full-stack monorepo with CI/CD pipeline, Docker, and Vercel deployment.

![CI](https://github.com/Eric-Juquel/monorepo-fullstack/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/Eric-Juquel/monorepo-fullstack/actions/workflows/deploy.yml/badge.svg)

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TailwindCSS, TanStack Query, Zustand, React Router v7 |
| Backend | NestJS *(coming soon)* |
| Testing | Vitest, Testing Library, MSW |
| Linting | Biome |
| Package manager | pnpm workspaces |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend) |
| Containerization | Docker, docker-compose |

## Repository structure

```
monorepo-fullstack/
├── .github/
│   └── workflows/
│       ├── ci.yml         # CI: type check + lint + tests + build + Trivy scan
│       └── deploy.yml     # CD: deploy to Vercel on push to main
├── apps/
│   ├── frontend/          # React 19 + Vite + TailwindCSS
│   │   ├── src/
│   │   ├── Dockerfile     # multi-stage: Node builder → nginx:alpine
│   │   ├── nginx.conf     # SPA fallback + cache headers
│   │   ├── vercel.json    # SPA rewrite rules for React Router
│   │   └── .env.test      # test environment (non-secret, committed)
│   └── backend/           # NestJS (stub — to be created)
├── docker-compose.yml
├── package.json           # pnpm workspace root
└── pnpm-workspace.yaml
```

## Getting started

**Prerequisites:** Node.js 22+, pnpm 10+

```bash
# Install all dependencies
pnpm install

# Frontend dev server → http://localhost:5173
pnpm --filter frontend dev

# Mock API (json-server) → http://localhost:3001
pnpm --filter frontend mock:api

# Both simultaneously
pnpm --filter frontend dev:all
```

## Available scripts

```bash
# Tests
pnpm --filter frontend test:run     # run once
pnpm --filter frontend test         # watch mode
pnpm --filter frontend test:cov     # with coverage

# Type check
pnpm --filter frontend typecheck

# Lint
pnpm --filter frontend lint
pnpm --filter frontend lint:fix     # auto-fix

# Build
pnpm --filter frontend build
```

## Docker

```bash
# Start all services — frontend → http://localhost:8080
docker compose up

# Frontend only
docker compose up frontend

# Build image manually
docker build -t frontend:local ./apps/frontend
```

## CI/CD pipeline

```
feat/* / fix/* / chore/*
         │
         │  Pull Request
         ▼
      develop ─────────────────────────────────────────┐
         │                                              │
         │  Pull Request                           CI runs on
         ▼                                         every PR:
        main                                       • type check
         │                                         • lint
         │  push                                   • tests
         ▼                                         • build
    deploy.yml                                     • Trivy scan
         │
         ▼
   Vercel (production)
```

### CI jobs — `ci.yml`

| Job | Trigger | Steps |
|-----|---------|-------|
| `CI Frontend` | PR/push → `develop`, `main` | typecheck · lint · tests · build |
| `Security Scan (Trivy)` | PR/push → `develop`, `main` | npm deps scan · Docker image scan |
| `CI Backend` | PR/push → `develop`, `main` | stub *(active when NestJS is added)* |

### CD jobs — `deploy.yml`

| Job | Trigger | Target |
|-----|---------|--------|
| `Deploy Frontend → Vercel` | push → `main` | Vercel production |
| `Deploy Backend` | push → `main` | stub *(to be configured)* |

## Branching strategy

| Branch | Role | How to update |
|--------|------|---------------|
| `main` | Production — always stable | PR from `develop` only |
| `develop` | Integration — validated code | PR from feature branches only |
| `feat/*` | New feature | PR → `develop` |
| `fix/*` | Bug fix | PR → `develop` |
| `chore/*` | Maintenance | PR → `develop` |

**Merge strategy:**
- `feat/*` → `develop` : **squash** or **rebase** (clean history)
- `develop` → `main` : **merge commit** (visible release point)

## Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | `.env` + GitHub Secret | Backend API base URL |
| `VERCEL_TOKEN` | GitHub Secret | Vercel authentication token |
| `VERCEL_ORG_ID` | GitHub Secret | Vercel organization ID |
| `VERCEL_PROJECT_ID` | GitHub Secret | Vercel project ID |

```bash
cp apps/frontend/.env.example apps/frontend/.env
# then fill in VITE_API_BASE_URL
```

## GitHub Secrets setup

Required for the CD pipeline — **GitHub → Settings → Secrets and variables → Actions:**

| Secret | Where to get it |
|--------|----------------|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` |
| `VITE_API_BASE_URL` | your production API URL |
