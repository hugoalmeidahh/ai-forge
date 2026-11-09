# Nuxt

Leia também Vue. Documentação: [nuxt.com/docs](https://nuxt.com/docs).

- Detecte major, estrutura de diretórios e módulos instalados. Preserve auto-imports, router e conventions que o projeto realmente usa.
- Dados do render inicial usam mecanismos SSR-aware (`useAsyncData`, `useFetch` ou convenção equivalente da versão) com serviço/contrato de domínio apropriado; evite repetir no cliente o fetch já feito no servidor.
- Estado por requisição não pode vazar por singleton compartilhado no servidor. Configure cache e chaves segundo escopo e personalização.
- Browser APIs ficam em contexto cliente; conteúdo importante não deve depender de `onMounted` sem motivo.
- Vue Query é útil no cache interativo quando esse for o padrão FORGE do projeto. Não force duplicação com dados SSR e mecanismos Nuxt; escolha um dono e uma estratégia de hidratação.
- Renderização por rota e hidratação diferida dependem de versão/adaptador. Não aplique presets sem verificar suporte do deploy.
- Use módulo de imagens/fontes quando disponível e compatível; não instale só para obedecer a uma proibição genérica de `<img>`.
- Confira SSR, hidratação sem mismatch, navegação, falhas de dados e build com adaptador de destino quando possível.
