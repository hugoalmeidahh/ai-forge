---
name: ai-forge-quality-web-testing
description: "Verify web interactions, accessibility states and visual regressions using the available browser or project test runner; produce reproducible evidence."
---

# Web testing

Start from the acceptance criteria, actual application URL, declared runner and synthetic test data. Testing a viewport is web QA; it is not Android/device QA. Inspect the rendered state before selecting an action.

## Scope and execution

1. Reproduce the changed user journey and identify the expected observable result. Inspect the existing test suite before choosing a runner or adding dependencies.
2. Use the existing browser connector or Playwright/Cypress/test runner. Do not invent browser capabilities. If unavailable, run meaningful static/build checks and mark interactive checks unverified.
3. Use role/name/label locators when possible. Wait for observable readiness: a loaded record, enabled action or specific response. Avoid unconditional sleeps and `networkidle` as a universal hydration check; polling can prevent idle indefinitely.
4. Exercise the happy path plus relevant validation, recoverable failure, authorization and empty states. For mutations, verify the persisted/resulting state and duplicate-submission behavior.
5. Check keyboard/focus, narrow and wide layouts, long content and any changed theme. Reuse approved screenshot baselines; do not blindly accept updates to make failures pass.
6. Record route, build, fixture, action, expected/observed result and screenshot/log where available. Redact sensitive data. A screenshot proves appearance, not persistence or authorization.

## Process ownership

Start only required local processes with the project's declared command. Track their process handles and stop only those started for this task. Do not kill processes by generic name, overwrite an occupied port or install browsers silently. Existing authorization still applies to production writes, publication and external messages.

## Report

Separate passed, failed and not run. Each finding needs reproduction, location, impact and a concrete proposed correction. Report performance as measured in a specified environment; local lab results do not establish field Core Web Vitals or full WCAG conformance.
