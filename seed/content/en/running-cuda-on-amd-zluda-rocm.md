---
title: "Running CUDA on AMD GPUs: ZLUDA and ROCm in 2026"
slug: "running-cuda-on-amd-zluda-rocm"
translationKey: "zluda-cuda-on-amd-2026"
locale: "en"
excerpt: "Short answer: yes, on one card. A solo dev ran a real PyTorch workload on an RX 9060 XT via ZLUDA in September 2026, but cuDNN still doesn't work."
category: "technology"
tags: ["hardware", "machine-learning", "open-source", "performance"]
publishedAt: "2026-09-21"
seoTitle: "Does ZLUDA Actually Run CUDA on AMD GPUs in 2026?"
seoDescription: "Short answer: yes, on one card. A solo dev ran a real PyTorch workload on an RX 9060 XT via ZLUDA in September 2026, but cuDNN still doesn't work."
---

Short answer: yes, on one specific card. In September 2026, a solo developer wired ZLUDA to AMD's HIP/ROCm stack and ran a real 2.2-million-parameter PyTorch reinforcement-learning workload on a Radeon RX 9060 XT, with no source-code changes and no dual-booting into Linux. The catch: cuDNN, the library most deep-learning training depends on for speed, still doesn't work.

## What is ZLUDA, and why does it matter?

ZLUDA is a translation layer that intercepts calls made to NVIDIA's CUDA driver API and reroutes them to AMD's ROCm/HIP stack instead, letting unmodified CUDA software run on AMD hardware. It matters because CUDA is the de facto lock-in point for GPU compute — most machine-learning frameworks, scientific-computing libraries, and rendering tools ship CUDA-first, and switching to AMD hardware has historically meant rewriting code or losing access to entire libraries.

ZLUDA itself isn't new — AMD funded early development before quietly dropping the project years ago — but a September 2026 community effort revived it for a specific, previously unsupported combination: Windows, not Linux, and a current-generation consumer Radeon card.

## What actually happened on the RX 9060 XT in September 2026?

On September 13, 2026, a project called CUDA-for-AMD-Windows completed a real PyTorch reinforcement-learning network — 2.2 million parameters, 65,536 timesteps — on an RX 9060 XT (the gfx1200 architecture) at a median 13,278 steps per second. This wasn't a synthetic microbenchmark; it was a genuine training workload running through translated CUDA calls, with no virtualization layer and no dual-boot into Linux required.

The project bridges ZLUDA's CUDA-API interception with AMD's native HIP/ROCm SDK for Windows, and the developer successfully mapped the CUDA driver API along with three major libraries — cuBLAS (linear algebra), cuSPARSE (sparse-matrix operations), and cuFFT (Fourier transforms) — over to their AMD equivalents. That's enough coverage for a meaningful slice of scientific-computing and classical ML workloads.

## What still doesn't work?

cuDNN — the library that accelerates convolutional and recurrent neural-network operations — isn't wired up yet, and that's a serious gap. Most deep-learning training pipelines, especially anything computer-vision-heavy, lean on cuDNN for their fastest code paths; without it, workloads either fall back to slower unoptimized kernels or fail outright depending on how tightly the framework depends on it.

Validation is also narrow by necessity: only the RX 9060 XT has actually been tested. AMD's RDNA GPU lineup spans several architecture generations, and ROCm's own support matrix has historically been inconsistent across them — a translation layer built and verified against one card's instruction set and driver behavior doesn't automatically carry over to the rest of the lineup without separate testing.

| Component | Status on RX 9060 XT (Sept 2026) |
|---|---|
| CUDA driver API | Mapped to HIP/ROCm |
| cuBLAS, cuSPARSE, cuFFT | Working, wired to AMD equivalents |
| cuDNN | Not working |
| Virtualization/dual-boot | Not required |
| Cards validated | RX 9060 XT only |

## Who should actually care about this?

