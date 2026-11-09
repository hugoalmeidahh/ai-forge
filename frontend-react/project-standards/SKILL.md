---
name: ai-forge-frontend-react-project-standards
description: "Apply company and React frontend patterns when editing or adding UI code."
---

> **Portable references:** resolve `references/` from this skill directory, including paths inside reference catalogs. Load only the files needed. Project rules (`AGENTS.md`, `CLAUDE.md`, and `captain.md` when present) override stack L2, which overrides shared L0.

# Project Standards (React)

## Intent

Apply L0 rules plus React module, component, API and state conventions.

## When To Use

- Any React/TypeScript UI task.
- New pages, domain modules, forms, API calls or client state.

## References

- `references/core/module-architecture.md`
- `references/frontend-react/standards/index.md`
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

## Product quality and verification

Read [product UX](references/ui/product-ux.md) for journeys/states, [accessibility](references/ui/accessibility.md) for keyboard/focus/forms and [performance](references/ui/performance.md) when resource loading or interaction cost changes. Use [state and domain boundaries](references/ui/architecture.md) for ownership or cache changes. Load only what the task needs.

Reuse existing tokens and components. Preserve valid input after recoverable failures, scope query keys and caches by identity/tenant, and verify deep links and permission states. Prefer derived state to synchronized copies; clean up effects and cancel/discard stale responses. Do not add memoization or virtualization without a demonstrated cost.

A presentational fix does not require a new state library or a new test suite. For new behavior, verify the changed user outcome and relevant failure path using existing checks/browser capabilities. Report what was not run. Meta-framework projects follow their native server/client data lifecycle instead of duplicating it in a client cache.
