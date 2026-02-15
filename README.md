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

## License

ISC
