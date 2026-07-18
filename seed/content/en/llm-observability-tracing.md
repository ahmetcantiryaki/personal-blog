---
title: "LLM Observability: Tracing Your AI Calls"
slug: "llm-observability-tracing"
translationKey: "llm-observability-tracing"
locale: "en"
excerpt: "One log line per request cannot show you why a multi-step agent broke. Here is how gen_ai.* semantic conventions and Langfuse make agent chains debuggable."
category: "ai"
tags: ["observability", "llm", "monitoring", "evals"]
publishedAt: "2026-07-18"
seoTitle: "LLM Observability: Tracing Agent Calls with OTel"
seoDescription: "Learn how the OpenTelemetry gen_ai.* semantic conventions, OTLP, and Langfuse let you trace, cost, and evaluate multi-step LLM agents in production."
---

If the only visibility you have into an agent is one log line per request, you will lose entire afternoons to bugs a proper trace would show you in ten seconds. The fix is tagging every LLM call, tool call, and retry with `gen_ai.*` attributes under OpenTelemetry, then shipping the traces to a backend like Langfuse.

## Why a log line per request stops working

Debugging a plain REST endpoint is simple: request came in, got processed, response went out. An AI agent breaks that model entirely. A single user request can fan out into a planning call, three tool calls, a RAG lookup, a silent retry after a timeout, and a final synthesis call. Any one of those steps might have hit the wrong model version, retried quietly after a timeout, or gotten its context window truncated — and all the user sees is "the answer was wrong."

Request/response logging alone will not tell you which link in that chain failed. When your only window into the system is one line per request, you end up reconstructing the failure by hand from scattered logs, which is exactly the kind of afternoon a trace would have saved you. What you actually need when an agent misbehaves in production is a hierarchical trace that shows every step from the moment the request arrives to the moment the response leaves, including which model was called with which parameters and how many tokens it burned.

## gen_ai.* conventions: the field's shared vocabulary

This is where the OpenTelemetry GenAI Semantic Conventions come in. Developed by the OpenTelemetry GenAI Special Interest Group, they standardize attribute names and types for LLM calls, agent steps, vector database queries, token usage, cost tracking, and quality metrics. The point is that regardless of which provider you call — OpenAI, Anthropic, or a self-hosted model — you get the same attribute names back, so you instrument once and can point the output at any backend you like.

As of July 2026 most of the GenAI conventions are still marked experimental, but the portion covering client spans exited experimental status in early 2026 — a signal that the field has converged on this schema as its baseline even while some corners are still being finalized. In practice, the attributes worth knowing are these:

| Attribute | What it captures |
| --- | --- |
| `gen_ai.request.model` | The model used for the call (e.g., `claude-sonnet-5`) |
| `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens` | Input and output token counts |
| `gen_ai.response.finish_reasons` | Why generation stopped (`stop`, `tool_calls`, `length`) |
| `gen_ai.request.*` | Inputs and hyperparameters sent (temperature, max_tokens) |
| `gen_ai.response.*` | The final output and response payload |
| `gen_ai.operation.name` | The operation type (`chat`, `embeddings`, `execute_tool`) |
| `gen_ai.system` | The provider (`openai`, `anthropic`, `azure.ai.inference`) |

