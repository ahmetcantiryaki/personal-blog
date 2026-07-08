---
title: "Claude Cowork Expands to Web and Mobile"
slug: "claude-cowork-web-mobile-expansion"
translationKey: "claude-cowork-web-mobile-expansion"
locale: "en"
excerpt: "Anthropic moved Claude Cowork to web and mobile on July 7, 2026. Sessions now run in the cloud, and usage data shows most work is not coding."
category: "ai"
tags: ["ai-agents", "ai-tools", "automation", "ai-infrastructure"]
publishedAt: "2026-07-08"
seoTitle: "Claude Cowork Expands to Web and Mobile: What Changed"
seoDescription: "Anthropic expanded Claude Cowork to web and mobile on July 7, 2026. We cover the permission model, Microsoft 365 write tools, and new usage data."
---

On July 7, 2026, Anthropic moved Claude Cowork off the desktop and onto web and mobile (iOS and Android). Sessions now run remotely in the cloud: start a task at your desk, check status on your phone, and the work keeps going after you close your laptop. The beta opens to Max plan subscribers first, with other plans following over the next several weeks.

## What actually changed

Claude Cowork launched in January 2026 as a desktop research preview: an agent with a sandboxed shell and access to user-selected files and folders, letting Claude read, write, and edit files, run code, and chain multi-step tasks. The target audience was never developers — it was knowledge workers assembling reports, cleaning up spreadsheets, and drafting presentations.

The July 7 expansion changes three things. First, platform: Cowork is now reachable from claude.ai on the web and from the sidebar of the Claude app on iOS and Android. Second, execution model: sessions run remotely, with files and session state saved to your Claude account so work follows you across devices. Scheduled tasks can complete with no device online at all. Third, incentive: Anthropic doubled usage limits through August 5, 2026, to encourage people to try bigger tasks during the beta.

