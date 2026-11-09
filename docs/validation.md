# AI Forge verification

- `npm test`: 32 automated checks passed. Covers discovery, routing, meta-framework precedence/ambiguity, copied/link installation, complete-tree drift, canonical reference synchronization, MIT preservation, vendor digests and rejection of a nested registry.
- `npm run validate`: 11 stacks, 45 installable skills; local catalogs and canonical reference bundles valid.
- Skill frontmatter validator: all 46 repository entrypoints passed, including the non-installed authoring template.
- Actual `npm pack` archive extracted into a temporary directory: CLI validation passed; 45 skills installed by copy, all with MIT notices; reinstall reported unchanged for every skill. The authoring template was excluded.
- Optional Python UI research: UX lookup, design-system lookup and React lookup completed locally; vendor Python files parsed and bundled hashes matched.
- Public-content checks: no personal absolute paths or stale harness skill/tool identifiers in entrypoints/curated references; no filesystem caches or platform metadata included.
- Manual decision-path review: independent core/design/artifact context; missing renderer/calculator/device/scheduler reported explicitly; no auto-delegation/publication authority; frontend public routes and framework-native server/client lifecycle retained.

These checks establish distribution integrity and specific CLI behavior. They do not prove all possible future model behavior, certify accessibility/security, or claim live office rendering, device, scheduler, browser-app, MCP or LLM-provider integration tests were executed.

## Overview, presentation and README

- `npm run docs:build` and `npm run docs:check`: all 45 installed IDs resolve and each has exactly one editorial entry; Markdown and HTML match the same source.
- `npm run validate` and `npm test`: repository catalogs valid; all 32 existing automated checks passed.
- Isolated headless Chrome: 45 cards rendered; search, area filter, zero-result/reset, command copy and manual-selection fallback, presentation keyboard navigation and exit verified without JavaScript errors.
- Desktop (1440 × 1000) and mobile (390 × 844) screenshots inspected. No horizontal overflow in the tested views, including an expanded skill entry.
- Actual package extracted: presentation, Markdown, editorial JSON and generator present; `docs:check` passed against the extracted files.

## Operational naming and local UI research

- Operational entrypoints, UI research guidance, README, overview and presentation reference AI Forge capabilities without naming other skill collections. Attribution and integrity records remain separate from task instructions.
- The AI Forge local research entrypoint was exercised with UX, React and design-system queries; actual result payloads were checked. Invalid/empty inputs were rejected.
- The copied research entrypoint performed a successful query without modifying the skill tree. The underlying implementation and recorded hashes were preserved.
