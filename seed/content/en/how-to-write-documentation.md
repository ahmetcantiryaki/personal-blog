---
title: "How to Write Documentation Developers Love"
slug: "how-to-write-documentation"
translationKey: "write-documentation"
locale: "en"
category: "career-productivity"
tags: ["documentation", "technical-writing", "communication"]
publishedAt: "2026-07-07"
excerpt: "Write documentation developers actually use: task-first pages, runnable examples, a review loop that stops rot, and structure that both humans and AI agents can parse in 2026."
seoTitle: "How to Write Technical Documentation Developers Love"
seoDescription: "How to write documentation developers use: task-first structure, runnable code, a CI review loop, and pages that AI agents can retrieve cleanly in 2026."
---

The fastest way to write documentation developers love is to organize each page around the task the reader is trying to finish, not around your code's structure. Start with the outcome, give a copy-paste example that runs on the first try, and state the prerequisites up front. Docs that get read answer one question fast; docs that rot try to explain everything at once. We learned this the slow way, shipping wikis nobody opened.

## What makes technical documentation good?

Good technical documentation is discoverable, task-oriented, and verifiable. Discoverable means the reader lands on the right page in one search. Task-oriented means each page maps to a goal ("authenticate a request"), not to an internal module. Verifiable means every command and code block actually runs, because a single broken example poisons trust in the whole set.

The classic failure is writing docs as a mirror of the codebase. You end up with a page per class and zero pages per user goal. Readers don't think in your class names; they think "how do I upload a file?" Match that intent and the page nearly writes itself.

There's also a maintenance test. If a doc can't be updated in the same pull request that changes the code, it will drift. The best documentation lives next to the code, gets reviewed like code, and breaks the build when an example stops working.

## How to write technical documentation in 8 steps

Here's the process we use for every new page, refined across three engineering teams and hundreds of merged doc PRs. Do them in order; skipping step 1 is why most docs fail.

1. **Name the reader and the task.** Write one sentence: "A backend developer who wants to X." If you can't name it, you don't have a page yet, you have a note.
2. **Lead with the outcome.** The first paragraph states what the reader will be able to do and roughly how long it takes. No history, no architecture tour.
3. **List prerequisites explicitly.** Versions, accounts, environment variables, permissions. Assume nothing; a missing prerequisite is the top reason a tutorial stalls.
4. **Show a minimal runnable example.** The shortest complete snippet that works. Not a fragment with `...` in the middle that nobody can execute.
5. **Explain the non-obvious, skip the obvious.** Annotate the two lines that trip people up. Don't narrate the imports.
6. **Cover the error paths.** Show the common failure, the exact error message, and the fix. This is the part readers screenshot and share.
7. **Link sideways and up.** Point to the reference for parameters, the sibling how-to for the next step, and the concept page for the "why."
8. **Test it as a stranger.** Copy every command into a clean shell. If anything needs a step you didn't write, the doc is broken.

## What are the four types of documentation?

