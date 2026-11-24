---
title: "How Do You Cut GPU Costs for AI Inference on K8s?"
slug: "gpu-costs-kubernetes-inference"
translationKey: "gpu-costs-kubernetes-inference-2026"
locale: "en"
excerpt: "Cast AI's 2026 report found median GPU utilization at just 5% on Kubernetes clusters; sharing, batching, and queue-depth autoscaling close most of the gap."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "ai-infrastructure", "llm"]
publishedAt: "2026-11-24"
seoTitle: "Cut GPU Costs for AI Inference on Kubernetes"
seoDescription: "Cast AI's 2026 report found median GPU utilization at just 5% on Kubernetes; GPU sharing, batching, and queue-depth autoscaling close most of that gap."
---

Short answer: the GPU bill on Kubernetes is almost never a hardware problem, it's a utilization problem. Cast AI's 2026 State of Kubernetes Optimization report, built from tens of thousands of production clusters, puts median GPU utilization at just 5% — so the first move is sharing and batching the GPUs you already have, not buying more.

## Why do GPUs break classic Kubernetes autoscaling?

Classic Kubernetes autoscaling assumes a request finishes in milliseconds and a pod can be killed and rescheduled without cost. Neither holds for inference: a GPU pod can take tens of seconds to schedule once it needs to pull a multi-gigabyte model image and initialize CUDA context, and treating a GPU like a web pod — one request, one pod, scale on CPU percent — leaves it mostly idle between bursts, which is exactly what the 5% median utilization figure reflects.

The other mismatch is granularity. A CPU pod can ask for 100m of a core; a GPU request has historically meant "one whole GPU," even when the model only uses a fraction of its memory and compute. That's the gap the next two tactics exist to close.

## What are the main ways to share a GPU in Kubernetes?

NVIDIA's Multi-Instance GPU (MIG) and time-slicing solve the same problem — multiple workloads on one physical GPU — with different trade-offs. NVIDIA's own guidance recommends MIG for production environments that need strict hardware-level fault isolation to meet enterprise SLAs, since each MIG partition gets dedicated memory and compute with no cross-talk. Time-slicing instead lets workloads take turns on the full GPU; NVIDIA's benchmarks show it can even be a little faster on bursty, light tasks (a reported mean latency of 144.7 ms versus MIG's 168.2 ms), because there's no hard partition boundary to work around.

| Approach | Isolation | Best for | Overhead |
|---|---|---|---|
| MIG | Hardware-level, dedicated memory | Multi-tenant SLAs, noisy-neighbor risk | None once partitioned |
| Time-slicing | Software, shared memory | Bursty, latency-tolerant inference | Context-switch cost under load |
| Whole-GPU (no sharing) | N/A | Training, large models that need full VRAM | Idle capacity when underused |

Cast AI's own GPU-sharing case studies report running up to 10 jobs on a single A100 with time-slicing, with savings as high as 90% on light workloads — treat that as a vendor-reported ceiling, not a guarantee, since it depends heavily on how bursty and how small each job actually is.

## How do you autoscale GPU inference without wasting capacity?

Scale on queue depth or requests-in-flight, not GPU utilization percentage, because utilization lags the signal you actually care about — a GPU can look "busy" from one long-running request while a dozen more pile up waiting. This is the same pattern covered in [cutting idle Kubernetes costs with KEDA](/en/posts/kubernetes-idle-costs-keda): KEDA's custom-metrics triggers work as well for an inference queue as for an SQS worker, scaling GPU replicas up when requests queue and back down — ideally with a node autoscaler like [Karpenter](/en/posts/karpenter-vs-cluster-autoscaler) removing the now-idle GPU node behind it — once the queue drains.

Request batching is the other lever specific to inference: grouping several incoming requests into one forward pass raises GPU utilization per request without adding hardware, at the cost of a small, bounded latency increase while the batch window fills. Most serving frameworks (vLLM, TensorRT-LLM, Triton) support this natively, and it's usually the single highest-leverage change before touching autoscaling at all.

## How do you measure whether any of this is working?

Track cost per 1,000 tokens served, not raw GPU-hour spend, since a cheaper GPU-hour on an underutilized cluster can still produce a worse cost-per-token than a pricier GPU running near capacity. Pull your actual token throughput and divide it into GPU spend for the same window — that single number tells you whether MIG, time-slicing, or batching changes are actually paying off, in a way raw utilization percentage can't.

Capacity pricing is moving too, which raises the stakes on getting utilization right: Cast AI reports H200 AWS Capacity Block pricing rose 15% in January 2026, the first GPU price increase of that kind in roughly two decades by their account. A 5%-utilized GPU on a more expensive hour is a worse trade every month that pricing holds.

## When does managed inference beat self-hosting on Kubernetes?

Self-hosting wins when you're running a steady, predictable volume large enough to keep shared GPUs reasonably busy, or when data residency rules force the workload onto your own cluster regardless of cost. Managed inference APIs win when your traffic is spiky, low-volume, or experimental, because you're paying for utilization someone else already solved instead of carrying your own 5%-utilized fleet while you figure out demand. A useful rule of thumb: if you can't yet forecast next month's inference volume within roughly 2x, you're not ready to own the GPU utilization problem yourself — rent it until you can.

My honest take: spot GPUs with checkpointing get recommended constantly for cost control, and they do help, but they're solving the wrong layer — a spot instance running at 5% utilization is still a 95%-wasted spot instance. Fix utilization first; spot and MIG and batching are multipliers on top of that, not substitutes for it.

Primary sources: [Cast AI's Kubernetes GPU optimization research](https://cast.ai/blog/kubernetes-gpu-optimization/), [Cast AI's GPU-sharing cost breakdown](https://cast.ai/blog/gpu-sharing-kubernetes-cost-optimization/), and [The New Stack's reporting on GPUs on Kubernetes](https://thenewstack.io/gpus-on-kubernetes/).

## Frequently Asked Questions

### How much of a Kubernetes cluster's GPU capacity actually goes unused?

Cast AI's 2026 State of Kubernetes Optimization report, drawn from tens of thousands of production clusters, found a median GPU utilization of just 5%. That means half of measured clusters run at or below 5% utilization on the GPU hardware they're paying for.

### Should I use MIG or time-slicing to share a GPU?

Use MIG when you need strict, hardware-level isolation between workloads to meet an enterprise SLA, since each partition gets dedicated memory with no cross-talk. Use time-slicing for bursty, latency-tolerant inference where workloads can take turns on the full GPU; NVIDIA's own benchmarks show it can be marginally faster on light, bursty tasks than MIG.

### What metric should I use to track GPU cost efficiency for inference?

Track cost per 1,000 tokens served rather than cost per GPU-hour. A low hourly rate on an underutilized GPU can still produce a worse cost-per-token than a more expensive GPU running close to capacity, and cost-per-token is the number that actually reflects whether sharing, batching, or autoscaling changes are paying off.

### Is it cheaper to self-host inference on Kubernetes or use a managed API?

It depends on volume predictability. Steady, high-volume traffic usually favors self-hosting, since you can keep shared GPUs busy enough to justify the operational overhead. Spiky, low-volume, or experimental workloads usually favor a managed inference API, because you avoid paying for a self-hosted GPU fleet running at single-digit utilization while demand is still uncertain.
