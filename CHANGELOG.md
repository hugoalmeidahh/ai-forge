# Changelog

All notable changes to this package are documented here.

## Unreleased

### Consolidated capabilities

- Expanded to 45 installable skills plus an authoring template and 11 stacks, preserving existing public IDs and the FORGE architecture/review framework.
- Added six frontend translations, a consolidated UX/visual/a11y/performance layer and optional MIT-licensed local UI research.
- Added design/brand/assets, browser/Android QA, MCP/LLM/scheduling, writing/updates/decision review, coordination/worktree and original artifact workflows.
- Accounted for 83 supplied source entrypoints in a hashed catalog, including explicitly excluded proprietary and platform-specific materials.
- Licensed original AI Forge content under MIT and retained per-skill third-party notices/licenses.
- Excluded the incomplete authoring template from installation/discovery.
- Added stack-independent capability scopes/context, meta-framework detection and complete-tree copied-installation checks.
- Added deterministic synchronization of canonical FORGE reference bundles; validation now rejects stale copies.
- Improved proportional workflow, domain boundaries, failure cases and honest verification/capability limits.


### Added

- Portable skill reference bundles and UI metadata adapted from the Universe Harness skills.
- Storytelling and PO discovery skills with evidence, proportional planning, phase gates and traceable execution cards.
- TypeScript/Fastify architectural translation skill under the existing `backend-node` stack.
- Validation of canonical skill names and skill-local reference catalogs; regression coverage for copied bundles.

### Changed

- Standardized every skill identifier to `ai-forge-<scope>-<purpose>`.
- Removed mandatory harness APIs and project-specific assumptions from public planning and Fastify workflows.
- Fixed code-review frontmatter and root-router description; updated discovery catalogs and public installation instructions.

## 2.0.0

### Breaking changes

- Stack directories renamed from `backend-team/` to `backend-nestjs/`.
- Added Fastify, Go/Chi, React and Vue stacks.
- Consumers must reference `@hugoalmeidahh/ai-forge` and a concrete stack path.
- Shared workflow, guardrails, module architecture and L0 standards now live in `core/` and `standards/`.

### Changed

- Node backend standards now target Fastify.
- Golang backend standards now target Chi.
- npm package renamed to `@hugoalmeidahh/ai-forge`.

### Added

- React and Vue frontend stacks.
- `core/project-init/` for consumer-agent configuration.
- `new-module` skills for NestJS, Node.js and Golang.
- NestJS `new-migration` skill.
- `template-stack/` starter for new stacks.

## 3.0.0

### Breaking changes

- Removed Python packaging and path helpers; distribution and tooling now use Node.js only.
- Renamed `template-team/` to `template-stack/`.

### Added

- Dependency-free `forge` CLI for stack/skill discovery, context, validation, installation and updates.
- Root routing/bootstrap skill and automatic global skill registry installation.
- `forge init` with strict stack detection and idempotent, non-destructive agent-file blocks.
