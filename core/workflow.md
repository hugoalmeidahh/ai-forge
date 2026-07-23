# Workflow

Before starting any task:

1. **Clarify before planning** — If any part of the request is ambiguous or unclear, ask before proceeding. Do not make assumptions.
2. **Define scope** — Identify exactly which files and functions are within the task's context. List them explicitly in the plan.
3. **Present a plan first** — Always present the implementation plan and wait for approval before making any changes.
4. **Stay in scope** — Do not modify files or functions outside the defined task context. If a change outside scope seems necessary, include it as a separate item in the plan with justification, and wait for explicit approval. Exception: when the approved change introduces or exposes a build/compilation error, you may apply the smallest directly related fix required to restore a successful build, and you must report that adjustment clearly in the final summary.
5. **Verify after changes** — After every set of changes, run the project's build/lint/type-check commands and fix any errors before considering the task done. If restoring the build requires broader unrelated changes beyond the minimal exception above, stop and request approval before proceeding.
