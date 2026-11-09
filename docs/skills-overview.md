# AI Forge — overview e acesso às skills

O AI Forge reúne **45 skills instaláveis** e padrões para **11 stacks**, mais um template de autoria. As skills são instruções e referências para agentes: definem como abordar o trabalho, quais contratos preservar e como verificar a entrega. As ferramentas de execução vêm do ambiente.

[README](../README.md) · [Apresentação HTML](../presentation.html) · [Licença MIT](../LICENSE) · [Licenças e atribuições](../THIRD_PARTY_NOTICES.md)

## Como acessar

### 1. Instalar pelo checkout público

Requisito do CLI: Node.js 20+. No terminal:

```bash
git clone https://github.com/hugoalmeidahh/ai-forge.git ~/.local/share/ai-forge
cd ~/.local/share/ai-forge
node bin/forge.js validate
node bin/forge.js install-skills
```

O instalador cria links em `~/.agents/skills`. Para copiar, use `node bin/forge.js install-skills --copy`. Agentes compatíveis precisam descobrir esse diretório; uma sessão nova pode ser necessária para atualizar o catálogo. O template não é instalado. Não substitua skills divergentes com `--force` sem revisar o que será trocado.

### 2. Descobrir e carregar o contexto

Os comandos deste catálogo partem da raiz do checkout:

```bash
node bin/forge.js scopes
node bin/forge.js skills
node bin/forge.js skills design
node bin/forge.js context --skill ai-forge-core-storytelling
node bin/forge.js context --stack backend-golang --skill new-module
```

**`context` lista caminhos; não lê o conteúdo por você nem executa a tarefa.** O agente lê os arquivos retornados e segue as referências pertinentes. O ID completo evita ambiguidade e infere a stack quando existe. Fora do checkout, use o caminho real do CLI, como `node ~/.local/share/ai-forge/bin/forge.js`, ou `npx forge` se o pacote estiver instalado no projeto.

### 3. Pedir a skill ao agente

Se o agente oferecer invocação explícita por nome, use o exemplo `$ai-forge-…` de cada entrada. Caso contrário, peça em linguagem natural: “Leia a skill com este ID e aplique-a à tarefa”, ou forneça o link do `SKILL.md`. A sintaxe e a descoberta dependem do agente; a leitura direta dos arquivos é a alternativa portável.

Para um projeto consumidor, a configuração assistida é opcional:

```bash
node ~/.local/share/ai-forge/bin/forge.js init --cwd /caminho/do/projeto --agent codex --stack backend-golang
```

Escolha `claude`, `codex` ou `both` conforme os arquivos desejados. O bloco do AI Forge preserva o texto externo já existente; não altera o catálogo do agente por si só.

## Como as camadas se combinam

- **L0:** clean code, naming, Git, segurança, observabilidade e verificação compartilhados.
- **L2:** tradução dos contratos para a stack, preservando seus mecanismos nativos.
- **L3:** regras específicas do projeto; prevalecem sobre L2 e L0. Instruções do usuário e do runtime continuam válidas.
- **Capacidades:** planejamento, design, QA, integrações e artefatos carregados conforme o resultado pedido.

Um fluxo comum é storytelling → discovery quando necessário → implementação na stack → QA → review → entrega autorizada. Correções pequenas não precisam atravessar todas essas etapas. Nem todo trabalho precisa de arquitetura de backend.

A revisão FORGE conserva cinco frentes: fluxo/async, observabilidade, resiliência/erros, guard clauses/arquitetura e tratamento de erros/type safety, incluindo os riscos de segurança aplicáveis.

## Índice do catálogo

