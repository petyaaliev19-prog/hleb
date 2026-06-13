# Architecture

Status: active
Last updated: 2026-06-14
Owner: project
Purpose: describe the current code structure, runtime boundaries, and data flow.

## Runtime

1. The active application is a `Next.js` App Router app under `app/`.
2. React UI components live under `components/`.
3. API routes live under `app/api/`.
4. The active persistence layer is SQLite through `node:sqlite`.
5. The local database file is `work/hlebushek.db`; `work/` is ignored by git.

## Data Flow

1. Server pages read from `dbRepository` in `lib/db-repository.js`.
2. Client components call helpers in `lib/api.js`.
3. `lib/api.js` calls Next.js API routes.
4. API routes call `dbRepository`.
5. `dbRepository` validates business rules and writes SQLite.

Do not make client components import seed data for active state. Pass server-loaded data into the component or fetch it through `lib/api.js`.

## Current Modules

- `app/`: pages, layouts, and API route handlers.
- `components/`: reusable UI and page views.
- `lib/api.js`: browser-side API client helpers.
- `lib/db-repository.js`: SQLite repository and business validation for persistent state.
- `lib/order-status.js`: order status state machine.
- `lib/order-utils.js`: cart, summary, and grouping helpers.
- `lib/bakery-utils.js`: shared bakery helpers that are safe for client and server code.
- `data/seed-data.js`: initial seed data used to bootstrap an empty SQLite database.
- `data/mock-data.js` and `lib/mock-store.js`: legacy/test support around seed data, not the active app state source.
- `tests/`: Node test runner coverage for business helpers and repository behavior.

## Legacy Prototype

The files under `legacy/standalone-prototype/` are the old standalone prototype. They are not the active application runtime. New product work should happen in `app/`, `components/`, `lib/`, and `data/`.

## Next.js Dynamic Params

This project targets Next.js 15. Dynamic route `params` should be awaited in pages and route handlers:

```js
const { slug } = await params;
```

## Structure Direction

Keep shared domain logic in small modules under `lib/`.

Create a new module when:

1. Logic is used by both server and client code.
2. A business rule needs focused tests.
3. A component starts owning validation or transformation that belongs to the domain.

Do not create large generic utility files. Prefer domain names such as `bakery-utils.js`, `order-utils.js`, or `order-status.js`.
