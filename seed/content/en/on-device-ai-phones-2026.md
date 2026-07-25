---
title: "On-Device AI: What Actually Runs Locally in 2026"
slug: "on-device-ai-phones-2026"
translationKey: "on-device-ai-phones-2026"
locale: "en"
excerpt: "Apple Intelligence, Gemini Nano, and Galaxy AI claim on-device processing. Here is what genuinely runs locally on your phone in July 2026, and what does not."
category: "technology"
tags: ["gemini", "ai-infrastructure", "machine-learning", "performance", "ai-tools"]
publishedAt: "2026-07-25"
seoTitle: "On-Device AI in 2026: What Runs Locally on Your Phone"
seoDescription: "Apple Intelligence, Gemini Nano, and Galaxy AI all claim on-device processing. Here's what genuinely runs locally on your phone in July 2026, and what doesn't."
---

What actually runs locally on your phone's AI today is narrower than the marketing suggests: small, quantized language models handling summarization, smart replies, grammar fixes, and basic classification directly on the chip's neural processing unit, while anything resembling real reasoning still gets routed to a server. Every flagship vendor now brands this as "on-device AI," but the split between what stays on your phone and what quietly leaves it is the actual story.

## What "on-device AI" actually means

On-device AI means a language model small enough to fit in a phone's memory footprint, running inference on the neural processing unit (NPU) instead of shipping your prompt to a data center. These are not shrunk-down versions of GPT-5 or Gemini 3 Pro — they're purpose-built small models, often in the 1–4 billion parameter range, quantized to run in a few hundred megabytes of RAM. They're fast and private, but they trade off raw capability: a model that fits on a phone cannot hold the same world knowledge or reasoning depth as one running on a rack of accelerators, and no chip improvement changes that math in the short term.

The practical result is a two-tier system: small tasks resolve in milliseconds without a network call, and anything that needs deep reasoning, long context, or up-to-date information still leaves the device.

## The three implementations that matter right now

Apple, Google, and Samsung have each shipped a production on-device system, and they differ in scope more than in architecture.

**Gemini Nano** runs inside Android's AICore system service, and Google is explicit that it operates without a network connection for its supported tasks. Per Google's own developer documentation, ML Kit's GenAI APIs — built on Gemini Nano — cover text summarization, spelling and grammar correction, rewriting, smart replies, and basic text classification, all running locally on devices with Google Tensor, Qualcomm Snapdragon, or MediaTek Dimensity chips through AICore ([developer.android.com/ai/gemini-nano](https://developer.android.com/ai/gemini-nano)). On Pixel phones this also powers features like Call Notes and Scam Detection entirely on-device.

**Apple Intelligence** takes a router-first approach. A small on-device model evaluates every request and decides whether it can be completed locally; if it can, no data leaves the phone. When a request needs more capability, Apple Intelligence escalates to Private Cloud Compute (PCC), which runs on Apple silicon servers, processes only the data relevant to that request, and — per Apple's own security documentation — deletes it immediately after generating a response, with no retention in any form ([security.apple.com/blog/private-cloud-compute](https://security.apple.com/blog/private-cloud-compute/)). At WWDC in June 2026, Apple confirmed it is expanding PCC beyond its own data centers, and that the next generation of Apple Foundation Models — built in partnership with Google using technology behind the Gemini model family — will handle more demanding work like agentic tool use and complex reasoning by running expanded PCC infrastructure on Google Cloud ([apple.com/newsroom, June 2026](https://www.apple.com/newsroom/2026/06/apple-intelligence-brings-powerful-ai-capabilities-into-everyday-experiences/)). That's a notable admission: Apple's own silicon isn't enough to keep every "on-device-adjacent" promise.

**Galaxy AI** is the least uniform of the three, because Samsung ships two different chipsets under one brand. US-market Galaxy S26 phones use a custom Snapdragon 8 Elite Gen 5 with a Hexagon V81 NPU, roughly a 39% jump in on-device AI processing over the prior generation per Qualcomm and Samsung's own briefings. Phones sold elsewhere ship Samsung's own Exynos 2600, claimed to deliver up to a 113% improvement in generative AI performance. Samsung runs the core, always-available Galaxy AI features on this NPU, but marquee features like parts of Circle to Search and cross-language translation still need a live connection.

## Where the three actually land

| Feature area | Apple Intelligence | Gemini Nano | Galaxy AI |
|---|---|---|---|
| Text rewriting / proofreading | On-device | On-device | On-device (mostly) |
| Summarization (notes, notifications) | On-device | On-device | Mixed |
| Smart reply / quick actions | On-device | On-device | On-device |
| Complex reasoning, agentic tasks | Private Cloud Compute | Cloud (Gemini app/API) | Cloud |
| Live translation, image generation | Mostly Private Cloud Compute | Mixed | Mostly cloud |
| Works fully offline for supported tasks | Yes | Yes | Partially |

