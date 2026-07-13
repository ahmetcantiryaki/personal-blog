---
title: "Building Voice Agents with gpt-realtime-2.1"
slug: "gpt-realtime-2-1-voice-agents-guide"
translationKey: "gpt-realtime-voice-agents"
locale: "en"
excerpt: "A practical guide to building production voice agents with gpt-realtime-2.1: transport choice, the reasoning-latency tradeoff, tool calling, and pricing."
category: "ai"
tags: ["ai-agents", "llm", "ai-infrastructure", "ai-tools"]
publishedAt: "2026-07-10"
seoTitle: "Building Production Voice Agents with gpt-realtime-2.1"
seoDescription: "Build a production voice agent with gpt-realtime-2.1: pick WebRTC, WebSocket, or SIP, tune reasoning effort against latency, and choose mini vs flagship."
---

Building a voice agent on gpt-realtime-2.1 comes down to three decisions made up front: transport (WebRTC, WebSocket, or SIP), model tier (flagship or mini), and reasoning effort. Together these set your latency, cost, and conversation quality — this guide walks through each with production-facing examples.

OpenAI shipped gpt-realtime-2.1 and gpt-realtime-2.1-mini for the Realtime API on July 6, 2026. The release solves two problems at once: caching improvements cut p95 latency by at least 25% versus the prior generation, and reasoning plus tool use, previously flagship-only, is now available on mini too. A voice agent with near-telephony latency, real multi-step reasoning, and mini-tier pricing is now a realistic default, not a compromise.

This guide draws on [OpenAI's model reference](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) and the [launch post](https://openai.com/index/introducing-gpt-realtime/); the numbers below are verifiable there.

## What does a full-duplex voice agent actually mean?

Full-duplex means the model can listen while it is still speaking, and stop itself when the user interrupts. Traditional voice pipelines process turns sequentially: speak, pause, process, respond. Realtime models like gpt-realtime-2.1 keep the audio stream open continuously, so a user saying "wait, that's not what I meant" mid-response makes the model cut off its own output and pick up the new input immediately — a prerequisite for anything meant to sound like a person on a call rather than a scripted IVR.

Worth separating out: on July 8, 2026, OpenAI also announced GPT-Live-1 and GPT-Live-1 mini, a full-duplex voice engine for the consumer ChatGPT app specifically. API access for that family hasn't been announced. The model developers can actually build agents on today, via the API, is gpt-realtime-2.1 — don't conflate the two.

## WebRTC vs. WebSocket vs. SIP: which transport should you pick?

gpt-realtime-2.1 supports three transports, and the right one depends almost entirely on where your agent lives.

| Transport | Best for | Advantage | Tradeoff |
|---|---|---|---|
| WebRTC | In-browser voice widgets, mobile apps | Lowest audio latency, built-in jitter/echo handling in-browser | Server-side integration is more involved |
| WebSocket | Server-side orchestration, agent-to-agent bridging | Full control, integrates cleanly with an existing backend | You own audio packetization and jitter handling |
| SIP | Phone-based agents, call centers | Plugs directly into existing PSTN/PBX infrastructure | Signaling layer (SIP trunk, DTMF) adds complexity |

As a rule: if a user clicks a microphone button in a web page, go with WebRTC — it offloads audio handling to the browser and keeps latency minimal. If your agent sits inside an existing backend and the audio needs to pass through your own infrastructure, WebSocket is more flexible. If the agent answers an actual phone number, SIP is the only sensible choice: point a SIP trunk at the Realtime API and let OpenAI handle signaling.

One agent often needs both a web widget and a phone line. Keep business logic (function calls, session state) decoupled from the transport layer so both entry points call into the same orchestration code — the same separation covered in our piece on [multi-agent orchestration patterns](/en/posts/multi-agent-orchestration-patterns).

## How do you tune reasoning effort against latency?

gpt-realtime-2.1 exposes a configurable reasoning effort parameter. Raising effort improves the model's ability to handle complex instructions, multi-step tool chains, and ambiguous requests, but every extra reasoning step adds token cost and time-to-first-response — dead air the caller has to sit through. A delay you'd never notice in text chat becomes obvious on a call.

The effective approach is tuning by task type rather than picking one global level: low effort for simple lookups and booking confirmations, high effort for multi-step flows such as interpreting a return policy or resolving conflicting instructions. This lives as a plain field in the session setup:

```json
{
  "type": "session.update",
  "session": {
    "model": "gpt-realtime-2.1",
    "voice": "alloy",
    "reasoning": { "effort": "medium" },
    "turn_detection": {
      "type": "server_vad",
      "interrupt_response": true
    },
    "tools": [
      {
        "type": "function",
        "name": "check_order_status",
        "description": "Looks up shipping status for a given order ID.",
        "parameters": {
          "type": "object",
          "properties": {
            "order_id": { "type": "string" }
          },
          "required": ["order_id"]
        }
      }
    ]
  }
}
```

The `interrupt_response: true` field lets the model cut off its own audio when the user starts talking, the foundation of barge-in behavior. Combine that with high reasoning effort and you get an edge case worth testing before launch: if a user interrupts mid-tool-call, the agent has to replan rather than silently drop the call — one of the most common production failures in voice agents.

## Mini vs. flagship: how do price and capability compare?

The decision usually comes down to price. Text-token pricing looks like this:

| Model | Input (1M tokens) | Output (1M tokens) | Reasoning + tool support |
|---|---|---|---|
| gpt-realtime-2 (prior flagship) | Baseline for comparison | Baseline for comparison | Flagship-only |
| gpt-realtime-2.1 (flagship) | $4.00 | $24.00 | Yes, configurable effort |
| gpt-realtime-2.1-mini | $0.60 | $2.40 | Now supported on mini |

The important row is mini's reasoning support, detailed on [OpenAI's gpt-realtime-2.1-mini page](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini). Previously, reasoning and tool use were flagship-exclusive; mini was limited to simple single-turn responses. gpt-realtime-2.1-mini being a distilled reasoning model means multi-step, tool-calling flows can now run at mini pricing, and flagship becomes reserved for genuinely high-stakes conversations — contract negotiation, sensitive triage-style flows — rather than a default.

