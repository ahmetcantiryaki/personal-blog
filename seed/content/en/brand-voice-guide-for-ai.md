---
title: "Build a Brand Voice Guide Your AI Will Follow"
slug: "brand-voice-guide-for-ai"
translationKey: "brand-voice-guide-for-ai"
locale: "en"
excerpt: "Turn your tone axes, do/don't word list, and example passages into one spec, then load it into a Project, Gem, or Skill so AI output sounds like your brand."
category: "digital-marketing"
tags: ["claude", "gemini", "ai-tools", "personal-branding", "prompt-engineering"]
publishedAt: "2026-08-21"
seoTitle: "Build a Brand Voice Guide Your AI Will Follow"
seoDescription: "Turn tone axes, a do/don't word list, and example passages into one written spec, then load it into a Project, Gem, or Skill so AI output sounds like you."
---

Short answer: to make AI copy sound like your brand, define your tone on a handful of tone axes, list words to use and avoid, collect three real example passages, turn all of it into one written spec, and load that spec into a Claude Project, Gemini Gem, Skill, or custom instructions field. As of August 2026, all three major providers offer some mechanism for keeping instructions like this persistent across sessions.

## Why does AI-written copy sound generic?

AI models default to generic phrasing because their training data reflects an average of millions of different writers, and without a brand-specific anchor the model settles on the safest, most average-sounding middle ground. Telling a model to "write like our brand" is about as useful as telling a writer to "write well" — neither instruction is measurable.

The second reason is that context does not carry over. In an ordinary chat window, every new conversation starts from zero; the tone preferences you taught the model last week do not follow you into today's session. The third reason is missing examples: when a model sees an adjective like "friendly but professional," it interprets that against its own average definition of friendly, not against your brand's actual writing.

## How do you capture your brand voice?

The most practical way to capture brand voice is to do three things at once: place your tone on four to six tone axes, list at least 15–20 "use / avoid" word pairs, and put your three strongest published examples (an email, a social post, a product description) side by side. A tone axis is a line between two extremes that shows where your brand sits — for example, on a "Formal <-> Casual" axis your brand might sit close to casual.

The table below shows four common tone axes and a concrete example for each:

| Tone Axis | Example Position | Example Sentence |
|---|---|---|
| Formal <-> Casual | Leans casual | "Hey! Let's get your invoice sorted right now." |
| Serious <-> Playful | Middle | "That bug was annoying. We fixed it." |
| Terse <-> Detailed | Terse | "Three steps: connect, pick, done." |
| Authoritative <-> Humble | Humble | "Try this, and tell us if it doesn't work for you." |

For the word list, single-line rules work best: "Use: customer, together, right away. Avoid: user, solution partner, in sync." For example passages, pick real, published copy — invented examples dilute the signal the model needs to learn from.

## How do you turn brand voice into a reusable spec?

Once you have your tone axes, word list, and example passages, you need to put them in one document and load it somewhere the model reads automatically in every chat — otherwise you end up retyping the same instructions every time. As of August 2026 there are four practical places to put that spec, and each ties to a different provider.

