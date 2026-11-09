---
name: ai-forge-core-storytelling
description: Estrutura um trabalho para execução por agentes antes de qualquer código ou ação — classifica o tipo (sistema, extração/scraping, entrada de dados em site, integração, análise), extrai do usuário o máximo de contexto em uma rodada, e monta resultado verificável, SCQA, pirâmide de trabalho MECE, mapa de incerteza, regras de negócio, riscos e cards prontos para o Kanban. Use quando pedirem para planejar, estruturar ou "organizar a ideia" de uma tarefa, automação, scraping, preenchimento de planilha ou site, robô, integração ou sistema, ou quando um objetivo precisar virar um plano de execução.
---

# Harness Storytelling — o argumento antes da execução

Monta a **espinha lógica de um trabalho** antes que qualquer agente toque em código, site ou planilha: qual é o resultado verificável, em que ordem as frentes entram, qual incerteza precisa ser resolvida primeiro, quais regras não podem ser violadas e o que pode dar errado antes que dê.

É a engenharia do Pyramid Principle (Minto), apontada para outra audiência. Num deck, a audiência é o board e o objetivo é consentimento. Aqui, a audiência são **os workers que vão executar sem o contexto da conversa** — e o objetivo é que cada um chegue ao resultado certo sem precisar perguntar nada.

Onde encaixa: o agente no chat principal recebe o objetivo bruto do usuário, faz o intake desta skill e entrega o plano, que vira cards no board. Se o trabalho for decidir *o que construir*, a próxima etapa é a skill `ai-forge-core-po-discovery`, conduzida pelo responsável por produto.

Três sistemas encaixados, traduzidos para execução:

1. **Estrutura** — Pyramid Principle: o resultado primeiro, as frentes depois, as tarefas por último.
2. **Lógica** — cada tarefa tem um modo de resolução: algumas aplicam regra conhecida, outras precisam investigar antes.
3. **Retórica → Critério** — fonte de verdade (Ethos), regra de negócio (Logos), custo do erro (Pathos).

## A regra que mais muda plano na prática

**Nenhuma tarefa sai sem a prova de pronto escrita.** Tarefa sem critério verificável faz o worker preencher sozinho — quase sempre com "rodou sem erro", que não é o mesmo que "fez a coisa certa".

Daí as duas consequências inegociáveis: **título de tarefa é o estado do mundo depois dela, nunca o verbo da atividade**, e o `PRONTO QUANDO` é obrigatório em todo card.

| Título fraco (atividade) | Título forte (estado resultante) |
|---|---|
| "Fazer scraping do site" | "Planilha tem 1 linha por produto ativo, com preço em R$ numérico" |
| "Criar tela de cadastro" | "Recepção cadastra paciente com CPF validado em menos de 1 min" |
| "Preencher o portal" | "Os 340 pedidos da planilha estão lançados no portal, com nº de protocolo gravado na coluna H" |
| "Investigar a API" | "Sabemos se o catálogo tem endpoint JSON paginável — sim/não, com exemplo de resposta" |

## Marcas de evidência

Mesma convenção das skills irmãs: `[D]` dito pelo usuário (citação), `[E]` evidência observada (arquivo, página, amostra, resposta de API), `[I]` inferido, `[?]` aberto.

Regra de negócio apoiada só em `[I]` é onde o worker executa errado com confiança. Ou vira `[D]`/`[E]` na intake, ou vai para a seção de premissas com default declarado — e o card que depende dela vira **validação com o usuário** antes do lote.

## Fase 0 — classifique o trabalho

O tipo decide que perguntas importam e que módulos entram na saída. Classifique antes de perguntar qualquer coisa.

| Tipo | Forma | Exemplo | Módulo da saída |
|---|---|---|---|
| **Sistema** | constrói software que vai durar | SaaS, API, app interno | Funcionalidades + Arquitetura + Estrutura técnica |
| **Extração** | fonte externa → dado estruturado | scraping de site → planilha | Fonte + Esquema de saída + Mapeamento |
| **Entrada** | dado estruturado → sistema alvo | planilha → formulário de site/portal | Esquema de entrada + Mapeamento + Execução segura |
| **Transformação/Integração** | dado A → dado B, ou sistema ↔ sistema | conciliar duas planilhas, sync CRM ↔ ERP | Contrato de dados + Mapeamento + Reconciliação |
| **Análise** | dado → conclusão | relatório, diagnóstico de base | Perguntas + Método + Formato do readout |
| **Híbrido** | combinação | extrai do site A, cruza com planilha, lança no site B | um módulo por etapa, encadeados |

