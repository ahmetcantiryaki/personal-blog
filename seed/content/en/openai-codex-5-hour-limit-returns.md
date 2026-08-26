---
title: "OpenAI Brings Back Codex's 5-Hour Usage Limit"
slug: "openai-codex-5-hour-limit-returns"
translationKey: "openai-codex-5-hour-limit-returns"
locale: "en"
excerpt: "OpenAI reinstated a 5-hour usage cap on Codex and ChatGPT Work for Plus subscribers on August 25, 2026, after weeks of running on the weekly quota alone."
category: "ai"
tags: ["openai", "chatgpt", "ai-coding", "developer-experience"]
publishedAt: "2026-08-26"
seoTitle: "OpenAI Brings Back Codex's 5-Hour Usage Limit"
seoDescription: "OpenAI reinstated a 5-hour usage cap on Codex and ChatGPT Work for $20/month Plus subscribers starting August 25, 2026, after weeks without it."
---

Short answer: yes, if you're on the $20/month ChatGPT Plus plan, Codex and ChatGPT Work are throttled again. OpenAI restored a 5-hour rolling usage cap on both products for Plus subscribers starting August 25, 2026, after running without it for several weeks. Pro subscribers on the $100 and $200/month tiers are not affected.

Thibault Sottiaux, OpenAI's technical lead for Codex and ChatGPT Work, [announced the change on X](https://9to5mac.com/2026/08/24/openai-restores-5-hour-codex-and-work-limits-for-chatgpt-plus-users/) on August 24, 2026. The timing matters: this is the second time in 2026 that OpenAI has pulled back a usage restriction it had previously relaxed — see our [earlier look at OpenAI's reliability streak](/en/posts/openai-outage-streak-what-it-teaches-developers) — and it directly affects anyone who leans on Codex for daily coding work. If you're weighing Codex against other options, our [ChatGPT complete guide](/en/posts/chatgpt-complete-guide-2026) breaks down every plan tier in detail.

## What changed on August 25, 2026?

Plus subscribers had been working against a weekly quota only, with no 5-hour ceiling, for several weeks before the reversal. As of August 25, the 5-hour rolling window is back on top of that weekly quota for both Codex and ChatGPT Work.

That's a meaningful difference for anyone running long agentic coding sessions. A weekly-only quota lets you burn through a large chunk of usage in one intense day, then coast for the rest of the week. A 5-hour window forces you to pace consumption throughout each session, because hitting the ceiling mid-task means waiting out the reset or buying extra credits before you can continue.

## Why did OpenAI reinstate the cap?

OpenAI's stated reasoning is server load management, not hidden cost-cutting — though the two are rarely fully separable in practice. The company's public framing describes the 5-hour limit as protecting the product experience under heavy concurrent demand, rather than as a way to push users toward higher-priced tiers.

Whatever the primary driver, the practical effect is the same: Codex and ChatGPT Work became measurably less generous overnight for the plan tier that most individual developers and freelancers use.

## How does the 5-hour Codex limit actually work?

The cap is a consumption threshold measured over a sliding 5-hour window, layered on top of the existing weekly quota — both limits apply simultaneously, and hitting either one blocks further use. When a Plus user exhausts the 5-hour allowance, Codex and ChatGPT Work stop responding to new requests until the window resets or the user buys additional credits.

This is not a hard daily cutoff. Because the window slides continuously, usage from five hours ago rolls off and frees up headroom in real time, rather than resetting once at a fixed clock time. In practice, that means short, spaced-out coding sessions fare much better under the cap than one long uninterrupted sprint.

## Are Pro subscribers affected?

No. OpenAI has stated that the 5-hour limit will not be reactivated on the $100/month and $200/month Pro plans "in the coming months." Pro users continue to operate against the weekly quota only, the same arrangement Plus users had enjoyed until August 25.

That gap is the real story here: it's a $80–180/month premium to avoid session-level throttling, on top of the $20/month Plus baseline.

