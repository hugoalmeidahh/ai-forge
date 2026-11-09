# UX de produto

## Enquadrar antes de desenhar

Identifique quem usa, qual tarefa quer concluir, em que frequência e contexto, os dados necessários e como reconhecer sucesso. Distingua fatos do brief, hipóteses e dúvidas. Uma preferência visual não é evidência de usabilidade; uma heurística não é pesquisa com usuários.

| Superfície | Prioridade |
|---|---|
| Aplicação operacional / CRM | Orientação, velocidade, comparação, ações repetidas e prevenção de erro |
| Dashboard | Perguntas que os dados respondem, período, atualização e ação decorrente |
| Landing page | Oferta compreensível, demonstração, evidência verificável e próxima ação |
| Conteúdo / documentação | Encontrabilidade, leitura, navegação e links permanentes |
| Checkout / cadastro | Clareza, esforço mínimo, confiança, validação e recuperação |

Use fluxo e estrutura existentes quando funcionam. Em produto novo, um mapa curto de entrada → decisão → ação → resultado costuma revelar o que uma tela isolada esconde. Pergunte sobre uma regra faltante quando ela altera o comportamento; não bloqueie trabalho reversível por uma escolha cosmética.

## Navegação e arquitetura da informação

- Agrupe por tarefas e conceitos do usuário. Nomeie entidades e ações de forma consistente; não use nomes de tabelas ou serviços como rótulos por padrão.
- Distinga navegação global, contexto do domínio e ações da tela. Contexto, título e localização atual devem continuar claros em links profundos.
- Preserve voltar/avançar, filtros, posição e seleção quando isso dá continuidade à tarefa. Estado de busca compartilhável vive na URL quando apropriado.
- Autenticação pode usar layout próprio. Shell, saudação e ações contextuais seguem o contrato do produto, não uma regra universal de dashboard.
- Recolher a sidebar não justifica esconder a única ação crítica no mobile. Não dependa de hover para navegação ou ajuda.

## Matriz de estados

Projete os estados que existem no caso de uso; não renderize uma checklist inteira em toda tela.

| Estado | Comportamento esperado |
|---|---|
| Carregamento inicial | Indicar atividade, reservar espaço quando previsível, evitar controles falsamente prontos |
| Atualização com dados presentes | Preservar conteúdo útil e indicar atualização sem piscar a tela inteira |
| Primeiro uso vazio | Explicar o objeto e oferecer criação/importação quando permitida |
| Busca sem resultados | Mostrar critério aplicado, permitir limpar/ajustar filtros |
| Falha recuperável | Explicar efeito e oferecer nova tentativa segura; manter entradas válidas |
| Restrição de acesso | Explicar a limitação e caminho legítimo, sem revelar dados proibidos |
| Mutação pendente | Feedback imediato e prevenção de duplicidade; comunicar escopo bloqueado |
| Sucesso | Confirmar resultado e atualizar conteúdo relacionado; mensagem persistente se a tarefa exigir |
| Conflito / dados desatualizados | Explicar divergência e permitir rever antes de sobrescrever |

## Formulários

Rótulo visível, ajuda para formatos não óbvios, campos obrigatórios identificados sem depender só de cor. Use `autocomplete`, tipo e teclado adequados; permita colar e usar gerenciadores de senha.

Valide no momento que ajuda: não repreenda campo ainda não preenchido. Ao enviar, associe erro a campo e, em formulário com vários erros, use resumo com links e foco apropriado. Validação no cliente não substitui a do servidor. Preserve valores corretos depois de falha.

Agrupe por significado. Divida em etapas quando houver carga cognitiva real; não crie wizard para três campos. Em edição longa, defina salvamento, rascunho ou aviso de saída conforme custo da perda.

## Tabelas, filtros e dashboards

Escolha colunas pelas decisões do usuário; ofereça acesso a detalhes em vez de comprimir tudo. Valores comparáveis têm unidade, alinhamento e formato consistentes. Datas e dinheiro respeitam locale e fuso do produto.

Ordenação deve indicar coluna e direção. Paginação e seleção em massa explicitam se afetam página atual ou todos os resultados. Ações em massa informam contagem e impacto. Tabelas largas podem ter rolagem local identificável; não force cards se prejudicarem comparação.

Gráficos respondem uma pergunta, mostram período, unidades, fonte e frescor quando relevantes. Compare grandezas com escala honesta. Ofereça resumo ou dados tabulares equivalentes; tooltip e cor sozinhos não transmitem o conteúdo.

## Ações e conteúdo

Prefira rótulos que descrevem o resultado: “Salvar alterações”, “Criar contato”, “Exportar seleção”. A ação principal emerge da tarefa; não imponha uma quantidade fixa de CTAs por tela.

Explique consequência antes de ação irreversível e ofereça desfazer quando possível. Não use confirmação para toda ação inofensiva. Atualização otimista exige sucesso previsível, rollback e comunicação de falha; evite em operações de alto impacto sem contrato apropriado.

Escreva conteúdo plausível para testar layout, marcando fixtures de desenvolvimento. Não publique números, testemunhos, endereços, clientes, preços ou integrações inventados. Evite urgência falsa, consentimento induzido e obstáculos artificiais para cancelar.

## Critérios observáveis

Descreva dado/quando/então ou equivalente no formato do projeto. Exemplo: “Com filtros na URL, ao abrir o link em nova aba a lista mantém os filtros; quando não há resultados, limpar filtros restaura a lista”. Uma captura bonita não comprova esse critério. Se houver pesquisa real, registre participantes, tarefas e achados; sem ela, chame o resultado de avaliação heurística.
