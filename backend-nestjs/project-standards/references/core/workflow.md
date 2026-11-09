# Workflow

1. Read the user's outcome, scope, repository instructions and existing implementation. Inspect available evidence before asking questions. Project L3 overrides stack L2, which overrides shared L0; higher-level user/runtime instructions still apply.
2. Clarify only missing decisions that materially change behavior, access, cost or irreversible effects. Continue independent work; state reasonable reversible assumptions. A previously authorized action does not need repeated approval.
3. For substantial work, share a concise approach and affected boundaries. Routine fixes do not require a ceremonial plan or a new approval gate. Respect an explicit user request to plan before acting.
4. Deliver the smallest complete change consistent with the domain architecture. Keep unrelated edits separate; preserve existing data, contracts and dependency choices. A necessary adjacent fix should be explained and verified.
5. Run checks appropriate to the change using the project's declared tools. Prove meaningful behavior and failure recovery where needed; do not add tests that merely copy the implementation or promise a test was run when it was not.
6. Review the actual diff for regressions, private data, broken references and unintended generated files. Report outcome, evidence and material limitations. Drafting code, cards or documents does not itself authorize publication, messaging, production writes or delegation.
