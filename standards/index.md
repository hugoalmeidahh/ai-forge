<l0-standards-index>
  <purpose>
    Company-wide (L0) standards that apply to every stack and team. Use this
    index to decide which files to load. Do not load all files by default.
    Stack-specific (L2) standards live in each stack directory and take
    precedence over L0 when they conflict. Project-level rules (CLAUDE.md /
    AGENTS.md) always win.
  </purpose>
  <files>
    <file path="standards/naming.md">
      Naming conventions across languages: variables, classes, constants,
      files, JSON APIs, database.
    </file>
    <file path="standards/git.md">
      Commit message format, branch naming, PR conventions.
    </file>
    <file path="standards/security.md">
      Secrets handling, env var prefixes, auth baselines, injection prevention.
    </file>
    <file path="standards/observability.md">
      Structured logging, request correlation, PII rules, error logging.
    </file>
    <file path="standards/testing.md">
      Test organization, naming, and coverage expectations.
    </file>
  </files>
  <related>
    <file path="core/module-architecture.md">
      The core modular architecture pattern — load for any architectural
      decision or module creation.
    </file>
    <file path="core/workflow.md">Task workflow (clarify, scope, plan, verify).</file>
    <file path="core/guardrails.md">Absolute guardrails (secrets, env files).</file>
  </related>
</l0-standards-index>
