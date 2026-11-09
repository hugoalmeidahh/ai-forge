# QA e handoff

## Antes de verificar

Use critérios do card e scripts reais do repositório. Confirme URL, build, conta de teste e dados necessários. Não trate ambiente em produção como playground; efeitos de escrita seguem a autorização da tarefa. Use fixtures para evidência quando possível e proteja dados pessoais nas capturas.

Quando houver navegador de preview disponível, use a capacidade apropriada e o fluxo do projeto. Não substitua QA web por controle Android, nem anuncie teste em dispositivo real porque redimensionou o navegador. Sem navegador, reporte a limitação e valide o que puder por código/build.

## Matriz de evidência

| Dimensão | Cenário |
|---|---|
| Funcional | Entrada → ação principal → resultado persistido/observável; navegação e retorno |
| Falhas | Validação, erro remoto, vazio e restrição de acesso quando aplicáveis |
| Conteúdo | Texto curto/longo, dados ausentes, quantidades altas, idioma e formatação |
| Responsividade | Menor largura suportada, intermediária e desktop; verifique também uma largura entre breakpoints |
| Acessibilidade | Teclado, foco, rótulos/roles, contraste, zoom e conteúdo dinâmico pertinente |
| Visual | Hierarquia, alinhamento, densidade, estados, temas contratados e ausência de overflow acidental |
| Técnico | Lint/typecheck/build e testes existentes relevantes ao código alterado |
| Performance | Medição comparável quando a mudança afeta carregamento/interação/estabilidade |

Como amostra inicial, 390, 768 e 1440 CSS px podem expor composições diferentes; escolha tamanhos pelos usuários e contrato, não por obrigação desta lista. Inclua 320 CSS px/reflow quando necessário para avaliar acessibilidade. Capturas não substituem execução das ações.

## Automação quando útil

Reutilize runner e biblioteca do projeto. Para comportamento novo relevante, teste resultado observável (por exemplo, manter formulário após falha ou impedir envio duplicado), não uma réplica do algoritmo ou nomes internos. Pequena alteração cosmética não exige suíte nova.

Em Playwright, prefira locators por role/nome e assertions que aguardam estado observável. Na [documentação de `waitForLoadState`](https://playwright.dev/docs/api/class-page#page-wait-for-load-state), `networkidle` é desaconselhado para testes: polling e conexões contínuas podem impedir o estado sem indicar falha da UI. Espere pelo conteúdo/controle que representa prontidão; não use sleeps fixos como prova de hidratação.

Não leia seletor estático e conclua que a aplicação dinâmica funciona. Inspecione estado renderizado, execute, observe e confira o efeito. Se iniciar processos para QA, acompanhe os próprios processos e não encerre serviços alheios por nome.

## Classificar achados

- **Bloqueador:** tarefa principal impossível, perda/corrupção de dados, quebra grave de acesso ou impossibilidade de operar um controle crítico pelo público suportado.
- **Importante:** erro reproduzível, recuperação ausente, regressão de interação, conteúdo ilegível ou quebra de layout relevante.
- **Melhoria:** refinamento ou oportunidade sem violar critério atual. Preferência estética é identificada como tal.

Cada achado inclui cenário, localização, resultado esperado/observado, impacto e proposta concreta. A severidade depende do impacto real; não declare todo contraste ou todo item de catálogo como bloqueador sem contexto.

## Entregar sem inventar aprovação

Relate mudança, razão e evidência: comando/cenário, resultado e arquivos de captura/log quando existirem. Separe passou, falhou e não executado. Atualize documentação/componentes demonstrativos existentes se afetados.

No card do projeto, use o mecanismo efetivamente disponível para registrar progresso e handoff. IDs e destino vêm do runtime. O agente não assume papel de QA, capitão ou revisor para aprovar a própria mudança. Sem conexão, entregue o resumo local e indique que o registro no board não ocorreu. Esta skill não cria um gate extra de aprovação para tarefas já autorizadas.
