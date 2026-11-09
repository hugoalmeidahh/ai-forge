---
name: ai-forge-artifacts-documents
description: "Create or edit Word-compatible documents with structural preservation, explicit revision handling and rendered layout verification."
---

# Documents artifacts

Inspect the source format, sections, styles, tables, headers/footers and requested revision mode. Preserve content outside the change. Track edits/comments only when requested and supported; do not claim tracked changes for plain rewritten text.

Use an available document connector/library that supports the required operation. Do not claim a bundled office toolkit exists. For substantial content work, use `ai-forge-core-write-document` when available. Keep heading semantics, readable tables and accessible image descriptions where supported.

Save to a new output path unless overwriting is authorized. Reopen the file to check package integrity and content. Render through an available compatible office engine, inspect all affected pages and fix overflow, broken tables or headers. If rendering is unavailable, say so; XML validity does not establish pagination fidelity.

## Output contract

Deliver the actual file in the requested format with a path/link, changed content and checks performed. Keep input documents and private metadata out of public commits. Discover required libraries/renderers before promising a result; install only within the task authorization. If the environment lacks a required capability, report the limitation and provide useful source/intermediate output without claiming the final artifact was verified.
