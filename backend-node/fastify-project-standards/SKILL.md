---
name: ai-forge-backend-node-fastify-project-standards
description: "Apply a consistent modular architecture to TypeScript/Fastify backends, translating useful NestJS conventions without introducing NestJS runtime dependencies."
---

# Fastify Project Standards, Using NestJS Concepts

Use this skill when creating or changing a TypeScript/Fastify backend that wants the clear module boundaries, dependency ownership, validation, error handling, and observability commonly associated with NestJS.

This skill defines an architectural translation. It does not make Fastify behave like NestJS and does not authorize adding Nest packages. Use the project's explicit stack, security model, and existing code where they are more specific. Read the project architecture and agent instructions before changing backend structure.

## Translation map

| NestJS concept | Fastify implementation |
| --- | --- |
| Feature `Module` | Domain folder plus an encapsulated Fastify plugin when encapsulation is useful; register it from the application composition root. Avoid empty module classes. |
| `Controller` | Thin route-registration function/plugin. Declare path, HTTP method, auth hook, schema, status code, call service, serialize result. |
| `Service` | Domain service with plain TypeScript inputs/results. Own business rules and use cases; never receive Fastify request/reply objects. |
| Injected provider | Explicit factory dependency, passed once by the composition root. Do not add a container solely to imitate Nest DI. |
| DTO + `ValidationPipe` | Zod request schemas at the HTTP boundary. Convert external snake_case to internal camelCase explicitly where useful. |
| Output DTO / `ClassSerializerInterceptor` | Explicit serializer or response schema allowlist. Never return a database row/entity directly. |
| Guard / auth decorator | Fastify `preHandler` or scoped hook that verifies identity and authorization before the handler. A TypeScript decorator is not needed. |
| Interceptor / pipe | Focused hook or boundary helper for a genuine cross-cutting concern. Prefer schema parsing and explicit code over global magic transformations. |
| Exception filter | One Fastify `setErrorHandler` mapping domain `AppError`, validation failures, provider errors, and unknown failures to stable HTTP responses. |
| `PrismaService`/provider module | A narrowly owned infrastructure provider, such as a `pg.Pool`, passed to repositories. Keep credentials and connection policy in startup configuration. |
| `ActionLogService` | Write audit/activity records in the same transaction as the domain change when they are part of that change. |
| Worker / queue consumer | Separate process entrypoint using application/domain services or explicit worker handlers; do not add HTTP routes to the worker. |

## Domain module shape

Keep files together by business capability, not by technical layer across the whole codebase:

```text
src/modules/<domain>/
  <domain>.router.ts       # Fastify routes and HTTP boundary
  <domain>.service.ts      # use cases and domain rules
  <domain>.repository.ts   # SQL and persistence mapping
  <domain>.schema.ts       # Zod input/query/params schemas
  <domain>.serializer.ts   # explicit public response mapping, when needed
  <domain>.errors.ts       # domain errors, when needed
src/providers/             # shared infrastructure clients only
src/main.ts                # configuration, dependency wiring, server lifecycle
```

Do not create a file just to satisfy this list when the module does not need that responsibility. A small feature may keep route schemas in its router. Split it once the boundary is real. Create one service per domain/context, not one service per CRUD endpoint.

## Responsibilities and request flow

```text
HTTP → route plugin → schema/auth boundary → domain service → repository/provider
     → domain result → serializer/response schema → HTTP
```

- **Route plugin:** HTTP concerns only. Validate `params`, `query`, and `body`; call authorization hooks; invoke a service with plain values; choose status and response serializer. No SQL, provider calls, or business decisions.
- **Service:** business rules and orchestration. Accept typed data and explicit dependencies; do not import Fastify types. Coordinate repositories/providers and transactions through an explicit transaction boundary.
- **Repository:** the only module layer that issues SQL or maps database rows. Use intent-named methods, fixed column lists, parameterized queries, and explicit mapping. Do not expose a generic `query(sql)` API to services.
- **Composition root:** construct pools/providers, repositories, services, and route plugins once at startup. Dependencies point inward; one domain must not reach into another domain's repository.
- **Provider:** encapsulate an external API or infrastructure client. Do not construct clients inside route handlers or business methods.