Our default recommendation: start any new voice agent on mini, set effort to `medium`, measure which conversation classes fail in production, and route only that subset to flagship. Reaching for flagship by default is an unnecessary cost layer for most B2B support and booking flows.

## How does tool calling work over voice?

Function calling over voice follows the same contract as text-based LLM agents: define a schema, the model produces matching JSON arguments when a call is warranted, you execute the function and feed the result back. The difference is that this must happen without breaking the flow of conversation. A short filler response — "let me check that" — prevents dead air from reading as a dropped connection.

Schema design demands the same discipline: clear field names, explicit required fields, and permission for the model to return `null` in ambiguous cases rather than inventing a plausible value. We cover these principles for text-based agents in [getting structured JSON output from LLMs](/en/posts/llm-structured-outputs-json); the same rules apply for voice, just with less tolerance for error since feedback is immediate.

Before shipping, define hard limits on which tools an agent can call and under what conditions. Our [LLM guardrails production checklist](/en/posts/llm-guardrails-production-checklist) covers this; for voice, require a verbal confirmation step before the model can call any tool tied to payment or cancellation.

## Getting interruption handling (barge-in) right

Barge-in — the user cutting off the model mid-response to redirect the conversation — is non-negotiable for anything meant to sound like a real agent. Server-side voice activity detection (VAD) in `turn_detection` is more reliable than client-side detection since it isn't sensitive to network jitter. Too aggressive and background noise or a user's "mm-hmm" cuts the model off unnecessarily; too loose and real interruptions get detected late, leaving both sides talking over each other.

Find the right threshold by testing real user recordings and iterating, rather than guessing up front — ship with defaults and tune from feedback. If your agent runs a multi-step task, such as a form-filling flow collecting several pieces of information in sequence, you need a state machine tracking which step the conversation was on at the moment of interruption. We cover the general shape of that problem in [AI agents vs. workflows](/en/posts/ai-agents-vs-workflows).

## Common mistakes to avoid

The three failures we see most often: fixed reasoning effort for every conversation, shipping barge-in without testing real interruptions, and defaulting to flagship out of habit — a habit July 2026's mini reasoning support makes worth breaking.

My honest take: for most B2B use cases, voice interfaces get built because they sound impressive in a demo, not because they're the fastest path to the outcome. A form or chat interface gets the user to a correct result faster, with fewer failure modes, than a voice agent will in most of these workflows — the latency tuning and barge-in edge cases add real overhead for a UX gain that mostly doesn't exist outside hands-free or phone-only cases. Voice earns its complexity when that constraint is real; otherwise it's closer to a trend than a requirement.

## Frequently Asked Questions

### Is migrating from gpt-realtime-2 to gpt-realtime-2.1 difficult?

No, the API contract stays largely the same — swap the model name and configure the new reasoning effort field. The real work is tuning effort by task type and moving flows that now work on mini's tool-calling support off flagship, then measuring the cost savings. Developer discussion of the migration is active on [OpenAI's community forum](https://community.openai.com/t/new-realtime-models-on-the-api-gpt-realtime-2-1-and-gpt-realtime-2-1-mini/1385896).

### Can I connect gpt-realtime-2.1 to an existing call center PBX using SIP?

Yes, gpt-realtime-2.1 connects to an existing PBX or call center setup over a SIP trunk. Signaling — call initiation, DTMF, transfers — stays in the SIP layer, while audio streaming and model reasoning run through the Realtime API.

### Does higher reasoning effort always produce better results?

No. Higher effort improves accuracy on complex, multi-step tasks but adds unnecessary latency and token cost on simple queries. Adjusting effort dynamically by task complexity nearly always beats leaving it at one fixed level.

### Is gpt-realtime-2.1 the same thing as GPT-Live-1?

No. gpt-realtime-2.1 is a model developers can use today through the Realtime API. GPT-Live-1 is a separate full-duplex voice engine OpenAI announced on July 8, 2026, for the consumer ChatGPT app, and API access for it hasn't been announced.
