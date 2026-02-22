# Multi-Tenant E-Commerce Platform

A modern e-commerce platform built with Next.js and NestJS.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: NestJS 11, Drizzle ORM, PostgreSQL (Neon)
- **Tooling**: pnpm, Turborepo

## Project Structure

```
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # Shared utilities and types
├── turbo.json        # Turborepo configuration
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Environment Setup

Copy the example environment files:

```bash
cp apps/api/.env.example apps/api/.env
```

Update the environment variables with your values.

### Development

Run all apps in development mode:

```bash
pnpm dev
```

Or run individual apps:

```bash
pnpm --filter @repo/web dev   # Frontend on http://localhost:3000
pnpm --filter @repo/api dev   # Backend on http://localhost:3001
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## Docker Runbook

### Profiles

- `dev`: runs `api-dev` and `web-dev` only
- `prod`: runs `api` and `web` only

### Start Development Stack (Docker)

```bash
docker compose --profile dev down -v
docker compose --profile dev up --build
```

Ports:

- Web dev: `http://localhost:3002`
- API dev: `http://localhost:3003/health`

### Start Production-like Stack (Docker)

```bash
docker compose --profile prod down -v
docker compose --profile prod up --build
```

Ports:

- Web: `http://localhost:3000`
- API: `http://localhost:3001/health`

### Health and Troubleshooting

- Run `pnpm doctor` to check `pnpm`, `turbo`, and Compose profile configs.
- If `turbo: not found`, run `pnpm install --no-frozen-lockfile` to restore workspace tools.
- If `docker compose config` fails, verify service volume references and profile names in `docker-compose.yml`.

## License

ISC
