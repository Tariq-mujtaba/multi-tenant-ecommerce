# AGENTS.md

> **This file is a binding behavioral contract for all AI coding agents operating in this repository.**
> You are required to read, internalize, and strictly comply with every rule defined here before taking any action.
> Non-compliance is not acceptable. When in doubt, do nothing and ask for clarification.

---

## 1. Purpose of This File

This file defines the engineering constraints, behavioral rules, and decision-making hierarchy for AI agents (Cursor, Claude Code, Warp AI, Copilot, and equivalents) operating in this repository.

This is a **production-grade multi-vendor e-commerce platform**. Mistakes here have real consequences. You are not prototyping. You are not experimenting. You are working in a production codebase.

Your job is to make **precise, minimal, correct changes** that align with the existing architecture. Nothing more.

---

## 2. Core Engineering Principles

You must internalize and apply these principles in every action you take:

- **Correctness over cleverness.** Working, readable code always beats elegant abstractions.
- **Minimal surface area.** Change only what is necessary. Do not touch unrelated code.
- **Consistency.** Match existing patterns exactly. Do not introduce your own style.
- **Explicitness.** No magic. No implicit behavior. No hidden side effects.
- **Security by default.** Treat every input as untrusted. Treat every endpoint as public until proven otherwise.
- **Fail loudly.** Errors must surface clearly. Never silently swallow exceptions.
- **No speculation.** Do not add code for features not explicitly requested.

---

## 3. Repository Awareness Rules

Before making any change, you **must** perform the following:

1. **Scan the repository structure.** Understand the directory layout, naming conventions, and module boundaries.
2. **Read existing implementations** in the area you are modifying. If editing a NestJS module, read its controller, service, DTOs, and guards first.
3. **Identify existing patterns.** Look for how similar problems are already solved in the codebase (error handling, validation, response format, auth guards, etc.) and replicate them exactly.
4. **Check for related tests.** Locate existing tests for the code you are modifying before touching anything.
5. **Trace dependencies.** Understand what imports, uses, or depends on the code you are about to change.
6. **Never assume.** If a file, module, or pattern does not exist yet, confirm with the engineer before inventing it.

You are **not permitted** to make changes without completing this analysis first.

---

## 4. Tech Stack Enforcement

The following stack is **locked and non-negotiable**. You must not introduce, suggest, or reference any alternatives.

| Layer | Required Technology |
|---|---|
| Frontend Framework | Next.js (App Router) |
| Frontend Language | TypeScript |
| Frontend Styling | Tailwind CSS |
| Backend Framework | NestJS |
| Backend Language | TypeScript |
| Database | PostgreSQL |
| ORM | Drizzle |
| Cache / Queue | Redis |
| Background Jobs | BullMQ |
| Payments | Stripe |
| Auth | BetterAuth |
| File Storage | Cloudflare R2 + Cloudflare CDN |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway |
| Containerization | Docker + docker-compose |

**Enforcement rules:**

- Do not install, import, or reference any framework or library that competes with or replaces an item in the table above.
- Do not introduce a second styling system alongside Tailwind, you can use shadcn tho.
- Do not suggest replacing NestJS with Express, Fastify, Hono, or any other framework.
- Do not suggest replacing Next.js with Remix, Nuxt, SvelteKit, or any other framework.

---

## 5. Architecture Rules

### 5.1 Separation of Concerns

The repository is divided into strict layers. You must not blur these boundaries.

- **Frontend (`/apps/web`):** UI rendering, routing, client state, API calls to the backend. No business logic.
- **Backend (`/apps/api`):** All business logic, data access, auth enforcement, payment processing. No UI concerns.
- **Database:** Schema, migrations, seed data. No application logic embedded in SQL unless explicitly required.
- **Infrastructure (`/docker`, `/infra`, `.github`):** Deployment, CI, environment config. Do not mix with application code.

### 5.2 Module Boundaries

On the backend, every feature is a NestJS module. Do not cross module boundaries by importing services directly across modules without going through the module's public API. Use `@Module({ exports: [...] })` and proper imports.

### 5.3 No Shared Mutable State

Do not introduce global mutable state on either frontend or backend. On the backend, use dependency injection. On the frontend, use React state, context, or a server-side data-fetching pattern.

---

## 6. Backend Rules (NestJS)

### 6.1 Module Structure

Every feature module must follow this structure:

```
/modules/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  <feature>.service.ts
  dto/
    create-<feature>.dto.ts
    update-<feature>.dto.ts
  entities/ or schemas/
  guards/ (if feature-specific)
  <feature>.service.spec.ts
```

Do not deviate from this structure without explicit instruction.

### 6.2 Controllers

