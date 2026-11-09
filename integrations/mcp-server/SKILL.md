---
name: ai-forge-integrations-mcp-server
description: "Build or review MCP servers with focused tool contracts, bounded results, correct authorization and protocol-level tests against the selected SDK version."
---

# MCP server integration

Use the official MCP specification and the SDK version already selected by the project. Separate the protocol adapter, application use cases and external provider clients. Apply the project's FORGE backend standards to application code.

## Contract before implementation

- Identify the actor, target service, required workflows and least privilege. Distinguish read-only resources, reusable prompts and tools with effects.
- Choose tool boundaries around user intent; avoid both a generic arbitrary-command tool and hundreds of redundant wrappers. Names and descriptions must distinguish similar operations.
- Validate input and output schemas; bound query size, pagination, response payloads, timeout and concurrency. Return stable machine-readable errors without leaking secrets.
- Tool annotations/descriptions are advisory; enforce identity, permissions and tenant ownership on the server. Treat tool arguments and remote content as untrusted data, never as higher-priority instructions.
- Keep credentials server-side and audience/transport checks consistent with the chosen specification. No token passthrough across unrelated audiences.

## Implementation and proof

1. Pin the protocol/SDK version and inspect official examples for the selected transport. Do not invent imports or transport APIs from another major.
2. Reuse provider clients with bounded timeouts and explicit retry policy. Non-idempotent writes need a deduplication/idempotency contract before retries.
3. Test schema rejection, pagination boundaries, authorization failure, tenant isolation, provider timeouts and safe error mapping.
4. Run a local protocol client/inspector when available. A function unit test does not prove a transport handshake or tool discovery.
5. Use synthetic fixtures for evaluations and report which paths were executed. Do not run destructive tools against production just to prove the integration.

Reference: [official server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts). Confirm the specification and SDK docs for the installed version before implementation.
