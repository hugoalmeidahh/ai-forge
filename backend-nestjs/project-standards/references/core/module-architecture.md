# Module Architecture — The Core Pattern

> Stack-agnostic reference for organizing software by **business-domain modules**.
> Every stack (`backend-nestjs`, `backend-node`, `backend-golang`, ...) translates this same model using its native idioms. Load this file before any architectural decision or module creation.

## Domain Module

A module groups everything belonging to one business context (e.g. `user`, `purchase`, `notification`).

**Formation rules:**

- One module per independent table (e.g. `action-log`).
- Satellite tables of a main entity (`users`, `user_emails`, `user_addresses`) → one single main module (`user`).
- **Golden rule:** only the owning module manipulates its entity directly. Other modules call the owner's service — never another module's repository.

## Canonical Flow

```
Request → Controller → Service → Repository/Provider → Service → Controller → DTO Output → Response
```

## Layer Responsibilities (stack-agnostic)

| Layer | Does | Never does |
|---|---|---|
| Controller / Handler / Router | Route, auth, input/output contract, docs | Business logic, DB access, manual validation |
| Service | Business logic, DB read/write, external integration | Define route/auth, use output DTO |
| Input (DTO / Schema / Struct) | Validate and transform input | Business rules |
| Output (DTO / Serializer / Struct) | Response contract, hide sensitive fields | Business rules |
| Error | Typed domain error: status + code + message | Business rules |
| Repository / Provider | DB and external infrastructure access | Business rules |

**Service organization:** by context, not by endpoint. `UserService`, `UserAddressService` — never `CreateUserService` / `UpdateUserService`.

## Modules vs Providers

- `modules/` — business domains: contain controllers, services, dtos, errors.
- `providers/` — infrastructure (DB client, AWS, messaging): **no controllers, no dtos, no listeners**. Mirror module structure otherwise.

## Universal Error Contract

Every stack implements the same error response:

```json
{ "id": "<x-request-id or uuid>", "code": "entity_not_found", "message": "..." }
```

- `code` derived from the error class/type name in `snake_case`.
- Domain errors are typed (extend `BaseError` / instance of `AppError` / `*AppError` struct) — never raw `Error` / `errors.New`.
- **5xx never leaks details:** full log server-side; client receives `{ "code": "internal_error", "message": "internal error" }`.

**Standard errors (all stacks):**

| Error | HTTP | Use |
|---|---|---|
| `DuplicatedEntityError` | 409 | Conflict on unique data |
| `EntityNotFoundError` | 404 | Primary entity not found |
| `InternalProviderError` | 502 | External provider failure (DB, AWS, messaging) |
| `InvalidPayloadError` | 400 | Invalid body or query params |

## Cross-cutting Rules

- Multi-table writes happen inside **one transaction**.
- Dependency injection over direct instantiation (native IoC, factory functions, or constructor injection — per stack).
- Guard clauses and early returns over nested `if/else`.
- API JSON input/output: `snake_case`. Internal code: language-idiomatic casing.
- Request correlation: `x-request-id` header when present, otherwise generated UUID — used in logs and error payloads.

## Stack Translations

| Concept | NestJS | Node (Fastify) | Golang |
|---|---|---|---|
| Controller | `@Controller` class | thin `router.get/post` | `handler.go` |
| Service | `@Injectable` class | factory-injected service | interface + struct impl |
| Input validation | DTO + class-validator | Zod/Joi schema | struct + validator tags |
| Output | DTO + `@Exclude` + `getInstance` | serializer before `res.json()` | separate response struct |
| Error base | `BaseError` | `AppError` class | `AppError` struct |
| Global filter | `GlobalErrorFilter` | error middleware | middleware / `writeError()` |
| DI | Nest IoC | awilix/factories | constructor wiring in `module.go` |

Full per-stack rules live in `<stack>/standards/` — load the stack's `index.md` to pick relevant files.
