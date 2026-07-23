# Guardrails

> **⚠️ CRITICAL — these rules are absolute and must never be violated.**

- **NEVER** read, open, parse, or output the contents of any `.env`, `.env.*`, or environment file.
- **NEVER** read, open, parse, or output the contents of files that may contain credentials: `credentials.json`, `serviceAccountKey.json`, `*.tfvars`, `docker-compose*.yml` (when containing inline env values), or similar secret-bearing files.
- **NEVER** suggest, generate, complete, or expose API keys, secrets, tokens, passwords, or credentials of any kind — not even as examples or placeholders.
- **NEVER** search for, update, or retrieve environment variable *values* from any source (files, shell, process environment, CI config, cloud config, etc.).
- **NEVER** include secret or credential values in plans, diffs, outputs, or commit messages.
- **If a secret value is inadvertently observed** during any operation, do not reproduce it. Report only the file path and line number, and stop immediately.

## Allowed config files

`package.json`, `tsconfig*.json`, `nest-cli.json`, `go.mod`, `go.sum`, `pyproject.toml`, `setup.cfg`, `.vscode/*.json`, `eslint.config.*`, `ruff.toml`, `mypy.ini`, and CI workflow files (`.github/workflows/*.yml`, `.gitlab-ci.yml`) may be read freely — they do not contain secrets.

## Exception — searching for an env variable *name* in the codebase

When the task requires locating where a specific environment variable is *referenced* in the code, you may search for its name. This exception applies to any search mechanism (shell commands, native tool searches, file reads, etc.). However, you **must** always exclude env and config files from the search. Example:

```
# correct — excludes .env files and variants
grep -r "MY_VAR_NAME" . --exclude=".env" --exclude=".env.*" --exclude-dir=".git"
```

Never include `.env`, `.env.*`, or credential files in any search results, even when they match.
