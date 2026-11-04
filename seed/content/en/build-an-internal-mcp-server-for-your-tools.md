---
title: "Build an Internal MCP Server for Your Company Tools"
slug: "build-an-internal-mcp-server-for-your-tools"
translationKey: "internal-mcp-server-company-tools-2026"
locale: "en"
excerpt: "Short answer: wrap internal APIs as least-privilege MCP tools, pass the caller's identity through, and log every call — that gives agents auditable access."
category: "devops-cloud"
tags: ["mcp", "ai-agents", "ai-infrastructure", "authentication", "observability"]
publishedAt: "2026-11-04"
seoTitle: "How to Build an Internal MCP Server"
seoDescription: "When does a private MCP server beat ad-hoc scripts? A step-by-step guide to scoped auth, identity passthrough, the stateless MCP spec, and audit logging."
---

Short answer: once your AI agents touch three or more internal systems and you need a record of who accessed what, when, build a dedicated MCP server instead of wiring up ad-hoc scripts. The server turns your internal APIs into least-privilege tools, carries the calling user's identity end to end, and logs every call in one place.

## When does a private MCP server beat ad-hoc scripts?

The ad-hoc approach — bolting a Python script or shell command onto each agent — works fine for one developer talking to one system. It breaks down past three thresholds: multiple teams start hitting the same internal system with different scripts, you need to prove after the fact which data an agent touched, and different users need different permission levels on the same system.

Once any of those three thresholds is crossed, a single MCP server centralizes the maintenance burden: a permission rule changes in one place, and every agent picks it up at once. As of 2026, MCP (the Model Context Protocol) is an open standard now stewarded by the Agentic AI Foundation rather than locked to one vendor, which makes it a durable integration layer rather than a bet on a single company's roadmap. If you haven't written an MCP server before, [building your first MCP connector](/en/posts/build-your-first-mcp-connector) on a small, single-system example is a lower-risk starting point than jumping straight into a multi-system internal deployment.

## How do you design a least-privilege MCP tool?

Least-privilege design means each MCP tool does exactly one job and carries only the minimum data scope that job needs. Instead of a generic "run SQL against the database" tool, define a narrow tool like "get_order_status" with tightly bounded parameters.

In practice that means fixing, at the schema level, which table, which columns, and which row range a tool can touch — the agent cannot step outside that scope even if it tries. Here's a JSON schema for an order-status tool:

```json
{
  "name": "get_order_status",
  "description": "Returns the status of a single order, scoped to orders owned by the requesting user.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string" }
    },
    "required": ["orderId"]
  }
}
```

The authorization check is baked into the tool's implementation here: the `orderId` parameter alone can't let a caller see someone else's order, because the server separately verifies the calling identity owns that order before returning anything.

## How does identity passthrough actually work?

Your MCP server needs to reach internal systems using the calling user's identity, not its own blanket service token — otherwise every agent call runs with whatever permission level the server itself holds. In OAuth 2.1-based flows, this is the token-exchange pattern (RFC 8693): you swap the caller's token for a downstream-scoped one that carries their identity into the target system.

Static service tokens (fixed API keys) are fine only for non-human, fixed-scope background jobs; any agent call acting on a user's behalf needs that user's identity verified separately. Skip that distinction and hide all agent traffic behind one service account, and your audit log loses its value — "who did this" now has only one possible answer: "the agent."

| Approach | Identity passthrough | Audit quality | Fits |
|---|---|---|---|
| Static service token | None | Low (everything shows as "bot") | Fixed, non-human batch jobs |
| OAuth token exchange | Per-user | High | Agents acting on a user's behalf |
| Per-user service account | Per-user, pre-provisioned | Medium-high | Small, fixed set of users |

## Why did MCP become stateless?

MCP's July 28, 2026 specification revision made the protocol stateless: the `initialize` handshake and the `Mcp-Session-Id` header are gone, and every request now carries its own protocol version, either in the `MCP-Protocol-Version` header or the `_meta` field. That change lets MCP servers scale horizontally the way ordinary REST APIs do — a load balancer no longer has to pin a request to the same server instance every time.