Também classifique **recorrência**: execução única (script descartável, foco em resultado) ou recorrente (vira rotina — foco em robustez, agendamento, monitoramento, idempotência). Isso muda a arquitetura mais do que o tipo.

**Profundidade proporcional.** Um scraping de 50 linhas executado uma vez não ganha arquitetura em camadas. A saída mínima é sempre: resultado, premissas, regras, riscos e cards. O resto entra quando o tamanho pede.

## Fase 1 — intake: extrair o máximo em uma rodada

```
RESULTADO:     o estado verificável do mundo quando o trabalho acabar (Governing Thought)
QUEM USA:      quem consome o resultado e para quê — o "so what" do trabalho inteiro
FONTE:         de onde vem o dado/insumo, com acesso, formato e volume
DESTINO:       onde o resultado vive, em que formato, com que estrutura
REGRAS:        o que não pode acontecer, o que precisa ser normalizado, o que conta como válido
LIMITES:       prazo, ferramentas permitidas, ações irreversíveis, o que está fora do escopo
```

Protocolo:

1. **Extraia o que já está na mensagem**, explícito ou inferível, e marque cada item com `[D]`/`[I]`.
2. **Olhe antes de perguntar.** Se o usuário anexou planilha, cite colunas e linhas reais. Se deu URL e há navegador ou fetch disponível, abra e observe a estrutura — `[E]` vale mais que qualquer resposta. Pergunta que a observação responde é pergunta desperdiçada.
3. **O que faltar vira uma única rodada de perguntas agrupadas**, ordenadas por quanto a resposta muda o plano. Cada pergunta traz o **default proposto** ("Se não souber: vou assumir X"), para que o usuário possa só confirmar.
4. **Peça exemplo, não descrição.** "Me mande 2 linhas de como a planilha final deve ficar" extrai mais regra de negócio que dez perguntas abertas. Um print do formulário vale mais que a lista de campos.
5. **Separe bloqueante de não bloqueante.** Bloqueia: acesso/credencial (o usuário entra, nunca o agente), URL ou arquivo alvo, decisão sobre ação irreversível. Não bloqueia: todo o resto — siga com premissa declarada.
6. **Nunca trave esperando intake perfeito.** Premissa razoável + transparência vence paralisia.

Técnicas para extrair o que o usuário não sabe que sabe:

- **Para que serve isso depois?** — puxa o critério real de pronto. "Preencher a planilha" quase sempre é "levar o número X para a reunião Y".
- **Caso de borda concreto** — "e se o produto estiver sem preço? e se o CPF já existir no portal?" Cada resposta é uma regra de negócio.
- **Contrafactual** — "o que daria errado de um jeito que você só descobriria depois?" Revela o custo do erro.
- **Escopo negativo** — "o que parece parte disso mas não é?" Evita o worker gastar horas no lugar errado.
- **Histórico** — "isso já foi feito à mão? quanto tempo leva? onde costuma errar?" A tarefa manual é a melhor especificação que existe.

Perguntas obrigatórias por tipo (pergunte só as que a observação e a mensagem não responderam):

- **Extração:** o site exige login? quantas páginas/itens aproximadamente? quais campos, com exemplo? o que fazer com item incompleto ou duplicado? é uma vez ou recorrente? os termos do site permitem coleta automatizada?
- **Entrada:** qual coluna identifica unicamente cada registro? como saber se um registro já foi lançado? o que fazer quando o site rejeita um registro? existe ambiente de teste? posso lançar 1–3 registros de piloto para conferência antes do lote?
- **Sistema:** quem são os usuários e o que cada um faz? qual a regra que, se quebrada, gera prejuízo? qual a stack e onde roda? o que é MVP e o que é depois?
- **Transformação:** qual é a chave de cruzamento entre as bases? o que fazer com o que não casa? qual base vence em conflito?

## Fase 2 — o SCQA do trabalho

Situe antes de decompor. É o que o worker lê primeiro e o que impede ele de otimizar a coisa errada.

```
S — SITUAÇÃO    → como é feito hoje (à mão, não é feito, é feito errado)
C — COMPLICAÇÃO → o custo disso: tempo, erro, escala, prazo
Q — QUESTÃO     → a pergunta operacional que isso cria
A — RESPOSTA    → o RESULTADO verificável (Governing Thought)
```

Regra: a Resposta tem de ser a única resposta razoável à Questão. Se cabe outra (ex.: "talvez exista uma exportação nativa no site"), o SCQA está quebrado — e a alternativa vira tarefa de investigação no topo do plano.

## Fase 3 — a pirâmide de trabalho