## PostgreSQL, tenant context, and transactions

When the project uses PostgreSQL tenant isolation or Supabase, apply the relevant rules:

- For PostgreSQL RLS, use the non-superuser, non-owner application role that does not bypass RLS. Never use the Supabase `service_role`/secret key as the API's database identity.
- Derive user identity from a verified JWT and tenant membership from persisted membership data. Never authorize from client-supplied `tenant_id`, role, owner, or editable user metadata.
- Set actor context with transaction-local configuration (`SET LOCAL` or `set_config(..., true)`) inside each checked-out connection/transaction. Never store tenant/user context globally on a pooled connection.
- Keep SQL in the owning repository. A service may request a unit of work/transaction, but should not embed SQL strings itself.
- Commit lead/opportunity, activity, and outbox changes atomically where the use case requires them. Make worker effects idempotent and safe to redeliver.
- Keep platform-operator access in its own explicit allowlist and API surface. Do not turn ordinary tenant repositories into unrestricted cross-tenant access.
- Test negative authorization: missing identity, inactive membership, different tenant, different consultant owner, and forged tenant/role values.

If an ORM is selected, it must preserve explicit transaction scoping, tenant context, composite tenant constraints, and least-privilege database roles. Do not adopt Prisma just because a NestJS reference uses it; the chosen repository and SQL/RLS model must remain authoritative.

## Validation, serialization, and errors

- Use strict Zod schemas for all externally writable fields. Reject unknown fields where accepting them could permit privilege/state injection.
- Keep transport names consistent. By default, JSON uses `snake_case`; application variables use `camelCase`. Map explicitly at the boundary rather than recursively transforming arbitrary payloads.
- Return allowlisted response objects. Do not expose raw query results, secrets, private provider data, or internal error details.
- Use a shared `AppError` shape and one global Fastify error handler. Return stable `{ id, code, message }` responses; validation gets a client error, known conflicts map consistently, and unexpected errors return a generic 5xx while structured logs retain request correlation without tokens or PII.
- Set request IDs once and include them in response headers and structured logs. Redact authorization, cookies, credentials, and sensitive payloads.

## Authentication and authorization

- Verify bearer JWT signature, issuer, audience, and expiry with the configured identity provider JWKS (Supabase when selected). Do not trust a decoded-but-unverified payload.
- Authenticate and authorize in preHandlers or scoped Fastify hooks before calling the service. Keep policy checks in reusable authorization/domain functions when multiple routes share them.
- Resolve `actor` and membership from verified identity plus the database. Never accept actor IDs or roles as authority from a request body.
- When the project uses a browser BFF, put access/refresh tokens behind same-origin BFF cookies with HttpOnly, Secure in production, and an appropriate SameSite policy. Do not put them in localStorage.

## API documentation and tests

- Publish OpenAPI from Fastify route schemas with `@fastify/swagger` when API consumers or integration work need a contract. Do not duplicate schemas in handwritten docs.
- Unit-test pure domain rules and schemas. Use `app.inject()` for route status, validation, auth, and serialization behavior. Use PostgreSQL integration tests for RLS, transaction rollback, foreign-key tenant boundaries, outbox atomicity, and redelivery; clearly mark them unavailable if a local database was not run.
- Test repository/service contracts at their boundary rather than mocking every internal method. Keep fixtures synthetic and avoid hosted/production Supabase in tests.

## Review checklist

Before calling a backend change complete, check:

- Is each route thin and each use case in its domain service?
- Is every SQL statement owned by a repository?
- Are dependencies explicit and wired once at startup?
- Are tenant/user roles derived from trusted data and scoped per transaction?
- Are input and output fields allowlisted and validated?
- Are mutation, audit/activity, and outbox records atomic where required?
- Are errors, request IDs, and logs consistent and free of secrets/PII?
- Do typecheck, build, and relevant unit/integration tests pass?
- Did the change avoid adding Nest runtime packages or unrelated abstractions?
