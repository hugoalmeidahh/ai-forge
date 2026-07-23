---
name: project-standards
description: Apply company and project patterns when editing or adding code.
---

# Project Standards

## Intent

Apply company and project patterns when editing or adding code.

## When To Use

Use for any coding task in this repository, especially when:
- creating new modules, controllers, services, or DTOs
- touching database schemas or migrations
- adding endpoints or request/response payloads

## References

- `core/module-architecture.md`
- `standards/index.md`
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/company-standards.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/project-patterns.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/prisma-postgres-standards.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/error-handling.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/auth-security.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/general-development.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/controllers-services.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/dto-standards.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/folder-structure.md
- node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/helpers.md

## Workflow

1) Read `node_modules/@hugoalmeidahh/ai-forge/backend-nestjs/standards/index.md` first.
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
