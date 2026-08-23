---
title: "Anthropic Python SDK v1.0: What Actually Breaks?"
slug: "anthropic-python-sdk-v1-migration-guide"
translationKey: "anthropic-python-sdk-v1"
locale: "en"
excerpt: "Anthropic shipped Python SDK v1.0 on August 20, 2026: it drops httpx for a fork called httpx2, requires Python 3.10+, and removes the legacy Completions API."
category: "ai"
tags: ["claude", "python", "developer-experience", "api-design"]
publishedAt: "2026-08-23"
seoTitle: "Anthropic Python SDK v1.0 Migration Guide (Aug 2026)"
seoDescription: "Anthropic's Python SDK v1.0 (Aug 20, 2026) swaps httpx for httpx2, drops Python 3.9, and removes temperature/top_p from Messages. Here's what actually breaks."
---

Anthropic's Python SDK v1.0, released on August 20, 2026, breaks any code that imports `httpx` directly, runs on Python 3.9, calls the old `client.completions.create()` endpoint, or passes `temperature`, `top_p`, or `top_k` straight into `messages.create()`. If your integration does none of those four things, the upgrade is close to a no-op.

The release lands one day after the [browser use tool went GA](/en/posts/what-is-claude-browser-use-tool) alongside computer use, the Files API, and the Skills API — a busy week for anyone maintaining a Python integration against the Claude API, and a good reason to batch this SDK bump with a review of what else shipped.

## What Changed in Anthropic's Python SDK v1.0?

The headline change is the HTTP layer: the SDK moved from `httpx` to `httpx2`, an API-compatible fork maintained by the Pydantic team, according to Anthropic's [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview). Anything that imports `httpx` directly — a custom `Timeout`, a custom `http_client`, a proxy transport — needs to import `httpx2` instead.

```python
# Before (0.x)
import httpx
from anthropic import Anthropic, DefaultHttpxClient

client = Anthropic(
    timeout=httpx.Timeout(60.0, connect=5.0),
    http_client=DefaultHttpxClient(
        transport=httpx.HTTPTransport(local_address="0.0.0.0")
    ),
)

# After (1.0)
import httpx2 as httpx
from anthropic import Anthropic, DefaultHttpxClient

client = Anthropic(
    timeout=httpx.Timeout(60.0, connect=5.0),
    http_client=DefaultHttpxClient(
        transport=httpx.HTTPTransport(local_address="0.0.0.0")
    ),
)
```

If your test suite mocks or traces HTTP calls with OpenTelemetry, `respx`, `pytest-httpx`, or `vcrpy`, those libraries patch `httpx` — not `httpx2` — so mocks silently stop firing after the upgrade unless you call `httpx2.alias_httpx()` once at process startup, before anything else imports `httpx`.

## Does v1.0 Require a Newer Python Version?

Yes. Anthropic's Python SDK v1.0 requires Python 3.10 or later, up from the 3.9 floor in the 0.x line, per the [v1 migration guide](https://github.com/anthropics/anthropic-sdk-python/blob/main/MIGRATION.md) on GitHub. Any CI matrix or Docker base image still pinned to Python 3.9 needs to move to 3.10+ before the upgrade will install.

## What API Surface Got Removed?

Four pieces of long-deprecated surface are gone in v1.0, not just discouraged: the legacy Text Completions API, the `temperature`/`top_p`/`top_k` parameters on Messages methods, the dict form of `output_format`, and the tool runner's client-side `compaction_control`.

| Removed in v1.0 | Replacement |
| --- | --- |
| `client.completions.create()`, `HUMAN_PROMPT`, `AI_PROMPT` | `client.messages.create()` |
| `temperature` / `top_p` / `top_k` on `messages.create()` | `extra_body={"temperature": 0.2}` for legacy models |
| `output_format={"type": "json_schema", ...}` (dict) | `output_config={"format": {...}}`, or `messages.parse(output_format=YourModel)` |
| `tool_runner(compaction_control=...)` | Server-side `context_management` with the `compact-2026-01-12` beta |

The Text Completions removal affects almost no one still on a current integration — that endpoint has been superseded by Messages for years — but it's a hard break, not a deprecation warning, so a project vendoring an old script that still calls `client.completions.create()` will fail outright on v1.0.

The sampling-parameter removal is the one most likely to bite silently: `client.messages.create(..., temperature=0.2)` no longer raises a `TypeError` from a missing kwarg on current models — it's rejected as an unexpected argument by the typed client. Anything that needs `temperature` on a legacy model still can, through `extra_body={"temperature": 0.2}`, according to the migration guide.

