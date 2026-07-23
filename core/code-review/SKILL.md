---
name: forge-code-review
Review diffs using the FORGE five-pillar framework. Detect the stack, load its L2 standards plus relevant L0 rules, and produce actionable findings with reason, impact and PR summary.
user-invocable: true
---

# FORGE Code Review

## Intent

Revisar um diff ou conjunto de arquivos aplicando o framework **FORGE** (5 pilares), análise estática por leitura, DRY e Clean Code — ancorado em L0 e nos standards L2 da stack detectada. Entregar comentários pontuais com *porquê* + *impacto* e um resumo global da PR.

Esta skill **não depende de ferramenta externa** (SonarQube, linter em CI). As verificações que essas ferramentas fariam estão incorporadas e são feitas pela leitura do código. A régua de "certo/errado" é o conjunto de padrões do time referenciado abaixo.

## When To Use

- Usuário pede para "revisar", "code review", "revisar PR", "revisar esse diff", "analisar esse código"
- Usuário cola um diff, um arquivo, ou pede para revisar uma branch
- Usuário pede feedback de qualidade, arquitetura ou aderência aos padrões do time

## References

Ler sob demanda; nunca carregar todos por padrão.

1. Detectar stack: `nest-cli.json`/`@nestjs/*` → NestJS; `go.mod` → Go/Chi; `fastify` → Node/Fastify; `react` → React; `vue` → Vue. Se ambígua, perguntar.
2. Ler `standards/index.md` (L0), então `<stack>/standards/index.md` (L2); carregar somente arquivos relevantes ao diff.
3. Aplicar L3 (`CLAUDE.md`/`AGENTS.md`) quando existir — L3 vence L2, que vence L0.

Mapeamento de revisão:

| Stack | Carregar conforme necessário |
|---|---|
| NestJS | `controllers-services`, `dto-standards`, `error-handling`, `auth-security`, `prisma-postgres-standards`, `folder-structure` |
| Node.js | `router-service`, `validation-serialization`, `error-handling`, `project-patterns` |
| Golang / Chi | `handler-service-repository`, `dto-structs`, `error-handling`, `project-patterns` |
| React | `components-hooks`, `api-state`, `project-patterns` |
| Vue | `components-composables`, `api-state`, `project-patterns` |

> Se o repositório concreto divergir, seguir seu padrão L3 e sinalizar a divergência.

## Princípios do Review

1. **Parcimônia acima de tudo.** Não comentar o óbvio nem encher a PR de ruído. Cada comentário precisa justificar sua existência. Se não muda a decisão de merge nem ensina algo útil, não comentar.
2. **Todo comentário carrega motivo + impacto.** Nunca apenas "troque X por Y". Sempre: o que ajustar, **por que** (a regra do time ou o princípio), e **qual o impacto** de não ajustar (bug, vazamento, dívida, quebra na próxima story). Citar o padrão de origem quando aplicável (ex.: "controllers-services: controller não acessa BD").
3. **Severidade explícita.** Cada ponto é 🔴 blocker / 🟡 sugestão relevante / 🔵 nitpick, para o autor priorizar.
4. **Foco no que importa.** Lógica de negócio, segurança, arquitetura e async pesam mais que estilo. Estilo puro é 🔵 e vai condensado, não item a item.
5. **Respeitar o autor.** Tom colaborativo, nunca condescendente. Elogiar o que está bom quando genuíno. Sugerir, não impor — exceto 🔴 blockers, inegociáveis.
6. **Não reescrever a PR inteira.** Apontar o padrão e dar um exemplo curto; o autor replica no resto.

## Workflow

### 1. Coletar contexto

1. Ler o diff completo — abrir o arquivo inteiro quando o trecho depender do contexto ao redor.
2. Classificar cada arquivo pelo sufixo (`.controller.ts`, `.service.ts`, `.input.ts`, `.output.ts`, `.error.ts`, `.guard.ts`, `.module.ts`, `schema.prisma`, migration) e carregar o(s) `standards/*` correspondente(s).
3. Identificar o **propósito da PR** (feature, fix, refactor) — calibra o rigor: hotfix urgente tolera dívida temporária documentada; feature nova não.
4. Se faltar algo essencial (arquivo referenciado ausente, contexto de tipos), dizer o que falta em vez de adivinhar.

### 2. Passar cada arquivo pelos 5 pilares FORGE

