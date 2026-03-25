# Guide CI/CD — Monorepo React 19 + NestJS

Ce guide te permet de **reproduire entièrement ce setup de zéro**, étape par étape, avec les explications des concepts derrière chaque décision.

---

## Prérequis

Installe ces outils avant de commencer :

```bash
# Node.js 22+
node --version   # v22.x

# pnpm 10+
npm install -g pnpm@10
pnpm --version   # 10.x

# GitHub CLI (pour créer les repos depuis le terminal)
brew install gh
gh --version
gh auth login    # Se connecter à ton compte GitHub

# Docker Desktop
# Télécharge depuis https://www.docker.com/products/docker-desktop
docker --version
docker compose version
```

---

## Comprendre CI/CD avant de coder

**CI (Continuous Integration)** = chaque fois que tu pousses du code, un pipeline automatique :
- vérifie que le code compile (TypeScript)
- vérifie le style (linter)
- lance les tests
- fait un build de vérification

**CD (Continuous Deployment)** = si la CI passe, le code est automatiquement déployé en production.

**Pipeline = CI + CD**, orchestré par GitHub Actions (des fichiers YAML dans `.github/workflows/`).

**Monorepo** = un seul repo Git contenant plusieurs projets indépendants (ici : frontend + backend). L'avantage : une seule CI, un seul historique Git, des dépendances partagées possibles.

---

## Étape 1 — Créer la structure monorepo

### 1.1 Créer le dossier et initialiser Git

```bash
mkdir monorepo-fullstack
cd monorepo-fullstack
git init
```

`git init` crée un dossier `.git/` qui fait de ce dossier un repo Git.

### 1.2 Configurer pnpm workspaces

Crée `pnpm-workspace.yaml` à la racine :

```yaml
packages:
  - "apps/*"
```

Ce fichier dit à pnpm : "tous les dossiers dans `apps/` sont des packages du workspace".

Crée le `package.json` root :

```json
{
  "name": "monorepo-fullstack",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend dev",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test:run",
    "test:frontend": "pnpm --filter frontend test:run",
    "test:backend": "pnpm --filter backend test:run"
  },
  "engines": {
    "node": ">=22",
    "pnpm": ">=10"
  }
}
```

**`pnpm --filter frontend`** = n'exécute la commande que dans le package dont le `name` dans `package.json` est `"frontend"`.
**`pnpm -r`** = exécute la commande dans tous les packages récursivement.

### 1.3 Créer la structure apps/

```bash
mkdir -p apps/frontend
mkdir -p apps/backend
```

### 1.4 Copier le starter kit dans apps/frontend

```bash
# Copie tout le contenu du starter kit (sans le .git du starter kit)
cp -r /chemin/vers/starter-React-19/. apps/frontend/

# Supprimer les dossiers générés (ils seront recréés)
rm -rf apps/frontend/.git
rm -rf apps/frontend/node_modules
rm -rf apps/frontend/dist
rm -rf apps/frontend/coverage
```

Dans `apps/frontend/package.json`, assure-toi que le `name` est `"frontend"` :

```json
{
  "name": "frontend",   ← important pour --filter
  ...
}
```

### 1.5 Créer le stub backend

Crée `apps/backend/package.json` :

```json
{
  "name": "backend",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "echo 'Backend pas encore créé'",
    "build": "echo 'Backend pas encore créé'",
    "lint": "echo 'Backend pas encore créé'",
    "test:run": "echo 'Backend pas encore créé'"
  }
}
```

### 1.6 Créer le .gitignore root

```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
coverage/
.vercel/
EOF
```

### 1.7 Installer les dépendances

```bash
pnpm install
```

pnpm va installer les dépendances de tous les packages et créer un seul `node_modules/` à la racine (hoisting).

### ✅ Checkpoint

```bash
pnpm --filter frontend test:run   # doit passer
pnpm --filter frontend build      # doit builder
```

---

## Étape 2 — GitHub Actions CI

### 2.1 Créer le dossier workflows

```bash
mkdir -p .github/workflows
```

### 2.2 Comprendre la structure d'un workflow GitHub Actions

Un workflow YAML est composé de :

```yaml
name: CI                  # Nom affiché dans GitHub Actions

on:                       # Déclencheurs
  push:
    branches: [main]      # Se déclenche sur push vers main
  pull_request:
    branches: [main]      # Se déclenche sur les PR vers main

jobs:                     # Ensemble de jobs (s'exécutent en parallèle par défaut)
  mon-job:                # Nom du job
    runs-on: ubuntu-latest  # OS de la machine virtuelle GitHub

    steps:                # Séquence d'étapes (s'exécutent en séquence)
      - name: Checkout    # Description de l'étape
        uses: actions/checkout@v4  # Action réutilisable du marketplace

      - name: Ma commande
        run: echo "Hello"  # Commande shell
```

