# AI-Forge

AI-Forge é uma base versionada de contexto para agentes de IA. Reúne arquitetura, standards e skills executáveis para entregar software de forma consistente em NestJS, Node/Fastify, Go/Chi, React e Vue.

## Arquitetura

- **`standards/`**: regras L0 compartilhadas — naming, Git, segurança, observabilidade e testes.
- **`<stack>/standards/`**: tradução L2 para cada stack, mantendo o layout atual e referências locais.
- **Skills (`SKILL.md`)**: workflows executáveis em `core/` e dentro de cada stack.
- **Functions (`forge`)**: descoberta, composição de contexto, validação, instalação e atualização.
- **L3 (`CLAUDE.md`/`AGENTS.md`)**: regras do projeto; vencem L0/L2 em conflitos.

Fluxo: `core/workflow.md` → `core/guardrails.md` → arquitetura modular → L0 → L2 da stack → L3.

## Requisitos

Node.js 20 ou superior. O CLI não possui dependências runtime.

## Instalação

### Checkout recomendado

```bash
git clone git@github.com:hugoalmeidahh/ai-forge.git ~/.local/share/ai-forge
node ~/.local/share/ai-forge/bin/forge.js validate
node ~/.local/share/ai-forge/bin/forge.js install-skills
```

`install-skills` descobre recursivamente todos os `SKILL.md` e cria symlinks em `~/.agents/skills`. Os nomes instalados incluem escopo (`ai-forge-core-project-init`, `ai-forge-backend-nestjs-new-module`), evitando colisões entre stacks. Arquivo/diretório divergente nunca é sobrescrito silenciosamente; use `--force` conscientemente.

Para copiar em vez de criar symlinks:

```bash
forge install-skills --copy
```

Registry alternativo, útil em CI/testes:

```bash
forge install-skills --registry /caminho/skills
```

### Como pacote npm

Em projetos autorizados a acessar o repositório:

```bash
npm install --save-dev git+ssh://git@github.com/hugoalmeidahh/ai-forge.git
npx forge validate
npx forge install-skills
```

O ecossistema também oferece `npx skills add`; porém este repositório não depende nem garante seu comportamento. Consulte/teste a versão adotada pela sua organização antes de usá-la. A instalação suportada e validada aqui é `forge install-skills`.

> A instalação global não acontece automaticamente ao instalar o pacote; execute-a explicitamente.

## CLI

```bash
forge help
forge stacks                 # alias: forge list
forge skills                 # catálogo completo
forge skills backend-nestjs  # skills core + stack
forge context --stack backend-nestjs --skill new-module
forge init [--stack STACK] [--agent claude|codex|both] [--cwd PATH] [--force]
forge validate
forge install-skills [--link|--copy] [--force] [--registry PATH]
forge update
```

`context` imprime, em ordem, os arquivos necessários para uma tarefa. `init` detecta NestJS, Go, Fastify, React ou Vue e mantém um bloco mínimo em `CLAUDE.md`/`AGENTS.md`; ambiguidade/ausência exige `--stack`, nenhum arquivo exige `--agent`. Conteúdo fora do bloco é preservado. `--force` serve somente para reparar delimitadores malformados/duplicados, removendo-os e anexando um bloco limpo. `validate` verifica layout das stacks, frontmatter/nome único das skills, links Markdown/catálogos e resíduos da distribuição Python.

`update` executa `git pull --ff-only` em checkout Git. Em instalação via npm, atualize pelo gerenciador de pacotes:

```bash
npm update @hugoalmeidahh/ai-forge
```

Após atualizar um checkout com instalação por symlink, as skills refletem a nova versão imediatamente. Instalações `--copy` exigem nova execução de `forge install-skills --copy --force` quando o conteúdo divergir.

## Descoberta automática

A skill raiz `SKILL.md` funciona como roteador/bootstrap. Ela procura, nesta ordem:

1. `node_modules/.bin/forge` no projeto;
2. `node bin/forge.js` em um checkout atual;
3. `~/.local/share/ai-forge/bin/forge.js`;
4. se ausente, orienta o clone — sem instalar ou clonar sem aprovação.

Depois usa `forge stacks`, `forge skills <stack>` e `forge context` para carregar apenas o contexto relevante.

## Stacks e exemplos

```bash
forge stacks
# backend-golang
# backend-nestjs
# backend-node
# frontend-react
# frontend-vue

forge context --stack backend-golang --skill project-standards
forge context --stack frontend-react --skill new-module
```

Cada stack preserva `SKILLS.md`, `standards/` e suas skills no próprio diretório. Isso evita quebrar referências e mantém baixo churn.

## Criar stack

1. Copie `template-stack/` para o nome da stack, por exemplo `frontend-svelte/`.
2. Troque `[stack-name]` nos arquivos copiados.
3. Traduza `core/module-architecture.md` em `standards/project-patterns.md`.
4. Atualize `SKILLS.md` e o catálogo L2.
5. Execute `npm test`, `npm run validate` e `npm pack --dry-run`.

Use “stack” em APIs, catálogos e templates. “Equipe/time” continua válido somente quando significar pessoas ou governança humana.

## Estrutura

```text
ai-forge/
├── bin/forge.js
├── lib/forge.js
├── SKILL.md
├── core/
├── standards/
├── backend-nestjs/
├── backend-node/
├── backend-golang/
├── frontend-react/
├── frontend-vue/
├── template-stack/
└── test/
```

Conteúdo detalhado e histórico: `SPEC.md`, `CHANGELOG.md`, `presentation.html`.
