---
name: onboarding-check
description: Verify a consuming project has a complete and valid ai-forge agent configuration.
user-invocable: true
---

# Onboarding Check

## Intent

Validate that agents in a consumer project can find and apply the correct ai-forge layers.

## When To Use

- User asks to validate AI setup, onboarding or agent configuration.
- Before adopting or upgrading this package.
- After running `project-init`.

## References

- `core/project-init/SKILL.md`
- `core/workflow.md`
- `core/guardrails.md`

## Workflow

1. Locate `CLAUDE.md` and/or `AGENTS.md`; ask which is authoritative if both differ.
2. Detect the stack from project markers; do not guess ambiguous projects.
3. Confirm the installed package base path and selected stack directories exist.
4. Confirm the agent file's delimited `<!-- ai-forge:start -->` block references workflow, guardrails, module architecture, L0 standards, L2 standards and `SKILLS.md`.
5. Confirm all referenced paths resolve and L3 precedence is stated.
6. Report pass/fail per check and the smallest remediation. Do not alter files unless requested.

## Checks

- Package installed and base path resolves.
- Stack detection is unambiguous and supported.
- Agent configuration block is complete, delimited and idempotent.
- All paths resolve.
- No secrets or environment-file values were inspected.
