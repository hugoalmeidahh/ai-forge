# ai-forge · SPEC de Reorganização

> Baseado no FORGE code review como modelo de referência para estruturar skills, standards e padrões de time.
> Arquitetura orientada a **módulos por domínio de negócio** — o padrão NestJS serve de âncora e é traduzido para cada stack suportada (TypeScript/NestJS, JavaScript/Node, Golang).

---

## Problema Central

| Situação Atual | Impacto |
|---|---|
| Workflow e guardrails vivem **inline no README** | Projetos copiam o texto em vez de referenciar — desync garantido |
| Standards existem **só para NestJS** | Outras stacks (Node puro, Golang, frontend) começam do zero |
| Sem hierarquia de precedência | AI não sabe o que tem prioridade: regra da empresa vs stack vs projeto |
| O padrão modular (o maior ativo do repo) não está formalizado como conceito portável | Cada stack nova reinventaria a arquitetura em vez de traduzi-la |
| Skills escassas (create-pr, project-standards, upgrade-prisma-v7) | AI improvisa onde deveria seguir um workflow definido |

**Princípio chave:** A AI só é coerente com os padrões se eles estiverem organizados de forma que ela consiga carregá-los **seletivamente, na ordem certa, sem ambiguidade de precedência.**

O FORGE já faz isso: `lê standards/index.md → carrega só o relevante → aplica`. O objetivo é generalizar esse padrão para toda a base.

---

## Arquitetura por Módulos — O Padrão Central

O padrão de organização por **módulos de domínio de negócio** é o núcleo desta estrutura. Nasceu no NestJS (como documentado hoje em `backend-nestjs/standards/folder-structure.md` e `controllers-services.md`), mas os conceitos são portáveis para qualquer stack. Este padrão vira o arquivo `core/module-architecture.md` — a referência agnóstica de stack.

### Conceito: Módulo de Domínio

Um módulo agrupa tudo que pertence a um contexto de negócio (ex: `user`, `purchase`, `notification`). Regras de formação:

- Um módulo por tabela independente (ex: `action-log`)
- Tabelas satélites de uma entidade principal (`users`, `user_emails`, `user_addresses`) → um único módulo principal (`user`)
- **Regra de ouro:** só o módulo dono manipula sua entidade diretamente. Outros módulos chamam o service do dono, nunca acessam o repositório alheio.

**Fluxo canônico:**
```
Request → Controller → Service → Repository/Provider → Service → Controller → DTO Output → Response
```

**Responsabilidades por camada (agnóstico de stack):**

| Camada | Faz | Nunca faz |
|---|---|---|
| Controller / Handler / Router | Rota, auth, contrato input/output, docs | Lógica de negócio, acesso a BD, validação manual |
| Service | Lógica de negócio, leitura/escrita BD, integração externa | Definir rota/auth, usar output DTO |
| Input (DTO/Schema/Struct) | Validar e transformar entrada | Regra de negócio |
| Output (DTO/Serializer/Struct) | Contrato de resposta, ocultar campos sensíveis | Lógica de negócio |
| Error | Erro de domínio tipado com status + code + message | Lógica de negócio |
| Repository/Provider | Acesso a BD e infraestrutura externa | Regra de negócio |

**Módulos vs Providers:**
- `modules/` — domínios de negócio (contêm controllers, services, dtos)
- `providers/` — infraestrutura (BD, AWS, mensageria) — sem controllers, sem dtos

**Contrato de erro universal (toda stack implementa):**
```json
{ "id": "<x-request-id ou uuid>", "code": "entity_not_found", "message": "..." }
```
- `code` derivado do nome do erro em snake_case
- 5xx nunca vaza detalhe: log completo no servidor, cliente recebe `{ "code": "internal_error", "message": "internal error" }`
- Erros padrão: `DuplicatedEntityError` (409), `EntityNotFoundError` (404), `InternalProviderError` (502), `InvalidPayloadError` (400)

---

## Adaptação Multi-Stack

