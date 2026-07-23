# Components, Composables and Forms — Vue

## Components

- Use `<script setup lang="ts">`; type props/emits with `defineProps`/`defineEmits`.
- One responsibility; prefer slots/composition over boolean mode props.
- Render loading, empty, error and success states explicitly.
- Use semantic HTML, labels, keyboard navigation and accessible names before ARIA.
- No business rules, HTTP calls or cache mutation in presentational SFCs.

## Composables

- `use<Domain><Action>` owns Vue Query orchestration and UI-facing state.
- Clean up watchers, subscriptions and timers in component scope.
- Do not duplicate query data into refs/Pinia without an explicit editing/offline workflow.

## Forms

- VeeValidate + Zod validates at input boundary.
- Disable duplicate submissions; expose errors with labels and `aria-describedby`.
- Do not persist credentials or sensitive form data in browser storage.
