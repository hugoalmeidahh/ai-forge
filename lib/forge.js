import { access, cp, lstat, mkdir, readFile, readdir, readlink, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STACK_PATTERN = /^(backend|frontend)-[a-z0-9-]+$/;

const exists = async (path) => access(path).then(() => true, () => false);
const unix = (path) => path.split(sep).join('/');

export async function discoverStacks(root = ROOT) {
  const entries = await readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory() && STACK_PATTERN.test(entry.name))
    .map((entry) => entry.name).sort();
}

export async function discoverSkills(root = ROOT) {
  const ignored = new Set(['.git', 'node_modules', 'template-stack']);
  const found = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.name === 'SKILL.md') found.push(path);
    }
  }
  await walk(root);
  return found.sort();
}

export function skillRecord(path, root = ROOT) {
  const rel = unix(relative(root, path));
  const parts = rel.split('/');
  const scope = parts.length === 1 ? 'root' : parts[0];
  const localName = parts.length === 1 ? 'router' : parts.at(-2);
  return { path, relative: rel, scope, localName, installName: `ai-forge-${scope}-${localName}` };
}

export async function discoverScopes(root = ROOT) {
  return [...new Set((await discoverSkills(root)).map((path) => skillRecord(path, root).scope))].sort();
}

export async function listSkills(scope, root = ROOT) {
  const stacks = await discoverStacks(root);
  if (scope && !(await discoverScopes(root)).includes(scope)) throw new Error(`unknown scope: ${scope}`);
  const allowed = scope ? new Set(stacks.includes(scope) ? ['root', 'core', scope] : [scope]) : null;
  return (await discoverSkills(root)).map((path) => skillRecord(path, root))
    .filter((skill) => !allowed || allowed.has(skill.scope));
}

export async function context(stack, skillName, root = ROOT, scope) {
  if (!skillName) throw new Error('context requires --skill Y');
  if (stack && scope) throw new Error('use either --stack or --scope');
  const stacks = await discoverStacks(root);
  if (stack && !stacks.includes(stack)) throw new Error(`unknown stack: ${stack}`);
  const matches = (await listSkills(stack || scope, root)).filter((skill) =>
    skill.localName === skillName || skill.installName === skillName);
  if (matches.length !== 1) throw new Error(matches.length
    ? `ambiguous skill: ${skillName}; choose ${matches.map((skill) => skill.installName).join(', ')}`
    : `unknown skill: ${skillName}`);
  const selectedStack = stack || (stacks.includes(matches[0].scope) ? matches[0].scope : null);
  if (!selectedStack) return ['core/workflow.md', 'core/guardrails.md', matches[0].relative];
  return [
    'core/workflow.md', 'core/guardrails.md', 'core/module-architecture.md',
    'standards/index.md', `${selectedStack}/standards/index.md`, matches[0].relative,
  ];
}

function markdownTargets(text) {
  const targets = [];
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) targets.push({ target: match[1], catalog: false });
  for (const match of text.matchAll(/<file\s+path=["']([^"']+)["']/g)) targets.push({ target: match[1], catalog: true });
  return targets.filter(({ target }) => !/^(?:https?:|mailto:|#)/.test(target) && !target.includes('[stack-name]'));
}

export async function validate(root = ROOT) {
  const errors = [];
  const stacks = await discoverStacks(root);
  for (const stack of stacks) {
    for (const required of ['SKILLS.md', 'standards/index.md']) {
      if (!await exists(join(root, stack, required))) errors.push(`${stack}: missing ${required}`);
    }
  }
  const skills = await discoverSkills(root);
  const names = new Map();
  const skillDirectories = new Set(skills.map((path) => dirname(path)));
  for (const path of skills) {
    const text = await readFile(path, 'utf8');
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
    const name = frontmatter?.match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter?.match(/^description:\s*(.+)$/m)?.[1]?.trim();
    const installName = skillRecord(path, root).installName;
    if (!name || !description) errors.push(`${unix(relative(root, path))}: invalid frontmatter`);
    if (name && !/^ai-forge-[a-z0-9-]{1,54}$/.test(name)) errors.push(`${unix(relative(root, path))}: invalid skill identifier`);
    if (name !== installName) errors.push(`${unix(relative(root, path))}: name must be ${installName}`);
    if (names.has(installName)) errors.push(`duplicate install name: ${installName}`);
    names.set(installName, path);
  }
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (['.git', 'node_modules', 'vendor'].includes(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.name.endsWith('.md')) {
        const text = await readFile(path, 'utf8');
        for (const { target, catalog } of markdownTargets(text)) {
          const clean = target.split('#')[0];
          if (!clean) continue;
          const packagePrefix = 'node_modules/@hugoalmeidahh/ai-forge/';
          let owner = dirname(path);
          while (!skillDirectories.has(owner) && owner !== root && dirname(owner) !== owner) owner = dirname(owner);
          const candidate = clean.startsWith('references/')
            ? resolve(owner, clean)
            : clean.startsWith(packagePrefix)
            ? resolve(root, clean.slice(packagePrefix.length))
            : catalog || clean.startsWith('core/') || clean.startsWith('standards/')
              ? resolve(root, clean)
              : resolve(dirname(path), clean);
          if (!await exists(candidate)) errors.push(`${unix(relative(root, path))}: broken link ${target}`);
        }
      }
    }
  }
  await walk(root);
  for (const obsolete of ['pyproject.toml', 'replace.py', 'core_ai_prompts', 'template-team']) {
    if (await exists(join(root, obsolete))) errors.push(`obsolete path remains: ${obsolete}`);
  }
  for (const path of await syncReferences({ root })) errors.push(`outdated reference bundle: ${path}`);
  if (errors.length) throw new Error(`validation failed:\n- ${errors.join('\n- ')}`);
  return { stacks: stacks.length, skills: skills.length };
}

