# Selecionar a stack

Detecte versões no manifesto, lockfile e configuração. Carregue apenas a referência correspondente e, em meta-frameworks, a base React/Vue/Svelte quando relevante. Uma stack não detectada não vira React por padrão.

| Stack | Referência | Evidência comum |
|---|---|---|
| React | [react.md](react.md) | `react`, router e bundler reais |
| Vue | [vue.md](vue.md) | `vue`, router e SFCs |
| Next.js | [nextjs.md](nextjs.md) | `next`, App Router ou Pages Router |
| Nuxt | [nuxt.md](nuxt.md) | `nuxt`, configuração e estrutura da major |
| Astro | [astro.md](astro.md) | `astro` e integrações instaladas |
| Angular | [angular.md](angular.md) | `@angular/core`, config e versão |
| Svelte / SvelteKit | [svelte.md](svelte.md) | `svelte`, presença ou ausência de `@sveltejs/kit` |
| HTML/CSS/JS | [html-css.md](html-css.md) | Sem framework ou templates do servidor |

Para outra stack, aplique UX, visual, acessibilidade e arquitetura conforme seus mecanismos nativos; consulte documentação oficial antes de sugerir APIs. Para Wails/Electron, use a stack real da webview e trate bindings/IPC como fronteira de serviço. Webview não transforma código do frontend em ambiente confiável nem autoriza uso irrestrito do filesystem.

Não fixe versões ou comandos de instalação neste catálogo. Recursos variam entre majors: confira documentação oficial correspondente antes de usar APIs novas, cache, otimização de imagens e estratégias de hidratação.
