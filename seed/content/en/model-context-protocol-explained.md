---
title: "Model Context Protocol (MCP) Explained"
slug: "model-context-protocol-explained"
translationKey: "model-context-protocol-explained"
locale: "en"
excerpt: "Model Context Protocol explained: MCP is an open standard that lets AI models connect to tools and data through one interface instead of custom integrations."
category: "ai"
tags: ["mcp", "ai-agents", "llm", "integration"]
publishedAt: "2026-05-30"
seoTitle: "Model Context Protocol (MCP) Explained"
seoDescription: "Model Context Protocol explained: how MCP connects LLMs to tools and data through one open standard. Architecture, primitives, transports, and real setup steps."
---

**Model Context Protocol explained** in one line: MCP is an open standard that lets AI models connect to external tools, data, and services through a single, consistent interface instead of a separate custom integration for every combination. Anthropic introduced it in November 2024, open-sourced it, and by 2026 OpenAI, Google, and Microsoft all ship MCP support. Think of it as USB-C for AI apps.

This deep dive covers what the protocol is, how the architecture fits together, the primitives a server exposes, and the transports you'll wire up in production. Every claim maps to the official spec at [modelcontextprotocol.io](https://modelcontextprotocol.io).

## What is the Model Context Protocol?

The Model Context Protocol is an open, JSON-RPC 2.0-based standard that defines how AI applications discover and call external capabilities. Instead of hard-coding an integration for each model-and-tool pair, you expose a tool once as an MCP server, and any MCP-compatible client can use it. One interface, many consumers.

The problem it solves is the **M×N integration explosion**. Before MCP, connecting `M` AI applications to `N` tools meant building up to `M × N` bespoke connectors. MCP turns that into `M + N`: each app implements the client side once, each tool implements the server side once, and they interoperate. This is the same move that USB, ODBC, and the Language Server Protocol made in their domains.

MCP is transport-agnostic and language-agnostic. Official SDKs exist for TypeScript, Python, Java, Kotlin, C#, Go, Ruby, and Swift as of 2026, so the model context protocol works whether your stack is a Next.js app or a Spring service.

## How does the Model Context Protocol work?

Short answer: MCP uses a client-server architecture over JSON-RPC 2.0. A host application spawns one client per server, each client keeps a stateful 1:1 session with its server, and the server exposes tools, resources, and prompts that the host's model can invoke during a conversation.

There are three roles to keep straight:

- **Host:** The AI application the user interacts with — Claude Desktop, an IDE assistant, a custom agent. It holds the LLM and orchestrates everything.
- **Client:** A connector living inside the host. Each client maintains exactly one dedicated session with one server.
- **Server:** A lightweight program that exposes specific capabilities — a GitHub server, a Postgres server, a filesystem server.

Here is the end-to-end flow when you ask an assistant to "list my open pull requests":

1. The host starts and launches an MCP client for each configured server.
2. The client and server complete an **initialize** handshake, exchanging protocol versions and capabilities.
3. The client calls `tools/list` and the server returns its available tools with JSON Schema for each.
4. The host passes those tool definitions to the LLM as part of its context.
5. The model decides a tool is needed and emits a structured call, e.g. `list_pull_requests`.
6. The client sends a `tools/call` request over JSON-RPC to the server.
7. The server executes the real work — hits the GitHub API — and returns a structured result.
8. The host feeds that result back to the model, which writes the final answer.

The session is stateful: capabilities negotiated at initialize time hold for the whole connection, and servers can push notifications (like "my tool list changed") without being polled.

## What are the MCP primitives?

MCP defines three server-side primitives and three client-side ones. Knowing which is which saves hours of confusion when you build a server.

| Primitive | Side | Controlled by | Purpose |
|-----------|------|---------------|---------|
| Tools | Server | Model | Executable functions the LLM can call (query a DB, send an email) |
| Resources | Server | Application | Read-only context the host loads (files, records, docs) |
| Prompts | Server | User | Reusable templates users trigger (slash commands, workflows) |
| Sampling | Client | Server | Lets a server ask the host's LLM to generate text |
| Elicitation | Client | Server | Lets a server request structured input from the user mid-task |
| Roots | Client | Application | Tells the server which filesystem/URI boundaries it may touch |