```
          ┌──────────────────────────┐
          │   RESULTADO VERIFICÁVEL   │  ← o estado final, com critério
          └────────────┬─────────────┘
     FRENTE 1        FRENTE 2        FRENTE 3      ← workstreams MECE
     T-1.1           T-2.1           T-3.1         ← cards: estado resultante
     T-1.2           T-2.2           T-3.2
```

**MECE em todo nível.** Frentes sem sobreposição (dois workers nunca escrevem no mesmo arquivo ou no mesmo registro) e, juntas, cobrindo o resultado inteiro. Teste: se todas as frentes ficarem prontas, o resultado está garantido? Se não, falta frente. Se uma pode sair sem o resultado mudar, ela é redundante.

Frentes típicas por tipo:

- **Extração:** reconhecimento da fonte → coleta → normalização e validação → entrega
- **Entrada:** preparação e validação da planilha → mapeamento coluna→campo → piloto → lote com log → reconciliação
- **Sistema:** fundação (dados, auth, infra) → funcionalidades por fatia vertical → integrações → qualidade e deploy
- **Transformação:** contrato de dados → cruzamento → tratamento de exceções → reconciliação

## Fase 4 — mapa de incerteza (os modos lógicos, aplicados a tarefas)

Um plano não é uma lista de tarefas iguais: cada uma tem uma **situação de conhecimento** diferente, e isso decide a ordem. Atribua o modo de cada card autonomamente — nunca peça ao usuário para escolher.

| Modo | Use quando a tarefa… | Padrão de execução | Exemplo |
|---|---|---|---|
| **Dedutivo** | …aplica regra já conhecida e confirmada | Regra → aplicar → resultado forçado | mapear coluna→campo já definidos |
| **Indutivo** | …precisa generalizar a partir de amostra | Testar em N casos → nomear o padrão → escalar | seletor validado em 5 páginas antes de rodar 500 |
| **Abdutivo** | …precisa descobrir como algo funciona | Observar → hipóteses concorrentes → eliminar → melhor ajuste | o dado vem do HTML, de um XHR JSON ou de um PDF? |
| **Dialético** | …contradiz uma premissa do usuário ou uma regra conflita com outra | Premissa dele → limite → evidência → nova decisão | "o site não tem paginação" — mas tem scroll infinito |
| **Analógico** | …repete um padrão já resolvido em outro projeto | Padrão conhecido → paralelo → reuso | mesmo fluxo de login de outro robô já feito |
| **Causal** | …é pré-requisito de outras | Mecanismo → dependência → ordem | sem a chave única definida, não há idempotência |

**A consequência prática:** cards **abdutivos vêm primeiro**, cronometrados, como spikes — são onde o plano inteiro pode mudar. Cards **indutivos** sempre passam por amostra antes do volume. Cards **dedutivos** são os que podem ir em paralelo para vários workers sem supervisão.

A combinação é o **Uncertainty Fingerprint** do trabalho — sempre presente na saída. Plano com muitos abdutivos sem spike na frente é plano que vai ser refeito.

## Fase 5 — critério: fonte de verdade, regra e custo do erro

A retórica do deck vira o critério de julgamento do worker:

- **Ethos → Fonte de verdade.** Para cada dado, qual fonte vence em conflito? A planilha ou o site? O cadastro novo ou o antigo? Worker sem essa resposta escolhe ao acaso.
- **Logos → Regras de negócio.** Numeradas, testáveis, com origem marcada:
  `RN-03 [D] Preço sem desconto vai na coluna D; com desconto, na E. Se não houver desconto, E fica vazia, nunca zero.`
- **Pathos → Custo do erro.** Por regra e por ação: o que quebra se errar, quem percebe, quando, e se é reversível. É isso que decide onde entra validação humana.

```
Ação                          → Reversível? → Custo se errar         → Controle
────────────────────────────────────────────────────────────────────────────
Ler página pública            → sim        → nenhum                 → nenhum
Escrever na planilha de saída → sim        → retrabalho             → amostra conferida
Submeter formulário no portal → NÃO        → registro errado oficial → piloto + confirmação humana
Enviar e-mail/mensagem        → NÃO        → exposição externa      → aprovação explícita por envio
```

## Fase 6 — estratégia de execução (o arco)

| Estratégia | Quando | Sequência |
|---|---|---|
| **A — Direta** | tudo dedutivo, baixo risco, reversível | Preparar → executar → verificar |
| **B — Spike primeiro** | fonte ou sistema desconhecido | Investigar (timebox) → decidir abordagem → amostra → escala → verificar |
| **C — Incremental** | sistema, ou volume grande | Fatia vertical mínima → validar com usuário → próximas fatias |
| **D — Piloto com humano no circuito** | qualquer ação irreversível em sistema de terceiros | Dry-run (gera o que faria, sem submeter) → 1–3 registros reais → conferência do usuário → lote com log → reconciliação |

