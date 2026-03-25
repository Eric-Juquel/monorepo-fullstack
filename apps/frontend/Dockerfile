# ─────────────────────────────────────────────────────────────────────────────
# Frontend Dockerfile — Multi-stage build
#
# STAGE 1 (builder) : Node.js compiles the React app → dist/
# STAGE 2 (runner)  : nginx serves the static files (lightweight image ~25MB)
#
# Why multi-stage?
#   Without multi-stage → final image contains Node.js + node_modules (~800MB)
#   With multi-stage    → final image contains only nginx + dist/ (~25MB)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching.
# If package.json hasn't changed, Docker reuses the cached pnpm install layer
# → significantly faster rebuilds
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL=http://localhost:3001
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# TypeScript check + Vite production build → dist/
RUN pnpm build

# ── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Upgrade Alpine packages to patch known CVEs (e.g. zlib, openssl).
# Re-run `docker build --no-cache` periodically or on each CI run to stay current.
RUN apk upgrade --no-cache

# Copy only the compiled assets from the builder stage
# Node.js and node_modules are NOT included → lightweight final image
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config required for React Router (SPA fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Run nginx in the foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
