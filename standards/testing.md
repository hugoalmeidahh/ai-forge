# Testing Standards (L0)

## Organization

- Tests live under `test/` (or the stack's idiomatic location: `*_test.go` alongside code in Go).
- Separate by kind: unit, integration, e2e — do not mix in the same suite.
- Shared helpers/factories live in `test/helpers`.

## Naming

- Test files mirror the file under test: `user.service.spec.ts`, `user_service_test.go`.
- Test names describe behavior, not implementation: `should return 404 when user does not exist` — not `test getById error`.

## What to Test

- Services: business rules, edge cases, error paths (typed domain errors thrown correctly).
- Controllers/handlers: contract-level (status codes, response shape) via e2e/integration.
- Repositories: only when they contain non-trivial query logic.
- Do not test framework behavior or trivial getters.

## Practices

- Tests are independent and repeatable — no order dependency, no shared mutable state.
- Mock at the boundary: repository/provider interfaces, not internal private methods.
- Every bug fix adds a regression test.
- CI runs the full suite; a red build blocks merge.
