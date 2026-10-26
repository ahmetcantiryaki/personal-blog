---
title: "Claude Code's Monitor Tool Comes to Bedrock, Vertex, Foundry"
slug: "claude-code-monitor-tool-bedrock-vertex-foundry"
translationKey: "claude-code-monitor-tool-enterprise-platforms-2026"
locale: "en"
excerpt: "Claude Code 2.1.310 brought the Monitor tool to Bedrock, Vertex, and Foundry, and added Cloud sessions and Remote Control to Enterprise roles."
category: "ai"
tags: ["claude", "monitoring", "cloud", "devops"]
publishedAt: "2026-10-26"
seoTitle: "Claude Code Monitor Tool: Bedrock, Vertex, Foundry Support"
seoDescription: "Claude Code 2.1.310 added Monitor tool support on Bedrock, Vertex, Foundry, plus Cloud sessions and Remote Control Enterprise role permissions."
---

Short answer: Claude Code 2.1.310, released October 23, 2026, brought the Monitor tool to deployments running on Amazon Bedrock, Google Vertex AI, and Microsoft Foundry, and also enabled it in setups with telemetry or nonessential traffic disabled. Teams running Claude Code on any of those three enterprise platforms had gone without event-driven background-task monitoring for roughly six months after everyone else got it.

## What does the Monitor tool actually do?

Short answer: Monitor lets Claude Code start a background shell command and receive each line of its output as a near-real-time event, instead of polling on a timer. The tool shipped in Claude Code around v2.1.98 in April 2026 and became the standard way to track long-running builds, test suites, and deploys without Claude repeatedly checking "is it done yet?"

Output lines that arrive close together (within roughly 200ms of each other) get batched into a single notification, so Claude isn't interrupted line by line. Monitor reuses the Bash tool's existing permission rules — if you're allowed to run a command via Bash, you're allowed to watch it via Monitor. In practice, that turns "ask every 10 seconds if the build finished" into "get notified the moment the build writes to its own log."

## Why didn't it work on Bedrock, Vertex, and Foundry before?

Short answer: from its April 2026 introduction until October 23, 2026, the Monitor tool simply wasn't available on any Claude Code deployment running through Amazon Bedrock, Google Vertex AI, or Microsoft Foundry, and the same restriction applied to setups with telemetry or nonessential traffic turned off. The release notes don't spell out the technical reason, but the effect was concrete: teams using those cloud providers' model endpoints for compliance reasons were stuck with polling or their own custom scripts for watching background agents.

That was a real friction point for regulated-industry teams — finance, healthcare, anyone required to route model traffic through Bedrock or Vertex — who watched other Claude Code users build event-driven agent workflows with Monitor for over six months while compliance requirements kept them on the slower path.

## What exactly changed in 2.1.310?

Short answer: Claude Code 2.1.310 turned on the Monitor tool and plugin monitors on Bedrock, Vertex, and Foundry, enabled the tool in telemetry/nonessential-traffic-disabled configurations, and extended the "long foreground sleeps are now blocked" safety behavior to those same platforms — a protection other environments already had.

| Platform | Before 2.1.310 | 2.1.310 and later |
|---|---|---|
| Amazon Bedrock | No Monitor tool | Monitor tool + plugin monitors |
| Google Vertex AI | No Monitor tool | Monitor tool + plugin monitors |
| Microsoft Foundry | No Monitor tool | Monitor tool + plugin monitors |
| Telemetry-disabled setups | No Monitor tool | Monitor tool available |
| Long foreground sleeps (all platforms) | Not blocked everywhere | Now blocked everywhere |

The same note mentions plugin monitors specifically, meaning third-party plugins can now build their own background-monitoring logic on top of the Monitor infrastructure. The changelog doesn't detail the full API surface, but it confirms plugin authors get a cloud-platform-independent monitoring layer to build on.

## What changed for Enterprise custom roles?

Short answer: 2.1.310 added Claude Code cloud sessions and Remote Control as separately grantable permissions inside Enterprise custom roles, so Owners can control access to each one role by role. The same release changed turning on Cloud sessions or Remote Control in admin settings to require confirmation, and that confirmation screen now lists which custom roles already carry that permission.

