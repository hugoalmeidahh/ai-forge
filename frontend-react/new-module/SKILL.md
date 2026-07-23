---
name: new-module
description: Scaffold a React domain module with UI, hooks, service, schemas and types.
user-invocable: true
---

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
