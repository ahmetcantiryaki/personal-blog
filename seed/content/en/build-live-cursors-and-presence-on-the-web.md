---
title: "How Do You Build Live Cursors and Presence on the Web?"
slug: "build-live-cursors-and-presence-on-the-web"
translationKey: "realtime-presence-cursors-web-2026"
locale: "en"
excerpt: "Short answer: broadcast throttled cursor positions over WebSocket or a managed presence service, interpolate between updates, and store shared state in a CRDT."
category: "web-development"
tags: ["collaboration", "frontend", "performance", "web-standards"]
publishedAt: "2026-11-02"
seoTitle: "Build Live Cursors and Presence Without a Socket Fleet"
seoDescription: "WebSocket vs SSE vs WebTransport for presence, throttling cursor updates, CRDTs for shared state, and when to use a managed service instead of your own fleet."
---

Short answer: presence needs two separate data flows — ephemeral cursor positions sent over a low-latency transport (WebSocket in most cases) at a throttled rate, and durable shared state (who's selected what) synced through a CRDT. You don't need to run your own socket fleet; managed services like Liveblocks or PartyKit handle both for a monthly fee based on connected users.

## What exactly is "presence" made of?

Presence breaks down into three distinct pieces that are easy to conflate but behave very differently: who's online (a simple joined/left roster), live cursors (high-frequency, ephemeral position data nobody needs to keep), and shared selections or edits (lower-frequency but durable state that must survive a reconnect and resolve conflicts between two people editing the same thing). Building all three as one data stream is the most common design mistake — a roster update and a cursor move have completely different durability and frequency requirements.

| Presence piece | Update frequency | Needs to persist? | Typical transport |
|---|---|---|---|
| Online roster | Low (on join/leave) | No — rebuilt from active connections | WebSocket or SSE |
| Live cursors | High (10-60 updates/sec desired) | No — purely ephemeral | WebSocket (lowest latency) |
| Shared selections/edits | Medium, event-driven | Yes — must reconcile on reconnect | CRDT over WebSocket |

## WebSocket, SSE, or WebTransport — which transport?

Use WebSocket for anything bidirectional and latency-sensitive, which covers cursors and most presence data; it has universal browser support and is the safe default in 2026. SSE (Server-Sent Events) is one-directional (server to client only), so it works for a read-only "who's viewing this page" indicator but not for sending cursor positions back up — [the fuller SSE vs. WebSocket trade-off](/en/posts/sse-vs-websockets-real-time) applies the same way here as it does to any other real-time feature. WebTransport, built on HTTP/3, offers lower-latency unreliable datagrams — a genuine fit for cursor data, where losing one position update doesn't matter — but browser support is still Chromium-led going into November 2026, with Firefox and Safari behind; treat it as a progressive enhancement over a WebSocket fallback, not your only transport.

## How do you keep cursor updates from flooding the connection?

Throttle outgoing position updates to roughly 20-30 times per second at most, then interpolate on the receiving end so motion still looks smooth between the updates you actually sent. A raw `mousemove` listener fires far more often than that — sending every event is the single biggest cause of presence features that feel laggy for everyone except the person moving their own cursor.

```js
let lastSent = 0;
const THROTTLE_MS = 40; // ~25 updates/sec

function onMouseMove(e) {
  const now = performance.now();
  if (now - lastSent < THROTTLE_MS) return;
  lastSent = now;
  channel.send({ type: 'cursor', x: e.clientX, y: e.clientY, t: now });
}
```

On the receiving side, don't just snap each remote cursor to the latest coordinate — linearly interpolate from its last known position to the new one over the throttle interval, so a cursor arriving at 25 updates/sec still renders as continuous motion at 60fps instead of visibly teleporting.

## What happens when someone disconnects and reconnects?

Design for reconnection as the normal case, not an edge case — mobile users switch networks, laptops sleep, and tabs get backgrounded constantly. On disconnect, the roster should drop that user after a short grace period (2-5 seconds) rather than instantly, so a brief network blip doesn't flash someone's avatar on and off. On reconnect, cursors and roster state can simply be rebuilt from scratch since they're ephemeral, but shared edits and selections need to be reconciled against whatever changed while the connection was down — which is exactly the problem CRDTs solve.

## Why do you need a CRDT for shared state, specifically?

A CRDT (conflict-free replicated data type) merges two divergent copies of the same data back into one consistent result without a central server deciding who "wins," which matters because two users editing the same document while briefly disconnected from each other will produce conflicting local states that need to converge automatically on reconnect. Yjs is the most widely used CRDT library for this; it ships an "awareness" module specifically for presence (cursors, selections, online state) alongside its document-sync core, so you can use one library for both the ephemeral and durable halves of presence. Liveblocks offers managed CRDT infrastructure with a [Yjs-compatible sync adapter](https://electric.ax/docs/streams/integrations/yjs), so an app built on Yjs can move to a hosted backend without rewriting its sync logic.

## Should you run your own socket fleet or use a managed service?

Run your own only if you already operate WebSocket infrastructure at scale or have requirements a managed service can't meet (data residency, extreme cost sensitivity at very high connection counts). For most teams, a managed presence service is the cheaper and faster path to ship: it removes the operational cost of running sticky-session load balancers, handling reconnect storms, and scaling socket servers horizontally — all real engineering problems that have nothing to do with your product. The trade-off is a per-connected-user cost that scales with usage, which is a fine trade for most apps below the scale where self-hosting pays for itself in engineering time saved, not server cost saved. [A 2026 comparison of Liveblocks, PartyKit, and Hocuspocus](https://www.pkgpulse.com/guides/liveblocks-vs-partykit-vs-hocuspocus-realtime-2026) is a reasonable starting point for weighing the managed options against each other.

## What are the privacy and abuse risks?

Live cursors and presence expose real-time behavioral data — who's looking at what, right now — which is a bigger privacy surface than it looks. Always let users appear offline or anonymous where the product allows it, strip precise cursor data from any analytics pipeline it might otherwise leak into, and rate-limit presence connections per user the same way you'd rate-limit any other write path, since an unthrottled presence channel is also an easy vector for a single client to flood every other connected client with junk updates.

My take: most teams reach for a custom WebSocket server before checking whether a managed service already solves their actual problem, then spend weeks rebuilding reconnect handling, interpolation, and CRDT merge logic that Liveblocks or PartyKit ship on day one. Build custom only once you've confirmed the managed option's pricing or data-residency terms don't work for you — not because "we should own our infrastructure" sounds like the more serious engineering answer. If your presence feature sits inside a larger app serving AI-generated suggestions or content, the [state-handling patterns for AI features](/en/posts/ai-features-that-fail-silently-avoid-the-traps) apply directly to presence reconnect states too, and the transport trade-offs here mirror the same tool-design thinking in [designing APIs for AI agents](/en/posts/designing-apis-and-tools-for-ai-agents).

## Frequently Asked Questions

### What transport should I use for live cursors?

WebSocket in almost all 2026 cases — it's bidirectional, universally supported, and low-latency enough for cursor data. WebTransport can offer lower latency for the same use case, but browser support is still Chromium-led, so use it as a progressive enhancement rather than your only transport.

### How often should I send cursor position updates?

Throttle to roughly 20-30 updates per second on the sending side, then interpolate between received positions on the receiving side so motion still looks smooth. Sending every raw `mousemove` event floods the connection and makes the feature feel laggy for everyone else.

### Do I need a CRDT just for cursor positions?

No — cursor positions are ephemeral and can simply be rebuilt on reconnect. You need a CRDT for durable shared state, like selections or collaborative edits, that must merge correctly when two users were briefly out of sync.

### Should I build my own WebSocket presence server or use a managed service?

Use a managed service (Liveblocks, PartyKit, or similar) unless you already run socket infrastructure at scale or have requirements it can't meet. Most teams underestimate the engineering cost of reconnect handling, scaling, and CRDT merge logic that managed services already solve.
