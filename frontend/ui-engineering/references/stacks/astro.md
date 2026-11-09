# Astro

Documentação: [docs.astro.build](https://docs.astro.build/).

- Preserve HTML estático e ilhas quando atendem à tarefa; uma página de conteúdo não precisa virar SPA.
- JavaScript embarcado e diretivas de cliente têm custo. Hidrate apenas componentes interativos e escolha o momento pelo uso real; formulário principal não pode depender de uma ilha ainda não pronta.
- Configuração de conteúdo, collections e loaders muda entre versões. Use schemas e APIs da versão instalada, não caminhos de tutoriais antigos.
- Dados sensíveis só aparecem no servidor; frontmatter e endpoint devem respeitar modo estático/SSR e momento em que o dado é obtido.
- Use `astro:assets` quando adequado para otimização de imagens processáveis. Declare dimensões/proporção e prioridade de recursos críticos conforme versão.
- Uma ilha React/Vue/Svelte segue padrões da sua stack, mas não justifica carregar outro runtime sem benefício. Compartilhamento de estado entre ilhas exige contrato deliberado.
- Transições de navegação e scripts precisam considerar reinicialização/cleanup, foco e movimento reduzido quando usados.
- Execute checks/build existentes e verifique páginas finais e ilhas no navegador; HTML estático correto não prova interatividade.
