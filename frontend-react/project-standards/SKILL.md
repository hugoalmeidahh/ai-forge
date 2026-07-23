---
name: project-standards
description: Apply company and React frontend patterns when editing or adding UI code.
---

# Project Standards (React)

## Intent

Apply L0 rules plus React module, component, API and state conventions.

## When To Use

- Any React/TypeScript UI task.
- New pages, domain modules, forms, API calls or client state.

## References

- `core/module-architecture.md`
- `standards/index.md`
- `frontend-react/standards/index.md`

## Workflow

1. Read L0 and React indexes; load only relevant standards.
2. Identify domain owner before adding UI/API behavior.
3. Keep page → component/hook → service/API boundaries.
4. Validate input/output boundaries; use query cache for server state.
5. Run formatter, lint, type-check and tests.

## Checks

- No direct fetch in components.
- Loading, empty, error and success states covered.
- No sensitive data in logs/browser storage.
- Accessibility and keyboard behavior considered.
