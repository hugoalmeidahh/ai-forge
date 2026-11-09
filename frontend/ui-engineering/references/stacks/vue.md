# Vue

Autoridade L2 quando disponível: `ai-forge-frontend-vue-project-standards`. Documentação: [vuejs.org](https://vuejs.org/guide/introduction.html).

- Em Vue 3 com TypeScript, prefira Composition API e `<script setup lang="ts">` quando esse for o padrão do projeto. Não migre Options API ou projeto legado sem necessidade.
- Componente apresenta; composable orquestra; serviço define contrato e transporte. No FORGE, Vue Query gerencia cache remoto e Pinia o estado compartilhado do cliente.
- Use `computed` para valores derivados; `watch`/efeitos para sincronização externa com cleanup. Respeite limites de reatividade ao desestruturar objetos e substituir referências.
- Props e eventos têm contrato explícito. Não altere props no filho; eventos comunicam intenção ao dono do estado.
- Store global não resolve automaticamente prop drilling. Mantenha estado local quando o contexto for local e não replique o cache remoto.
- Lazy load onde o custo justificar; APIs assíncronas e de hidratação dependem da versão. Não imponha `Suspense` para cada componente.
- Teste DOM renderizado, teclado e feedback com tooling existente. Preserve convenções de SFCs, router e testes.

Para Nuxt, leia a referência específica antes de escolher obtenção de dados, SSR e estado entre requisições.
