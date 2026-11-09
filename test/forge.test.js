import assert from 'node:assert/strict';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import test from 'node:test';
import { context, detectStack, discoverScopes, discoverStacks, initProject, installSkills, listSkills, ROOT, run, syncReferences, updateAgentContent, validate } from '../lib/forge.js';

test('discovers supported stacks only', async () => {
  assert.deepEqual(await discoverStacks(), ['backend-golang', 'backend-nestjs', 'backend-node', 'frontend-angular', 'frontend-astro', 'frontend-html-css', 'frontend-nextjs', 'frontend-nuxt', 'frontend-react', 'frontend-svelte', 'frontend-vue']);
});

test('scopes skills and creates unique install names', async () => {
  const skills = await listSkills('backend-nestjs');
  assert(skills.some((skill) => skill.installName === 'ai-forge-backend-nestjs-new-module'));
  assert(skills.some((skill) => skill.installName === 'ai-forge-core-code-review'));
  assert.equal(new Set(skills.map((skill) => skill.installName)).size, skills.length);
});

test('builds ordered context', async () => {
  const files = await context('backend-node', 'new-module');
  assert.deepEqual(files, [
    'core/workflow.md', 'core/guardrails.md', 'core/module-architecture.md',
    'standards/index.md', 'backend-node/standards/index.md', 'backend-node/new-module/SKILL.md',
  ]);
});

test('validates repository layout and catalogs', async () => {
  const result = await validate();
  assert.equal(result.stacks, 11);
  assert.equal(result.skills, 45);
});

test('installs copies and refuses divergent overwrite', async () => {
  const registry = await mkdtemp(join(tmpdir(), 'ai-forge-skills-'));
  const installed = await installSkills({ registry, mode: 'copy' });
  const target = join(registry, 'ai-forge-root-router', 'SKILL.md');
  assert.equal(await readFile(target, 'utf8'), await readFile(join(ROOT, 'SKILL.md'), 'utf8'));
  await writeFile(target, 'divergent\n');
  await assert.rejects(() => installSkills({ registry, mode: 'copy' }), /refusing to overwrite divergent skill/);
  const replaced = await installSkills({ registry, mode: 'copy', force: true });
  assert(replaced.some((item) => item.installName === 'ai-forge-root-router' && item.status === 'replaced'));
});

test('installs idempotent symlinks', async () => {
  const registry = await mkdtemp(join(tmpdir(), 'ai-forge-links-'));
  await mkdir(registry, { recursive: true });
  await installSkills({ registry, mode: 'link' });
  const second = await installSkills({ registry, mode: 'link' });
  assert(second.every((item) => item.status === 'unchanged'));
});

test('copied skills retain their standards and UI metadata', async () => {
  const registry = await mkdtemp(join(tmpdir(), 'ai-forge-portable-'));
  await installSkills({ registry, mode: 'copy' });
  const skill = join(registry, 'ai-forge-backend-node-project-standards');
  assert.match(await readFile(join(skill, 'references/backend-node/standards/index.md'), 'utf8'), /references\/backend-node\/standards\/router-service.md/);
  assert.match(await readFile(join(skill, 'references/backend-node/standards/router-service.md'), 'utf8'), /service/i);
  assert.match(await readFile(join(skill, 'agents/openai.yaml'), 'utf8'), /ai-forge-backend-node-project-standards/);
  assert.match(await readFile(join(registry, 'ai-forge-core-storytelling/SKILL.md'), 'utf8'), /name: ai-forge-core-storytelling/);
});

test('validates catalogs relative to the owning skill and detects missing bundled files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ai-forge-catalog-'));
  const skill = join(root, 'core/example');
  await mkdir(join(skill, 'references/standards'), { recursive: true });
  await writeFile(join(skill, 'SKILL.md'), '---\nname: ai-forge-core-example\ndescription: Example skill.\n---\n');
  await writeFile(join(skill, 'references/standards/index.md'), '<file path="references/standards/policy.md">Policy</file>\n');
  await writeFile(join(skill, 'references/standards/policy.md'), '# Policy\n');
  assert.deepEqual(await validate(root), { stacks: 0, skills: 1 });
  await rm(join(skill, 'references/standards/policy.md'));
  await assert.rejects(() => validate(root), /broken link references\/standards\/policy.md/);
});