- [Por onde começar](#entrada)
- [Planejamento, revisão e entrega](#core)
- [Desenvolvimento backend](#backend)
- [Frontend e experiência de produto](#frontend)
- [Design e identidade](#design)
- [Qualidade e evidências](#quality)
- [Integrações e automação](#integrations)
- [Documentos e artefatos](#artifacts)

<a id="entrada"></a>

## Por onde começar

### Roteador do AI Forge

**ID:** `ai-forge-root-router` · [Instruções completas](../SKILL.md)

Encontra a skill adequada ao resultado pedido e orienta o carregamento do contexto.

- **Quando usar:** Você sabe o que quer entregar, mas não qual skill usar.
- **Entrega esperada:** Seleção de capacidade, stack quando necessária e referências pertinentes.
- **Condições e limites:** CLI ou acesso aos arquivos das skills.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-root-router
```

**Exemplo para um agente compatível:**

```text
$ai-forge-root-router Escolha a skill para revisar a arquitetura desta API e carregue só o contexto necessário.
```

<a id="core"></a>

## Planejamento, revisão e entrega

### Estruturação de ideias

**ID:** `ai-forge-core-storytelling` · [Instruções completas](../core/storytelling/SKILL.md)

Transforma um objetivo inicial em um trabalho verificável com SCQA, regras, riscos e tarefas.

- **Quando usar:** A ideia ainda está aberta ou envolve sistema, extração, entrada de dados, integração ou análise.
- **Entrega esperada:** Brief e planning-data.md com premissas, evidências, critérios e cards propostos.
- **Condições e limites:** Insumos reais; board é opcional e não inicia execução automaticamente.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-storytelling
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-storytelling Estruture a ideia de importar uma planilha para o CRM, com regras, riscos e critérios de pronto.
```

### Discovery de produto

**ID:** `ai-forge-core-po-discovery` · [Instruções completas](../core/po-discovery/SKILL.md)

Conduz o brief por fases de produto, arquitetura, regras, backlog e plano de execução.

- **Quando usar:** É preciso decidir o que construir e preparar trabalho rastreável para o time.
- **Entrega esperada:** Documentação viva com RN, funcionalidades, épicos, stories, decisões e tarefas.
- **Condições e limites:** Brief inicial e padrões do projeto; decisões e gates pertencem ao PO.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-po-discovery
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-po-discovery Continue o discovery deste brief e proponha a trilha adequada ao escopo.
```

### Revisão FORGE

**ID:** `ai-forge-core-code-review` · [Instruções completas](../core/code-review/SKILL.md)

Revisa mudanças pelos cinco pilares FORGE e pelos padrões da stack e do projeto.

- **Quando usar:** Um diff, branch ou conjunto de arquivos precisa de revisão técnica.
- **Entrega esperada:** Achados com localização, severidade, motivo, impacto e resumo do review.
- **Condições e limites:** Diff e contexto do projeto; leitura estática não comprova execução de testes.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-code-review
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-code-review Revise o diff desta branch e priorize bugs, segurança e violações reais da arquitetura.
```

### Criação de pull requests

**ID:** `ai-forge-core-create-pr` · [Instruções completas](../core/create-pr/SKILL.md)

Prepara título e descrição com base no diff e no template e orienta a abertura via API REST.

- **Quando usar:** Você quer redigir ou abrir uma PR para a branch de destino.
- **Entrega esperada:** Descrição técnica em português e URL da PR quando a criação for solicitada e confirmada.
- **Condições e limites:** Git, destino definido e autenticação na plataforma para publicar; redigir não equivale a abrir.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-create-pr
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-create-pr Prepare a descrição da PR desta branch para main usando o template do repositório.
```

### Autoria e melhoria de skills

**ID:** `ai-forge-core-create-skill` · [Instruções completas](../core/create-skill/SKILL.md)

Cria ou consolida skills com gatilhos claros, referências portáveis e avaliação por tarefa.

- **Quando usar:** Uma instrução recorrente deve virar skill ou uma skill precisa ficar mais precisa.
- **Entrega esperada:** Skill com nome consistente, limites, referências, procedência e validações relevantes.
- **Condições e limites:** Escopo e exemplos de uso; helpers novos devem ser executados e licenças preservadas.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-create-skill
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-create-skill Crie uma skill para revisar contratos de integração sem duplicar o code review existente.
```

### Revisão de decisões

**ID:** `ai-forge-core-decision-review` · [Instruções completas](../core/decision-review/SKILL.md)

Examina premissas, alternativas e formas concretas de uma proposta falhar.

- **Quando usar:** Uma decisão importante pede crítica antes de comprometer esforço ou recursos.
- **Entrega esperada:** Recomendação, trade-offs e menor experimento para reduzir a incerteza relevante.
- **Condições e limites:** Proposta e evidências disponíveis; não acrescenta um gate genérico a toda tarefa.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-decision-review
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-decision-review Revise a decisão de migrar esta integração para processamento assíncrono.
```

### Configuração inicial do projeto

**ID:** `ai-forge-core-project-init` · [Instruções completas](../core/project-init/SKILL.md)

Orienta o CLI a criar ou atualizar o bloco mínimo do AI Forge em arquivos de agentes.

- **Quando usar:** Um repositório precisa descobrir sua stack e carregar padrões sob demanda.
- **Entrega esperada:** CLAUDE.md e/ou AGENTS.md com bloco delimitado, preservando o conteúdo externo.
- **Condições e limites:** Checkout e CLI; sem arquivo existente, escolha --agent; ambiguidade pede --stack.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-project-init
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-project-init Configure este projeto para o agente com a stack detectada, preservando as regras locais.
```

### Verificação de onboarding

**ID:** `ai-forge-core-onboarding-check` · [Instruções completas](../core/onboarding-check/SKILL.md)

Confere se o projeto consumidor encontra o CLI, a stack, o bloco de configuração e suas referências.

- **Quando usar:** Depois de instalar, configurar ou atualizar o AI Forge em um projeto.
- **Entrega esperada:** Diagnóstico por verificação e menor correção necessária.
- **Condições e limites:** Acesso à configuração do projeto; não modifica arquivos sem pedido.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-onboarding-check
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-onboarding-check Confira se este repositório consegue carregar corretamente o contexto do AI Forge.
```

### Atualizações de projeto

**ID:** `ai-forge-core-project-update` · [Instruções completas](../core/project-update/SKILL.md)

Redige status, comunicação de incidente ou atualização para liderança com fatos verificados.

- **Quando usar:** É preciso comunicar progresso, risco, impacto ou uma decisão pendente.
- **Entrega esperada:** Texto adequado ao público, com evidência e próximos passos conhecidos.
- **Condições e limites:** Fontes de andamento; a skill redige, mas não autoriza enviar mensagens.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-project-update
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-project-update Prepare um update do projeto com o que foi entregue, riscos e próximos passos.
```

### Documentação técnica

**ID:** `ai-forge-core-write-document` · [Instruções completas](../core/write-document/SKILL.md)

Organiza documentação, propostas e decisões para que o leitor aja sem depender do chat.

- **Quando usar:** Você precisa explicar um sistema, propor uma mudança ou registrar uma decisão.
- **Entrega esperada:** Documento consistente, com fontes, premissas, ação e lacunas materiais.
- **Condições e limites:** Material de origem; arquivo Word/PDF exige também ferramenta de artefatos apropriada.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-write-document
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-write-document Documente esta integração para um desenvolvedor que ainda não conhece o projeto.
```

### Coordenação de tarefas

**ID:** `ai-forge-core-task-coordination` · [Instruções completas](../core/task-coordination/SKILL.md)

Organiza trabalho autorizado entre agentes com dono, dependências, contexto e evidência.

- **Quando usar:** O usuário pede coordenação ou delegação e o runtime oferece essa capacidade.
- **Entrega esperada:** Atribuições rastreáveis e handoff com estados reais de execução e verificação.
- **Condições e limites:** Ferramentas e autorização reais; sem integração, entrega o plano sem afirmar que o despachou.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-task-coordination
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-task-coordination Organize as tarefas desta entrega por responsável, dependências e evidências esperadas.
```

### Segurança de workspace e worktrees

**ID:** `ai-forge-core-workspace-safety` · [Instruções completas](../core/workspace-safety/SKILL.md)

Prepara e acompanha mudanças isoladas sem perder trabalho local ou confundir autorização de entrega.

- **Quando usar:** É preciso orientar um checkout, worktree, branch ou integração de mudanças.
- **Entrega esperada:** Contexto Git confirmado, alteração delimitada e estado de entrega verificável.
- **Condições e limites:** Git e contexto real do runtime; worktree não isola processos, rede ou credenciais.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-core-workspace-safety
```

**Exemplo para um agente compatível:**

```text
$ai-forge-core-workspace-safety Confira este worktree antes da entrega e preserve todas as alterações não relacionadas.
```

<a id="backend"></a>

## Desenvolvimento backend

### Padrões Go/Chi

**ID:** `ai-forge-backend-golang-project-standards` · [Instruções completas](../backend-golang/project-standards/SKILL.md)

Aplica contratos de handler, service e repository usando os mecanismos nativos de Go.

- **Quando usar:** Você vai alterar uma API ou regra de negócio em Go/Chi.
- **Entrega esperada:** Mudança alinhada a contexto, DTOs, erros, persistência e observabilidade.
- **Condições e limites:** Projeto Go e referências locais; checks de integração dependem dos serviços necessários.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-golang-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-golang-project-standards Ajuste este endpoint Go seguindo os padrões e o tratamento de erros do projeto.
```

### Novo módulo Go

**ID:** `ai-forge-backend-golang-new-module` · [Instruções completas](../backend-golang/new-module/SKILL.md)

Estrutura um domínio com handler, service, repository, DTOs, erros e wiring.

- **Quando usar:** Uma nova capacidade de negócio precisa de módulo próprio.
- **Entrega esperada:** Pacote de domínio integrado, com fronteiras e verificações pertinentes.
- **Condições e limites:** Contrato e dono do domínio; uma tabela sozinha não justifica outro módulo.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-golang-new-module
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-golang-new-module Crie o módulo de pedidos em Go/Chi com validação e erros do domínio.
```

### Padrões NestJS

**ID:** `ai-forge-backend-nestjs-project-standards` · [Instruções completas](../backend-nestjs/project-standards/SKILL.md)

Aplica convenções de módulos, controllers, services, DTOs, erros, segurança e Prisma.

- **Quando usar:** Você vai desenvolver ou revisar código em um backend NestJS.
- **Entrega esperada:** Mudança consistente com L0, L2, contratos e regras locais.
- **Condições e limites:** Projeto NestJS; regras L3 prevalecem sobre convenções genéricas.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-nestjs-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-nestjs-project-standards Implemente esta regra na API NestJS respeitando o módulo dono e os DTOs.
```

### Novo módulo NestJS

**ID:** `ai-forge-backend-nestjs-new-module` · [Instruções completas](../backend-nestjs/new-module/SKILL.md)

Cria a estrutura completa de um domínio e sua integração na aplicação.

- **Quando usar:** Uma entidade ou agregado precisa de uma nova capacidade no backend.
- **Entrega esperada:** Módulo, controller, service, DTOs e erros adequados ao contrato.
- **Condições e limites:** Domínio, endpoints e modelo de acesso; reutilize o módulo existente quando ele já for o dono.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-nestjs-new-module
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-nestjs-new-module Crie o módulo de endereços com endpoints, DTOs e autorização definidos no projeto.
```

### Migration Prisma

**ID:** `ai-forge-backend-nestjs-new-migration` · [Instruções completas](../backend-nestjs/new-migration/SKILL.md)

Prepara mudanças de schema e revisa o SQL e seus efeitos antes da entrega.

- **Quando usar:** É preciso criar ou alterar tabelas, colunas, índices ou relações via Prisma.
- **Entrega esperada:** Schema, migration revisada e código ajustado às mudanças.
- **Condições e limites:** Ambiente de desenvolvimento apropriado; SQL destrutivo e resets exigem tratamento explícito.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-nestjs-new-migration
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-nestjs-new-migration Prepare a migration para adicionar o status do pedido e avalie backfill e compatibilidade.
```

### Atualização para Prisma 7

**ID:** `ai-forge-backend-nestjs-upgrade-prisma-v7` · [Instruções completas](../backend-nestjs/upgrade-prisma-v7/SKILL.md)

Orienta a migração de configuração, clientes gerados e PrismaPg em um projeto NestJS.

- **Quando usar:** Um projeto com Prisma anterior precisa adotar a arquitetura da versão 7.
- **Entrega esperada:** Configs, schemas, dependências e imports atualizados, com geração e build verificados.
- **Condições e limites:** Confira versões e documentação compatíveis; acesso a banco e migrations segue o escopo autorizado.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-nestjs-upgrade-prisma-v7
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-nestjs-upgrade-prisma-v7 Planeje e aplique o upgrade Prisma 7 considerando todos os schemas deste projeto.
```

### Padrões Node/Fastify

**ID:** `ai-forge-backend-node-project-standards` · [Instruções completas](../backend-node/project-standards/SKILL.md)

Aplica módulos de domínio, dependências explícitas, schemas, serializers e erros consistentes.

- **Quando usar:** Você vai desenvolver um backend Node com Fastify.
- **Entrega esperada:** Rotas finas, services sem HTTP e persistência concentrada em repositories.
- **Condições e limites:** Projeto e contratos reais; preserve as dependências e o padrão de DI já adotados.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-node-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-node-project-standards Ajuste este fluxo no Fastify sem colocar regra de negócio no router.
```

### Novo módulo Node/Fastify

**ID:** `ai-forge-backend-node-new-module` · [Instruções completas](../backend-node/new-module/SKILL.md)

Cria um domínio com router, service, repository, schema, serializer e erros.

- **Quando usar:** Uma nova capacidade de negócio precisa ser integrada ao backend Node.
- **Entrega esperada:** Módulo coerente e conectado à composição da aplicação.
- **Condições e limites:** Casos de uso e contratos; implemente apenas as responsabilidades necessárias.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-node-new-module
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-node-new-module Crie o módulo de notificações no Fastify com validação e serialização explícitas.
```

### Arquitetura TypeScript/Fastify

**ID:** `ai-forge-backend-node-fastify-project-standards` · [Instruções completas](../backend-node/fastify-project-standards/SKILL.md)

Traduz conceitos úteis do NestJS para Fastify sem trazer suas dependências de runtime.

- **Quando usar:** Você precisa estruturar um backend TypeScript/Fastify com fronteiras claras.
- **Entrega esperada:** Composição explícita, validação, transações e isolamento coerentes com o projeto.
- **Condições e limites:** Segurança, banco e identidade pertencem ao projeto; regras de tenant/RLS aplicam-se quando usadas.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-backend-node-fastify-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-backend-node-fastify-project-standards Revise a arquitetura deste Fastify e a separação entre rotas, services e repositories.
```

<a id="frontend"></a>

## Frontend e experiência de produto

### Engenharia de interface e UX

**ID:** `ai-forge-frontend-ui-engineering` · [Instruções completas](../frontend/ui-engineering/SKILL.md)

Combina tarefa do usuário, direção visual, design system, arquitetura, acessibilidade e QA.

- **Quando usar:** É preciso criar, melhorar ou revisar uma interface web.
- **Entrega esperada:** Fatia funcional com estados reais, decisões visuais coerentes e verificação declarada.
- **Condições e limites:** Stack e identidade reais; pesquisa UI/UX local é opcional e usa Python 3.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-ui-engineering
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-ui-engineering Melhore esta tela de atendimento com foco na tarefa principal e na recuperação de erros.
```

### Padrões React

**ID:** `ai-forge-frontend-react-project-standards` · [Instruções completas](../frontend-react/project-standards/SKILL.md)

Organiza componentes, hooks, dados, formulários e contratos por domínio.

- **Quando usar:** Você vai alterar uma aplicação React sem impor convenções de meta-framework.
- **Entrega esperada:** Interface com dono claro para estado, transporte e comportamento.
- **Condições e limites:** Bibliotecas e regras locais prevalecem; use a tradução Next.js quando for o caso.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-react-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-react-project-standards Ajuste este formulário React mantendo o padrão de queries, schema e componentes.
```

### Novo módulo React

**ID:** `ai-forge-frontend-react-new-module` · [Instruções completas](../frontend-react/new-module/SKILL.md)

Estrutura uma capacidade com componentes, hooks, services, schemas e tipos.

- **Quando usar:** Um novo domínio de interface precisa de fronteiras próprias.
- **Entrega esperada:** Módulo integrado às rotas e ao fluxo de dados quando necessário.
- **Condições e limites:** Reutilize design system e APIs existentes; não crie rota se o domínio não tem tela navegável.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-react-new-module
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-react-new-module Crie o módulo de pedidos com lista, filtros e estados de carregamento e erro.
```

### Padrões Vue

**ID:** `ai-forge-frontend-vue-project-standards` · [Instruções completas](../frontend-vue/project-standards/SKILL.md)

Aplica componentes, composables, services, validação e separação de estado em Vue.

- **Quando usar:** Você vai alterar uma aplicação Vue.
- **Entrega esperada:** SFCs com responsabilidades claras e dados sem duplicação desnecessária.
- **Condições e limites:** Versão, bibliotecas e L3 reais; use a tradução Nuxt quando houver meta-framework.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-vue-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-vue-project-standards Ajuste este fluxo Vue preservando o estado correto ao falhar a requisição.
```

### Novo módulo Vue

**ID:** `ai-forge-frontend-vue-new-module` · [Instruções completas](../frontend-vue/new-module/SKILL.md)

Estrutura um domínio com views, componentes, composables, services, schemas e tipos.

- **Quando usar:** Uma nova capacidade da aplicação Vue precisa de organização própria.
- **Entrega esperada:** Módulo integrado, com apresentação e orquestração separadas.
- **Condições e limites:** Contratos existentes e domínio dono; reaproveite os componentes já disponíveis.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-vue-new-module
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-vue-new-module Crie o módulo de clientes com filtros, detalhes e formulário acessível.
```

### Padrões Next.js

**ID:** `ai-forge-frontend-nextjs-project-standards` · [Instruções completas](../frontend-nextjs/project-standards/SKILL.md)

Orienta rotas, fronteiras server/client, dados, cache e experiência na versão instalada.

- **Quando usar:** Você vai desenvolver ou revisar uma aplicação Next.js.
- **Entrega esperada:** Mudança compatível com o router e a estratégia de renderização do projeto.
- **Condições e limites:** Diferencie App Router e Pages Router; não presuma comportamento de cache de outra versão.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-nextjs-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-nextjs-project-standards Revise esta rota Next.js quanto a autorização, cache e fronteira server/client.
```

### Padrões Nuxt

**ID:** `ai-forge-frontend-nuxt-project-standards` · [Instruções completas](../frontend-nuxt/project-standards/SKILL.md)

Organiza dados conscientes de SSR, hidratação, estado por requisição e convenções Nuxt.

- **Quando usar:** Você vai desenvolver ou revisar uma aplicação Nuxt.
- **Entrega esperada:** Fluxo de dados e interface coerentes com a versão e o adaptador de deploy.
- **Condições e limites:** Versão e módulos reais; não compartilhe dados privados em singletons do servidor.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-nuxt-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-nuxt-project-standards Corrija o carregamento desta página Nuxt sem duplicar o fetch na hidratação.
```

### Padrões Angular

**ID:** `ai-forge-frontend-angular-project-standards` · [Instruções completas](../frontend-angular/project-standards/SKILL.md)

Aplica fronteiras de componente e serviço, DI, estado, formulários e acessibilidade.

- **Quando usar:** Você vai desenvolver ou revisar uma aplicação Angular.
- **Entrega esperada:** Mudança alinhada às APIs e convenções da versão instalada.
- **Condições e limites:** Não imponha standalone, signals ou outra sintaxe nova como migração incidental.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-angular-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-angular-project-standards Revise este componente Angular e o cancelamento das buscas concorrentes.
```

### Padrões Svelte/SvelteKit

**ID:** `ai-forge-frontend-svelte-project-standards` · [Instruções completas](../frontend-svelte/project-standards/SKILL.md)

Orienta reatividade, ciclo de vida e fronteiras de dados conforme Svelte ou SvelteKit.

- **Quando usar:** Você vai desenvolver ou revisar componentes e rotas nessa stack.
- **Entrega esperada:** Estado e renderização coerentes, com dados server-side isolados.
- **Condições e limites:** Diferencie Svelte isolado de SvelteKit e respeite a major do projeto.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-svelte-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-svelte-project-standards Revise esta rota SvelteKit e o tratamento de falhas da ação do formulário.
```

### Padrões Astro

**ID:** `ai-forge-frontend-astro-project-standards` · [Instruções completas](../frontend-astro/project-standards/SKILL.md)

Prioriza HTML e ilhas interativas com hidratação e conteúdo adequados ao uso.

- **Quando usar:** Você vai desenvolver ou revisar um site ou aplicação Astro.
- **Entrega esperada:** Páginas e ilhas funcionais, com custo de JavaScript justificado.
- **Condições e limites:** APIs de conteúdo e adaptador dependem da versão; HTML correto não prova interação das ilhas.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-astro-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-astro-project-standards Melhore esta página Astro e hidrate apenas os componentes que precisam de interação.
```

### Padrões HTML/CSS/JS

**ID:** `ai-forge-frontend-html-css-project-standards` · [Instruções completas](../frontend-html-css/project-standards/SKILL.md)

Aplica semântica, melhoria progressiva, CSS previsível e módulos proporcionais ao porte.

- **Quando usar:** O projeto usa a plataforma web sem um framework de aplicação.
- **Entrega esperada:** Página operável, responsiva e com comportamento verificável.
- **Condições e limites:** Não acrescente framework por hábito; confira o comportamento servido por HTTP quando necessário.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-frontend-html-css-project-standards
```

**Exemplo para um agente compatível:**

```text
$ai-forge-frontend-html-css-project-standards Revise esta página HTML/CSS quanto a semântica, responsividade e formulário.
```

<a id="design"></a>

## Design e identidade

### Design system

**ID:** `ai-forge-design-design-system` · [Instruções completas](../design/design-system/SKILL.md)

Organiza tokens, temas e contratos de componentes a partir do sistema existente.

- **Quando usar:** É preciso criar ou evoluir uma linguagem de interface compartilhada.
- **Entrega esperada:** Tokens e componentes com estados, acessibilidade e impacto de migração conhecidos.
- **Condições e limites:** Reutilize a stack de estilos e os componentes reais; valide os temas efetivamente entregues.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-design-design-system
```

**Exemplo para um agente compatível:**

```text
$ai-forge-design-design-system Consolide os tokens e variantes destes botões sem criar outro sistema paralelo.
```

### Diretrizes de marca

**ID:** `ai-forge-design-brand-guidelines` · [Instruções completas](../design/brand-guidelines/SKILL.md)

Define ou aplica identidade visual, voz, vocabulário e assets fornecidos.

- **Quando usar:** Você quer consistência de marca em produto e comunicação.
- **Entrega esperada:** Guia utilizável e exemplos com escolhas propostas separadas das fontes aprovadas.
- **Condições e limites:** Use a marca do usuário; confirme origem e direito de uso de logos, fontes e imagens.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-design-brand-guidelines
```

**Exemplo para um agente compatível:**

```text
$ai-forge-design-brand-guidelines Organize as diretrizes desta marca e sua relação com os tokens do produto.
```

### Assets visuais

**ID:** `ai-forge-design-visual-assets` · [Instruções completas](../design/visual-assets/SKILL.md)

Orienta banners, posters, ícones, arte generativa e GIFs conforme formato e finalidade.

- **Quando usar:** É preciso criar um material visual original ou adaptar um asset autorizado.
- **Entrega esperada:** Arquivo no formato pedido, fonte editável quando solicitada e inspeção visual.
- **Condições e limites:** Depende das ferramentas presentes; geração, exportação, compra e publicação são operações distintas.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-design-visual-assets
```

**Exemplo para um agente compatível:**

```text
$ai-forge-design-visual-assets Crie um banner de apresentação seguindo esta marca e as dimensões fornecidas.
```

<a id="quality"></a>

## Qualidade e evidências

### QA de aplicações web

**ID:** `ai-forge-quality-web-testing` · [Instruções completas](../quality/web-testing/SKILL.md)

Verifica jornadas, falhas, acessibilidade e regressões com estado renderizado e evidência.

- **Quando usar:** Uma interface precisa ser testada no navegador ou runner do projeto.
- **Entrega esperada:** Cenários com resultado esperado/observado e distinção entre passou, falhou e não executado.
- **Condições e limites:** Navegador/runner disponível e dados apropriados; screenshots não provam persistência.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-quality-web-testing
```

**Exemplo para um agente compatível:**

```text
$ai-forge-quality-web-testing Teste o fluxo de cadastro, incluindo validação e recuperação depois de falha.
```

### QA Android

**ID:** `ai-forge-quality-android-testing` · [Instruções completas](../quality/android-testing/SKILL.md)

Orienta testes em dispositivo ou emulador real usando conector ou ADB disponível.

- **Quando usar:** Você precisa verificar um app Android nativo.
- **Entrega esperada:** Evidência ligada ao app/build/dispositivo e ao resultado da jornada.
- **Condições e limites:** Dispositivo e autorização reais; viewport móvel de navegador não é teste Android.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-quality-android-testing
```

**Exemplo para um agente compatível:**

```text
$ai-forge-quality-android-testing Teste este fluxo no emulador Android indicado e registre os erros relevantes.
```

<a id="integrations"></a>

## Integrações e automação

### Servidores MCP

**ID:** `ai-forge-integrations-mcp-server` · [Instruções completas](../integrations/mcp-server/SKILL.md)

Estrutura ferramentas e recursos com contratos focados, autorização e resultados limitados.

- **Quando usar:** Você vai criar ou revisar um servidor MCP de integração.
- **Entrega esperada:** Servidor ou revisão com schemas, limites, erros e verificações de protocolo pertinentes.
- **Condições e limites:** SDK e especificação compatíveis; tool annotations não substituem a autorização no servidor.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-integrations-mcp-server
```

**Exemplo para um agente compatível:**

```text
$ai-forge-integrations-mcp-server Projete um servidor MCP para consultar pedidos e atualizar apenas os campos autorizados.
```

### Integrações LLM

**ID:** `ai-forge-integrations-llm-api` · [Instruções completas](../integrations/llm-api/SKILL.md)

Organiza adapters e fluxos de modelos com validação, orçamento, cancelamento e avaliação.

- **Quando usar:** Você vai integrar uma API LLM ou um fluxo com ferramentas.
- **Entrega esperada:** Contrato de domínio separado do provedor, falhas previstas e evidência de testes.
- **Condições e limites:** Documentação e SDK atuais; não fixa modelos/preços nem inventa resultado sem acesso à API.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-integrations-llm-api
```

**Exemplo para um agente compatível:**

```text
$ai-forge-integrations-llm-api Integre este provedor para classificar solicitações com saída validada e limite de custo.
```

### Rotinas agendadas

**ID:** `ai-forge-integrations-scheduled-jobs` · [Instruções completas](../integrations/scheduled-jobs/SKILL.md)

Especifica ou configura jobs com executor real, fuso, deduplicação e recuperação.

- **Quando usar:** Você precisa criar, alterar, pausar ou remover uma rotina ou lembrete.
- **Entrega esperada:** Contrato e estado observado do agendamento, com próximo disparo quando disponível.
- **Condições e limites:** Sem scheduler, entrega a especificação e informa que não foi agendado.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-integrations-scheduled-jobs
```

**Exemplo para um agente compatível:**

```text
$ai-forge-integrations-scheduled-jobs Prepare uma rotina diária de reconciliação com fuso, política de retry e prevenção de sobreposição.
```

<a id="artifacts"></a>

## Documentos e artefatos

### Documentos Word

**ID:** `ai-forge-artifacts-documents` · [Instruções completas](../artifacts/documents/SKILL.md)

Orienta criação e edição de documentos preservando estrutura e revisão solicitada.

- **Quando usar:** A entrega envolve Word ou documento compatível com .docx.
- **Entrega esperada:** Arquivo reaberto e, com renderer disponível, páginas afetadas inspecionadas.
- **Condições e limites:** Exige editor/gerador compatível; XML válido não comprova paginação nem alterações rastreadas.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-artifacts-documents
```

**Exemplo para um agente compatível:**

```text
$ai-forge-artifacts-documents Crie um documento Word com esta proposta e preserve a estrutura do template.
```

### Planilhas

**ID:** `ai-forge-artifacts-spreadsheets` · [Instruções completas](../artifacts/spreadsheets/SKILL.md)

Orienta edição de dados e fórmulas com tipos, unidades e cálculo explícitos.

- **Quando usar:** A entrega envolve planilha, dados tabulares ou resultados calculados.
- **Entrega esperada:** Arquivo com fórmulas e estrutura preservadas e estado de recálculo declarado.
- **Condições e limites:** Biblioteca de escrita pode não recalcular; macros e links externos não são executados por inspeção.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-artifacts-spreadsheets
```

**Exemplo para um agente compatível:**

```text
$ai-forge-artifacts-spreadsheets Prepare esta planilha de acompanhamento e confira os totais e erros de fórmula.
```

### Apresentações

**ID:** `ai-forge-artifacts-presentations` · [Instruções completas](../artifacts/presentations/SKILL.md)

Orienta narrativa, template e edição de slides com conteúdo verificável.

- **Quando usar:** É preciso criar ou alterar uma apresentação de slides.
- **Entrega esperada:** Arquivo no formato pedido, com slides afetados renderizados quando possível.
- **Condições e limites:** Exige ferramenta compatível; HTML não deve ser anunciado como arquivo PowerPoint.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-artifacts-presentations
```

**Exemplo para um agente compatível:**

```text
$ai-forge-artifacts-presentations Crie uma apresentação desta proposta usando o template e os dados fornecidos.
```

### Arquivos PDF

**ID:** `ai-forge-artifacts-pdf` · [Instruções completas](../artifacts/pdf/SKILL.md)

Orienta extração, geração, manipulação e formulários com verificação estrutural e visual.

- **Quando usar:** A entrega envolve páginas ou conteúdo de um PDF.
- **Entrega esperada:** PDF ou conteúdo extraído com geometria, texto e alterações conferidos.
- **Condições e limites:** OCR pode errar; remoção visual não comprova remoção definitiva de dados nem preserva uma assinatura digital.

**Carregar o contexto no checkout:**

```bash
node bin/forge.js context --skill ai-forge-artifacts-pdf
```

**Exemplo para um agente compatível:**

```text
$ai-forge-artifacts-pdf Extraia as tabelas deste PDF e confira os números importantes com as páginas originais.
```

## Template de autoria

[`ai-forge-template-stack-project-standards`](../template-stack/project-standards/SKILL.md) é um molde para criar uma stack. Ele fica fora da instalação e da descoberta, pois contém placeholders que precisam ser substituídos. Não conta entre as 45 skills instaláveis.

## Limites e manutenção

Skills de navegador, Android, agendamento, LLM e artefatos precisam de ferramentas e acessos reais. Carregar uma skill não instala essas capacidades, não inicia agentes e não autoriza publicação, mensagens ou alterações de produção. Os workflows de documentos usam os geradores, editores e renderers compatíveis disponíveis no ambiente.

A base editorial fica em [skills-overview-data.json](skills-overview-data.json). Para gerar este arquivo e a apresentação, use `npm run docs:build`; para detectar divergências, `npm run docs:check`. O gerador confere cobertura de todas as skills e resolve cada ID pelo CLI.

Validações do projeto: `npm test`, `npm run validate` e `npm run references:check`. Ao alterar standards canônicos, sincronize as cópias com `npm run references:sync`. Consulte [arquitetura e organização](skill-consolidation.md) e [verificação registrada](validation.md) para conhecer os contratos e o alcance das verificações.
