---
title: "How to Fact-Check Your AI Assistant: A Checklist"
slug: "fact-check-your-ai-assistant-checklist"
translationKey: "fact-check-ai-assistant-2026"
locale: "en"
excerpt: "Short answer: verify any number, quote, source link, or code reference an AI gives you against the primary source — these are where it fabricates most."
category: "ai"
tags: ["claude", "chatgpt", "gemini", "ai-reliability"]
publishedAt: "2026-09-20"
seoTitle: "How to Fact-Check Your AI Assistant: 2026 Checklist"
seoDescription: "Short answer: verify any number, quote, source link, or code/API reference against the primary source; these four areas are where AI fabricates most in 2026."
---

Short answer: whenever an AI assistant gives you a number, a direct quote, a source link, or a code or API reference, open the primary source and check it — as of 2026, even the most advanced models still routinely produce confident, plausible-sounding fabrications in these four categories. The checklist below is for catching those before you act on the answer.

## Where do AI assistants fabricate most often?

Hallucination isn't spread evenly — it clusters in specific categories. Academic citations are one: a systematic review published in The Lancet found that the rate of papers containing fabricated references rose from 1 in 2,828 in 2023 to 1 in 458 in 2025, and to 1 in 277 in the first seven weeks of 2026 — nearly a twelvefold increase in three years. That means if an AI recommends a paper, you can't assume it actually exists.

The second risk area is numbers and dates: when a model tells you "a 23% increase" or "launched in 2024," it's hard to tell whether that figure traces back to a real source or is a statistically "plausible-sounding" guess. Third are direct quotes — sentences attributed to a person or document that the model generated itself and that were never actually said. Fourth are code and API references: suggesting a function that doesn't exist, the wrong parameter order, or a library version that's been removed is among the most common issues covered in our piece on [mistakes people make with AI coding assistants](/en/posts/ai-coding-assistant-mistakes). The fifth and riskiest category is medical and legal advice, where a fabricated fact stops being an abstract error and can turn into real harm.

## What does the fact-checking checklist look like?

Run through these five steps before you act on an AI's answer:

1. **Ask for a source, then actually open it.** Ask "what's the source for this?" and click through to check whether the content actually supports the claim — if the link is dead or the content doesn't match, don't use the information.
2. **Ask the same question to a second tool.** Claude, ChatGPT, and Gemini are unlikely to all fabricate the exact same wrong answer; if two tools disagree, treat that as a warning sign.
3. **Explicitly ask the model to flag its own uncertainty.** Adding an instruction like "say so if you're not sure" or "flag it if you don't have a source" measurably reduces — though doesn't eliminate — a model presenting a low-confidence guess as settled fact.
4. **Look up numbers and quotes at the primary source.** Search for a cited statistic directly in the original report, paper, or official page — don't verify it against a second-hand summary.
5. **Test code and API references by running them.** Confirm a suggested function actually exists and behaves the way the documentation says before you put that code into production.

## Does asking for a source actually help?

Partly. Asking a model for a source can sometimes produce a realistic-looking but nonexistent URL — a separate type of hallucination often called "source fabrication." That's why asking for a citation isn't enough on its own; you still have to open the link and confirm the content actually matches the claim. Tools with live web search enabled (like ChatGPT or Claude with search turned on) are more reliable here than a model relying purely on training data, because at least the link goes to a real page — but you still have to check whether that page's content actually supports the claim.

## Which prompts actually reduce fabrication?

Explicitly instructing a model to "only say what you actually know, and flag it if you're not sure" reduces — without eliminating — its tendency to present a low-probability guess as certain. For a complex, multi-step question, forcing the model to reason step by step (for example, "first list which sources you'd need to check, then answer") also lowers the fabrication rate, because the model has to lay out its intermediate steps instead of taking a shortcut to a generalization. We cover this kind of structured prompting in more detail in our [prompt engineering patterns guide](/en/posts/prompt-engineering-patterns).

## How does the hallucination rate differ across models?

2026 data shows a real gap between models, and real improvement over time — but no model has reached zero.

| Model / metric | 2023 | 2025 | 2026 |
|---|---|---|---|
| ChatGPT hallucination rate | 55% | 57.7% | 38% |
| Gemini fabrication rate | 100% | — | 12% |
| Frontier models, overall range | — | — | 3.1%–19.1% |
| Fabricated-reference rate in academic papers | 1 in 2,828 | 1 in 458 | 1 in 277 (first 7 weeks) |

The key detail here is that the 3.1%–19.1% range shifts with task type and reasoning setting — meaning the same model's reliability can differ sharply from one task to another.

## Frequently Asked Questions

### How do I tell when an AI has made something up?

There's no single tell, but warning signs include a very specific number or date given with no source, a provided link that doesn't open or doesn't match the claim, or a different answer when you ask a second tool the same question — in any of these cases, verify against a primary source before using the information.

### If I ask an AI for a source, is the link it gives me real?

Not always. Models can sometimes generate realistic-looking but nonexistent URLs, so you have to actually open the link and confirm the content genuinely supports the claim — a link being provided at all is not sufficient verification on its own.

### Which AI tool hallucinates the least?

As of 2026, Gemini's fabrication rate dropped from 100% in 2023 to 12%, while ChatGPT sits at 38% — but these rates shift with task type and reasoning setting, so there's no single "most reliable" answer; whichever tool you use, don't skip the verification step for anything that matters.

### Can I trust AI on medical or legal questions?

For general background, yes; for a final decision, no — medicine and law are among the riskiest categories because a fabricated fact there can cause real harm, so any AI answer in these areas needs to be checked against a professional or an official source before you act on it.

Developers who want to systematically reduce hallucinations in production systems should see our more technical [guide to reducing LLM hallucinations](/en/posts/reduce-llm-hallucinations). To see which AI tool fits your everyday use, check [Which AI Subscription in 2026: Claude, ChatGPT, Gemini](/en/posts/which-ai-subscription-2026). Browse more AI coverage in our [AI category](/en/category/ai).

Sources: [The Lancet fabricated-citation study, via STAT News](https://www.statnews.com/2026/05/07/lancet-study-finds-steep-rise-fraudulent-citations-academic-papers/) and the [2026 AI hallucination rate benchmark](https://truestandard.ai/blog/ai-hallucination-rates-2026).
