---
title: "Ship an AI Feature in Your Next.js App"
slug: "ship-ai-feature-nextjs"
translationKey: "nextjs-ai-features-ai-sdk"
locale: "en"
excerpt: "Short answer: pick an SDK, stream via a server action, validate output with Zod, and don't ship without a spend cap. Five concrete steps to production."
category: "web-development"
tags: ["nextjs", "react", "ai-tools", "typescript"]
publishedAt: "2026-08-17"
seoTitle: "Add an AI Feature to Next.js: End-to-End Guide"
seoDescription: "Short answer: pick an SDK, stream via a server action, validate output with Zod, and don't ship without a spend cap. Five concrete steps to production."
---

Short answer: adding an AI feature to a Next.js app comes down to five concrete decisions: pick an AI SDK, set up streaming through a server action or route handler, add schema validation for structured output, put a spend cap in place before costs run away, and write at least a basic eval set before you ship. Skip these five and your "weekend prototype" ships to production as a bill shock.

This piece walks through each decision in order, with concrete code.

## Which SDK and model should I pick?

Short answer: a provider-agnostic abstraction layer like the Vercel AI SDK if you want to stay portable across providers; a provider's own SDK if you want direct access to that provider's newest features (Claude's Managed Agents, for instance). The biggest architectural shift in AI SDK v6 is the move from API routes to React Server Actions: the `useChat` hook can now connect directly to a server action instead of an endpoint like `/api/chat`.

The SDK splits into two layers: AI SDK Core (`generateText`, `streamText`, `generateObject`), which runs on the server and handles model calls, and AI SDK UI (`useChat`, `useCompletion`, `useObject`), which runs on the client and manages stream state, message history, and UI updates. There's no fixed model recommendation — decide based on task complexity, and measure cost early.

## How do I wire up streaming through a server action?

Short answer: call `streamText` inside a server action and connect the result to `useChat` — you don't need a route handler. Here's a minimal end-to-end setup:

```typescript
// app/actions.ts
'use server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function chat(messages: { role: string; content: string }[]) {
  const result = streamText({
    model: anthropic('claude-sonnet-5'),
    messages,
  })
  return result.toUIMessageStreamResponse()
}
```

```tsx
// app/chat/page.tsx
'use client'
import { useChat } from '@ai-sdk/react'

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat()

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <button
        disabled={status === 'streaming'}
        onClick={() => sendMessage({ text: 'Hello' })}
      >
        Send
      </button>
    </div>
  )
}
```

`useChat` handles message state, input state, submission, streaming updates, and cancellation automatically on the client — you just write the UI. Rendering the token stream on the React side without layout jank is its own topic, which we covered in detail in our piece on [streaming AI UIs in React](/en/posts/streaming-ai-chat-uis-react).

## How do I make tool calls and structured output reliable?

Short answer: instead of hoping the model returns valid JSON, define a Zod schema and let the SDK constrain the output to match it. AI SDK 6 integrates Zod schema validation directly into the model call through the `generateObject` and `streamObject` functions:

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const { object } = await generateObject({
  model: anthropic('claude-sonnet-5'),
  schema: z.object({
    title: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    tags: z.array(z.string()),
  }),
  prompt: 'Classify this support ticket: "The checkout page is returning a 500 error."',
})
```

This eliminates hand-rolled JSON parsing and error-correction code for any scenario where you want to feed LLM output directly into a form or a database write.

## How do I keep costs from running away?

Short answer: set a hard spend cap per user and per organization — don't rely on rate limiting alone, since rate limiting bounds request frequency but not the cost of a single long-context request. In practice you need three layers:

| Layer | What it does | Where it's enforced |
|---|---|---|
| Rate limiting | Bounds request count per minute/hour | Middleware or edge function |
| Token budget | Caps max input/output tokens per request | The `maxOutputTokens` parameter |
| Per-user spend cap | Bounds total monthly cost per user/org | A counter in your application database |

Prompt caching is another cost lever that's easy to overlook: caching static system prompts can meaningfully cut input cost on repeated requests. If costs are already out of hand, our piece on [cutting LLM token costs](/en/posts/cut-llm-token-costs) has concrete tactics.

## What should I test before shipping?

Short answer: write at least a small eval set that verifies the model's responses land in the expected format and quality — this is what unit tests do for traditional code, applied to LLM output. A simple eval can be as basic as running 10-20 representative prompts and checking output against a rule set (length, tone, banned words, schema conformance); on more complex projects, this can extend to an LLM-as-judge setup. Our [guide to evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) covers this process in detail.

A fallback plan matters as much as the eval: what does the user see when the model API times out or hits a rate limit? A clear error message — "this feature is unavailable right now, please retry" — beats a loading spinner that silently hangs.

## What's new for this in 2026?

Here's my honest take: the most practical 2026 addition in this space is Vercel Workflows, which solves the biggest constraint on serverless AI agents — function timeout. Workflows breaks agent tasks into named steps that can suspend, wait for an external event, and resume exactly where they left off across multiple function calls without losing context. If you're building a long-running RAG pipeline or a multi-step agent, it's worth evaluating Workflows before you hit a single serverless function's timeout limit — if you're building infrastructure that heavy, our [guide to building a RAG system](/en/posts/how-to-build-rag-system) is a natural next read.

## Should prompts live in the repo or somewhere separate?

Short answer: keep system prompts in version control alongside your application code; keep user-specific or frequently changing prompts in a separate configuration layer. Pulling the system prompt out of the codebase into an editable admin panel looks flexible at first, but it creates two problems in practice: the prompt change no longer goes through code review, and it becomes hard to trace, after the fact, which prompt version produced which production behavior.

The middle ground is keeping system prompts as separate `.md` or `.txt` files inside the application repo, and running every change through a normal pull-request flow. That forces you to treat a prompt change with the same seriousness as a code change — because it usually deserves it: a prompt change can shift model behavior as much as, sometimes more than, a code change does.

## What should I check before launch?

1. Pick your SDK and model based on task complexity — don't default to the most expensive model.
2. Set up streaming through a server action or route handler, consumed client-side with `useChat`/`useObject`.
3. Use a Zod schema everywhere structured output is required, instead of hand-parsing JSON.
4. Set up rate limiting, a token budget, and a per-user spend cap as three separate layers.
5. Don't ship without at least a basic eval set and a clear error/fallback message.

## Frequently Asked Questions

### Should I use an API route or a server action to add an AI feature in Next.js?

A server action, especially with AI SDK 6 — `useChat` can now connect directly to a server action, so you don't need to set up a separate `/api/chat` endpoint. Route handlers are still a valid option, but a server action requires less code and fewer layers.

### How do I get reliable JSON output from an LLM?

Instead of hoping the model returns valid JSON, define a Zod schema and use the `generateObject` or `streamObject` functions; the SDK constrains the output to match the schema, so you don't need hand-rolled parsing or error-correction code.

### How do I keep an AI feature's costs under control?

Set up three layers: rate limiting to bound request frequency, a token budget to cap max tokens per request, and a per-user/org spend cap to bound total monthly cost. Relying on rate limiting alone doesn't bound the cost of a single long-context request.

### How should I test an AI feature before shipping it?

Write at least a small eval set that runs 10-20 representative prompts and checks the output against a rule set (length, tone, schema conformance). This does for LLM output what unit tests do for traditional code.
