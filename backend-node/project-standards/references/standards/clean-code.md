# Clean code and maintainability (L0)

- Organize by business capability and real dependency boundaries. Prefer a small explicit contract to a generic manager with mode flags. Keep transport, domain decisions and infrastructure ownership distinct in persistent applications.
- Name values by intent and use the language's idioms. Prefer guard clauses for invalid/precondition states; do not extract a one-line wrapper simply to satisfy a size quota.
- Extract duplicated knowledge when it must evolve together. Similar syntax in unrelated domains does not by itself justify an abstraction. Reuse existing helpers and libraries before adding competing ones.
- Keep one authoritative owner for derived/server state. Avoid implicit synchronization, mutable shared request state and cross-domain repository access.
- Validate at trust boundaries and serialize through explicit allowed fields. Types alone do not validate external data. Authorization belongs at a trusted boundary and includes ownership/tenant checks.
- Catch errors when translating, recovering or cleaning up; otherwise propagate to the responsible boundary. Preserve causes and cancellation, avoid empty catches and never retry side effects without a safe idempotency contract.
- Comments explain non-obvious decisions and constraints. Keep examples, tests and documentation aligned with the public behavior; remove dead code only within the authorized change.
- Test observable contracts and important failure cases. A smaller change with clear evidence is preferable to unrelated rewrites. Project-specific conventions win over these defaults.
