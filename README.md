# @hugoalmeidahh/ai-forge

Pacote de instruções para agentes de IA (Claude Code, Codex). Centraliza o **método de desenvolvimento** da empresa: arquitetura modular, standards em camadas e skills executáveis — portável entre stacks (NestJS, Fastify, Go/Chi, React, Vue).

> Veja a apresentação em `presentation.html` e a especificação completa em `SPEC.md`.

---

## O método em 30 segundos

1. **`core/module-architecture.md`** define o padrão modular universal (módulos por domínio, camadas, contrato de erro).
2. **`standards/`** (L0) são regras company-wide: naming, git, segurança, observability, testing.
3. **`backend-<stack>/standards/`** (L2) traduzem o padrão para cada stack.
4. **Skills** (`new-module`, `project-init`, `code-review`, ...) executam e verificam os padrões.
5. Regras do projeto (`CLAUDE.md` / `AGENTS.md`) são L3 — **sempre vencem** em conflito.

---

## Instalação

### npm (projetos Node.js / TypeScript / NestJS)

Adicione manualmente nas `devDependencies` do `package.json` do seu projeto:

```json
"devDependencies": {
  "@hugoalmeidahh/ai-forge": "git+ssh://git@github.com/hugoalmeidahh/ai-forge.git"
}
```

Em seguida, instale as dependências:

```bash
npm i
```

#### Manter o pacote sempre atualizado

Como o pacote é instalado a partir do Git, o lockfile pina o commit exato da última instalação. Adicione um script no `package.json` do seu projeto:

```json
"scripts": {
  "ai-update": "npm update @hugoalmeidahh/ai-forge"
}
```

### pip (projetos Python / Golang e demais)

Instale diretamente do Git:

```bash
pip install "core-ai-forge @ git+ssh://git@github.com/hugoalmeidahh/ai-forge.git"
```

Ou adicione ao `requirements.txt` / `pyproject.toml`:

```
core-ai-forge @ git+ssh://git@github.com/hugoalmeidahh/ai-forge.git
```

#### Descobrir o caminho dos arquivos instalados

```bash
python -c "import core_ai_prompts; print(core_ai_prompts.BASE_DIR)"
```

#### Manter o pacote sempre atualizado

```bash
pip install --upgrade "core-ai-forge @ git+ssh://git@github.com/hugoalmeidahh/ai-forge.git"
```

---

## Configuração no projeto consumidor

Use a skill **`core/project-init/`** — ela detecta a stack do projeto, encontra o pacote instalado e gera/atualiza o bloco de configuração no `CLAUDE.md` (Claude Code) ou `AGENTS.md` (Codex).

Manualmente, o bloco tem esta forma (substitua `<base-path>` pelo caminho do pacote e `<stack>` por `backend-nestjs`, `backend-node`, `backend-golang`, `frontend-react` ou `frontend-vue`):

```markdown
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
```

- `<base-path>` em projetos Node: `node_modules/@hugoalmeidahh/ai-forge`
- `<base-path>` em projetos Python/Go: resultado de `python -c "import core_ai_prompts; print(core_ai_prompts.BASE_DIR)"`

---

## Estrutura do pacote

```
@hugoalmeidahh/ai-forge/
├── core/                        # Fundação — vale para todas as stacks
│   ├── workflow.md              # Workflow de qualquer task (clarify, scope, plan, verify)
│   ├── guardrails.md            # Regras absolutas (secrets, env files)
│   ├── module-architecture.md   # O padrão modular universal
│   ├── code-review/             # Skill: FORGE code review (5 pilares)
│   ├── create-skill/            # Skill: cria nova skill
│   ├── create-pr/               # Skill: abre Pull Request via Git REST API
│   ├── project-init/            # Skill: configura CLAUDE.md/AGENTS.md no projeto
│   └── onboarding-check/        # Skill: valida configuração do projeto consumidor
│
├── standards/                   # L0 — standards company-wide
│   ├── index.md                 # Índice — leia primeiro para decidir quais carregar
│   ├── naming.md · git.md · security.md · observability.md · testing.md
│
├── backend-nestjs/              # Stack NestJS (referência)
│   ├── SKILLS.md
│   ├── standards/               # L2 — padrões específicos de NestJS/Prisma
│   ├── project-standards/       # Skill: aplica padrões ao escrever código
│   ├── new-module/              # Skill: scaffolda módulo completo
│   ├── new-migration/           # Skill: cria migration Prisma
│   └── upgrade-prisma-v7/       # Skill: upgrade Prisma v7
│
├── backend-node/                # Stack Node.js / Fastify
│   ├── SKILLS.md
│   ├── standards/               # L2 — router/service, Zod, serializers, AppError
│   ├── project-standards/
│   └── new-module/
│
├── backend-golang/              # Stack Golang / Chi
│   ├── SKILLS.md
│   ├── standards/               # L2 — handler/service/repository, structs, AppError
│   ├── project-standards/
│   └── new-module/
│
├── frontend-react/              # Stack React
├── frontend-vue/                # Stack Vue
├── template-team/               # Template para criar uma nova stack/time
├── CHANGELOG.md                 # Breaking changes e releases
├── core_ai_prompts/             # Pacote Python (path helper: BASE_DIR, get_team_dir)
├── SPEC.md                      # Especificação completa do método
├── presentation.html            # Apresentação (deck)
├── package.json                 # Manifesto npm
└── pyproject.toml               # Manifesto pip
```

### Hierarquia de precedência

| Layer | Escopo | Onde |
|---|---|---|
| **L0** | Company-wide | `core/` + `standards/` |
| **L2** | Linguagem + stack/framework | `<stack>/standards/` |
| **L3** | Projeto | `CLAUDE.md` / `AGENTS.md` — **sempre vence** |

---

## Criando uma nova stack/time

1. Copie o diretório `template-team/` e renomeie (ex: `frontend-svelte`).
2. Substitua os placeholders `[team-name]` nos arquivos (`SKILLS.md`, `project-standards/SKILL.md`, `standards/index.md`).
3. Preencha `standards/project-patterns.md` traduzindo `core/module-architecture.md` para a stack.
4. Adicione os demais standards L2 conforme necessário.
5. Adicione a entrada `force-include` no `pyproject.toml`:
   ```toml
   [tool.hatch.build.targets.wheel.force-include]
   "<stack-name>" = "core_ai_prompts/<stack-name>"
   ```
6. Abra um PR neste repositório.

---

## Adicionando ou modificando uma skill

Skills locais (válidas apenas para um projeto) podem ser criadas diretamente no projeto consumidor via a skill `create-skill`:

- Claude Code: `.claude/skills/<skill-name>/SKILL.md`
- Codex: `.codex/skills/<skill-name>/SKILL.md`

Se a skill for permanente e útil para toda a equipe, ela deve ser submetida via PR neste repositório para análise do time responsável.