Hobbyists and cost-sensitive teams running classical ML, scientific computing, or CUDA-only tooling that doesn't lean on cuDNN are the realistic near-term beneficiaries — someone running linear-algebra-heavy simulations or a CUDA-locked rendering tool on a gaming Radeon card, without wanting to touch Linux, gets genuine value today. Production deep-learning training on AMD hardware without cuDNN support is not yet a serious option, and teams evaluating a wholesale move off NVIDIA should treat this as an early, single-card proof of concept rather than a general migration path — it's the same "does it actually run" caution worth applying whenever [AI agents get plugged into a CI/CD pipeline](/en/posts/ai-agents-vs-workflows): a working demo on one configuration says less than it looks like it does.

A quick way to sanity-check whether your own workload would even benefit, before investing time in the setup:

```python
import torch

print("CUDA available:", torch.cuda.is_available())
print("Device count:", torch.cuda.device_count())
# If your workload calls torch.backends.cudnn anywhere,
# that's the code path most likely to break on a ZLUDA/ROCm stack today.
print("cuDNN enabled:", torch.backends.cudnn.enabled)
```

If `torch.backends.cudnn.enabled` is doing real work in your training loop, this September 2026 milestone doesn't change your options yet.

## Is this a threat to NVIDIA's CUDA moat?

Not immediately, but it's a genuine crack, not just a hobbyist stunt. NVIDIA's pricing power over the last several years has rested heavily on the fact that switching away from CUDA meant losing your tooling; a community-maintained translation layer that keeps expanding library coverage chips away at that specific lock-in, one library at a time, the same way Wine gradually made Windows-only software usable on Linux without Windows itself becoming irrelevant. The honest read: this is worth tracking closely, not worth switching your production stack over yet.

Cost is the other half of the picture. An RX 9060 XT typically sells for meaningfully less than a comparable NVIDIA card, which is exactly why hobbyists and small research budgets are the ones pushing this project forward rather than a vendor with a commercial incentive. But generalizing a single-card validation into a company-wide platform decision is the wrong move: ROCm's driver behavior and instruction-set support have historically varied across RDNA generations, and nothing about this September 2026 result guarantees the same outcome on a different Radeon card without separate testing. The realistic next step is the community extending validation to other current-generation cards — until that happens, treat "it works" as true for exactly one SKU.

## Frequently Asked Questions

### Can I run CUDA software on an AMD GPU today?

On a Radeon RX 9060 XT specifically, yes, for workloads that don't depend on cuDNN — a September 2026 project demonstrated a real PyTorch training run through ZLUDA and ROCm with no source changes and no dual-boot into Linux.

### Does ZLUDA work with deep learning frameworks like PyTorch?

Partially. Core CUDA driver calls and libraries like cuBLAS, cuSPARSE, and cuFFT are mapped to AMD's ROCm/HIP stack, but cuDNN — which most deep-learning frameworks rely on for fast convolutional and recurrent operations — isn't supported yet.

### Do I need to dual-boot into Linux to use ZLUDA on AMD hardware?

No, for this specific September 2026 project. It runs natively on Windows, translating CUDA API calls to AMD's HIP/ROCm SDK without a virtualization layer or a Linux dual-boot.

### Which AMD GPUs support this ZLUDA and ROCm setup?

As of September 2026, only the Radeon RX 9060 XT has been tested and validated by the project's developer; AMD's broader RDNA lineup has not been confirmed to work the same way.

For more on treating a single working demo with appropriate caution before wider rollout, see [AI Agents vs Workflows: When to Use Each](/en/posts/ai-agents-vs-workflows). Browse more hardware and infrastructure coverage in our [Technology category](/en/category/technology).

Sources: [Solo dev enables running CUDA on AMD hardware in Windows, via Tom's Hardware](https://www.tomshardware.com/pc-components/gpu-drivers/solo-developer-wires-zluda-to-amds-hip-getting-multiple-cuda-libraries-running-on-a-radeon-rx-9060-xt-in-windows-cuda-exclusive-workloads-on-amd-hardware-in-windows-is-possible-without-virtualization-or-dual-booting) and [CUDA-for-AMD-Windows validation notes, GitHub](https://github.com/Speedstu/CUDA-for-AMD-Windows/blob/main/docs/VALIDATION.md).
