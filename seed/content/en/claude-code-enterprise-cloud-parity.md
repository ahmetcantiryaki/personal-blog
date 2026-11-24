---
title: "Claude Code on Bedrock, GCP, Foundry: What Works?"
slug: "claude-code-enterprise-cloud-parity"
translationKey: "claude-code-enterprise-cloud-parity-2026"
locale: "en"
excerpt: "As of November 23, 2026, Claude Code's Code Mode and auto mode both run on Amazon Bedrock, Google Cloud, and Microsoft Foundry, not just Anthropic's platform."
category: "ai"
tags: ["claude", "ai-coding", "cloud", "aws"]
publishedAt: "2026-11-24"
seoTitle: "Claude Code Enterprise Clouds: Feature Parity 2026"
seoDescription: "As of November 23, 2026, Claude Code's Code Mode and auto mode both run on Amazon Bedrock, Google Cloud, and Microsoft Foundry, not just Anthropic's platform."
---

Short answer: yes, mostly. As of the November 23, 2026 release (Claude Code 2.1.331), Code Mode now runs in terminal sessions on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and Claude Platform on AWS — joining auto mode, which reached the same three enterprise clouds four days earlier. The gap with Anthropic's own Claude Platform is closing fast, but it isn't fully closed.

## What changed in the November 23 release?

Claude Code 2.1.331 added Code Mode support in terminal sessions on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and Claude Platform on AWS. Code Mode lets Claude write and run TypeScript to orchestrate MCP tool calls instead of issuing one tool call per turn, which cuts round-trips on multi-step agent tasks.

The same release also added `CLAUDE_CODE_DISABLE_RESPONSE_COMPRESSION` for proxies that were cutting off compressed model responses, and changed plugin marketplaces in managed `extraKnownMarketplaces` to auto-update by default starting November 30, 2026. None of that is cloud-specific, but it tells you the team is still actively shipping into the same release train enterprise customers run.

## Which enterprise clouds have Code Mode now?

All three of the clouds large enterprises actually standardize on: Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry, plus Claude Platform on AWS as a fourth listed target. Before November 23, Code Mode only worked on Anthropic's own Claude Platform and in Claude apps — meaning a bank running Claude Code through Bedrock for data-residency reasons simply couldn't use it.

That matters because Code Mode is one of the bigger throughput wins Claude Code shipped this year. A team restricted to Bedrock for compliance reasons was, until this week, paying the multi-tool-call tax that Code Mode exists to remove.

## Does auto mode also run on these same clouds?

Yes — auto mode for Claude Opus 4.6 and Sonnet 4.6 landed on Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry, plus the Claude apps gateway, in the November 19 release (2.1.328), four days before Code Mode followed the same path. Auto mode routes a turn between a fast classifier and a full model pass depending on task complexity, which is the main lever for cutting latency on routine edits.

