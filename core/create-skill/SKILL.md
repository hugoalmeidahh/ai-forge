---
name: ai-forge-core-create-skill
description: Create, consolidate or improve an AI Forge skill with precise routing, portable references, explicit capability limits and task-based evaluation.
---

# Create and improve skills

Start from a concrete capability and requests that should and should not select it. Inspect existing skills for overlap before creating another entrypoint. Combine repeated knowledge; keep genuinely different outputs or authority boundaries separate.

## Naming and placement

Use `ai-forge-<area>-<technology-or-purpose>-<action>` where useful, lowercase kebab-case, at most 64 characters. Omit redundant segments: `ai-forge-quality-web-testing` is clearer than an abbreviation chain. Preserve established public IDs unless a migration/alias is supplied. In this repository use `<scope>/<purpose>/SKILL.md`; the CLI materializes a registry folder matching the full ID.

## Authoring

1. Write YAML `name` and a focused `description`: capability, realistic trigger and a boundary that prevents likely misrouting. Avoid catching every vaguely related task.
2. Keep essential decisions in the entrypoint. Put conditional procedures, examples and schemas in local references with links and a reason to load them. A short skill does not need scripts or a template hierarchy.
3. Preserve user scope, L3 precedence and existing authorization. Use actual tool discovery; do not invent runtime IDs, agent roles, APIs, helpers or a mandatory provider. State what happens when a required capability is absent.
4. Scripts must have a concrete reusable purpose. Review third-party source and licenses before redistribution; preserve notices in each copied skill. Never vendor private credentials, proprietary skills, product assets or caches.
5. Add user-facing metadata only when useful. Keep name, installed ID and cross-skill references consistent. `forge skills <scope>` and `forge context --skill <full-id>` should find the result.

## Validate and improve

- Run `forge validate` and `forge sync-references`; update shared reference bundles when canonical standards change.
- Test meaningful outcomes: a positive request, a nearby negative request and a missing-capability/failure case. Use safe local fixtures. A metadata validator does not prove reasoning quality.
- For complex changes, compare the same representative task before/after with clear success criteria. Independent agents are optional and require runtime/user authorization; this skill does not start them automatically.
- Run every new/changed helper, inspect generated artifacts and check portability under copied installation. Do not equate a heading/keyword assertion with behavioral validation.
- Revise only failures supported by evidence. Avoid accumulating a universal rule for every observed one-off issue.

Deliver the skill, provenance, validation results and remaining limits. For public changes, keep a semantic commit per skill and distinguish authoring from publication authorization.
