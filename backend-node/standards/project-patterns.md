# Project Patterns — Node.js / Fastify

Translation of `core/module-architecture.md` to Fastify backends.

## Stack

- Runtime: Node.js (LTS), ESM modules
- HTTP: Fastify — use plugin encapsulation and route schemas
- DB: Prisma, Knex or Drizzle — single client instance, injected
- Validation: Zod with `fastify-type-provider-zod`
- Logging: Fastify/Pino logger (`request.log`)
- Docs: `@fastify/swagger` generated from route schemas

## Module Layout

One flat module directory per business domain:

```
src/modules/<domain>/
├── <domain>.router.js        # routes — thin, no logic
├── <domain>.service.js       # business logic
├── <domain>.repository.js    # DB access — only place touching the DB client
├── <domain>.schema.js        # Zod input schemas
├── <domain>.serializer.js    # output shaping — hides sensitive fields
└── <domain>.errors.js        # domain errors (AppError subclasses)

src/providers/                # infra: db client, aws, amqp — no routers
src/middlewares/              # error handler, request-id, auth
src/helpers/                  # pure reusable utilities
```

## Dependency Injection

No IoC container required — use factory functions receiving dependencies:

```js
// user.service.js
export function createUserService({ userRepository, logger }) {
  return {
    async getById(id) { /* ... */ },
  };
}
```

Wire everything once at boot (composition root), not inside modules.

## Request/Response

- API JSON keys: `snake_case` (transform at the boundary; internal code `camelCase`).
- Every route validates input via schema before the service is called.
- Every JSON response passes through the domain serializer.
- Request-id middleware sets `x-request-id` (or generates UUID) — available to logs and errors.

## Golden Rules

- Router: parse/validate → call service → serialize → respond. Nothing else.
- Service never touches `req`/`res` — receives plain data, returns plain data.
- Only the owning module's repository touches its tables; other modules call the owner's service.
- Multi-table writes in one transaction.
