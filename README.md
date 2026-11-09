# AI-Forge

AI-Forge é uma base versionada de contexto para agentes de IA. Reúne arquitetura, standards e workflows para desenvolvimento, planejamento, experiência de produto, QA, integrações e artefatos. Preserva o núcleo FORGE e traduz suas regras para 11 stacks, respeitando ferramentas e contexto reais.

## Arquitetura

- **`standards/`**: regras L0 compartilhadas — naming, Git, segurança, observabilidade e testes.
- **`<stack>/standards/`**: tradução L2 para cada stack, mantendo o layout atual e referências locais.
- **Skills (`SKILL.md`)**: workflows executáveis em `core/` e dentro de cada stack.
- **Functions (`forge`)**: descoberta, composição de contexto, validação, instalação e atualização.
- **L3 (`CLAUDE.md`/`AGENTS.md`)**: regras do projeto; vencem L0/L2 em conflitos.

Fluxo: `core/workflow.md` → `core/guardrails.md` → arquitetura modular → L0 → L2 da stack → L3.

## Requisitos

Node.js 20 ou superior. O CLI não possui dependências runtime. A pesquisa local opcional de UI/UX exige Python 3; testes de navegador/dispositivo, geração de arquivos e integrações exigem capacidades próprias do ambiente, descobertas antes de executar.

## Instalação

### Checkout recomendado

```bash
git clone https://github.com/hugoalmeidahh/ai-forge.git ~/.local/share/ai-forge
node ~/.local/share/ai-forge/bin/forge.js validate
node ~/.local/share/ai-forge/bin/forge.js install-skills
```

`install-skills` descobre recursivamente os `SKILL.md` executáveis (exclui `template-stack/`) e cria symlinks em `~/.agents/skills`. Os nomes instalados incluem escopo (`ai-forge-core-project-init`, `ai-forge-backend-nestjs-new-module`), evitando colisões entre stacks. Arquivo/diretório divergente nunca é sobrescrito silenciosamente; use `--force` conscientemente.

Para copiar em vez de criar symlinks:

```bash
forge install-skills --copy
```

Registry alternativo, útil em CI/testes:

```bash
forge install-skills --registry /caminho/skills
```

### Como pacote npm

A partir do repositório público:

```bash
npm install --save-dev git+https://github.com/hugoalmeidahh/ai-forge.git
npx forge validate
npx forge install-skills
```

O ecossistema também oferece `npx skills add`; porém este repositório não depende nem garante seu comportamento. Consulte/teste a versão adotada pela sua organização antes de usá-la. A instalação suportada e validada aqui é `forge install-skills`.

> A instalação global não acontece automaticamente ao instalar o pacote; execute-a explicitamente.

## CLI

```bash
forge help
forge stacks                 # alias: forge list
forge scopes                 # áreas e stacks disponíveis
forge skills                 # catálogo completo
forge skills design          # capacidades de uma área
forge skills backend-nestjs  # skills core + stack
forge context --stack backend-nestjs --skill new-module
forge context --skill ai-forge-core-storytelling
forge context --scope design --skill design-system
forge init [--stack STACK] [--agent claude|codex|both] [--cwd PATH] [--force]
forge validate
forge sync-references        # detecta divergência nos standards empacotados
forge sync-references --write # sincroniza com os standards canônicos
forge install-skills [--link|--copy] [--force] [--registry PATH]
forge update
```

`context` imprime, em ordem, os arquivos necessários para uma tarefa. Capacidades de core/design/QA/artefatos podem ser selecionadas sem stack; o identificador completo infere a stack quando existe. `skills <área>` filtra capacidades e `skills <stack>` inclui também o núcleo. Nomes curtos ambíguos exigem escopo ou ID completo. `init` detecta NestJS, Go, Fastify, React, Vue, Next.js, Nuxt, Astro, Angular ou Svelte/SvelteKit e mantém um bloco mínimo em `CLAUDE.md`/`AGENTS.md`; ambiguidade/ausência exige `--stack`, nenhum arquivo exige `--agent`. Conteúdo fora do bloco é preservado. `--force` serve somente para reparar delimitadores malformados/duplicados, removendo-os e anexando um bloco limpo. `validate` verifica layout, frontmatter/nomes, links/catálogos, sincronização das referências canônicas e resíduos da antiga distribuição Python. O motor Python opcional de UI/UX é uma biblioteca isolada de terceiros, sem substituir o CLI Node.js.

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
# frontend-angular
# frontend-astro
# frontend-html-css
# frontend-nextjs
# frontend-nuxt
# frontend-react
# frontend-svelte
# frontend-vue

