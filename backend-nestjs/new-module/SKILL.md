---
name: new-module
description: Scaffold a complete NestJS domain module (controller, service, DTOs, errors, module) following the team's modular architecture, naming and error-handling standards.
user-invocable: true
---

# New Module (NestJS)

## Intent

Create a full domain module at once — correct structure, naming, DTOs, error classes and wiring — so no piece is improvised. Materializes `core/module-architecture.md` in NestJS.

## When To Use

- User asks to "create a module", "add a new domain", "scaffold CRUD for <entity>"
- A new table/aggregate needs its owning module

## References

- `core/module-architecture.md` — the pattern being materialized
- `standards/folder-structure.md` — module layout and file naming
- `standards/controllers-services.md` — layer responsibilities
- `standards/dto-standards.md` — Input/Output rules
- `standards/error-handling.md` — BaseError and standard errors
- `standards/auth-security.md` — guard selection (Basic vs JWT)

## Workflow

1. **Clarify the domain**: entity name, satellite tables, endpoints needed (CRUD? custom?), auth type (internal Basic / BFF JWT). Ask if ambiguous.
2. **Check ownership**: confirm no existing module already owns the entity. If satellite of an existing aggregate, extend that module instead — do not create a parallel one.
3. **Scaffold the structure** (kebab-case files, type suffixes):
   ```
   src/modules/<domain>/
   ├── controllers/<domain>.controller.ts
   ├── services/<domain>.service.ts
   ├── dtos/create-<domain>.input.ts
   ├── dtos/update-<domain>.input.ts
   ├── dtos/<domain>.output.ts
   ├── errors/<domain>-not-found.error.ts   (when applicable)
   ├── interfaces/                           (only if needed)
   └── <domain>.module.ts
   ```
4. **Controller**: thin — routes, HTTP codes, guard (`@UseGuards(AuthGuard('basic'))` + `@ApiBasicAuth()` for internal), Swagger decorators, delegates to service, returns via `Output.getInstance(...)`.
5. **Service**: business logic, Prisma via injected `PrismaService` (repository delegate pattern), organized by context (`<Domain>Service`, not `Create<Domain>Service`). Multi-table writes in one transaction.
6. **DTOs**: Input with class-validator + `@ApiProperty` on every field, `@IsOptional()` where applicable; Output with `@ApiProperty`, `@Exclude()` on sensitive fields and `static getInstance` using `plainToInstance`.
7. **Errors**: domain errors extend `BaseError` with `httpCode` + `message`; prefer standard errors (`EntityNotFoundError`, `DuplicatedEntityError`, ...) when they fit.
8. **Wire the module**: declare controller + service in `<domain>.module.ts`, import into `app.module.ts`.
9. **Verify**: run the project's build; fix compilation errors before finishing.

## Checks

- Controller has no DB access, no business logic, no manual validation.
- Every endpoint has a guard and Swagger documentation.
- All JSON responses go through an Output DTO.
- Errors extend `BaseError`; no raw `Error` or Nest `HttpException` for domain cases.
- File and class naming follow `standards/folder-structure.md`.
- Build passes.
