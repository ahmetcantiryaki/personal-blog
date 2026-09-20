---
title: "Tune Reasoning Effort in Claude, ChatGPT, Gemini"
slug: "tune-reasoning-effort-claude-chatgpt-gemini"
translationKey: "reasoning-effort-controls-2026"
locale: "en"
excerpt: "Short answer: use low effort for simple lookups and high or xhigh for multi-step analysis and coding; the gap multiplies both response time and your bill."
category: "ai"
tags: ["claude", "chatgpt", "gemini", "prompt-engineering"]
publishedAt: "2026-09-20"
seoTitle: "Reasoning Effort Controls: Claude, ChatGPT, Gemini Guide"
seoDescription: "Short answer: use low effort for simple lookups, high or xhigh for multi-step analysis and coding — the gap multiplies both response time and your bill."
---

Short answer: pick low reasoning effort for a simple lookup, and switch to high or xhigh for multi-step analysis, math proofs, or complex coding tasks — accuracy usually goes up, but so do response time and token cost, by a large margin. As of September 2026, Claude, ChatGPT, and Gemini all let you set this level manually, and the right choice depends entirely on the task.

## Why isn't "think harder" free?

When a model switches into extended thinking or reasoning mode, it runs extra intermediate steps — a kind of internal monologue — before producing its actual answer, and each of those steps consumes real tokens and real time. A response a model generates at its xhigh setting can burn tens of times more tokens than the same question answered at low, because you're billed not just for the visible answer but for the hidden reasoning that produced it.

That's why "always pick the highest setting" is both slow and expensive. Asking a model to think at xhigh about what to name a function buys you nothing but extra latency and wasted tokens.

## How does ChatGPT's reasoning control work?

On August 6, 2026, OpenAI retired the separate Instant / Thinking / Pro model picker in the consumer ChatGPT interface and consolidated it into a single model, GPT-5.6 Sol, controlled by one thinking-effort slider that handles both quick replies and long reasoning. Pulling the slider low gets you speed close to the old Instant mode; pulling it high approaches the depth of the old Pro mode.

On the API side, developers set the `reasoning_effort` parameter to `"low"`, `"medium"`, or `"high"`, which directly controls how many internal steps the model runs before responding.

```json
{
  "model": "gpt-5.5",
  "reasoning_effort": "high",
  "messages": [{"role": "user", "content": "Find the race condition in this algorithm"}]
}
```

## What are Claude's extended thinking levels?

With Opus 4.8, released May 28, 2026, Anthropic moved to a five-level ladder: low, medium, high, xhigh, and max. The default used to be medium; since Opus 4.8 it's high, and Anthropic recommends xhigh for coding and agentic tasks, and high for most intelligence-sensitive work. The old `budget_tokens` parameter was removed entirely — the model now decides on its own how much thinking a given request needs within whichever level you picked, instead of you setting a token budget.

```bash
# Set the reasoning level to xhigh in the Claude API
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -d '{"model": "claude-opus-5", "thinking": {"level": "xhigh"}, ...}'
```

## When does Gemini's Deep Think kick in?

Google offers Gemini a separate Deep Think mode for its hardest reasoning problems; it trades standard response speed for letting the model evaluate a question from multiple angles and compare its own intermediate steps against each other. On the API side this behavior is controlled through the `thinking_config` parameter, and Deep Think sits at the top of a four-level ladder, alongside a separate automatic mode.

In practice, Deep Think isn't built for a quick Q&A — it's designed for math proofs, multi-step planning, or reconciling requirements that might conflict with each other.

## Which level should you pick for which task?

The naming differs across all three vendors, but the underlying logic is the same: raise the level as a task's ambiguity and step count grow, and keep it low otherwise.

| Task type | Recommended level | Why |
|---|---|---|
| Simple Q&A, format conversion | Low / Instant | Low accuracy risk, speed matters most |
| General coding, short refactor | Medium | Sufficient accuracy for most tasks |
| Multi-step coding, agentic tasks | High / xhigh | Anthropic recommends this directly |
| Math proofs, conflicting-requirement analysis | Max / Deep Think | Intermediate steps need comparison |

## How do you balance cost and latency in production?

Rather than picking one fixed level, it's more efficient to choose dynamically based on where a request comes from — low effort for a simple user-facing search query, high effort for an automated code-review step in a CI pipeline. As we cover in our [prompt engineering patterns guide](/en/posts/prompt-engineering-patterns), tightening the prompt itself is sometimes a cheaper fix to try before reaching for a higher reasoning level.

Don't overlook defaults, either: Claude Opus 5 defaults to the high level, so if you leave it unset you're already at a medium-to-high cost-accuracy tradeoff. Factor that default in when you're weighing [Claude Opus 5's pricing](/en/posts/claude-opus-5-launch).

## What should you watch for when switching levels?

Before changing the effort level in a production system, measure how long and how many tokens a typical request costs at your current level first — otherwise "it felt better at high" is a subjective impression, not a real measurement. With Claude's `budget_tokens` parameter removed, you no longer set an upper bound — the model decides on its own how much to think within the level you picked, which can increase request-to-request variance even at the same level.

For an interface that responds to users in real time (a chat widget, say), set a clear threshold for how many seconds of wait time a user will tolerate before raising the effort level, and build a fallback that drops a request back to a lower level if it would exceed that threshold. For background batch jobs, where latency matters less, defaulting to a high level is usually the safer choice.

One more practical point for teams switching between providers: the same level name doesn't guarantee the same behavior across vendors — one provider's "high" can run at a depth closer to another's "xhigh." Rather than mapping level names one-to-one when you switch providers, it's more reliable to recalibrate against a small test set built from your actual task.

## Frequently Asked Questions

### What is a reasoning effort setting?

It's the control that determines how many extra intermediate steps — internal reasoning — a language model runs before producing its answer; raising the level generally improves accuracy but also increases response time and token cost.

### How does ChatGPT's thinking effort slider work?

Since August 6, 2026, ChatGPT's consumer interface has run a single model, GPT-5.6 Sol, controlled by one slider instead of separate Instant/Thinking/Pro models; sliding it low means a fast reply, sliding it high means deeper reasoning. On the API, the same idea is exposed as the `reasoning_effort` parameter, set to "low", "medium", or "high".

### Which effort level should I use in Claude?

The default high level is enough for general use; for coding and multi-step agentic tasks, Anthropic recommends moving up to xhigh, while dropping to low or medium for simple Q&A cuts cost noticeably.

### Should I use Gemini Deep Think for every question?

No. Deep Think is built for hard problems that require comparing intermediate steps, like math proofs or multi-step planning; for everyday Q&A or short text edits, the standard mode is both faster and cheaper.

For a closer look at Google's top-tier reasoning mode, see [What Is Gemini 3 Deep Think? Deeper Reasoning](/en/posts/gemini-3-deep-think-explained); to see which AI subscription fits your budget, check [Which AI Subscription in 2026: Claude, ChatGPT, Gemini](/en/posts/which-ai-subscription-2026). For ChatGPT's current plan lineup, see our [ChatGPT Complete Guide 2026](/en/posts/chatgpt-complete-guide-2026). Browse more AI coverage in our [AI category](/en/category/ai).

Sources: [OpenAI model release notes](https://help.openai.com/en/articles/9624314-model-release-notes) and [Anthropic Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview).
