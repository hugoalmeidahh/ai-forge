---
name: ai-forge-backend-nestjs-project-standards
description: "Apply company and project patterns when editing or adding code."
---

> **Portable references:** resolve `references/` from this skill directory, including paths inside reference catalogs. Load only the files needed. Project rules (`AGENTS.md`, `CLAUDE.md`, and `captain.md` when present) override stack L2, which overrides shared L0.

# Project Standards

## Intent

Apply company and project patterns when editing or adding code.

## When To Use

Use for any coding task in this repository, especially when:
- creating new modules, controllers, services, or DTOs
- touching database schemas or migrations
- adding endpoints or request/response payloads

## References

- `references/core/module-architecture.md`
- `references/backend-nestjs/standards/index.md`
- references/backend-nestjs/standards/company-standards.md
- references/backend-nestjs/standards/project-patterns.md
- references/backend-nestjs/standards/prisma-postgres-standards.md
- references/backend-nestjs/standards/error-handling.md
- references/backend-nestjs/standards/auth-security.md
- references/backend-nestjs/standards/general-development.md
- references/backend-nestjs/standards/controllers-services.md
- references/backend-nestjs/standards/dto-standards.md
- references/backend-nestjs/standards/folder-structure.md
- references/backend-nestjs/standards/helpers.md

## Workflow

1) Read `references/backend-nestjs/standards/index.md` first.
2) Load only the reference files needed for the task.
3) Apply naming, structure, and formatting rules.
4) Ensure request payloads use `snake_case` and internal code uses `camelCase`.
5) Follow NestJS module layout with controllers, services, and DTOs.
6) Use Prisma and project helpers consistently.

## Key Rules

- Files and folders: `kebab-case`. DTOs: `*.input.ts` / `*.output.ts`. Classes: `PascalCase`.
- Controllers are thin — validate input, call service, map output. Business logic lives in services.
- Custom errors extend `BaseError`; all errors flow through `GlobalErrorFilter`.
- Prisma is accessed via injected `PrismaService`, never instantiated directly.
- `ActionLogService` records transactional domain changes.


## Checks

- Keep code self-explanatory and avoid unnecessary comments.
- Prefer descriptive names and consistent file naming.
- Ensure error handling matches GlobalErrorFilter conventions.

## Boundary and failure cases

Preserve existing public contracts and project dependency choices. Group by business capability; a table alone does not justify a new module. Validate untrusted input at the boundary and allowlist serialized output. Test ownership/tenant denial and rollback when relevant, not only the happy path.

Keep provider calls bounded by request cancellation/timeouts. Do not automatically retry a mutation after an ambiguous timeout; use the project's idempotency/reconciliation contract. Preserve error causes in server logs while returning safe correlated responses. Verify the complete use case and report unavailable integration checks rather than claiming them passed.
