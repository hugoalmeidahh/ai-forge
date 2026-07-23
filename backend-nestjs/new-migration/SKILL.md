---
name: new-migration
description: Create and review a Prisma migration following the team's schema conventions — snake_case DB naming mapped to camelCase, PascalCase singular models, soft delete, and safe migration practices.
user-invocable: true
---

# New Migration (Prisma)

## Intent

Create schema changes and their migration correctly the first time: naming conventions, mappings, indexes, and a review of the generated SQL before it lands.

## When To Use

- User asks to "create a migration", "add a table/column", "change the schema"
- A new module needs its backing table(s)

## References

- `standards/prisma-postgres-standards.md` — naming and schema conventions
- `core/module-architecture.md` — one module per aggregate; ownership rules

## Workflow

1. **Clarify the change**: new table, new column, alteration, index? Nullable or with default? Backfill needed? Ask if ambiguous.
2. **Model in `schema.prisma`** following the conventions:
   - Model: `PascalCase` singular (`UserAddress`)
   - Table: `snake_case` plural via `@@map("user_addresses")`
   - Columns: `snake_case` in DB via `@map`, `camelCase` in code
   - Timestamps: `createdAt` / `updatedAt` (`@map("created_at")`, `@updatedAt`)
   - Soft delete where applicable: `deletedAt DateTime? @map("deleted_at")`
   - Foreign keys and `@@index` for frequent query paths
3. **Generate**: `npx prisma migrate dev --name <snake_case_description>` — descriptive name (`add_user_addresses`, `add_status_to_invoices`).
4. **Review the generated SQL** before committing:
   - Destructive changes (DROP, type narrowing) flagged and confirmed with the user
   - Column additions to large tables: nullable or with default to avoid long locks
   - Backfill as a separate step/migration, never mixed with DDL when risky
5. **Sync the code**: run `npx prisma generate`; update affected services/DTOs if the change renames or removes fields.
6. **Verify**: build passes; migration applies cleanly on a fresh database (`prisma migrate reset` locally when safe).

## Checks

- All DB identifiers `snake_case`; all code identifiers `camelCase`; mappings via `@map`/`@@map` present.
- Migration name describes the change.
- No destructive SQL merged without explicit user confirmation.
- `prisma generate` ran and the build passes.
