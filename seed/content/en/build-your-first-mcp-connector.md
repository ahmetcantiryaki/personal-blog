---
title: "Build Your First MCP Connector (2026 Spec)"
slug: "build-your-first-mcp-connector"
translationKey: "build-your-first-mcp-connector"
locale: "en"
excerpt: "MCP's 2026-07-28 specification brought a stateless core and stricter OAuth. Let's write a minimal server exposing one tool and one resource from scratch."
category: "ai"
tags: ["mcp", "claude", "authentication", "ai-agents"]
publishedAt: "2026-08-08"
seoTitle: "Build Your First MCP Connector: 2026 Spec Guide"
seoDescription: "How do you write a minimal MCP server against the 2026-07-28 spec? Tool, resource, authentication, and connecting it to Claude, step by step in this guide."
---

In [our piece on the MCP 2026-07-28 specification](/en/posts/mcp-2026-07-28-stateless-spec), we covered the protocol's move to a stateless core. This time we're skipping the theory and building something real: a minimal MCP server exposing one tool and one resource, written against the current spec, authenticated, and tested.

## Who This Is For

You already know what MCP is — you're comfortable with clients, servers, tools, and resources. If not, start with [our Model Context Protocol explainer](/en/posts/model-context-protocol-explained) first; this piece picks up from there and goes straight to code.

## What Changed in the 2026-07-28 Spec

Three changes matter directly when you're writing a connector:

- **Stateless core**: the `initialize`/`initialized` handshake and the `Mcp-Session-Id` header are gone. Every request now carries its own protocol version, client identity, and capabilities — meaning any instance of your server can serve any request behind a plain round-robin load balancer, no sticky sessions required.
- **Stricter authorization**: MCP servers are now formally positioned as OAuth 2.1 resource servers; six separate Specification Enhancement Proposals align this with OpenID Connect.
- **Cacheable list results**: responses like `tools/list` are now cacheable — clients don't need to re-request the same tool list on every turn.

The practical outcome: a remote MCP server that previously needed sticky sessions, a shared session store, and deep packet inspection at the gateway can now run behind a plain round-robin load balancer.

## A Minimal Server Skeleton

A minimal server exposing one tool (`get_weather`) and one resource (`config://settings`) using the Python SDK looks like this:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-connector")

@mcp.tool()
def get_weather(city: str) -> str:
    """Returns current weather for the given city."""
    # A real API call would go here
    return f"{city}: 22C, partly cloudy"

@mcp.resource("config://settings")
def get_settings() -> str:
    """Returns the connector's default configuration."""
    return '{"units": "metric", "cache_ttl_seconds": 300}'

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

The detail worth noting is `transport="streamable-http"` — the correct choice for the 2026-07-28 spec's stateless HTTP transport. STDIO transport is still valid for local development, but production connectors run over HTTP.

## Authentication: Acting as an OAuth 2.1 Resource Server

Under the new spec, your server doesn't invent its own authentication — it behaves as an OAuth 2.1 resource server and delegates token validation to an authorization server. The minimal flow:

1. The client queries your server's `/.well-known/oauth-protected-resource` endpoint to discover which authorization server to use.
2. The client obtains an access token from that authorization server.
3. Every MCP request carries that token via `Authorization: Bearer <token>`; your server validates the token but never issues one itself.

This distinction matters: your connector delegates authentication logic to an existing OIDC provider (Auth0, Okta, your own IdP) instead of embedding it in your codebase. [WorkOS's writeup of the authorization changes](https://workos.com/blog/mcp-2026-spec-agent-authentication) covers this flow end to end.

## Testing It

Once your server is running, a simple HTTP request is enough to confirm `tools/list` and `resources/list` respond correctly:

```http
POST /mcp HTTP/1.1
Host: localhost:8000
Content-Type: application/json
MCP-Protocol-Version: 2026-07-28

{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

The response should include the `get_weather` tool's name, description, and parameter schema. At this point you've validated the protocol layer without connecting a client yet. The full list of changes is documented in the [official MCP spec announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28/).

## Connecting It to Claude and Other Clients

As long as it conforms to the spec, the same server works with any MCP-compatible client — that's the real payoff of the stateless core. Connecting it to Claude Desktop is a matter of adding the server's URL to your configuration.

| Client | Connection method |
|---|---|
| Claude Desktop / Claude Code | Add MCP server URL from settings |
| Claude Cowork | Added as a connector, OAuth flow completed in the UI |
| Other MCP clients | Same `streamable-http` endpoint, no extra config needed |

Connecting the same server code to multiple clients without changes is the spec's real promise — you don't need to write client-specific integration code.

## Apps and Tasks: Versioned Extensions

The 2026-07-28 spec introduced a formal extensions framework for adding new capabilities without touching the core protocol — and the first two extensions to ship under it are MCP Apps and Tasks. Extensions are identified by reverse-DNS identifiers, negotiate capabilities through an `extensions` map, and version independently of the core spec — so an extension can update without forcing an update to the rest of your server.

**MCP Apps** are server-rendered, interactive HTML interfaces that run inside sandboxed iframes. Tools declare their UI templates up front, which lets clients prefetch and security-review a template before anything actually renders. UI actions flow back through the same JSON-RPC channel as ordinary tool calls.

**The Tasks extension** was promoted from an experimental feature to an official extension after real-world production use drove a redesign of its lifecycle. The new model is stateless by design: `tools/call` now returns a task handle, and the client drives progress itself via `tasks/get`, `tasks/update`, and `tasks/cancel`. If your connector involves a long-running operation — processing a large file, a multi-step search — this extension lets you track the work in the background instead of holding a single request open. The full architecture of the extensions framework is covered in more depth in [Anthropic's own writeup](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude).

## Observability and Private Network Tunnels

Two things not to skip before production: logging every tool call (which client, which parameters, how long it took), and using a tunnel tool (ngrok, Cloudflare Tunnel) to test your server without exposing it to the public internet. If your connector reaches internal systems, this tunnel approach speeds up your dev loop without permanently opening the server to the outside. If you're figuring out where this connector fits in your broader agent architecture, [our context engineering guide for AI agents](/en/posts/context-engineering-for-ai-agents) is a useful companion piece.

## Deploy-and-Verify Checklist

- [ ] Server runs on `streamable-http` transport and correctly handles `MCP-Protocol-Version: 2026-07-28`
- [ ] `/.well-known/oauth-protected-resource` endpoint points to the right authorization server
- [ ] `tools/list` and `resources/list` return the expected schema
- [ ] Tested end to end with at least one client (Claude Desktop or Claude Code)
- [ ] Tool calls are logged, errors return proper JSON-RPC error codes

## Frequently Asked Questions

### Will moving to the stateless core break my existing servers?

Servers relying on the old `initialize` handshake can keep working in a backward-compatible mode, but you need to update your server to the 2026-07-28 transport to get the new scalability benefits, like not requiring sticky sessions.

### Can I still use STDIO transport?

Yes, STDIO is still a valid transport for local development and single-user tools. But for production scenarios where multiple clients connect to the same server, `streamable-http` is the right choice.

### Do I need to write my own OAuth server?

No, and it isn't recommended. Your server should act as a resource server and delegate to an existing OIDC provider (Auth0, Okta, your corporate IdP) — writing your own token infrastructure is both unnecessary and risky.

### Does the same server really work with Claude and other clients?

Yes, as long as your server conforms to the spec, it's client-agnostic. That's a direct result of the stateless core and standardized authorization — you don't need to write client-specific code.
