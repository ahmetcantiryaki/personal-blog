---
title: "What Do AI Assistants Do With Your Data?"
slug: "protect-privacy-ai-assistants"
translationKey: "protect-privacy-ai-assistants"
locale: "en"
excerpt: "Claude, ChatGPT, and Gemini all store your chats, memory, and connected-app data, and each lets you opt out of training separately from turning off memory."
category: "technology"
tags: ["claude", "chatgpt", "gemini", "privacy"]
publishedAt: "2026-08-22"
seoTitle: "AI Assistant Privacy in 2026: A Practical Checklist"
seoDescription: "How Claude, ChatGPT, and Gemini handle your chats and training data as of August 2026, plus a step-by-step privacy audit for personal and family accounts."
---

Short answer: Claude, ChatGPT, and Gemini each store chat history, a separate "memory" of facts about you, and connected-app data, and in all three, turning off memory does not automatically opt you out of having your conversations used for model training — those are two separate settings you have to manage independently.

## What Do AI Assistants Actually Store About You?

Four distinct categories of data accumulate across any AI assistant you use regularly: your raw chat history, a separate memory layer that stores facts the assistant infers about you over time, data from any app or account you've connected (email, calendar, files), and — on ChatGPT specifically — a browsing/activity history feature. Each category typically has its own retention setting and its own training opt-out, which is exactly why "I turned off memory" doesn't mean "nothing about me is stored anymore."

## Does Claude Use Your Chats to Train Its Models?

No, not by default for consumer accounts, and never for Claude for Work, Enterprise, API, Amazon Bedrock, or Google Vertex AI usage — those are contractually excluded from training with no opt-out needed. For consumer accounts, Anthropic changed its default in 2025: consumer users had until September 28, 2025 to opt out of having their chats used for training, after which non-opted-out consumer data became eligible for training use. If you never explicitly opted out around that date, check your current setting rather than assuming you're excluded. Claude's memory feature, where it stores facts about you across conversations, is opt-in and rolled out through 2026 for Team and Enterprise plans; you can view, edit, or delete anything it has stored. An "Incognito" chat mode is available to exclude a specific conversation from memory and history entirely.

## How Do You Turn Off ChatGPT's Training Setting?

Go to Settings → Data Controls and turn off "Improve the model for everyone" — it's on by default for Free, Plus, and Pro accounts. This is a separate toggle from Memory: turning off Memory stops ChatGPT from remembering facts about you across chats, but does not by itself opt you out of training, and vice versa. If you want both, you need to change both settings explicitly.

## What Is ChatGPT's Computer History Feature, and Is It Safe to Enable?

