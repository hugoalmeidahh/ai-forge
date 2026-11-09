# React

Autoridade L2 quando disponível: `ai-forge-frontend-react-project-standards`. As regras do projeto prevalecem. Documentação: [react.dev](https://react.dev/).

- Componentes funcionais, props tipadas e composição. Preserve a configuração e convenções de nomes do projeto.
- Hook contém orquestração; serviço contém transporte/mapeamento. No FORGE, use TanStack Query para cache remoto e React Hook Form/Zod nos formulários conforme contrato existente.
- Estado calculado é derivado durante render; efeito sincroniza recurso externo. Não copie props para estado nem use efeito para encadear regras que pertencem ao evento.
- Memoização exige necessidade identificável. `useMemo(() => value, [value])` só devolve a referência original e não é uma otimização útil. Considere também compilador/ferramentas que o projeto realmente usa.
- Chaves de listas representam identidade estável; índice não é identidade quando há inserção, remoção ou ordenação com estado por linha.
- Divida rotas/componentes pesados quando necessário; fallback deve preservar contexto e comunicar atividade. Falha de carregamento também tem recuperação.
- Labels e descrições usam IDs estáveis; modais e controles complexos reutilizam primitivas existentes. Confira foco após mutações/navegação.
- Teste a interação observável com o runner do projeto. Não migre Vite, router, estado ou estilo para concluir uma tela.

Se for Next.js, leia também a referência do meta-framework: servidor, cache e renderização não são uma SPA genérica.
