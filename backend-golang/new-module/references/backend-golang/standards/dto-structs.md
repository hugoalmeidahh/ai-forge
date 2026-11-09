# Request/Response Structs — Golang

Equivalent of NestJS DTO Input/Output in Go.

## Request Structs (Input)

- One struct per operation in `dto.go`: `CreateUserRequest`, `UpdateUserRequest`, `ListUsersQuery`.
- JSON tags in `snake_case`; validation via `validate` tags.
- Validate in the handler right after decode; failures → `InvalidPayloadError`.

```go
type CreateUserRequest struct {
    Name      string     `json:"name" validate:"required,min=1"`
    Email     string     `json:"email" validate:"required,email"`
    BirthDate *time.Time `json:"birth_date" validate:"omitempty"`
}
```

- Normalize at the boundary (trim, lowercase emails) before passing to the service.
- Convert request structs to domain types/input structs — services do not receive HTTP-shaped structs when they differ from the domain.

## Response Structs (Output)

- Separate response struct per representation: `UserResponse`.
- **Never encode DB/domain structs directly** — response structs are explicit allowlists.
- Sensitive fields (password hashes, tokens, internal flags) never present.
- JSON tags `snake_case`; time in RFC 3339 (`time.Time` marshals correctly by default).
- Constructor function per response: `toUserResponse(u *User) UserResponse`.

```go
type UserResponse struct {
    ID        int64     `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

func toUserResponse(u *User) UserResponse {
    return UserResponse{ID: u.ID, Name: u.Name, Email: u.Email, CreatedAt: u.CreatedAt}
}
```

## Checks

- No handler encodes a repository/domain struct directly.
- Pointer fields (`*T`) only for genuinely optional values.
- Validation lives in tags + handler; business validation lives in the service.