Trabalho de **Entrada** usa D por padrão, sempre. Trabalho de **Extração** de fonte desconhecida usa B. Híbridos encadeiam estratégias por etapa.

## Fase 7 — engenharia de riscos

Mapeie **antes** de construir, e embuta a mitigação como card ou como critério de pronto — nunca como "observação" no fim do plano.

```
Risco                                → Tipo          → Mitigação embutida
──────────────────────────────────────────────────────────────────────────
Site muda layout / seletor quebra    → fragilidade   → preferir API/XHR a HTML; validação de esquema na saída
Login, sessão expira, 2FA            → acesso        → usuário autentica; worker retoma sessão; checkpoint
CAPTCHA / bloqueio anti-bot          → limite        → NÃO contornar; pausar e devolver ao usuário
Paginação, scroll infinito, lazy load→ completude    → contagem esperada vs. coletada no critério de pronto
Rate limit / ban de IP               → limite        → intervalo entre requisições; respeitar robots e termos
Dado sujo (formato, encoding, vazio) → qualidade     → regra de normalização + coluna de status por linha
Duplicidade no lançamento            → idempotência  → chave única + checagem "já existe?" antes de submeter
Falha no meio do lote                → retomada      → log por registro (ok/erro/pulado) + retomar do último ok
Dado pessoal (CPF, saúde, contato)   → LGPD          → mínimo necessário; onde fica guardado; quem acessa
```

Para todo trabalho em site de terceiros: **credenciais nunca passam pelo agente** (o usuário autentica), **CAPTCHA nunca é contornado**, e **termos de uso e robots.txt são checados** antes de coletar em volume. Se o termo proíbe, o plano diz isso no topo e propõe alternativa (API oficial, exportação nativa, solicitação ao dono do dado).

## Fase 8 — os cards

Cada card é escrito para um worker que **não leu esta conversa**. Se ele precisar perguntar algo, o card falhou.

```
T-2.3 — {título como estado resultante}
MODO:          Dedutivo | Indutivo | Abdutivo | Dialético | Analógico | Causal
FRENTE:        {frente}
DEPENDE DE:    T-1.2, T-2.1
ENTRADA:       arquivos, URLs, colunas, credenciais (já autenticadas pelo usuário)
SAÍDA:         o que existe depois, onde, em que formato
REGRAS:        RN-03, RN-07  (referência, não cópia)
PRONTO QUANDO: critério verificável — contagem, amostra conferida, teste passando, print
NÃO FAZER:     o escopo negativo deste card
SE TRAVAR:     o que fazer — devolver ao responsável pela execução, pular e registrar, perguntar ao usuário
REVERSÍVEL:    sim | não → se não, exige confirmação humana antes
```

Card abdutivo tem timebox e resultado em forma de decisão ("API sim/não, com exemplo"). Card com `REVERSÍVEL: não` nunca roda sem piloto aprovado.

## Módulos por tipo

Entram depois do núcleo, conforme a classificação da Fase 0.

**Sistema**
- **Mapa de funcionalidades** — por perfil de usuário, cada funcionalidade com outcome, regras (RN-xx) e prioridade (MVP / depois / fora).
- **Arquitetura** — componentes, fronteiras, dados, integrações, não-funcionais; diagrama Mermaid quando esclarecer.
- **Estrutura técnica** — stack, organização de pastas/módulos, convenções, ambiente, CI/CD, fatiamento em incrementos entregáveis.

**Extração**
- **Fonte** — URL, autenticação, volume estimado, paginação, estratégia de coleta (exportação nativa > API oficial > XHR/JSON > HTML estático > navegador automatizado, nesta ordem de preferência).
- **Esquema de saída** — coluna, tipo, exemplo real, regra de normalização, obrigatória ou não.
- **Mapeamento** — campo da fonte (seletor/caminho JSON) → coluna, com origem `[E]`.
- **Completude** — como saber que coletou tudo (contagem esperada, última página, total exibido no site).

**Entrada**
- **Esquema de entrada** — colunas da planilha, tipo, validação pré-envio, chave única.
- **Mapeamento** — coluna → campo do formulário, incluindo selects, datas, máscaras, campos condicionais.
- **Execução segura** — dry-run, piloto, critério de aprovação, ritmo, log por registro (coluna de status e protocolo na própria planilha), retomada, reconciliação final (lançados vs. planilha).

