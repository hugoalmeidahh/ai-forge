---
name: ai-forge-frontend-react-new-module
description: "Scaffold a React domain module with UI, hooks, service, schemas and types."
---

> **Portable references:** resolve `references/` from this skill directory, including paths inside reference catalogs. Load only the files needed. Project rules (`AGENTS.md`, `CLAUDE.md`, and `captain.md` when present) override stack L2, which overrides shared L0.

# New Module (React)

## Intent

Create an isolated business-domain module following React boundaries.

## Workflow

1. Clarify domain, routes, API use cases and permissions.
2. Confirm ownership; extend an existing aggregate module for satellite behavior.
3. Scaffold:
   ```text
   src/modules/<domain>/
   ├── components/
   ├── hooks/
   ├── services/
   ├── schemas/
   ├── types/
   └── index.ts
   ```
4. Add page/route only if the module owns a navigable screen.
5. Service owns HTTP/DTO mapping; hooks own TanStack Query; components receive typed props.
6. Add forms via React Hook Form + Zod, render all async states, then test/type-check.

## Checks

- No cross-domain deep imports.
- No direct fetch in components.
- Query keys, invalidation and error UX are domain-scoped.
- UI never receives raw sensitive API fields.

## Product quality and verification

Read [product UX](references/ui/product-ux.md) for journeys/states, [accessibility](references/ui/accessibility.md) for keyboard/focus/forms and [performance](references/ui/performance.md) when resource loading or interaction cost changes. Use [state and domain boundaries](references/ui/architecture.md) for ownership or cache changes. Load only what the task needs.

Reuse existing tokens and components. Preserve valid input after recoverable failures, scope query keys and caches by identity/tenant, and verify deep links and permission states. Prefer derived state to synchronized copies; clean up effects and cancel/discard stale responses. Do not add memoization or virtualization without a demonstrated cost.

A presentational fix does not require a new state library or a new test suite. For new behavior, verify the changed user outcome and relevant failure path using existing checks/browser capabilities. Report what was not run. Meta-framework projects follow their native server/client data lifecycle instead of duplicating it in a client cache.