**`uses`** = utilise une action du marketplace GitHub (code écrit par d'autres)
**`run`** = exécute une commande shell directement
**`needs`** = dépendance entre jobs (ex: `needs: ci-frontend` → attend que ci-frontend finisse)

### 2.3 Créer `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci-frontend:
    name: CI Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm --filter frontend tsc -b --noEmit

      - name: Lint
        run: pnpm --filter frontend lint

      - name: Tests
        run: pnpm --filter frontend test:run

      - name: Build
        run: pnpm --filter frontend build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL || 'http://localhost:3001' }}

  ci-backend:
    name: CI Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Stub
        run: echo "Backend CI à configurer"
```

### ✅ Checkpoint

Pousse le code → va sur `github.com/ton-user/monorepo-fullstack/actions` → tu dois voir le pipeline s'exécuter.

---

## Étape 3 — Déploiement Vercel (CD)

### 3.1 Comprendre CI vs CD

```
Push sur main
    │
    ▼
CI (ci.yml)
    │ type check ✓
    │ lint ✓
    │ tests ✓
    │ build ✓
    ▼
CD (deploy.yml)
    │ deploy vers Vercel ✓
    ▼
    🌐 Site en production
```

La CI valide. Le CD livre. On les sépare pour pouvoir réutiliser la CI sur les PRs sans déployer à chaque fois.

### 3.2 Configurer Vercel

1. Va sur [vercel.com](https://vercel.com) → crée un compte
2. "New Project" → importe ton repo GitHub
3. Dans "Root Directory" → spécifie `apps/frontend`
4. Vercel détecte automatiquement Vite
5. Ajoute la variable d'environnement `VITE_API_BASE_URL`

### 3.3 Récupérer les credentials Vercel

```bash
# Installe Vercel CLI
pnpm add -g vercel

# Dans apps/frontend/, lie le projet Vercel
cd apps/frontend
vercel link

# Cela crée .vercel/project.json avec :
# { "orgId": "team_xxx", "projectId": "prj_xxx" }
cat .vercel/project.json
```

Récupère aussi ton token : [vercel.com/account/tokens](https://vercel.com/account/tokens)

### 3.4 Ajouter les GitHub Secrets

Dans ton repo GitHub → Settings → Secrets and variables → Actions → New secret :

| Secret | Valeur |
|--------|--------|
| `VERCEL_TOKEN` | Token généré sur vercel.com |
| `VERCEL_ORG_ID` | `orgId` dans `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` dans `.vercel/project.json` |
| `VITE_API_BASE_URL` | URL de ton API en production |

### 3.5 Créer `apps/frontend/vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Nécessaire pour que React Router fonctionne : toutes les routes sont redirigées vers `index.html`.

### 3.6 Créer `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]    # CD uniquement sur main, jamais sur les PRs

jobs:
  deploy-frontend:
    name: Deploy Frontend → Vercel
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: apps/frontend
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
        working-directory: .
      - run: pnpm add -g vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### ✅ Checkpoint

Fais un push → GitHub Actions lance `deploy.yml` → Vercel déploie → URL publique disponible.

---

## Étape 4 — Docker (frontend)

### 4.1 Comprendre les images Docker

Une **image Docker** = snapshot d'un environnement (OS + logiciels + code).
Un **container** = instance en cours d'exécution d'une image.
Un **Dockerfile** = recette pour construire une image.

### 4.2 Pourquoi le multi-stage ?

```
Sans multi-stage :
  Image = Ubuntu + Node.js + node_modules + dist/
  Taille = ~800MB 😱

Avec multi-stage :
  Stage 1 (builder) : Ubuntu + Node.js + node_modules → compile → dist/
  Stage 2 (runner)  : nginx + dist/ seulement
  Taille finale = ~25MB ✅
```

### 4.3 Créer `apps/frontend/nginx.conf`

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Fallback pour React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache long sur les assets avec hash (immutable)
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Pas de cache sur index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### 4.4 Créer `apps/frontend/Dockerfile`

```dockerfile
# Stage 1 : Build
FROM node:22-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_BASE_URL=http://localhost:3001
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

# Stage 2 : Serve
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Pourquoi copier `package.json` avant le code source ?**
Docker met en cache chaque instruction. Si `package.json` n'a pas changé, il réutilise le cache de `pnpm install` → builds beaucoup plus rapides.

### 4.5 Tester le build Docker

```bash
cd apps/frontend

# Build l'image (--build-arg pour passer VITE_API_BASE_URL)
docker build -t frontend:local --build-arg VITE_API_BASE_URL=http://localhost:3001 .

# Lancer le container
docker run -p 8080:80 frontend:local

