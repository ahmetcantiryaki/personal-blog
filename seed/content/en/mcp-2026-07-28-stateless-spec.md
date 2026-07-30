---
title: "MCP 2026-07-28: The Move to a Stateless Core"
slug: "mcp-2026-07-28-stateless-spec"
translationKey: "mcp-2026-07-28-stateless-spec"
locale: "en"
excerpt: "MCP's July 2026 spec drops stateful sessions for a stateless core, adds multi round-trip calls, and hardens OAuth—breaking old servers within 12 months."
category: "ai"
tags: ["mcp", "claude", "api-design", "authentication"]
publishedAt: "2026-07-30"
seoTitle: "MCP 2026-07-28: Stateless Core and New Auth Rules"
seoDescription: "The MCP 2026-07-28 spec replaces stateful sessions with a stateless core, adds MRTR and caching, and hardens OAuth—here's what breaks and what to fix first."
---

On July 28, 2026, the Model Context Protocol team shipped its biggest spec revision since launch: MCP drops its bidirectional, session-based core for a stateless request/response model, retires the `initialize` handshake and `Mcp-Session-Id` header, and tightens OAuth in ways that will break existing servers if you don't act.

If you've never touched MCP before, our [explainer on what MCP actually is](/en/posts/model-context-protocol-explained) is a better starting point than this piece. Everyone else — read on, because the [official announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28/) and the [release-candidate writeup](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) both describe this as the protocol's most consequential update in its two-year history, and the authorization changes in particular are not optional reading for anyone running an MCP server in production.

## Why "stateless" is the headline

For its first two years, MCP worked the way a lot of RPC-over-HTTP protocols do when they're trying to feel like a persistent connection: a client and server shook hands via `initialize`/`initialized`, the server handed back an `Mcp-Session-Id`, and every subsequent request rode on that session. It worked, but it meant an MCP server had to remember who you were between requests — which is exactly the kind of thing that makes horizontal scaling annoying.

