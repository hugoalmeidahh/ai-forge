# @core/ai-prompts

Pacote de instruções para agentes de IA (Claude Code, Codex). Centraliza skills, standards e padrões de times para uso como dependência em projetos internos.

---

## Instalação

### npm (projetos Node.js / TypeScript)

Adicione manualmente nas `devDependencies` do `package.json` do seu projeto:

```json
"devDependencies": {
  "@core/ai-prompts": "git+ssh://git@gitlab.taxationmind.com.br/conube/ai-prompts.git"
}
```

Em seguida, instale as dependências:

```bash
npm i
```

#### Manter o pacote sempre atualizado

Como o pacote é instalado a partir do Git, o lockfile pina o commit exato da última instalação. Para garantir que o `@core/ai-prompts` seja atualizado automaticamente toda vez que você rodar `npm i`, adicione um script `postinstall` no `package.json` do seu projeto:

```json
"scripts": {
  "ai-update": "npm update @core/ai-prompts"
}
```

### pip (projetos Python)

Instale diretamente do Git:

```bash
pip install "core-ai-prompts @ git+ssh://git@gitlab.taxationmind.com.br/conube/ai-prompts.git"
```

Ou adicione ao `requirements.txt`:

```
core-ai-prompts @ git+ssh://git@gitlab.taxationmind.com.br/conube/ai-prompts.git
```

Ou ao `pyproject.toml` do seu projeto:

```toml
[project]
dependencies = [
  "core-ai-prompts @ git+ssh://git@gitlab.taxationmind.com.br/conube/ai-prompts.git",
]
```

#### Descobrir o caminho dos arquivos instalados

```bash
python -c "import core_ai_prompts; print(core_ai_prompts.BASE_DIR)"
```

#### Manter o pacote sempre atualizado

```bash
pip install --upgrade "core-ai-prompts @ git+ssh://git@gitlab.taxationmind.com.br/conube/ai-prompts.git"
```

---

## Configuração no projeto consumidor

Inicie o agente em seu projeto usando o comando `/init` — funciona para Codex e Claude Code. Quando o agente finalizar, ele terá criado um arquivo na raiz: `CLAUDE.md` para Claude Code ou `AGENTS.md` para Codex. Dentro desse arquivo, logo após a primeira seção, adicione o conteúdo correspondente ao seu ecossistema.

### Projetos Node.js / TypeScript

Substitua `[team-name]` pelo nome do time (ex: `backend-team`):

