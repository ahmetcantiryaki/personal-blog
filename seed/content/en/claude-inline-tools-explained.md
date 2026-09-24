---
title: "What Are Claude's Inline Tools? Add Tools Without Cache Loss"
slug: "claude-inline-tools-explained"
translationKey: "claude-inline-tools-prompt-cache-2026"
locale: "en"
excerpt: "Anthropic's inline-tools-2026-09-15 beta lets you define or change a tool mid-conversation without touching the tools array or breaking prompt cache."
category: "ai"
tags: ["claude", "llm", "mcp", "prompt-engineering"]
publishedAt: "2026-09-24"
seoTitle: "Claude Inline Tools: Add Tools Without Breaking Cache"
seoDescription: "Claude's inline-tools-2026-09-15 beta adds tool_addition blocks that define tools mid-conversation without editing the tools array or invalidating prompt cache."
---

Short answer: on September 22, 2026, alongside Claude Opus 5.5, Anthropic shipped the `inline-tools-2026-09-15` beta header, which lets you add, update, or remove a tool definition in the middle of a conversation without ever touching the top-level `tools` array — so the conversation's prompt cache stays intact.

## What problem does this actually solve?

Claude's API hashes the cached request prefix in a fixed order: the `tools` array, then the top-level `system` field, then `messages`. Change either of the first two, and every cached turn that follows gets a full cache miss, because the hash no longer matches. In a long-running agent session, that used to mean adding one new tool halfway through wiped out hours of accumulated cache savings.

Inline tools sidesteps this by appending the new tool as a system message inside `messages` instead of editing `tools`. Since the cached prefix hash is computed before that point, the rest of the conversation keeps hitting cache exactly as before.

## How do you actually use inline tools?

You add a `tool_addition` block to a message with `role: "system"`, carrying the tool's full definition (`name`, `description`, `input_schema`):

```json
{
  "role": "system",
  "content": [
    {
      "type": "tool_addition",
      "tool": {
        "type": "tool_definition",
        "definition": {
          "name": "db_query",
          "description": "Run a read-only SQL query against the analytics database.",
          "input_schema": {
            "type": "object",
            "properties": { "sql": { "type": "string" } },
            "required": ["sql"]
          }
        }
      }
    }
  ]
}
```

The full flow in the Python SDK looks like this:

```python
client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    betas=["inline-tools-2026-09-15"],
    tools=[{"name": "get_weather", "description": "Get the current weather.",
            "input_schema": {"type": "object",
                              "properties": {"location": {"type": "string"}},
                              "required": ["location"]}}],
    messages=[
        {"role": "user", "content": "How many orders shipped yesterday?"},
        {"role": "system", "content": [{
            "type": "tool_addition",
            "tool": {"type": "tool_definition", "definition": {
                "name": "db_query",
                "description": "Run a read-only SQL query.",
                "input_schema": {"type": "object",
                                  "properties": {"sql": {"type": "string"}},
                                  "required": ["sql"]}}}}]},
    ],
)
```

At least one non-deferred tool must stay in the `tools` array — otherwise the first value-defined tool itself becomes the new start of the cached prefix, which defeats the point. To change a tool's schema later, send a new definition under the same name; it replaces the earlier one from that point forward, with no separate removal step required.

## How is this different from the earlier mid-conversation-tool-changes beta?

Anthropic shipped `mid-conversation-tool-changes-2026-07-01` on July 24, 2026, alongside Opus 5, but it only covered removing or re-adding tools by reference — a `tool_removal` block naming a tool by its existing definition. `inline-tools-2026-09-15` supersedes that header entirely and adds the ability to define tools by value, change their schema mid-conversation, and attach MCP toolsets on the fly.

| Feature | Beta header | What it does |
|---|---|---|
| Remove a tool by reference | `mid-conversation-tool-changes-2026-07-01` | Withdraws an existing tool by name |
| Add or update a tool by definition | `inline-tools-2026-09-15` | Adds or changes a tool's full schema |
| Attach an MCP toolset | `inline-tools-2026-09-15` + `mcp-client-2026-09-15` | Binds an MCP server's tools mid-conversation |