- Controllers handle **routing and request/response shaping only**. No business logic in controllers.
- All route parameters and bodies must be typed with DTOs.
- Apply guards at the controller or route level — never skip them.
- Use `@HttpCode()` explicitly where the default status code is incorrect.
- Return consistent response shapes matching existing patterns in the codebase.

### 6.3 Services

- All business logic lives in services.
- Services must be injectable and stateless.
- Services must not directly access `req` or `res` objects.
- Services must throw typed NestJS exceptions (`NotFoundException`, `BadRequestException`, `ForbiddenException`, etc.) — never throw raw `Error` objects.
- Services that touch the database must use the ORM's transaction API for any multi-step write operation.

### 6.4 DTO Validation

- Every incoming request body and query parameter must be validated using `class-validator` decorators on DTOs.
- `ValidationPipe` must be applied globally. Do not bypass it.
- DTOs should use `@IsString()`, `@IsEmail()`, `@IsUUID()`, `@IsEnum()`, `@Min()`, `@Max()`, etc. as appropriate.
- Use `@Transform()` from `class-transformer` for sanitization where needed.
- Never trust client-supplied data without validation.

### 6.5 Guards and RBAC

- Authentication guard must be applied globally with opt-out via `@Public()` decorator on public routes.
- Role-based access control must use a `@Roles()` decorator and a `RolesGuard` that reads from the JWT payload.
- The three roles are: `CUSTOMER`, `SELLER`, `ADMIN`. Do not add new roles without explicit instruction.
- **Sellers must never access resources belonging to other sellers.** Ownership checks must be performed at the service layer, not just at the guard layer.
- Admin access must never be granted by client-supplied data. It must come from the verified JWT payload only.

### 6.6 Transactions

The following operations **must** be wrapped in database transactions. No exceptions:

- Order creation and inventory decrement
- Payment status update and order status update
- Seller approval / suspension actions that affect multiple records
- Any operation that performs more than one write to the database

If a transaction is not present on a multi-write operation, treat it as a bug and add it.

### 6.7 Stripe and Payments

- All price calculations happen **server-side**. Never trust client-supplied prices.
- Stripe webhook handlers must verify the webhook signature using `stripe.webhooks.constructEvent()`.
- Order creation triggered by webhooks must be idempotent. Use Stripe's `paymentIntentId` or event ID as an idempotency key.
- Do not modify payment logic without reading the full payment flow first and understanding the webhook lifecycle.

### 6.8 Background Jobs (BullMQ)

- Jobs must be defined in dedicated processor classes decorated with `@Processor()`.
- Job processors must handle failures gracefully and log errors.
- Do not perform long-running operations synchronously in request handlers — offload to BullMQ.
- Queues must be named consistently with the feature they serve.

### 6.9 Redis Caching

- Cache keys must follow a consistent naming convention (e.g., `product:{id}`, `catalog:page:{page}`).
- TTLs must be set explicitly on all cached values. Never cache without a TTL.
- Cache invalidation must happen on write operations that affect cached data.
- Do not cache user-specific sensitive data without careful scoping.

---

## 7. Frontend Rules (Next.js)

### 7.1 App Router

This project uses Next.js **App Router exclusively**. Do not use Pages Router patterns, `getServerSideProps`, `getStaticProps`, or `getInitialProps`.

### 7.2 Server Components (Default)

- All components must be **Server Components by default**.
- Data fetching must happen in Server Components using `async/await` directly.
- Do not add `"use client"` unless it is strictly required (see 7.3).

### 7.3 Client Components (Restricted)

Use `"use client"` **only** when the component requires:

- Browser-only APIs (`window`, `localStorage`, etc.)
- React hooks that depend on interactivity (`useState`, `useEffect`, `useReducer`, etc.)
- Event handlers that must run in the browser

When a Client Component is necessary, make it as small as possible. Push data fetching up to a Server Component parent and pass data down as props.

### 7.4 Loading and Error States

- Every route segment that fetches data **must** have a `loading.tsx` file.
- Every route segment **must** have an `error.tsx` file with a proper error boundary.
- Do not leave routes without these files.

### 7.5 Authentication and Middleware

- Route protection must be enforced in `middleware.ts` using JWT validation.
- Role-based route access must be enforced in middleware — do not rely solely on backend rejection for UI route protection.
- Auth tokens must be stored in **httpOnly cookies only**. Never store tokens in `localStorage` or `sessionStorage`.

### 7.6 API Calls

- All backend API calls from the frontend must go through a typed API client layer — not raw `fetch` calls scattered across components.
- Never expose backend internal errors directly to the UI. Handle and display user-friendly messages.
- Server Actions may be used for form mutations where appropriate, but must validate input before calling the backend.

