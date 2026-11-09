# Arquitetura e organização das skills AI Forge

O AI Forge reúne 45 skills instaláveis e 11 stacks. O template de autoria é distribuído para criar novas stacks, mas fica fora da descoberta e da instalação.

## Base e precedência

Os padrões compartilhados do AI Forge definem clean code, organização por domínio, segurança, observabilidade e verificação. Cada stack traduz esses contratos com mecanismos nativos; as regras L3 do projeto prevalecem sobre L2 e L0. Instruções do usuário e do runtime continuam válidas.

| Camada | Diretório | Responsabilidade |
|---|---|---|
| L0 | `standards/` | Regras compartilhadas de desenvolvimento e verificação |
| Core | `core/` | Arquitetura, workflow, revisão FORGE, planejamento, escrita e entrega |
| L2 | `backend-*` / `frontend-*` | Contratos e procedimentos da tecnologia |
| Interface | `frontend/` / `design/` | UX, acessibilidade, performance, identidade e componentes |
| Qualidade | `quality/` | Verificação web e Android com evidências |
| Integração | `integrations/` | MCP, APIs LLM e agendamento com limites e recuperação |
| Artefatos | `artifacts/` | Documentos, planilhas, slides e PDF com ferramentas reais |
| L3 | Projeto consumidor | Convenções, decisões, contratos e escopo específicos |

## Nomes e descoberta

Use `ai-forge-<área>-<tecnologia-ou-finalidade>-<ação>`, omitindo segmentos redundantes. Os diretórios instalados usam o ID completo; o repositório usa `<escopo>/<finalidade>/SKILL.md`.

`forge skills` descobre as capacidades. `forge context --skill <id>` lista os arquivos necessários; não executa a tarefa. Nomes completos evitam ambiguidade. Core, design e artefatos não exigem uma stack artificial para começar.

## Responsabilidades e composição

- Storytelling estrutura resultado, evidências, regras e riscos; discovery aprofunda produto, arquitetura e backlog quando necessário.
- Módulos agrupam capacidades de negócio com dono definido. Rotas, apresentação, orquestração e infraestrutura mantêm fronteiras compatíveis com a stack.
- UX e design complementam a implementação com estados reais, legibilidade, acessibilidade e consistência; aparência não comprova comportamento.
- QA e revisão verificam contratos e impacto. A revisão conserva os cinco pilares FORGE sem impor regras de uma stack a outra.
- Integrações e artefatos identificam ferramentas e permissões disponíveis antes de prometer execução. Ausências e verificações não executadas são declaradas.
- Tarefas pequenas usam um fluxo proporcional. Criar um plano, card ou documento não autoriza iniciar agentes ou publicar resultados.

## Portabilidade e manutenção

As referências operacionais apontam para padrões e capacidades do AI Forge. Referências locais e helpers acompanham a skill quando necessários. Bibliotecas de implementação mantêm seus contratos e avisos de licença próprios.

`forge sync-references` detecta divergências nas cópias dos standards canônicos; `--write` sincroniza esses arquivos. Referências curadas de interface e dados de pesquisa não são sobrescritos por esse processo.

A instalação por cópia compara toda a árvore antes de declarar uma skill inalterada. A pesquisa local de interface usa `scripts/research.py` da skill de frontend, com resultados subordinados aos padrões do AI Forge e ao contexto do projeto.

O [overview](skills-overview.md) descreve cada skill e seu acesso. Consulte as [verificações registradas](validation.md) para os checks efetivamente realizados. Avisos de autoria e licença ficam em arquivos próprios de atribuição, separados das instruções de trabalho.
