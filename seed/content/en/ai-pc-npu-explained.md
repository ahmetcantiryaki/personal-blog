---
title: "AI PCs Explained: What an NPU Actually Does"
slug: "ai-pc-npu-explained"
translationKey: "ai-pc-npu-explained"
locale: "en"
excerpt: "A 40-TOPS NPU does less than the marketing implies. Most local LLM speed actually comes from the GPU's memory bandwidth, not the NPU's raw compute rating."
category: "technology"
tags: ["on-device-ai", "ai-infrastructure", "performance", "hardware"]
publishedAt: "2026-08-03"
seoTitle: "What Is an AI PC NPU? What It Really Does"
seoDescription: "A 40-TOPS NPU does less than the marketing implies. Most local LLM speed actually comes from the GPU's memory bandwidth, not the NPU's raw compute rating."
---

Buy a laptop with an "AI PC" sticker and what does the NPU inside it actually do? Short answer: it's a specialized chip that runs continuously at low power on background tasks like transcription or noise cancellation — not the "magic chip that runs large language models fast" the marketing implies. Most of the real-world speed you get from running a model locally comes from the GPU's memory bandwidth, not the NPU.

## What an NPU Is, and What TOPS Actually Measures

An NPU (Neural Processing Unit) is a chip optimized specifically for neural-network operations like matrix multiplication; it can run those operations continuously in the background at far lower power than a CPU. TOPS (Tera Operations Per Second) measures how many trillion operations an NPU can perform per second — but that number alone doesn't predict real-world performance, because memory bandwidth and model size matter at least as much as raw TOPS.

