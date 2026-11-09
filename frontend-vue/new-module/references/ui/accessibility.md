# Acessibilidade web

Adote WCAG 2.2 nível AA como alvo desta skill, respeitando o requisito específico do projeto. A lista abaixo é uma base prática, não uma auditoria completa nem certificado de conformidade. Critérios normativos e exceções devem ser conferidos na [WCAG 2.2](https://www.w3.org/TR/WCAG22/) e nos padrões de interação da [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/).

## Semântica e navegação

Use HTML nativo antes de ARIA: links para navegação, botões para ações, inputs com labels, headings com estrutura lógica e regiões identificáveis. Preserve ordem de DOM compreensível; reposicionar visualmente com CSS não corrige ordem de leitura.

Controles operáveis por teclado, sem armadilhas, foco visível e sequência previsível. Conteúdo focado não pode ficar totalmente oculto por elementos criados pela página, incluindo barras fixas. Em navegação client-side, trate título da página e foco para manter orientação, sem roubá-lo em cada atualização de dados.

Modais precisam de nome, foco inicial adequado, contenção de foco quando modal, saída coerente com a interação e retorno ao contexto ao fechar. Não marque um painel como modal mantendo o restante da tela operável. Combobox, tabs e menus seguem seu padrão de teclado, não apenas o estilo visual.

## Contraste e alvos

Texto normal: contraste de pelo menos 4,5:1; texto grande segundo a definição WCAG: 3:1. Componentes e informação gráfica relevantes têm requisitos de contraste não textual de 3:1 nos casos aplicáveis. Considere exceções normativas como componentes inativos, sem usar isso para tornar a UI confusa.

Para AA 2.5.8, alvos de ponteiro têm pelo menos 24 × 24 CSS px **ou satisfazem uma exceção**, incluindo a de espaçamento. A regra de espaçamento usa círculos de 24 CSS px centrados nos alvos subdimensionados; não é um gap fixo universal. O critério 2.5.5 de 44 × 44 CSS px é AAA. Prefira áreas confortáveis próximas de 44 × 44 para toque quando couber, como decisão de produto, sem confundir recomendação e nível normativo.

Cor não pode ser o único sinal de status, seleção, erro ou dados. Combinações de texto, forma e ícone ajudam. Ícones decorativos com texto equivalente podem usar `aria-hidden`; ícones que são controles precisam de nome acessível no controle. Não esconda um botão inteiro com `aria-hidden`.

## Conteúdo e adaptação

- Imagens informativas têm alternativa adequada ao propósito; decorativas usam alternativa vazia. Gráficos precisam de explicação e acesso aos dados essenciais.
- Zoom, aumento de texto e espaçamento de texto não devem eliminar conteúdo ou ações. Verifique reflow em largura equivalente a 320 CSS px; tabelas e conteúdo que exige layout bidimensional têm exceções, não a página inteira.
- Não bloqueie zoom. Use unidades e layouts que suportem preferências do usuário; `px` não é automaticamente uma violação, mas textos e controles devem permanecer utilizáveis ao ampliar.
- Não dependa apenas de gesto complexo, arrastar ou hover. Ofereça alternativas aplicáveis para ponteiro simples/teclado.
- Respeite movimento reduzido como prática inclusiva e forneça pausa/parada para conteúdo automático quando exigido. Evite flashes perigosos.

## Formulários, erros e atividade

Associe rótulos, instruções e mensagens. `aria-invalid` comunica invalidez real; `aria-describedby` aponta para ajuda/erro pertinente. Após envio com múltiplos erros, um resumo focável com links pode orientar recuperação, mantendo erros junto aos campos.

Use regiões de status para resultados dinâmicos que exigem anúncio, de forma moderada. `aria-busy` sozinho não substitui toda comunicação de progresso. Não anuncie cada tecla digitada como alerta e não use `role="alert"` para todas as notificações.

Permita gerenciadores de senha e colar credenciais; autenticação deve atender aos requisitos aplicáveis de alternativas a testes cognitivos. Não faça o usuário redigitar informação já fornecida sem necessidade justificada no fluxo.

## Como verificar

Percorra a jornada por teclado; confira nomes/roles e foco no DOM renderizado; teste contraste nos estados reais e zoom/reflow. Use ferramenta automatizada existente para detectar parte dos problemas e teste com leitor de tela quando disponível e pertinente. Registre o que não foi possível verificar. Axe ou Lighthouse sem achados não comprovam conformidade integral.
