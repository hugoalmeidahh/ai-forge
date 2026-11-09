---
name: ai-forge-frontend-angular-project-standards
description: "Implement and review Angular code using domain boundaries, native rendering/data conventions, accessibility and measured performance."
---

# Project standards — Angular

Apply the project's L3 instructions before this stack translation. Inspect installed versions and router/rendering conventions; preserve domain ownership, explicit contracts and the existing dependency choices. Do not impose a migration to a newer major.

## Load on demand

- [Stack conventions](references/stack.md): rendering, routing, lifecycle, data boundaries and framework-specific checks.
- [Architecture](references/architecture.md): domain ownership, state, transport and server/client boundaries.
- [Accessibility](references/accessibility.md): keyboard, focus, labels, forms and reflow.
- [Performance](references/performance.md): critical resources, hydration and measured regressions.

## Workflow

1. Locate the affected route/domain and its public contract. Reuse existing components, tokens and services.
2. Read the stack conventions and only the other references relevant to the change.
3. Keep routes/layouts in the framework-native location. Domain services/adapters own transport; UI owns presentation. Authorization and privileged operations stay server-side.
4. Define the task's actual loading, empty, error, permission and mutation states; preserve user input on recoverable failure.
5. Implement the smallest complete vertical slice. Validate untrusted inputs and serialized outputs at the relevant boundary; scope cached data by account/tenant.
6. Run the declared build/typecheck/tests and inspect the changed interaction when a browser is available. Distinguish verified, failed and unavailable checks.

## Completion

Report behavior, affected files and test evidence. Do not claim accessibility, performance or production readiness from code inspection alone. For broader UX/visual work, load `ai-forge-frontend-ui-engineering` when available; these local references remain usable independently.
