---
title: "Prompting 101: Get Better Answers From Any AI"
slug: "prompting-101-better-answers-any-ai"
translationKey: "prompting-101-better-answers-any-ai"
locale: "en"
excerpt: "Short answer: give role, context, task, and format in that order, add an example and a constraint, then refine the reply instead of restarting the chat."
category: "ai"
tags: ["prompt-engineering", "ai-tools", "productivity", "learning"]
publishedAt: "2026-11-08"
seoTitle: "Prompting 101: Get Better Answers From Any AI"
seoDescription: "Short answer: give role, context, task, and format in that order, add an example and a constraint, then refine the reply instead of restarting the chat."
---

Short answer: tell the AI what role to answer in, what context matters, exactly what task you want done, and what format the answer should take, then add an example and a constraint. Refine the reply instead of expecting perfection on the first try. This four-part pattern works the same way in Claude, ChatGPT, and Gemini, because none of them can read your mind — they only read what you type.

## Why do vague prompts fail?

Because the AI has no shared history with you; every question is treated like it came from a stranger with no context. Ask for "an email" and the model has to guess who it's for, what tone to use, and why you're writing it — so it defaults to the safest, most generic version it can produce. The more you leave unsaid, the more the model has to guess, and the more it guesses, the less likely the result matches what you actually needed. The fix isn't a clever trick; it's supplying the missing information yourself instead of leaving it to chance.

## How do you structure a good prompt?

Give four things in order: role, context, task, format. Role sets the perspective the model should answer from ("act like an experienced accountant"); context supplies the facts that should shape the answer ("I run a small e-commerce store with 3 employees"); task states exactly what you want ("draft a November cash-flow summary"); format sets the shape of the reply ("bullet points, no more than 5 items").

| Part | Question it answers | Example |
|---|---|---|
| Role | Who should the model act like? | "Respond as a senior product manager" |
| Context | What facts should shape the decision? | "Our team is 4 people, sprints are 2 weeks" |
| Task | What exactly is being asked? | "Rank this feature's priority and explain why" |
| Format | What should the answer look like? | "A table, at most 6 rows" |

Writing these four parts back to back in a single message usually replaces what would otherwise take five or six back-and-forth turns.

## Why do examples and constraints matter?

Because one concrete example carries less ambiguity than a thousand words of description. Pasting a real sample and saying "write like this" lets the model copy your tone, sentence length, and formality directly; saying "use a formal but warm tone" still leaves that open to interpretation. Constraints do the same job from the other direction: "stay under 150 words," "no technical jargon," "limit to three bullet points" narrow the space of possible outputs, which raises the odds that the first draft is already usable.

## How do you ask an AI to show its reasoning or a checklist?

By asking for it directly: add a line like "list the assumptions you're making before you answer" or "check your own draft against a 3-item checklist before giving the final version." This forces the model to surface its logic before committing to an output, so you can catch a wrong assumption before you ever use the answer. For anything involving a calculation, a comparison, or a decision, this one extra sentence is the difference between spotting a mistake and shipping it.

## Should you restart the chat or fix the reply?

Fix it, don't restart. Asking for a specific change in the same conversation — "make it shorter," "more formal," "add a number to every claim" — lets the model weigh its previous answer together with your feedback, which usually gets to a good result faster than writing a long prompt from scratch in a new chat. Starting over only makes sense when the topic has genuinely changed or the earlier context keeps dragging the answer in the wrong direction.

```text
Role: [whose perspective should answer this]
Context: [2-3 facts that should shape the decision]
Task: [exactly what you want done]
Format: [length, structure, tone]
Example (optional): [a short sample in the style you want]
Constraint: [what to avoid]
```

### Example 1: A work email

Before: "Write an email to my boss asking for more time."
After: "Role: write as a professional but warm employee. Context: the project is due Nov 15, and a supplier delay means I need one extra week. Task: draft an email explaining the delay and proposing a new date. Format: under 120 words, 3 short paragraphs." The second version works because the model no longer has to guess the delay, the new date, or the length.

### Example 2: Summarizing a long article

Before: "Summarize this article."
After: "Role: read like an editor. Context: this summary goes into a weekly newsletter for a non-technical audience. Task: pull out the main claim and the 3 most important data points. Format: an 80-word intro paragraph followed by 3 bullets." Because the target reader and the format are explicit, the model produces a summary at the right level instead of drowning it in technical detail.

### Example 3: A weekend plan

Before: "Make me a plan for the weekend."
After: "Role: suggest like a local travel advisor. Context: I'm in Istanbul, there are 2 of us, our budget is about $45 per person, and we like walkable areas. Task: build an hour-by-hour plan for Saturday and Sunday. Format: bullet points under day headers, one line per item." Because budget and preference are stated, the model loses the excuse to suggest something that blows the budget or doesn't match your style.

## Which AI has memory or a project feature?

All three do, under different names. Claude has Projects: you upload reference files and instructions to a project, and every chat inside it draws on that shared context. ChatGPT has Custom Instructions plus a separate Memory feature; as of November 2026, OpenAI's help center lists a 1,500-character limit on Custom Instructions for Free and Go plans, rising to 5,000 characters on Plus, Pro, Enterprise, Business, and Education plans. Gemini has Gems: custom assistants with saved instructions and reference files. Whichever you use, the logic is the same — write down the context you keep repeating once, save it, and stop retyping it every chat.

My honest take: people spend far more time hunting for a "magic prompt" than they spend refining a decent first draft. Writing the four parts — role, context, task, format — back to back and then fixing the result with two or three rounds of feedback takes less time than memorizing the "perfect prompt templates" that circulate online, and it gets you a more consistent result besides.

For a more technical take on the same four parts, see our [prompt engineering guide for developers](/en/posts/prompt-engineering-patterns); if you keep retyping the same instructions, our [guide to building a personal prompt library](/en/posts/personal-prompt-library-system) solves that. We've also compared Claude's, ChatGPT's, and Gemini's custom-instruction features [side by side](/en/posts/custom-instructions-chatgpt-claude-gemini), and our [AI subscription guide](/en/posts/which-ai-subscription-2026) helps if you're not sure which plan you need. Anthropic's official [prompt engineering documentation](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) and OpenAI's [Custom Instructions help page](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions) are both worth bookmarking for current limits. You can find more [AI](/en/category/ai) guides on our category page.

## Frequently Asked Questions

### How do you write a good prompt?

Short answer: state the role, context, task, and format clearly and in that order, and add an example if you can. Leave any of the four out and the model fills the gap with a guess; the more it has to guess, the less likely the answer fits, so every detail you skip is really a decision you're handing off to the model.

### How long should a prompt be?

Direct answer: as long as the needed information requires, no more and no less. A three- or four-sentence prompt that gives role, context, task, and format usually beats a one-word command by a wide margin, but padding it with irrelevant detail can dilute the model's focus, so check that every sentence actually shapes the decision.

### Which AI has memory or a project feature?

All three major assistants do: Claude has Projects, ChatGPT has Custom Instructions and Memory, and Gemini has Gems. They all serve the same purpose — save the context you keep repeating once instead of retyping it every chat — and differ mainly in naming and character limits.

### Should I start a new chat if the answer isn't useful?

Usually not. Asking for a specific fix in the same conversation — "make it shorter," "more formal" — lets the model weigh its earlier answer alongside your feedback, which typically reaches a good result faster than writing a long prompt from scratch in a brand-new chat.
