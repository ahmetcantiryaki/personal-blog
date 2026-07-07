---
title: "LLM Structured Outputs: JSON You Can Trust"
slug: "llm-structured-outputs-json"
translationKey: "llm-structured-outputs-json"
locale: "en"
excerpt: "Field notes on getting reliable JSON from an LLM: schema modes vs tool-calling, Zod/Pydantic validation at the boundary, and the failure modes that still bite."
category: "ai"
tags: ["llm", "api-design", "best-practices", "reliability"]
publishedAt: "2026-07-07"
seoTitle: "LLM Structured Outputs: JSON You Can Trust"
seoDescription: "Field notes on reliable LLM JSON: schema modes vs tool-calling, Zod/Pydantic validation at the boundary, repair loops, and failure modes like enum drift."
---

The fastest way to get reliable JSON from an LLM is to stop parsing free text and start constraining generation with a schema, validating every response at the boundary before it touches downstream code. That single change — schema-constrained output plus boundary validation — is now treated as a core production safety component, not an optimization. Here are the field notes from actually running it.

## Why free-text parsing breaks

The failure mode is always the same shape: a regex or a naive `JSON.parse` works fine in testing, then breaks in production on a response that's 99% correct — a trailing comma, a stray markdown code fence, a field the model decided to explain in prose instead of filling in. Free-text parsing isn't unreliable because models are bad at JSON; it's unreliable because *nothing constrains the model to only produce JSON*, so any drift in output format is a silent failure until something downstream throws.

## JSON mode, structured outputs, and tool-calling aren't the same guarantee

These three get used interchangeably in casual conversation and they shouldn't be — they carry meaningfully different reliability guarantees.

| Approach | Guarantee | Typical failure rate | Best for |
|---|---|---|---|
| Free-text + parser | None — model can emit anything | Highly variable, often double digits | Never, in production |
| JSON mode | Valid JSON syntax only | ~2–5% schema mismatch | Exploratory work, no fixed schema yet |
| Structured outputs (strict schema mode) | Full JSON Schema compliance via constrained decoding | Under 0.1% | Production pipelines with a known schema |
| Tool/function calling | Schema compliance, plus explicit intent to invoke an action | Comparable to structured outputs | Anything that also needs to trigger a downstream action |

The practical rule of thumb: use strict structured outputs when you just need typed data back, and tool-calling when the model's output is also supposed to *do* something — call a function, hit an API, trigger a state change. Reach for JSON mode only in the early, schema-not-decided-yet phase of a feature.

## Validate at the boundary anyway

Structured outputs collapsing the failure rate below 0.1% is not the same as zero, and it says nothing about whether the *values* are correct — a schema-compliant response can still have a wrong enum, an out-of-range number, or a hallucinated field that happens to type-check. Put a validator at the system boundary regardless:

```ts
import { z } from "zod"

const TicketTriage = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  category: z.string().min(1).max(64),
  summary: z.string().max(280),
  needsHumanReview: z.boolean(),
})

const parsed = TicketTriage.safeParse(modelResponse)
if (!parsed.success) {
  // route to the repair loop below, don't let it reach downstream code
}
```

This is the same boundary-validation discipline we recommend for [evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) generally — a schema check is a floor, not a substitute for checking whether the content is actually right.

## Retry-on-invalid and partial streaming

When validation fails, don't just error out — feed the validator's specific failure back to the model and ask it to repair its own output. This converges fast in practice, usually within one or two retries, because the model is correcting against a concrete, structured complaint rather than guessing what went wrong:

```ts
async function generateValidated(prompt: string, maxRetries = 2) {
  let lastError: string | undefined
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await callModel(prompt, lastError)
    const parsed = TicketTriage.safeParse(response)
    if (parsed.success) return parsed.data
    lastError = parsed.error.message
  }
  throw new Error("Structured output repair loop exhausted")
}
```

For latency-sensitive UIs, partial streaming of a structured response — rendering fields as they complete rather than waiting for the full object — pairs well with this pattern, since a partially streamed object can still be validated field-by-field as it arrives.

## The scratchpad contract: reasoning space without the "think step by step" tax

Bolting "think step by step" onto a request for structured output is a common mistake: on current reasoning models it burns tokens and shows no measurable accuracy lift, because the model already reasons internally before it ever starts emitting the schema. A tighter pattern is a scratchpad contract — a bounded `plan` field with a hard cap on bullet points, followed by the actual structured `answer` field. It gives the model room to reason explicitly, keeps that reasoning inspectable for debugging, and avoids the open-ended token burn of unconstrained chain-of-thought.

## Field notes: three failure modes that still get you

- **Over-nested schemas.** Past three or four levels of nested objects, models start dropping or malforming inner fields more often — flatten your schema wherever the domain allows it, even if it means a slightly less "clean" data model.
- **Enum drift.** A model will occasionally emit a plausible-sounding value just outside your enum (`"med"` instead of `"medium"`) when the training distribution has seen that variant elsewhere. Strict schema modes catch this as a validation failure, which is a feature — silently coercing it is how it slips into production data.
- **Structured hallucination.** The most dangerous failure mode: a fully schema-compliant response with a fabricated value in a field that type-checks perfectly. Structure guarantees shape, not truth — a plausible-but-wrong `customerId` breaks nothing at the schema layer and only surfaces downstream. Field-level sanity checks (does this ID exist? is this number in a plausible range?) are the only real defense.

## Token-cost tradeoffs of strict schemas

Strict schemas aren't free. Complex schemas with many optional fields and deep nesting increase the token overhead of constrained decoding, and overly verbose field names or descriptions in the schema itself get counted against your context budget on every single call. The fix is the same discipline we cover in [cutting LLM token costs](/en/posts/cut-llm-token-costs): keep schemas as flat and field-names as short as the domain allows, and don't ask for fields you won't actually use — every unused optional field is pure token cost paid on every call, forever.

## Frequently Asked Questions

### Should I always use strict structured outputs over JSON mode?

Once you know your schema, yes — the failure-rate gap (roughly 2–5% vs under 0.1%) is too large to justify JSON mode outside of early prototyping where the schema itself is still changing week to week.

### Do I still need a validator like Zod or Pydantic if I use structured outputs?

Yes. Structured outputs guarantee shape, not correctness — a schema-compliant response can still contain a wrong or hallucinated value, so boundary validation stays mandatory regardless of which generation mode you use.

### When should I use tool-calling instead of a raw structured-output schema?

Use tool-calling whenever the model's structured response is also meant to trigger an action — calling an API, writing to a database, invoking another agent. Use a plain structured-output schema when you only need typed data back with no implied action.

### How many retries should a repair loop allow before giving up?

Two is a reasonable default in practice — most valid repairs happen on the first retry once the model sees the specific validation error, and a workload still failing after two attempts usually has a schema or prompt design problem worth fixing directly rather than retrying further.