Once that table is second nature, you can build the same query logic in any OTel-compatible viewer: "which traces have `finish_reasons` equal to `length`," or "which model calls burned the most tokens today." [OpenTelemetry's GenAI observability post](https://opentelemetry.io/blog/2026/genai-observability/) and the [semantic-conventions-genai repository](https://github.com/open-telemetry/semantic-conventions-genai) track the current attribute list and span/metric schema; we also cover the transport basics in our [OpenTelemetry getting-started guide](/en/posts/getting-started-with-opentelemetry).

## Using Langfuse as an OTel backend

OpenTelemetry is deliberately transport-agnostic: once you instrument a trace, you can export it to any OTLP-compatible backend. Langfuse is one of the standout options here because it aims for compliance with the GenAI semantic conventions and behaves as a genuine OpenTelemetry backend, accepting OTLP traces at its `/api/public/otel` endpoint. It supports OTLP over HTTP in both JSON and protobuf; gRPC is not supported yet. Authentication runs over Basic Auth, so if you already run an OpenTelemetry Collector, adding Langfuse is just another exporter target.

Langfuse being open-source and self-hostable matters for teams with data-residency requirements. If you need to control which region your production traces — and the user prompts inside them — actually live in, running Langfuse on your own infrastructure while keeping the same `gen_ai.*` schema beats trusting a SaaS-only observability vendor with that data. The [Langfuse OpenTelemetry integration docs](https://langfuse.com/integrations/native/opentelemetry) and the [self-hosting observability guide](https://langfuse.com/self-hosting/configuration/observability) walk through the setup. That flexibility is the actual payoff of OTel: the same instrumentation code can point at Langfuse, Datadog, or Honeycomb without a rewrite, so you never get locked into one observability vendor.

## Building eval, cost, and latency dashboards on top of trace data

Trace data is not just for debugging — it is the raw material for the dashboards you build on top. Aggregate `gen_ai.usage.*` attributes and you get a cost dashboard broken down by model, user, or feature; we go deeper on this angle in [our guide to cutting LLM token costs](/en/posts/cut-llm-token-costs). Aggregate span durations and you get p50/p95 latency charts that show exactly which step — a RAG lookup, a tool call, or the final generation — is the actual bottleneck.

Evals are the more subtle piece: traces show you what happened, evals show you what was *correct*. Wire sampled production traces into an eval set with automated or human scoring, and when a regression lands you can see exactly which trace dropped — our [guide to evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) walks through building that loop. Agent reliability work is a natural extension of the same dashboards: our [LLM guardrails checklist for production](/en/posts/llm-guardrails-production-checklist) and [guide to reducing LLM hallucinations](/en/posts/reduce-llm-hallucinations) both lean on trace and eval data as their safety net — even subtle issues like context bloat are usually obvious within seconds once you can see the trace.

If you have not worked with the logs/metrics/traces triad before, start with our [Observability 101 primer](/en/posts/observability-logs-metrics-traces); the GenAI conventions build on top of that foundation rather than replacing it.

## A minimal instrumentation snippet

The example below shows how to tag an LLM call with `gen_ai.*` attributes using the OpenTelemetry Python SDK. You can export the resulting spans to a Collector or straight to Langfuse's OTLP endpoint.

```python
from opentelemetry import trace

tracer = trace.get_tracer("agent-service")

def call_llm(prompt: str, model: str = "claude-sonnet-5"):
    with tracer.start_as_current_span("chat") as span:
        span.set_attribute("gen_ai.operation.name", "chat")
        span.set_attribute("gen_ai.system", "anthropic")
        span.set_attribute("gen_ai.request.model", model)

        response = client.messages.create(model=model, messages=[{"role": "user", "content": prompt}])

        span.set_attribute("gen_ai.usage.input_tokens", response.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", response.usage.output_tokens)
        span.set_attribute("gen_ai.response.finish_reasons", [response.stop_reason])
        return response
```

Even this small a start is enough: once you add spans for tool calls and retries, the whole chain shows up as a tree in any OTel-compatible viewer.

## Frequently Asked Questions

### Do I have to set gen_ai.* attributes by hand?

Usually not. Off-the-shelf OTel instrumentation packages exist for popular SDKs like OpenAI, Anthropic, and LangChain, and they populate most of these attributes automatically. Manual `set_attribute` calls are typically only needed for custom business logic or your own tool calls.

### Can I use Datadog or Honeycomb instead of Langfuse?

Yes — that portability is the entire point of OTel. You can swap the export target without touching your `gen_ai.*` instrumentation. Langfuse stands out because it ships ready-made LLM-specific dashboards and eval workflows, and it can be self-hosted.

### Does tracing add a meaningful performance cost in production?

A properly configured OTel SDK with batch export and sampling typically adds negligible latency. The real risk is writing full content attributes (like `gen_ai.input.messages`) on every request; large prompts can bloat payload size fast, so most teams sample content capture rather than recording it on every call.

### Should I set up tracing just to get a cost dashboard?

No — the real value of tracing is debugging and evals. A cost dashboard is a byproduct of aggregating `gen_ai.usage.*` attributes. Instrumenting purely for cost means missing the actual reason to trace: seeing where in the chain something broke.
