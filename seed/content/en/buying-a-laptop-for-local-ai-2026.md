---
title: "What Specs Matter When Buying a Laptop for Local AI?"
slug: "buying-a-laptop-for-local-ai-2026"
translationKey: "laptop-for-local-ai-buying-guide-2026"
locale: "en"
excerpt: "Short answer: memory capacity decides what you can run; NPU TOPS numbers barely matter for most users. Most people are still better off with a cloud API."
category: "technology"
tags: ["on-device-ai", "hardware", "ai-tools", "llm"]
publishedAt: "2026-11-07"
seoTitle: "Buying a Laptop for Local AI: What Specs Matter (2026)"
seoDescription: "Short answer: memory capacity decides what runs, not NPU TOPS or CPU speed. For most people, a cloud API beats running models locally on a laptop."
---

Short answer: the first spec that matters when buying a laptop for local AI is memory capacity — unified memory on Apple Silicon, VRAM on a discrete-GPU laptop — not the NPU's TOPS rating or the CPU's core count. Honest caveat upfront: for most people, the smarter choice is still a cloud API, not running models locally at all.

## What's the first spec to check when buying a laptop for local AI?

The real bottleneck in running a language model is memory: if the model's parameters don't fit in VRAM or unified memory, it doesn't run, no matter how fast your CPU is. With 4-bit quantization, a rough rule applies: required memory in GB is about half the model's parameter count in billions, plus extra headroom for the context window and system overhead. That's why "how many GB" comes before "how many TOPS."

```text
Rough rule (Q4 quantization): required memory (GB) ≈ parameter count (billions) × 0.5 + overhead
Example: a 7-billion-parameter model ≈ 6–8 GB
Example: a 30-billion-parameter model ≈ 16–20 GB (plus headroom for context window)
```

## How much memory do 7B and 30B models need?

This table shows approximate memory needs at 4-bit quantization for common model sizes:

| Model size | Approx. memory (Q4) | Typical laptop fit |
|---|---|---|
| 7B | 6–8 GB | Most modern laptops (16 GB RAM/VRAM) |
| 13B | 10–12 GB | 16 GB unified memory, tight |
| 30–34B | 16–20 GB | 32 GB unified memory recommended |
| 70B | 40+ GB | Not practical on a laptop, needs desktop/server |

Most discrete laptop GPUs ship with 8–16 GB of VRAM; even high-end models rarely exceed 24 GB, which makes running anything above 32B impractical on a laptop GPU. Apple Silicon's unified memory architecture has an edge here because system RAM is directly usable by the GPU too — the trade-off is slower inference compared to dedicated VRAM on the same model.

## Does the NPU's TOPS number actually matter?

For most users, no — at least not for large language models. NPUs, like the ones in Windows Copilot+ PCs, are optimized for small, specialized, always-on tasks: background blur, audio enhancement, small classification models running at low power continuously. Numbers like 30–40 TOPS get marketing attention, but the software ecosystem for running a language model above 7B at full speed on an NPU is still less mature than the GPU/unified-memory path. We cover [what an NPU actually does in AI PCs](/en/posts/ai-pc-npu-explained) in more detail.

## Apple Silicon, Windows Copilot+, or a discrete-GPU laptop?

Each approach has different strengths:

| Approach | Strength | Weakness |
|---|---|---|
| Apple Silicon (unified memory) | Can run models up to 30B on one machine, quiet, low power | Slower inference than dedicated VRAM |
| Windows Copilot+ (NPU) | Power-efficient for small, always-on tasks | Limited ecosystem/software support for large LLMs |
| Discrete-GPU laptop (dGPU) | Fastest inference for a model that fits in VRAM | VRAM capped at 8–16 GB, worse battery life and heat |

## What's the buying checklist by budget?

Entry level (7B-13B models): 16 GB of unified memory or a dGPU laptop with 16 GB VRAM is enough. Mid-range (up to 30B): look for 32 GB unified memory (Apple Silicon) or a dGPU laptop with 24 GB VRAM. High-end: a Mac with 64–128 GB of unified memory handles 30–34B models comfortably and can squeeze in some quantized 70B variants — though price-to-performance degrades fast at this tier. On storage, model files range from 4 GB to 40+ GB, so plan for at least 512 GB, preferably 1 TB.

## How does quantization choice change memory needs?

Quantization shrinks memory needs by representing a model's weights with fewer bits; Q4 (4-bit) is the most common balance point today because the quality loss is small and the memory savings are large. Q8 (8-bit) loses less quality but needs roughly twice the memory of Q4; more aggressive quantization like Q2 cuts memory further but can cause noticeable degradation in output quality. The context window is another line item people forget: loading a long chat history or a large document takes its own separate chunk of memory, so "the model fits" and "the model plus a long context fits" are two different calculations.

| Quantization | Memory (for a 7B model) | Quality impact |
|---|---|---|
| Q8 (8-bit) | ~12–14 GB | Nearly no quality loss |
| Q4 (4-bit) | ~6–8 GB | Small quality loss, most common balance |
| Q2 (2-bit) | ~3–4 GB | Risk of noticeable quality loss |

## Should you actually run AI locally on a laptop?

My honest take: for most people, local AI is a satisfying hobby project but a poor cost-to-performance trade. Instead of paying a $2,000-$3,000 premium for a capable laptop, a cloud API delivers equal or better quality in minutes, with no hardware investment and automatic model upgrades included. Three scenarios genuinely justify running locally: a hard data-privacy requirement (air-gapped environments, regulatory constraints), a real need for offline operation, and experimentation or learning. Outside those three, as we cover in our comparison of [running AI on-device vs. in the cloud](/en/posts/on-device-vs-cloud-ai), the cloud remains the right default.

## Frequently Asked Questions

### How much RAM do I need on a laptop to run local AI?

At least 16 GB of unified memory or VRAM for 7B-13B models; 32 GB is recommended for 30B-class models. Rough rule: with 4-bit quantization, required memory in GB is roughly half the parameter count in billions, plus headroom for the context window.

### Is a laptop with an NPU enough for large language models?

Usually not. NPUs are optimized for small, always-on tasks; the GPU/unified-memory ecosystem is still more mature for running models above 7B at full speed. An NPU's TOPS rating isn't a direct indicator of large-language-model performance.

### Is Apple Silicon or a discrete-GPU laptop better for local AI?

If you want to run larger models (up to 30B), Apple Silicon's unified memory architecture has the edge. For a model that fits within VRAM, a discrete-GPU laptop usually delivers faster inference. The right choice depends on your target model size and whether speed matters more than capacity.

### Why does SSD size matter when buying a laptop for this?

Quantized model files range from about 4 GB for small 7B models to over 40 GB for 30B+ models, and these files pile up fast once you start trying more than one. At least 512 GB of storage is recommended, preferably 1 TB; model load times also depend on SSD read speed, so an NVMe drive is worth the extra cost if your budget allows it.

### Is a cloud API always the smarter choice over local AI?

For most users, yes — it delivers equal or better quality without hardware cost, maintenance, or the burden of manually updating models. Running locally makes sense mainly for strict data-privacy requirements, offline operation, or experimentation and learning.
