---
title: "GPT-5.5 Retired From ChatGPT and Codex: What Changed?"
slug: "gpt-5-5-retired-codex-what-changed"
translationKey: "gpt-5-5-retired-codex-chatgpt-2026"
locale: "en"
excerpt: "OpenAI retired GPT-5.5 from ChatGPT and ChatGPT-signed-in Codex on October 14, 2026. API-key access is unaffected; here's what to switch to."
category: "ai"
tags: ["openai", "chatgpt", "ai-coding", "llm"]
publishedAt: "2026-10-18"
seoTitle: "GPT-5.5 Retired From ChatGPT and Codex: What Changed?"
seoDescription: "GPT-5.5 left ChatGPT and ChatGPT-signed-in Codex on October 14, 2026. See who's affected, the replacement models per plan, and what to check now."
---

OpenAI retired GPT-5.5 from ChatGPT and from Codex sessions that sign in with a ChatGPT account on October 14, 2026, at 19:00 UTC. The model stays available if you use the OpenAI API directly, including Codex sessions authenticated with an API key instead of a ChatGPT login. If your workflow only ever used a ChatGPT sign-in, GPT-5.5 is simply gone and your requests now route to a newer default model.

## Who does this actually affect?

This retirement only hits ChatGPT sign-in, not API-key access. If you or your team log into Codex (or ChatGPT itself) with a ChatGPT account on Free, Go, Plus, Pro, Business, Enterprise, or Edu, every request that used to go to GPT-5.5 now goes to a newer model instead.

If your Codex setup authenticates with an OpenAI API key — the common pattern for CI pipelines, scripts, and self-hosted agent harnesses — GPT-5.5 keeps working exactly as before. In that case, model availability follows your API organization and project settings, not this retirement date. The distinction matters because it's easy to assume "Codex" means one thing, when in practice sign-in method decides which rule applies to you.

## What replaces GPT-5.5, and on which plan?

