---
name: ai-forge-artifacts-spreadsheets
description: "Create or modify spreadsheets with preserved formulas/types, explicit calculation semantics and verified data/results."
---

# Spreadsheets artifacts

Inspect sheet names, ranges, headers, data types, formulas, names and external links before changing cells. Identify units, dates/timezone, null handling and source-of-truth rules. Preserve unrelated sheets and formulas; do not replace formulas with cached values as an incidental simplification.

Use an available spreadsheet connector/library and its actual formula support. Keep imported untrusted strings from becoming formulas unless that is intended. Never execute workbook macros or fetch external links merely to inspect a file.

Compute/verify expected results using the selected calculation engine or independent known cases. A library that writes formulas may not calculate them. Report whether recalculation occurred and inspect error cells, totals and changed chart ranges. Save and reopen the artifact; inspect the changed ranges visually when supported. Do not claim recalculated results from stale caches.

## Output contract

Deliver the actual file in the requested format with a path/link, changed content and checks performed. Keep input documents and private metadata out of public commits. Discover required libraries/renderers before promising a result; install only within the task authorization. If the environment lacks a required capability, report the limitation and provide useful source/intermediate output without claiming the final artifact was verified.