## Why local inference actually matters

The privacy argument is the strongest one, and it's not just messaging. When inference happens on the NPU, your prompt — a draft email, a photo you're editing, a voice note — never has to leave the device as plaintext to a third party. Apple's PCC model goes further by making even its cloud fallback auditable and non-retentive, which is a meaningfully different privacy posture than a typical API call to a hosted LLM.

Offline capability is the more underrated win. Summarizing a call, drafting a smart reply, or classifying a scam call works on a plane, in a basement gym, or on a spotty rural connection, because there's no round trip at all.

## The physics you can't route around

Running a model locally means burning battery and generating heat on a device the size of a deck of cards, and that constraint doesn't move as fast as the marketing does. Sustained on-device inference is thermally throttled on every current flagship — ask a phone to do continuous local summarization for ten minutes and clock speeds drop to protect the chassis. First-token latency is genuinely excellent on-device, often under 100 milliseconds, but that's specifically because these models are small; the moment a task needs a bigger model, it leaves the phone regardless of NPU headroom. Battery drain from sustained AI features is still the top complaint in early Galaxy S26 and iPhone 17-series reviews.

## The real architecture is hybrid, and that's fine

None of the three vendors is building a phone that does everything locally, and none of them hide that once you read the fine print. The actual design is a router: cheap, fast, private tasks stay on the NPU; anything requiring broad world knowledge, multi-step reasoning, or fresh information escalates to a cloud model. Apple's on-device classifier deciding whether to invoke PCC is the cleanest public example, but Google's Gemini app does the same thing implicitly — Nano handles what it can, and the request falls back to cloud Gemini otherwise. The same tiered-inference pattern shows up across AI products generally, similar to how AI browsers split simple summarization from complex multi-step tasks, as I covered comparing [AI browsers](/en/posts/ai-browsers-compared-comet-atlas-gemini).

## What's genuinely local versus what's cloud-routed marketing

Here's my honest read after digging through vendor documentation rather than keynote slides: if a feature involves generating an image, translating a full conversation live, or doing anything "agentic" — booking, multi-app orchestration, deep research — assume it's touching a server, regardless of how the marketing frames it. The tasks reliably on-device across all three platforms are narrow: text cleanup, summarization, smart replies, classification. Real and useful, but table stakes, not the frontier. The stuff that actually impresses people in demos is still cloud-dependent, and I don't think that changes meaningfully before 2028 — the gap between a 3B-parameter on-device model and a frontier model isn't closing anywhere near as fast as NPU throughput is improving.

## What to expect from a 2026-generation flagship

Realistically: faster, more reliable versions of the same narrow task set — proofreading, summarizing, smart replies, basic photo edits — running fully offline, with improved latency thanks to NPUs like the Hexagon V81 and Exynos 2600. Expect Apple, Google, and Samsung to keep expanding what counts as "on-device" incrementally, mostly by shrinking bigger models rather than NPUs suddenly getting radically faster. Do not expect a 2026 phone to run a frontier-class assistant fully offline — that gap is a hybrid-routing problem, not one you chip your way out of this year. The same local-versus-cloud tension is playing out in [AI smart glasses](/en/posts/ai-smart-glasses-2026-meta-vs-android-xr), where battery and thermal limits are even tighter than on a phone. For more on-device-adjacent tooling, see our roundup of [the coolest AI-built tools of 2026](/en/posts/coolest-ai-built-tools-2026), and for a sense of how far current hardware still is from frontier workloads, see our comparison of [AI video generation with Sora and Veo](/en/posts/ai-video-generation-2026-sora-vs-veo). Browse more coverage in our [technology category](/en/category/technology).

## Frequently Asked Questions

### Does Gemini Nano work without an internet connection?

Yes, for its supported tasks. Google's own documentation confirms Gemini Nano runs through Android's AICore service entirely on-device, covering summarization, grammar correction, rewriting, smart replies, and basic classification without a network call, on Pixel, Snapdragon, and Dimensity-based phones with AICore support.

### Is Apple Intelligence actually private if some requests go to the cloud?

Requests that escalate to Private Cloud Compute are still built for privacy: Apple's security documentation states PCC processes only the data relevant to the request and deletes it immediately after generating a response, with no retention. It's a different privacy model than fully local processing, but it's not the same as a typical cloud API call either.

### Why does Galaxy AI feel less consistent than Apple Intelligence or Gemini Nano?

Mostly because Samsung ships two different chipsets under one Galaxy AI brand — Snapdragon 8 Elite Gen 5 in some regions and Exynos 2600 in others — with different NPU performance, and because more Galaxy AI features rely on live cloud connections than Apple's or Google's core feature set does.

### Will phones run large AI models fully offline soon?

Not by any realistic 2026–2027 timeline. The gap between a phone-sized model and a frontier cloud model is architectural, not just a matter of NPU speed, so hybrid on-device-plus-cloud routing is likely to remain the default design for years.
