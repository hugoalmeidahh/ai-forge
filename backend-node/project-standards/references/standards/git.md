# Git Standards (L0)

## Branches

Format: `<type>/<short-description-kebab-case>`

| Type | Use |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Maintenance, deps, config |
| `refactor/` | Code change without behavior change |
| `docs/` | Documentation only |
| `hotfix/` | Urgent production fix |

Examples: `feat/user-address-crud`, `fix/invoice-rounding`, `chore/upgrade-prisma-v7`

## Commits

Format: `<type>: <imperative short description>`

- Types match branch types (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`).
- Imperative mood, lowercase, no trailing period: `feat: add user address endpoints`.
- One logical change per commit. Do not mix refactor with feature.
- Never include secret or credential values in commit messages.

## Pull Requests

- Title follows the same `<type>: <description>` convention, in Brazilian Portuguese for internal repos.
- Body follows the repository's PR template (`.github/` or `.gitlab/pull_request_template.md`).
- PRs should be small and reviewable; split large work into sequential PRs.
- Every PR is reviewed against the FORGE method (`core/code-review/`).