```markdown
## Workflow

Before starting any task:

1. **Clarify before planning** — If any part of the request is ambiguous or unclear, ask before proceeding. Do not make assumptions.
2. **Define scope** — Identify exactly which files and functions are within the task's context. List them explicitly in the plan.
3. **Present a plan first** — Always present the implementation plan and wait for approval before making any changes.
4. **Stay in scope** — Do not modify files or functions outside the defined task context. If a change outside scope seems necessary, include it as a separate item in the plan with justification, and wait for explicit approval. Exception: when the approved change introduces or exposes a TypeScript/build error, you may apply the smallest directly related fix required to restore a successful build, and you must report that adjustment clearly in the final summary.
5. **Verify build after changes** — After every set of changes, run the build command declared in `package.json` and fix any TypeScript compilation errors before considering the task done. If restoring the build requires broader unrelated changes beyond the minimal exception above, stop and request approval before proceeding.

## Guardrails

> **⚠️ CRITICAL — these rules are absolute and must never be violated.**

- **NEVER** read, open, parse, or output the contents of any `.env`, `.env.*`, or environment file.
- **NEVER** read, open, parse, or output the contents of files that may contain credentials: `credentials.json`, `serviceAccountKey.json`, `*.tfvars`, `docker-compose*.yml` (when containing inline env values), or similar secret-bearing files.
- **NEVER** suggest, generate, complete, or expose API keys, secrets, tokens, passwords, or credentials of any kind — not even as examples or placeholders.
- **NEVER** search for, update, or retrieve environment variable *values* from any source (files, shell, process environment, CI config, cloud config, etc.).
- **NEVER** include secret or credential values in plans, diffs, outputs, or commit messages.
- **If a secret value is inadvertently observed** during any operation, do not reproduce it. Report only the file path and line number, and stop immediately.

**Allowed config files:** `package.json`, `tsconfig*.json`, `nest-cli.json`, `.vscode/*.json`, `eslint.config.*`, and Git Actions workflow files (`.github/workflows/*.yml`) may be read freely — they do not contain secrets.

**Exception — searching for an env variable *name* in the codebase:**
When the task requires locating where a specific environment variable is *referenced* in the code, you may search for its name. This exception applies to any search mechanism (shell commands, native tool searches, file reads, etc.). However, you **must** always exclude env and config files from the search. Example:


# correct — excludes .env files and variants
grep -r "MY_VAR_NAME" . --exclude=".env" --exclude=".env.*" --exclude-dir=".git"


Never include `.env`, `.env.*`, or credential files in any search results, even when they match.

## Skills

Check `node_modules/@core/ai-prompts/[team-name]/SKILLS.md` for available skills and invoke the appropriate one before starting any task.

## Standards

Before making changes, always:
1. Read `node_modules/@core/ai-prompts/[team-name]/standards/index.md` to identify which standard files apply to the task.
2. Load only the relevant files (do not load all at once).
3. Apply the rules found there for naming, structure, error handling, and patterns.

Use the `project-standards` skill when implementing code — it applies naming, architecture, and formatting rules from `node_modules/@core/ai-prompts/[team-name]/standards/`.
```

### Projetos Python

Substitua `[team-name]` pelo nome do time (ex: `project-team`) e `[base-path]` pelo resultado de `python -c "import core_ai_prompts; print(core_ai_prompts.BASE_DIR)"`:

```markdown
## Workflow

Before starting any task:

1. **Clarify before planning** — If any part of the request is ambiguous or unclear, ask before proceeding. Do not make assumptions.
2. **Define scope** — Identify exactly which files and functions are within the task's context. List them explicitly in the plan.
3. **Present a plan first** — Always present the implementation plan and wait for approval before making any changes.
4. **Stay in scope** — Do not modify files or functions outside the defined task context. If a change outside scope seems necessary, include it as a separate item in the plan with justification, and wait for explicit approval.
5. **Verify after changes** — After every set of changes, run the project's lint/type-check commands and fix any errors before considering the task done.

## Guardrails

> **⚠️ CRITICAL — these rules are absolute and must never be violated.**

- **NEVER** read, open, parse, or output the contents of any `.env`, `.env.*`, or environment file.
- **NEVER** read, open, parse, or output the contents of files that may contain credentials: `credentials.json`, `serviceAccountKey.json`, `*.tfvars`, or similar secret-bearing files.
- **NEVER** suggest, generate, complete, or expose API keys, secrets, tokens, passwords, or credentials of any kind — not even as examples or placeholders.
- **NEVER** search for, update, or retrieve environment variable *values* from any source (files, shell, process environment, CI config, cloud config, etc.).
- **NEVER** include secret or credential values in plans, diffs, outputs, or commit messages.
- **If a secret value is inadvertently observed** during any operation, do not reproduce it. Report only the file path and line number, and stop immediately.

**Allowed config files:** `pyproject.toml`, `setup.cfg`, `.vscode/*.json`, `ruff.toml`, `mypy.ini`, and Git Actions workflow files (`.github/workflows/*.yml`) may be read freely — they do not contain secrets.

**Exception — searching for an env variable *name* in the codebase:**
When the task requires locating where a specific environment variable is *referenced* in the code, you may search for its name. However, you **must** always exclude env and config files from the search.

## Skills

Check `[base-path]/[team-name]/SKILLS.md` for available skills and invoke the appropriate one before starting any task.

## Standards

Before making changes, always:
1. Read `[base-path]/[team-name]/standards/index.md` to identify which standard files apply to the task.
2. Load only the relevant files (do not load all at once).
3. Apply the rules found there for naming, structure, error handling, and patterns.

Use the `project-standards` skill when implementing code — it applies naming, architecture, and formatting rules from `[base-path]/[team-name]/standards/`.
```

---

## Estrutura do pacote

```
@core/ai-prompts/
├── backend-team/          # Skills e standards do time de backend (Node.js/NestJS)
│   ├── SKILLS.md          # Índice de skills disponíveis
│   ├── standards/         # Arquivos de padrões técnicos
│   │   ├── index.md       # Índice — leia primeiro para decidir quais carregar
│   │   └── *.md           # Arquivos de padrão individuais
│   ├── project-standards/ # Skill: aplica padrões ao escrever código
│   ├── create-skill/      # Skill: cria nova skill local no projeto
│   └── create-pr/         # Skill: abre Pull Request via Git REST API
│
├── frontend-team/         # (placeholder) Skills e standards do time de frontend
│
├── template-team/         # Template para criar um novo time
│   ├── SKILLS.md
│   ├── standards/
│   ├── project-standards/
│   ├── create-skill/
│   └── create-pr/
│
├── core_ai_prompts/               # Pacote Python para instalação via pip
│   └── __init__.py        # Path helper (BASE_DIR, get_team_dir)
│
├── package.json           # Manifesto npm
└── pyproject.toml         # Manifesto pip (Python packaging)
```

---

## Criando um novo time

1. Copie o diretório `template-team/` e renomeie para `<team-name>/` (ex: `frontend-team/`).
2. Substitua todos os placeholders `[team-name]` pelo nome escolhido nos arquivos:
   - `SKILLS.md`
   - `project-standards/SKILL.md`
   - `standards/index.md`
3. Preencha `standards/project-patterns.md` com a stack e arquitetura do time.
4. Adicione os demais arquivos de standard em `standards/` conforme necessário.
5. Adicione uma entrada `force-include` no `pyproject.toml` para o novo time:
   ```toml
   [tool.hatch.build.targets.wheel.force-include]
   "<team-name>" = "core_ai_prompts/<team-name>"
   ```
6. Abra um PR neste repositório para que o time fique disponível para todos os projetos.

---

## Adicionando ou modificando uma skill

Skills locais (válidas apenas para um projeto) podem ser criadas diretamente no projeto consumidor via a skill `create-skill`:

- Claude Code: `.claude/skills/<skill-name>/SKILL.md`
- Codex: `.codex/skills/<skill-name>/SKILL.md`

Se a skill for permanente e útil para toda a equipe, ela deve ser submetida via PR neste repositório para análise do time responsável.
