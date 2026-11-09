---
name: ai-forge-root-router
description: Route development, planning, review, UX, design, QA, integration and artifact tasks to the relevant AI Forge capabilities and project standards.
---

# AI-Forge Router

## Intent

Locate AI-Forge, identify the project stack, then load only the standards and skill needed for the task.

## Bootstrap and routing

1. Locate the CLI in the project (`node_modules/.bin/forge`), current checkout (`node bin/forge.js`) or the known user checkout. Use the actual discovered path; do not claim an installation exists.
2. Run `forge scopes` / `forge skills` and select by requested outcome. For code, detect the stack from real dependencies/configuration, choosing a meta-framework before its embedded React/Vue runtime. Plain HTML uses explicit `frontend-html-css` when automatic evidence is insufficient.
3. Run `forge context --skill <full-id>` for independent capabilities, or `forge context --stack <stack> --skill <local-name>` for stack-specific work. Read emitted files in order; load further references on demand.
4. If absent, provide the supported public installation instructions. Installing globally or replacing divergent skills follows the task's existing authorization.

| Outcome | Capability |
|---|---|
| Structure an idea or requirements | `ai-forge-core-storytelling`, then `ai-forge-core-po-discovery` when needed |
| Architecture, endpoint or module | Selected stack's `project-standards` / `new-module` |
| User journey, interface or visual redesign | `ai-forge-frontend-ui-engineering` plus actual stack standards |
| Tokens/components or brand rules | `ai-forge-design-design-system` / `ai-forge-design-brand-guidelines` |
| Banner, poster, icon, generative graphic or GIF | `ai-forge-design-visual-assets` |
| Browser verification | `ai-forge-quality-web-testing` |
| Code review | `ai-forge-core-code-review` plus relevant stack references |
| MCP server or LLM application adapter | `ai-forge-integrations-mcp-server` / `ai-forge-integrations-llm-api` |
| Technical writing, project update or decision critique | `ai-forge-core-write-document`, `ai-forge-core-project-update`, `ai-forge-core-decision-review` |
| Word, spreadsheet, presentation or PDF file | Matching `ai-forge-artifacts-*`; discover available generators/renderers first |
| Agent configuration or skill authoring | `ai-forge-core-project-init`, `ai-forge-core-onboarding-check`, `ai-forge-core-create-skill` |

## Boundaries

Project L3 wins over L2 and L0. Use FORGE domain ownership, clean code, explicit contracts and safe failures where relevant; do not impose a backend module tree on a poster, script or small static page. Never invent tools, assets, models, approvals or completed checks. Missing optional capabilities degrade to an explicit useful partial result; missing required access/decision is reported concretely.