The replacement depends on your plan, not on whether you were using ChatGPT or Codex. [OpenAI's own Codex models documentation](https://developers.openai.com/codex/models) names GPT-6.1 Sol (`gpt-6.1-sol`) as the replacement for Plus, Pro, Business, Enterprise, and Edu plans, and GPT-6 Luna (`gpt-6-luna`) in the desktop app for Free and Go plans.

| Plan | Old model | Replacement | Where it applies |
|---|---|---|---|
| Plus / Pro | GPT-5.5 | GPT-6.1 Sol | ChatGPT chat + Codex (ChatGPT sign-in) |
| Business / Enterprise / Edu | GPT-5.5 | GPT-6.1 Sol | ChatGPT chat + Codex (ChatGPT sign-in) |
| Free / Go | GPT-5.5 | GPT-6 Luna | ChatGPT desktop app |
| Any plan, API key | GPT-5.5 | No change | OpenAI API, Codex with API-key auth |

A few third-party write-ups describe the replacement as "GPT-5.6 Sol" instead, and some developer tool changelogs (GitHub Copilot's among them) map GPT-5.5 to their own product-specific model names. Treat OpenAI's Codex models page as the source of truth for the exact identifiers you put in config files — third-party naming can lag or diverge from it.

## What actually breaks after the cutover?

Nothing breaks in the sense of a tool crashing, but anything that hard-codes `gpt-5.5` as a model identifier silently stops matching a real model and either errors or falls back to a default, depending on how the caller handles an unknown model string. [OpenAI's own ChatGPT release notes](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) point at five places this tends to hide:

- Workspace defaults (an org-wide "use this model" setting)
- Saved model settings in a personal ChatGPT or Codex profile
- Managed configurations pushed by an IT or platform team
- Custom agents or GPTs that pin a specific model in their definition
- Scheduled tasks and scripts that pass a model name as a parameter

A typical place this surfaces is a Codex CLI config or a CI script that pins the model explicitly:

```bash
# Old config — now points at a retired model for ChatGPT sign-in
codex exec --model gpt-5.5 "run the test suite and summarize failures"

# Updated for a Plus/Pro/Business/Enterprise/Edu ChatGPT sign-in
codex exec --model gpt-6.1-sol "run the test suite and summarize failures"
```

If you authenticate that same `codex exec` call with `OPENAI_API_KEY` instead of a ChatGPT login, the `gpt-5.5` line above still works, because the API path isn't part of this retirement at all.

## How do you find every place GPT-5.5 is still referenced?

Search is faster than guessing. Grep your repositories, CI YAML, and any internal docs for the literal string `gpt-5.5`, then check each ChatGPT and Codex account's model settings page by hand, since those live outside your codebase. [Spec-driven coding setups](/en/posts/spec-driven-coding-claude-code-codex) that pin a model per task are a common place teams forget to update, since the model name is buried inside a spec file rather than a top-level config.

For teams running agents in CI, the same caution applies to anything built on top of [OpenAI's Agents API](/en/posts/openai-agents-api-explained) that references a model by string rather than reading it from a central constant — one retirement like this is a good forcing function to centralize that reference if you haven't already.

## Is this the first time OpenAI has retired a ChatGPT-facing model like this?

No. OpenAI has retired consumer-facing models before as newer ones shipped, and [GPT-5.6 reaching general availability in Codex desktop](/en/posts/gpt-5-6-general-availability-codex-desktop) earlier in its own cycle followed a similar pattern: a new model ships, overlaps with the old one for a while, then the old one is cut off from sign-in-based access while the API keeps it alive longer. Anthropic has run comparable migrations for its own models, including the [Claude Opus 4.1 retirement and migration guide](/en/posts/claude-opus-4-1-retires-migrate-to-opus-4-8) and the [Claude Sonnet 4.5 retirement guide](/en/posts/claude-sonnet-4-5-retirement-migration-guide) — in both cases, the API window outlived the consumer-app window, same as here.

My honest take: cutting ChatGPT sign-in access while keeping the API alive is the right call for OpenAI, but it quietly punishes teams that chose the simpler sign-in path specifically to avoid API-key management — they get the breaking change that API-key users are shielded from, with less warning built into their workflow.

## What should you do about it this week?

Audit every place a model string is hard-coded, update it to the plan-appropriate replacement, and consider reading the model from a single config value instead of inlining it in multiple scripts, so the next retirement is a one-line fix instead of a repo-wide search — OpenAI's [API changelog](https://platform.openai.com/docs/changelog) is the fastest way to catch the next one before it breaks a script. If you're also catching up on [Codex's 5-hour usage limit returning](/en/posts/openai-codex-5-hour-limit-returns), this is a good week to review your whole Codex configuration at once rather than patching it twice.

## Frequently Asked Questions

### Does GPT-5.5 retirement affect the OpenAI API?
No. OpenAI's retirement applies only to ChatGPT and to Codex sessions authenticated with a ChatGPT sign-in. The OpenAI API is explicitly exempt, so any integration using an API key keeps GPT-5.5 available, with availability following your API organization and project settings instead of this cutover date.

### What model should I use instead of GPT-5.5 in Codex?
On Plus, Pro, Business, Enterprise, or Edu plans, use GPT-6.1 Sol (`gpt-6.1-sol`). On Free or Go plans, use GPT-6 Luna (`gpt-6-luna`) in the desktop app. Both are OpenAI's documented replacements on the Codex models page; treat any other name you see in a third-party changelog as that tool's own mapping, not OpenAI's.

### Why did some sources say the replacement is GPT-5.6 Sol, not GPT-6.1 Sol?
A handful of secondary write-ups and some developer tools, including GitHub Copilot's changelog, describe the replacement differently from OpenAI's own documentation. The discrepancy likely comes from different products picking their own default at different times; OpenAI's Codex models page naming GPT-6.1 Sol and GPT-6 Luna is the figure to rely on for Codex specifically.

### How do I know if my Codex setup uses API-key auth or ChatGPT sign-in?
Check how you authenticated when you first set up Codex: if you ran a login flow through a browser and a ChatGPT account, you're on sign-in auth and affected by this retirement. If you set an `OPENAI_API_KEY` environment variable or passed a key explicitly, you're on API-key auth and GPT-5.5 keeps working for you regardless of this date.
