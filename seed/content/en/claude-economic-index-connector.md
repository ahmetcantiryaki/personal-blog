---
title: "Ask Claude About the Anthropic Economic Index"
slug: "claude-economic-index-connector"
translationKey: "claude-economic-index-connector"
locale: "en"
excerpt: "Anthropic shipped a claude.ai connector on July 22 letting anyone query the Economic Index directly, turning a research dataset into a chat tool."
category: "ai"
tags: ["claude", "ai-tools", "llm"]
publishedAt: "2026-07-23"
seoTitle: "Ask Claude About the Anthropic Economic Index: What's New"
seoDescription: "Anthropic shipped a claude.ai connector on July 22 letting anyone query the Economic Index directly, turning a research dataset into a chat tool."
---

As of July 22, 2026, you can open the connectors menu in claude.ai, enable the Anthropic Economic Index, and ask Claude which occupations use AI the most or what tasks people are automating in your state. No install, no API key — it works in any conversation with any Claude model, and it draws its answers straight from Anthropic's own AI-adoption dataset instead of Claude's general training knowledge.

## What the Economic Index Actually Is

The Anthropic Economic Index (AEI) is Anthropic's ongoing research project measuring how AI gets used across the real economy, not how vendors say it's used. Since its first release in [February 2025](https://www.anthropic.com/news/the-anthropic-economic-index), the project has shipped five public waves, each one built on a newer Claude model, running from Claude 3.5 Sonnet in Wave 1 through Claude Opus 4.6 in the most recent report. Every wave re-measures the same questions: which jobs touch AI, whether people use it to automate a task outright or to augment their own judgment, and how that pattern shifts as models get better.

The underlying method, described in Anthropic's own [research paper](https://arxiv.org/abs/2503.04761), maps anonymized conversation transcripts onto the roughly 20,000 task descriptions in the US Department of Labor's O*NET database, then rolls those up to six-digit Standard Occupational Classification codes. A model called Clio embeds both the conversation text and the O*NET task descriptions into the same vector space and assigns each conversation to its closest task — at privacy-preserving scale, across a sampled set of Claude.ai Free and Pro conversations plus first-party API traffic.

## The New Connector, in Practice

Before this week, getting at any of this meant reading Anthropic's published reports or downloading the raw dataset yourself. The [new connector](https://www.anthropic.com/news/anthropic-economic-index-connector) collapses that into a normal chat. Turn it on from Settings → Connectors, and Claude can answer things like:

```text
"Which occupations use AI the most right now?"
"What are the most common ways people in my state use Claude?"
"Do teachers mostly use AI to automate grading or to augment lesson planning?"
"How has coding-task usage shifted since the last two AEI reports?"
```

Claude pulls the relevant slice of AEI data, cites the underlying figures, and — because it's a live connector rather than a static chart — lets you follow up with a narrower question instead of starting a new search each time. The full datasets remain free to download from [anthropic.com/economic-index](https://www.anthropic.com/economic-index) for anyone who wants to run their own analysis instead of asking in chat.

## What the Latest Data Actually Shows

The headline number from the most recent wave: 49% of jobs in Anthropic's sample now have at least a quarter of their tasks touched by Claude, up from 36% in January 2025. That's not a claim that AI does a quarter of the job — it means a meaningful slice of the occupation's day-to-day tasks show up in Claude conversations at all.

| AEI wave | Underlying Claude model | Jobs with ≥25% task coverage |
|---|---|---|
| Wave 1 (Feb 2025) | Claude 3.5 Sonnet | 36% |
| Wave 3 | Claude 3.7 / 4 generation | ~40% |
| Wave 5 (latest, 2026) | Claude Opus 4.6 | 49% |

The augmentation-versus-automation split is the more interesting axis for most teams. Early waves consistently found that people lean toward augmentation — using Claude to check, extend, or accelerate their own work — more often than handing a task over outright. Coding and software tasks show the opposite skew more than most categories, with a higher share of straight automation, which tracks with how agentic coding tools like Claude Code get used in practice.

## Why This Is Useful Beyond Curiosity

For a developer or product team, the AEI connector is a faster way to sanity-check a go-to-market assumption. If you're building a tool for accountants, you can ask Claude what accounting tasks already show up heavily in AEI data before you spend a sprint on a feature nobody's routing through AI yet. For content and research teams, it turns a citation chase — normally three tabs of PDF reports — into one grounded conversation, with the added benefit that GEO-style AI answer engines increasingly reward content that cites primary, checkable data like this over recycled blog summaries.

Journalists and policy researchers get something arguably bigger: the same dataset used in think-tank citations and congressional testimony is now queryable in plain language, without needing to know SOC codes or how to filter a CSV by state.

## The Limitations Worth Remembering

None of this makes the AEI a census of the whole economy. The sample is Claude users — people who already chose an AI tool and a specific vendor — which skews toward certain industries, geographies, and job seniority levels. A low measured "AI exposure" for an occupation might mean the work genuinely resists AI assistance, or it might just mean that occupation hasn't adopted Claude specifically, even if it uses a different AI product heavily. Anthropic is explicit about this limitation in its own methodology notes, and it's worth repeating every time someone quotes an AEI percentage as if it were a labor-market fact rather than a Claude-usage fact.

My take: the more valuable long-term signal here isn't any single percentage — it's that Anthropic turned a slow-moving PDF-report cadence into a live, queryable surface, which nudges the entire "AI economic impact" conversation away from annual retrospectives and toward something people can actually interrogate in real time. That shift in access matters more than any one data point in the current wave.

If you're tracking the broader model landscape this connector sits inside, our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) comparison covers where these three labs stand today, and [Claude Reflect](/en/posts/claude-reflect-usage-dashboard-explained) is a good companion read if you want to see Anthropic's other recent move toward giving users direct visibility into their own usage data. For research workflows specifically, our [NotebookLM guide](/en/posts/notebooklm-research-study-guide) covers Google's competing approach to grounding AI answers in a defined source set. And if Skills are new to you, see today's companion piece on [Claude Skills for everyone](/en/posts/claude-skills-explained-for-everyone) — the connector and Skills are separate features, but both are part of the same shift toward making Claude a platform you configure rather than just a chat window. Browse our [AI category](/en/category/ai) for more.

## Frequently Asked Questions

### What is the Anthropic Economic Index?

It's Anthropic's ongoing research project measuring real-world AI usage patterns by occupation, mapping anonymized Claude conversations to US Department of Labor task categories. It has published five waves of data since February 2025.

### How do I enable the Economic Index connector in Claude?

Open Settings → Connectors in claude.ai, find the Anthropic Economic Index in the directory, and turn it on. It then works in any conversation, with any Claude model, without any extra setup.

### Is the Economic Index connector available via the API or Claude Code?

As of this launch, the connector is available in claude.ai. The underlying datasets are freely downloadable from Anthropic's website for anyone who wants to build their own tooling against the raw data instead.

### Does a high AEI percentage for my occupation mean AI will replace those jobs?

No. The Index measures task-level usage patterns within Claude's own user base, split between augmentation (assisting a task) and automation (replacing it), and it does not claim to be a representative sample of the entire labor market.
