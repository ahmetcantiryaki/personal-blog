---
title: "Claude's Files API Is Now GA: What Changed?"
slug: "claude-files-api-ga-explained"
translationKey: "claude-files-api-ga"
locale: "en"
excerpt: "Claude's Files API reached GA on August 19, 2026: the beta header is optional, expiration uses expires_in_seconds, and listing uses page/next_page pagination."
category: "ai"
tags: ["claude", "api-design", "ai-tools", "llm"]
publishedAt: "2026-08-20"
seoTitle: "Claude Files API GA: What Actually Changed?"
seoDescription: "Claude's Files API reached GA on August 19, 2026: the beta header is optional, expiration uses expires_in_seconds, and listing uses page/next_page pagination."
---

Anthropic moved the Claude Files API out of beta and into General Availability (GA) on August 19, 2026. You can now call the `/v1/files` endpoints and reference uploaded files in Messages API requests without sending the `anthropic-beta: files-api-2025-04-14` header, and existing code that still sends it keeps working unchanged.

## What was the Files API's status before GA?

The Files API shipped in beta in April 2025, letting developers upload PDFs, images, and text documents to Anthropic's servers once and reference them by `file_id` in later Messages API calls, instead of re-sending base64-encoded content on every request. That mattered most for RAG (retrieval-augmented generation) pipelines and the code-execution tool, where the same document often gets read across many turns and re-uploading it each time cost bandwidth and latency.

Every request to `/v1/files`, and every Messages API call referencing a file, had to carry the `anthropic-beta: files-api-2025-04-14` header — omit it and the request was rejected. The August 2026 GA announcement drops that requirement and makes the Files API a permanent, first-class part of the Claude Developer Platform.

## Will removing the beta header break my existing integration?

No. Anthropic built this transition to be backward compatible, so nothing breaks if you do nothing. Requests that still include `anthropic-beta: files-api-2025-04-14` keep returning the old beta response shape exactly as before; only requests sent without the header get the new GA format.

That makes this a soft migration you can schedule on your own timeline, not a breaking change forcing an emergency deploy. The practical recommendation is still to remove the header once you've tested against the GA format, so your codebase isn't juggling two response shapes indefinitely.

## What exactly changed in the GA response format?

The headline change is how file expiration gets set and reported. In the beta format, expiration worked through different fields; in GA you pass `expires_in_seconds` on upload, and the returned file object reports the exact `expires_at` timestamp.

Listing files also changed: pagination now uses `page` and `next_page` instead of the old beta pagination scheme, and a new `ids[]` filter lets you request specific file IDs directly. Here's the two formats side by side.

| Aspect | Beta format | GA format |
|---|---|---|
| Header requirement | `anthropic-beta: files-api-2025-04-14` required | Header optional |
| Setting expiration | Indirect, via different fields | `expires_in_seconds` on upload |
| Reporting expiration | Old field names | `expires_at` on the file object |
| List pagination | Previous beta pagination scheme | `page` and `next_page` |
| Filtering by ID | Not available | `ids[]` parameter |
| Storage limit | Unspecified | 1 TB per organization |
| Rate limit | Unspecified | 500 requests per minute |

`expires_in_seconds` is the change worth building around first — it gives you explicit, upload-time control over when a file disappears instead of relying on an implicit default.

## What are the storage and rate limits?

As of August 2026, the Files API enforces a 1 TB storage cap per organization and a rate limit of 500 requests per minute. The 1 TB limit covers every file your organization has uploaded and not yet expired or deleted — it's shared across every project and API key in that organization, not allocated per key.

The 500-requests-per-minute limit applies to the full set of `/v1/files` calls: uploads, list, retrieve, and delete. If a batch-heavy workload is bumping against that ceiling, caching `file_id` values and avoiding redundant re-uploads is the straightforward fix.

## How do I update my code to drop the beta header?

For most integrations this is a small, mechanical change: drop the `anthropic-beta` header, add `expires_in_seconds` to your upload call, and update any list-files call to read `page`/`next_page` instead of the old pagination fields.

```bash
# Upload a file (GA, no beta header)
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -F "file=@report.pdf" \
  -F "expires_in_seconds=86400"

# List files with GA pagination
curl "https://api.anthropic.com/v1/files?page=1&ids[]=file_abc123" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

Before shipping this, audit any code that parses expiration or pagination fields directly — the field names changed, so a stale parser can silently read the wrong value instead of throwing an error. If you're feeding files into a RAG pipeline, it's worth cross-checking your upload logic against our [how to build a RAG system](/en/posts/how-to-build-rag-system) guide while you're in there.

## What else went GA the same week?

On the same day, August 19, 2026, the Admin API's user-management endpoints for Claude Enterprise (claude.ai) organizations — members, invites, groups, and custom roles — also reached GA, dropping the requirement for the `anthropic-beta: ce-user-management-2026-07-13` header; requests that still send it keep working unchanged.

A day later, Claude Code 2.1.237 (August 20, 2026) fixed prompt caching for sessions running behind an LLM gateway or custom base URL, and added a built-in "Concise" output style under Output style in `/config` that skips preamble and narration. The prior release, 2.1.236 (August 19, 2026), introduced the `ANTHROPIC_DEFAULT_MODEL` environment variable for setting a new session's starting model, plus an opt-in `notify_when_idle` flag for cross-session SendMessage.

None of that is this article's focus, but if you use Claude Code's agent features day to day, our guides on [Claude Code subagents and background agents](/en/posts/claude-code-subagents-background-agents) and [how Claude Code auto mode works](/en/posts/claude-code-auto-mode-explained) cover them in depth. For the bigger picture of where the Files API sits in the Claude Developer Platform, see our [Model Context Protocol explainer](/en/posts/model-context-protocol-explained).

## Frequently Asked Questions

### Does going GA delete files I already uploaded?

No, the GA transition doesn't touch existing files; `expires_in_seconds` only changes how expiration is set on new uploads. If you don't pass an expiration value, or you keep sending the beta header, your prior expiration behavior stays exactly as it was. To confirm exactly when a file expires under the new format, check the `expires_at` field the API now returns on the file object.

### Is expires_in_seconds required on every upload?

No, it's optional — omit it and the file uploads with the default expiration behavior. But if you want explicit, code-level control over when a file becomes invalid, `expires_in_seconds` on the upload request is the only way to set that in the GA format. That's especially useful for short-lived files, like a one-off analysis report you only need for a day, where you want tighter control over what's counting against your storage limit.

### When will the beta header stop working, and is waiting to migrate risky?

Anthropic hasn't announced a shutoff date for the beta header, and as of August 2026 requests that still send it keep returning the old format. That backward-compatibility window is genuinely generous for teams that don't want to rush an untested change into production. Still, treating it as an indefinite grace period is a mistake — beta headers aren't usually kept around forever, and a deprecation notice could land with less runway than you'd like. Scheduling the migration this month and validating it in staging is safer than waiting for a forcing function.

### Where does the Files API fit besides RAG and code execution?

The Files API is useful anywhere you want to attach a PDF, image, or document to a Messages API request without re-uploading it every time; you upload once and reference the file by `file_id` across multiple conversations. Typical uses include document-heavy agent workloads, contract analysis, summarizing long multi-page reports, and supplying input files to the code-execution tool. If you're building a RAG system and need to fit file uploads into that architecture, our [how to build a RAG system](/en/posts/how-to-build-rag-system) guide walks through the integration points.
