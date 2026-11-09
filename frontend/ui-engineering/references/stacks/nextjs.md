# Next.js

Leia também React. Documentação por versão: [nextjs.org/docs](https://nextjs.org/docs).

- Detecte App Router versus Pages Router e mantenha a estratégia do projeto. Não introduza convenções do outro router por copiar um exemplo.
- No App Router, preserve a fronteira server/client: interatividade e APIs do navegador exigem cliente; credenciais, acesso privilegiado e decisões de autorização ficam no servidor. Coloque fronteiras de cliente no escopo necessário.
- Camadas server-side consultam serviços/adapters próximos do dado. Em cliente, hooks/query cache cuidam da interação quando necessários. Não crie uma chamada HTTP interna artificial para reutilizar uma função de servidor.
- Cache, revalidação, cookies e parâmetros assíncronos mudam entre versões. Verifique a major e a documentação; configure intenção explicitamente e não presuma cache por padrão.
- Dados personalizados exigem isolamento de usuário/tenant. Não compartilhe cache de conteúdo privado indevidamente.
- Use mecanismos de imagem, fonte e script da stack quando adequados e já integrados. A API de prioridade/preload varia; não aplique uma prop legada universalmente.
- Loading, erro e ausência de recurso devem manter o contexto da rota e permitir recuperação. Adapte boundaries ao fluxo real, não crie arquivos vazios em todos os segmentos.
- Valide links profundos, transições, refresh, build de produção e falhas pertinentes. Um teste client-only não valida automaticamente Server Components ou ações no servidor.
