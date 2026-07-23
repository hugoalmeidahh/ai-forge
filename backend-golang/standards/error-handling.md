# Error Handling — Golang

Implements the universal error contract from `core/module-architecture.md`.

## AppError

```go
type AppError struct {
    StatusCode int    `json:"-"`
    Code       string `json:"code"`    // snake_case
    Message    string `json:"message"`
}

func (e *AppError) Error() string { return e.Message }
```

Standard constructors (always prefer these when they fit):

| Constructor | Status | Code |
|---|---|---|
| `NewDuplicatedEntityError(msg)` | 409 | `duplicated_entity` |
| `NewEntityNotFoundError(msg)` | 404 | `entity_not_found` |
| `NewInternalProviderError(msg)` | 502 | `internal_provider_error` |
| `NewInvalidPayloadError(msg)` | 400 | `invalid_payload` |

## writeError — the single response shaper

```go
func writeError(w http.ResponseWriter, r *http.Request, err error) {
    id := requestID(r) // x-request-id or generated UUID

    var appErr *AppError
    if errors.As(err, &appErr) {
        writeJSON(w, appErr.StatusCode, errorBody{ID: id, Code: appErr.Code, Message: appErr.Message})
        return
    }

    slog.ErrorContext(r.Context(), "unhandled error", "err", err, "request_id", id)
    writeJSON(w, http.StatusInternalServerError,
        errorBody{ID: id, Code: "internal_error", Message: "internal error"})
}
```

## Principles

- Return errors; never panic in request paths.
- Wrap with context when crossing layers: `fmt.Errorf("fetching user %d: %w", id, err)` — keep the chain for `errors.As`/`errors.Is`.
- Translate infrastructure errors at the repository boundary: `sql.ErrNoRows` → `NewEntityNotFoundError`; driver/provider failures → `NewInternalProviderError`.
- Never `errors.New("user not found")` loose in services — use typed domain errors.
- 5xx: full detail in `slog` with `request_id`; generic body to the client.
- No swallowed errors — every `err` is handled, returned, or explicitly logged with justification.
