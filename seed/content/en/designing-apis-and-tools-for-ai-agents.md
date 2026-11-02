---
title: "How Do You Design APIs for AI Agents?"
slug: "designing-apis-and-tools-for-ai-agents"
translationKey: "api-design-for-ai-agents-2026"
locale: "en"
excerpt: "Short answer: treat tool names and descriptions as a contract the model reads before each call, and always confirm destructive actions explicitly."
category: "software-engineering"
tags: ["api-design", "ai-agents", "mcp", "backend"]
publishedAt: "2026-11-02"
seoTitle: "Designing APIs and Tools for AI Agents (2026 Guide)"
seoDescription: "How agent-facing API design differs from human-facing design: tool descriptions, coarse vs fine-grained tools, idempotency, MCP vs REST, and evals."
---

Short answer: an agent calls your API based entirely on the tool's name, description, and schema — it never reads your docs site — so that metadata has to function as the interface, not a comment on top of it. Pair that with concise, structured results, clear and actionable errors, and confirmation gates on anything destructive, and most agent tool-calling failures disappear.

## How is agent-facing API design different from human-facing design?

A human developer reads your docs once, builds a mental model, and then calls your endpoints correctly from memory for months. An agent has no persistent mental model between calls — it re-reads the tool's name, description, and parameter schema (or a cached summary of it) every time it decides whether and how to call it. That single difference changes almost everything about how you should write the interface: ambiguity that a human would resolve by skimming a docs page becomes, for an agent, a coin-flip between calling the right tool, the wrong one, or not calling anything at all.

## What makes a tool description actually work?

