---
name: project-standards
description: Apply company and Vue frontend patterns when editing or adding UI code.
---

# Project Standards (Vue)

## Intent

Apply L0 rules plus Vue module, component, API and state conventions.

## When To Use

- Any Vue/TypeScript UI task.
- New views, domain modules, forms, API calls or client state.

## References

- `core/module-architecture.md`
- `standards/index.md`
- `frontend-vue/standards/index.md`

## Workflow

1. Read L0 and Vue indexes; load only relevant standards.
2. Identify domain ownership before adding UI/API behavior.
3. Keep view → component/composable → service/API boundaries.
4. Use Vue Query for server state, Pinia only for shared client-only state.
5. Run formatter, lint, type-check and tests.

## Checks

- No HTTP in SFCs.
- Loading, empty, error and success states covered.
- No sensitive data in logs/browser storage.
- Accessibility and keyboard behavior considered.