O mesmo modelo de módulos é traduzido para cada stack. Os **conceitos são idênticos**; o que muda é a sintaxe, o tooling e os idiomas da linguagem. Cada stack vira um diretório próprio com `standards/` e `skills/`.

### Stack 1 · TypeScript / NestJS — `backend-nestjs/` (referência, já existe)

**Tooling:** NestJS, Prisma, Pino, class-validator, class-transformer, Swagger, Passport

```
src/modules/user/
├── controllers/
│   └── user.controller.ts        # @Controller, @Get/@Post, guards, Swagger
├── services/
│   ├── user.service.ts           # @Injectable, lógica de negócio
│   └── user-address.service.ts   # service por sub-contexto, não por endpoint
├── dtos/
│   ├── create-user.input.ts      # class-validator + @ApiProperty
│   └── user.output.ts            # @Exclude sensíveis + static getInstance
├── errors/
│   └── user-not-found.error.ts   # extends BaseError { httpCode; message }
├── interfaces/
│   └── user-filter.interface.ts
├── listeners/                    # event handlers (opcional)
└── user.module.ts
```

**Padrões específicos:**
- Services por contexto: `UserService`, `UserAddressService` — nunca `CreateUserService`
- Erros estendem `BaseError` → fluem pelo `GlobalErrorFilter`
- `PrismaService` injetado — nunca instanciar `PrismaClient` direto
- API: `snake_case` (auto-transform via `BodyQueryTransformPipe` / `ResponseTransformInterceptor`); código: `camelCase`
- Arquivos: `kebab-case` + sufixo de tipo (`user-address.service.ts`, `create-user.input.ts`)

---

### Stack 2 · JavaScript / Node.js (Fastify) — `backend-node/`

Sem IoC container nativo — DI manual via factory functions ou container leve (awilix, tsyringe).

```
src/modules/user/
├── user.router.js         # routes — equivalente ao controller (thin)
├── user.service.js        # lógica de negócio
├── user.repository.js     # acesso ao BD (Knex, Drizzle, Sequelize)
├── user.schema.js         # validação de input (Zod, Joi)
├── user.serializer.js     # output — omite campos sensíveis
└── user.errors.js         # erros de domínio com statusCode + code
```

**Mapa de equivalência:**

| NestJS | Node.js/Fastify |
|---|---|
| `@Controller` | `router.get/post(...)` thin — sem lógica |
| `@Injectable` Service | service injetado via factory function |
| DTO Input + class-validator | Zod schema com `.parse()` |
| DTO Output + `@Exclude` | serializer antes de `res.json()` |
| `BaseError` + `GlobalErrorFilter` | `AppError` + middleware de erro global |
| `PrismaService` injetado | cliente de BD único, injetado via factory |
| `ActionLogService` | hook de log de ação pós-commit |

**Error middleware global (equivalente ao GlobalErrorFilter):**
```js
app.use((err, req, res, next) => {
  const id = req.headers['x-request-id'] ?? uuid();
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ id, code: err.code, message: err.message });
  }
  logger.error({ err, id });
  res.status(500).json({ id, code: 'internal_error', message: 'internal error' });
});
```

**Regras de ouro:**
- Router é thin: valida schema, chama service, serializa output — nada mais
- Service não conhece `req`/`res`
- Erros de domínio sempre instância de `AppError` com `statusCode` e `code`

---

### Stack 3 · Golang — `backend-golang/` (novo)

Go não tem classes nem IoC — o padrão é **interfaces + structs + injeção via construtor**. Pacote por domínio em `internal/`.

```
internal/
└── user/
    ├── handler.go         # HTTP handler — equivalente ao controller (thin)
    ├── service.go         # interface + impl de lógica de negócio
    ├── repository.go      # interface + impl de acesso ao BD (sqlc/GORM)
    ├── dto.go             # structs de request/response com json tags
    ├── errors.go          # erros de domínio com StatusCode
    └── module.go          # wire: instancia deps e retorna handler
```

**Mapa de equivalência:**