The 2026-07-28 spec removes that requirement entirely. Every request now carries its own protocol version, client identity, and capabilities in metadata, so there's nothing left for the server to "remember." Practically, that means you can now run MCP servers behind a plain round-robin load balancer with no shared session store, which in turn makes serverless and edge deployment genuinely viable — something that was possible but awkward under the stateful model. [The Register's coverage](https://www.theregister.com/devops/2026/07/23/model-context-protocol-prepares-to-break-with-its-stateful-past/) frames this correctly as MCP admitting its original transport design didn't scale the way production deployments needed it to.

## Multi round-trip requests replace the open-stream pattern

The old spec let servers push requests back to the client over a long-lived open stream — useful for things like "I need to ask the user a follow-up question mid-tool-call," but brittle in anything with a proxy, a timeout, or a load balancer in the middle. Multi Round-Trip Requests (MRTR) replace that with a much simpler loop: a tool call can return `resultType: "input_required"` describing what it still needs, and the client responds with a fresh call carrying the answer in `inputResponses`. No open connection required, no server-side state to babysit while it waits.

## Header-based routing and cacheable reads

Two smaller but genuinely useful changes ship alongside the core rework. First, requests must now include `Mcp-Method` and `Mcp-Name` HTTP headers, so a gateway or WAF can route and meter traffic by just reading headers instead of parsing every JSON body. Second, list and read responses now carry `ttlMs` and `cacheScope` fields, so clients can finally cache results properly instead of re-fetching a tool list on every single call — a small fix that will noticeably cut latency and cost for anything that calls `tools/list` more than it needs to.

```http
POST /mcp HTTP/1.1
Host: api.example.com
Mcp-Method: tools/call
Mcp-Name: schedule_meeting
Content-Type: application/json
Authorization: Bearer <token>

{
  "protocolVersion": "2026-07-28",
  "clientInfo": { "name": "acme-agent", "version": "3.1.0" },
  "params": { "name": "schedule_meeting", "arguments": { "attendee": "user@example.com" } }
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "resultType": "input_required",
  "requiredInputs": [{ "name": "preferredTime", "type": "string" }]
}
```

The client then retries with `"inputResponses": { "preferredTime": "2026-08-04T15:00:00Z" }` attached, and the call completes — no held-open stream in between.

## Tasks, Apps, and EMA get a real extensions framework

"Tasks" was previously an experimental bolt-on for long-running work that doesn't fit neatly into one request/response cycle. It's now a formal, versioned extension — `io.modelcontextprotocol/tasks` — with poll-based `tasks/get` and a new `tasks/update` operation. Notifications, which used to be scattered across several ad hoc message types, are consolidated into a single `subscriptions/listen` stream. The broader extensions framework also formally folds in MCP Apps (interactive UI extensions) and Enterprise Managed Authorization (EMA), which matters if you're building anything that touches enterprise identity systems — see the next section.

If you're building multi-tool agent systems on top of any of this, it's worth reading alongside our pieces on [context engineering for AI agents](/en/posts/context-engineering-for-ai-agents) and [multi-agent orchestration patterns](/en/posts/multi-agent-orchestration-patterns), since Tasks and MRTR both change the assumptions those patterns are built on.

## The part that actually breaks your deployment: authorization

This is the section to actually act on. The old MCP auth story leaned heavily on Dynamic Client Registration (DCR), which was fine for demos and prototypes but always felt like a workaround when you tried to point it at a real enterprise identity provider. The 2026-07-28 spec closes that gap, and closes it in ways that are not backward compatible by default:

- **RFC 9207 issuer validation is now required** before an authorization code can be redeemed for a token. Skip this and your token exchange simply fails against a compliant authorization server.
- **A new `application_type` parameter** at client registration explicitly supports localhost redirects for desktop and CLI apps — previously a hacky edge case, now a first-class path.
- **Client credentials are bound to the specific authorization server that issued them**, closing off credential reuse across issuers.
- **DCR is formally deprecated in favor of Client ID Metadata Documents (CIMD)**, with a 12-month backward-compatibility window before DCR support can be assumed gone.

Put together, this is MCP auth finally catching up to how production OAuth 2.0/OIDC already works against providers like Entra ID or Okta, and it removes a pile of workarounds MCP server builders had been quietly maintaining. It's the right direction. My honestly mixed take: the 12-month DCR→CIMD window is generous enough that nobody will feel pressure to move for the first nine of those months, and then everyone will migrate in month eleven under deadline stress — which is exactly what happened with plenty of other OAuth-adjacent deprecations. If you run an MCP server against any real identity provider, put CIMD migration on your roadmap now, not when the deprecation warning becomes a hard failure.

## Old vs. new, side by side

| Dimension | Pre-2026-07-28 (stateful) | 2026-07-28 (stateless) |
|---|---|---|
| Session model | `initialize`/`initialized` handshake, `Mcp-Session-Id` header persists across requests | No session; each request carries version, identity, and capabilities in metadata |
| Server-initiated requests | Pushed over a long-lived open stream | Multi Round-Trip Requests (MRTR) via `resultType: "input_required"` + `inputResponses` |
| Request routing | Gateways must parse the JSON body to route/meter | `Mcp-Method` and `Mcp-Name` headers enable routing without body inspection |
| List/read caching | No TTL metadata; clients re-fetch repeatedly | Responses carry `ttlMs` and `cacheScope` for proper client-side caching |
| Auth / client registration | Dynamic Client Registration (DCR), no mandatory issuer validation | CIMD (DCR deprecated, 12-month window), RFC 9207 issuer validation required, credentials bound to issuing authorization server |

## Ecosystem readiness

All four Tier-1 SDKs — TypeScript, Python, Go, and C# — support 2026-07-28 at launch, with the Rust SDK still in beta and migration guides published for the breaking changes. That matters because MCP isn't a niche protocol anymore: it's passed 400 million monthly SDK downloads, a 4x increase over the past year, and press coverage now routinely calls it [the industry-standard way to connect AI agents to tools and applications](https://mpost.io/anthropic-releases-largest-mcp-update-yet-moving-protocol-to-stateless-core-for-enterprise-scale/). Anthropic's own Claude ecosystem lists 950+ MCP servers in its connectors directory, used by millions of people daily, and Anthropic has published its own guidance for bringing 2026-07-28 into Claude Code, Claude Desktop, and the API — so this isn't a spec change happening at arm's length from the tools most developers actually use.

If you're building agents that lean on subagents or nested delegation, it's also worth checking how this interacts with patterns we've covered in [Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents) and [nested subagents at depth 3](/en/posts/claude-code-nested-subagents-depth-3) — MRTR in particular changes how you should think about mid-task user input across a delegation chain.

As of late July 2026, this is genuinely fresh: the spec is two days old as I write this, SDKs just landed, and most production servers haven't migrated yet. That's a narrow but real window to get ahead of the auth changes before they become urgent.

## Frequently Asked Questions

### Do I need to rewrite my MCP server today?

Not today, but soon. The stateless core, MRTR, and header changes require code changes whenever you next touch your server's transport layer, and the deprecations (Roots, Sampling, Logging, legacy HTTP+SSE) carry a 12-month minimum migration window — so there's runway, but not indefinite runway.

### What happens to servers still on the old spec?

They keep working against clients that still speak the old protocol version, since deprecated features aren't ripped out overnight. But new clients built against 2026-07-28, and any authorization server that starts enforcing RFC 9207 issuer validation, will eventually stop accepting old-style DCR flows — so "still working" has an expiration date.

### Does this affect end users of Claude, or only developers?

Mostly developers and server operators. End users of Claude Code, Claude Desktop, or the API shouldn't notice a functional difference, though Anthropic's own migration guidance suggests the rollout into Claude's products is actively underway.

### What's the single most urgent thing to fix first?

Authorization. If your MCP server talks to a real identity provider, start planning the DCR-to-CIMD migration and confirm your token exchange handles RFC 9207 issuer validation now, before it's a production outage instead of a planned change.
