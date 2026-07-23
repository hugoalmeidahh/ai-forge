# Changelog

All notable changes to this package are documented here.

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
- `template-team/` starter for new stacks.
