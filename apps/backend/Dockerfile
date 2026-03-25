# ─────────────────────────────────────────────────────────────────────────────
# Backend Dockerfile — NestJS stub
# To be completed when the NestJS app is created
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# RUN pnpm build  ← uncomment when NestJS is created

# ── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN npm install -g pnpm@10

WORKDIR /app

COPY --from=builder /app/package.json ./

# Install production dependencies only
# RUN pnpm install --prod  ← uncomment when NestJS is created

# COPY --from=builder /app/dist ./dist  ← uncomment when NestJS is created

EXPOSE 3000

# CMD ["node", "dist/main.js"]  ← uncomment when NestJS is created
CMD ["echo", "NestJS backend not yet configured"]
