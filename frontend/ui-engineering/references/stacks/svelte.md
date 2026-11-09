# Svelte e SvelteKit

Documentação: [svelte.dev/docs](https://svelte.dev/docs).

- Diferencie Svelte isolado de SvelteKit e detecte major. Recursos de runes não devem ser impostos a código legado sem migração solicitada.
- Use derivação nativa para valores calculados; efeitos sincronizam recursos externos. Preserve convenções de stores/runes e cleanup suportadas.
- Em SvelteKit, `load`, ações e endpoints seguem fronteiras server/client e convenções da versão. Autorização e segredos são responsabilidade server-side.
- Serviço/adaptador guarda contrato de domínio e transporte; componente não conhece detalhes de infraestrutura.
- Estado mutável compartilhado em processo de servidor não pode misturar usuários. Serialização e hidratação devem carregar apenas dados necessários e permitidos.
- Resolva warnings de acessibilidade pertinentes; exceções precisam de justificativa de comportamento equivalente, não apenas silenciar compilador.
- Prerender, SSR e client rendering são escolhas por rota/necessidade. Use otimização de imagens se a integração estiver disponível e fizer sentido.
- Teste rota profunda, navegação, falhas de ação e estados de formulário no runtime real. Não aplique arquivos `+page` a um projeto sem SvelteKit.
