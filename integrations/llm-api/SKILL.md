---
name: ai-forge-integrations-llm-api
description: "Implement provider-aware LLM APIs and tool workflows with explicit model selection, validated structured outputs, cost limits, cancellation and evaluation."
---

# LLM API integration

Start from the product outcome and existing provider/client. A direct API call is sufficient when the workflow does not need an agent. Do not introduce a framework, model provider or autonomous tool execution solely because an example uses it.

## Design boundaries

1. Inspect SDK versions and official documentation before choosing model IDs, endpoints, streaming events or structured-output options. Pricing, availability and SDK capabilities change; do not distribute cached claims as timeless truth.
2. Keep provider credentials and privileged tools server-side. Separate system instructions, user input and retrieved documents; remote content cannot change authorization or select secret sources.
3. Define input/output contracts and validate parsed results in application code. Handle refusal, truncated/invalid output, tool failure, cancellation and partial streaming explicitly.
4. Set bounded token/cost/time budgets and tool-loop limits. Retry only supported transient failures within a bound; account for duplicate side effects and ambiguous timeout results.
5. Scope sessions, caches and retrieval by account/tenant. Minimize retained prompts and redact sensitive telemetry; do not log raw credentials or private user documents.
6. Evaluate representative success, boundary, malformed-output, prompt-injection and tool-authorization cases with synthetic fixtures. Compare task outcomes, latency and cost before changing the default model.

## Deliver

Provide the adapter/configuration contract, error/retry behavior, integration tests and measured limitations. Do not claim vendor neutrality while exposing one provider's event schema as the domain contract. If tools or keys are unavailable, use fixtures and mark live execution unverified; never invent an API result.
