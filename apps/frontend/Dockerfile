# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile Frontend — Build multi-stage
#
# STAGE 1 (builder) : Node.js compile le projet React → dist/
# STAGE 2 (runner)  : nginx sert les fichiers statiques (image légère ~25MB)
#
# Pourquoi multi-stage ?
#   Sans multi-stage → l'image finale contiendrait Node.js + node_modules (~800MB)
#   Avec multi-stage  → l'image finale ne contient que nginx + dist/ (~25MB)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1 : Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Installer pnpm
RUN npm install -g pnpm@10

WORKDIR /app

# Copier les fichiers de dépendances EN PREMIER
# Astuce : Docker met en cache chaque instruction.
# Si package.json ne change pas, Docker réutilise le cache de pnpm install
# → builds beaucoup plus rapides
COPY package.json pnpm-lock.yaml ./

# Installer les dépendances (--frozen-lockfile : pas de mise à jour du lockfile)
RUN pnpm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# Construire l'app (TypeScript check + Vite build → dist/)
ARG VITE_API_BASE_URL=http://localhost:3001
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

# ── Stage 2 : Runner ─────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Mettre à jour les packages Alpine pour corriger les CVE connues (ex: zlib)
# apk upgrade installe les dernières versions des packages déjà présents dans l'image
RUN apk upgrade --no-cache

# Copier UNIQUEMENT les fichiers buildés depuis le stage builder
# Node.js et node_modules ne sont PAS copiés → image légère
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la config nginx (nécessaire pour React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Démarrer nginx en mode foreground (requis pour Docker)
CMD ["nginx", "-g", "daemon off;"]