[TechCrunch framed the move](https://techcrunch.com/2026/07/07/the-coding-agent-wars-are-spilling-into-the-rest-of-the-office-claude-cowork/) as "the coding agent wars spilling into the rest of the office," and that framing holds up: Cowork's architecture borrows directly from patterns developers already know from [Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents).

Anthropic's own [announcement post](https://claude.com/blog/cowork-web-mobile) adds a detail worth noting for anyone tracking the product surface: chat and Cowork are being unified into one interface on web and desktop, with projects and artifacts living together across both. Cowork stops being a separate mode and becomes part of the ordinary claude.ai flow, which meaningfully lowers the adoption friction that usually kills a new agent product.

## Why this matters if you build with agents

It is tempting to read Cowork as "a ChatGPT competitor." That misses the point. What matters is that the autonomous-agent design patterns that became normal in Claude Code — sandboxed execution, scoped file access, background execution, approval gates — have now moved outside the codebase entirely. A year ago, "agent" meant a terminal and a repository. Now the same pattern applies to a spreadsheet, an inbox, or a SharePoint folder.

That adds a data point to the ongoing [AI agents versus workflows](/en/posts/ai-agents-vs-workflows) debate: Cowork is not a pre-scoped workflow but a genuine agent, where the user picks files and folders and defines the task on the fly. As autonomy increases, the robustness of the permission model matters proportionally more — which is really the substance of this piece.

There is also a practical takeaway for teams already running Claude Code in production: Cowork's permission and approval architecture will feel familiar. Scoping sandbox access, requiring approval for sensitive actions, persisting session state — these are patterns developers are already comfortable with in a repository context. The difference is that the same patterns now apply to an inbox or a SharePoint site instead of a codebase, which hands platform teams a new job: defining agent permission policy for the entire file and communication surface of an organization, not just its code.

## The permission model: least privilege, human approval

Cowork's security design rests on two principles. First, least-privilege inheritance: Claude cannot exceed the permissions a user already has in Microsoft 365. With write tools enabled, Claude can send email, manage drafts and calendar events, update mailbox settings, and create or update files in OneDrive and SharePoint — but strictly within the scope that user could already see and modify directly. The connector requires a Microsoft Entra tenant on a Microsoft Business plan; personal @outlook.com or @hotmail.com accounts do not qualify. The [Microsoft 365 connector security guide](https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide) also notes that write permissions must be separately approved by a Microsoft Entra Global Administrator before they activate.

Second, human approval for risky or hard-to-reverse actions. Cowork pauses and asks for explicit confirmation before sending, deleting, or sharing externally, and those approvals can now be granted from a phone. In practice this is the same "ask before acting versus act without asking" split we covered in the [Claude in Chrome GA developer security guide](/en/posts/claude-in-chrome-ga-developer-security-guide) — Anthropic is building a consistent approval-gate pattern across its products rather than a one-off for Cowork.

The table below summarizes scope across the three surfaces and how Cowork compares with Claude Code:

| Dimension | Claude Cowork (desktop) | Claude Cowork (web/mobile) | Claude Code |
|---|---|---|---|
| Target user | Knowledge worker, non-technical | Knowledge worker, any device | Software developer |
| Session execution | Local sandbox | Cloud, remote | Local or cloud (background agents) |
| Access scope | Selected files/folders | Selected files/folders + M365 | Repository and shell |
| Cross-device continuity | None | Yes (state saved to account) | Partial (via background agents) |
| Approval surface | Desktop only | Web or mobile | CLI/PR review |

## The usage data: coding is a minority

Alongside the rollout, Anthropic published a usage analysis drawn from 1.2 million anonymized Cowork sessions across more than 600,000 organizations, sampled from the last two weeks of May 2026. The results undercut the assumption that agent tools are mainly a developer's toy: more than 90% of sessions were unrelated to software development, which accounted for just 8.7% of all sessions. The largest category, at 33.4%, was business process and operations — tasks like pulling scattered updates into a single report, building onboarding checklists, or reconciling spreadsheets. Content creation and copywriting followed at 16.4%. Those two categories alone account for half of all Cowork usage. [VentureBeat's coverage](https://venturebeat.com/technology/anthropic-brings-claude-cowork-to-mobile-and-web-as-usage-data-shows-most-users-arent-coding) confirms the figures come directly from Anthropic's own disclosure.

That is a useful signal for developers building internal tools: if the same agent architecture — sandbox, scoped file access, approval gates — works this well outside coding contexts, it is worth reconsidering the scope of internal tools you have been designing as "engineers only."

## Microsoft 365 write tools: an illustrative scope

A connection with write tools enabled conceptually resembles the permission scope below (this is an illustrative example to make the model concrete, not an official Anthropic API schema):

```json
{
  "connector": "microsoft-365",
  "tenant": "contoso.onmicrosoft.com",
  "writeTools": {
    "mail": ["draft", "send"],
    "calendar": ["create", "update"],
    "mailboxSettings": ["update"],
    "oneDrive": ["create", "update"],
    "sharePoint": ["create", "update"]
  },
  "permissionMirror": "user-existing-m365-scope",
  "requiresApprovalFor": ["send", "externalShare", "delete"],
  "adminConsent": "entra-global-admin-required"
}
```

The critical field is `permissionMirror`: Claude's authority comes from the current signed-in user's existing Microsoft 365 role, not from a separate scope defined by the connector itself.

## Cowork's approval gate is the correct call, plainly

An agent that cannot send your email without your sign-off is not a limitation — it is the single best design decision in Cowork so far. Products that expand autonomy while shrinking approval surfaces eventually hit a trust crisis; Anthropic is betting it can claim both speed and safety by refusing to make that trade.

That is the same "who has authority over what" question we cover in [multi-agent orchestration patterns](/en/posts/multi-agent-orchestration-patterns), now applied to office software instead of a swarm of coding agents. If you are designing your own agent systems, it is worth asking the same question: which actions are reversible, which are not, and how do you mark that distinction at the code level rather than leaving it to a prompt?

For more context on where agent design is heading, see our [AI category](/en/category/ai).

## Frequently Asked Questions

### Who can use Claude Cowork right now?

As of July 2026, the beta is open to Max plan subscribers. Anthropic plans to add other plans over the following weeks, and usage limits are doubled through August 5, 2026.

### Can a Cowork session keep running with my laptop closed?

Yes. With the web and mobile expansion, sessions run remotely in the cloud, and files and session state are saved to your Claude account. Scheduled tasks can even complete with no device online.

### Which accounts qualify for Microsoft 365 write tools?

Only work accounts on a Microsoft Business plan tied to a Microsoft Entra tenant. Personal @outlook.com or @hotmail.com accounts are not supported, and write permissions must be separately approved by a Microsoft Entra Global Administrator.

### Does Cowork replace Claude Code?

No. Claude Code stays focused on repositories and the shell, while Cowork operates over a broader scope of files, folders, and office applications. Both share the same underlying agent design principles — sandboxing, approval gates, scoped access — but serve different audiences.
