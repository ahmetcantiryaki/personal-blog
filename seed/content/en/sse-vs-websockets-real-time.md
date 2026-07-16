---
title: "SSE vs WebSockets for Real-Time Apps"
slug: "sse-vs-websockets-real-time"
translationKey: "sse-vs-websockets"
locale: "en"
excerpt: "Do you need WebSockets? SSE handles most dashboards and live feeds over plain HTTP with auto-reconnect built in — here's when bidirectional actually matters."
category: "web-development"
tags: ["backend", "api-design", "performance", "llm"]
publishedAt: "2026-07-16"
seoTitle: "SSE vs WebSockets: Which Real-Time Transport to Pick"
seoDescription: "SSE vs WebSockets in 2026: SSE covers most dashboards and notification feeds over plain HTTP with auto-reconnect. See the decision table and a minimal endpoint."
---

Do you actually need WebSockets? For most real-time features — live dashboards, notification badges, streaming AI responses — the honest answer is no. Server-Sent Events (SSE) delivers server-to-client updates over plain HTTP, reconnects automatically when the connection drops, and needs none of the infrastructure a bidirectional socket demands. Reach for WebSockets only when the client genuinely needs to push data back mid-stream.

## What SSE actually is

SSE is a single long-lived HTTP response that stays open and streams `data:`-prefixed text events as they become available, defined in the [WHATWG/MDN Server-Sent Events spec](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events). Because it rides on regular HTTP, it works through the same proxies, load balancers, and CDNs your normal API traffic already passes through, and it multiplexes cleanly over HTTP/2 — multiple SSE streams don't each consume a separate TCP connection the way HTTP/1.1 sockets can. The browser's built-in `EventSource` object handles reconnection for you: if the network blips, it retries with the last event ID, no custom logic required.

WebSockets, by contrast, upgrade the HTTP connection into a persistent, full-duplex TCP-like channel where both sides can send binary or text frames at any time. That's strictly more capable — and strictly more you have to build yourself: reconnection, message ordering after a drop, and backpressure are all your problem, not the browser's.

## Why LLM token streaming almost always uses SSE

This is the pattern most developers now hit first: both [OpenAI's](/en/posts/gpt-5-6-general-availability-codex-desktop) and Anthropic's APIs stream chat completions as SSE, not WebSockets, and it's not an accident. Token generation is inherently one-directional — the server pushes tokens as the model produces them, the client doesn't need to push anything back mid-stream — which is exactly SSE's shape. Our [guide to cutting LLM token costs](/en/posts/cut-llm-token-costs) and [evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) both assume this streaming pattern as the baseline transport. If you're building a chat UI, you're very likely reimplementing what `EventSource` already gives you for free unless you have a specific reason not to.

A minimal SSE endpoint, with the return path handled by a normal HTTP POST rather than a second socket:

```javascript
// Server: stream events over plain HTTP
app.get('/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  const interval = setInterval(() => send({ tick: Date.now() }), 1000);

  req.on('close', () => clearInterval(interval));
});

// Client: no manual reconnect logic needed
const source = new EventSource('/stream');
source.onmessage = (event) => console.log(JSON.parse(event.data));

// Return path: a normal POST, not a second stream
async function sendCommand(payload) {
  await fetch('/command', { method: 'POST', body: JSON.stringify(payload) });
}
```

That pattern — SSE down, POST up — covers a surprising amount of what people reach for WebSockets to build, including chat interfaces where the "send" action is a discrete event, not a continuous stream.

## The firewall and proxy reality Ably's own data flags

SSE's "it's just HTTP" pitch has a real caveat worth knowing before you commit: [Ably's 2026 WebSockets-vs-SSE comparison](https://ably.com/blog/websockets-vs-sse) reports customers migrating from SSE to WebSockets after finding SSE connections that worked fine in development buffered unpredictably in production — some corporate proxies and restrictive networks buffer streaming HTTP responses rather than flushing them chunk by chunk, which defeats the whole point of low-latency delivery. That's a production-network problem, not a spec problem, but it means "SSE is simpler" doesn't automatically mean "SSE is more reliable" across every network your users sit behind. Test on your actual target networks, not just localhost.

## One config line that fixes most SSE buffering issues

Before reaching for WebSockets to work around the buffering problem above, check your reverse proxy config — it's usually the actual culprit, not SSE itself. Nginx buffers proxied responses by default, which silently breaks streaming:

```nginx
location /stream {
    proxy_pass http://backend;
    proxy_buffering off;       # disable response buffering
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
}
```

That one `proxy_buffering off` line resolves a large share of the "SSE works locally but lags in production" reports. It's worth checking before concluding you need the added complexity of a WebSocket.

## When bidirectional actually matters

WebSockets earn their complexity when the client and server both need to push data mid-session, independent of each other: multiplayer game state, collaborative editing (multiple cursors and concurrent operational transforms), and chat apps where typing indicators, presence, and read receipts all need to flow in both directions with minimal latency. If your feature list includes "the client sends something the server didn't ask for, faster than a request-response round trip allows," that's the tell you need a real socket.

| Need | SSE | WebSockets |
|---|---|---|
| Server → client updates only | Good fit | Overkill |
| Auto-reconnect | Built into `EventSource` | You implement it |
| Works through standard HTTP infra | Yes | Sometimes needs config |
| Binary data | No (text only) | Yes |
| Client → server mid-stream | No (use a separate request) | Yes, natively |
| Typical use case | Dashboards, notifications, LLM streaming | Chat, multiplayer, collaborative editing |

## The decision rule

My take, having shipped both more than once: reach for SSE by default and only escalate to WebSockets when you can name the specific bidirectional feature that needs it — "might need it later" isn't a reason, since adding a WebSocket layer to an SSE-based app later is a bounded, well-understood migration, not a rewrite. Roughly 90% of what teams build under the "real-time" label — dashboards, notification feeds, streaming AI output, live counters — never actually needs the client to push data back mid-stream, and every one of those features ships simpler, and closer to existing HTTP infrastructure, as SSE.

## Frequently Asked Questions

### Can SSE send data from client to server?

Not on the same connection. SSE is one-directional (server to client). If the client needs to send data, pair it with a normal HTTP request — a POST, as shown above — rather than trying to force it through the event stream.

### Does SSE work with HTTP/2?

Yes, and it works well — HTTP/2 multiplexes multiple SSE streams over a single TCP connection, avoiding the per-tab connection limits that can bite HTTP/1.1 `EventSource` usage in the same browser.

### Why do OpenAI and Anthropic use SSE instead of WebSockets for streaming?

Because token generation is one-directional: the server produces tokens and pushes them as they're ready, and the client doesn't need to send anything back until the next full request. SSE's auto-reconnect and plain-HTTP compatibility make it a better operational fit than a WebSocket for that shape of traffic.

### Is SSE reliable in production?

Mostly, but test on your actual target networks. Some corporate proxies and restrictive networks buffer streaming HTTP responses instead of flushing them immediately, which can make an SSE feed feel laggy or batched even though it works fine in local development.
