# Validation and Serialization — Node.js

Equivalent of NestJS DTO Input/Output in plain Node.

## Input Schemas (Zod)

- One schema per operation in `<domain>.schema.js`: `createUserSchema`, `updateUserSchema`, `listUsersQuerySchema`.
- Validate at the router boundary, before the service runs.
- Transform at the boundary: `snake_case` API keys → `camelCase` internal, coercion (`z.coerce.number()`), normalization (lowercase emails).
- Optional fields explicitly `.optional()`; unknown keys stripped (`.strict()` or `.strip()` per project).
- Validation failure → `InvalidPayloadError` (mapped by the error middleware from `ZodError`).

```js
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().toLowerCase(),
  birth_date: z.coerce.date().optional(),
}).transform(toCamelCase);
```

## Output Serializers

- Every JSON response passes through `<domain>.serializer.js`.
- Serializers are allowlists: explicitly pick fields — never spread the raw DB object.
- Sensitive fields (password hashes, tokens, internal flags) never appear.
- Output keys: `snake_case`.
- Dates serialized in ISO 8601.

```js
export function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt.toISOString(),
  };
}
```

## Checks

- No route returns a raw repository/DB object.
- No schema validation inside services (services assume valid input; re-validate only at trust boundaries).
