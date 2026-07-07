---
title: "Model Context Protocol (MCP) Explained"
slug: "model-context-protocol-explained"
translationKey: "model-context-protocol-explained"
locale: "en"
excerpt: "Model Context Protocol explained for 2026: MCP is now a Linux Foundation standard, and the July release candidate deletes the stateful session you learned."
category: "ai"
tags: ["mcp", "ai-agents", "llm", "integration"]
publishedAt: "2026-07-07"
seoTitle: "Model Context Protocol (MCP) Explained"
seoDescription: "Model Context Protocol explained with current 2026 facts: primitives, transports, the 2025-11-25 spec, the stateless 2026-07-28 release candidate, and a working server."
---

Almost every MCP tutorial teaches the same origin story: the Model Context Protocol is a *stateful* client-server session over JSON-RPC that opens with an `initialize` handshake. Memorize the handshake, memorize the session ID, and you understand MCP. Here's the uncomfortable part — as of the 2026-07-28 release candidate, that handshake is being deleted.

So here's the **Model Context Protocol explained** honestly: the mental model survives, the wire mechanics are being rebuilt underneath it. MCP is an open standard that lets AI models connect to external tools, data, and services through one interface instead of a bespoke integration per model-and-tool pair. Anthropic introduced it in November 2024. In December 2025 Anthropic [donated it to the Linux Foundation's new Agentic AI Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), with OpenAI, Google, and Microsoft as co-sponsors. It stopped being "Anthropic's protocol" the moment its biggest rivals started co-maintaining the spec.

## What the Model Context Protocol actually is

Strip away the hype and MCP is a discovery-and-invocation protocol. Instead of hard-coding how each app talks to each tool, you expose a tool once as an MCP server, and any MCP-compatible client can find it, read its schema, and call it. One interface, many consumers.

The problem it solves is the **M×N integration explosion**. Before MCP, wiring `M` AI apps to `N` tools meant up to `M × N` custom connectors. MCP collapses that to `M + N`: each app writes the client side once, each tool writes the server side once, and they interoperate. Same move USB, ODBC, and the Language Server Protocol made in their domains.

That thesis is why adoption went vertical. Per Anthropic's December 2025 update, MCP crossed **10,000+ active public servers** and **97M+ monthly SDK downloads**, and the official Registry listed roughly 9,650 server records by late May 2026. This is no longer an experiment.

## How the Model Context Protocol works (and what's changing)

Today's [stable spec (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/changelog) still uses a stateful client-server architecture over JSON-RPC 2.0. Three roles:

- **Host:** the AI app the user talks to — Claude Desktop, an IDE assistant, a custom agent. It holds the LLM and orchestrates.
- **Client:** a connector inside the host that keeps one dedicated session per server.
- **Server:** a lightweight program exposing capabilities — a GitHub server, a Postgres server, a filesystem server.

Ask an assistant to "list my open pull requests" and the flow runs like this:

1. The host launches an MCP client for each configured server.
2. Client and server complete an **initialize** handshake, exchanging protocol versions and capabilities.
3. The client calls `tools/list`; the server returns tools with a JSON Schema for each.
4. The host passes those tool definitions to the LLM as context.
5. The model emits a structured call, e.g. `list_pull_requests`.
6. The client sends a `tools/call` over JSON-RPC.
7. The server hits the GitHub API and returns a structured result.
8. The host feeds that back to the model, which writes the answer.

Now the contrarian bit. The [**2026-07-28 release candidate**](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) (locked May 21, 2026, final spec shipping July 28) makes MCP *stateless*. It removes the `initialize` handshake and the `Mcp-Session-Id` header entirely. Client info and capabilities travel in a `_meta` field on every request, a new `server/discover` method replaces upfront capability exchange, and any request can land on any server instance — no sticky routing, no shared session store, just a round-robin load balancer. My honest take: it's the right call, and it quietly admits the original stateful design was built for a single desktop process, not horizontal fleets. If you learned MCP as "a stateful session," you learned the version on its way out.

## The MCP primitives, current as of 2026

MCP defines three server-side primitives and three client-side ones. Knowing which is which saves hours when you build a server.

| Primitive | Side | Controlled by | Purpose |
|-----------|------|---------------|---------|
| Tools | Server | Model | Executable functions the LLM calls (query a DB, send an email) |
| Resources | Server | Application | Read-only context the host loads (files, records, docs) |
| Prompts | Server | User | Reusable templates users trigger (slash commands, workflows) |
| Sampling | Client | Server | Server asks the host's LLM to generate text — now with tool-calling support |
| Elicitation | Client | Server | Server requests structured input from the user mid-task |
| Roots | Client | Application | Declares the filesystem/URI boundaries a server may touch |

The distinction that matters most: **tools are model-controlled** (the LLM decides when to call them) while **resources are application-controlled** (your host code decides what to load). Mixing these up is the single most common design mistake I see in new servers.