async function sameTree(source, destination) {
  const [left, right] = await Promise.all([lstat(source), lstat(destination)]);
  if (left.isSymbolicLink() || right.isSymbolicLink()) return false;
  if (left.isFile() && right.isFile()) {
    return (await readFile(source)).equals(await readFile(destination));
  }
  if (!left.isDirectory() || !right.isDirectory()) return false;
  const [sourceNames, destinationNames] = await Promise.all([readdir(source), readdir(destination)]);
  sourceNames.sort(); destinationNames.sort();
  if (sourceNames.length !== destinationNames.length || sourceNames.some((name, index) => name !== destinationNames[index])) return false;
  for (const name of sourceNames) if (!await sameTree(join(source, name), join(destination, name))) return false;
  return true;
}

export async function syncReferences({ root = ROOT, write = false } = {}) {
  const differences = [];
  const groups = ['core', 'standards', ...await discoverStacks(root)];
  for (const path of await discoverSkills(root)) {
    const references = join(dirname(path), 'references');
    for (const group of groups) {
      const bundled = join(references, group, ...(STACK_PATTERN.test(group) ? ['standards'] : []));
      const canonical = join(root, group, ...(STACK_PATTERN.test(group) ? ['standards'] : []));
      if (!await exists(bundled) || !await exists(canonical)) continue;
      for (const entry of await readdir(canonical, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
        const source = join(canonical, entry.name);
        const destination = join(bundled, entry.name);
        let expected = await readFile(source, 'utf8');
        expected = expected.replaceAll('node_modules/@hugoalmeidahh/ai-forge/', 'references/');
        expected = expected.replace(/(<file path=")((?:core|standards)\/)/g, '$1references/$2');
        expected = expected.replace(/(?<![a-zA-Z0-9/])((?:core|standards|backend-[a-z-]+|frontend-[a-z-]+)\/[a-zA-Z0-9/.-]+\.md)/g, 'references/$1');
        if (!await exists(destination) || await readFile(destination, 'utf8') !== expected) {
          differences.push(unix(relative(root, destination)));
          if (write) await writeFile(destination, expected);
        }
      }
    }
  }
  return differences;
}

export async function installSkills({ root = ROOT, registry = join(homedir(), '.agents', 'skills'), mode = 'link', force = false } = {}) {
  if (!['link', 'copy'].includes(mode)) throw new Error('mode must be link or copy');
  await mkdir(registry, { recursive: true });
  const [sourceRoot, registryRoot] = await Promise.all([realpath(root), realpath(registry)]);
  if (registryRoot === sourceRoot || registryRoot.startsWith(sourceRoot + sep)) {
    throw new Error('registry must be outside the AI Forge source tree');
  }
  const results = [];
  for (const skill of (await discoverSkills(root)).map((path) => skillRecord(path, root))) {
    const source = dirname(skill.path);
    const destination = join(registry, skill.installName);
    const rootSkill = skill.relative === 'SKILL.md';
    let status = 'installed';
    if (await exists(destination)) {
      const destinationSkill = join(destination, 'SKILL.md');
      const stat = await lstat(destination);
      let same = mode === 'link' && stat.isSymbolicLink()
        && resolve(dirname(destination), await readlink(destination)) === resolve(source);
      if (!same && await exists(destinationSkill)) {
        const skillStat = await lstat(destinationSkill);
        same = mode === 'link'
          ? skillStat.isSymbolicLink() && resolve(dirname(destinationSkill), await readlink(destinationSkill)) === resolve(skill.path)
          : !stat.isSymbolicLink() && !skillStat.isSymbolicLink() && (rootSkill
            ? await readFile(destinationSkill, 'utf8') === await readFile(skill.path, 'utf8')
              && (!await exists(join(root, 'LICENSE')) || await exists(join(destination, 'LICENSE'))
                && await sameTree(join(root, 'LICENSE'), join(destination, 'LICENSE')))
            : await sameTree(source, destination));
      }
      if (same) { results.push({ ...skill, destination, status: 'unchanged' }); continue; }
      if (!force) throw new Error(`refusing to overwrite divergent skill: ${destination} (use --force)`);
      await rm(destination, { recursive: true, force: true });
      status = 'replaced';
    }
    if (rootSkill) {
      await mkdir(destination, { recursive: true });
      if (mode === 'link') await symlink(skill.path, join(destination, 'SKILL.md'), 'file');
      else await cp(skill.path, join(destination, 'SKILL.md'));
      if (await exists(join(root, 'LICENSE'))) {
        if (mode === 'link') await symlink(join(root, 'LICENSE'), join(destination, 'LICENSE'), 'file');
        else await cp(join(root, 'LICENSE'), join(destination, 'LICENSE'));
      }
    } else if (mode === 'link') await symlink(source, destination, 'dir');
    else await cp(source, destination, { recursive: true });
    results.push({ ...skill, destination, status });
  }
  return results;
}

const BLOCK_START = '<!-- ai-forge:start -->';
const BLOCK_END = '<!-- ai-forge:end -->';

export async function detectStack(cwd) {
  const matches = new Set();
  if (await exists(join(cwd, 'nest-cli.json'))) matches.add('backend-nestjs');
  if (await exists(join(cwd, 'go.mod'))) matches.add('backend-golang');
  const packagePath = join(cwd, 'package.json');
  if (await exists(packagePath)) {
    let pkg;
    try { pkg = JSON.parse(await readFile(packagePath, 'utf8')); }
    catch { throw new Error(`invalid package.json: ${packagePath}`); }
    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    if (Object.keys(deps).some((name) => name === '@nestjs/core' || name.startsWith('@nestjs/'))) matches.add('backend-nestjs');
    if (deps.fastify && !matches.has('backend-nestjs')) matches.add('backend-node');
    const meta = [['next', 'frontend-nextjs'], ['nuxt', 'frontend-nuxt'], ['astro', 'frontend-astro']];
    for (const [dependency, stack] of meta) if (deps[dependency]) matches.add(stack);
    if (!meta.some(([dependency]) => deps[dependency])) {
      if (deps.react) matches.add('frontend-react');
      if (deps.vue) matches.add('frontend-vue');
      if (deps['@angular/core']) matches.add('frontend-angular');
      if (deps.svelte || deps['@sveltejs/kit']) matches.add('frontend-svelte');
    }
  }
  if (matches.size !== 1) {
    const detail = matches.size ? `ambiguous markers: ${[...matches].sort().join(', ')}` : 'no supported stack markers found';
    throw new Error(`${detail}; specify --stack (${(await discoverStacks()).join(', ')})`);
  }
  return [...matches][0];
}

function commandReference(cwd, root = ROOT) {
  if (resolve(root).startsWith(resolve(join(cwd, 'node_modules')) + sep)) return './node_modules/.bin/forge';
  return `node ${JSON.stringify(join(root, 'bin', 'forge.js'))}`;
}

export function renderInitBlock(stack, cli) {
  return `${BLOCK_START}\n## AI-Forge\n\nStack: \`${stack}\`. Rule precedence: project L3 > stack L2 > shared L0.\n\nLoad task context on demand; do not embed whole standards. Run:\n\n\`\`\`bash\n${cli} context --stack ${stack} --skill <skill>\n\`\`\`\n${BLOCK_END}`;
}

export function updateAgentContent(content, block, { force = false } = {}) {
  const starts = [...content.matchAll(/<!-- ai-forge:start -->/g)];
  const ends = [...content.matchAll(/<!-- ai-forge:end -->/g)];
  if (starts.length === 1 && ends.length === 1 && starts[0].index < ends[0].index) {
    return content.slice(0, starts[0].index) + block + content.slice(ends[0].index + BLOCK_END.length);
  }
  if (starts.length || ends.length) {
    if (!force) throw new Error('malformed or duplicate ai-forge block; rerun with --force to remove all delimiters and append a clean block');
    content = content.replace(/<!-- ai-forge:(?:start|end) -->/g, '').replace(/[ \t]+$/gm, '');
  }
  if (!content) return `${block}\n`;
  return `${content.replace(/\s*$/, '')}\n\n${block}\n`;
}

export async function initProject({ cwd = process.cwd(), stack, agent, force = false, root = ROOT } = {}) {
  cwd = resolve(cwd);
  if (!await exists(cwd)) throw new Error(`cwd does not exist: ${cwd}`);
  const stacks = await discoverStacks(root);
  stack = stack ?? await detectStack(cwd);
  if (!stacks.includes(stack)) throw new Error(`unknown stack: ${stack}; available: ${stacks.join(', ')}`);
  if (agent && !['claude', 'codex', 'both'].includes(agent)) throw new Error('--agent must be claude, codex, or both');
  const present = [];
  if (await exists(join(cwd, 'CLAUDE.md'))) present.push('CLAUDE.md');
  if (await exists(join(cwd, 'AGENTS.md'))) present.push('AGENTS.md');
  let targets;
  if (agent) targets = agent === 'both' ? ['CLAUDE.md', 'AGENTS.md'] : [agent === 'claude' ? 'CLAUDE.md' : 'AGENTS.md'];
  else if (present.length) targets = present;
  else throw new Error('no CLAUDE.md or AGENTS.md found; specify --agent claude|codex|both');
  const block = renderInitBlock(stack, commandReference(cwd, root));
  const results = [];
  for (const name of targets) {
    const path = join(cwd, name);
    const before = await exists(path) ? await readFile(path, 'utf8') : '';
    const after = updateAgentContent(before, block, { force });
    if (after !== before) await writeFile(path, after);
    results.push({ path, status: after === before ? 'unchanged' : before ? 'updated' : 'created' });
  }
  return { stack, results };
}

const help = `AI-Forge CLI\n\nUsage:\n  forge help\n  forge stacks | list\n  forge scopes\n  forge skills [scope]\n  forge context [--stack X | --scope X] --skill Y\n  forge init [--stack STACK] [--agent claude|codex|both] [--cwd PATH] [--force]\n  forge validate\n  forge sync-references [--write]\n  forge install-skills [--copy|--link] [--force] [--registry PATH]\n  forge update\n\ninit --force only repairs malformed/duplicate ai-forge delimiters; content outside delimiters is preserved.\n`;
const option = (args, name) => {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value`);
  return value;
};

export async function run(args, io = console) {
  const command = args[0] ?? 'help';
  if (['help', '--help', '-h'].includes(command)) return io.log(help);
  if (['stacks', 'list'].includes(command)) return io.log((await discoverStacks()).join('\n'));
  if (command === 'scopes') return io.log((await discoverScopes()).join('\n'));
  if (command === 'sync-references') {
    const differences = await syncReferences({ write: args.includes('--write') });
    if (differences.length && !args.includes('--write')) throw new Error(`reference bundles out of sync: ${differences.join(', ')}; run forge sync-references --write`);
    return io.log(`reference bundles: ${differences.length ? 'updated ' + differences.length : 'in sync'}`);
  }
  if (command === 'skills') return io.log((await listSkills(args[1])).map((skill) => `${skill.installName}\t${skill.relative}`).join('\n'));
  if (command === 'context') return io.log((await context(option(args, '--stack'), option(args, '--skill'), ROOT, option(args, '--scope'))).map((path) => join(ROOT, path)).join('\n'));
  if (command === 'init') {
    const result = await initProject({ cwd: option(args, '--cwd'), stack: option(args, '--stack'), agent: option(args, '--agent'), force: args.includes('--force') });
    return io.log([`stack\t${result.stack}`, ...result.results.map((item) => `${item.status}\t${item.path}`)].join('\n'));
  }
  if (command === 'validate') { const result = await validate(); return io.log(`valid: ${result.stacks} stacks, ${result.skills} skills`); }
  if (command === 'install-skills') {
    const results = await installSkills({ registry: option(args, '--registry'), mode: args.includes('--copy') ? 'copy' : 'link', force: args.includes('--force') });
    return io.log(results.map((item) => `${item.status}\t${item.installName}\t${item.destination}`).join('\n'));
  }
  if (command === 'update') {
    if (!await exists(join(ROOT, '.git'))) throw new Error('update requires a Git checkout; update package via its package manager');
    const { spawnSync } = await import('node:child_process');
    const result = spawnSync('git', ['pull', '--ff-only'], { cwd: ROOT, stdio: 'inherit' });
    if (result.status !== 0) throw new Error('git pull --ff-only failed');
    return;
  }
  throw new Error(`unknown command: ${command}\n\n${help}`);
}