In Claude, [Project custom instructions](https://support.anthropic.com/en/articles/9519177-how-can-i-create-and-manage-projects) give you roughly 8,000 characters of instruction space plus a knowledge base that accepts up to 200K tokens of uploaded documents; a brand-voice document added to a Project carries into every new chat inside that Project automatically. Anthropic is also [moving Styles into Skills](https://support.anthropic.com/en/articles/10181068-configuring-and-using-styles); a Skill is best thought of as a reusable file bundle that defines how the model communicates and repeats a behavior across multiple Projects. On the Gemini side, a [Gem](https://support.google.com/gemini/answer/15235603) is a single-purpose assistant made of a name, instructions, and optional knowledge files; Google recommends keeping the instructions field to roughly 500–2,000 characters. In ChatGPT, [Project-level custom instructions](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt) override your global custom instructions and apply only to chats inside that Project.

| Tool | Where Instructions Live | Approximate Limit | Knowledge Files | Best Use for Brand Voice |
|---|---|---|---|---|
| Claude Project | Project custom instructions + knowledge base | ~8,000 characters + 200K-token documents | Yes | Multi-document brand kits managed by a team |
| Claude Skill | Reusable behavior definition | Unpublished, file-based | Yes (as files) | Tone rules reused across multiple Projects |
| Gemini Gem | Single-purpose assistant instructions | 500–2,000 characters recommended | Yes | Fast, single-owner brand-voice assistant |
| ChatGPT Project | Project instructions, override global settings | Unspecified, a few paragraphs in practice | Yes | Project-scoped tone without touching account-wide settings |

When you write the spec itself, use short, direct lines — a model follows a bulleted rule set more consistently than it follows a long paragraph. A skeleton like this works:

```text
BRAND VOICE SPEC
Tone axes: Formal<->Casual: Leans casual | Serious<->Playful: Middle
Use: customer, together, right away
Avoid: user, solution partner, in sync
Sentence length: Short, average 12-15 words
Example passage: "Hey! Let's get your invoice sorted right now."
Hard rules: No emoji, never more than one exclamation point per sentence
```

You can paste this skeleton directly into a Claude Project's knowledge base, a Gemini Gem's instructions field, or ChatGPT's Project instructions, as is. If SEO-focused copy is your main use case and you want a fuller repeatable system, see our [repeatable SEO writing system with Claude](/en/posts/repeatable-seo-writing-system-claude); that guide focuses on wiring brand voice into an SEO production workflow, while the spec described here is the foundational layer that comes before it.

## How do you test outputs against the guide?

The fastest way to check whether an output matches your brand is to read it aloud next to a real example passage and ask, "did we write this?" — if the answer is uncertain, the spec is missing a rule. Beyond that gut check, run a three-step test loop.

First, run the spec through five contexts: an error message, a sales email, a social reply, an FAQ answer, and a blog intro. Second, check each output against your do/don't word list for banned words that slipped through. Third, put two outputs side by side — one written with the spec, one without — and ask a teammate to pick which one sounds like the brand; this blind test shows whether the spec earns its keep. Our [guide to using Claude for social media](/en/posts/how-to-use-claude-for-social-media) covers platform formatting rules that complement the tone testing described here.

## How do you keep humans in the loop?

Even a strong brand-voice spec still needs a human to give final sign-off before publishing, because a model cannot weigh contextual risk — a competitor's name, sensitive timing, a joke that could land wrong — as well as a person who knows the context can. In practice this means the AI drafts, an editor checks the draft against the do/don't list, and that editor signs off on accuracy as well as tone.

My take: human review is more valuable as a feedback source for the spec than as a final gate. If an editor logs every sentence they correct, the spec turns into a living document shaped by real correction history within a few months.

## How do you update the guide as the brand evolves?

Treat the brand-voice spec as a living document and review it at least once a quarter; update it sooner whenever a new product launch, a repositioning, or a recurring editor correction shows up. Date every update (for example, "August 2026 update: added 'solution partner' to the avoid list") so you can trace which rule changed and when.

If you keep the spec inside a Claude Project's knowledge base or a Gemini Gem's instructions field, you only need to update it in one place — every new chat automatically picks up the current version, which beats copying and pasting by hand. Our [prompt engineering patterns for developers](/en/posts/prompt-engineering-patterns) covers techniques that make any spec, including this one, easier to turn into precise, testable rules.

## A Fill-in Brand Voice Template

```text
BRAND VOICE TEMPLATE
1. Tone axes (3-6, position between extremes):
   Formal <-> Casual: ____
   Serious <-> Playful: ____
   Terse <-> Detailed: ____
2. Use (10-15 words/phrases): ____
3. Avoid (10-15 words/phrases): ____
4. Example passages (3 real pieces, with source): ____
5. Sentence-length preference (e.g., average 12-15 words): ____
6. Hard rules (things never to do): ____
7. Last updated date and reason: ____
```

Once filled in, this template doubles as a shared reference for your content team and your AI tool inside a broader [Digital Marketing & SEO](/en/category/digital-marketing) workflow.

## Frequently Asked Questions

### How long should a brand voice guide be?

Short answer: one page is enough, and often ideal; a 300–600-word spec covering tone axes, a word list, and three example passages gives a model everything it needs to stay consistent, and it fits comfortably inside a character-limited Gem or custom-instructions field.

### Is a Claude Project or a Gemini Gem better for brand voice?

Short answer: if a team is managing many documents together, a Claude Project's 200K-token knowledge base gives you more room to work with; if you want a fast, single-owner assistant, a Gemini Gem's 500–2,000-character instructions field is enough and needs less upkeep.

### How long does it take to teach AI a brand voice?

Short answer: writing the first spec usually takes two to four hours (setting tone axes, building the word list, picking example passages); real calibration happens over the first two to three weeks of actual use and editor feedback.

### Is a brand voice guide the same as a style guide?

Short answer: no; a style guide usually covers punctuation, capitalization, and formatting rules, while a brand voice guide defines tone, word choice, and personality — the two complement each other but are not the same document.