## How do MCP toolsets work with inline tools?

Add the `mcp-client-2026-09-15` header alongside `inline-tools-2026-09-15`, and the `tool_addition` block's definition becomes an `mcp_toolset` type pointing at a server by `mcp_server_name` — the URL and auth token stay in the separate `mcp_servers` field, never inside the block itself. Claude's response then opens with an `mcp_tool_listing` block enumerating that server's current tools; sending that block back unchanged on later turns pins the tool list so it isn't re-fetched every time. Our [guide to building your first MCP connector](/en/posts/build-your-first-mcp-connector) covers the server side of this setup.

Our take: this is Anthropic's clearest move yet away from the assumption that an agent's tool list is fixed for the life of a session — a long-running agent can now pick up new capabilities mid-task, and the cost of doing so is no longer torching hours of accumulated cache.

## What are the limits to watch for?

Anthropic caps this at 10,000 deferred tools after any single message, 10,000 tools defined by value after the first user message, and 4 MB total for both tool definitions and rendered tool text. `cache_control` can sit on the block or inside the definition, never both. These ceilings rarely matter for a handful of dynamic tools, but they're worth knowing before you build a system that mints tool definitions on the fly. For the model this shipped alongside, see our [Claude Opus 5.5 pricing and benchmarks breakdown](/en/posts/claude-opus-5-5-pricing-benchmarks).

Teams routing across multiple LLM providers should note that cache behavior differs by vendor; we cover that in our [guide to LLM gateways](/en/posts/llm-gateways-routing-models-production). If you're tracking what all this caching actually costs, our piece on [Claude Code spend limits and prompt-cache metrics](/en/posts/claude-code-spend-limits-prompt-cache-metrics) is a useful companion.

## What are turn-scoped system messages for?

The same documentation set defines a separate beta: `mid-conversation-system-clear-at-2026-08-21`. It's built for one-off reminders you don't want piling up in the conversation history — an instruction like "batch independent reads into a single turn" that should only apply until the next user message. Add `clear_at: "next_user_message"` to the message, and it clears automatically once the next user turn arrives, with no need to physically remove it from the `messages` array; once cleared, it no longer counts toward token usage either.

A few constraints keep this distinct from `tool_addition`: it can only carry a text block (no tool-addition or tool-removal content), it can't carry a `cache_control` field, and editing or skipping a turn-scoped message you already sent breaks the cache and jeopardizes the integrity of thinking blocks — so it has to be resent verbatim. In practice, it's worth thinking about all three of these mechanisms (mid-conversation system messages, inline tools, and turn-scoped messages) as one family: each solves the same underlying constraint by keeping `tools` and the top-level `system` field fixed and appending everything that changes to the end of `messages` instead.

## Frequently Asked Questions

### How do I enable the inline tools beta?

Short answer: add `betas: ["inline-tools-2026-09-15"]` to your API request. If you also want to attach an MCP toolset mid-conversation, include the `mcp-client-2026-09-15` header in the same request.

### Which models support inline tools?

Short answer: as of September 2026, the feature is available on the Claude API for the current model lineup, including Claude Opus 5.5. Beta headers are model-independent, so it also works on any model that already supported the earlier mid-conversation-tool-changes beta.

### How do I update a tool that was added with tool_addition?

Short answer: send a new `tool_definition` under the same name. The new definition takes effect from that point in the conversation onward, replacing the earlier one, with no separate removal step needed for a schema change or version bump.

### Does inline tools actually reduce prompt cache costs?

Short answer: yes, because it never edits the `tools` array or the `system` field, so the previously cached prefix stays valid. In a long agent session that repeatedly adds and drops tools, that means only the newly appended message gets processed fresh, not the entire prior history.

**Sources:** [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), [Mid-conversation system messages docs](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages), [Anthropic News](https://www.anthropic.com/news).
