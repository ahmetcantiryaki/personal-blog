---
title: "Claude Code's Hidden Tracking Code, Explained"
slug: "claude-code-hidden-tracking-code"
translationKey: "claude-code-hidden-tracking-code"
locale: "en"
excerpt: "Claude Code silently fingerprinted users by timezone and proxy since April, hid the signal in Unicode apostrophes, and Anthropic rolled it back on July 1."
category: "ai"
tags: ["ai-coding", "ai-tools", "ai-reliability", "web-security", "claude"]
publishedAt: "2026-07-07"
seoTitle: "Claude Code's Hidden Tracking Code, Explained"
seoDescription: "Claude Code secretly fingerprinted users by timezone and proxy IP since April 2026, hiding the signal in a swapped Unicode apostrophe until Anthropic pulled it."
---

For three months, Claude Code shipped with obfuscated logic that checked your system timezone and your proxy's IP range, then silently altered a character in its own system prompt to flag the result. A Reddit user surfaced it on June 30, 2026; the pull request that removed it merged on July 1. Here is what the code actually did, why Anthropic says it built it, and what the episode says about trusting a closed-source agent that runs on your machine.

## What a developer on Reddit actually found

The user, posting as LegitMichel777, was reverse-engineering Claude Code's obfuscated bundle and noticed the string "Today's date is" wasn't using a standard apostrophe. Digging further, they found the character was chosen from one of three visually identical but technically distinct Unicode code points, selected by a small decision tree: was the system timezone `Asia/Shanghai` or `Asia/Urumqi`? Did outbound requests route through a proxy on a hardcoded list of Chinese domains and AI-lab IP ranges? Depending on the answers, the date format also flipped from dashes to slashes. The [original writeup made the front page of Hacker News](https://news.ycombinator.com/item?id=48734373) within hours, and [The Register](https://www.theregister.com/ai-and-ml/2026/07/01/anthropic-is-removing-its-covert-code-for-catching-chinese-competitors/5265366) had independent confirmation the same day.

None of this was visible in the terminal. The swapped apostrophe reads identically to a human eye; it's a machine-readable signal, not a user-facing one — a textbook use of steganography, encoding a flag inside content that looks unremarkable.

## How the fingerprint was built

The detection logic itself was obfuscated with a simple XOR cipher (key `91`), which is enough to defeat a plain-text `strings` scan of the binary but trivial to reverse once someone is deliberately looking. The table below summarizes what triggered which signal, based on the reverse-engineering writeups and Anthropic's own account of the feature.

| Signal | Trigger condition | Encoded as |
|---|---|---|
| Regional flag | System timezone is `Asia/Shanghai` or `Asia/Urumqi` | Date format: dashes → slashes |
| Reseller flag | Outbound traffic matches a hardcoded list of proxy/AI-lab domains | One of three lookalike Unicode apostrophes |
| Combined flag | Both conditions true | A third distinct apostrophe variant |
| Obfuscation layer | Applied to all of the above | XOR with key `91` inside the compiled bundle |

The code had been live since version 2.1.91, shipped April 2, 2026, with no line in the release notes.

## Why Anthropic says it built this

Thariq Shihipar, an engineer on the Claude Code team, [posted on X](https://x.com/AnthropicAI) that the feature was "an experiment we launched in March that was meant to prevent account abuse from unauthorised resellers and protect against distillation." Both concerns are real: US export controls restrict direct API access to frontier models for buyers in China, which created a market for resellers who proxy Claude access to customers who can't buy it directly, and Chinese labs have a well-documented pattern of using frontier-model outputs to train competing models faster and cheaper than training from scratch. Flagging a session by locale and proxy path is a plausible, if blunt, way to spot both patterns before they scale.

Shihipar added that the team "had been meaning to take this down for a while" — the removal wasn't purely reactive to the Reddit post, though the timing certainly accelerated it.

## The fallout: a ban, and a trust problem

Alibaba reportedly moved to restrict internal use of Claude Code within days of the finding, citing the covert fingerprinting. That's the visible cost. The less visible one is broader: Claude Code sits in the same trust category as [Claude Code's subagents and background agents](/en/posts/claude-code-subagents-background-agents) — tools developers grant filesystem and shell access to, on the assumption that the vendor's binary does only what the docs describe. A hidden, undocumented signal embedded in ordinary output text undercuts that assumption even if the intent was narrowly defensive.

I'd argue the China angle is a distraction from the actual lesson here. Swap "Chinese reseller detection" for "usage-tier enforcement" or "competitor-model detection" and the same mechanism works identically — and nothing about the architecture of a closed-source coding agent prevents a vendor from shipping it again, more carefully hidden, for a different reason. The interesting failure isn't geopolitical; it's structural. Any agent you don't compile from source can encode arbitrary signals in content you'll never think to inspect.

## What this means if you run Claude Code — or any closed-source agent

Practically, nothing changes for most day-to-day usage: the flag only ever affected a date string, not your code, your files, or your account status in a way anyone has documented. But the incident is a useful prompt to revisit how much implicit trust you extend to AI coding tools. A few concrete habits help:

- Pin your CLI version and read the diff of release notes against actual behavior changes when something feels off, the way this Reddit user did.
- Treat vendor system-prompt content as untrusted output, not configuration you control — the same posture we recommend for [preventing agentjacking-style attacks](/en/posts/agentjacking-ai-agent-attack).
- Watch for AI-tool findings validated independently by more than one source, the pattern we flagged in our piece on [AI slop and open-source security](/en/posts/ai-slop-open-source-security) — a single unverified claim is not evidence, but Hacker News, The Register, and Anthropic's own engineer converging on the same facts is.
- If you evaluate multiple frontier coding assistants, our [Claude Sonnet 5 vs GPT-5.6 vs Gemini 3.5 comparison](/en/posts/claude-sonnet-5-vs-gpt-5-6-vs-gemini-3-5) is a reasonable starting point for weighing vendor track records alongside raw benchmarks.

None of this requires you to stop using Claude Code. It requires treating "the vendor's binary does exactly what the docs say" as an assumption worth periodically testing, not a given.

## Frequently Asked Questions

### Did the hidden code send my code or files anywhere?

No independent report found evidence of that. The mechanism only altered a date string and a punctuation character embedded in Claude Code's own system-prompt output, based on timezone and proxy detection — it did not exfiltrate source code, credentials, or file contents.

### Is the tracking code still in Claude Code today?

Anthropic merged the pull request removing it on July 1, 2026. If you're running a version released after that date, the specific mechanism described here should no longer be present; older pinned versions may still contain it.

### Why didn't Anthropic disclose this in release notes back in April?

Anthropic hasn't given a detailed explanation for the omission beyond calling it an internal experiment. The lack of disclosure, more than the feature's stated purpose, is the core of the criticism from the developer community.

### Does this affect only users in China?

The detection conditions were specific to Chinese timezones and a hardcoded proxy list, so most users outside that pattern were never flagged. The broader point developers are raising isn't about who was flagged this time — it's that the same undisclosed-signal mechanism could target any criteria a vendor chooses next.
