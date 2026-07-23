---
name: project-standards
description: Apply company and project patterns when editing or adding code in Golang backends.
---

# Project Standards (Golang / Chi)

## Intent

Apply company and stack patterns when editing or adding Go code.

## When To Use

Use for any coding task in a Go backend repository, especially when:
- creating new domain packages, handlers, services, or repositories
- touching database schemas or queries
- adding endpoints or request/response payloads

## References

- node_modules/@hugoalmeidahh/ai-forge/core/module-architecture.md
- node_modules/@hugoalmeidahh/ai-forge/standards/index.md
- node_modules/@hugoalmeidahh/ai-forge/backend-golang/standards/project-patterns.md
- node_modules/@hugoalmeidahh/ai-forge/backend-golang/standards/handler-service-repository.md
- node_modules/@hugoalmeidahh/ai-forge/backend-golang/standards/dto-structs.md
- node_modules/@hugoalmeidahh/ai-forge/backend-golang/standards/error-handling.md

## Workflow

1) Read `node_modules/@hugoalmeidahh/ai-forge/backend-golang/standards/index.md` first.
2) Load only the reference files needed for the task.
3) Apply naming, structure, and formatting rules (gofmt/goimports always).
4) Ensure API JSON uses `snake_case` tags and code follows Go naming idioms.
5) Follow the domain-package layout: handler, service, repository, dto, errors, module.
6) Route all errors through `*AppError` and `writeError`.

## Key Rules

- Package per domain in `internal/` — never layer-first packages.
- Handlers are thin: decode → validate → service → encode.
- Services take `context.Context` first; never touch HTTP types.
- Repositories are interfaces; driver errors translated at the boundary.
- Typed domain errors; 5xx generic to client, full detail in `slog`.

## Checks

- `go build ./...` and `go vet ./...` pass.
- No handler encodes DB/domain structs directly — response structs only.
- Error handling matches the `writeError` conventions.