Treat the description as the only documentation the model will ever see, because functionally it is. A vague description ("manages user records") gives the model nothing to decide on, so it either avoids the tool or calls it with guessed parameters; an over-specified description that hardcodes every possible input as an example can backfire the other way, anchoring the model so hard to those examples that it fails to generalize to a slightly different but valid case. The target is specific but not exhaustive: state exactly when to use the tool, what it returns, and the one or two parameter formats most likely to trip up a caller — [CodeConductor's guide to designing MCP tools](https://codeconductor.ai/blog/designing-mcp-tools-for-ai-agents/) walks through this contract framing in more detail, including typed, example-bearing schema fields.

| Description style | What the model does |
|---|---|
| Too vague ("manages orders") | Skips the tool, or calls it with guessed/empty parameters |
| Over-specified (lists every possible input literally) | Overfits to the examples; fails on valid inputs outside them |
| Specific with clear boundaries | Calls the right tool, with correctly formatted parameters |

A practical test before shipping: write five prompts that should trigger the tool, each phrased differently and with semantically equivalent but textually different arguments, and confirm the model picks the right tool and fills the schema correctly for all five. If two of five fail, the description needs tightening, not the model.

## Should you expose coarse or fine-grained tools?

Default to coarse-grained tools that map to a complete task, and only split into finer-grained tools when you have evidence agents are misusing the combined one. A `create_and_send_invoice` tool that does one well-defined thing end to end is easier for an agent to call correctly than three separate calls (`create_invoice`, `attach_line_items`, `send_invoice`) that it has to sequence itself — every extra call is another point where the agent can stop early, pass the wrong ID forward, or skip a required step. The exception is when a task genuinely has multiple valid paths depending on context (sometimes you want to create without sending); in that case, separate tools with very clear "use this when..." descriptions beat one tool with a confusing optional-parameter fork.

## What should a tool actually return?

Return the smallest structured payload that answers the question the call was for, not the full underlying database row. Every extra field is tokens the agent has to read and reason about on every later turn, and large unstructured blobs (raw HTML, log dumps, unfiltered API passthroughs) are where agent context usually gets wasted or misread. Structure results consistently — the same shape for success, the same shape for "no results," a distinct labeled shape for errors — so the agent can pattern-match the response type without re-parsing prose.

```json
{
  "status": "error",
  "error_code": "invoice_already_sent",
  "message": "Invoice INV-2041 was already sent on 2026-10-30 and cannot be edited.",
  "next_step": "Create a credit note instead, or contact billing to void it."
}
```

That `next_step` field matters more than it looks: a bare error message tells the agent what went wrong but not what to do about it, so it often retries the same failing call. An actionable error that names the valid next move measurably cuts retry loops. The confirmation-token pattern below is really just [idempotent API design](/en/posts/idempotent-api-design) applied to agent tools specifically — the same rule that protects a payment endpoint from a flaky network retry protects a tool from an agent that isn't sure its last call landed.

## How do you handle destructive or irreversible actions?

Require an explicit confirmation step for anything that deletes data, sends money, or sends a message a human can't unsend, and make the tool itself enforce it rather than trusting the agent's own judgment every time. A common pattern is a two-call design: the first call returns a preview and a confirmation token, and the second call executes only if that exact token is passed back. This also solves idempotency for free — if the agent retries after a timeout without knowing whether the first call succeeded, re-sending the same confirmation token either executes once or safely no-ops on a repeat, instead of double-charging a card or double-sending an email.

## How should pagination and large responses work?

Default to small page sizes (10-20 items, not 500) and make the agent explicitly ask for more, because an agent's context window is a shared, finite budget across the entire conversation, not just this one call — a single over-eager tool response can crowd out everything else the agent needs to reason about later in a long session. Include a simple cursor or `has_more` flag rather than requiring the agent to compute offsets itself, since arithmetic on a shifting dataset is exactly the kind of fiddly bookkeeping agents get subtly wrong.

## MCP or plain REST — which one?

Use the Model Context Protocol (MCP) when you're exposing tools specifically for AI agents across multiple clients (Claude, other agent frameworks, internal tools), since it standardizes tool discovery, schema format, and the request/response contract so you don't reinvent that layer per integration. Use plain REST, wrapped in a thin tool-calling layer, when the API already exists for human-facing or service-to-service use and agents are just one more consumer — rebuilding a mature REST API as an MCP server from scratch rarely pays for itself. For new, agent-first internal tooling, MCP's bounded-context convention is worth following even outside MCP itself: scope each tool or tool group to one clear domain, and keep tools idempotent and stateless so they scale the same way a stateless REST endpoint does — [Nordic APIs' list of MCP server practices](https://nordicapis.com/8-tips-and-best-practices-for-mcp-server-development/) covers this scoping advice alongside transport and auth choices.

## How do you actually test whether agents call your tools correctly?

Build a small eval set — 15-30 realistic prompts mapped to the tool call you expect — and run it whenever you change a description, schema, or add a new overlapping tool. This catches a regression that's easy to miss by eyeballing: a tool added later in the catalog quietly stealing calls that used to go to an existing one, because its description happens to overlap. Treat tool-calling accuracy as a metric you track release over release, not a one-time check before launch.

My take: most agent tool-calling bugs reported as "the model is bad at this" are actually interface bugs that would confuse a new engineer too — vague descriptions, inconsistent response shapes, errors with no next step. Writing tools for agents is close to writing a public API for a developer who can never ask a clarifying question; fix the interface first, and the "AI can't reliably call my tools" complaint usually resolves on its own. These clear-contract, confirm-before-destructive principles also show up in [how AI features should handle errors instead of failing silently](/en/posts/ai-features-that-fail-silently-avoid-the-traps), and if you haven't exposed a tool through MCP yet, [building your first MCP connector](/en/posts/build-your-first-mcp-connector) is the fastest way to see these rules enforced by a real client.

## Frequently Asked Questions

### What's the biggest mistake in designing tools for AI agents?

Writing a vague or overly example-heavy tool description. A vague description gives the model nothing to decide on and causes wrong or skipped calls; an overly specific one anchors the model to its examples and causes failures on valid inputs that weren't listed.

### Should I build coarse-grained or fine-grained agent tools?

Default to coarse-grained tools that complete one full task end to end. Split into finer-grained tools only when you have evidence the combined tool is being misused — every extra call an agent has to sequence itself is another point where it can skip a step or pass the wrong value forward.

### How do I stop an agent from re-running a destructive action twice?

Use a two-call confirmation pattern: the first call returns a preview and a confirmation token, and the second call executes only with that exact token. Re-sending the same token on a retry either executes once or safely no-ops, which solves idempotency and confirmation at the same time.

### Should I use MCP or a plain REST API for agent tools?

Use MCP when you're building agent-specific tools meant to work across multiple AI clients, since it standardizes discovery and schema format. Use plain REST with a thin tool-calling wrapper when a mature API already serves human or service clients and agents are just one more consumer.
