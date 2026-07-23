# Observability Standards (L0)

## Structured Logging

- Always use the structured logger (Pino for Node/NestJS, `slog`/zerolog for Go, structlog for Python). Never bare `console.log` / `fmt.Println` in application code.
- Logs are JSON in non-local environments.
- Log errors with: file/line, error class/type, descriptive message, and full stack trace preserved.

## Request Correlation

- Every request carries a correlation id: `x-request-id` header when present, otherwise a generated UUID.
- The correlation id appears in all logs for that request and in the `id` field of error responses — it is the bridge between a client-reported error and server logs.

## What to Log

- Domain state changes (action logs) — recorded transactionally where supported.
- External provider calls and failures (with provider name and latency when relevant).
- Errors: full detail server-side, always.

## What NOT to Log

- Tokens, credentials, secrets — never.
- PII (names, emails, documents) unless strictly necessary.
- Full request payloads containing user data — log ids and metadata instead.

## Error Tracking

- Unhandled and 5xx errors are reported to the error tracker (Sentry) with the correlation id attached.
