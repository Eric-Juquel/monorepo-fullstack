# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile Backend — Stub NestJS
# À compléter quand l'app NestJS sera créée
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1 : Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# RUN pnpm build  ← décommenter quand NestJS sera créé

# ── Stage 2 : Runner ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package.json ./

# Installer uniquement les dépendances de production
# RUN pnpm install --prod  ← décommenter quand NestJS sera créé

# COPY --from=builder /app/dist ./dist  ← décommenter quand NestJS sera créé

EXPOSE 3000

# CMD ["node", "dist/main.js"]  ← décommenter quand NestJS sera créé
CMD ["echo", "Backend NestJS pas encore configuré"]
