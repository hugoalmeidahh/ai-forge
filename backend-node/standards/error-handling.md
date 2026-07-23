# Error Handling — Node.js

Implements the universal error contract from `core/module-architecture.md`.

## AppError

All domain errors extend `AppError`:

```js
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code; // snake_case, derived from the class name
  }
}

export class EntityNotFoundError extends AppError {
  constructor(message = 'entity not found') {
    super(message, 404, 'entity_not_found');
  }
}
```

Standard errors (always prefer these when they fit):

| Error | Status | Code |
|---|---|---|
| `DuplicatedEntityError` | 409 | `duplicated_entity` |
| `EntityNotFoundError` | 404 | `entity_not_found` |
| `InternalProviderError` | 502 | `internal_provider_error` |
| `InvalidPayloadError` | 400 | `invalid_payload` |

## Fastify Global Error Handler

Register once during app bootstrap — the only error-response shaper:

```js
fastify.setErrorHandler((err, request, reply) => {
  const id = request.id;

  if (err instanceof ZodError) {
    return reply.code(400).send({ id, code: 'invalid_payload', message: formatZod(err) });
  }
  if (err instanceof AppError) {
    return reply.code(err.statusCode).send({ id, code: err.code, message: err.message });
  }

  request.log.error({ err, request_id: id });
  return reply.code(500).send({ id, code: 'internal_error', message: 'internal error' });
});
```

## Principles

- Avoid try/catch in services when the error should propagate — let the middleware handle it. Use try/catch only when execution must continue.
- Never swallow errors (empty catch) — log or rethrow.
- External provider failures (DB, AWS, messaging) → wrap in `InternalProviderError`; original error goes to the log.
- 5xx never leaks internal detail to the client.
- Async route handlers throw/return errors; Fastify forwards them to `setErrorHandler`.
