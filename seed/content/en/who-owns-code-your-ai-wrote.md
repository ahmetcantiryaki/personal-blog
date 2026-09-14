---
title: "Who Owns the Code Your AI Wrote? A Founder Guide"
slug: "who-owns-code-your-ai-wrote"
translationKey: "ai-code-ownership-licensing-startups-2026"
locale: "en"
excerpt: "Short answer: purely AI-generated output isn't copyrightable; only the human-created parts are. A provider saying 'you own the output' doesn't settle that."
category: "business"
tags: ["ai-regulation", "open-source", "compliance", "best-practices"]
publishedAt: "2026-09-14"
seoTitle: "Who Owns AI-Generated Code? A Founder's Legal Guide 2026"
seoDescription: "Is AI-written code copyrightable, what do provider terms actually say, how real is license contamination, and what do acquirers check before buying?"
---

Short answer: per the US Copyright Office, purely AI-generated output isn't copyrightable — protection is limited to the parts where a human made a creative contribution. Claude, ChatGPT, or Gemini's terms saying "you own the output" doesn't answer that copyright question; the two are separate.

Most founders reason: "AI wrote the code, the contract says I own the output, so the code is mine." That assumption is shakier in 2026 than most founders assume — copyright law, license contamination risk, and M&A due diligence all ask different questions than the one your provider's terms answer.

## Can AI output be copyrighted at all?

No, purely AI-generated output can't be — US law requires human authorship for copyright protection. *Thaler v. Perlmutter* and the US Copyright Office's 2025 guidance made this explicit: a block of code an AI produced end-to-end, with no human intervention, can lack copyright protection entirely. By contrast, in an "AI-assisted" codebase where a developer made architectural decisions, edited the output, and shaped the whole, the human-contributed parts remain protected.

In practice, as of early 2026 roughly half of enterprise codebases contain AI-assisted elements, which turns "who owns which part" from an abstract legal debate into a routine risk-management question.

## What do provider terms actually say?

Google states that for Gemini output, the user or customer owns it and Google asserts no ownership over new intellectual property in generated output; OpenAI similarly states you retain ownership of your inputs and outputs. Anthropic, OpenAI, Google, and Microsoft all converge on the position that business or API-tier data isn't used to train models by default, while the consumer chat tier may require an explicit opt-out.

| Provider | Output ownership | Used for training (default) |
|---|---|---|
| Anthropic (Claude) | User's | Business/API: no; consumer (Free/Pro/Max): yes, opt-out available |
| OpenAI (ChatGPT) | User's | Opt-out available, varies by tier |
| Google (Gemini) | User's/customer's | Free: yes (opt-out available); API/Workspace: no |

This table answers "who holds contractual ownership," not "is this output copyright-protected." Even if a provider assigns the output to you, if that output isn't legally protected, a third party can copy and reuse it, and you may have no copyright claim to sue on.

## Is license contamination a real risk?

Yes, and it became concrete in the class-action suit against GitHub Copilot: filed in 2022, it alleged unlicensed training on public code repositories and that the model reproduced licensed code closely enough to infringe copyright. The case hasn't fully resolved as of 2026, but the settlements and policy changes it produced along the way show the risk isn't theoretical.

The practical risk: an AI tool can suggest a GPL or other copyleft-licensed block of code it saw during training, reproduced nearly verbatim. If you add it to your product without noticing, your entire product can end up exposed to that license's terms — such as a source-disclosure requirement.

## What do acquirers and investors check in diligence?

In an M&A deal or funding round, legal teams now ask how much of your codebase is AI-generated, which tools were used, and whether you've run a license scan. "We don't know" is a red flag that can drag down a valuation; investors who already assess [vendor lock-in risk](/en/posts/ai-vendor-lock-in-startups) apply the same scrutiny to AI code provenance.

| Diligence question | Why it's asked |
|---|---|
| What percentage of the codebase is AI-assisted? | To gauge copyright and license risk |
| Which AI tools were used, at what tier? | To gauge training/data-leak exposure |
| Is there an SBOM and license scan? | To catch copyleft contamination early |
| Is AI contribution documented? | To strengthen your own copyright claim |

## What policy actually works in practice?

Three steps cover most early-stage companies: route every significant AI-generated code block through human review and note it in the commit message or PR, run regular license scans with an SBOM (software bill of materials) tool, and, if you have contributor agreements, state your AI-use policy in them explicitly. None of these alone eliminates copyright ambiguity, but together they let you say "we know this risk and we manage it" when diligence asks.

```text
Example commit message:
feat: add payment retry logic

AI-assisted draft (Claude Code), merged after human review
and edits. License scan: clean.
```

The "trust, but verify" discipline we cover in [AI code review](/en/posts/ai-code-review-trust-but-verify) applies here too — and a tool like [Claude Code's plugin eval command](/en/posts/how-to-use-claude-code-plugin-eval) extends the same documentation habit past code itself, letting you test and record a plugin's actual behavior instead of just trusting it.

My contrarian take: founders who see "the output is yours" in a contract and relax are answering the wrong question. The real question is "is this output copyright-protected, and does it contain someone else's licensed code" — and that answer lives in your scanning and review process, not in the provider's terms.

## Is open-source contribution any different?

Yes, sending AI-generated code to open-source projects adds another layer: similar to the [AI slop problem breaking open-source security](/en/posts/ai-slop-open-source-security), many projects now ask in their PR templates whether a contribution was AI-generated. If a maintainer accepts a contribution with unclear copyright ownership, the project's own license integrity can be put at risk — which is why large projects are updating their contributor license agreements (CLAs) to explicitly cover AI use.

## Frequently Asked Questions

### Can I sell code my AI wrote?

If there's human contribution to it — editing, architectural decisions, debugging — yes, that contribution is copyright-protected and sellable. But the purely AI-generated portions of the code can remain an unprotected zone a third party could also use, which is why knowing exactly how each part was produced matters before a major sale.

### Does a provider saying "the output is yours" resolve the copyright question?

No. That statement is a contractual assignment — the provider is saying it won't assert a claim against you. Whether the output is legally copyright-protected at all is a separate question, and in the US that hinges on the human-authorship requirement; a provider's terms can't change that requirement.

### How does copyleft-licensed code like GPL actually "leak" from AI?

A model can reproduce a licensed code block it saw during training nearly verbatim. If you use it without noticing, that snippet can carry its license's terms — such as a source-disclosure requirement — into your product. Regular SBOM/license scanning is the most practical way to catch this early.

### Does a small startup really need SBOM scanning?

It isn't mandatory at an early stage, but it's cheap insurance: an SBOM scan built with open-source tools substantially cuts the risk of a surprise license issue surfacing during a funding round or acquisition. Deferring it with "we'll handle it once we're bigger" is exactly what leaves you unable to answer diligence's first questions.