**Transformação/Integração**
- **Contrato de dados** — esquema de cada lado, chave de cruzamento, fonte de verdade em conflito.
- **Reconciliação** — o que casou, o que não casou, o que conflitou, e o destino de cada grupo.

**Análise**
- **Perguntas** — as que o readout precisa responder, em ordem de decisão.
- **Método** — de onde vem cada número, como é calculado.
- **Formato** — o readout põe a conclusão primeiro, depois três achados e o que fica aberto.

## Saída

**Um arquivo só**: `planning-data.md`, em `documents/` da pasta do projeto, com o núcleo abaixo, nesta ordem. Se o usuário pedir outro nome ou lugar, use o dele. Se o arquivo já existir, leia-o e atualize em vez de recomeçar. Os módulos do tipo entram como seções do mesmo arquivo.

Núcleo, sempre nesta ordem:

1. **Classificação** — tipo, recorrência e profundidade escolhida.
2. **Resultado** — uma frase, estado verificável do mundo, com critério de pronto global.
3. **SCQA** — no máximo quatro frases por elemento.
4. **Premissas e lacunas** — o que foi assumido, com default, e o que ainda bloqueia.
5. **Regras de negócio** — RN numeradas, com marca de evidência e fonte de verdade.
6. **Pirâmide de trabalho** — frentes MECE e cards com título-estado.
7. **Uncertainty Fingerprint** — card → modo → por quê.
8. **Estratégia de execução** — arco escolhido + por quê, ordem em ondas.
9. **Mapa de riscos** — com a mitigação embutida em card ou critério.
10. **Cards** — prontos para o board (veja abaixo).
11. **Módulos do tipo** — quando aplicável.

**Registre os cards da Fase 8 na seção Cards de `planning-data.md`.** Se houver integração de board disponível e autorizada, publique-os usando as ferramentas reais dessa integração: título-estado como título, `PRONTO QUANDO` como critérios, e entrada/saída/regras, fora de escopo e tratamento de bloqueios no corpo. Consulte o board antes para evitar duplicatas. Sem integração, os cards no documento são a entrega. Referencie as RN pelo ID e pela seção do documento.

**Nunca dispare execução antes de o usuário aprovar o núcleo** quando houver ação irreversível, custo relevante ou regra `[I]` central. Para trabalho pequeno, reversível e sem lacuna bloqueante, os cards podem ser criados direto, com as premissas no topo.

## Checklist de qualidade

- [ ] Tipo e recorrência classificados antes das perguntas
- [ ] Observei os insumos disponíveis (arquivo, URL) antes de perguntar sobre eles
- [ ] Intake em uma única rodada, cada pergunta com default proposto
- [ ] Resultado é UMA frase verificável, não um tópico
- [ ] A Questão do SCQA admite uma única Resposta
- [ ] Frentes MECE — nenhum par de workers escreve no mesmo lugar
- [ ] Todo card tem título-estado, modo, `PRONTO QUANDO` e `NÃO FAZER`
- [ ] Cards abdutivos estão no início, com timebox
- [ ] Cards indutivos passam por amostra antes do volume
- [ ] Toda ação irreversível tem piloto e confirmação humana
- [ ] Toda regra central é `[D]` ou `[E]`, ou está nas premissas com card de validação
- [ ] Fonte de verdade definida para todo dado que pode conflitar
- [ ] Riscos mitigados dentro do plano, não listados no fim
- [ ] Escopo negativo escrito
- [ ] Um worker sem a conversa conseguiria executar cada card sem perguntar nada

## Regras

- **Resultado antes de atividade.** "Fazer scraping" não é objetivo; "ter a planilha X com Y para decidir Z" é.
- **Olhe antes de perguntar.** Evidência observada vence descrição do usuário, que vence inferência.
- **Exemplo vence descrição.** Duas linhas da planilha final valem mais que dez perguntas.
- **Investigação primeiro, volume por último.** O que é desconhecido vira spike; o que é generalizado passa por amostra.
- **Irreversível nunca roda em lote sem piloto aprovado.**
- **Credencial é do usuário; CAPTCHA não se contorna; termo de uso se respeita.**
- **Todo lote tem log por registro e é retomável.** Falha no registro 213 de 340 não pode significar recomeçar do zero.
- **Premissa explícita não enfraquece o plano** — premissa escondida que o worker descobre na execução, sim.
- **Proporcionalidade.** Arquitetura em camadas para script de uma vez é desperdício; ausência de idempotência em rotina recorrente é dívida.
- **Escopo negativo é entregável**, não omissão.
