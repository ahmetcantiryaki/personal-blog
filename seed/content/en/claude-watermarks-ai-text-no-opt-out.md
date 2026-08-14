---
title: "Claude Now Watermarks Every Output, No Opt-Out"
slug: "claude-watermarks-ai-text-no-opt-out"
translationKey: "claude-invisible-text-watermark"
locale: "en"
excerpt: "Anthropic now embeds an invisible statistical watermark in all Claude text output worldwide, driven by EU AI Act rules, with no way to turn it off."
category: "ai"
tags: ["claude", "ai-regulation", "llm", "ai-tools"]
publishedAt: "2026-08-14"
seoTitle: "Claude Now Watermarks Every Output, No Opt-Out"
seoDescription: "Anthropic began invisibly watermarking all Claude text on August 11, 2026. There's no opt-out and no public detection tool yet, even for EU compliance."
---

Anthropic began embedding an invisible statistical watermark into every piece of text Claude generates, announced around August 11, 2026. The move is driven by the transparency rules in Article 50(2) of the EU AI Act, but the marking applies to every Claude output worldwide, not just to EU users, and there is no setting anywhere to turn it off.

This is a different story from our earlier piece on [EU AI Act enforcement going live](/en/posts/eu-ai-act-enforcement-live-2026), which covered the law broadly. Here we're looking at one specific product change from one company: how Claude's output watermark actually works, and what it does and doesn't prove.

## What the Watermark Actually Is (and Isn't)

Start with the misconception this announcement invites. The watermark is not a set of hidden Unicode characters slipped into the text, and it's not metadata attached to a file. It's a statistical watermark: as Claude samples the next token, that sampling is subtly biased according to a secret key. In any single sentence the bias is essentially invisible, but across a long-enough passage, the pattern of ordinary word choices adds up to a detectable statistical signature.

Conceptually, this is in the same family as Google DeepMind's SynthID-Text, published in Nature in 2024, which uses a more advanced technique called tournament sampling. Anthropic's mechanism isn't identical, but the underlying idea is shared: the text itself doesn't change, only the statistical distribution of which words get chosen.

## Where It Applies, and Since When

The watermark is live from day one for any Claude model launched on or after August 2, 2026. Anthropic says it's working to retrofit older models as well. Coverage isn't limited to the chat interface at claude.ai — it spans the Claude Platform API, Claude Code, Claude Cowork, Claude Tag, and Claude as accessed through AWS Bedrock, Google Cloud Vertex, and Microsoft Foundry.

| Surface | Watermark status |
| --- | --- |
| claude.ai | Active (models launched after August 2, 2026) |
| Claude Platform API | Active |
| Claude Code | Active |
| Claude Cowork | Active |
| Claude Tag | Active |
| Claude via AWS Bedrock, Google Cloud Vertex, Microsoft Foundry | Active |
| Older models predating August 2026 | Being retrofitted by Anthropic |
| File outputs (e.g., images) | Additionally signed with a C2PA provenance manifest where supported |

## There's No Off Switch

No API parameter, no account setting, no regional exception. As of mid-August 2026, there is no way on any surface, anywhere in the world, to request unmarked Claude output. Anthropic is treating the watermark as a default and mandatory part of the product, not a preference users can opt out of.

## What the Watermark Proves, and What It Doesn't

This is the part worth reading carefully. The watermark is designed to answer one question: was this text processed by Claude? It is not designed to answer whether Claude wrote the text from scratch versus lightly edited something a person already wrote. Those are meaningfully different claims, and the system can't reliably tell them apart.

| The watermark can show | The watermark cannot show |
| --- | --- |
| Text passed through a watermarked Claude model | The text was written entirely by AI from a blank page |
| An unmodified, copy-pasted output still carries a readable signal | The signal survives heavy paraphrasing or translation |
| A useful reference point for internal content policy | Code reformatting or minification leaves the signal intact |
| Reasonably reliable detection on raw, unedited text | Forensic-grade, court-admissible proof of authorship |

