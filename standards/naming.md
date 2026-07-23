# Naming Conventions (L0)

Company-wide naming rules. Language-specific idioms (e.g. Go exported/unexported) override these where noted in the stack's L2 standards.

## Code

| Element | Convention | Example |
|---|---|---|
| Variables and functions | `camelCase` | `userAddress`, `getBalance()` |
| Classes, types, components | `PascalCase` | `UserService`, `PaymentOutput` |
| Global constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Enums | `camelCase` members, `PascalCase` type | `UserStatus.active` |

## Files and Folders

- `kebab-case` for all files and folders (except Go, which uses `snake_case`/single-word per Go convention).
- File names include the type suffix: `name.type.ext`.
  - `user-address.service.ts`, `create-user.input.ts`, `user.output.ts`, `auth.module.ts`, `handler.go`, `user.repository.js`

## API and Data

| Element | Convention |
|---|---|
| JSON request/response keys | `snake_case` |
| Query params | `snake_case` |
| Routes/endpoints | `kebab-case` |
| Database tables | `snake_case` plural (`user_addresses`) |
| Database columns | `snake_case`, mapped to `camelCase` in code |
| Database models in code | `PascalCase` singular (`UserAddress`) |

## General

- Names reveal intent — no obscure abbreviations.
- No magic numbers/strings — extract named constants.
- If a function name needs "and", it does two things — split it.
- Duplicated literal 3+ times → constant.
