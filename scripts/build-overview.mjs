import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { context, discoverStacks, listSkills } from '../lib/forge.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = JSON.parse(await readFile(join(root, 'docs/skills-overview-data.json'), 'utf8'));
const records = await listSkills(undefined, root);
const byPath = new Map(records.map((skill) => [skill.relative, skill]));
const groups = [
  ['entrada', 'Por onde começar'], ['core', 'Planejamento, revisão e entrega'],
  ['backend', 'Desenvolvimento backend'], ['frontend', 'Frontend e experiência de produto'],
  ['design', 'Design e identidade'], ['quality', 'Qualidade e evidências'],
  ['integrations', 'Integrações e automação'], ['artifacts', 'Documentos e artefatos'],
];
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
if (source.length !== records.length || new Set(source.map((item) => item.path)).size !== records.length) throw new Error('Overview must contain exactly one entry per installable skill');
const skills = [];
for (const item of source) {
  const record = byPath.get(item.path);
  if (!record || !groups.some(([key]) => key === item.group)) throw new Error(`Unknown overview entry: ${item.path}`);
  for (const key of ['title', 'summary', 'when', 'result', 'prompt', 'requirement']) if (!item[key]?.trim()) throw new Error(`Missing ${key}: ${item.path}`);
  const files = await context(undefined, record.installName, root);
  if (!files.includes(item.path)) throw new Error(`Context does not resolve: ${record.installName}`);
  skills.push({ ...item, id: record.installName, command: `node bin/forge.js context --skill ${record.installName}`, invocation: `$${record.installName} ${item.prompt}` });
}
const stackCount = (await discoverStacks(root)).length;
const intro = `# AI Forge — overview e acesso às skills

O AI Forge reúne **${skills.length} skills instaláveis** e padrões para **${stackCount} stacks**, mais um template de autoria. As skills são instruções e referências para agentes: definem como abordar o trabalho, quais contratos preservar e como verificar a entrega. As ferramentas de execução vêm do ambiente.

[README](../README.md) · [Apresentação HTML](../presentation.html) · [Licença MIT](../LICENSE) · [Fontes e atribuições](../THIRD_PARTY_NOTICES.md)

## Como acessar

### 1. Instalar pelo checkout público

Requisito do CLI: Node.js 20+. No terminal:

\`\`\`bash
git clone https://github.com/hugoalmeidahh/ai-forge.git ~/.local/share/ai-forge
cd ~/.local/share/ai-forge
node bin/forge.js validate
node bin/forge.js install-skills
\`\`\`

O instalador cria links em \`~/.agents/skills\`. Para copiar, use \`node bin/forge.js install-skills --copy\`. Agentes compatíveis precisam descobrir esse diretório; uma sessão nova pode ser necessária para atualizar o catálogo. O template não é instalado. Não substitua skills divergentes com \`--force\` sem revisar o que será trocado.

### 2. Descobrir e carregar o contexto

Os comandos deste catálogo partem da raiz do checkout:

\`\`\`bash
node bin/forge.js scopes
node bin/forge.js skills
node bin/forge.js skills design
node bin/forge.js context --skill ai-forge-core-storytelling
node bin/forge.js context --stack backend-golang --skill new-module
\`\`\`

**\`context\` lista caminhos; não lê o conteúdo por você nem executa a tarefa.** O agente lê os arquivos retornados e segue as referências pertinentes. O ID completo evita ambiguidade e infere a stack quando existe. Fora do checkout, use o caminho real do CLI, como \`node ~/.local/share/ai-forge/bin/forge.js\`, ou \`npx forge\` se o pacote estiver instalado no projeto.

### 3. Pedir a skill ao agente

Se o agente oferecer invocação explícita por nome, use o exemplo \`$ai-forge-…\` de cada entrada. Caso contrário, peça em linguagem natural: “Leia a skill com este ID e aplique-a à tarefa”, ou forneça o link do \`SKILL.md\`. A sintaxe e a descoberta dependem do agente; a leitura direta dos arquivos é a alternativa portável.

Para um projeto consumidor, a configuração assistida é opcional:

\`\`\`bash
node ~/.local/share/ai-forge/bin/forge.js init --cwd /caminho/do/projeto --agent codex --stack backend-golang
\`\`\`

Escolha \`claude\`, \`codex\` ou \`both\` conforme os arquivos desejados. O bloco do AI Forge preserva o texto externo já existente; não altera o catálogo do agente por si só.

## Como as camadas se combinam

- **L0:** clean code, naming, Git, segurança, observabilidade e verificação compartilhados.
- **L2:** tradução dos contratos para a stack, preservando seus mecanismos nativos.
- **L3:** regras específicas do projeto; prevalecem sobre L2 e L0. Instruções do usuário e do runtime continuam válidas.
- **Capacidades:** planejamento, design, QA, integrações e artefatos carregados conforme o resultado pedido.

Um fluxo comum é storytelling → discovery quando necessário → implementação na stack → QA → review → entrega autorizada. Correções pequenas não precisam atravessar todas essas etapas. Nem todo trabalho precisa de arquitetura de backend.

A revisão FORGE conserva cinco frentes: fluxo/async, observabilidade, resiliência/erros, guard clauses/arquitetura e tratamento de erros/type safety, incluindo os riscos de segurança aplicáveis.

## Índice do catálogo

${groups.map(([key, title]) => `- [${title}](#${key})`).join('\n')}

`;
let markdown = intro;
for (const [key, title] of groups) {
  markdown += `<a id="${key}"></a>\n\n## ${title}\n\n`;
  for (const skill of skills.filter((item) => item.group === key)) {
    markdown += `### ${skill.title}\n\n**ID:** \`${skill.id}\` · [Instruções completas](../${skill.path})\n\n${skill.summary}\n\n- **Quando usar:** ${skill.when}\n- **Entrega esperada:** ${skill.result}\n- **Condições e limites:** ${skill.requirement}\n\n**Carregar o contexto no checkout:**\n\n\`\`\`bash\n${skill.command}\n\`\`\`\n\n**Exemplo para um agente compatível:**\n\n\`\`\`text\n${skill.invocation}\n\`\`\`\n\n`;
  }
}
markdown += `## Template de autoria\n\n[\`ai-forge-template-stack-project-standards\`](../template-stack/project-standards/SKILL.md) é um molde para criar uma stack. Ele fica fora da instalação e da descoberta, pois contém placeholders que precisam ser substituídos. Não conta entre as ${skills.length} skills instaláveis.\n\n## Limites e manutenção\n\nSkills de navegador, Android, agendamento, LLM e artefatos precisam de ferramentas e acessos reais. Carregar uma skill não instala essas capacidades, não inicia agentes e não autoriza publicação, mensagens ou alterações de produção. Os workflows de documentos são autorais; os toolkits proprietários analisados na origem não são redistribuídos.\n\nA base editorial fica em [skills-overview-data.json](skills-overview-data.json). Para gerar este arquivo e a apresentação, use \`npm run docs:build\`; para detectar divergências, \`npm run docs:check\`. O gerador confere cobertura de todas as skills e resolve cada ID pelo CLI.\n\nValidações do projeto: \`npm test\`, \`npm run validate\` e \`npm run references:check\`. Ao alterar standards canônicos, sincronize as cópias com \`npm run references:sync\`. Consulte [consolidação](skill-consolidation.md) e [verificação registrada](validation.md) para a procedência e o alcance das verificações.\n`;
const cards = skills.map((skill) => `<article class="skill-card" data-group="${skill.group}" data-search="${escape([skill.id, skill.title, skill.summary, skill.when].join(' '))}">
  <div class="skill-top"><span class="label">${escape(groups.find(([key]) => key === skill.group)[1])}</span><a href="${escape(skill.path)}" aria-label="Ler instruções de ${escape(skill.title)}">SKILL.md ↗</a></div>
  <h3>${escape(skill.title)}</h3><p class="skill-id">${escape(skill.id)}</p><p>${escape(skill.summary)}</p>
  <details><summary>Quando usar e como acessar</summary><dl><dt>Quando usar</dt><dd>${escape(skill.when)}</dd><dt>Entrega esperada</dt><dd>${escape(skill.result)}</dd><dt>Condições e limites</dt><dd>${escape(skill.requirement)}</dd></dl>
  <div class="code-label"><span>Contexto no checkout</span><button type="button" class="copy" data-copy="${skill.id}-command" aria-label="Copiar comando de ${escape(skill.title)}">Copiar</button></div><pre><code tabindex="0" id="${skill.id}-command">${escape(skill.command)}</code></pre>
  <div class="code-label"><span>Pedido ao agente compatível</span><button type="button" class="copy" data-copy="${skill.id}-prompt" aria-label="Copiar pedido de ${escape(skill.title)}">Copiar</button></div><pre><code tabindex="0" id="${skill.id}-prompt">${escape(skill.invocation)}</code></pre></details>
</article>`).join('\n');
let html = await readFile(join(root, 'scripts/overview-template.html'), 'utf8');
html = html.replaceAll('{{SKILL_COUNT}}', String(skills.length)).replaceAll('{{STACK_COUNT}}', String(stackCount)).replace('{{CARDS}}', cards).replace('{{GROUP_OPTIONS}}', groups.map(([key, title]) => `<option value="${key}">${escape(title)}</option>`).join(''));
const outputs = [['docs/skills-overview.md', markdown], ['presentation.html', html]];
for (const [path, content] of outputs) {
  if (process.argv.includes('--check')) {
    if (await readFile(join(root, path), 'utf8') !== content) throw new Error(`${path} is outdated; run npm run docs:build`);
  } else await writeFile(join(root, path), content);
}
console.log(`${process.argv.includes('--check') ? 'Verified' : 'Generated'} overview: ${skills.length} skills, ${stackCount} stacks, Markdown + HTML`);
