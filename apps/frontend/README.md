# React 19 Starter Kit

A modern, scalable front-end starter kit built with React 19 and best practices.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State Management | Zustand (with persist middleware) |
| Data Fetching | TanStack Query v5 + Axios |
| Forms | React Hook Form + Zod validation |
| Routing | React Router DOM v7 (lazy loading) |
| i18n | i18next (EN/FR) |
| Linting/Formatting | Biome |
| Testing | Vitest + Testing Library + MSW v2 |
| Mock Backend | json-server |

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Start both Vite dev server and json-server mock API
pnpm dev:all

# Or run them separately
pnpm dev         # Vite dev server on http://localhost:5173
pnpm mock:api    # json-server on http://localhost:3001
```

### Available Scripts

| Script | Description |
|--------|------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | TypeScript check + production build |
| `pnpm preview` | Preview production build |
| `pnpm mock:api` | Start json-server mock API |
| `pnpm dev:all` | Start dev server + mock API concurrently |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |

## Architecture

```
src/
├── main.tsx                    # Entry point
├── styles/index.css            # Tailwind v4 theme + dark mode
├── app/                        # Application shell
│   ├── providers.tsx           # QueryClient + Router + Suspense
│   ├── router.tsx              # Route definitions (lazy loaded)
│   ├── layout/                 # Layout components
│   │   ├── AppLayout.tsx       # Main layout (Header + Outlet)
│   │   └── Header.tsx          # Navigation + theme/locale toggles
│   └── error-handling/         # Error pages
│       ├── ErrorPage.tsx       # Generic error boundary
│       └── NotFoundPage.tsx    # 404 page
├── features/                   # Feature modules (vertical slices)
│   ├── home/pages/             # Home/welcome page
│   └── users/                  # Users feature
│       ├── pages/              # UsersPage (data fetching)
│       ├── components/         # UserCard, UserForm
│       └── schemas/            # Zod schemas + inferred types
├── shared/                     # Shared code
│   ├── components/ui/          # shadcn/ui components
│   ├── stores/app.store.ts     # Zustand store (theme + locale)
│   ├── hooks/                  # Reusable hooks
│   ├── lib/utils.ts            # cn() utility
│   └── types/                  # Shared types
├── api/                        # API layer
│   ├── client/axios.client.ts  # Axios instance
│   ├── services/               # API service functions
│   └── queries/                # TanStack Query hooks
├── i18n/                       # Internationalization
│   ├── config.ts               # i18next setup
│   └── locales/{en,fr}/        # Translation files
└── tests/                      # Test infrastructure
    ├── setup.ts                # Vitest + MSW setup
    ├── test-utils.tsx          # Custom render with providers
    └── msw/                    # Mock Service Worker handlers
```

## Features Demonstrated

- **Dark/Light Mode** — Toggle via header button, persisted to localStorage
- **i18n (EN/FR)** — Language toggle in header, all UI text translated
- **Data Fetching** — Users list fetched from json-server via TanStack Query + Axios
- **Form Validation** — Add user form with React Hook Form + Zod schema validation
- **Lazy Loading** — Route-based code splitting with React.lazy
- **Error Handling** — ErrorPage (route errors) + NotFoundPage (404)
- **Testing** — Vitest + Testing Library + MSW for API mocking

## Environment Variables

Copy `.env.example` to `.env` before running:

```
VITE_API_BASE_URL=http://localhost:3001
```

> **Security**: Never commit `.env` files. The `.gitignore` is configured to exclude them.