| NestJS | Golang |
|---|---|
| `@Controller` | `handler.go` — thin, decode → valida → service → encode |
| `@Injectable` Service | `type UserService interface` + `userServiceImpl struct` |
| Repository via Prisma | `type UserRepository interface` + impl `database/sql`/sqlc/GORM |
| DTO Input + class-validator | struct + go-playground/validator |
| DTO Output + `@Exclude` | struct de response separado — nunca expor struct do BD |
| `BaseError` | `AppError struct { StatusCode; Code; Message }` |
| `GlobalErrorFilter` | middleware ou helper `writeError()` |

```go
type UserService interface {
    GetByID(ctx context.Context, id int64) (*User, error)
    Create(ctx context.Context, input CreateUserInput) (*User, error)
}

type AppError struct {
    StatusCode int    `json:"-"`
    Code       string `json:"code"`
    Message    string `json:"message"`
}
func (e *AppError) Error() string { return e.Message }
```

**Regras de ouro:**
- Handler sem lógica; service sem `http.Request`
- Repository é interface — mock em testes, troca de impl
- Erros tipados `*AppError`, nunca `errors.New("...")` solto
- JSON `snake_case` via tags; naming Go idiomático (PascalCase exportado, camelCase privado)
- Pacote por domínio — nunca `internal/controllers/`, `internal/services/` (anti-pattern em Go)

---

## Estrutura Proposta do Repositório

```
@hugoalmeidahh/ai-forge/
├── core/                             # fundação cross-team (EXPANDIR)
│   ├── workflow.md                   # 5 passos antes de qualquer task (extraído do README)
│   ├── guardrails.md                 # regras absolutas — secrets, env (extraído do README)
│   ├── module-architecture.md        # ← O PADRÃO CENTRAL, agnóstico de stack (NOVO)
│   ├── code-review/                  # FORGE — modelo de skill a seguir ✅
│   ├── create-skill/                 # ✅
│   ├── create-pr/                    # ✅
│   └── project-init/                 # NOVO — gera CLAUDE.md/AGENTS.md correto
│
├── standards/                        # L0 company-wide (NOVO)
│   ├── index.md                      # leia primeiro — decide o que carregar
│   ├── naming.md
│   ├── git.md
│   ├── security.md
│   ├── observability.md
│   └── testing.md
│
├── backend-nestjs/                   # TypeScript + NestJS
│   ├── SKILLS.md
│   ├── standards/                    # L2 — herda L0 + module-architecture
│   │   ├── index.md
│   │   ├── project-patterns.md
│   │   ├── controllers-services.md
│   │   ├── dto-standards.md
│   │   ├── error-handling.md
│   │   ├── auth-security.md
│   │   ├── prisma-postgres-standards.md
│   │   ├── helpers.md
│   │   └── folder-structure.md
│   └── skills/
│       ├── project-standards/
│       ├── new-module/               # NOVO — scaffolda módulo completo
│       ├── new-migration/            # NOVO
│       └── upgrade-prisma-v7/
│
├── backend-node/                     # JS/TS + Fastify
│   ├── SKILLS.md
│   ├── standards/                    # L2 — herda L0 + module-architecture
│   │   ├── index.md
│   │   ├── project-patterns.md
│   │   ├── router-service.md
│   │   ├── validation-serialization.md
│   │   └── error-handling.md
│   └── skills/
│       ├── project-standards/
│       └── new-module/
│
├── backend-golang/                   # Golang (NOVO)
│   ├── SKILLS.md
│   ├── standards/                    # L2 — herda L0 + module-architecture
│   │   ├── index.md
│   │   ├── project-patterns.md
│   │   ├── handler-service-repository.md
│   │   ├── dto-structs.md
│   │   └── error-handling.md
│   └── skills/
│       ├── project-standards/
│       └── new-module/
│
├── frontend-react/                   # React + TypeScript
├── frontend-vue/                     # Vue 3 + TypeScript
│
├── template-team/                    # boilerplate para nova stack/time
├── CHANGELOG.md                       # breaking changes e releases
├── core_ai_prompts/                  # Python path helper (inalterado)
├── package.json
└── pyproject.toml
```