Avaliar apenas pilares e regras aplicáveis à stack/arquivo. Regras que citam NestJS, Prisma, DTO classes, `BaseError`, `GlobalErrorFilter`, Basic/JWT ou Swagger aplicam-se **somente a NestJS**. Para Node.js, usar router/schema/serializer/`AppError`; para Golang, handler/struct/`*AppError`/`writeError`.

#### 🔥 F — Flow Control & Async

Pergunta-chave: *há race conditions, promises não-aguardadas ou memory leaks?*

- Promises sempre aguardadas ou com tratamento explícito. Fire-and-forget só com log deliberado.
- Escritas multi-tabela dentro de **uma transação** Prisma (ver pilar 🏗️ G e error-handling).
- Race conditions: escritas concorrentes, closure com valor obsoleto, resultado que chega após desmontar (front).
- Cleanup no front: `useEffect` com cleanup; listeners/subscriptions removidos; timers limpos; `AbortController` em fetch.
- `general-development`: evitar função anônima em `map/filter/reduce` — preferir função nomeada (stack trace melhor).

#### 👁️ O — Observability & Traceability

Pergunta-chave: *dá para rastrear a requisição de ponta a ponta? Há dado sensível em log?*

- Logging estruturado (Pino, conforme company-standards), não `console.log` solto.
- `error-handling`: logar com file/line, classe do erro e mensagem descritiva; preservar stack completo.
- Resposta de erro usa `x-request-id` quando presente (senão UUID) — o `id` do payload de erro serve de correlação.
- Sem dado sensível em log. `auth-security`: nunca expor token em log, URL ou variável pública; não logar payload aberto de usuário (name, email) sem necessidade.

#### 🛡️ R — Resilience & Error Handling

Pergunta-chave: *falhas externas (rede, BD, provider) são tratadas conforme o padrão?*

- `error-handling`: **evitar try/catch quando possível**; usar só quando a exceção não pode interromper a execução. Não engolir erro em catch vazio.
- Todo erro de negócio tem classe específica que **estende `BaseError`** (`httpCode` + `message`). Não lançar `Error` cru nem `HttpException` do Nest direto quando existe erro de domínio adequado.
- Usar os erros padrão quando cabível: `DuplicatedEntityError`, `EntityNotFoundError`, `InternalProviderError`, `InvalidPayloadError`.
- Falha de provider externo (BD, AWS, mensageria) → `InternalProviderError`.
- 5xx **nunca** vaza o motivo real na resposta — detalhe só no log; cliente recebe `{ code: "internal_error", message: "internal error" }`.
- Resposta de erro sempre no formato do `GlobalErrorFilter`: `{ id, code, message }` (`code` derivado do nome da classe em snake_case).

#### 🏗️ G — Guard Clauses & Architecture

Pergunta-chave: *respeita as camadas e é fix de raiz, não paliativo?*

Fluxo canônico: **Request → boundary → Service → Repository/Provider → Service → boundary → output → Response**.

- Boundary fina: Nest controller / Node router / Go handler define rota, auth, valida input, chama service e serializa resposta. Sem BD, provider ou regra de negócio.
- Service: regra de negócio, persistência via repository/provider e integrações. Sem objetos HTTP; sem serialização de output.
- NestJS: controller, DTOs, Swagger, `PrismaService` injetado; nunca `PrismaClient` direto.
- Node.js: router, schema, serializer, factory DI; service não recebe `req`/`res`.
- Golang: handler, request/response structs, interfaces; service não recebe `http.Request`; `context.Context` primeiro parâmetro.
- Módulo dono manipula sua entidade; demais chamam seu service, nunca repositório alheio.
- Escritas multi-tabela em transação. Preferir guard clauses/early return e DI a dependência concreta.

#### 🔒 E — Error Handling & Type Safety

Pergunta-chave: *dado pode vazar? Input malformado corrompe? Auth está correta?*

- **DTOs (dto-standards)**: sempre **classe**, nunca interface. Input com sufixo `Input`, output com sufixo `Output`.
  - Input: `@ApiProperty` em cada campo, validação com class-validator, `@Type(() => Class)` em aninhados/listas, `@IsOptional()` em opcionais. Fora de controller, validar com `ValidatorHelper`.
  - Output: expor com `@ApiProperty`, esconder sensível com `@Exclude()`, `static getInstance` usando `plainToInstance`. Todo endpoint que retorna JSON usa output DTO.
