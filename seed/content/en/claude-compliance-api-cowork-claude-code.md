---
title: "Claude Compliance API Now Covers Cowork and Claude Code"
slug: "claude-compliance-api-cowork-claude-code"
translationKey: "claude-compliance-api-cowork-claude-code"
locale: "en"
excerpt: "Anthropic extended the Compliance API on August 11, 2026, to cover Claude Code and Cowork sessions running on users' own machines, via three new endpoints."
category: "ai"
tags: ["claude", "compliance", "ai-infrastructure", "automation"]
publishedAt: "2026-08-17"
seoTitle: "Claude Compliance API Now Covers Cowork and Claude Code"
seoDescription: "Anthropic extended the Compliance API on August 11, 2026, to cover Claude Code and Cowork sessions running on users' own machines, via three new endpoints."
---

Short answer: On August 11, 2026, Anthropic added three new endpoints to the Compliance API that return full transcripts of Claude Code and Cowork sessions running on users' own machines. The feature is in beta for Claude Enterprise organizations and works with your existing Compliance Access Key — no separate integration required.

This closes a concrete gap in how security and compliance teams can audit AI agents running on the desktop: claude.ai chats were already auditable, but what happened inside a Claude Code session on a developer's laptop, or a local Cowork task, sat outside enterprise visibility until this update.

## What exactly was added to the Compliance API?

Per the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview), Anthropic shipped three endpoints that return transcripts of Cowork and Claude Code sessions running on users' machines: one that lists sessions, one that retrieves a single session's metadata, and one that returns its full transcript. All three work with your existing Compliance Access Key and the `read:compliance_user_data` scope — no new key or setup step.

This is Anthropic's second move in this direction this summer. On August 3, 2026, the Compliance API was already extended to cover Cowork sessions started on claude.ai web or mobile — the cloud-side sessions. The August 11 update completes the picture: both cloud and local Cowork sessions, plus Claude Code's CLI and desktop app, are now auditable through the same API.

## Why this matters right now

Short answer: because "shadow AI" risk has moved off chat windows and onto agents running directly on developer machines. Claude Code touches the filesystem, runs commands, and pushes to repositories from a developer's laptop. Cowork's desktop app interacts with local files and apps in a similar way. Because these sessions run on the employee's machine rather than company infrastructure, they were a blind spot that standard network monitoring or DLP (data loss prevention) tooling couldn't see.

That gap was a real problem for companies in regulated industries — finance, healthcare, government. When an auditor asks "which AI agent touched which customer record last month," local Claude Code and Cowork sessions were the part of that question nobody could answer.

## How do the three new endpoints work?

| Endpoint | Returns | Coverage |
|---|---|---|
| `GET /v1/compliance/apps/sessions/local` | List of local sessions org-wide | Claude Code (CLI + desktop), Cowork desktop |
| `GET /v1/compliance/apps/sessions/local/{session_id}` | A single session's metadata | User, start time, status |
| `GET /v1/compliance/apps/sessions/local/{session_id}/messages` | Full transcript | Prompts, responses, tool calls |

For comparison, the cloud side added on August 3 runs through two endpoints: `GET /v1/compliance/apps/sessions/remote` and `GET /v1/compliance/apps/sessions/remote/{session_id}/messages`. Both use the same Compliance Access Key; the only difference is where the session ran — cloud versus local machine.

## What a query actually looks like

Here's how simple it is to list an organization's local sessions and pull one transcript:

```bash
curl https://api.anthropic.com/v1/compliance/apps/sessions/local \
  -H "x-api-key: $COMPLIANCE_ACCESS_KEY" \
  -H "anthropic-version: 2023-06-01"

curl https://api.anthropic.com/v1/compliance/apps/sessions/local/ses_01AbCdEf/messages \
  -H "x-api-key: $COMPLIANCE_ACCESS_KEY" \
  -H "anthropic-version: 2023-06-01"
```

