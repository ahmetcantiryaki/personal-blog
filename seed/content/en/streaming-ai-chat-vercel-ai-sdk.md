---
title: "Build a Streaming AI Chat UI With the Vercel AI SDK"
slug: "streaming-ai-chat-vercel-ai-sdk"
translationKey: "vercel-ai-sdk-streaming-chat-2026"
locale: "en"
excerpt: "Use the Vercel AI SDK's useChat hook and a Next.js route handler to stream tokens over SSE, cutting perceived latency versus waiting for a full AI response."
category: "web-development"
tags: ["nextjs", "react", "typescript", "ai-tools"]
publishedAt: "2026-10-05"
seoTitle: "Build a Streaming AI Chat UI With the Vercel AI SDK"
seoDescription: "Learn how to stream AI responses in Next.js using the Vercel AI SDK's useChat hook, route handlers, tool calling, and provider swapping in 2026."
---

Short answer: install the `ai` package, create a Next.js route handler that calls a model provider and returns a streaming response, then call the `useChat` hook in a client component to render tokens as they arrive over Server-Sent Events (SSE). That combination is the fastest path to a working streaming chat UI in 2026.

## What Is the Vercel AI SDK?

The Vercel AI SDK is an open-source TypeScript toolkit, published to npm as the [`ai` package](https://www.npmjs.com/package/ai), for building applications on top of language models. As of 2026 it draws more than 31 million weekly downloads, making it one of the most-used AI libraries in the JavaScript ecosystem. It bundles a server-side layer for calling models with a UI layer (AI SDK UI) that exposes framework hooks for React, Next.js, Vue, Svelte, and Nuxt, plus first-class support for tool calling. Full reference lives at the [AI SDK docs](https://sdk.vercel.ai).

## How Does Streaming Work in the AI SDK?

Streaming means the server sends the model's output token by token instead of waiting for the full answer and returning it in one response. The AI SDK streams those tokens to the browser over Server-Sent Events (SSE) — a protocol where the server pushes a sequence of text events over a single long-lived HTTP connection instead of the client polling for updates. The practical effect: a user sees the first words of a reply within a few hundred milliseconds instead of waiting several seconds for the full message to finish generating.

## How Do You Set Up the Route Handler for Streaming Chat?

A Next.js Route Handler is the server-side endpoint that talks to the model provider and streams the result back to the browser. Create `app/api/chat/route.ts`, call `streamText` with a provider and the incoming messages, and return `result.toDataStreamResponse()` so the response streams over SSE instead of buffering the whole reply in memory first.

```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4"),
    system: "You are a concise, helpful assistant.",
    messages,
  });

  return result.toDataStreamResponse();
}
```

This handler does not handle cancellation yet. Passing the request's `req.signal` into `streamText` is what lets the client abort a generation mid-stream, covered below.

## How Do You Wire useChat on the Client?

`useChat` is the AI SDK UI hook built specifically for chat interfaces: it keeps the message list in state, appends streamed tokens as they arrive, exposes an `isLoading` flag, and posts to your route handler automatically. Drop it into a client component and point it at the API route.

```tsx
"use client";

import { useChat } from "ai/react";

export default function ChatPanel() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({ api: "/api/chat" });

  return (
    <div>
      {messages.map((m) => (
        <p key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </p>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Send</button>
        {isLoading && <button type="button" onClick={stop}>Stop</button>}
      </form>
    </div>
  );
}
```

No manual `fetch` call, no manual SSE parsing, no manual state update per chunk — `useChat` handles all three, plus automatic retry when a request fails. That removal of hand-rolled client state is the main reason teams reach for the hook instead of wiring a `fetch` call and a `ReadableStream` reader by hand.

## useChat vs useCompletion vs useObject: Which Hook Do You Need?

Use `useChat` for anything with back-and-forth conversation, `useCompletion` for a single prompt that returns one block of text, and `useObject` when the model needs to stream back structured JSON validated against a schema instead of free text.

| Hook | Best for | What it manages |
|---|---|---|
| `useChat` | Multi-turn chat interfaces | Message history, streaming tokens, loading state, automatic retry on failure |
| `useCompletion` | Single-prompt, single-output text generation | One streamed completion string, loading state |
| `useObject` | Streaming structured JSON output | A typed object that fills in as the model streams, validated against a schema |

## How Do You Add Tool Calling to the Chat?

Tool calling lets the model invoke a function you define — like checking an order status or querying a database — in the middle of a conversation instead of only generating text. Define a tool with a schema and description, pass it into `streamText`, and the SDK handles detecting when the model wants to call it, running it, and feeding the result back into the conversation.

```typescript
import { streamText, tool } from "ai";
import { z } from "zod";

const result = streamText({
  model: anthropic("claude-sonnet-4"),
  messages,
  tools: {
    getOrderStatus: tool({
      description: "Look up the status of an order by ID",
      parameters: z.object({ orderId: z.string() }),
      execute: async ({ orderId }) => {
        return { status: "shipped", orderId };
      },
    }),
  },
});
```

On the client, `useChat` returns each tool invocation inside the relevant message, so you can render "Checking order status…" while the function runs and the final answer once it resolves. If you want the model to reach external systems over a standardized protocol instead of in-process functions, see our guide on [building your first MCP connector](/en/posts/build-your-first-mcp-connector).

## How Do You Swap Model Providers Without Rewriting the UI?

The AI SDK sits behind a single unified interface across more than 25 model providers, so moving from Anthropic to OpenAI or Google only means changing the `model` argument passed to `streamText` on the server (see the [AI SDK 5 announcement](https://vercel.com/blog/ai-sdk-5) for how that interface has evolved). The client component, the `useChat` call, and the rendered JSX stay exactly the same, because none of them talk to a provider's SDK directly — only to your own route handler.

```typescript
// one line changes on the server, nothing changes on the client
import { openai } from "@ai-sdk/openai";

const result = streamText({
  model: openai("gpt-4o"),
  messages,
});
```

That is the SDK's strongest selling point in daily use: a provider migration becomes a one-line server change instead of a UI rewrite, and I think that boundary is worth protecting even when a provider's native SDK looks tempting for a quick win. Teams that tie their chat component directly to a vendor's SDK lose that flexibility the moment pricing or rate limits force a switch. This provider-agnostic design is part of a broader shift toward [agent-first developer tools](/en/posts/agent-first-dev-tools) that treat the model as a swappable backend rather than a hardcoded dependency.

## How Do You Handle Errors and Cancellation?

`useChat` exposes an `error` object when a request fails and a `stop` function that aborts the in-flight stream, because a network drop and a provider returning a 500 are different failure modes that need different handling. Call `stop()` from a cancel button, and check `error` to show a retry prompt instead of a blank screen.

```tsx
const { error, reload } = useChat({ api: "/api/chat" });

if (error) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={() => reload()}>Retry</button>
    </div>
  );
}
```

On the server, pass the route handler's `req.signal` through to `streamText` so an aborted client request actually stops the model call instead of burning tokens on a response nobody will see. That cut-and-resume pattern is similar in spirit to how Next.js mixes static and streamed content in [Partial Prerendering](/en/posts/partial-prerendering-static-dynamic) — both hold part of a response back until it is ready instead of blocking the whole page or message.

If your chat needs to answer from your own documents instead of general knowledge, put a [RAG system](/en/posts/how-to-build-rag-system) behind the route handler; the `useChat` code on the client does not change at all. And if you are weighing which server runtime to deploy that route handler on, our [Bun vs. Node.js](/en/posts/bun-vs-nodejs-2026-runtime) comparison covers the tradeoffs that matter for a streaming workload.

## Frequently Asked Questions

### Is the Vercel AI SDK free to use?
Yes — the `ai` package is open source under the MIT license and free to use; the only cost is the underlying model provider's own API usage, not the SDK itself. There is no separate license fee for adding it to a Next.js project.

### Does the Vercel AI SDK only work with Next.js?
No — the AI SDK UI hooks ship bindings for React, Next.js, Vue, Svelte, and Nuxt, so the same streaming pattern works outside Next.js too. Next.js Route Handlers are simply the most common server-side pairing because both come from Vercel.

### Can I use the Vercel AI SDK with OpenAI instead of Anthropic?
Yes — the SDK supports more than 25 providers behind one interface, so swapping `anthropic(...)` for `openai(...)` or a Google model inside the `streamText` call is enough; no client-side code needs to change at all.

### Why use SSE instead of WebSockets for AI streaming?
SSE is simpler for this use case because data only flows one direction — server to client — over plain HTTP, with reconnection handled automatically by the browser, while WebSockets add bidirectional complexity that a one-way chat reply never actually needs.
