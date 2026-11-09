# Pesquisa local de interface

A skill inclui um catálogo opcional de padrões e recomendações para apoiar decisões de interface. Seus resultados são candidatos: os padrões do AI Forge, as regras L3 e a necessidade do usuário orientam a decisão final. Uma consulta ao catálogo não equivale a pesquisa com usuários.

## Acessar

Se a skill estiver disponível no filesystem, resolva seu diretório real e use Python 3. Se o ambiente expuser apenas o texto, não suponha que scripts ou dados também estejam disponíveis. Nesse caso, use as referências locais da skill e informe que a pesquisa não foi executada.

`SKILL_DIR` representa o caminho real da skill:

```bash
python3 "$SKILL_DIR/scripts/research.py" --help
python3 "$SKILL_DIR/scripts/research.py" \
  "keyboard focus modal" --domain ux --json
python3 "$SKILL_DIR/scripts/research.py" \
  "internal analytics dashboard" --design-system -f markdown
python3 "$SKILL_DIR/scripts/research.py" \
  "useState" --stack react --json
```

As consultas são locais e somente de leitura. A interface não persiste recomendações nem sobrescreve decisões do projeto.

## Aplicar os resultados

- Use uma consulta focada para a dúvida da tarefa. Corrigir um erro de formulário não exige propor outro design system.
- Identidade, tokens, linguagem e componentes existentes prevalecem sobre uma recomendação genérica.
- Verifique a adequação de cada resultado à superfície: uma aplicação operacional não deve receber estrutura de landing page por coincidência de termos.
- Confira versão e contexto antes de usar snippets. A consulta não autoriza instalar bibliotecas, trocar de framework ou acrescentar efeitos.
- Valide contraste, teclado e interação na tela real. Recomendações do catálogo não certificam acessibilidade.
- Sem correspondência útil, reformule uma vez; depois, aplique as referências AI Forge pertinentes e declare a ausência de resultado verificado.

## Manutenção

Leia os dados sob demanda. Depois de atualizar o catálogo ou o mecanismo de consulta, confira a integridade dos arquivos e execute consultas de UX, design system e stack. Mantenha limites, mensagens de falha e o comportamento somente de leitura da interface AI Forge.