The 2025-11-25 revision added several things worth knowing. Sampling gained `tools` and `toolChoice`, so a server-initiated completion can itself call tools. Tools, resources, and prompts can now expose **icons** as metadata. Elicitation added URL mode and standards-based enums. And there's experimental support for **async Tasks** — durable, long-running requests you poll for a deferred result, which the 2026-07-28 RC promotes to a full extension.

## stdio vs Streamable HTTP: which transport

Picking a transport is a deployment decision, not a coding one. Both carry identical JSON-RPC messages.

| Transport | Where it runs | Best for | Auth model |
|-----------|---------------|----------|------------|
| stdio | Local subprocess of the host | Filesystem, git, desktop tools; lowest latency | Inherits local process trust |
| Streamable HTTP | Independent HTTP service | Remote, multi-user, cloud deployments | OAuth 2.1, now with OpenID Connect Discovery |

The version note that trips people up: the original "HTTP+SSE" transport was replaced by Streamable HTTP in the 2025-03-26 revision, which added OAuth 2.1. The 2025-11-25 spec went further — aligning discovery with RFC 9728, adding OAuth Client ID Metadata Documents for registration, and making JSON Schema 2020-12 the default dialect. If a tutorial hand-rolls two SSE endpoints, it's two years stale.

## Build a minimal MCP server in 30 lines

You can stand up a working server in under 30 lines with the official SDK. Here's a Python example using `FastMCP` exposing one tool — run it against Claude Desktop and it appears as a callable tool after a client restart.

```python
# server.py — minimal MCP server, stdio transport
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-demo")

@mcp.tool()
def get_forecast(city: str) -> str:
    """Return a short weather forecast for a city."""
    # In production, call a real weather API here.
    return f"{city}: 22C, clear skies, light wind."

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

Register it in your host's config (for Claude Desktop, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "weather-demo": {
      "command": "python",
      "args": ["/abs/path/to/server.py"]
    }
  }
}
```

What broke for me the first time: a relative path in `args` and the server silently failed to start, because the host's working directory wasn't my project folder. Use absolute paths and check the host's MCP logs — the handshake either succeeds or it doesn't, and the logs tell you which. The [official SDKs](https://modelcontextprotocol.io/docs/sdk) now cover TypeScript, Python, Go, Java, Kotlin, C#, Rust, Swift, and Ruby; the Rust SDK (`rmcp`) hit v1.0.0 in March 2026 and Go is co-maintained with Google. Pick your stack's language and the API is nearly identical.

## Why MCP matters — and who actually owns it now

MCP matters because it decouples agent capability from agent code. An [AI agent](/en/posts/ai-agents-vs-workflows) that speaks MCP gains new powers from one config line — no redeploy, no SDK bump, no vendor lock-in. That composability is what production agents need as their tool surface grows, and it's why MCP now sits next to [RAG systems](/en/posts/how-to-build-rag-system) and [prompt engineering patterns](/en/posts/prompt-engineering-patterns) as core plumbing, not a novelty.

The ownership story is the real headline. Once Anthropic handed MCP to the Linux Foundation and its rivals co-sponsored it, the protocol stopped being a single vendor's bet and became shared infrastructure. That governance shift matters more than any feature: it's the difference between a format you adopt cautiously and one you build a company on. For more from our [AI coverage](/en/category/ai), see how to [reduce LLM hallucinations](/en/posts/reduce-llm-hallucinations) in the same stack.

## Frequently Asked Questions

### Is the Model Context Protocol open source?

Yes, and as of December 2025 it's vendor-neutral. Anthropic released MCP under an MIT-style license in November 2024 — spec, official SDKs, and reference servers — then donated it to the Linux Foundation's Agentic AI Foundation, with OpenAI, Google, and Microsoft as co-sponsors. It's governed in the open on GitHub with formal working groups.

### What is the difference between MCP and a normal REST API?

A REST API is a bespoke contract you integrate against per service. MCP is a standardized meta-protocol for capability discovery: a client asks any server "what can you do?", gets machine-readable tool schemas back, and calls them the same way regardless of the underlying service. MCP servers often wrap REST APIs internally.

### Do I need MCP to use tool calling with an LLM?

No. Tool calling works fine without MCP — you can pass function definitions straight to a model. MCP earns its keep when you want those tools reusable across multiple apps and discovered dynamically at runtime, rather than hard-coded into each app.

### Is MCP secure for production use?

It can be, with care. Streamable HTTP uses OAuth 2.1, and the 2025-11-25 spec tightened discovery and client registration. Treat every server as a trust boundary: validate inputs, scope roots tightly, and never expose a server you didn't audit. Prompt injection through tool results remains the main risk, so sanitize what servers return before it reaches the model.
