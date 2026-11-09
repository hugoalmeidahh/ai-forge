# HTML, CSS e JavaScript

Referência da plataforma: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web).

- Semântica HTML e melhoria progressiva primeiro. Links funcionam como links e formulários têm fluxo real de envio, quando o produto permitir.
- CSS segue a convenção existente com escopo e especificidade previsíveis. Tokens semânticos evitam valores divergentes por tela; não acrescente um framework por hábito.
- Grid/flex e constraints de conteúdo permitem reflow; medidas fixas que cortam conteúdo não são solução de responsividade. Use propriedades lógicas quando direção/locale do produto exigirem.
- Em aplicações com JS, separe apresentação, estado e transporte em módulos adequados ao porte. Um site estático pequeno não exige camadas artificiais.
- Eventos têm cleanup e controles refletem pendência/erro. Validação nativa ajuda, mas não substitui regra de negócio/servidor.
- Imagens reservam proporção, têm alternativa adequada e carregamento conforme prioridade. Scripts não críticos não devem bloquear conteúdo útil.
- Não desabilite zoom nem implemente controles complexos com `div` sem a interação necessária.
- Verifique a página servida por HTTP e sua funcionalidade real; abrir arquivo local pode esconder ou causar diferenças de módulos, rotas e CORS.