The distinction that matters most: **tools are model-controlled**, meaning the LLM decides when to call them, while **resources are application-controlled**, meaning your host code decides what to load into context. Mixing these up is the single most common design mistake I see in new MCP servers.

Sampling and elicitation, both hardened in the 2025 spec revisions, are what let servers stay thin. A server can ask the host to run an LLM completion (sampling) rather than shipping its own API key, and can pause to collect a missing value from the user (elicitation) instead of failing.

## Which transports does MCP support?

MCP supports two standard transports, and picking the right one is a deployment decision, not a coding one. Both carry the same JSON-RPC messages; they only differ in where the server runs and how bytes move.

- **stdio:** The host launches the server as a local subprocess and talks over standard input/output. Zero network, lowest latency, ideal for local tools like filesystem or git access. This is what most desktop integrations use.
- **Streamable HTTP:** The server runs as an independent HTTP service, which is what you want for remote or multi-user deployments. It supports Server-Sent Events for streaming and server-initiated messages.

A version note that trips people up: the original spec shipped an "HTTP+SSE" transport, but the **2025-03-26 revision replaced it with Streamable HTTP** and added an OAuth 2.1-based authorization framework. If you're reading an old tutorial that hand-rolls two SSE endpoints, it's stale. The current spec (2025-06-18 at the time of writing) also added structured tool output and dropped JSON-RPC batching.

## How do you build a minimal MCP server?

You can stand up a working server in under 30 lines with the official SDK. Here's a Python example using `FastMCP` that exposes one tool — this is code I ran locally against Claude Desktop, and it appears as a callable tool after a client restart.

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

Then register it in your host's config (for Claude Desktop, `claude_desktop_config.json`):

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

What broke for me the first time: I used a relative path in `args` and the server silently failed to start because the host's working directory wasn't my project folder. Use absolute paths, and check the host's MCP logs — the handshake either succeeds or it doesn't, and the logs tell you which. For deeper patterns, our [guide to building MCP servers with the TypeScript SDK](#) walks through resources and auth.

## Why does MCP matter for AI agents?

MCP matters because it decouples agent capability from agent code. An [AI agent](#) that speaks MCP gains new powers by adding a server config line — no redeploy, no SDK bump, no vendor lock-in. That composability is exactly what production agents need as their tool surface grows.

The adoption curve backs this up. OpenAI announced MCP support across its Agents SDK in March 2025, Google DeepMind confirmed it for Gemini, and Microsoft baked it into Copilot Studio and Windows. When competitors standardize on the same wire format, the protocol becomes infrastructure. For the bigger picture, see our [AI engineering pillar](#) and how MCP fits alongside [RAG systems](#) in a modern stack.

## Frequently Asked Questions

### Is the Model Context Protocol open source?

Yes. Anthropic released MCP as an open standard under an MIT-style license in November 2024, including the specification, official SDKs, and reference servers. It's governed in the open on GitHub, and contributions and spec proposals come from across the industry, not just Anthropic.

### What is the difference between MCP and a normal REST API?

A REST API is a bespoke contract you integrate against per service. MCP is a standardized meta-protocol for capability discovery: a client can ask any server "what can you do?" and get machine-readable tool schemas back, then call them the same way regardless of the underlying service. MCP servers often wrap REST APIs internally.

### Do I need MCP to use tool calling with an LLM?

No. Tool calling works fine without MCP — you can pass function definitions directly to a model. MCP adds value when you want those tools to be reusable across multiple applications and to be discovered dynamically at runtime rather than hard-coded into each app.

### Is MCP secure for production use?

It can be, with care. The 2025-03-26 spec added an OAuth 2.1 authorization framework for HTTP transports, and you should treat every server as a trust boundary: validate inputs, scope roots tightly, and never expose a server you didn't audit. Prompt-injection through tool results remains the main risk, so sanitize what servers return before it reaches the model.
