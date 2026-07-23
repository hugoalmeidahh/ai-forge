# API and State — Vue

## API Boundary

- Shared HTTP client owns base URL, request-id forwarding and normalized errors.
- Domain services own endpoints and DTO-to-view-model mapping.
- Validate untrusted API responses with Zod where correctness/security requires it.
- Map `{ id, code, message }` to user-safe messages; retain `id` for support correlation.
- Never expose tokens, raw provider errors or PII in UI logs/toasts.

## State

- Vue Query owns server cache; mutations invalidate/update only related keys.
- Retry idempotent reads only by default; never blindly retry mutations.
- Pinia stores cross-route client-only state. It must not mirror API responses managed by Vue Query.

## Tests

- Unit-test services, mappers and composables.
- Component-test interactions/accessibility states.
- E2E-test critical user flows and failures.
