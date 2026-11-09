---
name: ai-forge-backend-node-project-standards
description: "Apply company and project patterns when editing or adding code in Node.js/Fastify backends."
---

> **Portable references:** resolve `references/` from this skill directory, including paths inside reference catalogs. Load only the files needed. Project rules (`AGENTS.md`, `CLAUDE.md`, and `captain.md` when present) override stack L2, which overrides shared L0.

# Project Standards (Node.js)

## Intent

Apply company and stack patterns when editing or adding code.

## When To Use

Use for any coding task in a Node.js backend repository, especially when:
- creating new modules, routers, services, or repositories
- touching database schemas or queries
- adding endpoints or request/response payloads

## References

- references/core/module-architecture.md
- references/standards/index.md
- references/backend-node/standards/project-patterns.md
- references/backend-node/standards/router-service.md
- references/backend-node/standards/validation-serialization.md
- references/backend-node/standards/error-handling.md

## Workflow

1) Read `references/backend-node/standards/index.md` first.
2) Load only the reference files needed for the task.
3) Apply naming, structure, and formatting rules.
4) Ensure API payloads use `snake_case` and internal code uses `camelCase`.
5) Follow the module layout: router, service, repository, schema, serializer, errors.
6) Route all errors through `AppError` and the global error middleware.

## Key Rules

- Files: `kebab-case` with type suffix (`user.router.js`, `user.service.js`).
- Routers are thin — validate schema, call service, serialize output.
- Services never touch `req`/`res`; repositories are the only DB access point.
- Domain errors extend `AppError`; error responses are `{ id, code, message }`.
- Structured logging with Pino; request-id correlation everywhere.

## Checks

- Keep code self-explanatory and avoid unnecessary comments.
- No raw DB objects in responses — serializers are allowlists.
- Error handling matches the global middleware conventions.
