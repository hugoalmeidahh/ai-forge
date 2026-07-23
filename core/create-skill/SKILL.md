---
name: create-skill
description: Create a new skill file following the standard format for this folder.
---

# Create Skill

## Intent

Create a new local skill in the consuming project following the established structure.

## When To Use

When asked to add a new skill, automation, or reusable instruction set to this project.

## Workflow

1. Determine the target directory based on the environment:
   - Claude Code: `.claude/skills/<skill-name>/`
   - Codex: `.codex/skills/<skill-name>/`
   - Use kebab-case for the folder name.
2. Create `SKILL.md` inside it with this structure:
   - frontmatter: `name` (matches folder name) and `description` (one line, imperative)
   - sections: Intent, When To Use, References (if any), Workflow, Checks (if applicable)
3. Inform the user:
   > This skill was created locally. If it should be permanent and shared across all projects, submit it to the official package repository at `@hugoalmeidahh/ai-forge`.

## Template

```markdown
---
name: skill-name
description: One-line imperative description.
---

# Skill Title

## Intent

[What this skill does and why it exists.]

## When To Use

- [Trigger condition 1]
- [Trigger condition 2]

## References

- [Optional: files, docs, or other skills this skill depends on]

## Workflow

1. [Step 1]
2. [Step 2]

## Checks

- [Optional: validation or quality checks after execution]
```
