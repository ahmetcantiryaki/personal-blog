---
title: "OpenAI's Agents API: The Codex Harness Behind One Call"
slug: "openai-agents-api-explained"
translationKey: "openai-agents-api-launch-2026"
locale: "en"
excerpt: "OpenAI shipped the Agents API in public beta on September 10, 2026 — the managed loop behind Codex, now with durable sessions, sandboxes and MCP support."
category: "ai"
tags: ["openai", "ai-agents", "mcp", "cloud", "ai-infrastructure"]
publishedAt: "2026-09-13"
seoTitle: "OpenAI's Agents API: The Codex Harness Behind One Call"
seoDescription: "OpenAI's Agents API entered public beta on September 10, 2026, exposing the managed Codex harness with durable sessions, sandboxes and MCP support."
---

Short answer: the Agents API is OpenAI's managed agent loop — the same session orchestration, context compaction and tool-calling logic that runs Codex — exposed as a single API. It entered public beta on September 10, 2026. Instead of writing your own orchestration code, you run that loop on OpenAI's infrastructure and pay only for the tokens and tools your agent actually uses.

## What is the OpenAI Agents API?

The Agents API is a hosted service that runs a multi-step agent end to end: it sequences model calls, coordinates tool use, compacts context when it grows too large, and resumes a session if it gets interrupted. Your job as a developer is to define tools, pick an execution environment, and pay standard rates for tokens and tools — there's no separate fee for the API itself.

What makes this notable is that it's the same harness OpenAI built to run Codex. Orchestration logic that previously lived only inside Codex CLI and ChatGPT is now an API surface any application can call.

## How does it work: Agent, Environment, Session, Events?

The API is organized around four concepts:

- **Agent**: the model, instructions, tools, and any connected MCP servers.
- **Environment**: an optional sandbox where the agent accesses files, loads skills, and runs commands.
- **Session**: a durable agent instance that works on a task and responds to input.
- **Events and items**: the inputs sent to the agent and the outputs it produces.

A session keeps working across turns, streaming progress back to your application as it runs. That means you can kick off a long-running task, disconnect, and pick up the result later — without writing your own retry and state-persistence logic.

## How does sandbox selection work?

Any agent that runs code or touches files needs an execution environment. OpenAI offers three options: an OpenAI-hosted sandbox, a self-hosted sandbox on your own infrastructure, or a partner integration. Blaxel, Cloudflare, Daytona, DigitalOcean, E2B, Modal, Oracle, Runloop, and Vercel are the partners with first-class integrations as of September 2026 — so you can keep the agent inside your own VPC and compliance boundary instead of defaulting to OpenAI's environment.

## Agents API vs. Agents SDK: what's the difference?

The Agents SDK is an open-source framework: you run the agent logic on your own server with your own orchestration code, and OpenAI supplies the model calls. The Agents API flips that — orchestration itself becomes a hosted service with durable sessions and automatic context management built in. Think of the SDK as the tool for a lightweight handoff chain, and the Agents API as the tool for long-running, stateful tasks.

The distinction matters because the two get confused. The SDK launched in March 2025 and picked up a model-native harness (file operations, code execution, shell access) plus sandboxing across seven providers in an April 2026 update. The Agents API is a different layer entirely — it takes the SDK's client-side orchestration and turns it into a managed service running on OpenAI's own servers.

## What does it cost, and when is it available?

There's no additional fee for the API itself. OpenAI bills model usage at the selected model's standard API rate, charges standard fees for OpenAI-provided tools, and bills sandbox usage as container costs. It opened in public beta on September 10, 2026, and OpenAI says it plans to iterate quickly on developer feedback during the beta period.

| Feature | Agents SDK | Agents API |
|---|---|---|
| Runs on | Your own server | OpenAI's infrastructure |
| Orchestration | Your code | Managed (hosted) |
| Session durability | You build it | Built in, across turns |
| Sandbox | None / bring your own | Hosted, self-hosted, or 9 partners |
| Extra fee | None | None (tokens + tools + container) |
| First shipped | March 2025 | September 10, 2026 (beta) |

