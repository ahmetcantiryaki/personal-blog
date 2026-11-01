---
title: "Skills, MCP, or Connector? A 2026 Builder's Guide"
slug: "skills-mcp-or-connector-builders-guide-2026"
translationKey: "skills-mcp-connectors-decision-2026"
locale: "en"
excerpt: "Short answer: use a Skill for packaged know-how, MCP for live tools or data, and a Connector for ready-made third-party apps — each solves a different problem."
category: "ai"
tags: ["mcp", "ai-tools", "claude", "chatgpt", "gemini"]
publishedAt: "2026-11-01"
seoTitle: "Skills vs MCP vs Connectors: When to Use Which"
seoDescription: "What's the difference between Skills, MCP, and Connectors (Apps) in Claude, ChatGPT, and Gemini? A decision tree, support matrix, and security trade-offs."
---

Short answer: use a Skill when you need to package step-by-step know-how for a repeatable task, use MCP (Model Context Protocol) when the model needs live tool calls into a real system or database, and use a Connector — called an "App" in ChatGPT since late 2025 — when you want a ready-made third-party integration with no setup. Each solves a different problem; none substitutes for the other two.

## What's the actual difference between a Skill, MCP, and a Connector?

A Skill is a bundle of instructions and example files that teaches a model how to do a task, and it runs entirely inside the model's own context — it makes no outbound network call. MCP is a protocol that lets a client (Claude, an IDE, an agent) call tools and fetch data from an external server in real time, where a real database, API, or file system sits behind that server. A Connector (App) is built on top of both — a packaged integration a user turns on without writing code, often running MCP under the hood.

A concrete example: "how to write a PR description" is a Skill; reading a real pull request on GitHub and posting a comment on it is an MCP tool call; a one-click integration that posts that PR update to a Slack channel automatically is a Connector.

## How do Claude, ChatGPT, and Gemini support these three?

All three platforms support the same three concepts, under different names and at different maturity levels. Claude ships Skills and MCP as first-class, native features; OpenAI renamed "Connectors" to "Apps" in December 2025 and now recommends the Apps SDK for publishing MCP-backed app experiences; Gemini began replacing its older "Gems" feature with "Skills" starting in October 2026.

| Platform | Packaged know-how (Skill) | Live tool/data (MCP) | Ready-made 3rd-party integration |
|---|---|---|---|
| Claude | Agent Skills (native) | Native MCP client + server support | Managed MCP servers in Claude Code |
| ChatGPT | — (custom GPTs serve a similar role) | Add a custom MCP server in developer mode | "App" (formerly Connector), via Apps SDK |
| Gemini | Skills (replacing Gems since Oct 2026) | Tool calling in Gemini Enterprise | Workspace integrations |

For the protocol itself, see our deep dive on [Model Context Protocol](/en/posts/model-context-protocol-explained), and for a hands-on walkthrough, [build your first MCP connector](/en/posts/build-your-first-mcp-connector).

## Why is Agent Skills now an open standard?

On October 22, 2026, Anthropic donated the Agent Skills standard to the Agentic AI Foundation (AAIF), hosted under the Linux Foundation, handing over the name, logo, GitHub organization, and the agentskills.io domain. By Anthropic's own figures at the time of the donation, the standard had close to 1 million published skills and nearly 280 million installs, with more than 70 agent platforms already supporting it — the donation wasn't a step back from that adoption, it was a move to lock in cross-platform portability by putting the format under neutral governance. This follows the same pattern as Anthropic's earlier donation of MCP to the same foundation: publish a standard, let the ecosystem adopt it, then hand it to a neutral body.

In practice, that portability means a Skill file you write for Claude today can, in theory, run on any other platform that implements the standard, because the format now belongs to an independent foundation rather than a single vendor.

## When should you reach for a Skill?

Reach for a Skill when the task is repeatable, the steps are known in advance, and it doesn't require live access to an external system — things like "write this weekly report in our template" or "edit this draft to match our style guide." A Skill file typically looks like this:

```yaml
name: weekly-report
description: Generates the weekly status report from the team template
instructions: |
  1. Pull the last 7 days of commits and PR summaries
  2. Group them under the five template headings
  3. List risks in a separate section
```

This file loads straight into the model's context, so you stop re-explaining the same steps on every run — but it can't reach any data beyond what the instructions describe.

## When should you reach for MCP?

Reach for MCP when the task needs the model to query a live database, write to an API, or touch the file system in real time. An MCP server defines each tool's name, parameters, and return shape with an explicit schema, and the model reads that schema to make the correct call. Our guide on [Model Context Protocol (MCP) Explained](/en/posts/model-context-protocol-explained) covers how that schema works and how tools get described to the model in the first place.

The 2026-07-28 MCP revision made the core protocol stateless, which means you can run multiple replicas of an MCP server behind a load balancer without syncing session state between them.

## When should you reach for a Connector (App)?

Reach for a Connector/App when the goal is connecting to a ready-made third-party service — Slack, Google Drive, a CRM — with no setup or code. It doesn't require a developer to stand up and maintain an MCP server; the platform manages the integration and the user just grants access. As with the [agents vs. workflows](/en/posts/ai-agents-vs-workflows) decision, the real question here is how much control you need: a Connector trades control for speed, while a custom MCP server gives you full control at the cost of running it yourself.

## What are the security and cost trade-offs?

Skills carry the lowest risk because they make no outbound call — their risk is bounded by the quality of the instructions themselves. MCP servers give you the most control but also the most responsibility: you define least-privilege access per tool, and logging every call is on you. Connectors/Apps hand that burden to the platform, but you also give up that control — you're trusting the platform's privacy policy on what gets shared.

On cost, Skills are close to free beyond the extra tokens they consume, an MCP server carries hosting and maintenance cost, and a Connector is usually bundled into the platform's existing subscription plan.

My take: most teams treat these three as competitors and ask "which one is better," but the right question is "which one for which task" — an agent architecture that uses all three together is consistently more resilient than one locked into a single mechanism.

## Frequently Asked Questions

### What's the difference between Skills, MCP, and Connectors?

A Skill is packaged instructions and examples that run inside the model's own context; MCP is a protocol for live tool and data access to an external server; a Connector (App) is a ready-made integration built on top of both that a user turns on without any setup.

### Who owns Agent Skills now?

Since October 22, 2026, the Agent Skills standard belongs to the Agentic AI Foundation (AAIF) under the Linux Foundation — Anthropic transferred the name, logo, GitHub organization, and the agentskills.io domain to the foundation. The standard remains free and open.

### What happened to Connectors in ChatGPT?

OpenAI renamed "Connector" to "App" in December 2025; developers now publish MCP-backed app experiences through the Apps SDK, and users can add a custom MCP server address through developer mode.

### Is Gemini's Skills feature replacing Gems?

Yes. Google began rolling out Skills in Workspace on October 5, 2026, and in the Gemini app on October 13, 2026. Gems moves into a settings panel starting in November 2026 and will no longer be usable on business and enterprise accounts starting no sooner than March 2027.