- **Auth (auth-security)**: Basic Auth para endpoints internos (`@UseGuards(AuthGuard('basic'))` + `@ApiBasicAuth()`); JWT para BFF. Todo endpoint tem guard. JWT: payload só com identificação/permissão, sem dado aberto; nunca expor token.
- Validação de input **antes** de uso; payload inválido gera `InvalidPayloadError` (via DTO/`ValidatorHelper`), não erro genérico.
- TypeScript sem `any` implícito; `general-development`: usar `?.`/`??`, `const` por padrão, template literal em vez de concatenação.
- **Prisma/Postgres (prisma-postgres-standards)**: BD em `snake_case` mapeado para `camelCase` no code via `@map`/`@@map`; nunca montar SQL por concatenação (usar API do Prisma / queries parametrizadas); `deletedAt` para soft delete quando aplicável.
- Sem credencial hardcoded; segredos via `ConfigService`/env (company-standards: prefixos `DATABASE_`, `AUTH_`, etc.).
- Front: sem `dangerouslySetInnerHTML` com input de usuário (XSS).

### 3. Verificações incorporadas (o que uma análise estática pegaria)

Reportar apenas os que **de fato aparecem** — não listar o que passou.

**Bugs prováveis**
- Promise não-aguardada (fire-and-forget acidental).
- `catch` vazio / erro engolido (contradiz error-handling).
- Código morto ou inalcançável.
- `==` no lugar de `===`.
- Variável sombreada (shadowing).
- Chave de lista com índice de array (React) quando reordena.

**Segurança**
- Credencial/segredo hardcoded (deveria vir de env/ConfigService).
- SQL montado por concatenação (usar Prisma).
- XSS (`dangerouslySetInnerHTML`/`innerHTML` com input).
- Endpoint sem guard de auth.
- Token/PII em log (contradiz auth-security).

**Manutenibilidade**
- Função com complexidade alta → sugerir extração.
- Literal duplicado 3+ vezes → constante (`UPPER_SNAKE_CASE` se global).
- Ternário aninhado ilegível.
- Import/variável não utilizado.
- `TODO`/`FIXME` sem dono/contexto.

### 4. DRY, Clean Code e naming (padrão do time)

**DRY**
- Lógica duplicada (mesma validação, mapeamento ou query) em 2+ lugares → extrair. Preferir os helpers existentes (helpers.md) antes de criar novo: `ValidatorHelper`, `currency.helper`, `date.helper`, `case.helpers`, `paginated-response.helpers`, custom validators (`CustomIs...`), etc.
- Não sugerir abstração prematura: DRY é conhecimento duplicado, não linha parecida por acaso.

**Clean Code**
- Nomes revelam intenção; sem abreviação obscura.
- Função pequena, responsabilidade única; se o nome precisa de "and", faz duas coisas.
- Comentário explica o *porquê*, não o *o quê*; company-standards pede evitar comentário desnecessário.
- Sem número/string mágico — nomear constante.
- Aninhamento raso, early return.
- Sem parâmetro booleano que troca o comportamento da função.

**Naming (company-standards / general-development / folder-structure)**
- `camelCase`: variáveis, funções, enums.
- `PascalCase`: classes e componentes React.
- `UPPER_SNAKE_CASE`: constantes globais.
- `snake_case`: JSON de entrada/saída da API e query params.
- Arquivos e pastas em `kebab-case` com sufixo de tipo: `user-address.service.ts`, `create-user.input.ts`, `file.output.ts`, `auth.module.ts`.
- Prisma: model `PascalCase` singular; coluna `snake_case` mapeada para `camelCase`; tabela `snake_case` plural via `@@map`.

### 5. Montar os comentários pontuais

Para cada achado que sobrevive ao filtro de parcimônia, comentar ancorado no arquivo/linha:

```
[severidade] [pilar] Título curto

<o que ajustar>. <Por que — regra do time ou princípio>. <Impacto se não ajustar>.

<exemplo curto antes/depois, quando ajudar>
```

Severidades:
- 🔴 **Blocker** — muda antes do merge: bug, falha de segurança, endpoint sem guard, controller acessando BD, erro que não estende `BaseError`, 5xx vazando detalhe, Prisma instanciado direto, escrita multi-tabela sem transação. Inegociável.
- 🟡 **Sugestão relevante** — melhora clara de qualidade/aderência; idealmente endereçada.
- 🔵 **Nitpick** — estilo/preferência. Opcional. Condensar vários 🔵 num único comentário.

