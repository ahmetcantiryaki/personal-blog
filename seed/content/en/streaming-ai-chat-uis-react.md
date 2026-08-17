---
title: "Build Streaming AI Chat UIs in React"
slug: "streaming-ai-chat-uis-react"
translationKey: "streaming-ai-ui-react"
locale: "en"
excerpt: "Short answer: use SSE for LLM token streams, not WebSocket. Rendering tokens in React without jank comes down to getting optimistic UI and cancellation right."
category: "web-development"
tags: ["react", "nextjs", "ai-tools", "frontend"]
publishedAt: "2026-08-17"
seoTitle: "Streaming AI Chat UIs in React: A Practical Guide"
seoDescription: "Short answer: use SSE for LLM token streams, not WebSocket. Rendering tokens in React without jank comes down to getting optimistic UI and cancellation right."
---

Short answer: use Server-Sent Events (SSE) for LLM token streams, not WebSocket. The user sends one message, the server streams tokens back — that one-way pattern is exactly what SSE solves. OpenAI's, Anthropic's, and Google's APIs all stream over SSE, so matching that on the React side is the path of least friction.

The real difficulty isn't the protocol choice — it's rendering tokens without layout jank, in a way that's cancellable and resilient to errors. This piece covers how to get that part right.

## Should I use SSE or WebSocket?

Short answer: SSE when the user only listens, WebSocket when the user also sends frequently (multiplayer editing, real-time collaboration). LLM token streaming almost always falls into the first category: you send a message with one REST call, then get a one-way token stream from server to client.

Under HTTP/2, SSE connections are multiplexed over a single TCP connection, which removes the browser's concurrent-connection limit (capped at six under HTTP/1.1). If your server and CDN support HTTP/2 — most do in 2026 — SSE typically scales more cheaply than WebSocket at large fan-out: no protocol upgrade required, runs over standard HTTP, and passes through most proxies and CDNs without special configuration.

## How do I render partial tokens without layout jank?

Short answer: accumulate the message text in React state and append on each incoming chunk, but fix the container's height with CSS so it doesn't jump as tokens arrive. The most common mistake is re-measuring the entire message list on every token, which produces a UI that scrolls out from under the line the user is reading.

Practical rule: give the streaming message's container a `min-height`, and keep the message list in reversed flex order (`flex-direction: column-reverse`) to preserve scroll position as new content arrives. Stop auto-scrolling the moment the user scrolls up — nobody wants the screen suddenly jumping down while they're reading.

## What does a minimal React streaming component look like?

Here's a minimal, cancellable hook that consumes an SSE-like stream (`ReadableStream`) via `fetch`:

```tsx
function useStreamingChat() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'streaming' | 'error'>('idle')
  const controllerRef = useRef<AbortController | null>(null)

  async function send(prompt: string) {
    setText('')
    setStatus('streaming')
    controllerRef.current = new AbortController()

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      signal: controllerRef.current.signal,
    })
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setText((prev) => prev + decoder.decode(value, { stream: true }))
      }
      setStatus('idle')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setStatus('error')
    }
  }

  function stop() {
    controllerRef.current?.abort()
    setStatus('idle')
  }

  return { text, status, send, stop }
}
```

The critical detail here is `AbortController`: when the user hits "stop," it actually severs the server connection instead of just halting client-side rendering — that's what stops you from continuing to pay for tokens the UI no longer shows.

## How do I wire up optimistic UI, stop, and regenerate?

Short answer: append the user's message to the list immediately, without waiting for server confirmation (optimistic), show the assistant message as an empty bubble the instant streaming starts, and keep the "stop" button active only while `status === 'streaming'`. "Regenerate" is usually just deleting the last assistant message and resending the same prompt — but model it as a distinct action, not the same as "send," because error messages and retry counters should behave differently.

| State | What the user sees | What to do |
|---|---|---|
| `idle` | Empty input box | Send button active |
| `streaming` | Streaming text + stop button | Input disabled, stop active |
| `error` | Error message + retry button | Retain last prompt, resend with one click |

## How do I show tool-call and status states?

Short answer: when an agent calls a tool (file search, a web query), render it as a separate status indicator, not as plain text in the stream. Most production chat UIs show an intermediate state like "Searching the web…" in its own component, then hand off to the normal text stream once it completes. Mixing this into a single text string makes it hard for the user to tell "thinking" apart from "answer."

## How do I handle accessibility and backpressure?

Short answer: put `aria-live="polite"` on the streaming message container so screen readers announce updates at natural pauses, not on every token; don't use `aria-live="assertive"`, since it interrupts on every single token. On backpressure, if client render speed falls behind the server's token-generation rate — which happens on slower devices — queuing chunks and flushing them with `requestAnimationFrame` is the most reliable way to render without blocking the main thread.

Most of these patterns depend on the serving side — a server route or server action — being set up correctly; if you want to wire up the server side end-to-end in Next.js, our [guide to shipping an AI feature in Next.js](/en/posts/ship-ai-feature-nextjs) is the natural next read. On the React state side, when deciding whether streaming message state belongs in a global store or local state, our [React state management comparison](/en/posts/react-state-management-comparison) is worth a look — local state is enough for most chat UIs, and moving to a global store is rarely necessary.

## How do I persist chat history before the stream finishes?

Short answer: don't write to the database on every chunk — write a single "checkpoint" once the stream completes, or on a regular interval (say, every few seconds). Triggering a database write on every token creates both unnecessary load and a race-condition risk; if the user refreshes the page or the connection drops, being able to resume from the latest checkpoint is enough — you don't need every single token to be durably persisted.

To know where to resume a dropped stream, it helps to associate the stream with an ID (`streamId`) server-side and store the index of the last chunk sent. When the client reconnects, it can send that `streamId` back and resume from where it left off — this matters especially for agentic streams generating long responses, since a user who closes a tab and comes back doesn't want to start over.

## What mistakes come up most often?

- Re-rendering the entire message list on every token (memoize just the streaming message).
- Building a "stop" button without `AbortController` — that only halts rendering, not server-side generation.
- Mixing tool-call status into plain text.
- Using `aria-live="assertive"` and interrupting screen readers on every token.
- Continuing auto-scroll after the user has scrolled up.

## Frequently Asked Questions

### Should I use SSE or WebSocket for an LLM chat UI?

Use SSE. The user sends a message with one REST call and gets a one-way token stream back from the server — a different pattern from the bidirectional scenario WebSocket solves. OpenAI's, Anthropic's, and Google's APIs also stream over SSE.

### How do I prevent layout jank during token streaming?

Give the streaming message container a `min-height`, keep the message list in reversed flex order, and stop auto-scrolling once the user scrolls up. Update only the streaming message instead of re-measuring the entire list on every token.

### What exactly should a "stop" button stop?

Both client-side rendering and the server connection. Canceling the `fetch` request with `AbortController` also cuts off server-side generation; stopping only the state update leaves the server generating (and you paying for) unnecessary tokens.

### How should I show tool-call status, like "searching…"?

As a status component separate from the text stream. Mixing an intermediate state into plain text makes it hard for users to tell "thinking" apart from "answer" — most production UIs use a dedicated indicator for this.
