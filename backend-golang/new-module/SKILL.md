---
name: new-module
description: Scaffold a complete Golang domain package (handler, service, repository, dto, errors, module wiring) following the modular architecture.
user-invocable: true
---

# New Module (Golang)

## Intent

Create a full domain package at once — correct structure, interfaces, validation, response structs and error wiring. Materializes `core/module-architecture.md` in idiomatic Go.

## When To Use

- User asks to "create a module/package", "add a new domain", "scaffold CRUD for <entity>"
- A new table/aggregate needs its owning package

## References

- `core/module-architecture.md` — the pattern being materialized
- `standards/project-patterns.md` — package layout and composition root
- `standards/handler-service-repository.md` — layer responsibilities and interfaces
- `standards/dto-structs.md` — request/response structs
- `standards/error-handling.md` — AppError and writeError

## Workflow

1. **Clarify the domain**: entity name, endpoints needed, auth type. Ask if ambiguous.
2. **Check ownership**: confirm no existing package owns the entity; satellites extend the main package.
3. **Scaffold the structure**:
   ```
   internal/<domain>/
   ├── handler.go
   ├── service.go
   ├── repository.go
   ├── dto.go
   ├── errors.go
   └── module.go
   ```
4. **Handler**: thin — decode, `validator.Struct`, call service with `r.Context()`, encode response struct; all errors via `writeError`.
5. **Service**: interface + unexported impl; `context.Context` first param; business logic; multi-table writes in one `*sql.Tx`.
6. **Repository**: interface + impl; the only code touching the domain's tables; translate `sql.ErrNoRows` → `EntityNotFoundError`.
7. **DTO**: request structs with `json` + `validate` tags; response structs as allowlists with `to<X>Response` constructors.
8. **Errors**: typed via `*AppError` constructors; add domain-specific ones only when the standard four don't fit.
9. **Wire**: `module.go` builds handler from deps; register routes in the Chi composition root (`cmd/api/main.go` or router setup).
10. **Verify**: `go build ./...`, `go vet ./...`, `gofmt` clean; fix before finishing.

## Checks

- Handler has no SQL, no business logic.
- Service has no HTTP types; repository is an interface.
- No DB/domain struct encoded directly in responses.
- Errors flow through `*AppError` → `writeError` → `{ id, code, message }`.
- Package named after the domain, lowercase, no underscores.
