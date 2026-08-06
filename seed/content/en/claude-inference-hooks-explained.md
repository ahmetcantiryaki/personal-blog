---
title: "Claude Inference Hooks: Build Your AI Security Server"
slug: "claude-inference-hooks-explained"
translationKey: "claude-inference-hooks-explained"
locale: "en"
excerpt: "Anthropic's new beta lets Claude Enterprise orgs route every prompt through their own server for an allow/deny verdict before inference runs."
category: "ai"
tags: ["claude", "web-security", "ai-infrastructure", "best-practices"]
publishedAt: "2026-08-06"
seoTitle: "Claude Inference Hooks: Build an AI Security Server"
seoDescription: "Anthropic's new beta lets Claude Enterprise orgs route every prompt through their own server for an allow/deny verdict before inference runs."
---

[Inference hooks](https://platform.claude.com/docs/en/manage-claude/inference-hooks) is a beta feature Anthropic shipped for Claude Enterprise on August 5, 2026. It lets an organization point Claude at an HTTPS endpoint it controls — an "AI security server" — that inspects every governed prompt and returns an allow or deny verdict before the model ever sees it.

That covers the mechanism, but the implications run bigger than a feature flag. For the first time, an enterprise customer can insert its own policy logic into Anthropic's inference path, synchronously, on every request from claude.ai, Claude Cowork, and Claude Code alike.

## How the request flow actually works

The sequence is deliberately simple:

1. A user submits a prompt on a governed surface — claude.ai, Cowork, or Claude Code (web, desktop, or CLI).
2. Anthropic sends a signed HTTPS POST to the org's configured server, carrying the conversation transcript.
3. The server evaluates the request and responds with a verdict within a configurable timeout — 5000ms by default, adjustable from 1–10,000ms.
4. On `allow`, inference proceeds normally. On `deny`, the user sees a blocked message combining the server's `deny_reason` (capped at 500 characters) with a standing admin-configured message, and the denial lands in the org's Activity Feed.
5. If the server is unreachable, errors, or times out, that's a "webhook failure" — explicitly not a deny. The org's failure-handling setting decides whether the request blocks or passes through uninspected.

Today there's exactly one hook event: `prompt`, fired once per governed inference request before inference begins. Response-side enforcement — inspecting what Claude generates, not just what the user sent — is on Anthropic's roadmap but isn't here yet.

### What the server can and can't see

The payload includes transcript text, tool calls and their results, and text extracted from attachments. It deliberately excludes raw file or image bytes, system prompts, and any Anthropic-internal context, including Claude's hidden reasoning. That matters for anyone building a DLP scanner here: a screenshot of a sensitive spreadsheet won't get flagged, since the server receives no pixels, only whatever text extraction produced. Voice mode isn't covered either, and ancillary requests like conversation-title generation never reach the hook.

## Verifying signatures the right way

Every request follows the [Standard Webhooks](https://www.standardwebhooks.com/) spec rather than a proprietary scheme. Three headers matter:

- `webhook-id` — a unique delivery ID equal to the body's `request_id`. Use it as your idempotency key.
- `webhook-timestamp` — Unix seconds. Reject anything more than five minutes off from your clock.
- `webhook-signature` — one or more space-separated `v1,<base64>` values, each an HMAC-SHA256 over `{webhook-id}.{webhook-timestamp}.{raw body bytes}`.

The signing secret carries a `whsec_` prefix; strip it and base64-decode the remainder using **standard** base64, not URL-safe. That single detail is the most common source of verification bugs, since plenty of libraries default to URL-safe decoding without anyone noticing until every signature silently fails. Also compute the HMAC over the raw request bytes before any JSON parsing touches the body — re-serializing a parsed object almost never reproduces the original byte sequence.

```python
import hashlib
import hmac
import base64

def verify_signature(secret: str, webhook_id: str, timestamp: str, raw_body: bytes, signature_header: str) -> bool:
    key = base64.b64decode(secret.removeprefix("whsec_"))
    signed_content = f"{webhook_id}.{timestamp}.{raw_body.decode()}".encode()
    expected = base64.b64encode(hmac.new(key, signed_content, hashlib.sha256).digest()).decode()

    for candidate in signature_header.split():
        version, _, sig = candidate.partition(",")
        if version == "v1" and hmac.compare_digest(sig, expected):
            return True
    return False
```

### The request body and the "10MB gotcha"

The [request body](https://platform.claude.com/docs/en/manage-claude/inference-hooks-endpoint) — Anthropic calls it the prompt frame — is JSON with `type` (always `"prompt"`), `request_id`, `tenant_id`, `actor` (user ID and email), `source.application` (e.g., `"claude-ai"` or `"claude-code"`), a `messages` transcript array (text, tool_use, tool_result, and attachment blocks), `session_id`, `model`, and a currently empty `metadata` object reserved for future use.

Bodies can reach 10MB, easy to forget when standing up the endpoint quickly. Nginx's default `client_max_body_size` is 1MB and Express's default `express.json()` limit is 100kB — both silently reject large transcripts with a 413 unless raised explicitly. Check this before your first production incident, not after.

The verdict response is intentionally minimal:

| Field | Type | Notes |
|---|---|---|
| `action` | `"allow"` or `"deny"` | Required on every response |
| `deny_reason` | string, max 500 chars | Required on deny; shown to the user alongside the admin message |
| `reference_id` | string, max 50 chars, `[A-Za-z0-9._:/-]` | Optional; logged in Activity Feed, never shown to the end user |

Any non-200 HTTP status is always treated as a webhook failure, never as an implicit deny — a distinction worth building tests around, since it's tempting to assume a 500 error is "safe" behavior when it's actually the opposite by default.

## Operational behavior worth planning around

Anthropic retries a failed connection exactly once, after a 100ms delay, but only on connection failure — a slow response that hits the timeout is not retried. Sustained failures trip a circuit breaker that disables enforcement org-wide until an admin manually re-enables it, a sane failsafe that also means a flaky security server can quietly stop protecting anyone.

Requests originate from Anthropic's published range, `160.79.106.0/24`. Allowlisting it is reasonable defense in depth, but it's not a substitute for signature verification — spoofing that range shouldn't let anyone forge a valid `webhook-signature` without your secret.

Rollout doesn't have to be all-or-nothing. [Admin-side configuration](https://platform.claude.com/docs/en/manage-claude/inference-hooks-configuration) supports shadow mode (observe only, never block), percentage-based ramping, or role-based exclusions, so nobody gets locked out on day one of a rollout that's still being tuned.

## Inference hooks vs. the Compliance API

These two solve adjacent but distinct problems, worth being precise about.

| | Inference Hooks | Compliance API |
|---|---|---|
| Timing | Before inference, inline | After the fact |
| Direction | Anthropic calls your server | You call Anthropic |
| Can block a prompt | Yes | No — retrieval only |
| Typical use | DLP, policy enforcement | Audit, chat/file retrieval |
| Latency cost | Adds up to your configured timeout per request | None (async, on your schedule) |

Stopping a regulated-data leak before it happens calls for Inference Hooks; reconstructing what happened after an incident calls for the Compliance API. The two are complementary, not competing.

## Where this fits and what it's good for

The documented use cases line up with what enterprise security teams have been asking vendors for: DLP scanning that denies prompts with regulated or classified content (the most common pattern so far), real-time transcript archival that always allows but copies data for retention, prompt telemetry pipelines, and policy engines enforcing model allowlists, project restrictions, or working-hours controls.

The limitations are real, though. This is allow/deny only — there's no rewrite or redaction path, so you can't strip a credit card number and let the rest through; the whole prompt gets blocked. Image-only content, like a screenshot of a document, isn't inspected at all, since raw bytes never leave Anthropic's infrastructure. And it's Claude Enterprise only: unavailable on Bedrock or Vertex, with API-only (Platform) customers out of scope. One configuration covers claude.ai, Cowork, and Claude Code uniformly, simplifying policy management for teams previously stitching together per-surface controls.

Here's the part worth debating: routing every prompt through an external server before the model can respond is a real latency and availability tax, and it makes your DLP endpoint a hard dependency for every governed Claude interaction in the company. A 5-second default timeout is generous, but chain that server through a classification vendor call or a database lookup, and you're gambling company-wide productivity against your on-call rotation. That's not a reason to skip inference hooks — DLP-before-inference genuinely beats DLP-after-the-fact — but treat the security server as tier-0 infrastructure, load-tested like the model API itself. It also signals where the industry is headed: expect similar inline governance hooks from other frontier labs, since enterprise buyers increasingly won't adopt an LLM they can't put a policy layer in front of.

This complements the layered approach in our [LLM guardrails production checklist](/en/posts/llm-guardrails-production-checklist) — inference hooks answer "should this prompt run at all," while application-level guardrails still matter downstream. If your server calls out via MCP for classification lookups, see our [MCP explainer](/en/posts/model-context-protocol-explained) and the [2026-07-28 spec update](/en/posts/mcp-2026-07-28-stateless-spec), since the same signing discipline applies there. And since `whsec_` is exactly the kind of credential that shouldn't live in a config file, see our [cloud secrets management](/en/posts/cloud-secrets-management-done-right) piece. Teams already running [Claude Opus 5](/en/posts/claude-opus-5-launch) in production are a natural first cohort to pilot this against.

## Frequently Asked Questions

### Does inference hooks work with the Claude API directly?

No. It's scoped to Claude Enterprise governed surfaces — claude.ai, Claude Cowork, and Claude Code. Platform (API-only) customers and deployments on Amazon Bedrock or Google Cloud Vertex are out of scope as of the August 2026 beta.

### What happens if my security server goes down?

Anthropic treats an unreachable, erroring, or timed-out server as a webhook failure, distinct from a deny. Your org's failure-handling configuration decides whether requests block by default or pass through uninspected — choose that setting deliberately, since the two options carry very different risk.

### Can the server redact part of a prompt instead of blocking it entirely?

Not currently. The verdict schema only supports `allow` or `deny`, with no partial-redaction or rewrite capability. A prompt with one sensitive line and nine benign ones gets fully blocked if your policy denies it.

### Why does verification keep failing even though my secret looks correct?

Most reported issues trace back to base64 decoding: the `whsec_`-prefixed secret must be decoded with standard base64, not URL-safe, and the HMAC must run over the raw, unparsed request body — not a re-serialized JSON object.
