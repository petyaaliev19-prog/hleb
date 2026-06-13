# Documentation Rules

Status: active
Last updated: 2026-06-14
Owner: project
Purpose: keep project documentation accurate, useful, and safe for AI agents.

## Core Principles

1. Documentation changes with code.
   If a change affects behavior, architecture, API contracts, data shape, business rules, user flows, or operational workflow, update the related documentation in the same commit.

2. One document owns one type of truth.
   Do not duplicate the same rule across many files. Link to the owning document instead.

3. Current truth comes before history.
   Active documents must describe how the project works now. Historical context belongs in decision notes, not in the main operating docs.

4. Write for execution.
   Prefer clear rules that an agent can follow: "do", "do not", "when changing X, update Y". Avoid vague future-facing text unless it is clearly marked as backlog.

5. Keep product limits explicit.
   If a capability is outside the current product focus, say so directly. Do not let agents infer delivery, online payment, subscriptions, ratings, mobile apps, or complex CRM behavior.

## Document Ownership

- `PROJECT_CONTEXT.md`: product purpose, users, current product focus, business rules, explicit non-goals.
- `TASKS.md`: current work, next work, later work, completed milestones, project notes.
- `DOCUMENTATION_RULES.md`: rules for maintaining documentation.
- `AGENTS.md`: short operating instructions for AI agents and contributors.
- `ARCHITECTURE.md`: code structure, data flow, important modules, runtime choices.
- `DATA_MODEL.md`: entities, fields, relationships, and invariants.
- `API_CONTRACTS.md`: routes, request shapes, response shapes, and error behavior.
- `DECISIONS.md`: dated product or technical decisions when history matters.

Create a missing document when a change needs an owner that does not exist yet.

## Required Header

Every active project document should start with:

```md
Status: active
Last updated: YYYY-MM-DD
Owner: project
Purpose: one sentence explaining why this file exists.
```

`README.md` may use a product-friendly opening instead, but it still must point to the main operating docs when they exist.

## When To Update

Update `PROJECT_CONTEXT.md` when:
- the product focus changes;
- a non-goal becomes a goal;
- a business rule changes;
- a user role or major user flow changes.

Update `TASKS.md` when:
- a task is completed;
- a task becomes the current focus;
- priorities change;
- a blocker appears or disappears.

Update `ARCHITECTURE.md` when:
- a new app area, module, or persistence layer appears;
- data flow changes;
- a shared library or framework decision changes;
- server/client responsibility changes.

Update `DATA_MODEL.md` when:
- an entity, field, relationship, or invariant changes;
- validation rules change;
- persistence behavior changes.

Update `API_CONTRACTS.md` when:
- an endpoint is added, removed, or renamed;
- request or response shape changes;
- error behavior changes;
- frontend usage changes.

Update `AGENTS.md` when:
- the default workflow for agents changes;
- new required docs are added;
- commit, push, test, or review rules change.

## Style Rules

1. Use short, direct sections.
2. Prefer numbered rules for workflows and invariants.
3. Prefer concrete file paths and command names.
4. Avoid stale labels such as "MVP" in active docs unless the section is explicitly historical.
5. Mark uncertain items as questions or backlog, not as current behavior.
6. Do not describe planned behavior as implemented behavior.
7. Do not hide business rules inside long prose.

## Pre-Commit Documentation Checklist

Before committing, check:

1. Did behavior change?
2. Did API shape or error behavior change?
3. Did the data model or validation rules change?
4. Did product scope or a business rule change?
5. Did a task move from `Next` to `Done`?
6. Did the agent workflow change?
7. Are old names, stale labels, or contradicted rules still present?

If any answer is yes, update the owning document before committing.