Computer History is a macOS desktop-app-only feature that launched August 13, 2026; it's off by default and requires Memory to already be enabled before you can turn it on. It records your app and website activity through macOS accessibility APIs and turns it into summaries — OpenAI states it does not capture screenshots, audio, or anything from private browsing, and you choose which apps and sites are allowed to contribute, with the ability to pause it anytime. Pro users can enable it themselves; Business and Enterprise users need admin approval, and it isn't available at all in the EEA, Switzerland, or the UK. Shortly after launch, [Help Net Security reported](https://www.helpnetsecurity.com) privacy and infostealer-exposure concerns about the feature on August 19, 2026 — worth reading before you turn it on, given it's brand new and hasn't had much time for independent security review. We cover the feature's settings in more depth in [ChatGPT's Computer History, Privacy and Usage](/en/posts/chatgpt-computer-history-privacy).

## How Do You Control What Gemini Remembers?

Go to myactivity.google.com/product/gemini and toggle "Keep Activity" (Google renamed this from "Gemini Apps Activity"). Turning it off excludes future conversations from human review and from training. One caveat worth knowing: some 2025 reporting found that Google's review sampling isn't limited to typed text — uploaded files and photos can also be sampled — and that some technical metadata (prompt shape, latency) may still be logged even with Activity turned off, though not tied to your account identity according to that reporting. Default retention for activity data is 18 months, adjustable through Auto-delete settings. Gemini for Google Workspace and Enterprise accounts are contractually excluded from training by default, the same pattern Claude and ChatGPT follow for their business tiers.

| | Consumer training opt-out | Enterprise/business default |
| --- | --- | --- |
| Claude | Opt-out required (deadline was Sept 28, 2025); check current setting | Never trained on, contractually, no opt-out needed |
| ChatGPT | Settings → Data Controls → "Improve the model for everyone" (on by default) | Excluded by default under Business/Enterprise agreements |
| Gemini | myactivity.google.com/product/gemini → "Keep Activity" (on by default) | Excluded by default for Workspace/Enterprise |

## How Much Access Should You Give Connected Apps?

Apply least privilege the same way you would to any third-party OAuth app: grant read-only access where the assistant only needs to look something up, avoid connecting anything with write access to production systems or financial accounts unless you specifically need the assistant to act on your behalf, and review your connected-apps list every few months to revoke anything you no longer actively use. A connector you approved once for a one-off task is easy to forget about — and it keeps working until you revoke it.

## What Should You Never Paste Into an AI Assistant?

Treat any consumer AI chat the way you'd treat a message to a vendor's support team: don't paste passwords, API keys or tokens, unredacted financial account numbers, health records tied to your identity, or anything covered by an NDA or attorney-client privilege, even if the assistant's policy says it won't train on it. Policies change, accounts get compromised, and a pasted secret sits in your chat history regardless of the current training setting. If you need an assistant to work with sensitive data professionally, that's what enterprise tiers with contractual data exclusions and admin-managed retention exist for.

## How Is Enterprise Data Handling Different From Consumer?

Enterprise and business tiers across all three vendors share the same core pattern: no training on your data by default, admin-controlled retention policies, and (for Claude specifically) compliance-focused tooling like session transcript access for audited organizations. That's a meaningfully different trust model from a personal account, where you're relying on a toggle you set once and might forget to revisit. If your organization handles regulated data, use the business tier rather than personal accounts for any work-related AI use, full stop.

## What About Kids and Family Accounts?

Check whether the assistant has an age-appropriate mode before letting a minor use it unsupervised — both OpenAI and Anthropic have shipped age-related features in 2026 (age prediction and teen-specific settings on ChatGPT, an education-focused offering from Anthropic), and defaults for a minor's account are not always as conservative as you'd assume. Review a family member's connected apps and memory settings the same way you'd review your own, since a shared household device often means a shared memory profile unless accounts are kept separate.

## How Do You Run a Periodic Privacy Audit?

```text
Every 3 months, for each AI assistant you use regularly:
1. Check the training opt-out setting — is it still set the way you want?
2. Open the memory/stored-facts view — delete anything outdated or wrong.
3. List connected apps/accounts — revoke anything you no longer use.
4. Search your chat history for pasted secrets (passwords, keys, account
   numbers) and delete those conversations.
5. If a new feature launched (browsing history, computer history, agentic
   actions) — check its default state before you touch it. Off-by-default
   features are safer to leave alone until you've read what they log.
```

Running this once a quarter takes about ten minutes per assistant and catches the setting drift that happens naturally as vendors ship new features with their own defaults. For more on how these assistants' newest capabilities work under the hood, see our explainer on [Claude's browser use tool](/en/posts/what-is-claude-browser-use-tool), or browse our [technology category](/en/category/technology) for more coverage.

## Frequently Asked Questions

### Does turning off ChatGPT Memory also stop it from training on my chats?

No. Memory and the training opt-out ("Improve the model for everyone" in Settings → Data Controls) are separate settings. You need to turn off both independently if you want neither feature active.

### Is Claude allowed to train on my conversations?

For consumer accounts, yes, unless you've opted out — Anthropic's policy change in 2025 set a September 28, 2025 deadline for consumer users to opt out before their chats became eligible for training. Claude for Work, Enterprise, API, Bedrock, and Vertex AI usage is never used for training, with no opt-out needed.

### What is ChatGPT's Computer History feature and should I turn it on?

It's a macOS desktop-only feature, launched August 13, 2026, that summarizes your app and website activity for ChatGPT to reference — off by default and requiring Memory to be enabled first. It's new enough that independent security reviews are still limited, so read up on the reported privacy concerns before enabling it, especially if you handle sensitive work on the same machine.

### How do I stop Gemini from using my chats for training?

Go to myactivity.google.com/product/gemini and turn off "Keep Activity." This excludes future conversations from human review and training, though some technical metadata may still be logged separately from your account identity.