[Microsoft's hardware bar for the "Copilot+ PC" category is specific](https://www.techpowerup.com/320933/microsoft-copilot-to-run-locally-on-ai-pcs-with-at-least-40-tops-of-npu-performance): an NPU rated at 40-plus TOPS, at least 16 GB of RAM, a 256 GB SSD, and Windows 11 24H2. Machines below that bar can't access Copilot+-exclusive local features like Recall, Live Captions translation, or Cocreator.

| Requirement | Copilot+ PC Bar |
| --- | --- |
| NPU performance | ≥40 TOPS |
| RAM | ≥16 GB |
| Storage | ≥256 GB SSD |
| OS | Windows 11, version 24H2+ |

## Running Local Models: NPU or GPU?

[This is where things diverge from what the marketing implies](https://www.digitalapplied.com/blog/ai-pc-npu-copilot-plus-local-ai-2026-buyers-guide). AMD's Ryzen AI 300-series NPUs reach up to 50 TOPS, clearing the hardware bar comfortably — but the one genuine laptop-class exception, the Ryzen AI Max+ 395, handles heavy local LLM inference through its integrated GPU (iGPU), not its NPU. The reason is simple: roughly 256 GB/s of bandwidth from its 256-bit LPDDR5X-8000 memory bus lets it hit 57 tokens/second on the same workload — not because its NPU is bigger, but because its memory is wider.

The practical takeaway: token generation speed is limited by memory bandwidth far more than by raw compute (TOPS). On an NPU, an 8B-parameter model generates roughly 5 tokens/second — usable, but slow. And most popular local inference tools — Ollama, llama.cpp, LM Studio — route requests to the iGPU (via Vulkan, ROCm, or Metal) or the CPU rather than the NPU directly. So "I bought an NPU laptop" doesn't usually mean "my local LLMs run on the NPU."

```text
Token generation speed ≈ f(memory bandwidth, model size)
Token generation speed ≠ f(NPU TOPS rating)
```

| Component | Power Efficiency | Local LLM Performance | Typical Use |
| --- | --- | --- | --- |
| NPU | Very high (low watts) | Limited (~5 tok/s, 8B model) | Continuous background tasks |
| iGPU (wide bandwidth, e.g., Ryzen AI Max+) | Moderate | Strong (~57 tok/s) | On-demand local inference |
| Discrete GPU | Low (high watts) | Highest | Desktop, plugged-in use |

## Real On-Device Use Cases vs. Marketing

Where the NPU genuinely earns its keep is continuous, low-latency, battery-friendly tasks: live transcription, background noise cancellation, camera background blur, lightweight image-editing suggestions. These are jobs that can stay running all day on a laptop without draining the battery — exactly what an NPU was designed for.

Where marketing overreaches is the promise of running a large, complex chat model fully offline, fluently, on the strength of the NPU alone. That's achievable, but not because of the NPU — it's thanks to an iGPU or discrete GPU with enough memory bandwidth, which puts you in a different price and power-consumption class of device entirely.

## Does Apple's Neural Engine Work Differently?

Outside the Windows/Copilot+ ecosystem, the Neural Engine in Apple's M-series chips follows a similar philosophy: strong at continuous, low-power tasks (Face ID, photo classification, speech recognition), but not the primary engine for large language model inference on its own. Apple's difference is unified memory — CPU, GPU, and Neural Engine share the same memory pool, which creates less friction than the NPU/iGPU split on the Windows side. But the underlying truth stays the same: what actually determines local LLM performance is the width of the memory architecture, not the name of the chip.

## Battery, Privacy, and Cost Trade-offs

A model that runs on-device offers a real privacy advantage since your data never leaves the machine — a genuine difference when you're working with sensitive documents or personal notes. The cost cuts two ways: hardware price (laptops carrying a 40-plus TOPS NPU typically run $200–400 more) and model quality (models small enough to run locally are generally smaller and less capable than cloud-hosted frontier models).

## Who Needs One, Who Should Wait

You need an AI PC if you fit one of these profiles: you transcribe meetings frequently, you need basic AI features without internet access while traveling, or your organization's data policy requires excluding cloud processing entirely. On the other hand, if your priority is a capable assistant for complex reasoning — writing code, analyzing a long document — a cloud-based model (Claude, GPT-5.6, Gemini 3.6) is still far more capable, and it's not worth waiting on the NPU's limited local capacity for that.

If you want to weigh this against frontier model capability, see our piece on [Claude Opus 5's launch](/en/posts/claude-opus-5-launch), or compare assistants side by side in our [AI voice assistants comparison](/en/posts/ai-voice-assistants-compared-gpt-live-gemini-claude). For more hardware coverage, follow our [Technology section](/en/category/technology).

## Do You Need an AI PC? Checklist

- Do you regularly need basic AI features in offline environments (planes, secure facilities)? → If yes, an AI PC makes sense.
- Is your primary use case live transcription, noise cancellation, or lightweight image editing? → If yes, an NPU already covers that well.
- Are you looking for complex reasoning, long codebase analysis, or deep research? → If yes, a cloud-based frontier model is still the better choice; an NPU won't meet that need.
- Is your budget tight and does the 40-plus TOPS NPU premium not matter to you? → Keep using your current laptop with cloud AI tools and wait for your next upgrade cycle.

## Frequently Asked Questions

### Can a 40-TOPS NPU run a large language model fluently?

To a limited degree. On an NPU, an 8B-parameter model generates roughly 5 tokens per second — usable but slow. Faster local inference generally requires an iGPU or discrete GPU with wide memory bandwidth.

### How does the Ryzen AI Max+ 395 run local models?

Not through its NPU, but through its integrated GPU (iGPU) and the wide bandwidth from its 256-bit LPDDR5X-8000 memory bus. That combination gets it to a usable 57 tokens per second.

### Do tools like Ollama or llama.cpp use the NPU?

Usually not. Most of these tools route requests to the iGPU via Vulkan, ROCm, or Metal, or to the CPU; direct NPU support in mainstream local-inference tools is still limited.

### Should I buy an AI PC or wait?

Buy one if you regularly need basic AI features offline, like transcription or noise cancellation. If your priority is heavy reasoning or complex code analysis, a cloud-based frontier model is still the better investment for now.
