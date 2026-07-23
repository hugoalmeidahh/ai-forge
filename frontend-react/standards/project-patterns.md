# Project Patterns — React

## Stack

- React + TypeScript strict mode; Vite or Next.js per project.
- Server state: TanStack Query.
- Input/API validation: Zod.
- Forms: React Hook Form + Zod resolver.
- Local client state only when server state/URL state do not fit.

## Module Layout

```text
src/
├── modules/<domain>/
│   ├── components/       # domain UI
│   ├── pages/            # route composition, if routing is local
│   ├── hooks/            # domain orchestration
│   ├── services/         # API calls + DTO mapping
│   ├── schemas/          # Zod input/output schemas
│   ├── types/            # view models, never raw API types by default
│   └── index.ts          # intentional public module API
├── shared/
│   ├── api/              # HTTP client, error mapping
│   ├── components/       # reusable presentational primitives
│   └── utils/
```

## Rules

- Domain module owns its UI, hooks and API use cases; shared is only genuinely reusable code.
- Route/page composes; component renders; hook orchestrates; service fetches/maps. No direct `fetch` in components.
- Keep URL state in router/search params; server state in TanStack Query; ephemeral UI state local.
- API DTOs are boundary types. Map them to view models before UI when shapes differ.
- Export only intentional module APIs from `index.ts`; avoid cross-module deep imports.