## Do Claude and Gemini have an equivalent?

Yes. Anthropic's Claude Developer Platform is moving the same direction: [Claude Managed Agents](/en/posts/claude-managed-agents-budgets-advisors-data-residency) now ships budget controls, advisor support and data-residency options that add up to a comparable managed-agent model. On the Google side, the Agent Development Kit (ADK) provides a similar orchestration layer. It's not a coincidence all three vendors are solving the same problem in 2026 — hand-writing agent orchestration is expensive and brittle, so each is turning it into a managed service.

## How does this fit with MCP?

The Agents API supports [MCP servers](/en/posts/model-context-protocol-explained) directly, alongside custom tools. Connect your MCP server to an agent, and it can call that server's tools as part of its own toolset — the hosted session tracks the state of MCP calls the same way it tracks any other tool call. The groundwork from [building your first MCP connector](/en/posts/build-your-first-mcp-connector) still applies here; the only change is that the connector now plugs into OpenAI's hosted session instead of your own orchestration code.

## What does a basic request look like?

Starting a session takes a single POST request. The example below creates an agent wired to a tool set and hands it a first task:

```json
{
  "agent": {
    "model": "gpt-5.6",
    "instructions": "Clone the repo, run the test suite, report any failures.",
    "tools": ["code_execution", "file_search"]
  },
  "environment": {
    "sandbox": "hosted"
  },
  "input": "Run the tests under src/ and summarize the results."
}
```

The response returns a session ID, and progress streams back to your application through an event stream tied to that session. Instead of writing your own retry and state-persistence logic, the session itself resumes the task where it left off.

## Who should actually use it, and who shouldn't?

For a one-off, short task — summarizing a piece of text, say — this API is overkill; a plain completion call does the job. The Agents API earns its complexity on tasks that call multiple tools in sequence, can run for minutes or hours, and might get interrupted along the way: scanning a codebase and editing multiple files, running a long research task in the background, or triggering a CI/CD step through an agent. If a task finishes in a single model call, you don't need the overhead of durable session infrastructure.

## The take

Read this as the opposite of "OpenAI open-sourced its harness." Moving Codex's orchestration logic into an API ties developers more deeply to OpenAI's hosting layer: session state now lives on OpenAI's servers, not in your own database. That's part of why some developers reacted cautiously — a few on Hacker News have argued the shift away from the Chat Completions API is driven by business reasons more than technical ones, and lock-in risk is real. But so is the engineering cost of building durable sessions, context compaction, and sandbox orchestration from scratch. For a small team, that trade-off probably favors the managed service; if an agent runtime becomes the load-bearing piece of your product, take the lock-in question as seriously as you would when [wiring AI agents into CI/CD](/en/posts/ai-agents-in-cicd-safely).

## Frequently Asked Questions

### When did OpenAI release the Agents API?

OpenAI released the Agents API in public beta on September 10, 2026. It exposes the managed agent loop that runs Codex — including durable sessions, sandboxes, and MCP tool support — as a standalone API.

### Is the Agents API the same as the Agents SDK?

No. The Agents SDK is an open-source framework where you run agent logic on your own server. The Agents API is a fully managed service where OpenAI hosts the orchestration, including durable sessions and automatic context management.

### How much does the Agents API cost?

There's no extra fee for the API itself. Model usage bills at the selected model's standard API rate, tool usage bills at the standard rate for OpenAI-provided tools, and sandbox usage bills as container costs.

### Can I run the Agents API on my own infrastructure or does it require OpenAI's servers?

Both are possible. You can use an OpenAI-hosted sandbox, run a sandbox on your own infrastructure, or use a partner integration — Blaxel, Cloudflare, Daytona, DigitalOcean, E2B, Modal, Oracle, Runloop, and Vercel all offer first-class integrations.
