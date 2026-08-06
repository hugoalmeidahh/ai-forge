---
name: project-init
description: Initialize CLAUDE.md / AGENTS.md with minimal AI-Forge project configuration.
user-invocable: true
---

# Project Init

Run the stable available CLI:

```bash
forge init [--stack STACK] [--agent claude|codex|both] [--cwd PATH] [--force]
```

Stack detection uses NestJS, Go, Fastify, React, and Vue markers. Never guess: ambiguity or missing markers requires `--stack`. If neither agent file exists, require `--agent`; existing files are updated by default.

The command preserves all content outside `<!-- ai-forge:start -->` / `<!-- ai-forge:end -->`, remains idempotent, and writes only a minimal on-demand context instruction. `--force` is only for malformed/duplicate delimiters: it removes delimiter tokens and appends one clean block; unrelated content remains.

Report stack and changed files. Do not install globally or copy standards into project files.
