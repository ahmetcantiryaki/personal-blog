---
title: "How Do You Trace an LLM Call With OpenTelemetry?"
slug: "tracing-llm-calls-opentelemetry"
translationKey: "opentelemetry-llm-tracing-2026"
locale: "en"
excerpt: "Short answer: wrap every LLM request in a span using the gen_ai.* convention, attach token counts. The standard is still 'Development' status as of mid-2026."
category: "devops-cloud"
tags: ["observability", "llm", "monitoring", "devops", "ai-infrastructure"]
publishedAt: "2026-10-06"
seoTitle: "Tracing LLM Calls With OpenTelemetry: A Guide"
seoDescription: "Tracing LLM calls with OpenTelemetry means using the gen_ai.* semantic convention, counting tokens, chaining multi-step traces, and redacting prompts."
---

Short answer: record every LLM request as a span using the `gen_ai.*` namespace — provider name, model name, input/output token counts — and chain an agent's multi-step run under one trace. OpenTelemetry's GenAI semantic conventions are still at "Development" status as of mid-2026: not yet stable, but already in wide production use.

## Why do LLM calls stay invisible in normal tracing?

Because a regular HTTP or database span captures little beyond duration and status code, but for an LLM call the actual source of cost and latency is prompt length, model choice, and how many tool calls it made along the way. Without that, you can't answer "why did this request take 8 seconds" — the duration is visible, but the cause isn't.

[OpenTelemetry's GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/) exist to fill exactly that gap: the `gen_ai` namespace defines standard attributes for the request, the response, token usage, and the model. One caveat worth knowing: the spec moved out of the main semantic-conventions repository in June 2026 into a dedicated `semantic-conventions-genai` repo, and went through three attribute renames within that same year. As of mid-2026, not a single `gen_ai.*` attribute is marked "Stable" — all of them sit at "Development," meaning they're safe to use in production but the naming can still shift.

## How do you create spans for prompts, completions, and tool calls?

Open a span for every LLM request and attach these core attributes:

| Attribute | What it holds | Status |
|---|---|---|
| gen_ai.provider.name | Provider name ("anthropic", "openai") | Development |
| gen_ai.request.model | The model requested | Development |
| gen_ai.response.model | The model that actually served the response | Development |
| gen_ai.operation.name | Operation type ("chat", "embeddings") | Development |
| gen_ai.usage.input_tokens | Input token count | Development (replaces the now-deprecated prompt_tokens) |
| gen_ai.usage.output_tokens | Output token count | Development (replaces the now-deprecated completion_tokens) |

If an agent makes multiple tool calls, open each one as a separate child span nested under the parent LLM span. That way, a single trace shows the entire flow — "model reasoned → called the search tool → got the result → reasoned again → responded" — in one place. Without that chaining, each step looks like an unrelated trace and the causal link between them is lost.

```python
from opentelemetry import trace

tracer = trace.get_tracer("llm-service")

with tracer.start_as_current_span("chat claude-sonnet-5-5") as span:
    span.set_attribute("gen_ai.provider.name", "anthropic")
    span.set_attribute("gen_ai.request.model", "claude-sonnet-5-5")
    response = client.messages.create(model="claude-sonnet-5-5", messages=messages)
    span.set_attribute("gen_ai.usage.input_tokens", response.usage.input_tokens)
    span.set_attribute("gen_ai.usage.output_tokens", response.usage.output_tokens)
```

## Do you have to instrument this by hand?

No, not in most cases. Libraries like OpenLLMetry and Traceloop automatically wrap common SDKs — OpenAI, Anthropic, LangChain — and populate the `gen_ai.*` attributes for you; all you do is initialize the library at application startup. Manual instrumentation is usually only needed when you have a custom internal LLM client, or when you want to capture an attribute the standard libraries don't — a custom routing decision, for example. For most teams, the practical path is starting with auto-instrumentation and filling in only the gaps by hand. These libraries can also export token usage as a metric (a histogram), not just a span attribute, so you can answer "what was average token spend over the last hour" straight from a metrics dashboard instead of opening individual traces one by one.

## How do you sample high-volume traces without losing errors?

Head-based sampling decides whether to keep or drop a trace at the start of the request — simple, but it risks dropping rare failures. Tail-based sampling decides after the trace completes, so you can prioritize keeping traces that contain errors, policy denials, or unusually high token spend. A practical setup is to always sample security-relevant outcomes (a content-policy denial, for example) and apply a cost-driven rate to everything else.

The cardinality and sampling logic we covered in [cutting your observability bill](/en/posts/cut-observability-bill-sampling-cardinality) applies directly here: LLM traces carry high-cardinality data like prompt content, so storage cost can balloon fast, which is exactly why the sampling rate needs to be planned up front rather than bolted on later.

## How do you scrub sensitive prompt content before it leaves your service?

Writing the raw prompt and response text into a span is tempting, but user input can contain a home address, a national ID number, or medical details. Two approaches are common: a span processor running inside your own application that masks patterns like emails, phone numbers, and credit card numbers before export, or routing traces through an OpenTelemetry collector you control and applying the masking rules there. The second approach guarantees sensitive data never crosses your network perimeter at all.

A safer middle ground is recording prompt metadata instead of the full text: a template ID, template version, the variable keys used, and a content hash for deduplication. Even for the debugging cases where you genuinely need the full prompt, gate it behind role-based access, a defined retention window, and an audit trail.

## Where do you export this to?

Standard OTLP (OpenTelemetry Protocol) exports work with Jaeger, Honeycomb, Datadog, or a self-hosted Grafana Tempo setup. The fact that GenAI attributes aren't "Stable" yet means some backends don't render them with dedicated GenAI visualizations — but the raw attributes are always present in the trace, visible under the generic attribute view even when your backend doesn't recognize them specially.

Here's the part worth saying plainly: the spec staying at "Development" status isn't a reason to skip it. Knowing the attribute names can still shift, point your own dashboard queries at a logical layer (a view or an alias) rather than directly at the attribute name, so the next rename doesn't force you to hand-edit every dashboard. Once you're capturing token usage at the trace level, turning it into per-team, per-feature cost is exactly what we covered in [making AI token spend visible by team](/en/posts/ai-finops-token-spend-visibility) — the two pieces fit together directly. For a broader LLM observability framework, see [LLM observability: tracing your AI calls](/en/posts/llm-observability-tracing), and for the fundamentals, [Observability 101](/en/posts/observability-logs-metrics-traces). For more observability pieces, see our [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### Is OpenTelemetry's GenAI standard stable?

No. As of mid-2026, every `gen_ai.*` attribute, span, and metric is at "Development" status; none are "Stable." The spec moved to a dedicated repository in June 2026 and went through three attribute renames that same year, but it's already widely used in production.

### Which attributes capture token counts?

`gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens` are the current names. The older `prompt_tokens` and `completion_tokens` names are deprecated but may still appear in some tools.

### How do I group an agent's multi-step run into one trace?

Open each tool call as a separate child span nested under the parent LLM span. That lets you see the full "model reasoned → called a tool → got the result → reasoned again" flow inside a single trace.

### How do I protect sensitive data in prompt content?

Mask patterns like emails, phone numbers, and credit card numbers with a span processor before export, or route traces through a collector you control and apply masking there. Where possible, record metadata — template ID, version, content hash — instead of the full prompt text.
