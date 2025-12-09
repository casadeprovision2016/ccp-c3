---
applyTo: '**'
---
# Copilot Instructions for AI Agents

## Project Overview
This is a Next.js application migrated from Supabase (PostgreSQL + Auth) to Cloudflare D1 (SQLite) and Workers, with custom JWT-based authentication. The project is structured for serverless deployment and uses modern TypeScript, Hono, Drizzle ORM, and Cloudflare tooling.

## Key Architectural Patterns
- **Authentication:**
  - Custom JWT auth (see `src/lib/auth/`).
  - Session management via HTTP-only cookies (`src/lib/auth/session.ts`).
  - Auth middleware in `src/middleware.ts` protects `/panel` routes and redirects as needed.
- **Database:**
  - Cloudflare D1 (SQLite) schema and migrations in `migrations/`.
  - Drizzle ORM for type-safe queries (see `src/lib/db/` and `src/lib/queries/`).
- **API Routes:**
  - All data access via Next.js API routes in `src/app/api/`.
  - Example CRUD: `src/app/api/donations/route.ts`.
- **Frontend:**
  - App directory structure: `src/app/(public)`, `src/app/(dashboard)`.
  - Shared UI components in `src/components/`.
  - Hooks for auth and mobile detection in `src/hooks/`.

## Developer Workflows
- **Install dependencies:**
  ```bash
  pnpm install
  ```
- **Run locally:**
  ```bash
  pnpm dev
  # or for Cloudflare Workers
  pnpm wrangler dev
  ```
- **Apply migrations:**
  ```bash
  pnpm wrangler d1 execute ccp-c3-db --local --file=./migrations/0001_initial_schema.sql
  ```
- **Build for production:**
  ```bash
  pnpm build
  ```

## Project-Specific Conventions
- Use `@/lib/*` for all shared logic (auth, db, utils).
- Use `nanoid` for ID generation.
- All API access and DB queries must go through API routes (no direct DB access from client).
- Use `Hono` for lightweight server logic where needed.
- Use Drizzle ORM for all SQL queries; keep schema types in `src/lib/db/schema.ts`.
- Use `bcryptjs` for password hashing.
- Use `jose` for JWT operations.
- Environment variables (e.g., `JWT_SECRET`) are set in `wrangler.jsonc`.

## Integration Points
- **Cloudflare D1:** Managed via Wrangler CLI and `wrangler.jsonc` config.
- **Cloudflare Workers:** Deployed via `opennextjs-cloudflare`.
- **Supabase:** Legacy code in `src/lib/supabase/` and `old.supabase/` (to be removed).

## Examples
- See `src/lib/auth/jwt.ts` for JWT helpers.
- See `src/app/api/auth/login/route.ts` for login flow.
- See `src/app/api/donations/route.ts` for CRUD pattern.
- See `src/middleware.ts` for route protection logic.

## Migration Notes
- Old Supabase logic is being replaced; avoid using `src/lib/supabase/*` for new code.
- Database schema is defined in `migrations/` and mirrored in Drizzle types.

---
For more details, see `README.md` and comments in key files. If a pattern or workflow is unclear, ask for clarification or check recent migration notes in the README.