test('rejects skill names that diverge from the installed AI-Forge identifier', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ai-forge-name-'));
  const skill = join(root, 'core/example');
  await mkdir(skill, { recursive: true });
  await writeFile(join(skill, 'SKILL.md'), '---\nname: example\ndescription: Example skill.\n---\n');
  await assert.rejects(() => validate(root), /name must be ai-forge-core-example/);
});

async function project(pkg) {
  const cwd = await mkdtemp(join(tmpdir(), 'ai-forge-init-'));
  if (pkg) await writeFile(join(cwd, 'package.json'), JSON.stringify(pkg));
  return cwd;
}

test('detects supported project markers', async () => {
  const cwd = await project({ dependencies: { fastify: '*' } });
  assert.equal(await detectStack(cwd), 'backend-node');
});

test('requires agent when no agent file exists', async () => {
  const cwd = await project({ dependencies: { react: '*' } });
  await assert.rejects(() => initProject({ cwd }), /specify --agent/);
});

test('creates both agent files', async () => {
  const cwd = await project({ dependencies: { vue: '*' } });
  const result = await initProject({ cwd, agent: 'both' });
  assert.equal(result.results.length, 2);
  assert.match(await readFile(join(cwd, 'CLAUDE.md'), 'utf8'), /Stack: `frontend-vue`/);
  assert.match(await readFile(join(cwd, 'AGENTS.md'), 'utf8'), /context --stack frontend-vue/);
});

test('preserves outside content, replaces block, and is idempotent', async () => {
  const cwd = await project({ dependencies: { react: '*' } });
  const path = join(cwd, 'CLAUDE.md');
  await writeFile(path, 'prefix\n\n<!-- ai-forge:start -->\nold\n<!-- ai-forge:end -->\n\nsuffix\n');
  await initProject({ cwd });
  const first = await readFile(path, 'utf8');
  assert(first.startsWith('prefix\n\n'));
  assert(first.endsWith('\n\nsuffix\n'));
  assert.doesNotMatch(first, /\nold\n/);
  await initProject({ cwd });
  assert.equal(await readFile(path, 'utf8'), first);
});

test('appends cleanly while preserving existing content', () => {
  const result = updateAgentContent('project rules\n', '<!-- ai-forge:start -->\nx\n<!-- ai-forge:end -->');
  assert.equal(result, 'project rules\n\n<!-- ai-forge:start -->\nx\n<!-- ai-forge:end -->\n');
});

test('rejects ambiguous stack detection', async () => {
  const cwd = await project({ dependencies: { react: '*', vue: '*' } });
  await assert.rejects(() => detectStack(cwd), /ambiguous markers.*specify --stack/);
});


test('discovers capability scopes without treating them as stacks', async () => {
  const scopes = await discoverScopes();
  for (const scope of ['design', 'quality', 'integrations', 'artifacts', 'frontend']) assert(scopes.includes(scope));
  assert.deepEqual((await listSkills('design')).map((skill) => skill.scope), ['design', 'design', 'design']);
  assert(!(await discoverStacks()).includes('design'));
  assert(!scopes.includes('template-stack'));
  assert(!(await listSkills()).some((skill) => skill.installName.includes('template-stack')));
});

test('routes planning and artifacts without backend architecture context', async () => {
  assert.deepEqual(await context(undefined, 'ai-forge-core-storytelling'), ['core/workflow.md', 'core/guardrails.md', 'core/storytelling/SKILL.md']);
  assert.deepEqual(await context(undefined, 'spreadsheets', ROOT, 'artifacts'), ['core/workflow.md', 'core/guardrails.md', 'artifacts/spreadsheets/SKILL.md']);
  await assert.rejects(() => context(undefined, 'project-standards'), /ambiguous skill/);
  await assert.rejects(() => context('backend-node', 'new-module', ROOT, 'design'), /either --stack or --scope/);
  await assert.rejects(() => listSkills('unknown'), /unknown scope/);
});

test('infers the stack context from a fully qualified skill identifier', async () => {
  const files = await context(undefined, 'ai-forge-frontend-nextjs-project-standards');
  assert(files.includes('frontend-nextjs/standards/index.md'));
  assert.equal(files.at(-1), 'frontend-nextjs/project-standards/SKILL.md');
});

test('CLI scope context works without a stack', async () => {
  const output = [];
  await run(['context', '--scope', 'quality', '--skill', 'web-testing'], { log: (line) => output.push(line) });
  assert(output[0].includes('quality/web-testing/SKILL.md'));
  assert(!output[0].includes('core/module-architecture.md'));
});