### Por que separar `backend-nestjs/`, `backend-node/`, `backend-golang/`?

Cada stack tem **tooling, idiomas e padrões irredutíveis diferentes**. Misturar num `backend/` genérico forçaria a AI a adivinhar qual regra se aplica. Stacks separadas → `index.md` claro → AI carrega só o relevante. O que é comum entre elas vive em `core/module-architecture.md` e `standards/` (L0) — sem duplicação.

---

## Hierarquia de Standards — 4 Layers

A AI carrega os layers em ordem crescente de precedência. **L3 sempre vence.**

### L0 · Company-wide — `standards/` + `core/module-architecture.md`
Regras absolutas para todas as stacks.

- Arquitetura modular por domínio (module-architecture.md)
- Naming: `camelCase` variáveis/funções, `PascalCase` classes/tipos, `UPPER_SNAKE_CASE` constantes, `snake_case` JSON APIs, `kebab-case` arquivos (exceto Go, que segue idioma próprio)
- Git: formato de commit, branch naming
- Segurança: sem secrets hardcoded, env vars com prefixos por domínio (`DATABASE_`, `AUTH_`, `AWS_`)
- Observability: logging estruturado, sem PII em log, request-id de correlação
- Contrato de erro universal `{ id, code, message }`

### L2 · Language + stack-specific �� `<stack>/standards/`
Herda L0. Regras da linguagem e tradução do padrão modular para o framework vivem juntas no diretório da stack.

- **TypeScript/NestJS:** strict mode, sem `any`, `const` por padrão, template literals
- **JavaScript/Node:** ESM, sem `var`, optional chaining
- **Golang:** interfaces pequenas, `error` como retorno (não panic), `context.Context` como 1º parâmetro.

- **backend-nestjs:** Controller→Service flow, `BaseError`/`GlobalErrorFilter`, DTOs Input/Output, `PrismaService`
- **backend-node:** router thin, Zod schemas, serializers, `AppError` + error middleware
- **backend-golang:** handler/service/repository interfaces, `AppError` struct, pacote por domínio

### L3 · Project-specific — `CLAUDE.md` / `AGENTS.md` do projeto
Overrides pontuais com precedência máxima. Divergências devem ser justificadas.

---

## Como a AI Usa os Layers

Ao iniciar uma task num projeto **Golang**, por exemplo:

```
1. Lê core/workflow.md + core/guardrails.md            (comportamento base)
2. Lê core/module-architecture.md                      (padrão modular universal)
3. Lê standards/index.md                               (L0 — carrega relevantes)
4. Lê backend-golang/standards/index.md                (L2 — carrega por tipo de arquivo)
5. Lê CLAUDE.md do projeto                             (L3 — overrides com precedência)
```

Resultado: AI cria um módulo Go com a **mesma arquitetura** de um módulo NestJS — handler thin, service com a lógica, repository isolado, erro tipado, contrato `{ id, code, message }` — usando os idiomas nativos de Go.

---

## Catálogo de Skills

### Core (cross-stack)

| Skill | Descrição | Status |
|---|---|:---:|
| `forge-code-review` | FORGE 5-pilares — review de PR | ✅ existe |
| `create-skill` | Cria nova skill no projeto | ✅ existe |
| `create-pr` | Abre PR via Git REST API | ✅ existe |
| `project-init` | Gera CLAUDE.md/AGENTS.md com config da stack correta | 🆕 novo |
| `onboarding-check` | Valida se projeto tem config mínima de AI | 🆕 novo |

### backend-nestjs

| Skill | Descrição | Status |
|---|---|:---:|
| `project-standards` | Aplica padrões ao escrever código NestJS | ✅ existe |
| `upgrade-prisma-v7` | Migra Prisma para v7 | ✅ existe |
| `new-module` | Scaffolda módulo completo (controller + service + dtos + errors + module) | 🆕 novo |
| `new-migration` | Cria migration com naming Prisma correto | 🆕 novo |

### backend-node

