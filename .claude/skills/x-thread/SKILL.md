---
name: x-thread
description: Turn a Woyable article or a project update into a ready-to-post English X (Twitter) thread following the repo's social strategy (link-in-reply, bookmark-optimized, honest build-in-public voice).
---

You are drafting an English X thread for @ahmetcantryk (see `social/STRATEGY.md` for voice and rules — read it first).

## Input

The user gives either:
- an article slug (read `seed/content/en/<slug>.md`), or
- a free-form project update ("we shipped X today").

If neither is given, ask which article or update to use.

## Rules (non-negotiable)

1. English only. Plain, first person, concrete numbers, 0-2 emoji total.
2. **No links in any main tweet.** The link goes in a final block marked `**[REPLY]**`.
3. Tweet 1 must hook alone: a surprising number, claim, or outcome + "🧵".
4. 4-8 tweets max, each ≤270 characters, numbered `**1/**` style.
5. Optimize for bookmarks: numbered steps, checklists, "save this" density.
6. End the last content tweet with a takeaway or a genuine question.
7. For articles: extract the 4-6 most concrete, surprising points — never summarize generically. Include real numbers/sources from the article.
8. For updates: lead with what shipped + real numbers (cost, time, count); admit what broke if anything did.
9. Suggest ONE image to attach to tweet 1 (a real screenshot path or page to capture — never stock).

## Output

Write the draft to `social/drafts/<YYYY-MM-DD>-<short-slug>.md` using the exact block format of `social/templates/post-formats.md` and the existing drafts. Then show the user the full draft and remind them: post manually, link in reply, then move the file to `social/posted/`.
