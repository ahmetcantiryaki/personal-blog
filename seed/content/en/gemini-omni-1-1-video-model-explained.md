---
title: "Gemini Omni 1.1: What Is Google's New Video Model?"
slug: "gemini-omni-1-1-video-model-explained"
translationKey: "gemini-omni-video-model"
locale: "en"
excerpt: "Short answer: Gemini Omni 1.1 Flash is Google's fast video model. It generates 360p/720p natively, upscales to 1080p/4K, at $0.03–$0.30 per second."
category: "ai"
tags: ["gemini", "ai-tools", "machine-learning", "digital-products"]
publishedAt: "2026-09-04"
seoTitle: "Gemini Omni 1.1 Flash Explained: Features and Pricing"
seoDescription: "Gemini Omni 1.1 Flash is Google's new video model. Resolution, scene extension, pricing ($0.03–$0.30/sec), and a comparison against Sora, explained."
---

Short answer: Gemini Omni 1.1 Flash is Google's fast multimodal model, released in August 2026, tuned for video generation and editing. It generates natively at 360p and 720p, produces 1080p and 4K output through upscaling, extends scenes in 10-second segments up to 40 seconds total, and costs between $0.03 and $0.30 per second depending on resolution.

## What Is Gemini Omni 1.1 Flash?

Gemini Omni 1.1 Flash is Google's newest multimodal model tuned for video generation and editing, available through Google AI Studio, Flow, and the Gemini Enterprise Agent Platform. It isn't a "bigger model" release — it's a Flash variant optimized for speed and cost, which makes it better suited to experimental iteration and bulk production than Google's heavier video models.

Google announced it will deprecate the existing `gemini-omni-flash-preview` endpoint on September 30, 2026, which makes 1.1 Flash the general-availability successor to that preview. Teams still on the preview endpoint need to migrate before the end of September.

## How Does It Differ From Prior Veo/Imagen Work?

The difference is in the level of control: Omni 1.1 Flash ships developer controls — conversational editing, scene extension, and first/last-frame specification — that Google's earlier Veo and Imagen models didn't offer at this granularity. Conversational editing means describing a change in plain language, and the model applies just that change while leaving the rest of the clip untouched.

Scene extension works in 10-second segments and supports generating up to 40 seconds of video total. You can specify a first and last frame, and the model fills in the motion between them — including camera orbits, zooms, and complex transitions.

In practice, this turns work that previously required manually stitching pieces together into a single request. If you're supplying the opening and closing frame of a product video from two images you already have, you ask the model to generate the 8–9 seconds of transition between them instead of hand-animating it — which cuts production time from hours to minutes, especially for small teams.

## What Resolution Control and Editing Features Does It Have?

The model generates natively at 360p and 720p; 1080p and 4K output come from upscaling, not direct generation. The practical workflow is generating fast, cheap 360p drafts first, then upscaling only the result you like to 4K — far cheaper than generating every attempt at high resolution.

| Resolution | Generation method | Approx. cost per second |
|---|---|---|
| 360p | Native (draft) | ~$0.03 |
| 720p | Native | ~$0.10 |
| 1080p | Upscaling | ~$0.15 |
| 4K | Upscaling | ~$0.30 |

## What Input Types Does It Accept?

The model accepts four input types: text prompts, reference images, reference video, and reference audio — all billed at one flat rate of $1.50 per million tokens. That means you can, for example, supply a previous brand video as a reference and ask for "the same style with a different product," rather than being limited to text-only generation.

On the audio side, the model supports synchronized audio-video editing — adding music or a sound effect to a scene is handled as a plain-language editing request rather than needing a separate audio tool. That's especially useful for short social clips, since you can combine a visual change and an audio request in the same instruction.

## How Is Gemini Omni 1.1 Flash Priced?

Video output is billed at $17.50 per million tokens, which works out to roughly $0.10 per second of 720p video at a fixed 5,792 tokens per second. Input (text, image, video, or audio references) is billed at one flat rate of $1.50 per million tokens. There's no free tier and no Batch API discount, which means costs can add up quickly during experimental use.

```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-omni-1-1-flash:generateVideo \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -d '{"prompt": "Slow camera orbit over a city skyline", "resolution": "720p", "duration_seconds": 10}'
```

This illustrates how resolution and duration parameters are conceptually set; check Google's current API documentation for exact endpoint and field names. A 10-second 720p clip costs a little over $1 in output cost alone.

## What Are Realistic Use Cases and Current Limits?

It's strongest for social media clips, product showcase visuals, and fast concept validation. The 360p draft mode lets you test an idea in seconds and walk away without loss if it doesn't work — a real cost advantage over experimenting with expensive 4K generation directly.

Its limits are just as clear: the 40-second total duration cap isn't enough for long-form video content, and 1080p/4K being upscaled rather than native limits quality for professional production that needs fine detail. Consistency in complex, multi-character scenes also isn't a fully solved problem yet.

## How Does It Compare to Sora and Rivals?

Omni 1.1 Flash's core differentiator is price and control, not raw quality: OpenAI's Sora leans closer to cinematic output, while Omni 1.1 Flash focuses on speed, a low-cost draft-then-upscale workflow, and developer API control. For a broader comparison across video generation models, see our [Sora vs Veo comparison](/en/posts/ai-video-generation-2026-sora-vs-veo) — Omni 1.1 Flash is a direct continuation of the Veo line in that comparison, not a separate model family.

My take: this model's real value isn't in the "best image quality" race — it's in iteration speed. Being able to draft at $0.03 a second lets you cheaply test a video idea before an expensive production run, and that capability can matter more than raw output quality alone, especially for small teams.

## Who Should Try It Now?

Small marketing teams generating fast, low-cost clips for social media, and product teams doing concept validation, should try it now. For studios producing cinematic-quality, long-form content, the model isn't mature enough yet; the full versions of Sora or Veo remain the better fit for them.

Budget accordingly: since there's no free tier or bulk discount, a team testing dozens of variations can hit a few hundred dollars in cost quickly. The practical approach is keeping the draft phase entirely at 360p and only upscaling the final approved version to 4K — that one decision alone can cut total cost by 3-4x.

For more on Google's AI models, see Woyable's [AI category](/en/category/ai).

## Frequently Asked Questions

### Does Gemini Omni 1.1 Flash actually generate 4K video?

Partially. The model generates natively only at 360p and 720p; 1080p and 4K output are produced through upscaling, not direct generation. In practice, drafting at 360p first and upscaling only your preferred result is the most cost-effective approach.

### How long can a video be extended in Gemini Omni 1.1 Flash?

Scenes can be extended in 10-second segments, up to a total of 40 seconds. That's not enough for long-form video content but is sufficient for social media clips.

### How much does Gemini Omni 1.1 Flash cost per second?

Pricing varies by resolution: roughly $0.03 for 360p drafts, roughly $0.10 for native 720p, roughly $0.15 for 1080p, and roughly $0.30 for 4K. There's no free tier or Batch API discount.

### Does Gemini Omni 1.1 Flash replace the earlier preview version?

Yes. Google announced it will deprecate the `gemini-omni-flash-preview` endpoint on September 30, 2026; 1.1 Flash is the general-availability successor to that preview, so teams on the preview endpoint need to migrate.

Sources: [Google's Gemini Omni 1.1 Flash announcement](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/), [Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog), [TechRepublic's Omni 1.1 review](https://www.techrepublic.com/article/news-google-gemini-omni-1-1-ai-video-control/).