Because the signal is spread across ordinary word choice rather than baked into a fixed marker, it tends to survive an unmodified copy-paste. But real developer and editorial workflows — heavy paraphrasing, translation, reformatting or minifying code, running the text through another LLM pass — erode or destroy that statistical signal. In practice, the watermark is fragile, not a forensic guarantee.

## The Four Cents Problem: Compliance Theater or Real Safeguard?

As of this writing in mid-August 2026, Anthropic has not shipped a public detection API or web tool, even though the EU's Code of Practice requires signatories to support third-party detection. Anthropic has said it will share technical details on detection later.

What has surfaced instead is more revealing. A reported case, referred to as "Four Cents," showed the watermark could be stripped for roughly $0.04 per pass using a publicly available verification and detection mechanism. The problem is structural: the same tool that lets someone check whether text is watermarked can be abused as an evasion oracle, iteratively probing and stripping the mark cheaply.

Here's the one clear take worth stating plainly: shipping a mandatory, no-opt-out watermark without a public detection tool, while the verification mechanism that does exist can reportedly be turned into a cheap evasion loop, looks a lot more like a compliance checkbox than a working anti-abuse system, at least in this first iteration. The EU's transparency goal is reasonable on its face; the current implementation just doesn't deliver the assurance it's meant to.

## What This Means for Developers and Teams Using Claude Code

For teams pulling Claude output into production code, documentation, or content pipelines through Claude Code, Claude Cowork, or the API, the practical takeaway is simple: don't treat this watermark as a definitive answer to "who or what wrote this." It may help catch raw, unmodified output, but its reliability drops fast after code gets reformatted, refactored, or passed through a second model.

This echoes a theme we covered in [our piece on Claude Skill and plugin security scanning](/en/posts/claude-skill-plugin-security-scanning): trusting an automated assurance mechanism without understanding its limits creates false confidence. Similarly, as we discussed in [AI slop and open source security](/en/posts/ai-slop-open-source-security), verifying the provenance of production content is safer as a layered process than as a single automated signal.

A reasonable posture for teams today is to treat the watermark as one signal among several, not a standalone proof:

```text
Checklist for evaluating Claude output provenance:
- Is the text/code used unmodified, or has it gone through heavy editing?
- Does internal policy log "AI was used" independently of watermark detection?
- Is watermark detection treated as a supporting signal, not the sole decision point?
- Is the team tracking Anthropic's promised public detection tooling?
```

Teams following Claude's model lineage may also want the background from our coverage of [the Claude Opus 5 launch](/en/posts/claude-opus-5-launch) and [Claude Sonnet 5's permanent pricing](/en/posts/claude-sonnet-5-permanent-pricing), both useful for understanding exactly which model generation this watermarking policy covers. For more on AI regulation and product changes, see our [AI category](/en/category/ai).

## Frequently Asked Questions

### Does Claude's new watermark use hidden Unicode characters?

No. It's not hidden characters inserted into the text and it's not file metadata. It's a statistical watermark: the model's token sampling is subtly biased according to a secret key, and the resulting pattern of word choices becomes detectable across a long-enough passage.

### Is there any way to turn the watermark off?

No. There's no API parameter and no setting in claude.ai or Claude Code to disable it. As of mid-August 2026, no opt-out exists anywhere, in any region.

### Does the watermark prove a text was written entirely by AI?

No. It only shows that the text passed through a watermarked Claude model. It can't reliably distinguish AI-written-from-scratch text from human writing that Claude lightly edited, and heavy paraphrasing, translation, or reformatting can weaken or destroy the signal entirely.

### Does Anthropic offer a public tool to detect the watermark?

Not as of mid-August 2026. The EU's Code of Practice expects signatories to support third-party detection, but Anthropic hasn't published a detection API or web tool yet; the company has said technical details will follow later.