Exemplos bem-formados:

```
🔴 🏗️ G — Controller acessando o banco direto

Mover a query para o service. Pelo padrão controllers-services, o controller
é fino: valida input, chama o service e mapeia o output — quem lê/escreve no
BD é o service. Impacto: quebra a separação de camadas, dificulta teste e
reuso, e foge do fluxo canônico do monólito.

// antes (no controller)
const user = await this.prisma.user.findUnique({ where: { id } });
// depois
return UserOutput.getInstance(await this.userService.getById(id));
```

```
🔴 🔒 E — Erro de domínio não estende BaseError

Trocar o `throw new Error('user exists')` por uma classe que estende
`BaseError` (aqui, `DuplicatedEntityError`). O GlobalErrorFilter depende de
`getStatus()`/`getMessage()` para montar `{ id, code, message }`; um Error cru
cai no caminho 500 e vira "internal error". Impacto: status HTTP errado
(deveria ser 409) e mensagem perdida para o cliente.
```

```
🟡 🔒 E — Output sem DTO

Retornar via `UserOutput.getInstance(...)` em vez do objeto do Prisma. Pelo
dto-standards, todo endpoint que retorna JSON usa output DTO com `@Exclude`
nos campos sensíveis. Impacto: risco de vazar campo interno (ex.: hash de
senha, flags) e resposta sem contrato documentado no Swagger.
```

### 6. Resumo global do PR

Sempre entregar, independente dos comentários pontuais:

```markdown
## FORGE Review — Resumo Global

**Veredito:** ✅ Aprovado · ⚠️ Aprovado com ajustes · 🔴 Requer mudanças

### Scorecard

| Pilar | Status | Observação |
|---|:---:|---|
| 🔥 F — Flow Control & Async | ✅/⚠️/🔴 | <uma linha> |
| 👁️ O — Observability | ✅/⚠️/🔴 | <uma linha> |
| 🛡️ R — Resilience & Errors | ✅/⚠️/🔴 | <uma linha> |
| 🏗️ G — Guard Clauses & Arch | ✅/⚠️/🔴 | <uma linha> |
| 🔒 E — Error Handling & Types | ✅/⚠️/🔴 | <uma linha> |

### Bloqueadores 🔴

- <item, ou "Nenhum">

### Principais sugestões 🟡

- <top 2-3 sugestões, cada uma em uma linha>

### Aderência aos padrões

<resumo curto — quais standards foram seguidos bem e quais foram violados (citar o arquivo, ex.: controllers-services)>

### Pontos positivos

<o que foi bem feito, quando genuíno>

### Nota geral

<2-4 frases: está pronta? qual o tema recorrente dos ajustes? algum padrão que vale corrigir de uma vez em toda a PR?>
```

O resumo deve funcionar sozinho: quem ler só ele entende o estado da PR.

### 7. Ordem de apresentação

1. Resumo global primeiro.
2. Comentários pontuais agrupados por arquivo, ordenados por severidade (🔴 → 🟡 → 🔵).
3. Nitpicks 🔵 condensados no fim de cada arquivo (ou num bloco único), não espalhados.

## Checks

- Cada comentário tem **o quê + porquê + impacto** — nenhum "troque X por Y" seco; o *porquê* cita o padrão do time quando aplicável.
- Severidade marcada em todo comentário (🔴/🟡/🔵).
- Parcimônia respeitada: sem comentar o óbvio, sem repetir o mesmo ponto — apontar o padrão uma vez.
- 🔴 blockers são de fato bloqueadores (bug, segurança, camada quebrada, erro fora do BaseError, 5xx vazando, Prisma direto, falta de transação) — não inflar severidade de preferência.
- Os `standards/*` relevantes ao tipo de arquivo foram lidos e aplicados; divergência do repositório concreto tem precedência e foi sinalizada.
- Resumo global presente e auto-suficiente, com veredito, scorecard, bloqueadores, sugestões e aderência aos padrões.
- Tom colaborativo; pontos positivos citados quando genuínos.
- Nenhuma dependência de ferramenta externa assumida como executada — as verificações estáticas foram feitas pela leitura do código.