Under the stateless model, application state — say, intermediate results in an agent chain — moves to the application layer as an explicit handle passed between calls, instead of living inside a protocol session. For an internal deployment, the practical payoff is simple: you can run your MCP server as multiple Kubernetes replicas behind a plain ingress or API gateway, with no sticky-session configuration required.

Deployment usually takes one of two shapes: as a microservice inside the company network, behind a service mesh, or behind an API gateway for external access, protected by mTLS and corporate SSO. Either way, the gateway layer can route on the `Mcp-Method` and `Mcp-Name` headers that became mandatory under SEP-2243, without parsing the request body at all.

## How do you make every tool call auditable?

An audit log needs at least five fields per call: the calling user's identity, the tool name invoked, the input parameters (with sensitive values masked), a summary of the returned result, and a timestamp. Keeping that log inside the MCP server itself — a layer the agent can't touch — matters: otherwise an agent could end up with a log that simply says it never made the call.

Writing that log to an append-only table or a centralized collector (OpenTelemetry works well here) makes life easier for both security and cost tracking. [The guide to making AI token spend visible by team](/en/posts/ai-finops-token-spend-visibility) covers a complementary angle: feeding these same call logs into cost reporting.

A quarterly review cadence is worth setting up: a report showing which tools went completely unused (candidates for removal), which got called most often (your scaling and performance priority), and which users called tools at unusual hours (a possible anomaly worth a look).

## Why does Claude Code's managed MCP feature simplify rollout?

As of Claude Code 2.1.259 and later, organizations can centrally pin which MCP servers are available using the `managedMcpServers` setting or a `managed-mcp.json` file, which overrides every user-level configuration. That means you can stop developers from adding arbitrary MCP servers on their own laptops and force everyone onto the servers IT has actually approved.

This dramatically simplifies the rollout step after you've built your server: you add it to `managed-mcp.json` once, and no developer has to hand-edit their own `.mcp.json`. `allowedMcpServers` and `deniedMcpServers` lists let you further restrict which teams can reach which servers — and a deny entry always wins over an allow entry. You can expose the same server to [agents wired safely into your CI/CD pipeline](/en/posts/ai-agents-in-cicd-safely) through that same `managed-mcp.json`, so a pipeline agent runs under the exact same audit and permission rules. Keeping an [AGENTS.md file](/en/posts/agents-md-make-repo-readable-to-ai) in the repo that owns these tools also documents, for human developers, why each internal tool exists.

My take: most teams treat MCP as an experimental integration first and leave audit logging for later, but flipping that order is cheaper — fix your log schema before you add tools, not after. Bolting logging on afterward leaves a gap period with zero record of what agents touched. For more on this space, browse the [DevOps & Cloud](/en/category/devops-cloud) category.

## Frequently Asked Questions

### What's the difference between an MCP server and an API gateway?

An API gateway routes requests and enforces rate limits; an MCP server turns internal systems into structured "tool" definitions — name, schema, description — that an agent can understand and call. The two complement each other: an MCP server typically runs behind a gateway, not instead of one.

### Do you need a separate MCP server for every internal API?

No — one MCP server commonly exposes several internal systems as different tools. The real dividing line is who maintains the server and which team controls its permission rules; systems with very different ownership are usually better split into separate servers.

### Which SDKs can you use to build an MCP server?

Official MCP SDKs exist for TypeScript, Python, Java, Kotlin, and C#; SDK versions aligned with the July 28, 2026 spec revision (the .NET SDK's v2.0 release, for example) support the stateless transport. Whichever language you pick, letting the SDK handle schema validation is more reliable than writing that validation by hand.

### How long should you retain audit logs?

That depends on your company's compliance requirements, but regulated sectors like finance and healthcare commonly require at least a year, while 90–180 days is a common internal-IT starting point. When setting a retention window, answer a concrete "when would we actually look back at this log" scenario — an audit, a security incident, or debugging — rather than picking a number arbitrarily.
