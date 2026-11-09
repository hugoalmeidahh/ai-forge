# Angular

Documentação por versão: [angular.dev](https://angular.dev/).

- Detecte major e convenções locais antes de escolher standalone, módulos, control flow, signals ou estratégia de detecção. Não migre uma feature inteira para sintaxe nova incidentalmente.
- Componentes apresentam; serviços de domínio e providers apropriados concentram contratos e transporte. Preserve DI e HttpClient do projeto.
- Estado local/derivado usa mecanismos suportados. Signals e RxJS têm papéis diferentes; streams assíncronos não precisam ser transformados em múltiplas cópias de estado.
- Cleanup, cancelamento de busca e ciclos de vida precisam impedir inscrições vazadas e respostas antigas. Use utilitários compatíveis com a versão.
- Formulários seguem biblioteca e modelo do projeto, com validação acessível e erros do servidor mapeados ao domínio.
- Reutilize CDK/a11y ou primitivas maduras quando disponíveis para foco e overlays. UI library não garante rótulos e ordem de foco da tela final.
- Lazy routing, deferred views e otimização de imagens dependem de suporte e custo real. Não aplique um recurso novo só porque aparece no catálogo.
- Rode build/checks do projeto e teste o fluxo com seu runner. Não imponha sufixos de arquivo, runner ou mudança de DI quando L3 já define outro padrão.
