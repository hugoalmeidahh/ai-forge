# API and State — React

## API Boundary

- One shared HTTP client handles base URL, request-id forwarding and normalized failures.
- Domain services own endpoint paths and DTO-to-view-model mapping.
- Validate untrusted API responses with Zod where correctness/security requires it.
- Map `{ id, code, message }` to user-safe messages; retain `id` for support correlation.
- Never expose tokens, raw provider errors or PII in UI logs/toasts.

## TanStack Query

- Use `useQuery` for reads and `useMutation` for writes; no ad-hoc request state machines.
- Query keys describe domain + filters. Keep them in the module.
- Mutation success updates/invalidate only related queries.
- Retry only idempotent reads by default; do not blindly retry mutations.

## Tests

- Unit-test services, mappers and hooks.
- Component-test interactions/accessibility states.
- E2E-test critical user flows and error states.
