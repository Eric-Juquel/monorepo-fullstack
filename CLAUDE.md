# CLAUDE.md

## Commandes

```bash
# Frontend
pnpm --filter frontend dev          # dev server (http://localhost:5173)
pnpm --filter frontend test:run     # tests
pnpm --filter frontend build        # build prod

# Workspace root
pnpm install                        # installe toutes les dépendances
pnpm -r lint                        # lint tous les packages

# Docker
docker compose up                   # frontend (localhost:8080) + backend (localhost:3000)
docker compose up frontend          # frontend seulement
docker build -t frontend:local ./apps/frontend   # build image manuellement
```

## Architecture

**Monorepo pnpm workspaces** — un seul repo Git, deux packages :

```
apps/
├── frontend/   React 19 + Vite + TailwindCSS + TanStack Query + Zustand + MSW + Vitest
└── backend/    NestJS (à créer — stub pour l'instant)
```

**CI/CD GitHub Actions :**
- `ci.yml` — 3 jobs parallèles : `ci-frontend`, `security` (Trivy), `ci-backend` (stub)
- `deploy.yml` — CD Vercel sur push main (nécessite 3 GitHub Secrets)

**Docker :**
- `apps/frontend/Dockerfile` — multi-stage : Node builder → nginx:alpine
- `docker-compose.yml` — orchestration locale frontend + backend

## Secrets GitHub à configurer pour le CD Vercel

Dans GitHub → Settings → Secrets and variables → Actions :
- `VERCEL_TOKEN` — token Vercel (vercel.com/account/tokens)
- `VERCEL_ORG_ID` — depuis `.vercel/project.json` après `vercel link`
- `VERCEL_PROJECT_ID` — depuis `.vercel/project.json` après `vercel link`
- `VITE_API_BASE_URL` — URL de l'API en production

## Guide d'apprentissage

`LEARNING.md` — guide complet pour reproduire ce setup de zéro, avec explications des concepts.

## Repo GitHub

https://github.com/Eric-Juquel/monorepo-fullstack (privé)
