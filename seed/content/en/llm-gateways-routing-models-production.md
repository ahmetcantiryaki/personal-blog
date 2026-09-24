---
title: "What Is an LLM Gateway? Routing Models in Production"
slug: "llm-gateways-routing-models-production"
translationKey: "llm-inference-gateway-2026"
locale: "en"
excerpt: "An LLM gateway sits between your app and model providers, routing requests, failing over automatically, and capping spend across every provider you use."
category: "devops-cloud"
tags: ["llm", "api-design", "cost-optimization", "observability"]
publishedAt: "2026-09-24"
seoTitle: "LLM Gateways: Routing Models in Production"
seoDescription: "An LLM gateway routes requests across providers, handles automatic failover, and caps spend per team. Here's how LiteLLM, Portkey, and Kong AI Gateway compare."
---

Short answer: an LLM gateway is a layer you put between your app and providers like Claude, GPT, and Gemini — it exposes one API surface, automatically fails over to another provider when one goes down, enforces per-team spend caps, and decides which model handles a request based on cost, latency, or task type.

## Why does a team actually need a gateway?

An app that talks directly to one provider inherits that provider's outages as its own. During a brief Claude API disruption last month, a team running behind a gateway automatically shifted traffic to GPT and its users never noticed; a neighboring team with a direct integration went fully down for the same window. The difference wasn't code quality — it was an architectural decision made months earlier.

A gateway's value concentrates in four places: automatic cross-provider failover, virtual-key authentication with per-team spend caps, routing requests by task type, cost, or latency, and centralized observability across every provider. None of that is achievable without writing provider-specific logic into your app — a gateway consolidates that logic into one place instead.

The virtual-key concept is a particularly practical win for small teams: instead of ever handing out real provider API keys to application code or individual developers, you mint a separate "virtual" key per team or project and attach a monthly dollar cap to it. If a project unexpectedly starts burning through tokens, the gateway shuts that key off automatically — the real key is never exposed to leak risk in the first place, because application code never touches it directly.

## Open source or managed: which should I pick?

LiteLLM is the open-source, self-hosted option: it supports 100+ providers through a single OpenAI-compatible protocol and ships with virtual-key budgeting plus a dashboard. The cost is that operational ownership — uptime, scaling, patching — is entirely on you.

Portkey is the managed cloud alternative: a more polished UI, broader provider coverage, semantic caching, and guardrail features, with limited self-hosted options. Its pricing scales with log volume, and the Pro plan starts at $49/month.

Kong AI Gateway starts from a different premise: it makes sense for organizations already running Kong for API management, since the marginal cost of adding LLM traffic to an existing Kong deployment is low. If you're building a greenfield, AI-only platform with no existing Kong commitment, Portkey or LiteLLM is usually the better starting point.

| Gateway | Model | Hosting | Standout feature |
|---|---|---|---|
| LiteLLM | Open source | Self-hosted | 100+ providers via one OpenAI-compatible protocol |
| Portkey | Managed SaaS | Portkey cloud | Semantic caching, guardrails, Pro from $49/month |
| Kong AI Gateway | Add-on to existing platform | Self-hosted or cloud | One platform if you already run Kong |

## Which routing strategy should you actually use?

Four strategies are common, and most teams combine them. Task-based routing sends simple classification requests to a cheap model, like the Gemini Flash family, and complex reasoning work to a more expensive frontier model. Cost-based routing picks the cheapest provider among the ones meeting a quality bar. Latency-based routing shifts traffic to another region or provider when regional API latency spikes. Quality-based routing automatically re-sends a request to a stronger model when the first one returns a low-confidence response.

```yaml
# LiteLLM proxy config example
model_list:
  - model_name: chat-session
    litellm_params:
      model: claude-sonnet-5
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: chat-session
    litellm_params:
      model: gpt-6-astra
      api_key: os.environ/OPENAI_API_KEY

router_settings:
  routing_strategy: latency-based-routing
  fallbacks: [{"chat-session": ["gpt-6-astra", "claude-sonnet-5"]}]
```

Here, the same model name (`chat-session`) points at two different providers; the LiteLLM proxy routes between them by latency and falls back to the next one in the list if one fails. Application code sends its request to a single model name — which provider actually serves that request is entirely under the proxy's control, so a provider swap requires zero application code changes.

## What are the real risks of adding a gateway?

Three risks are real and worth planning for. First, added latency: every request now passes through an extra hop, typically a few milliseconds — noticeable in latency-sensitive, real-time applications. Second, a single point of failure: if the gateway itself goes down, your traffic stops even if every provider behind it is healthy, which is why the gateway needs to be built as a highly available component monitored on its own. Third, prompt cache invalidation: cache accumulated with provider A becomes worthless the moment you shift traffic to provider B — a cost that lives at a completely different layer than the cache mechanics we cover in [our piece on preserving prompt cache with Claude's inline tools](/en/posts/claude-inline-tools-explained).

Our take: the threshold for adding a gateway is clear — once dependency on a single provider becomes a business-continuity risk in production, not just a prototype concern, the gateway pays for itself. Bolting this complexity onto a small, single-provider prototype is a premature optimization.

## What do semantic caching and unified observability actually add?

An ordinary HTTP cache only helps when the exact same request comes in twice; semantic caching can match two requests that mean the same thing but are worded differently — routing "what's the weather in Istanbul?" and "Istanbul's current weather" to the same cache entry. Portkey offers this out of the box; with LiteLLM, semantic matching usually requires a separate vector-database integration, which adds setup complexity but keeps full control in your hands.

The gateway's second major win is eliminating the need to collect logs separately per provider. In a direct integration, each provider has its own log format, its own cost report, and its own error codes; a gateway normalizes all of that into a single schema. In practice, that means answering a question like "which model family drove the most cost last week" from one dashboard instead of three separate bills.

## Frequently Asked Questions

### What's the difference between an LLM gateway and an API proxy?

Short answer: a simple proxy just forwards the request; an LLM gateway adds cross-provider failover, virtual-key spend controls, routing logic, and unified observability on top. A proxy hides one provider, while a gateway manages several under a single interface.

### Should I choose LiteLLM or Portkey?

Short answer: pick LiteLLM if self-hosting and operational control matter to you; pick Portkey if you want less operational overhead and built-in semantic caching and guardrails. Organizations already running Kong have a reasonable third option in Kong AI Gateway.

### How much latency does an LLM gateway add?

Short answer: typically a few milliseconds, since the request makes one extra network hop. For real-time, latency-sensitive applications, it's worth measuring that overhead directly and deciding whether it's acceptable for your use case.

**Sources:** [Deepak Gupta: Top 5 AI Gateways in 2026](https://guptadeepak.com/tools/top-5-ai-gateways-2026/), [Portkey vs LiteLLM comparison](https://medium.com/@adnanmasood/portkey-vs-litellm-routing-fallbacks-cost-tracking-and-control-the-llm-gateway-playbook-part-195855dc25c3), [Zuplo: Best AI Gateway Buyer's Guide 2026](https://zuplo.com/learning-center/best-ai-gateway-buyers-guide).