| Skill | Descrição | Status |
|---|---|:---:|
| `project-standards` | Aplica padrões ao escrever código Fastify | 🆕 novo |
| `new-module` | Scaffolda módulo (router + service + repository + schema + serializer + errors) | 🆕 novo |

### backend-golang

| Skill | Descrição | Status |
|---|---|:---:|
| `project-standards` | Aplica padrões ao escrever código Go | 🆕 novo |
| `new-module` | Scaffolda pacote de domínio (handler + service + repository + dto + errors) | 🆕 novo |

> A skill `new-module` existe em **todas** as stacks — mesmo conceito, template diferente. É a materialização do padrão modular: a AI scaffolda a estrutura inteira correta de uma vez, em qualquer linguagem.

### Anatomia de uma Skill (padrão FORGE)

```markdown
---
name: <skill-name>
description: <uma linha>
user-invocable: true|false
---

# <Skill Name>

## Intent
## When To Use
## References        ← carregar só o relevante, não tudo
## Workflow          ← passos numerados, acionáveis
## Checks            ← lista de verificação ao final
```

---

## Roadmap de Implementação

### Fase 1 · Fundação Core — Prioridade Alta

- [x] Extrair workflow + guardrails do README → `core/workflow.md` + `core/guardrails.md`
- [x] Escrever `core/module-architecture.md` — o padrão modular agnóstico de stack
- [x] Criar `standards/` L0: `naming.md`, `git.md`, `security.md`, `observability.md`, `testing.md` + `index.md`
- [x] Renomear `backend/` → `backend-nestjs/` e ajustar paths
- [x] Skill `core/project-init/` — gera CLAUDE.md/AGENTS.md com a config da stack

### Fase 2 · NestJS Consolidado — Prioridade Alta

- [x] Skill `new-module` — scaffolda módulo NestJS completo
- [x] Skill `new-migration` — migration com naming Prisma correto
- [x] Separar L0 em `standards/`; manter regras específicas em L2

### Fase 3 · Novas Stacks Backend — Prioridade Alta

- [x] Criar `backend-node/` — standards (router-service, validation-serialization, error-handling)
- [x] Criar `backend-golang/` — standards (handler-service-repository, dto-structs, error-handling)
- [x] Skill `new-module` para cada stack nova
- [x] Skill `project-standards` para cada stack nova
- [x] Atualizar FORGE para reconhecer NestJS, Node.js e Golang

### Fase 4 · Frontend + Governança — Prioridade Média

- [x] Criar `frontend-react/` e `frontend-vue/` com standards de módulos, API/state e UI
- [x] Skill `onboarding-check` — valida config mínima do projeto consumidor
- [x] `CHANGELOG.md` de breaking changes nos standards
- [x] Guia de contribuição — criar stack via `template-team/` (README)

---

## Quick Win Imediato

**Extrair workflow + guardrails do README → `core/` e formalizar o padrão modular.**

```
README.md (bloco "## Workflow")   → core/workflow.md
README.md (bloco "## Guardrails") → core/guardrails.md
folder-structure + controllers-services (conceitos) → core/module-architecture.md
```

Custo: ~1h. Ganho imediato: projetos referenciam os arquivos diretamente no `CLAUDE.md` — sem copiar texto, sem desync — e o padrão modular fica pronto para ser traduzido às novas stacks.

```markdown
# No CLAUDE.md do projeto consumidor:
## Workflow
See: node_modules/@hugoalmeidahh/ai-forge/core/workflow.md

## Guardrails
See: node_modules/@hugoalmeidahh/ai-forge/core/guardrails.md

## Architecture
See: node_modules/@hugoalmeidahh/ai-forge/core/module-architecture.md
```

---

## Referências

- `core/code-review/SKILL.md` — FORGE, modelo de skill de referência
- `backend-nestjs/standards/folder-structure.md` — origem do padrão modular (NestJS)
- `backend-nestjs/standards/controllers-services.md` — origem do fluxo canônico
- `backend-nestjs/standards/index.md` — exemplo de index de standards
- `backend-nestjs/SKILLS.md` — exemplo de índice de skills
- `README.md` — instalação e configuração nos projetos consumidores