# Ouvrir http://localhost:8080
```

### ✅ Checkpoint

```bash
docker build -t frontend:local .
docker run -p 8080:80 frontend:local
# → http://localhost:8080 doit afficher l'app React
```

---

## Étape 5 — docker-compose

### 5.1 Comprendre docker-compose

`docker-compose.yml` orchestre **plusieurs containers** ensemble :
- définit les services (frontend, backend, db)
- configure les ports, les réseaux, les volumes
- une seule commande `docker compose up` lance tout

### 5.2 Créer `docker-compose.yml` à la racine

```yaml
services:
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://backend:3000
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**`depends_on`** = démarre le backend avant le frontend
**`networks`** = les services se parlent par leur nom (`http://backend:3000`) sans exposer leurs ports
**`context`** = dossier de build (où se trouve le Dockerfile)

### 5.3 Commandes docker-compose

```bash
# Démarrer tous les services
docker compose up

# Démarrer en arrière-plan
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down

# Reconstruire les images
docker compose build

# Démarrer un seul service
docker compose up frontend
```

### ✅ Checkpoint

```bash
docker compose up
# → http://localhost:8080 doit afficher l'app React
```

---

## Étape 6 — Scan de vulnérabilités avec Trivy

### 6.1 Comprendre les CVE et pourquoi scanner les images Docker

Une **CVE** (Common Vulnerabilities and Exposures) est une faille de sécurité publiquement connue, référencée par un identifiant (ex: `CVE-2023-12345`). Les bases de données de CVE (NVD, OSV...) sont mises à jour en permanence.

