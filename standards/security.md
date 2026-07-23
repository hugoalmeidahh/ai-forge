# Security Standards (L0)

## Secrets and Configuration

- No hardcoded credentials, tokens, or API keys — ever. Secrets come from environment/secret manager, accessed via the stack's config service.
- Env var names are prefixed by domain: `DATABASE_`, `AUTH_`, `AWS_`, `AMQP_`, `SENTRY_`.
- Environment variables are validated at boot (Joi / Zod / envconfig) — the app must fail fast on missing config.
- Staging/production secrets come from a secret manager (e.g. AWS Secrets Manager), never committed files.
- See `core/guardrails.md` for absolute AI rules about env/credential files.

## Authentication

- Every endpoint has an auth guard/middleware. Internal endpoints: Basic Auth. BFF/user-facing: JWT.
- JWT payload carries identification/permissions only — no open personal data.
- Never expose tokens in logs, URLs, or client-accessible variables.

## Input and Injection

- All input validated at the boundary (input DTO / schema / struct validation) before use.
- Never build SQL by string concatenation — use the ORM/query builder API or parameterized queries.
- Frontend: never render user input via `dangerouslySetInnerHTML` / `innerHTML` (XSS).
- Invalid payloads produce `InvalidPayloadError` (400) — not generic errors.

## Data Exposure

- Responses go through output contracts (DTO/serializer/response struct) that hide sensitive fields (password hashes, internal flags, tokens).
- 5xx responses never leak internal details — generic `internal_error` to the client, full detail in server logs only.
- No PII in logs (names, emails, documents) unless strictly necessary and approved.
