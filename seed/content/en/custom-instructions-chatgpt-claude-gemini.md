---
title: "Custom Instructions in ChatGPT, Claude and Gemini"
slug: "custom-instructions-chatgpt-claude-gemini"
translationKey: "custom-instructions-big-three-ai"
locale: "en"
excerpt: "Most people never open the custom-instructions setting. Here is what it controls in ChatGPT, Claude, and Gemini, plus copy-paste templates you can use today."
category: "ai"
tags: ["chatgpt", "claude", "gemini", "prompt-engineering"]
publishedAt: "2026-07-26"
seoTitle: "Custom Instructions in ChatGPT, Claude and Gemini"
seoDescription: "Most people never open the custom-instructions setting. Here is what it controls in ChatGPT, Claude, and Gemini, plus copy-paste templates you can use today."
---

All three major AI assistants hide the same fix behind a setting most people never open: having to retype the same tone, format, and constraints in every new chat. Custom instructions solve exactly that, but most users don't even know the setting exists. Here's where it lives in each of the three assistants, what it actually controls versus what it doesn't, and three copy-paste templates to start with.

## What do custom instructions actually control?

Custom instructions don't create a persona — they set default behavior. Tone (formal or casual), format (bullet points versus paragraphs, whether code examples are included), assumptions (which programming language you use, your time zone), and constraints (never use a certain phrasing, always cite a source) are the kind of persistent preferences this setting stores. If you want to go further and build a full persona — "act like a real-estate advisor" — that's not a job for custom instructions; that's what Claude Projects, ChatGPT Projects, or Gemini Gems are for.

The distinction matters because most users overload custom instructions like a persona slot, and end up with a contradictory pile of rules that never quite fits any single task.

## Where does each one live?

In ChatGPT, custom instructions live under Settings > Personalization, split into two boxes: "What should ChatGPT know about you" (context about you) and "How should ChatGPT respond" (tone and format preferences). This applies automatically to every new chat.

In Claude, the equivalent lives under Settings > Profile as "Personal preferences," applied across all chats. If you use Claude Projects, each project also carries its own additional instruction layer — letting you stack specific rules for a particular project or client on top of your general preferences.

In Gemini, the equivalent is "Saved Info" under Settings > Personalization, where you add persistent rules like "always explain things simply" or "respond in both English and Turkish." Gemini goes one step further with Gems: when creating a Gem, you write your goal in a sentence or two and click the wand icon to have Gemini rewrite it into a structured instruction — significantly reducing the friction of writing a system prompt from scratch.

| Assistant | Setting name | Where it lives |
|---|---|---|
| ChatGPT | Custom Instructions | Settings > Personalization |
| Claude | Personal Preferences | Settings > Profile |
| Gemini | Saved Info (+ Gems) | Settings > Personalization |

## A copy-paste template

A simple structure that works across all three: role, constraints, output format.

```text
Role: You are a senior [domain] expert.
Constraints: Never [behavior to avoid]. Always [required behavior].
Output format: [bullet points / short paragraphs / code blocks], default to [language].
Context: [fixed context about you or your work — e.g. tech stack, target audience].
```

Fill this in once and paste it into all three: the general preference box in ChatGPT and Claude, and Saved Info or a Gem's instruction field in Gemini.

## Common mistakes

The most frequent mistake is overloading — stacking fifteen different rules confuses the model about which to prioritize. The second is contradiction: adding "keep responses short" alongside "always include a detailed explanation," two instructions that cancel each other out. The third is stale context: leaving a line like "my current project is X" unchanged for six months, so the model keeps working against context that's no longer relevant. Reviewing instructions every few months and pruning what's no longer true fixes most of this.

## Sharing instructions across a team

When multiple people on a team use the same assistants, everyone writing their own custom instructions from scratch leads to inconsistency — one teammate's response format ends up looking nothing like another's. There's a simple fix: write the template once in a shared team doc (a wiki page or a shared note) and have every member paste it verbatim into their own personal-preference box. This gets easier if you're using Projects in Claude or ChatGPT — project instructions are defined in one place, and everyone with access to the project inherits the same context automatically, removing the inconsistency risk of the personal preference box entirely. In Gemini, sharing a Gem within a team achieves similar standardization — as long as everyone uses the same Gem, instruction consistency holds.

## Persona or engagement?

The real decision point is this: custom instructions are for general preferences that bleed into every conversation; Claude/ChatGPT Projects or Gemini Gems provide a separate, isolated context layer for a specific engagement (a client, a campaign) or a specific persona (a code-review assistant, a copy editor). If you just want your general writing tone consistent everywhere, custom instructions are enough — but if you need different contexts for different clients or projects, a single general instruction box falls short, and you need the Project/Gem layer.

My take: the biggest missed opportunity is that most people never turn this setting on. A five-minute setup saves you from retyping the same context in hundreds of chats afterward. To go deeper on prompt-writing practice, see our [prompt engineering patterns](/en/posts/prompt-engineering-patterns) guide, and for an overview of ChatGPT's plan options, see [ChatGPT complete guide 2026](/en/posts/chatgpt-complete-guide-2026). If you want these instructions to carry over consistently into voice mode, our [AI voice assistants compared](/en/posts/ai-voice-assistants-compared-gpt-live-gemini-claude) post covers how each of the three handles voice differently.

## A fast way to test your instructions

After saving a set of instructions, the fastest way to check whether they're working is to ask the same question with the instructions on and off, then compare the two answers side by side. No difference usually means the instruction was written too generically; a clear difference that still doesn't match what you expected usually points to a contradiction or vague wording somewhere in the set. Repeating this quick test after every major change keeps your instructions from piling up into a contradictory mess over time.

## Three ready-to-use templates

**Developer assistant:** "Role: you are a senior backend developer. Constraints: always give code examples in TypeScript, skip unnecessary explanation. Output format: a short summary first, then a code block."

**Content editor:** "Role: you are a technical blog editor. Constraints: avoid passive voice, explain jargon. Output format: short paragraphs, bullet points where useful."

**Customer support drafter:** "Role: you are a customer support rep. Constraints: never give a firm delivery date, always open with an empathetic sentence. Output format: a short 3–4 sentence reply."

## Frequently Asked Questions

### What's the difference between custom instructions and a Project/Gem?

Custom instructions are general, persistent preferences applied to every conversation. A Project or Gem is an isolated, additional context layer for a specific task, client, or persona — layered on top of your general instructions.

### How does Gemini's instruction-rewrite feature work?

While creating a Gem, you write your goal briefly and click the wand icon; Gemini turns that short description into a more structured system instruction. This reduces the friction of writing from scratch, but reviewing and adjusting the output to your actual needs is still recommended.

### How many instructions is too many?

There's no fixed number, but more than five distinct rules usually causes the model to struggle with prioritization. A small number of clear, non-contradictory rules produces more consistent results than a long list.

### Do I need to update these settings regularly?

Yes, especially when your projects or role change. Reviewing every few months and clearing out context that's no longer true (an old project name, a changed tech preference) prevents the model from working off stale assumptions.