## What Else Changed on the Async Client?

On the async client, `.with_raw_response` accessors are now coroutines: `response.parse()`, `response.text()`, and `response.read()` all need an `await` in front of them, and `response.text`/`response.content` on the sync client became callable methods instead of properties.

```python
# Before (0.x, async)
response = await client.messages.with_raw_response.create(...)
message = response.parse()

# After (1.0, async)
response = await client.messages.with_raw_response.create(...)
message = await response.parse()
```

`AnthropicBedrock` also stopped defaulting silently to `us-east-1`: as of v1.0, it raises a `ValueError` if no AWS region is configured, either via `aws_region=` or the `AWS_REGION`/`AWS_DEFAULT_REGION` environment variables. A service that relied on the implicit default now fails at client construction instead of quietly running requests against the wrong region.

## How Do You Test the Upgrade Safely Before Deploying It?

Run the upgrade in a branch with your existing test suite first, because the breaking changes in v1.0 tend to surface as import errors or `TypeError`s at call time, not as silent behavior changes — a green test suite after `pip install -U anthropic` is a strong signal the upgrade is safe. If your tests mock HTTP calls, that's exactly where `httpx2.alias_httpx()` earns its keep: without it, mocked responses stop intercepting requests and your tests either fail loudly (good) or, worse, start making real API calls in CI.

A staged rollout works well here: upgrade a low-traffic service or a staging environment first, watch error rates for the four break points for a day, then roll the change out to production services one at a time. Because the breaking changes are deterministic — the same call either works or throws every time, with no flaky in-between state — a clean staging run is a reliable predictor of a clean production run.

## Should You Upgrade Now?

Upgrade once you've grepped your codebase for the four break points above — direct `httpx` imports, Python 3.9 in your runtime, `completions.create()`, and bare `temperature`/`top_p`/`top_k` kwargs — because pip will happily let `anthropic>=1.0` install into an incompatible environment and fail at import or runtime, not at install time. Pin `anthropic<1.0` in your requirements file if you need more time; the 0.x line keeps working, it just won't receive new features going forward.

A five-minute audit before touching the version pin: run `grep -rn "import httpx\b" .`, `grep -rn "completions.create" .`, and `grep -rn "temperature=\|top_p=\|top_k=" .` across your codebase, and check your `python_requires` or CI matrix for 3.9. If all three greps come back empty and your runtime is 3.10+, `pip install -U anthropic` is safe to run directly.

If your Python integration builds a [RAG pipeline](/en/posts/how-to-build-rag-system) or calls the [Files API](/en/posts/claude-files-api-ga-explained) alongside Messages, audit those code paths specifically — file uploads and tool-runner calls are exactly where `compaction_control` and `output_format` dicts tend to hide. And if you're choosing which model to route v1.0-upgraded calls to, our [Claude model guide](/en/posts/which-claude-model-2026) covers the current lineup and pricing. See the [full AI category](/en/category/ai) for more Claude API coverage.

## Frequently Asked Questions

### What is httpx2 and why did Anthropic switch to it?

`httpx2` is an API-compatible fork of `httpx` maintained by the Pydantic team; Anthropic's Python SDK v1.0 uses it as its HTTP layer instead of `httpx` directly. Code that imports `httpx` for custom clients, timeouts, or transports needs to import `httpx2` instead, and tracing or mocking libraries that patch `httpx` need `httpx2.alias_httpx()` called at startup to keep working.

### Does Anthropic Python SDK v1.0 still support Python 3.9?

No. Anthropic's Python SDK v1.0, released August 20, 2026, requires Python 3.10 or later. Projects still running Python 3.9 need to upgrade their interpreter before installing `anthropic>=1.0`, or stay pinned to the 0.x line.

### Can I still send temperature to the Messages API in v1.0?

Not as a direct keyword argument on current models — `temperature`, `top_p`, and `top_k` were removed from `messages.create()`, `messages.stream()`, and `messages.parse()`. For legacy models that still accept these parameters, pass them through `extra_body={"temperature": 0.2}` instead.

### Will my old anthropic 0.x code break if I don't upgrade?

No. The 0.x SDK line keeps working after v1.0's release; pinning `anthropic<1.0` in your requirements file avoids every breaking change described here. You'll only stop receiving new SDK features, not lose access to the existing API.
