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
