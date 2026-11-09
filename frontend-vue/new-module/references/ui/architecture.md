# Arquitetura frontend

## Domínio e fronteiras

O módulo representa uma capacidade de negócio, não uma categoria de arquivo nem uma cópia de cada tabela do banco. A página compõe o caso de uso; o componente apresenta e recebe ações; hook/composable organiza estado e interação; serviço/adaptador contém contratos e transporte. Componentes de domínio ficam no domínio. Promova para `shared` quando houver reutilização real e semântica estável.

```text
src/
  modules/<domain>/
    components/
    pages/            # quando o router não define outro lugar
    hooks/            # React; composables/ em Vue
    services/
    schemas/
    types/
    index.ts          # API pública intencional
  shared/
    api/
    components/
    utils/
```

Esta árvore é uma tradução FORGE de referência. Preserve rotas e convenções do framework, sobretudo `app/`, `pages/`, `routes/`, server loaders e ilhas. Não reorganize um projeto funcional só para igualar a árvore.

## Dono do estado

| Informação | Dono preferido |
|---|---|
| Busca, filtros, ordenação e página compartilháveis | URL/router, com parsing e defaults |
| Resultado remoto e invalidação | Cache de servidor ou mecanismo de dados do framework |
| Campo em edição e validação | Estado/biblioteca de formulário do projeto |
| Abrir menu, aba temporária, expansão local | Componente ou ancestral necessário |
| Preferência compartilhada exclusivamente do cliente | Store/context conforme L2 |
| Valor calculado a partir de outro | Derivação; evitar segunda cópia sincronizada |

No FORGE React, TanStack Query gerencia cache remoto; React Hook Form e Zod seguem o padrão da stack. No FORGE Vue, Vue Query gerencia cache e Pinia o estado compartilhado do cliente. Não duplique respostas em stores. Em meta-frameworks, separe cache client-side dos dados e do ciclo de revalidação do servidor; não force duas requisições para o mesmo conteúdo.

## API e segurança

- Um client compartilhado centraliza configuração de transporte e normalização de erros; serviços de domínio definem endpoints e mapeamentos. Widgets visuais não conhecem URLs de API.
- Valide fronteiras não confiáveis conforme risco e contrato; tipos TypeScript não validam JSON em runtime. Mapeie DTO → modelo de visualização quando a forma ou semântica diferir.
- No contrato FORGE, payloads usam `snake_case`, código interno segue a linguagem e erros usam `{ id, code, message }`. Não altere API existente para satisfazer esta skill. Mostre mensagem segura e retenha correlação quando útil.
- Cancelamento ou descarte de respostas antigas evita busca fora de ordem. Query key inclui filtros, página e escopo de conta/tenant relevantes. Limpe estado/cache pertinente ao mudar sessão ou tenant.
- Mutações invalidam apenas dados relacionados. Retry automático exige operação segura/idempotente; ações financeiras, publicação e exclusão não recebem retry cego.
- Autorização é garantida no servidor. Ocultar um botão melhora experiência, mas não protege endpoint. Não exponha tokens, segredos, erros internos ou dados pessoais em bundle, URL, logs ou captura de QA.
- O padrão de sessão e armazenamento pertence ao projeto. Não introduza persistência de credenciais no navegador por conveniência.

## Componentes e manutenção

API pequena, props tipadas, slots/composição quando evitam combinações booleanas inválidas. Expresse estados mutuamente exclusivos por uniões quando isso impedir bugs. Evite abstrações antecipadas e um componente universal com dezenas de flags.

Efeitos sincronizam sistemas externos; valores derivados não precisam de efeitos. Limpe listeners, subscriptions e timers. Só memoize ou virtualize com justificativa de custo e volume; preservar seleção, foco e leitura assistiva faz parte da implementação.

Use scripts e gerenciador declarados no repositório e seu lockfile. Não execute `init` de bibliotecas num projeto existente sem avaliar o diff gerado. Não substitua configurações L3 ou acrescente regras globais em `AGENTS.md` para concluir uma tarefa local.
