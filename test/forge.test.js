import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import test from 'node:test';
import { context, detectStack, discoverStacks, initProject, installSkills, listSkills, ROOT, updateAgentContent, validate } from '../lib/forge.js';

test('discovers supported stacks only', async () => {
  assert.deepEqual(await discoverStacks(), ['backend-golang', 'backend-nestjs', 'backend-node', 'frontend-react', 'frontend-vue']);
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
  assert.equal(result.stacks, 5);
  assert(result.skills >= 19);
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
