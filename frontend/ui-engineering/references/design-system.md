# Design system

## Reutilizar antes de criar

Localize componentes, tokens e documentação já usados. Preserve as convenções de CSS, Tailwind, CSS Modules, CSS-in-JS ou biblioteca existente. Verifique a versão instalada antes de usar APIs e configurações: não misture sintaxes de majors diferentes.

Um design system combina decisões, contratos e implementações. Uma lista de hexadecimais ou uma biblioteca instalada isoladamente não fornece comportamento consistente.

## Camadas de tokens

| Camada | Papel | Exemplo conceitual |
|---|---|---|
| Primitivo | Valor de base | `--palette-brand-600`, `--space-4` |
| Semântico | Função na interface | `--action-bg`, `--surface`, `--text-muted` |
| Componente | Ajuste específico quando necessário | `--button-primary-bg` → `--action-bg` |

Componentes consomem papéis semânticos. Crie uma camada específica de componente quando ela permite variação real, não por obrigação em cada propriedade. Em sistema pequeno, primitivas e semântica podem bastar.

Registre papéis de superfície, texto e pares sobre cores de ação; borda, foco, erro, sucesso, aviso e seleção. Inclua tipografia, espaçamento, densidade, largura de conteúdo, raio, sombra, camadas e movimento conforme necessidade. Reutilize escalas existentes; uma base de 4/8 é opção, não lei.

Tema alterna mapeamentos semânticos, não uma coleção de remendos por tela. Valide pares e estados em cada tema entregue, e evite flash de tema quando houver SSR. Não acrescente dark mode ao escopo sem solicitação ou requisito do produto.

Valores brutos pertencem às definições ou exceções justificadas; não proíba qualquer literal de dimensão em CSS. `0`, proporções, limites intrínsecos e coordenadas de ilustração não exigem tokens artificiais. Para exportação, siga o formato e ferramentas realmente usados; não declare conformidade com um padrão de tokens sem validação.

## Contrato de componente

Defina antes de proliferar variantes:

- Finalidade e situações em que usar outra solução.
- Elemento/role semântico e API pública; variantes e tamanhos válidos.
- Estados aplicáveis: default, hover, foco, pressionado, selecionado, expandido, pendente, erro e desabilitado.
- Teclado, foco inicial e retorno de foco; nome, descrição e estados acessíveis.
- Composição, conteúdo longo, ícones, tema, densidade e adaptação a largura.

Exemplo de decisão: botão executa ação e link navega; estilo semelhante não permite trocar semântica. Botão pendente conserva nome identificável, comunica atividade e impede envio duplicado quando necessário. Um controle desabilitado por regra deve ter motivo compreensível nas proximidades quando não for óbvio.

Componentes complexos como combobox, menu e modal devem reutilizar primitivas maduras disponíveis no projeto. Não implemente foco e teclado do zero por aparência, mas verifique a integração: portal, rótulos e estilos podem comprometer uma primitiva correta.

## Consistência e evolução

Uma mesma função usa linguagem e comportamento previsíveis; isso não implica uma única aparência para todas as superfícies. Card promocional e linha de resultados podem ter tratamentos distintos com a mesma gramática visual.

Para mudar tokens compartilhados, identifique consumidores e confira telas representativas. Migre gradualmente, com aliases quando preservam compatibilidade. Atualize exemplos/Storybook se já existirem; não introduza Storybook apenas para um ajuste local.

Em handoff, registre decisões novas, tokens/variantes alterados, exemplos de uso e impacto esperado. Uma exceção de página deve ter motivo de conteúdo, não ser o início de um tema paralelo oculto.