There are four distinct types, and mixing them on one page is the most common documentation mistake. This framework comes from [Diátaxis](https://diataxis.fr/), created by Daniele Procida in 2020 and now the default mental model for docs teams, used by the Python community and Canonical. Each type serves a different reader in a different mood.

| Type | Reader's goal | Written as | Example |
|------|---------------|-----------|---------|
| Tutorial | Learn by doing | Guided, step-by-step lesson | "Build your first API client" |
| How-to guide | Solve a specific task | Numbered recipe | "How to rotate an API key" |
| Reference | Look up exact detail | Dry, complete, structured | Endpoint and parameter tables |
| Explanation | Understand the why | Discursive, conceptual | "How our rate limiting works" |

The rule is one type per page. A tutorial that keeps pausing to explain architecture loses the beginner; a reference that tells a story wastes the expert's time. When a page feels like it's fighting itself, it's usually two types crammed together, so split it.

## How do you write a good code example?

A good code example is complete, minimal, and copy-paste runnable. Complete means it includes the imports and setup a reader needs. Minimal means nothing decorative is in the way. Runnable means you executed it yourself, at the version the docs claim, before publishing.

Here's the shape we aim for, including the expected output so readers can confirm success:

```bash
# Prerequisites: Node 22+, an API key in $WOYABLE_KEY
curl -s https://api.example.com/v1/status \
  -H "Authorization: Bearer $WOYABLE_KEY"

# Expected output:
# {"status":"ok","region":"eu-central-1"}
```

Three things separate examples that help from examples that frustrate:

- **Show the expected output.** Readers need to know what success looks like, not just what to type.
- **Use real placeholder names.** `$WOYABLE_KEY` beats `<YOUR_KEY_HERE>` because it survives copy-paste without breaking the shell.
- **Pin the version.** "Works on v3.2" ages honestly; "latest" is a lie the moment you publish it.

## Your docs now have a second reader: AI agents

Here's the shift we didn't see coming. Your documentation is no longer read only by humans scrolling top to bottom. In 2026, coding assistants and agents consume it constantly, retrieving fragments and slotting them into a context window. Cursor, Windsurf, Claude Code, and GitHub Copilot all reach for a site's docs before they answer. That is exactly why Diátaxis got a second life: a page that does one thing well retrieves cleanly, while a 4,000-word page that mixes a tutorial, a reference, and an opinion piece retrieves as noise.

The concrete artifact here is [llms.txt](https://llmstxt.org/), a Markdown index at `/llms.txt` that points agents at your highest-value pages. Proposed by Jeremy Howard in September 2024, it hit roughly 10% adoption across a SE Ranking scan of 300,000 domains by July 2026, with near-universal uptake at developer-facing companies like Anthropic, Cursor, and Vercel. It is still a community convention, not a ratified standard, so treat it as a cheap hedge. Our opinionated take: if your product has an API, ship an `llms.txt` this quarter. The cost is an afternoon; the payoff is that every agent your users run cites you correctly instead of hallucinating your parameters.

## How do you keep documentation from going stale?

You keep docs current by treating them as code: version them in the same repository, review them in the same pull request, and test the examples in continuous integration. Documentation that lives in a separate wiki drifts within weeks, because nobody updates two places at once under deadline pressure. If you already run [unit tests that actually help](/en/posts/how-to-write-unit-tests), extend the same discipline to your snippets.

Practical guardrails that hold up in production:

- **Docs-as-code:** Markdown in the repo, human review, merged with the feature that changed the behavior.
- **Executable examples:** Run your code blocks in CI with a tool that extracts and executes them, so a broken snippet fails the build.
- **A freshness stamp:** Show when a page was last verified. Both Google and AI answer engines favor pages that signal recency.
- **An owner per page:** Orphaned docs rot. Put a name or team in the front matter so there's someone to ping.

The tooling matters less than the workflow, but here's the current landscape as of July 2026:

| Tool | Role | Latest (Jul 2026) | Notes |
|------|------|-------------------|-------|
| [Docusaurus](https://docusaurus.io/blog/releases/3.10) | Static docs site | 3.10.1 | Last v3 line; React 19, DocSearch 4.x with AskAI |
| Material for MkDocs | Static docs site | 9.7.6 | Feature-frozen (maintenance mode since 9.7) |
| Starlight | Astro-based docs | rolling | Fast builds, good for content-heavy sites |
| [Vale](https://vale.sh/) | Prose linter | rolling | Enforces style rules in CI |

Fancy tooling won't save docs that live outside the review loop. Pick one generator, wire Vale into CI, and keep every example executable.

## Frequently Asked Questions

### How long should technical documentation be?

As long as the task needs and no longer. A how-to for one task might be 200 words; a getting-started tutorial might be 1,500. Length isn't the target, completeness is. If a reader can finish the task without leaving the page or guessing a step, the page is the right length. Cut anything that doesn't move them toward the outcome. For growing the skill itself, [junior to senior developer](/en/posts/junior-to-senior-developer) treats writing as a leverage multiplier.

### Should developers or technical writers write the docs?

Both, at different stages. Developers write the first draft because they know what actually breaks and which errors are common; a technical writer then edits for structure, consistency, and clarity. In 2026 most high-performing teams use this hybrid: the engineer owns correctness, the writer owns readability. The worst outcome is docs written by someone who never ran the code. If drafting is your bottleneck, [developer productivity with AI tools](/en/posts/developer-productivity-ai-tools) covers getting a first pass out faster.

### What tools should I use to write technical documentation?

Keep it boring and close to the code: Markdown or MDX in the repository, a static site generator like Docusaurus, Material for MkDocs, or Starlight to publish, and a linter such as Vale to enforce style. The specific tool matters less than the workflow, and applying [clean code principles](/en/posts/clean-code-principles-checklist) to prose (small pages, one responsibility, no duplication) pays off more than any generator.

### How do I write docs that AI agents can use?

Keep each page single-purpose, use descriptive headings, and put runnable examples in fenced code blocks. Agents retrieve fragments, so a self-contained section beats a sprawling page. Ship an `/llms.txt` index pointing to your best pages, and if you expose an API, consider the [Model Context Protocol](/en/posts/model-context-protocol-explained) so agents can call your tools directly instead of guessing from prose.
