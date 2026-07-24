---
title: "Claude Artifacts Can Now Pull Live Data via MCP"
slug: "claude-artifacts-live-mcp-data"
translationKey: "claude-artifacts-live-mcp-data"
locale: "en"
excerpt: "Claude Artifacts can now query MCP connectors on every page view instead of just once at build time, but you cannot share a connector-backed page publicly."
category: "ai"
tags: ["claude", "mcp", "ai-tools", "ai-agents"]
publishedAt: "2026-07-24"
seoTitle: "Claude Artifacts Can Now Pull Live Data via MCP"
seoDescription: "Claude Artifacts can now query MCP connectors on every page view instead of just once at build time, but you cannot share a connector-backed page publicly."
---

Claude Artifacts just gained the ability to re-fetch data every time a page is opened, not only when it was first built. According to [Anthropic's current documentation](https://code.claude.com/docs/en/artifacts) at code.claude.com, an artifact can now query MCP connectors live, so a pull-request dashboard shows whatever is actually open right now instead of a stale snapshot from build time. The feature requires Claude Code v2.1.209 or later.

## What actually changed

Artifacts turn the output of a Claude Code or claude.ai session into a live, interactive web page hosted at a claude.ai URL. Until now, those pages were frozen at creation: a chart, a calculator, a static report. Now an artifact can call an MCP connector every time the page loads, and what it displays reflects the real, current state of whatever system it's connected to.

The example prompt from Anthropic's docs is straightforward:

```text
Build a dashboard artifact of our open pull requests
that pulls the live list through my GitHub connector
when the page loads.
```

Instead of baking a static table into the page, Claude wires up logic that calls the GitHub connector on load. The result is a dashboard that updates every time someone refreshes the browser tab.

This is a natural extension of what [Model Context Protocol](/en/posts/model-context-protocol-explained) was already doing: MCP was the standard way Claude talked to external tools, and now that conversation is no longer a one-time setup step — it's baked into the page's own lifecycle.

## Whose data actually shows up: the author's or the viewer's

This is the most interesting technical detail in the whole release. When a published artifact calls a connector, the call runs through the *viewing* account's own connection, not the author's. Two people opening the same dashboard can see genuinely different data — one sees their own open GitHub pull requests, the other sees their own Jira tickets.

The practical consequence of this design is that claude.ai makes the connector call server-side, and the page itself never sees or handles credentials. Whoever is viewing the page has to approve connector access on first load. If they decline, or simply haven't connected that tool at all, the live section just stays empty; the page doesn't error out or crash. That's why a good practice is to explicitly prompt Claude to add a fallback message naming the connector that's needed, so a viewer who sees a blank panel knows exactly what to connect instead of guessing.

This per-viewer model also solves an identity problem for teams sharing one dashboard: everyone sees data scoped to their own permissions, and there's no single shared account that could leak the whole team's information to whoever opens the link.

## Why public sharing is blocked for live artifacts

Here's the catch, and it's a real one: an artifact that calls any connector cannot be shared via a public link on any plan. On Pro and Max, a public link is the only sharing mechanism that exists at all, so a connector-backed artifact on those plans simply stays private to whoever created it. On Team and Enterprise, there's more room — you can share the page internally within your organization, with view or edit access, just not out to the open internet.

It's worth reading this as a deliberate security choice rather than a missing feature. A public link is, by definition, something an unauthenticated stranger can open. If that page is calling a connector "as the viewer," and the viewer has no identity at all, the system would either have to let a random visitor attempt a call with zero permissions, or worse, fall back to the author's identity — which is exactly the leak this whole architecture is built to prevent. Anthropic closed that door instead of leaving it ajar. The upshot is that your live dashboard is, quite literally, incapable of being public — and that's the point, not a bug to file against.

Here's how availability breaks down by plan:

| Capability | Pro / Max | Team / Enterprise |
|---|---|---|
| Share a static artifact publicly | Yes | Yes |
| Share a connector-backed artifact publicly | No | No |
| Share a connector-backed artifact within the org | Not available (public link is the only mechanism) | Yes, view or edit access |
| Assign an editor role | Not available | Yes |

## Editor roles and versioning

On Team and Enterprise plans, viewers are read-only by default, but an owner can promote someone to editor. That person gives Claude the artifact's URL in their own session and republishes it, and everyone who has the page open sees the update live. It behaves less like a static document and more like a shared, multiplayer working page.

Every republish creates a new version. The Share control lets you pick which version viewers see — pin a specific one, or let it auto-track the latest — which matters if you want to freeze a dashboard for a demo while continuing to iterate on it elsewhere.

## A realistic workflow: a live PR and deploy-status dashboard

Picture an engineering lead who wants a single page showing open pull requests and recent deploy health before a morning standup. In Claude Code, a prompt along these lines gets there:

1. Pull the list of open PRs and their review status through the GitHub connector.
2. If a CI/CD connector is available, add recent deploy pass/fail status.
3. Re-query all of this every time the page is opened.

The resulting artifact pairs naturally with the kind of automation covered in our piece on [Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents): background agents do the actual work, and this dashboard becomes the visible surface for that work. On a Team plan, you can share the page inside the org, assign an editor, and let each teammate see only the PRs their own GitHub permissions allow.

## The hard constraints of a page

It's worth remembering what an artifact still fundamentally is: a single static HTML or Markdown page with no backend of its own. A strict content security policy blocks all outbound requests except the connector-call mechanism itself. There's a 16 MiB cap on rendered page size. Publishing requires being signed in through /login — sessions authenticated only by an API key cannot publish. And the feature isn't available through Bedrock, Vertex, or Foundry; it only works via the direct Anthropic API on claude.ai.

These constraints echo a pattern seen elsewhere on the platform, including in how [Claude Skills](/en/posts/claude-skills-explained-for-everyone) are scoped: Anthropic keeps expanding what Claude can do while deliberately narrowing the attack surface each new capability opens up.

## Also shipped this week

This capability landed alongside a handful of other claude.ai platform updates in the week of July 20–23, 2026: public artifact sharing links in general, and an accessibility mode for Claude Code that adds screen-reader support. Both deserve their own coverage, but the broader story of the week is Anthropic pushing artifacts from lightweight demo tooling toward something closer to a real, shareable product surface. See [Anthropic's newsroom](https://www.anthropic.com/news) for the full rundown.

## Frequently Asked Questions

### Can I make a live GitHub dashboard public?

No. Any artifact that calls an MCP connector cannot be shared via a public link on any plan. On Pro and Max that means the page stays private to its creator; on Team and Enterprise you can still share it internally within your organization.

### What happens if a viewer hasn't connected the same tools?

The live section of the page just stays empty — it doesn't error or crash. That's why it's good practice to have Claude add a fallback message that names the specific connector a viewer needs to set up.

### Does this work on Claude Code via Bedrock?

No. Live connector-backed artifacts are only supported through the direct Anthropic API on claude.ai, not through Bedrock, Vertex, or Foundry.

### What's the size limit for an artifact?

The rendered page is capped at 16 MiB. Beyond that, an artifact remains a single static HTML or Markdown page with no backend, and a strict CSP blocks any outbound request other than the connector-call mechanism itself.
