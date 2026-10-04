---
title: "Why Every AI Assistant Now Has 'Skills'"
slug: "ai-assistants-converging-on-skills"
translationKey: "ai-assistants-skills-convergence-2026"
locale: "en"
excerpt: "Claude, Gemini, and ChatGPT are all replacing bespoke custom-assistant features with stackable, slash-invoked skills — a shared primitive, not a copied feature."
category: "ai"
tags: ["claude", "chatgpt", "gemini", "ai-tools"]
publishedAt: "2026-10-04"
seoTitle: "Why Claude, Gemini, and ChatGPT All Use Skills Now"
seoDescription: "Claude Skills, Gemini Skills, and ChatGPT's retiring Custom GPTs all point the same direction: stackable, reusable skills replacing bespoke assistant builders."
---

Short answer: in the last month, all three major AI assistants converged on the same customization primitive — a stackable, slash-invoked "skill" instead of a standalone custom assistant. Google is retiring Gems for Skills starting November 2026, OpenAI is retiring Custom GPTs entirely by December 11, 2026, and Claude's Skills have been the reference design for both.

## What changed, and when?

Three separate announcements landed within weeks of each other. Google announced Gemini Skills on blog.google, rolling out globally in Gemini chat with Workspace accounts following in the coming weeks. OpenAI's ChatGPT release notes from September 11, 2026 announced it would retire Custom GPTs across all plans, with personal accounts (Free, Go, Plus, Pro) already losing the ability to create or publish new GPTs, and Enterprise workspaces following a staged shutdown: an admin notice September 11, a migration push targeted for September 17, no new GPTs after September 25, and full retirement on December 11, 2026. Claude's Skills — folders of instructions, scripts, and reference files Claude loads like plugins — had already been running as the reference implementation of this pattern for months before either rival moved.

## What exactly is a "skill," and how is it different from what it's replacing?

A skill is a reusable, invokable unit of instructions and resources, typically triggered with a slash command, that can be stacked with other skills in the same conversation. What it's replacing — Custom GPTs and Gems — were standalone presets: pick one, and you're locked into that single configuration for the conversation.

That stacking behavior is the actual functional upgrade, not a rebrand. Google's own framing is that a user can combine a brand-voice skill with a specific writing-style skill in the same prompt, something a single selected Gem couldn't do. Claude Skills go further: Claude.ai ships profession-specific skills for domains like real estate, healthcare, and legal that activate automatically based on conversation context, without the user invoking anything at all.

| | Claude Skills | Gemini Skills (replacing Gems) | ChatGPT (post-Custom GPTs) |
|---|---|---|---|
| Invocation | Slash command or automatic (profession-specific) | Slash command (`/`) | Migrating to a plugin directory |
| Stackable | Yes | Yes, explicitly designed for it | N/A — GPTs were single, standalone |
| Reference materials | Docs, code templates, chained sub-skills | Text, PDF, image files | Varied by GPT |
| Active-item cap | No practical instruction limit | 100 active skills | N/A |
| Portability | Claude, Claude Code, adaptable elsewhere | Gemini app, extending to Workspace | GPT Store had 3M+ GPTs; being wound down |

## Why is Google retiring Gems specifically?

Because a single saved preset doesn't compose. Gems let a user save one configuration — a tone, a role, a set of instructions — and switch to it, but using two configurations together meant abandoning one. Skills are explicitly built to be combined: Google's rollout notes describe merging a brand-guideline skill with a writing-style skill as the core use case the redesign targets.

The migration isn't instant, though. Google is auto-migrating existing Gems to Skills starting November 17, 2026 for personal accounts, with the option to create or edit a Gem disappearing October 13, 2026. Workspace business, enterprise, and nonprofit accounts follow in March 2027, and Education accounts in June 2027 — a staged rollout that mirrors how FedRAMP-style enterprise changes typically ship, slowest where the compliance stakes are highest. Skills don't yet match every Gem capability, and Google has capped active skills at 100 per account.

## Why is OpenAI retiring Custom GPTs instead of upgrading them?

Because the GPT Store model — a directory of standalone, independently built assistants — was already the weakest of the three designs for composability, and OpenAI chose to replace it outright rather than retrofit stacking onto it. The GPT Store had grown to more than 3 million published GPTs, but each one was still a single, non-combinable configuration, the same limitation Google is solving for with Skills.

OpenAI's stated migration path moves Custom GPT functionality toward a returning plugin system — the same [ChatGPT plugin directory](/en/posts/chatgpt-plugins-2026-directory-guide) OpenAI brought back this year — rather than a skills model matching Claude's or Gemini's. That's a real design fork worth watching: two vendors converge on "skill," one converges on "plugin," and which label survives in common usage over the next year says something about which mental model actually won.

## Is this convergence, or is one company just copying another?

It's convergence on a shared constraint, not a copy of a single feature. All three vendors hit the same wall — users wanted to combine customizations, not pick exactly one — and arrived at stackable, composable units independently, on different timelines, with different technical implementations (slash commands versus automatic activation versus a plugin directory). Claude got there first by roughly a year; that head start is a timing advantage, not evidence the others copied the Claude Skills spec line for line.

## What does this mean for how you should build and use these?

My take: treat "skill" as a portability signal, not lock-in. A set of instructions written as a Claude Skill is close enough in concept to a Gemini Skill that re-adapting it across platforms is realistic — closer than migrating a bespoke Custom GPT ever was. If you're still relying on a Gem, the practical move is to audit what you have before the October 13 creation cutoff, since you won't be able to patch anything after that date even if the November auto-migration doesn't carry every capability over cleanly.

For teams standardizing on one assistant today, the 100-skill cap on the Gemini side and the lack of a hard cap on Claude's side are both small signals worth factoring into a [subscription decision](/en/posts/which-ai-subscription-2026) if skill count at scale genuinely matters to your workflow.

## Frequently Asked Questions

### When is Google retiring Gemini Gems?

Personal Google accounts can no longer create or edit a Gem after October 13, 2026, and existing Gems auto-migrate to Skills starting November 17, 2026. Workspace business and enterprise accounts follow in March 2027, and Education accounts in June 2027.

### When is OpenAI retiring Custom GPTs?

Personal ChatGPT accounts already lost the ability to create or publish new Custom GPTs as of September 2026. Enterprise workspaces follow a staged shutdown — no new GPTs after September 25, 2026, and full retirement of existing GPTs on December 11, 2026.

### How many skills can I have active in Gemini?

Google caps Gemini at 100 active skills per account. Skills created beyond that cap, or capabilities some Gems supported that Skills doesn't yet match, require review before the November 2026 migration.

### Are Claude Skills, Gemini Skills, and ChatGPT's replacement for Custom GPTs the same thing?

No — they share the same core idea (reusable, stackable instruction sets) but differ in implementation. Claude Skills can activate automatically by profession and have no stated instruction-count limit; Gemini Skills are slash-invoked and capped at 100 active skills; OpenAI is moving Custom GPT functionality toward a plugin directory rather than a skills model.
