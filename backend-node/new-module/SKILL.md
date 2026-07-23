---
name: new-module
description: Scaffold a complete Node.js domain module (router, service, repository, schema, serializer, errors) following the modular architecture.
user-invocable: true
---

# New Module (Node.js)

## Intent

Create a full domain module at once — correct structure, naming, validation, serialization and error wiring. Materializes `core/module-architecture.md` in plain Node.js.

## When To Use

- User asks to "create a module", "add a new domain", "scaffold CRUD for <entity>"
- A new table/aggregate needs its owning module

## References

- `core/module-architecture.md` — the pattern being materialized
- `standards/project-patterns.md` — module layout and DI via factories
- `standards/router-service.md` — layer responsibilities
- `standards/validation-serialization.md` — schemas and serializers
- `standards/error-handling.md` — AppError and middleware

## Workflow

1. **Clarify the domain**: entity name, endpoints needed, auth type. Ask if ambiguous.
2. **Check ownership**: confirm no existing module owns the entity; satellites extend the main module.
3. **Scaffold the structure**:
   ```
   src/modules/<domain>/
   ├── <domain>.router.js
   ├── <domain>.service.js
   ├── <domain>.repository.js
   ├── <domain>.schema.js
   ├── <domain>.serializer.js
   └── <domain>.errors.js
   ```
4. **Router**: thin — auth middleware, schema validation, service call, serializer, correct status codes, errors to `next(err)`.
5. **Service**: factory function receiving `{ repository, logger, ...deps }`; business logic only; multi-table writes in one transaction.
6. **Repository**: only file importing the DB client for these tables; intent-revealing methods.
7. **Schema**: Zod schemas per operation; boundary transform `snake_case` → `camelCase`.
8. **Serializer**: allowlist of fields; `snake_case` output; ISO dates; no sensitive fields.
9. **Errors**: domain errors extend `AppError`; prefer standard errors when they fit.
10. **Wire**: register router in the app's route index; register service/repository in the composition root.
11. **Verify**: run lint/build; fix errors before finishing.

## Checks

- Router has no DB access, no business logic, no manual validation.
- Every route has auth and schema validation.
- All responses go through the serializer.
- Errors flow through `AppError` → global middleware `{ id, code, message }`.
- Naming follows kebab-case + type suffix.
