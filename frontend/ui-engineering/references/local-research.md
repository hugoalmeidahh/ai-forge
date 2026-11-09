# Pesquisa local opcional

O pacote inclui em `vendor/ui-ux-pro-max/` uma cópia do motor de busca e dos dados do UI/UX Pro Max. Essa é uma biblioteca de candidatos, não uma fonte normativa nem resultado de pesquisa com usuários do produto.

## Disponibilidade

Se a skill estiver materializada no filesystem, resolva o diretório real e execute com Python 3. Não dependa de `${CLAUDE_PLUGIN_ROOT}`, `.claude/` ou de um diretório pessoal do autor. Se o runtime disponibilizar somente o texto pelo runtime, não suponha que os scripts ou CSVs existem localmente. Use as referências curadas e declare que o catálogo não foi consultado.

`SKILL_DIR` nos exemplos é uma variável local definida com o caminho da skill realmente disponível:

```bash
python3 "$SKILL_DIR/vendor/ui-ux-pro-max/scripts/search.py" --help
python3 "$SKILL_DIR/vendor/ui-ux-pro-max/scripts/search.py" \
  "keyboard focus modal" --domain ux --json
python3 "$SKILL_DIR/vendor/ui-ux-pro-max/scripts/search.py" \
  "internal analytics dashboard" --design-system -f markdown
python3 "$SKILL_DIR/vendor/ui-ux-pro-max/scripts/search.py" \
  "useState" --stack react --json
```

## Escolher e interpretar

- Use consulta específica de domínio para uma dúvida; não gere um design system inteiro para corrigir um erro de campo.
- Para identidade nova, `--design-system` pode sugerir composição, paleta e tipos. Para produto existente, os tokens e linguagem do projeto prevalecem sobre a recomendação.
- Use termos curtos em inglês quando isso melhorar a correspondência com o catálogo. Verifique domínio, plataforma, versão e resultado, em vez de aceitar o primeiro item pelo score.
- Avalie cada seção de uma recomendação agregada separadamente. Na validação deste pacote, “internal analytics dashboard” retornou estilo de dashboard junto de estrutura de landing com “Contact Sales”. Descarte essa estrutura para a aplicação operacional; ela não vira requisito só por vir do motor. Prefira uma consulta focada quando a agregação misturar superfícies.
- Verifique contraste e acessibilidade na aplicação. Descarte regras de catálogo que confundam recomendação de toque, requisito WCAG e unidade nativa.
- Nenhum snippet implica instalar pacote, mudar framework ou acrescentar animação. APIs específicas precisam ser compatíveis com as versões do projeto e documentação oficial.
- Se a busca falhar ou não corresponder, tente uma reformulação focada; persistindo, use a base curada e informe a ausência de correspondência verificada.

As consultas acima só leem dados locais. O motor também oferece persistência; não a use automaticamente. Quando uma decisão de projeto justificar um documento, prefira o local e formato já usados pela equipe. Leia arquivos existentes antes de atualizar e não use `--force` para sobrescrever decisões de terceiros por conveniência. Conteúdo privado não pertence a consultas externas nem a exemplos públicos.

## Origem e manutenção

Os quatro módulos Python e os dados são preservados como biblioteca de terceiros; a adaptação das instruções vive no `SKILL.md` e nas referências desta skill. Não carregue todos os CSVs no contexto. A licença e o manifesto de hashes permitem identificar a cópia analisada. Ao atualizar o fornecedor, execute a validação do pacote e as consultas de smoke novamente.