Anthropic hasn't published detailed docs for pagination and filtering parameters yet, so treat the example above as directional — check the [Compliance API documentation](https://platform.claude.com/docs/en/manage-claude/compliance-api) for the complete parameter list.

## Who can use this

The feature is currently beta-only for Claude Enterprise organizations. Anthropic hasn't committed to a timeline for Team or Pro plans, or whether it will roll out there at all. That fits a broader pattern this summer: [Inference Hooks](/en/posts/claude-inference-hooks-explained), which entered beta on August 5, and the [session budgets, advisor models, and data residency controls](/en/posts/claude-managed-agents-budgets-advisors-data-residency) added to Managed Agents on August 7, both shipped to the enterprise tier first. Anthropic is putting concrete engineering effort into production-agent infrastructure this summer.

## Does anyone else offer this?

Here's my honest read: this is an area where neither OpenAI nor Google currently publishes a direct equivalent. ChatGPT Business and Enterprise have chat-history and data controls, but there's no published documentation for pulling local developer-tool sessions — something like Codex CLI's activity — through a centralized compliance API. That's a concrete differentiator that lets Anthropic tell enterprise security teams "you can hand Claude Code to your developers, because you can see what it did afterward." For security teams evaluating whether to wire agentic coding tools into a [CI/CD pipeline](/en/posts/ai-agents-in-cicd-safely), it's a real point in Claude Code's favor.

One caveat: the beta label still applies, the API shape could change, and documentation isn't complete yet. Waiting for a general-availability commitment before wiring this into a production audit pipeline is a reasonable, cautious call.

## How would a security team actually roll this out?

Short answer: first map which surfaces — Claude Code CLI, Claude Code desktop, Cowork desktop, Cowork web/mobile — are actively used in your organization, then confirm your Compliance Access Key carries the `read:compliance_user_data` scope. Skipping those two steps and jumping straight to writing API calls usually results in an audit pipeline that's watching the wrong surface.

A practical rollout order looks like this:

1. **Inventory usage** — list which teams run Claude Code locally, and which run Cowork on which surface.
2. **Verify scope** — confirm your existing Compliance Access Key carries `read:compliance_user_data`; if not, you'll need to create a new key in the Console.
3. **Set up periodic pulls** — query `/sessions/local` and `/sessions/remote` separately, on something like a daily cron job, and write the results into your own logging stack (SIEM, data warehouse).
4. **Define alert thresholds** — build a simple rule engine for transcripts matching specific keywords or file-path patterns; the API itself doesn't generate alerts, it only returns raw data.
5. **Nail down retention** — decide upfront how long you'll keep the transcripts you pull, based on your company's data retention policy.

None of these five steps are prescribed in Anthropic's documentation — the API only supplies the data; building the audit logic is on you. That's an expected design choice: the Compliance API isn't a SIEM or DLP tool, it's the raw data source those tools get fed from.

## Frequently Asked Questions

### When did the Compliance API's Cowork and Claude Code expansion ship?

Anthropic shipped this on August 11, 2026, in beta for Claude Enterprise organizations. It's the second expansion this summer, completing the cloud-side Cowork auditing that shipped on August 3, 2026.

### Do I need a separate integration to use the Compliance API?

No. The new endpoints work with your existing Compliance Access Key and the `read:compliance_user_data` scope you already have. If you're already using the Compliance API to audit Claude chats, there's no extra setup step.

### Which plan tiers can use this feature?

It's currently beta-only for Claude Enterprise organizations. Anthropic hasn't announced a date, or a commitment, for Team or Pro plan availability.

### What's the difference between local session auditing and cloud session auditing?

The local session endpoints (`/sessions/local`) cover Claude Code's CLI/desktop app and Cowork's desktop app; the cloud endpoints (`/sessions/remote`) cover Cowork sessions started on claude.ai web and mobile. Both use the same Compliance Access Key — the only difference is where the session ran.