forge context --stack backend-golang --skill project-standards
forge context --stack frontend-react --skill new-module
```

Cada stack preserva `SKILLS.md`, `standards/` e suas skills no próprio diretório. Isso evita quebrar referências e mantém baixo churn.

## Catálogo e nomenclatura

O catálogo reúne **45 skills instaláveis** (incluindo o roteador), mais **1 template de autoria** e **11 stacks**. Os IDs seguem `ai-forge-<área>-<tecnologia-ou-finalidade>-<ação>`, omitindo partes redundantes e preservando os nomes públicos existentes. Exemplos: `ai-forge-backend-golang-new-module`, `ai-forge-frontend-nextjs-project-standards`, `ai-forge-quality-web-testing`.

| Área | Capacidades |
|---|---|
| Core | Storytelling/discovery, revisão FORGE, criação de skills, configuração do projeto, escrita, updates, revisão de decisões, coordenação e worktrees |
| Backend | NestJS, Node/Fastify e Go/Chi; módulos, padrões, migrations e atualização Prisma conforme a stack |
| Frontend | React, Vue, Next.js, Nuxt, Astro, Angular, Svelte/SvelteKit e HTML/CSS; UX, estados, acessibilidade, performance e arquitetura |
| Design | Design system, marca, banners, posters, ícones, arte generativa e GIFs |
| Quality | Verificação web e Android com evidência do ambiente real |
| Integrations | Servidores MCP, APIs/fluxos LLM e rotinas agendadas |
| Artifacts | Documentos, planilhas, apresentações e PDF com ferramentas disponíveis e verificação de saída |

Planejamento usa `documents/planning-data.md` como fonte da verdade; board e execução por agentes dependem de integração e autorização reais. A camada frontend consolida as coleções fornecidas: direção visual acompanha a tarefa e o produto, sem paleta obrigatória, bibliotecas concorrentes ou efeitos universais.

As skills de arquivos são workflows autorais que exigem um gerador/editor e, quando necessário, um renderer/calculador disponível. Não incluem os toolkits proprietários da pasta de origem nem garantem capacidades que o runtime não oferece. Sem a capacidade necessária, o resultado deve indicar precisamente o que foi produzido e o que não foi verificado.

## Portabilidade e manutenção

Referências, metadados e licenças ficam dentro da skill quando necessários. Caminhos `references/` nos catálogos FORGE partem da pasta da skill; links Markdown comuns nas referências curadas preservam seu caminho relativo. Instalações `--copy` verificam a árvore inteira antes de declarar `unchanged`, incluindo dados, licença e referências.

Os standards canônicos continuam em `core/`, `standards/` e `<stack>/standards/`. Depois de alterá-los, rode `forge sync-references --write`; `forge validate` detecta cópias desatualizadas. Referências curadas de UX e dados de terceiros não são sobrescritos por esse sincronizador.

O [relatório de consolidação](docs/skill-consolidation.md) explica sobreposições, exclusões e limites. O [catálogo de fontes](docs/source-catalog.json) registra os 83 entrypoints analisados nas duas pastas fornecidas, seus hashes e o destino de cada capacidade. Esses hashes identificam os insumos; não certificam comportamento futuro do modelo.

## Licença e atribuição

O conteúdo autoral do AI Forge usa [MIT](LICENSE). Conteúdos adaptados preservam suas próprias licenças e avisos, inclusive nos pacotes copiados. Veja [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Materiais proprietários de office não foram copiados nem traduzidos para o pacote público.

## Criar stack

1. Copie `template-stack/` para o nome da stack, por exemplo `frontend-svelte/`.
2. Troque `[stack-name]` nos arquivos copiados.
3. Atualize o `name` de cada skill para `ai-forge-<nova-stack>-<finalidade>` e traduza `core/module-architecture.md` em `standards/project-patterns.md`.
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
├── frontend-vue/             # demais stacks frontend no mesmo nível
├── frontend/                 # UX/engenharia compartilhada
├── design/
├── quality/
├── integrations/
├── artifacts/
├── docs/
├── template-stack/
└── test/
```

Conteúdo detalhado e histórico: `SPEC.md`, `CHANGELOG.md`, `presentation.html`.
