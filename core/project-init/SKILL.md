---
name: project-init
description: Generate or update a consumer project's CLAUDE.md / AGENTS.md with ai-forge configuration for NestJS, Fastify, Go/Chi, React or Vue.
user-invocable: true
---

# Project Init

## Intent

Bootstrap a consumer project so AI agents (Claude Code, Codex) load the ai-forge method correctly: workflow, guardrails, module architecture, L0 standards, and the right stack's L2 standards and skills — with clear precedence (project file always wins).

## When To Use

- User asks to "init", "configure AI", "setup ai-forge", "create CLAUDE.md/AGENTS.md"
- A new project starts consuming the `@hugoalmeidahh/ai-forge` package
- An existing project's AI config is outdated after a package upgrade

## References

- `core/workflow.md`
- `core/guardrails.md`
- `core/module-architecture.md`
- `standards/index.md`
- `<stack>/SKILLS.md` and `<stack>/standards/index.md` for the detected stack

## Workflow

1. **Detect the base path** of the installed package:
   - Node projects: `node_modules/@hugoalmeidahh/ai-forge`
   - Python projects: run `python -c "import core_ai_prompts; print(core_ai_prompts.BASE_DIR)"`
   - If the package is not installed, instruct the user to install it first (see README) and stop.
2. **Detect the stack** by project markers:
   - `nest-cli.json` or `@nestjs/*` in `package.json` → `backend-nestjs`
   - `go.mod` → `backend-golang` (Chi)
   - `package.json` with `fastify` (no Nest) → `backend-node`
   - `package.json` with `react` (no Vue) → `frontend-react`
   - `package.json` with `vue` → `frontend-vue`
   - If ambiguous, ask the user — do not guess.
3. **Detect the agent file**: `CLAUDE.md` (Claude Code) or `AGENTS.md` (Codex). If neither exists, ask which agent the team uses, then create the file via the agent's own `/init` result or a minimal header.
4. **Write the configuration block** right after the first section of the agent file (replace a previous ai-forge block if present, marked by the comments below):

   ```markdown
   <!-- ai-forge:start -->
   ## Workflow

   Follow `<base-path>/core/workflow.md` before starting any task.

   ## Guardrails

   > ⚠️ CRITICAL: follow `<base-path>/core/guardrails.md` — these rules are absolute.

   ## Architecture

   Follow the module pattern in `<base-path>/core/module-architecture.md`.

   ## Standards

   Before making changes:
   1. Read `<base-path>/standards/index.md` (company-wide, L0) and load only the relevant files.
   2. Read `<base-path>/<stack>/standards/index.md` (stack, L2) and load only the relevant files.
   3. Rules in this file (project level) take precedence over L0/L2 when they conflict.

   ## Skills

   Check `<base-path>/<stack>/SKILLS.md` for available skills and invoke the appropriate one before starting any task.
   <!-- ai-forge:end -->
   ```

5. **Replace placeholders**: `<base-path>` with the detected path, `<stack>` with the detected stack.
6. **Report** what was written, which stack was detected, and remind the user to commit the agent file.

## Checks

- The block is delimited by `<!-- ai-forge:start -->` / `<!-- ai-forge:end -->` so re-runs are idempotent.
- Paths in the block resolve to real files in the installed package.
- Stack detection was confirmed (not guessed) when markers were ambiguous.
- Existing project-specific content in the agent file was preserved untouched.
