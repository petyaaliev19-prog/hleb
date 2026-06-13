# Agent Instructions

Status: active
Last updated: 2026-06-14
Owner: project
Purpose: short operating rules for AI agents working on Hlebushek.

## Read First

Before making substantial changes, read:

1. `PROJECT_CONTEXT.md`
2. `TASKS.md`
3. `DOCUMENTATION_RULES.md`

If the task touches architecture, data, or API contracts, also read and update the relevant owner:

1. `ARCHITECTURE.md`
2. `DATA_MODEL.md`
3. `API_CONTRACTS.md`

## Project Focus

Хлебушек is a service for pre-ordering fresh bread and pastries with in-store pickup.

Current focus:

1. Bakery catalog.
2. Bakery storefront with assortment and pickup slots.
3. Pre-order without online payment.
4. Bakery dashboard for orders, statuses, and production planning.

Do not add without an explicit product decision:

1. Delivery.
2. Online payment.
3. Subscriptions.
4. Ratings and reviews.
5. Mobile apps.
6. Complex CRM or logistics.

## Workflow

1. Prefer existing patterns in nearby files.
2. Keep changes small and tied to the current task.
3. Update documentation in the same commit when behavior, API, data, architecture, or scope changes.
4. Run `npm.cmd test` before committing when code changes.
5. Commit completed logical steps.
6. Push completed commits to `origin/main`.

## Module Placement

1. Put domain UI and domain helpers in `features/<domain>/`.
2. Put server-only persistence code in `server/`.
3. Keep `components/` for app-wide presentation components only.
4. Keep `lib/` for cross-domain browser API and formatting helpers.

## Git

Main branch: `main`
Remote: `origin` -> `https://github.com/petyaaliev19-prog/hleb.git`

Ignored working artifacts include `.next/`, `node_modules/`, `work/`, and `outputs/`.
