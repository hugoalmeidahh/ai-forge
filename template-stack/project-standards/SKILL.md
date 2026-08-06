---
name: project-standards
description: Apply company and [stack-name] patterns when editing or adding code.
---

# Project Standards ([stack-name])

## Intent

Apply L0 rules and this stack's L2 conventions. Replace all `[stack-name]` placeholders before publishing.

## When To Use

- Any coding task for this stack
- Creating modules, endpoints, integrations, schemas or migrations

## References

- `core/module-architecture.md`
- `standards/index.md`
- `[stack-name]/standards/index.md`

## Workflow

1. Read L0 `standards/index.md`; load only task-relevant files.
2. Read `[stack-name]/standards/index.md`; load only task-relevant files.
3. Apply L3 project overrides first when conflicts exist.
4. Run this stack's formatter, lint, tests and build before finishing.

## Checks

- Stack standard index exists and links only valid files.
- L0/L2/L3 precedence is explicit.
- No placeholder remains after stack creation.