for (const [dependencies, expected] of [
  [{ next: '*', react: '*'}, 'frontend-nextjs'],
  [{ nuxt: '*', vue: '*'}, 'frontend-nuxt'],
  [{ astro: '*', react: '*', vue: '*'}, 'frontend-astro'],
  [{ '@angular/core': '*'}, 'frontend-angular'],
  [{ svelte: '*', '@sveltejs/kit': '*'}, 'frontend-svelte'],
  [{ '@nestjs/core': '*', fastify: '*'}, 'backend-nestjs'],
]) {
  test(`detects ${expected} before embedded framework dependencies`, async () => {
    assert.equal(await detectStack(await project({ dependencies })), expected);
  });
}

test('does not hide a genuinely ambiguous combination of meta-frameworks', async () => {
  const cwd = await project({ dependencies: { next: '*', nuxt: '*', react: '*', vue: '*' } });
  await assert.rejects(() => detectStack(cwd), /ambiguous markers/);
});

test('copy installation detects changed references even when SKILL.md is identical', async () => {
  const registry = await mkdtemp(join(tmpdir(), 'ai-forge-copy-drift-'));
  await installSkills({ registry, mode: 'copy' });
  const target = join(registry, 'ai-forge-backend-node-project-standards/references/standards/clean-code.md');
  await writeFile(target, 'stale reference');
  await assert.rejects(() => installSkills({ registry, mode: 'copy' }), /refusing to overwrite divergent skill/);
  await installSkills({ registry, mode: 'copy', force: true });
  assert.match(await readFile(target, 'utf8'), /Clean code/);
  assert((await installSkills({ registry, mode: 'copy' })).every((item) => item.status === 'unchanged'));
});

test('reference synchronization detects drift and brings the bundle back to its source', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ai-forge-sync-'));
  await mkdir(join(root, 'standards'), { recursive: true });
  await mkdir(join(root, 'core/example/references/standards'), { recursive: true });
  await writeFile(join(root, 'core/example/SKILL.md'), '---\nname: ai-forge-core-example\ndescription: Example skill.\n---\n');
  await writeFile(join(root, 'standards/index.md'), '<file path="standards/policy.md">Policy</file>\n');
  await writeFile(join(root, 'standards/policy.md'), '# Canonical policy\n');
  assert.equal((await syncReferences({ root })).length, 2);
  await syncReferences({ root, write: true });
  assert.deepEqual(await syncReferences({ root }), []);
  assert.match(await readFile(join(root, 'core/example/references/standards/index.md'), 'utf8'), /references\/standards\/policy.md/);
  await validate(root);
  await writeFile(join(root, 'standards/policy.md'), '# Updated policy\n');
  assert.equal((await syncReferences({ root })).length, 1);
});

test('CLI rejects a missing scope value instead of selecting an unrelated capability', async () => {
  await assert.rejects(() => run(['context', '--scope', '--skill', 'design-system']), /--scope requires a value/);
});

test('copied root router retains the MIT notice', async () => {
  const registry = await mkdtemp(join(tmpdir(), 'ai-forge-root-license-'));
  await installSkills({ registry, mode: 'copy' });
  assert.equal(await readFile(join(registry, 'ai-forge-root-router/LICENSE'), 'utf8'), await readFile(join(ROOT, 'LICENSE'), 'utf8'));
});

test('bundled optional research files match the recorded vendor snapshot', async () => {
  const { createHash } = await import('node:crypto');
  const vendor = join(ROOT, 'frontend/ui-engineering/vendor');
  const manifest = JSON.parse(await readFile(join(vendor, 'manifest.json'), 'utf8'));
  assert(manifest.files.length > 0);
  for (const file of manifest.files) {
    assert(!file.path.startsWith('/') && !file.path.split('/').includes('..'));
    const digest = createHash('sha256').update(await readFile(join(vendor, file.path))).digest('hex');
    assert.equal(digest, file.sha256, file.path);
  }
});

test('rejects a registry inside the source tree before copying or removing skills', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ai-forge-nested-registry-'));
  await writeFile(join(root, 'SKILL.md'), 'original source');
  await assert.rejects(() => installSkills({ root, registry: join(root, 'registry'), mode: 'copy', force: true }), /outside the AI Forge source tree/);
  assert.equal(await readFile(join(root, 'SKILL.md'), 'utf8'), 'original source');
});
