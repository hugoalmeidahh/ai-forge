---
name: create-pr
description: Criar Pull Requests via Git REST API a partir do diff da branch atual, com titulo e corpo em portugues brasileiro, seguindo um template fixo.
user-invocable: true
---

# Create PR

## Intent

Abrir Pull Request(s) via Git REST API com título técnico e descrição objetiva em português brasileiro, baseados exclusivamente no diff da branch atual contra o(s) destino(s) solicitados.

## When To Use

- Usuário pede para "abrir PR", "criar PR", "open PR", "gerar PR", "subir PR"
- Usuário pede para gerar descrição de PR
- Usuário menciona branch destino (main, staging) e quer criar um pull request

## Workflow

### 1. Coletar contexto do repo

1. Identificar a branch atual com git.
2. Determinar as branch(es) de destino conforme o pedido do usuario:
   - Apenas main → um PR para main.
   - Apenas staging → um PR para staging.
   - main e staging (qualquer ordem) → dois PRs idênticos: atual → main e atual → staging.
   - Nenhuma mencionada → usar main.
3. Para cada destino, gerar o diff da branch atual contra o destino com git e basear todo o conteúdo do PR **exclusivamente** nesse diff.

### 2. Gerar título e descrição

1. Escrever título curto, técnico, direto, sem termos promocionais.
2. Escrever descrição curta, objetiva e técnica em português brasileiro.
3. Usar apenas informação confirmada pelo diff; não inventar contexto, motivação ou mudanças.
4. Usar inline code apenas quando necessário (endpoints, variáveis, entidades técnicas).

### 3. Template obrigatório

Ler o template do repositório de destino: `.github/pull_request_template.md` ou, em projetos GitLab, `.gitlab/merge_request_templates/default.md`. Usar seu conteúdo exato como `--body`.
Preencher os placeholders entre colchetes com informações extraídas exclusivamente do diff.
Seções marcadas com "omita a seção se não houver" devem ser removidas por completo quando não aplicáveis.

### 4. Abrir PR via Git REST API

**Não usar `gh pr create` nem `gh pr edit`** — esses comandos acionam GraphQL que emite erro de depreciação de Projects (classic).

Usar exclusivamente a API REST:

- Criar PR:
  ```
  gh api repos/:owner/:repo/pulls --method POST \
    --field title="..." \
    --field body="..." \
    --field head="<branch-atual>" \
    --field base="<destino>" \
    --jq '.html_url'
  ```

- Editar PR existente:
  ```
  gh api repos/:owner/:repo/pulls/<number> --method PATCH \
    --field title="..." \
    --field body="..." \
    --jq '.html_url'
  ```

### 5. Adicionar assignee @me (obrigatório)

Após criar cada PR, adicionar o usuário autenticado como assignee:

```
gh api repos/:owner/:repo/issues/<number>/assignees --method POST \
  --field assignees[]="@me" \
  --jq '.assignees[].login'
```

> A API REST de pulls não aceita `assignees` diretamente — usar o endpoint de issues com o mesmo número do PR.

## Checks

- Não criar arquivos intermediários.
- Não solicitar confirmação adicional.
- Não produzir texto fora do template ao responder o usuario.
- Verificar que a URL do PR foi retornada com sucesso antes de encerrar.