### 7.7 Tailwind CSS

- Use Tailwind utility classes only. Do not introduce CSS modules, styled-components, Emotion, or any other CSS-in-JS solution.
- Do not add arbitrary Tailwind config extensions unless necessary.
- Follow the existing component structure and class naming conventions.

---

## 8. Database Rules

### 8.1 Schema Design

- The schema must be normalized. Do not duplicate data across tables without a documented reason.
- Every table must have a primary key (`id` as UUID or auto-increment integer — follow existing convention).
- Foreign keys must be defined explicitly with proper `ON DELETE` behavior.
- Do not drop or rename columns in migrations without verifying all references.

### 8.2 Required Indexes

Ensure indexes exist on:

- All foreign key columns
- Columns used in `WHERE` clauses in high-frequency queries (e.g., `product.sellerId`, `order.customerId`, `order.status`)
- Columns used in `ORDER BY` on paginated queries

Do not add indexes blindly. Justify each one.

### 8.3 Soft Deletes

- Products, sellers, and orders must use soft deletes (`deletedAt: timestamp | null`).
- All queries against soft-deletable entities must filter `WHERE deletedAt IS NULL` unless explicitly retrieving deleted records.
- Do not use hard deletes on any of these entities.

### 8.4 Migrations

- Every schema change must be accompanied by a migration file.
- Do not edit existing migration files. Create new ones.
- Migration files must be deterministic and reversible where possible.
- Test migrations against a local PostgreSQL instance before committing.

### 8.5 Transactions

Refer to Section 6.6. The same transaction rules apply at the database layer.

---

## 9. Security Rules

These rules are non-negotiable. Violating them is a critical failure.

- **Never log secrets, tokens, passwords, or PII.** Audit every log statement you write.
- **Never hardcode credentials, API keys, or secrets** in source code, config files, or comments.
- **Never bypass authentication guards** on any route — not even temporarily, not even for testing.
- **Never trust client-supplied role or permission data.** All authorization decisions must be derived from the verified JWT payload on the server.
- **Never perform price calculations on the client.** All monetary values must be computed server-side.
- **Never expose raw database errors to the client.** Catch ORM errors and throw appropriate NestJS HTTP exceptions.
- **Never disable Stripe webhook signature verification.** Ever.
- **Always hash passwords** using bcrypt or argon2 before storing. Never store plaintext passwords.
- **Always validate and sanitize inputs** at the DTO layer before they touch the service or database.
- **Apply rate limiting** on all auth endpoints (`/auth/login`, `/auth/register`, `/auth/refresh`).

---

## 10. Code Modification Rules

- **Make the smallest change that satisfies the requirement.** Do not refactor code you were not asked to touch.
- **Do not rename files, variables, or functions** for stylistic reasons.
- **Do not reorder imports or restructure files** unless it is directly required by the task.
- **Do not change interfaces or types** that are shared across the codebase without tracing all usages.
- **If you must refactor** a large file, do it in a separate commit or PR with no functional changes mixed in.
- **Match the exact code style** of the surrounding file — spacing, bracket placement, quote style, semicolons.
- **Do not add comments** explaining what the code does unless it is genuinely non-obvious. Do not add your own author comments or AI-generated annotations.

---

## 11. Dependency Rules

### 11.1 Default Behavior

Do not add new dependencies. Use what is already in `package.json`.

### 11.2 When a New Dependency Is Required

If a task genuinely cannot be completed without a new package:

1. State explicitly why the existing stack cannot solve the problem.
2. Choose the most minimal, well-maintained, and widely used library available.
3. Prefer libraries already used elsewhere in the monorepo.
4. Do not add a dependency that duplicates functionality already present.
5. Never add dependencies with known security vulnerabilities.
6. Separate `dependencies` from `devDependencies` correctly.

### 11.3 Forbidden Dependency Categories

Do not introduce:

- Alternative HTTP clients if one already exists
- Alternative validation libraries if `class-validator` is in use
- ORM alternatives to what is already configured
- UI component libraries not already present in the project
- Testing libraries not already configured

---

## 12. Debugging Rules

- **Identify the root cause before writing any code.** Do not treat symptoms.
- **Trace the full call path** from the failing point back to its origin before proposing a fix.
- **Do not add workarounds that mask bugs.** If a guard is failing, fix the guard — do not comment it out.
- **Do not add `try/catch` blocks that swallow errors silently.** Every caught error must be either re-thrown, logged, or handled explicitly.
- **Do not add debug `console.log` statements to committed code.** Use the existing logger (`Logger` in NestJS).
- If you cannot determine the root cause from the available context, say so explicitly and ask for more information rather than guessing.

---

