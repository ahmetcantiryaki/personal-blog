---
title: "AI Agent Memory: Short-Term to Long-Term"
slug: "ai-agent-memory-systems"
translationKey: "ai-agent-memory-systems"
locale: "en"
excerpt: "A coding agent's scratchpad fills, context evicts, and the one decision that mattered vanishes. The memory taxonomy that prevents this, plus a decision tree."
category: "ai"
tags: ["ai-agents", "vector-database", "software-architecture", "reliability"]
publishedAt: "2026-07-07"
seoTitle: "AI Agent Memory: Short-Term to Long-Term"
seoDescription: "A coding agent forgets a decision it made an hour earlier once context gets evicted. The memory taxonomy that prevents it, plus a persistence decision tree."
---

An hour into a multi-file migration, the agent hit a naming conflict and made a call: keep the legacy field name in the database layer, rename only at the API boundary. It kept working, kept editing files, kept passing tests. Ninety minutes later it "fixed" the same conflict the opposite way, silently undoing its own earlier decision. Nothing crashed. Nothing errored. The decision simply wasn't anywhere anymore.

## What actually happened

The agent's working context — its scratchpad — had filled up with file diffs, test output, and tool calls, and somewhere in an eviction pass, the plain-language note about the naming decision got pushed out along with everything else that looked like "old, no-longer-needed information." That's the failure mode this piece is about: not a model that reasons badly, but a memory system that never distinguished between context that's safe to forget and a decision that needed to survive. [Anthropic's framing of context management](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) names eviction and caching as core patterns precisely because they're where this kind of silent data loss happens — get them wrong and the agent doesn't fail loudly, it fails quietly and confidently.

## The memory taxonomy that would have caught it

Production agent memory in 2026 has converged on roughly four layers, each with a different retention policy and a different backing store.

| Layer | What it holds | Typical retention | Common backing store |
|---|---|---|---|
| Working / short-term | Current task state, active plan, in-flight tool results | Session-scoped, cleared on completion | In-memory or fast cache (Redis-style) |
| Episodic | What happened in a specific past session — decisions made, outcomes observed | Days to months, often summarized over time | Vector store tuned for similarity search |
| Semantic / long-term | Validated, generalized knowledge distilled from many sessions | Indefinite, until explicitly invalidated | Vector or graph store, curated |
| Tool memory | Which tools exist, their schemas, and learned usage patterns | Updated as tools change | Structured store, versioned |

The naming-conflict decision in our example belonged in episodic memory the moment it was made — a small, durable fact ("legacy name kept in DB layer, renamed at API boundary") that should have outlived the working context it was born in. Instead it lived only in the scratchpad, which is exactly the layer designed to be disposable.

## Vector stores, summaries, and key-value state aren't interchangeable

The instinct to reach for a vector database for everything is understandable — semantic search feels like the general-purpose answer — but it's the wrong default for a decision like ours. A vector store is built for *similarity* retrieval: given a query, find the most related past content. A discrete decision like "keep the legacy field name" isn't something you want retrieved probabilistically by similarity; you want it retrieved deterministically, every time the relevant file is touched. That's a key-value or structured-state problem, not a vector-search problem.

The pattern that's converged across production systems by 2026 is hybrid, not single-store: a fast in-memory layer for the current task, a vector or graph store for episodic and semantic recall, and a small amount of structured key-value state for facts that must be retrieved deterministically rather than by similarity. Summaries sit in between — a periodic compression pass that turns a long episodic history into a shorter narrative, trading some detail for a much smaller footprint. Where most teams actually spend their engineering time isn't picking a vector database; it's tuning eviction policy and re-ranking so retrieval doesn't surface stale or irrelevant memories at the wrong moment.

## Eviction and compression: the two ends of the same problem

Left unmanaged, memory grows without bound and retrieval quality degrades as old, superseded content pollutes results — the opposite failure from our story, but caused by the same missing discipline. Two mechanisms address it from different ends:

- **Eviction** actively removes memory once it's judged no longer relevant — typically on a time decay, an explicit "task complete" signal, or a superseding write.
- **Compression** doesn't delete; it distills. A long episodic trace becomes a short summary that keeps the durable facts and drops the blow-by-blow detail.

The naming-conflict bug is what happens when eviction runs *without* a compression step first — the decision was thrown away wholesale instead of being distilled into the one sentence that mattered.

## Retrieval that avoids poisoning context

There's a second failure mode worth naming explicitly: retrieval that *works* but pulls back the wrong thing. A memory system that returns five semantically similar-but-outdated past decisions alongside the one current, correct fact doesn't just waste tokens — it actively confuses the model, which now has to adjudicate between conflicting memories with no clear signal for which one is current. Timestamp-weighted re-ranking (favor recent memories), explicit supersession (a new decision marks the old one invalid rather than coexisting with it), and keeping episodic recall separate from semantic recall in the retrieval step are the three guardrails that keep retrieval from becoming its own source of noise. This is the same discipline we cover from the token-budget side in our [context engineering field guide](/en/posts/context-engineering-for-ai-agents).

## A decision tree for what to persist

Next time an agent makes a call mid-task, run it through this:

1. **Will this matter beyond the current session?** No → leave it in working memory, let it evict naturally.
2. **Is it a fact to retrieve by similarity, or a decision to retrieve deterministically?** Similarity → vector-backed episodic memory. Deterministic → key-value state keyed to the relevant file, task, or entity.
3. **Could a future decision contradict this one?** Yes → make supersession explicit (new write invalidates old), don't just let both coexist in the store.
4. **Is the raw detail needed later, or just the conclusion?** Conclusion only → compress before persisting, don't carry the full trace forward.

Teams building this on top of a broader agent architecture should also read our comparison of [AI agents vs. workflows](/en/posts/ai-agents-vs-workflows), since how much memory infrastructure you need depends heavily on which pattern you picked upstream, and our [guide to cutting LLM token costs](/en/posts/cut-llm-token-costs) covers the budget side of retrieval you don't want to skip.

## Frequently Asked Questions

### Do I need a vector database for every agent?

No. A single-session agent with no need to recall past sessions can run entirely on working memory. Reach for a vector or graph store once you need recall *across* sessions — episodic or semantic memory — not before.

### Why is this described as the fastest-growing part of agent tooling?

The integration surface, not the core pipeline, is where growth is concentrated — memory frameworks now cover well over 20 vector stores and 20+ framework integrations, because no single agent framework has won and teams need memory layers that work across whichever framework they're standardized on.

### What's the difference between eviction and compression?

Eviction removes memory outright, based on a time decay or explicit signal. Compression preserves a distilled version instead of deleting — it's the safer default for anything that might matter later, since eviction is irreversible and compression isn't.

### How do I stop an agent from retrieving outdated memories?

Timestamp-weight your retrieval ranking so recent memories outrank old ones by default, and make supersession explicit — when a new decision replaces an old one, mark the old one invalid rather than leaving both in the store for retrieval to arbitrate between.
