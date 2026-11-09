# Performance e experiência percebida

## Medir com contexto

Os alvos de boa experiência de [Core Web Vitals](https://web.dev/articles/vitals) são LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1, avaliados no percentil 75 com segmentação mobile/desktop. São alvos de campo; não prometa cumprimento a partir de uma captura ou um Lighthouse local.

Em laboratório, registre build, rota, ambiente, dispositivo/rede simulados e resultado. Lighthouse ajuda no diagnóstico; TBT não é INP de campo. Na ausência de telemetria ou ferramentas, diga “não medido”. Não invente nota nem torne uma meta genérica um gate do projeto sem acordo.

## Renderização e dados

Escolha SSR, SSG, CSR e hidratação pelo conteúdo, personalização e stack existente. Não converta um produto só para elevar um score. Evite waterfalls: dados independentes podem carregar em paralelo quando isso preserva autorização e consistência. Mostre conteúdo útil antes de widgets secundários.

Faça code splitting de funcionalidades pesadas e não críticas quando o custo justificar. Memoização e virtualização dependem de medição/volume, não de um número mágico de linhas. Verifique foco, seleção, busca e leitura assistiva ao virtualizar.

## Recursos críticos e estabilidade

- Identifique o recurso LCP antes de priorizar. Não aplique lazy loading à imagem LCP. Preload ou prioridade devem favorecer recurso realmente crítico e respeitar a API da versão instalada.
- Use imagens dimensionadas e formatos adequados ao conteúdo/transparência; forneça `srcset`/`sizes` quando úteis. Reserve proporção antes de baixar. Um componente de imagem da stack é preferível quando integrado, mas não é obrigação para todo SVG, logo ou recurso remoto.
- Reserve espaço para mídia, embeds e conteúdo assíncrono previsível. Esqueletos refletem geometria real, sem substituir toda a tela em cada refetch.
- Limite famílias, pesos e subsets de fontes, com fallback e estratégia de carregamento. Não use `font-display: swap` como garantia de CLS zero: métricas da fonte também importam.
- Audite dependências e terceiros. Remova custo sem uso; não carregue charting, editor ou cena 3D em todas as rotas porque uma tela precisa deles.

## Interação e movimento

Responda à ação sem atraso artificial; trabalho pesado não deve bloquear o feedback. Divida tarefas longas, reduza renders desnecessários e use worker quando adequado. Debounce de busca depende do uso e não pode tornar digitação/teclado inconsistentes.

Prefira animar propriedades de composição quando servirem ao efeito, mas confira consumo, camada e custo reais. Não acrescente `will-change` globalmente. Interrompa timers/loops e descarte recursos quando saírem de uso. Efeitos de WebGL têm fallback e devem tolerar indisponibilidade/perda de contexto.

## Verificação proporcional

Para trocar uma cor, inspeção visual e checks existentes podem bastar. Para alterar carregamento, imagens críticas, listas, navegação ou animação pesada, compare evidências antes/depois no mesmo cenário. Orçamentos de bundle e gates de CI pertencem ao projeto; proponha-os com evidência em vez de instalar uma nova cadeia de auditoria automaticamente.
