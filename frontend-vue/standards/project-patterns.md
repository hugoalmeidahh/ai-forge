# Project Patterns — Vue

## Stack

- Vue 3 + TypeScript + Composition API; use `<script setup lang="ts">`.
- Server state: `@tanstack/vue-query`.
- Input/API validation: Zod.
- Forms: VeeValidate + Zod.
- Pinia only for shared client state, not server-cache duplication.

## Module Layout

```text
src/
├── modules/<domain>/
│   ├── components/
│   ├── views/            # route composition
│   ├── composables/      # domain orchestration
│   ├── services/         # API calls + DTO mapping
│   ├── schemas/
│   ├── types/
│   └── index.ts
├── shared/
│   ├── api/
│   ├── components/
│   └── utils/
```

## Rules

- Domain module owns views, components, composables and API use cases.
- View composes; component renders; composable orchestrates; service fetches/maps. No HTTP in SFCs.
- Server state → Vue Query; URL state → Vue Router; shared client-only state → Pinia; ephemeral UI state → component refs.
- API DTOs are boundary types; map to view models when UI shape differs.
- Export intentional APIs only; no cross-module deep imports.
