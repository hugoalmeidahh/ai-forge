# Handler, Service and Repository — Golang

## Request Flow

```
Request → Handler → Service → Repository/Provider → Service → Handler → Response Struct → Response
```

## Handler

**Responsibilities:**
- Decode request body/params into the request struct.
- Validate (`validator.Struct`) — invalid input → `InvalidPayloadError`.
- Call the service with `ctx` and domain types.
- Encode the response struct with the correct status code.

```go
func (h *handler) getByID(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
    if err != nil {
        writeError(w, r, NewInvalidPayloadError("invalid id"))
        return
    }
    user, err := h.svc.GetByID(r.Context(), id)
    if err != nil {
        writeError(w, r, err)
        return
    }
    writeJSON(w, http.StatusOK, toUserResponse(user))
}
```

**Not allowed:** SQL, business rules, calls to external providers, manual field-by-field validation.

## Service

**Responsibilities:**
- Business logic and complex validations.
- DB read/write via the repository interface.
- External integrations via provider interfaces.
- Calls other domains' services when needed (never their repositories).

```go
type Service interface {
    GetByID(ctx context.Context, id int64) (*User, error)
    Create(ctx context.Context, input CreateUserInput) (*User, error)
}
```

**Organization:** by context — one service per aggregate, methods per operation. Never one service type per endpoint.

**Not allowed:** `http.Request`/`ResponseWriter`, response structs, route definitions.

## Repository

- Interface declared in the domain package; implementation may live alongside or in a sub-file.
- The only code touching the domain's tables.
- Returns domain types and `error` — translate driver errors (`sql.ErrNoRows` → `EntityNotFoundError`).

```go
type Repository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    Insert(ctx context.Context, u *User) error
}
```

- Mocks generated from the interface for service tests.