## How do the plans compare now?

| Plan | Monthly Price | 5-Hour Cap (Codex/Work) | Weekly Quota |
|---|---|---|---|
| ChatGPT Free | $0 | Applies (tighter) | Applies |
| ChatGPT Plus | $20 | Reinstated Aug 25, 2026 | Applies |
| ChatGPT Pro | $100–$200 | Not reactivated | Applies |
| ChatGPT Team | Per-seat, business | Varies by admin config | Applies |
| API (pay-per-use) | Usage-based, no subscription | No session cap | Rate limits by tier |

## What should developers who rely on Codex do now?

If Codex is part of your daily workflow, the 5-hour cap changes how you should schedule work, not necessarily which tool you use. Three practical adjustments apply immediately.

First, break long agentic sessions into shorter, spaced blocks rather than one marathon run — the sliding window rewards pacing. Second, track how close you are to the ceiling before starting a task you can't interrupt, since hitting the limit mid-refactor is worse than hitting it between tasks. Third, compare the real cost of upgrading to Pro against paying for API usage directly: heavy users doing dozens of hours of agentic coding a week may find the $100/month Pro tier cheaper than the token cost of an equivalent API workload, while lighter users are usually better off on pay-per-use API pricing with no session cap at all.

It's also a reasonable moment to benchmark Codex against other coding agents you already have access to — Claude Code and Cursor both use different usage models, and neither reintroduced a comparable 5-hour session cap on their standard tiers as of August 2026. If you're re-evaluating your AI coding stack anyway, our roundup of [common AI coding assistant mistakes](/en/posts/ai-coding-assistant-mistakes) is worth a pass regardless of which tool you land on.

## Is this part of a bigger pattern at OpenAI?

Yes. This is the second notable usage-limit reversal from OpenAI in 2026, following a stretch of highly visible reliability incidents earlier in the year. The pattern suggests OpenAI is actively trading off generosity against infrastructure load in near real time, rather than locking in a fixed policy — which means Plus-tier limits in particular are worth rechecking periodically rather than assumed to be stable.

For teams standardizing tooling around Codex, that volatility is itself a planning input: a workflow built around "unlimited Plus usage" can lose that assumption with a single X post and 24 hours' notice. See OpenAI's own [ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) for the canonical, up-to-date list of what's currently capped and what isn't, and browse our [AI category](/en/category/ai) for related coverage as the situation evolves.

## Frequently Asked Questions

### Does the 5-hour Codex limit apply to ChatGPT Team or Enterprise plans?

OpenAI's August 25, 2026 announcement specifically named Plus subscribers; Team and Enterprise usage limits are typically configured per organization by an admin and are not automatically identical to the consumer Plus cap. Check your workspace's admin settings or usage dashboard for the specific limits your organization has configured.

### Will the Codex 5-hour cap come to Pro plans too?

OpenAI has stated the limit will not be reactivated on the $100/month and $200/month Pro plans "in the coming months," which leaves the door open for a future change but rules it out for the near term as of August 2026. Pro users should still monitor official announcements, since Plus users had the same assurance before the cap returned there.

### What happens if I hit the 5-hour Codex limit mid-task?

Codex and ChatGPT Work stop accepting new requests until the rolling 5-hour window frees up capacity or you purchase additional credits; there's no way to push through the limit with prompt engineering. Because the window slides continuously rather than resetting at a fixed time, older usage from the start of your session rolls off gradually, so waiting even 20–30 minutes can restore partial headroom.

### Is it cheaper to use the OpenAI API instead of ChatGPT Plus for Codex-style coding?

It depends on volume: pay-per-use API pricing has no 5-hour session cap and only rate limits by usage tier, which suits light or bursty coding work, while heavy daily users running many hours of agentic sessions may spend more on API tokens than the $100/month Pro subscription. Track your actual token consumption over a week before switching, since the break-even point varies significantly by coding style and model choice.
