# Project Patterns — Golang

Translation of `core/module-architecture.md` to idiomatic Go.

## Stack

- Go (latest stable), modules via `go.mod`
- HTTP: `net/http` + `github.com/go-chi/chi/v5`
- DB: `database/sql` + sqlc (preferred) or GORM
- Validation: `go-playground/validator`
- Logging: `slog` (structured, JSON in non-local envs)
- Config: env vars via `envconfig`/`caarlos0-env`, validated at boot

## Package Layout

**Package per business domain** under `internal/` — never layer-first packages:

```
cmd/api/main.go               # entrypoint, composition root
internal/
├── user/                     # one package per domain
│   ├── handler.go            # HTTP handlers — thin
│   ├── service.go            # interface + implementation
│   ├── repository.go         # interface + implementation
│   ├── dto.go                # request/response structs
│   ├── errors.go             # domain errors
│   └── module.go             # wiring: builds handler from deps
├── platform/                 # infra: db, aws, amqp (providers)
│   ├── database/
│   └── httpserver/           # router, middlewares (error, request-id, auth)
└── pkg/                      # shared helpers (only if truly generic)
```

**Anti-pattern:** `internal/controllers/`, `internal/services/`, `internal/models/` — layer-first packaging destroys domain cohesion in Go.

## Dependency Injection

Constructor injection, wired at the composition root:

```go
// module.go
func NewModule(db *sql.DB, log *slog.Logger) http.Handler {
    repo := newRepository(db)
    svc := NewService(repo, log)
    return newHandler(svc)
}
```

- Dependencies are **interfaces** declared by the consumer.
- Interfaces are small (1–3 methods) — interface segregation.

## Request/Response

- API JSON keys: `snake_case` via struct tags.
- `context.Context` is the first parameter of every service/repository method.
- Request-id middleware: `x-request-id` or generated UUID → into context, logs and error payloads.

## Golden Rules

- Handler: decode → validate → call service → encode. Nothing else.
- Service receives/returns domain types — never `*http.Request`.
- Only the owning package's repository touches its tables.
- Multi-table writes in one transaction (`*sql.Tx` passed explicitly or via txn helper).
- Errors returned, never panic (except unrecoverable boot failures).
