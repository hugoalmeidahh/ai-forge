# Components, Hooks and Forms — React

## Components

- One responsibility; props typed explicitly; prefer composition over boolean mode props.
- Render states explicitly: loading, empty, error, success.
- Use semantic HTML, labels, keyboard navigation and accessible names before ARIA.
- No business rules, API calls or query-cache mutations in presentational components.

## Hooks

- `use<Domain><Action>` owns orchestration around query/mutation hooks.
- Keep query keys centralized and stable; invalidate/refetch only affected keys after mutations.
- Side effects require cleanup (`AbortController`, subscriptions, timers).
- Do not mirror props/query data into state without a specific editing workflow.

## Forms

- React Hook Form + Zod resolver; schemas validate at UI boundary.
- Disable duplicate submission; surface field errors accessibly.
- Map API validation errors to fields only when the API supplies a stable field mapping.
- Never persist credentials or sensitive form data in browser storage.
