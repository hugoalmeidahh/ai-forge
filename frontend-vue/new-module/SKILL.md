---
name: new-module
description: Scaffold a Vue domain module with views, components, composables, services, schemas and types.
user-invocable: true
---

# New Module (Vue)

## Intent

Create an isolated business-domain module following Vue boundaries.

## Workflow

1. Clarify domain, routes, API use cases and permissions.
2. Confirm ownership; extend an existing aggregate module for satellite behavior.
3. Scaffold:
   ```text
   src/modules/<domain>/
   ├── components/
   ├── views/
   ├── composables/
   ├── services/
   ├── schemas/
   ├── types/
   └── index.ts
   ```
4. Service owns HTTP/DTO mapping; composables own Vue Query; SFCs render typed props.
5. Add forms via VeeValidate + Zod, render all async states, then test/type-check.

## Checks

- No cross-domain deep imports.
- No HTTP in SFCs.
- Query keys, invalidation and error UX are domain-scoped.
- UI never receives raw sensitive API fields.
