# AI Forge

**Padrões e skills para agentes planejarem, desenvolverem e verificarem entregas com contexto de projeto.**

O AI Forge reúne **45 skills instaláveis**, padrões para **11 stacks** e um CLI sem dependências de runtime. A base cobre arquitetura, clean code, segurança, experiência de produto e verificação, respeitando as convenções e as ferramentas reais de cada projeto.

[Catálogo completo das skills](docs/skills-overview.md) · [Apresentação online](https://hugoalmeidahh.github.io/ai-forge/) · [HTML no repositório](presentation.html) · [Licença MIT](LICENSE)

A apresentação inclui visão geral, modo de apresentação e catálogo pesquisável com exemplos. Acesse a versão online pelo GitHub Pages ou baixe o repositório e abra `presentation.html` no navegador; o GitHub normalmente mostra o código do arquivo. Não depende de fontes, bibliotecas ou serviços externos para exibir o conteúdo. Use o botão **Apresentar**, avance pelas setas ou Page Up/Page Down e saia com Esc.

## O que uma skill faz

Uma skill é um conjunto de instruções e referências que o agente carrega para uma tarefa. Ela orienta decisões, contratos e critérios de entrega; a execução depende das ferramentas e dos acessos disponíveis no ambiente.

O CLI descobre essas instruções, compõe uma lista de arquivos de contexto, valida o pacote e instala as skills. **`forge context` lista caminhos: não executa a skill, não inicia agentes e não realiza a tarefa.**

## Começar pelo checkout

Requisito do CLI: **Node.js 20 ou superior**. No terminal:

```bash
git clone https://github.com/hugoalmeidahh/ai-forge.git ~/.local/share/ai-forge
cd ~/.local/share/ai-forge
node bin/forge.js validate
node bin/forge.js install-skills
```

O instalador cria symlinks em `~/.agents/skills`, com nomes completos como `ai-forge-core-code-review`. Para instalar cópias:

```bash
node bin/forge.js install-skills --copy
```

Seu agente precisa descobrir esse diretório. Uma nova sessão pode ser necessária para atualizar o catálogo. A instalação não substitui arquivos divergentes silenciosamente; revise o conteúdo antes de usar `--force`. Um registry alternativo pode ser escolhido com `--registry /caminho/das/skills`, fora da árvore do AI Forge.

## Primeiro uso

Na raiz do checkout, descubra as capacidades e selecione o contexto:

```bash
node bin/forge.js scopes
node bin/forge.js skills
node bin/forge.js skills backend-golang
node bin/forge.js context --skill ai-forge-backend-golang-new-module
```

Peça ao agente que leia os arquivos retornados e execute a tarefa seguindo as instruções. Em agentes que suportam invocação explícita por nome, um exemplo é:

```text
$ai-forge-backend-golang-new-module
Crie o módulo de pedidos em Go/Chi, preservando os contratos e as regras deste projeto.
```

Se essa sintaxe não estiver disponível, indique o ID ou o caminho do `SKILL.md` e peça sua leitura. O [catálogo completo](docs/skills-overview.md) traz finalidade, quando usar, entrega esperada, condições e exemplo para cada uma das 45 skills.

Não é necessário escolher uma stack para toda tarefa:

```bash
node bin/forge.js context --skill ai-forge-core-storytelling
node bin/forge.js context --scope design --skill design-system
node bin/forge.js context --scope artifacts --skill spreadsheets
```

O ID completo evita ambiguidade. Com stack explícita, também é possível usar o nome local:

```bash
node bin/forge.js context --stack backend-nestjs --skill new-module
```

## Áreas e stacks

| Área | Capacidades |
|---|---|
| Entrada | Roteador para selecionar a skill e as referências adequadas |
| Core | Storytelling, discovery, revisão FORGE, PRs, autoria de skills, configuração, escrita, updates, decisões, coordenação e worktrees |
| Backend | Padrões e módulos em Go/Chi, NestJS e Node/Fastify; migrations e upgrade Prisma na stack NestJS |
| Frontend | Padrões de stack, módulos React/Vue e uma camada compartilhada de UX, design, acessibilidade e performance |
| Design | Design system, marca e assets como banners, ícones, posters e GIFs |
| Qualidade | QA web e Android com evidências do comportamento real |
| Integrações | Servidores MCP, APIs LLM e rotinas agendadas |
| Artefatos | Documentos, planilhas, apresentações e PDF com ferramentas compatíveis disponíveis |

As 11 stacks são `backend-golang`, `backend-nestjs`, `backend-node`, `frontend-react`, `frontend-vue`, `frontend-nextjs`, `frontend-nuxt`, `frontend-angular`, `frontend-svelte`, `frontend-astro` e `frontend-html-css`.

Os nomes seguem `ai-forge-<área>-<tecnologia-ou-finalidade>-<ação>`, omitindo partes redundantes. Exemplos: `ai-forge-backend-golang-new-module`, `ai-forge-core-code-review` e `ai-forge-quality-web-testing`.

O `template-stack/` é um molde para autoria. Contém placeholders, não é instalado e não conta entre as 45 skills prontas.

## Como os padrões se combinam

| Camada | Conteúdo | Onde fica |
|---|---|---|
| L0 | Clean code, naming, Git, segurança, observabilidade e verificação | `standards/` |
| L2 | Tradução dos contratos para a tecnologia | `<stack>/standards/` |
| L3 | Arquitetura, decisões e regras específicas do projeto consumidor | `AGENTS.md`, `CLAUDE.md` e documentos locais |

**L3 prevalece sobre L2, que prevalece sobre L0.** Instruções do usuário e do runtime continuam válidas. `core/` oferece arquitetura, workflow e guardrails compartilhados; capacidades adicionais são carregadas conforme o resultado pedido.

A revisão mantém os cinco pilares FORGE: fluxo/async, observabilidade, resiliência/erros, guard clauses/arquitetura e tratamento de erros/type safety. As verificações são aplicadas à stack e ao impacto real da mudança.

Um fluxo possível é storytelling → discovery quando necessário → implementação → QA → revisão → entrega autorizada. A profundidade é proporcional: uma correção simples não exige todas essas etapas, e um artefato não precisa de arquitetura de backend.

## Configurar um projeto consumidor

A configuração assistida mantém um bloco mínimo no arquivo do agente, com o comando para carregar contexto sob demanda. Fora do checkout, use o caminho real do CLI:

```bash
node ~/.local/share/ai-forge/bin/forge.js init \
  --cwd /caminho/do/projeto \
  --agent codex \
  --stack backend-golang
```

Escolha `--agent claude`, `codex` ou `both`. Sem essa opção, o CLI usa os arquivos existentes; se não houver nenhum, exige a escolha. O conteúdo fora dos delimitadores do AI Forge é preservado. `--force` serve para reparar delimitadores malformados ou duplicados, não para substituir as regras do projeto.

A stack pode ser detectada pelas dependências e configurações. Next.js, Nuxt e Astro têm precedência sobre seus runtimes incorporados; ambiguidades reais exigem `--stack`. HTML/CSS pode ser selecionado explicitamente com `--stack frontend-html-css`.

## Instalação como dependência do projeto

Também é possível instalar a partir do repositório público:

```bash
npm install --save-dev git+https://github.com/hugoalmeidahh/ai-forge.git
npx forge validate
npx forge install-skills
npx forge skills
```

O pacote não instala skills globalmente por efeito colateral: execute `install-skills` explicitamente. A descoberta por outros instaladores depende do comportamento deles; o fluxo mantido neste repositório usa o CLI `forge`.

## Referência do CLI

Nos exemplos abaixo, `forge` representa `node bin/forge.js` no checkout, o caminho completo do CLI fora dele ou `npx forge` quando instalado no projeto.

```text
forge help
forge stacks                         # alias: forge list
forge scopes
forge skills [scope]
forge context [--stack X | --scope X] --skill Y
forge init [--stack STACK] [--agent claude|codex|both] [--cwd PATH] [--force]
forge validate
forge sync-references [--write]
forge install-skills [--copy|--link] [--force] [--registry PATH]
forge update
```

`skills <stack>` inclui também o núcleo; `skills <área>` filtra aquela capacidade. O ID completo em `context` infere a stack quando aplicável. Referências adicionais são lidas sob demanda.

`update` executa `git pull --ff-only` em um checkout Git. Quando instalado como dependência, atualize pelo gerenciador e pela origem usados no projeto. Instalações por symlink refletem alterações do checkout; cópias exigem reinstalação e revisão das divergências.

## Limites de execução

Navegador, dispositivo Android, scheduler, APIs e geradores de arquivos dependem do ambiente. A skill identifica essas capacidades antes de prometer execução. A pesquisa opcional de UI/UX usa Python 3; o CLI principal continua em Node.js, sem dependências de runtime.

Os workflows de Word, planilhas, slides e PDF são autorais. Não incluem os toolkits proprietários presentes nas fontes analisadas. Renderização, recálculo e integração devem ser declarados como verificados ou não executados, conforme o que ocorreu.

Carregar uma skill não concede autorização para enviar mensagens, publicar, realizar alterações em produção ou delegar a outros agentes. A licença do software e a autorização para operar um ambiente são assuntos distintos.

## Manutenção e contribuição

```bash
npm test
npm run validate
npm run references:check
npm run docs:check
npm run pack:check
```

Os standards canônicos ficam em `core/`, `standards/` e `<stack>/standards/`. Após alterá-los, atualize as cópias conhecidas com `npm run references:sync`. A validação detecta bundles desatualizados; o sincronizador não sobrescreve referências curadas de UX nem dados de terceiros.

Para acrescentar uma stack, adapte `template-stack/`, substitua seus placeholders, defina os IDs e traduza a arquitetura com mecanismos nativos. Para criar ou melhorar uma skill, consulte [autoria de skills](core/create-skill/SKILL.md).

O overview Markdown e a apresentação compartilham a base editorial em `docs/skills-overview-data.json`. Atualize-a e execute `npm run docs:build`. O gerador verifica a cobertura do catálogo e a resolução de cada ID; `docs:check` detecta saídas desatualizadas.

## Documentação e licença

- [Overview e acesso a cada skill](docs/skills-overview.md)
- [Apresentação HTML com catálogo pesquisável](presentation.html)
- [Decisões de consolidação](docs/skill-consolidation.md)
- [Catálogo e hashes das fontes](docs/source-catalog.json)
- [Verificações registradas](docs/validation.md)
- [Histórico de alterações](CHANGELOG.md)

O conteúdo autoral usa [MIT](LICENSE). As licenças e atribuições de terceiros são preservadas separadamente em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) e dentro das skills correspondentes.
