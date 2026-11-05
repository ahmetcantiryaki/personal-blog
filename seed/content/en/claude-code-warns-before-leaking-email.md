---
title: "Claude Code Now Warns You Before It Leaks Your Email"
slug: "claude-code-warns-before-leaking-email"
translationKey: "claude-code-permission-safeguards-nov-2026"
locale: "en"
excerpt: "Claude Code 2.1.317 asks for confirmation before a web or shell call leaks your account email, alongside two other permission changes from late October 2026."
category: "ai"
tags: ["claude", "ai-coding", "ai-agents", "web-security"]
publishedAt: "2026-11-05"
seoTitle: "Claude Code's New Permission Safeguards (Nov 2026)"
seoDescription: "Claude Code 2.1.317 confirms before leaking your email over the network; 2.1.314 blocks writes outside your working directory in every permission mode."
---

Yes. As of Claude Code 2.1.317 (November 3, 2026), the CLI asks for confirmation before a web or shell tool call sends your account email address to the network. It shipped alongside a stricter write-path guard and a fix for flagged requests that used to dead-end in a refusal.

## Does Claude Code Warn You Before It Leaks Your Email?

Short answer: yes, since version 2.1.317, as documented in [Claude Code's official changelog](https://code.claude.com/docs/en/changelog). Before that release, if an agent's tool call happened to include your account email in a request body — a webhook payload, a curl command, a form submission — it went out over the network without a second look. The change adds a confirmation prompt specifically for that case, catching an email address before it leaves your machine rather than after. It is a narrow guard: it watches for your own account email, not every piece of personal data a tool call might touch, so it stops one common leak path, not all of them.

The same release quietly tightened two other things. Agent SDK hooks gained an `onFailure: "block"` option, so a hook that fails now stops the action it was guarding instead of letting it through by default. And the Claude Code Gateway added a cost-reporting endpoint, `GET /v1/organizations/analytics/cost`, for teams that proxy Claude Code through their own infrastructure and want usage numbers without scraping logs.

## What Does `permissions.blockWritesOutsideWorkingDirectories` Actually Block?

It blocks Write, Edit, and NotebookEdit tool calls that target a path outside your current working directories — in every permission mode, including `bypassPermissions`. That last part is the detail worth sitting with: before Claude Code 2.1.314 (October 30, 2026), running in bypass mode meant exactly that — no guardrails, anywhere on disk. Now one guardrail survives bypass mode specifically, because an agent editing files outside the project it was invited into is a failure mode on its own, independent of whether a human is approving each step.

The setting lives under `permissions` in `.claude/settings.json`:

```json
{
  "permissions": {
    "blockWritesOutsideWorkingDirectories": true
  }
}
```

With it on, a tool call to edit `/etc/hosts` or a sibling repo gets rejected outright instead of prompting — there's nothing to approve, because the write never reaches the permission check that would otherwise ask.

| Change | Shipped | Applies to | Old behavior | New behavior |
|---|---|---|---|---|
| Email-leak confirmation | v2.1.317 (Nov 3) | Web/shell tool calls | Account email could be sent silently inside a request | Asks for confirmation first |
| `blockWritesOutsideWorkingDirectories` | v2.1.314 (Oct 30) | Write, Edit, NotebookEdit | Allowed outside the working directory under `bypassPermissions` | Blocked outside the working directory in every mode |
| Flagged-request fallback | v2.1.314 (Oct 30) | Requests flagged for review | Ended in a refusal if only an older Opus model was reachable | Retries automatically on another available model |

## What Happens When a Flagged Request Can Only Reach an Older Opus Model?

It retries on a different model instead of refusing outright. Claude Code flags certain requests for extra review before serving them; if the only model available at that moment happened to be an older Opus release, the request used to end in a flat refusal rather than a fallback. Since 2.1.314, that same situation triggers an automatic retry against another available model, so a routing quirk no longer reads to the user as the agent simply saying no.

It's a small reliability fix more than a security one, but it matters for the same reason the other two do: an agent that fails in a confusing way — a silent leak, a write nobody approved, a refusal with no explanation — erodes the trust a team needs to let it run with any autonomy at all. [Claude Code's model-fallback behavior](/en/posts/opus-4-8-fast-mode-removal-deadline) has been a moving target all year as Anthropic phases older Opus releases in and out of default availability, and this fix is one more case of the plumbing catching up to that churn.

## How Do You Turn These Protections On?

The email-leak confirmation and the flagged-request fallback are on by default — there's nothing to configure. `blockWritesOutsideWorkingDirectories` is the one opt-in setting here, and it's worth turning on for any Claude Code session that touches more than one repository on disk, especially a monorepo checkout sitting next to unrelated personal or client directories. Teams running Claude Code inside CI or through the [Gateway on Bedrock, Vertex, or a self-hosted proxy](/en/posts/claude-code-monitor-tool-bedrock-vertex-foundry) should set it at the organization level in their shared settings file rather than trusting every developer to flip it locally.

## What Else Shipped in Early November 2026?

Two smaller items from the same week, both operational rather than safety-focused: v2.1.318 (November 4) added `assume_role` support so Claude Code Gateway deployments can attribute AWS spend to the correct account in cross-account setups, and `claude auth status` now reports `loginExpiresAt`, so scripts can check session expiry without waiting for an API call to fail first. Anthropic also keeps a parallel summary in its [release notes overview](https://docs.claude.com/en/release-notes/overview), useful if you only want the headline items without reading every patch-level changelog entry.

## Is This Enough to Trust Claude Code with Sensitive Repos?

My take: these three changes are evidence that Anthropic is treating Claude Code's permission system as a thing to keep hardening by small increments, not a feature that shipped once and is now done — and that's the right posture for a tool that runs shell commands against your actual filesystem. None of it replaces the basics: review diffs before merging, scope API keys narrowly, and don't point an agent at a tree containing credentials you wouldn't want in a prompt. Teams already running [red-team checks against their own LLM applications](/en/posts/how-do-you-red-team-your-llm-app) should add "does this agent still respect blockWritesOutsideWorkingDirectories under bypass mode" to that list, because a setting that's supposed to survive bypass mode is exactly the kind of claim worth verifying yourself rather than taking on faith. And if your team is experimenting with longer-running agent sessions, the same November changelog is where [Claude's message-threads beta](/en/posts/claude-message-threads-explained) lives too — worth reading together, since both are about making multi-step agent work safer and cheaper to run unattended.

## Frequently Asked Questions

### What Claude Code version added the email-leak confirmation?

Claude Code 2.1.317, released November 3, 2026, added a confirmation prompt that fires before a web or shell tool call sends your account email address to the network. Earlier versions sent it silently if a tool call's request happened to include it.

### Does `blockWritesOutsideWorkingDirectories` still apply in bypassPermissions mode?

Yes. Since Claude Code 2.1.314 (October 30, 2026), `permissions.blockWritesOutsideWorkingDirectories` blocks Write, Edit, and NotebookEdit calls outside your working directories in every permission mode, including `bypassPermissions`, which previously removed every guardrail.

### What happens if a flagged Claude Code request can only reach an older Opus model?

As of version 2.1.314, it retries automatically on another available model instead of ending in a refusal. Before that release, a flagged request stuck behind an older Opus model would simply fail with no fallback.

### Do these November 2026 changes affect Claude Code pricing or rate limits?

No. All three changes — the email-leak confirmation, `blockWritesOutsideWorkingDirectories`, and the flagged-request fallback — are permission and reliability fixes with no effect on token pricing, rate limits, or model availability tiers.
