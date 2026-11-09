---
name: ai-forge-frontend-ui-engineering
description: Projetar, implementar e revisar interfaces web com AI Forge, combinando UX de produto, direção visual, design system, arquitetura frontend, acessibilidade, responsividade e QA. Use para páginas, aplicações, componentes, formulários e melhorias de experiência. Não usar para backend sem interface, apresentações ou QA de aplicativos Android nativos.
---

# Frontend e experiência de produto com AI Forge

Entregar uma interface que permita concluir a tarefa do usuário, comunique a identidade do produto e funcione nos estados reais de uso. Beleza, usabilidade e engenharia são avaliadas juntas; acabamento visual não comprova funcionamento.

## Contexto e precedência

- Leia o pedido, os critérios do card quando houver e as instruções do repositório. Identifique público, tarefa principal, conteúdo, marca, restrições e stack pelas dependências e configurações reais.
- Aplique L0, depois L2 da stack e as regras L3 do projeto (`captain.md`, `AGENTS.md`, `CLAUDE.md`), que prevalecem sobre os padrões genéricos desta skill. Instruções superiores e escopo autorizado continuam valendo. Conflitos entre contrato e regras devem ser explicitados.
- Para React/Vue, consulte as skills FORGE da stack quando disponíveis. Elas são a autoridade de arquitetura e bibliotecas; esta skill complementa experiência, visual e critérios de qualidade. Não instale bibliotecas concorrentes para seguir um exemplo daqui.
- Sem essas skills, [arquitetura](references/architecture.md) e a referência da stack oferecem uma base local. Nenhuma dependência externa é necessária para ler esta skill.
- Preserve a identidade do agente e o worktree informado pelo runtime. Use somente ferramentas efetivamente disponíveis; não invente CLI, MCP, status, IDs ou aprovação. Esta skill não inicia agentes nem autoriza merge/publicação. Sem integração, entregue o resultado localmente.

## Escolher a profundidade

| Pedido | Caminho mínimo |
|---|---|
| Corrigir layout ou um controle | Inspecionar componente e tokens → ler referência pertinente → corrigir → verificar interação e regressão |
| Criar tela em produto existente | Reutilizar navegação, linguagem e design system → definir estados e critérios → implementar → QA |
| Produto novo ou redesenho relevante | Brief e fluxo → direção visual → tokens e componentes → implementação vertical → QA |
| Revisar interface | Reproduzir cenário → registrar problema, impacto, evidência e correção → separar defeito de preferência |

Pergunte apenas o que muda materialmente o resultado e não está no contexto. Continue partes independentes. Decisões reversíveis podem usar hipótese explícita; identidade, preços, depoimentos, permissões e regras de negócio não devem ser inventados como fatos.

## Carregar somente o necessário

Todos os caminhos são relativos a esta skill; use o diretório real retornado pelo ambiente.

| Necessidade | Referência |
|---|---|
| Jornada, navegação, formulários, tabelas e estados | [UX de produto](references/product-ux.md) |
| Identidade, composição, tipografia, imagens e movimento | [Direção visual](references/visual-design.md) |
| Tokens, temas, variantes e contratos de componentes | [Design system](references/design-system.md) |
| Domínios, contratos de API, estado e fronteira servidor/cliente | [Arquitetura](references/architecture.md) |
| Teclado, foco, contraste, zoom e tecnologias assistivas | [Acessibilidade](references/accessibility.md) |
| Recursos críticos, renderização e medições | [Performance](references/performance.md) |
| Verificação funcional, visual e entrega para QA | [QA e handoff](references/qa-handoff.md) |
| Consultar padrões locais de interface pelo comando AI Forge | [Pesquisa de interface](references/local-research.md) |
| React, Vue, Next.js, Nuxt, Astro, Angular, Svelte ou HTML/CSS | [Índice das stacks](references/stacks/index.md) |

## Do problema à interface

1. **Entender a tarefa.** Nomeie ator, objetivo, ponto de entrada, dados, ações e resultado observável. Diferencie aplicação operacional, site de conteúdo e página de aquisição. Não use um hero de marketing como padrão para um CRM.
2. **Inspecionar o existente.** Confira rotas, shell, componentes, tokens, client HTTP, estado, scripts e versão das dependências. Faça a menor alteração coerente com o produto; não regenere o design system para acrescentar uma tela.
3. **Definir experiência.** Desenhe o caminho principal e falhas relevantes. Para UI com dados, diferencie carregamento inicial, vazio, busca sem resultados, conteúdo, atualização, falha e restrição de acesso quando aplicáveis. Uma mutação precisa de pendência, sucesso e falha; não de um vazio artificial.
4. **Escolher direção visual.** Traduza marca, conteúdo e contexto em hierarquia, densidade, escala, cor e composição. Registre brevemente a escolha quando ela for nova. Respeite uma referência explícita e o design existente; não substitua por preferência estética.
5. **Implementar uma fatia funcional.** Conecte ação, validação, serviço e feedback. Componentes apresentam; hooks/composables orquestram; serviços/adapters isolam transporte e contratos. Adapte esse fluxo às APIs server-side da stack, sem mover segredos para o cliente.
6. **Verificar e ajustar.** Teste a jornada alterada, teclado, estados e tamanhos relevantes. Examine o resultado renderizado se houver navegador. Execute os checks pertinentes existentes. Relate exatamente o que foi verificado e o que ficou pendente.

Para tarefas grandes, registre as decisões no documento ou card que o projeto já usa. Se não houver padrão, um documento curto pode conter objetivo, fluxo, estados, componentes/tokens alterados e critérios. Não crie documentação cerimonial para trocar um espaçamento.

## Critérios de qualidade

- **Compreensível:** hierarquia e rótulos deixam claro onde a pessoa está, o que pode fazer e o resultado da ação. Conteúdo explica o produto, sem expor detalhes de implementação desnecessários.
- **Operável:** controles funcionam com teclado e toque; foco é visível; ações retornam feedback; falhas permitem recuperação sem apagar trabalho válido.
- **Coerente:** reaproveita tokens e componentes, mantém vocabulário, navegação e contratos. Tema e densidade servem ao contexto.
- **Robusto:** suporta textos longos, zoom, dados reais, conexão lenta e estados relevantes. Responsividade muda composição e prioridade, não apenas tamanho de fonte.
- **Sustentável:** estado tem um dono, dados sensíveis ficam protegidos, dependências são justificadas e o desempenho é medido quando pertinente.

Não imponha cor, fonte, raio, biblioteca, animação, quantidade de imagens ou altura de seção universal. Exemplos e resultados de busca são sugestões subordinadas ao projeto. Componentes acessíveis de uma biblioteca ainda precisam ser verificados na composição final.

## Saída e conclusão

Entregue o resultado e o motivo das escolhas relevantes, arquivos afetados, verificações com resultado e limitações materiais. Para revisão, inclua localização, reprodução, impacto e correção sugerida. Quando houver integração autorizada de board, anexe a evidência ao card pelo mecanismo disponível e respeite o gate de QA/review; implementação concluída não equivale a integração aprovada.
