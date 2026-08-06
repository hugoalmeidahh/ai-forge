---
name: ai-forge
Description: Route tasks to AI-Forge standards and stack-specific skills, bootstrapping the local CLI when needed.
user-invocable: true
---

# AI-Forge Router

## Intent

Locate AI-Forge, identify the project stack, then load only the standards and skill needed for the task.

## Bootstrap

1. Locate `forge` in this order:
   - repository-local: `node_modules/.bin/forge`;
   - current AI-Forge checkout: `node bin/forge.js`;
   - user checkout: `~/.local/share/ai-forge/bin/forge.js`.
2. Run `<forge> stacks` and detect the stack from project markers. Ask when ambiguous.
3. Run `<forge> skills <stack>` to select a skill.
4. Run `<forge> context --stack <stack> --skill <skill>` and read the emitted files in order.
5. If AI-Forge is absent, instruct the user to clone it into `~/.local/share/ai-forge`, then run `node ~/.local/share/ai-forge/bin/forge.js install-skills`. Never clone or install globally without approval.

## Routing

- Architecture/module work → stack `new-module` or `project-standards`.
- Reviews → `forge-code-review`.
- Project agent config → run `forge init`; use `project-init` for options/help.
- Skill authoring → `create-skill`.
- Before changes, always apply `core/workflow.md`, `core/guardrails.md`, L0, stack L2, then project rules (L3).

## Checks

- CLI path exists.
- Stack selection is explicit.
- `forge context` exits successfully.
- Only task-relevant references were loaded.