It's a small but practical change for large organizations: previously, an admin flipping on Cloud sessions org-wide had no visibility into how many roles — and by extension how many people — that toggle would actually affect. Now that information is in front of them before they confirm.

```text
Admin Settings → Enterprise → Custom Roles
  ├─ Claude Code cloud sessions  [grant / restrict]
  └─ Remote Control              [grant / restrict]

Turning on Cloud sessions or Remote Control:
  → Confirmation required
  → Roles already holding that permission are listed
```

## How do you turn the Monitor tool on for Bedrock, Vertex, or Foundry?

Short answer: there's no separate setup step — once you upgrade the Claude Code CLI to 2.1.310 or later, the Monitor tool becomes available automatically on sessions running through Bedrock, Vertex, or Foundry. The only action required is updating your existing installation.

```bash
# Check your current version
claude --version

# Upgrade to 2.1.310 or later
npm install -g @anthropic-ai/claude-code@latest
```

After upgrading, when Claude starts a background command — a long test suite or a build, for example — it can watch that command with Monitor. Before 2.1.310, that option simply didn't exist on these three platforms; Claude could only run the command and wait for a batched result. The same applies to plugin authors: plugin monitors now work the same way regardless of platform, so a plugin deployed on Bedrock has the same monitoring capability as one running against the Anthropic API directly.

The release note's mention of blocking "long foreground sleeps" refers to a safety check that stops a command from deliberately or accidentally blocking the terminal for an extended period. That check previously existed everywhere except Bedrock, Vertex, and Foundry; it now applies on all three.

## Who actually needs to care about this release?

Short answer: the real beneficiaries are enterprise teams running Claude Code through Bedrock, Vertex, or Foundry, plus Enterprise admins managing custom roles — individual developers or teams calling the Anthropic API directly see no functional change, since Monitor already worked for them.

My take: Anthropic closing a six-month feature gap across three cloud platforms in a single release suggests enterprise Claude Code usage has grown well past simple chat completions into background-agent workflows that regulated teams now expect as table stakes, not a nice-to-have reserved for unrestricted API access.

For more on Claude Code's background-agent ecosystem, see our pieces on [fork subagents becoming the default](/en/posts/claude-code-fork-subagents-now-default) and the [subagents and background agents workflow guide](/en/posts/claude-code-subagents-background-agents); on the enterprise deployment side, our [self-hosted environments explainer](/en/posts/claude-code-self-hosted-environments), [Claude Code Projects and parallel cloud sessions](/en/posts/claude-code-projects-parallel-cloud-sessions), and [what --restricted mode does](/en/posts/claude-code-restricted-mode-explained) round out the context. For more AI news, visit our [AI category page](/en/category/ai).

## Frequently Asked Questions

### What is the Claude Code Monitor tool?

Monitor is a Claude Code tool that starts a background shell command and streams its output back as near-real-time events instead of requiring Claude to poll on a timer. It shipped around v2.1.98 in April 2026, batches output lines arriving within roughly 200ms into one notification, and reuses the Bash tool's permission rules.

### When did the Monitor tool become available on Bedrock, Vertex, and Foundry?

The Monitor tool became available on Amazon Bedrock, Google Vertex AI, and Microsoft Foundry with Claude Code 2.1.310, released October 23, 2026. The same release also enabled it in configurations where telemetry or nonessential traffic is disabled.

### How do Cloud sessions and Remote Control permissions work in Enterprise custom roles?

Starting with Claude Code 2.1.310, Enterprise Owners can grant or restrict Claude Code cloud sessions and Remote Control separately for each custom role. Turning either feature on in admin settings now requires confirmation, and the confirmation screen lists which roles already have that permission.

### Does this release affect individual Claude Code users?

No. Individual developers using the Anthropic API directly, or Claude Code's standard non-cloud setups, already had access to the Monitor tool. This release only affects teams on Bedrock, Vertex, Foundry, or telemetry-disabled enterprise deployments.

Sources:
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog)
- [Claude Code Release Notes](https://docs.claude.com/en/release-notes/overview)
