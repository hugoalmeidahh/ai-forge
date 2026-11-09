---
name: ai-forge-artifacts-pdf
description: "Read, create or modify PDFs with traceable extraction, preserved page/form behavior and rendered visual inspection."
---

# Pdf artifacts

Determine whether the task is extraction, page manipulation, form filling or document authoring. Inspect actual pages/text and whether content is scanned. Use an available PDF library/connector; OCR output is uncertain and must be checked for important identifiers and numbers.

Preserve page geometry, orientation and existing form/signature behavior relevant to the task. Do not bypass a document's access controls or claim a digital signature remains valid after editing. Use authorized passwords through the environment's supported mechanism, never public examples or logs.

For new content, use proper text/layout primitives and embedded/licensed fonts when needed. Reopen the result, verify page count/text/form values, render affected pages and inspect clipping/ordering. Removal from visible rendering alone is not verified redaction: inspect extraction and underlying content when redaction is requested.

## Output contract

Deliver the actual file in the requested format with a path/link, changed content and checks performed. Keep input documents and private metadata out of public commits. Discover required libraries/renderers before promising a result; install only within the task authorization. If the environment lacks a required capability, report the limitation and provide useful source/intermediate output without claiming the final artifact was verified.