Sans scan, ton image Docker peut embarquer :
- Des **packages OS vulnérables** (libc, openssl, curl dans l'image `nginx:alpine`)
- Des **packages npm vulnérables** (dépendances transitives de ton projet)

**Trivy** (par Aqua Security) est le scanner open source le plus utilisé en CI/CD. Il :
- interroge les bases de CVE connues
- analyse les packages installés dans l'image ou le filesystem
- classe les vulnérabilités par sévérité : CRITICAL, HIGH, MEDIUM, LOW

### 6.2 Deux types de scans complémentaires

```
Scan 1 : Filesystem (npm)
  → Analyse package.json / pnpm-lock.yaml
  → Détecte les packages npm avec des CVE connues
  → Rapide (pas besoin de Docker)

Scan 2 : Image Docker
  → Build l'image puis la scanne
  → Détecte les vulnérabilités OS (alpine, nginx, openssl...)
  → Plus complet mais plus lent (~2 min)
```

### 6.3 Ajouter le job `security` dans `ci.yml`

Dans `.github/workflows/ci.yml`, ajoute ce job (au même niveau que `ci-frontend`) :

```yaml
security:
  name: Security Scan (Trivy)
  runs-on: ubuntu-latest

  steps:
    - name: Checkout
      uses: actions/checkout@v4

    # Scan 1 : dépendances npm
    - name: Scan npm dependencies
      uses: aquasecurity/trivy-action@0.28.0
      with:
        scan-type: fs
        scan-ref: ./apps/frontend
        format: table
        severity: CRITICAL,HIGH
        exit-code: "1"
        ignore-unfixed: true

    # Scan 2 : image Docker
    - name: Build Docker image for scanning
      run: docker build -t frontend:${{ github.sha }} ./apps/frontend

    - name: Scan Docker image
      uses: aquasecurity/trivy-action@0.28.0
      with:
        scan-type: image
        image-ref: frontend:${{ github.sha }}
        format: table
        severity: CRITICAL,HIGH
        exit-code: "1"
        ignore-unfixed: true
```

**`exit-code: "1"`** → le job échoue si des vulnérabilités CRITICAL ou HIGH sont trouvées.
**`ignore-unfixed: true`** → ignore les CVE pour lesquelles il n'existe pas encore de correctif (tu ne peux rien y faire).
**`format: table`** → affiche les résultats sous forme de tableau dans les logs CI.

### 6.4 Lire les résultats Trivy

Exemple de sortie dans les logs GitHub Actions :

```
2024-01-01T00:00:00.000Z    INFO    Vulnerability scanning is enabled
frontend:abc1234 (alpine 3.19.0)
================================
Total: 0 (HIGH: 0, CRITICAL: 0)   ← ✅ aucune vulnérabilité

apps/frontend (pnpm)
====================
Total: 2 (HIGH: 2, CRITICAL: 0)
┌──────────────────┬────────────────┬──────────┬──────────────────────┐
│    Library       │  Vulnerability │ Severity │ Installed Version    │
├──────────────────┼────────────────┼──────────┼──────────────────────┤
│ some-package     │ CVE-2023-XXXXX │ HIGH     │ 1.0.0 (fixed: 1.0.1) │
└──────────────────┴────────────────┴──────────┴──────────────────────┘
```

Si une vulnérabilité est trouvée avec un correctif disponible → mets à jour le package.

### 6.5 Tester Trivy en local

```bash
# Installer Trivy (macOS)
brew install trivy

# Scanner les dépendances npm
trivy fs --severity CRITICAL,HIGH ./apps/frontend

# Scanner une image Docker
docker build -t frontend:local ./apps/frontend
trivy image --severity CRITICAL,HIGH frontend:local
```

### ✅ Checkpoint

- `trivy fs ./apps/frontend` → 0 vulnérabilité CRITICAL/HIGH
- `trivy image frontend:local` → 0 vulnérabilité CRITICAL/HIGH
- Le job `security` est vert dans GitHub Actions

---

## Étape 7 — Créer le repo GitHub et pousser

```bash
# À la racine du monorepo
cd monorepo-fullstack


# Créer le repo privé sur GitHub
gh repo create monorepo-fullstack --private --source=. --remote=origin

# Premier commit
git add .
git commit -m "feat: init monorepo fullstack CI/CD"

# Pousser → les GitHub Actions vont se déclencher
git push -u origin main
```

Va sur `github.com/ton-user/monorepo-fullstack/actions` pour voir les pipelines s'exécuter.

---

## Architecture finale

```
monorepo-fullstack/
├── .github/
│   └── workflows/
│       ├── ci.yml         ← CI : lint + tests + build
│       └── deploy.yml     ← CD : déploiement Vercel
├── apps/
│   ├── frontend/          ← React 19 + Vite + TailwindCSS
│   │   ├── src/
│   │   ├── Dockerfile     ← multi-stage Node→nginx
│   │   ├── nginx.conf
│   │   ├── vercel.json
│   │   └── package.json   (name: "frontend")
│   └── backend/           ← NestJS (à créer)
│       ├── Dockerfile
│       └── package.json   (name: "backend")
├── docker-compose.yml
├── package.json           ← root workspace scripts
└── pnpm-workspace.yaml
```

**Pipeline complet :**

```
Push sur main
    ↓
GitHub Actions CI (ci.yml) — jobs en parallèle
  ├── ci-frontend  → type check + lint + tests + build ✓
  ├── ci-backend   → (stub, à activer avec NestJS)
  └── security     → Trivy : scan npm + scan image Docker ✓
    ↓ (si CI passe)
GitHub Actions CD (deploy.yml)
  ├── deploy-frontend → Vercel 🚀
  └── deploy-backend  → (à configurer avec NestJS)
```

---

## Glossaire

| Terme | Définition |
|-------|-----------|
| **CI** | Continuous Integration — validation automatique du code à chaque push |
| **CD** | Continuous Deployment — déploiement automatique si la CI passe |
| **Pipeline** | Séquence automatisée d'étapes CI/CD |
| **Job** | Unité de travail dans un workflow GitHub Actions (s'exécute sur une VM) |
| **Step** | Étape individuelle dans un job (une commande ou une action) |
| **Action** | Code réutilisable du marketplace GitHub (`uses: actions/checkout@v4`) |
| **Secret** | Variable d'environnement chiffrée stockée dans GitHub (tokens, passwords) |
| **Monorepo** | Un seul repo Git contenant plusieurs projets |
| **Workspace** | Fonctionnalité pnpm pour gérer les dépendances d'un monorepo |
| **--filter** | Flag pnpm pour exécuter une commande dans un package spécifique |
| **Image Docker** | Snapshot d'un environnement (OS + logiciels + code) |
| **Container** | Instance en cours d'exécution d'une image Docker |
| **Multi-stage** | Technique Dockerfile pour réduire la taille de l'image finale |
| **nginx** | Serveur web léger, utilisé pour servir les fichiers statiques React |
| **docker-compose** | Outil pour orchestrer plusieurs containers ensemble |
| **Vercel** | Plateforme de déploiement spécialisée pour les frontends (SPA, SSR) |
| **SPA** | Single Page Application — app React où toutes les routes → `index.html` |
| **CVE** | Common Vulnerabilities and Exposures — référence publique d'une faille de sécurité |
| **Trivy** | Scanner open source de vulnérabilités (images Docker, filesystems, dépendances) |
| **SARIF** | Format standard pour rapporter des vulnérabilités dans GitHub Security tab |

---

## Prochaines étapes (quand NestJS sera créé)

1. Initialiser NestJS dans `apps/backend/` : `pnpm --filter backend nest new .`
2. Mettre à jour `apps/backend/Dockerfile` (décommenter les lignes)
3. Activer le job `ci-backend` dans `ci.yml` (décommenter les steps)
4. Configurer `deploy-backend` dans `deploy.yml` (Railway, Fly.io, ou autre)
5. Mettre à jour `docker-compose.yml` pour ajouter la BDD (PostgreSQL)
