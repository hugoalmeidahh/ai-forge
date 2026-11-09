---
name: ai-forge-design-design-system
description: "Create or evolve design tokens, themes and component contracts while preserving the product brand, accessibility and existing styling stack."
---

# Design system

Locate the real tokens, components and brand guide first. A small UI fix should reuse the system; a new system should serve named product surfaces and tasks. Do not install Tailwind, shadcn, a font or a new component library solely because an example uses it.

## Workflow

1. Audit representative controls and recurring divergence. Identify token/component consumers before changing shared values.
2. Use primitive → semantic → component token layers where they solve actual variation. Components consume semantic roles; avoid aliases with no meaning and unnecessary tokens for every coordinate or zero.
3. Define color pairs, type roles, spacing, density, layering and motion. Themes map semantic roles; validate focus, error, disabled and selected states in each delivered theme.
4. Specify component purpose, semantic element, typed public API, valid variants, content limits, keyboard/focus behavior and loading/error states. Prefer composition over boolean combinations with impossible states.
5. Reuse mature accessible primitives for overlays/comboboxes when available, then test the final composition. A library's accessibility claim does not validate the finished screen.
6. Migrate consumers gradually with compatible aliases when necessary. Check representative pages and existing Storybook/examples, without adding a documentation platform for a small change.

## Deliver

Provide the actual tokens/components, usage examples and migration impact. Reference product/brand decisions and verification evidence. Avoid hardcoded aesthetic rules such as mandatory dark mode, fixed corner radius, section height or one palette for every product.
