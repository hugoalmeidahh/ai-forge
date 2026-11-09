# Skill consolidation and capability boundaries

45 skills are installable; the authoring template is packaged for creating stacks but excluded from discovery and installation.

## Naming and layers

Keep the established `ai-forge-<area>-<technology-or-purpose>-<action>` identifiers, omitting redundant segments. Examples: `ai-forge-backend-golang-new-module`, `ai-forge-frontend-nextjs-project-standards`, `ai-forge-quality-web-testing`. Creating a domain module is more meaningful than naming a skill after creating an empty folder. Registry directories match the full ID; repository folders remain `<scope>/<purpose>` for discoverability.

| Layer | Scope | Responsibility |
|---|---|---|
| L0 | standards | Naming, clean code, security, observability and verification |
| Core | core | Architecture, review, intake/discovery, writing, coordination and workspace lifecycle |
| L2 | backend-* / frontend-* | Native technology translation and domain contracts |
| Product/interface | frontend / design | UX, design systems, brand and original assets |
| Verification | quality | Browser and Android evidence, with real capability discovery |
| Connectivity | integrations | MCP, LLM adapters and scheduling contracts |
| Files | artifacts | Original document/spreadsheet/slide/PDF workflows; compatible generator/renderer required |
| L3 | consuming project | Existing architecture, rules, tools and explicit user scope win |

## Decisions from the supplied collections

| Input | Decision |
|---|---|
| Existing AI Forge skills | Enrich rather than duplicate; preserve FORGE five pillars, domain ownership, typed/validated boundaries and traceable business rules |
| Universe frontend + frontend standards + Taste + UI/UX Pro Max | Consolidate common UX/a11y/performance/visual guidance; add six real stack translations; retain optional local search with licenses and digests |
| Overlapping design/brand/theme/banner/icon/canvas/GIF skills | Group into design-system, brand-guidelines and visual-assets with mode-specific constraints; no mandatory provider, palette or package |
| Web testing | Real rendered-state/observable assertions; no unconditional network-idle or fixed sleep as proof |
| MCP and API manuals | Narrow server contracts and provider-aware LLM adapters; current SDK/docs, budgets, tool authorization and failure tests |
| Authoring, coauthoring, updates and reflection | Focused create-skill, write-document, project-update and requested decision-review workflows; avoid universal prompts or automatic messages |
| Harness roles, boards, worktrees, Android and routines | Portable capability discovery, ownership, reconciliation, QA evidence and explicit unavailable states; no fictitious MCP names or role escalation |
| Proprietary office skills | Excluded all source/scripts/assets; original artifact contracts require installed tools and honest render/calculation limits |
| Academy promotion and templates | Excluded as separate skills; no distinct development outcome or guaranteed redistribution license |

Every source entrypoint is accounted for in [source-catalog.json](source-catalog.json). This is a capability consolidation, not a mirrored vendor repository. Scripts and assets not selected are not implied to exist.

## Reliability and verification

The CLI discovers scopes independently of technology stacks and resolves core/design/artifact context without requiring a fictitious backend. Meta-framework detection takes precedence over embedded runtimes while preserving real ambiguity. Copied installation compares the entire skill tree, including references, metadata and license files, before reporting unchanged.

`forge sync-references` checks bundled canonical FORGE standards; `--write` repairs known copies from the source. It does not rewrite curated UI guidance or vendor data. Run this before validation/packaging when shared rules change.

Verification covers stack routing, scope/context resolution, reference drift, copied/link installation, license/vendor manifests, source-catalog completeness and package extraction. Optional UI search is smoke-tested locally. Automated checks validate structure and runtime contracts; they do not certify the behavior of every future model/runtime, accessibility compliance, generated office layout, device tests or production integrations. Those require task-specific execution evidence.