The pattern is now visible: Anthropic ships a Claude Code capability on its own platform first, then back-ports it to the three enterprise clouds within one to three weekly releases. [Claude Code's Monitor tool](/en/posts/claude-code-monitor-tool-bedrock-vertex-foundry) followed the same path earlier in 2026, as did [Fast mode on Vertex AI](/en/posts/claude-code-fast-mode-vertex-ai).

## What's still missing compared to Anthropic's own platform?

| Feature | Claude Platform (direct) | Amazon Bedrock | Google Cloud Agent Platform | Microsoft Foundry |
|---|---|---|---|---|
| Code Mode | Yes | Yes (Nov 23, 2026) | Yes (Nov 23, 2026) | Yes (Nov 23, 2026) |
| Auto mode (Opus/Sonnet 4.6) | Yes | Yes (Nov 19, 2026) | Yes (Nov 19, 2026) | Yes (Nov 19, 2026) |
| Enterprise Admin Console sign-in | N/A | Not listed | Not listed | Not listed |
| Easel built-in mod | Pro/Max/Team/Enterprise | Not listed | Not listed | Not listed |

The newest consumer- and org-facing additions — sign-in to Enterprise Admin Console-managed organizations and the easel mod for drawing charts — shipped on November 20 without a matching cloud-platform entry in the same changelog. That's the real signal: core agent-execution features (Code Mode, auto mode, Monitor, Fast mode) now reach enterprise clouds within weeks, while account- and UI-layer features still lag or stay direct-only. Confirm current status against [Claude Code's own changelog](https://code.claude.com/docs/en/changelog) before you plan around any specific row, since this table reflects November 23, 2026 and the cadence is roughly weekly.

## How do you check what's available in your deployment?

Check your installed Claude Code version first, since feature availability tracks the release number, not a flag you set yourself.

```bash
claude --version
claude doctor
```

`claude doctor` reports your configured provider (Bedrock, Vertex-based Google Cloud Agent Platform, Foundry, or direct Claude Platform) alongside the Claude Code version, which is the fastest way to confirm whether a feature in the changelog applies to your setup. If `claude --version` reports anything older than 2.1.331, update before assuming Code Mode isn't available on your cloud — the limitation may be your version, not the platform.

## Should a team using Bedrock or Foundry change how it works today?

If you're already running Claude Code on Bedrock, Google Cloud, or Foundry and avoiding multi-step agent workflows because of the extra round-trip cost, that workaround is now outdated. Re-test your heaviest agentic tasks — large refactors, multi-file migrations, anything that previously needed several sequential tool calls — with Code Mode enabled, since that's exactly the workload it was built to speed up.

Teams gating merges on [Claude Code review in CI](/en/posts/gate-prs-with-claude-code-review-in-ci) should also recheck their pipeline's provider configuration; a CI runner pinned to an older image can silently stay on a pre-2.1.331 binary long after your local machines update, which means your fastest agentic workflow gains may not appear in the pipeline that matters most. The same applies if your CI runs Claude Code headless: see [running Claude Code in CI for automated fixes](/en/posts/claude-code-ci-automated-fixes) for the guardrails worth setting before you let a pipeline act on Code Mode's wider tool-call authority.

My take: the one-to-three-week lag between a Claude Platform launch and the Bedrock/GCP/Foundry equivalent is now short enough that enterprises should stop treating "we're not on Anthropic's direct platform" as a reason to skip a new Claude Code feature — check the changelog before assuming it.

Primary sources: [Claude Code's changelog](https://code.claude.com/docs/en/changelog) and [Claude's release notes overview](https://platform.claude.com/docs/en/release-notes/overview).

## Frequently Asked Questions

### Does Claude Code's Code Mode work on Amazon Bedrock?

Yes. As of the November 23, 2026 release (Claude Code 2.1.331), Code Mode runs in terminal sessions on Amazon Bedrock, alongside Google Cloud's Agent Platform, Microsoft Foundry, and Claude Platform on AWS.

### Is Claude Code auto mode available on Google Cloud and Microsoft Foundry?

Yes. Auto mode for Claude Opus 4.6 and Sonnet 4.6 shipped on Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry, plus the Claude apps gateway, in the November 19, 2026 release (Claude Code 2.1.328).

### How do I know which Claude Code version I'm running?

Run `claude --version` in your terminal, or `claude doctor` for a fuller report that also shows your configured provider (direct, Bedrock, Google Cloud, or Foundry). Compare the version against the dated entries in Claude Code's changelog to confirm a specific feature applies to your setup.

### Why would a feature ship on Claude Platform but not yet on Bedrock?

Anthropic has been shipping agent-execution features — Code Mode, auto mode, the Monitor tool, Fast mode — to its own Claude Platform first, then back-porting them to Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry within one to three weekly releases. Account- and UI-layer features, like Enterprise Admin Console sign-in, have shown no fixed timeline for reaching those clouds as of November 2026.