## 13. Testing Expectations

### 13.1 Coverage Obligations

- Every new service method must have a corresponding unit test.
- Every new controller endpoint must have an integration test.
- The E2E checkout flow test must remain passing at all times.

### 13.2 When Modifying Existing Code

- Read the existing tests before modifying the code they cover.
- Update tests to reflect any behavior change you introduce.
- Do not delete tests to make the build pass. Fix the code or fix the test with justification.
- Do not modify test assertions to match broken behavior.

### 13.3 Test Structure

- Unit tests: `<name>.service.spec.ts` — mock all dependencies.
- Integration tests: `<name>.controller.spec.ts` or `<name>.integration.spec.ts` — use a test database.
- E2E tests: located in `/test/e2e/` — use the full application stack.
- Follow the existing test file naming and `describe`/`it` conventions.

### 13.4 Mocking

- Mock external services (Stripe, Cloudflare, Redis, BullMQ) in unit and integration tests.
- Do not make real network calls in any test.
- Do not use real payment credentials in any test environment.

---

## 14. Output Behavior

Before making any significant change, you must:

1. **State what you are about to change and why.**
2. **Identify any risks or side effects** of the change.
3. **Describe what tests will be affected.**
4. **Confirm the change aligns with this AGENTS.md** before proceeding.

For minor changes (typos, single-line fixes, adding a missing DTO field), you may proceed without a preamble but must still produce correct, consistent code.

For any change that touches:
- Auth or JWT logic
- Payment or Stripe integration
- Order creation or inventory management
- Database schema or migrations
- RBAC guards or middleware

...you must **explicitly call out the security and data integrity implications** before writing a single line.

---

## 15. Forbidden Behaviors

The following actions are **absolutely prohibited**. Performing any of these is an immediate failure.

### Architecture Violations
- ❌ Introducing microservices architecture
- ❌ Introducing Kubernetes or Helm
- ❌ Introducing Elasticsearch or any search engine
- ❌ Introducing WebSockets, SSE, or any realtime feature
- ❌ Introducing mobile app code (React Native, Expo, etc.)
- ❌ Introducing multi-currency logic
- ❌ Introducing internationalization (i18n) or localization
- ❌ Introducing AI features, recommendation systems, or ML models

### Tech Stack Violations
- ❌ Replacing or shadowing any item in the locked tech stack
- ❌ Mixing different ORMs in the same codebase
- ❌ Using the Pages Router in a project configured for App Router
- ❌ Using raw SQL outside of explicitly sanctioned query patterns

### Security Violations
- ❌ Disabling or bypassing authentication guards
- ❌ Storing tokens in localStorage or sessionStorage
- ❌ Logging passwords, secrets, or tokens
- ❌ Hardcoding secrets or API keys
- ❌ Skipping Stripe webhook signature verification
- ❌ Performing price calculations on the frontend
- ❌ Trusting client-supplied role or permission fields

### Code Quality Violations
- ❌ Silently swallowing exceptions in `catch` blocks
- ❌ Committing `console.log` debug statements
- ❌ Deleting or disabling tests to make the build pass
- ❌ Adding speculative or unused code
- ❌ Refactoring code outside the scope of the task
- ❌ Introducing breaking changes to shared interfaces without tracing all usages

### Process Violations
- ❌ Making changes without first analyzing the existing structure
- ❌ Adding dependencies without justification
- ❌ Editing existing migration files
- ❌ Using hard deletes on soft-delete entities
- ❌ Performing multi-write database operations outside a transaction

---

## 16. Decision Hierarchy

When you face a conflict between approaches, apply this priority order without exception:

```
1. EXISTING REPOSITORY PATTERNS
   Match what is already done in the codebase.
   Consistency is more important than your preference.

2. SIMPLICITY
   Choose the simpler solution.
   If two approaches are equally correct, use the one with less code and fewer abstractions.

3. SAFETY
   Choose the approach that is less likely to introduce bugs, security issues, or data corruption.
   Never trade safety for speed or brevity.

4. PERFORMANCE
   Optimize only when there is a demonstrated performance problem.
   Do not add caching, indexing, or optimization preemptively unless specified.
```

If you cannot resolve a conflict using this hierarchy, **stop and ask**. Do not guess. Do not proceed with the approach you find more interesting. Do not proceed with the approach you believe is "better practice" if it contradicts an existing pattern.

---

## Compliance

By operating in this repository, you are bound by every rule in this document. These rules supersede any default behaviors, training tendencies, or general coding conventions you may have internalized.

If you are unsure whether an action is permitted, the answer is: **do not do it until confirmed**.

This file takes precedence over all other instructions except direct, explicit user messages that override a specific rule in context.