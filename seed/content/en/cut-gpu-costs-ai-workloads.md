---
title: "Cut GPU Costs for AI Workloads: Spot and Scheduling"
slug: "cut-gpu-costs-ai-workloads"
translationKey: "gpu-cost-control-ai-workloads-2026"
locale: "en"
excerpt: "Short answer: most GPU spend goes to idle capacity, not compute. Spot nodes, MIG/time-slicing, and scale-to-zero recover most of the wasted budget."
category: "devops-cloud"
tags: ["cost-optimization", "kubernetes", "ai-infrastructure", "finops"]
publishedAt: "2026-09-19"
seoTitle: "Cut GPU Costs for AI Workloads: 2026 Guide"
seoDescription: "Why is your GPU bill so high, and how do you fix it? Spot instances, MIG, time-slicing, and scale-to-zero, with a concrete order of steps for 2026."
---

Short answer: most of your GPU bill pays for idle or underused capacity, not for compute that is actually doing work. Per Cast AI's 2026 State of Kubernetes Optimization Report, average GPU utilization in production Kubernetes clusters is just 5%. Spot instances, fractional GPU sharing, and scale-to-zero recover most of that waste without touching model code.

## Why do GPU bills dominate AI infrastructure spend?

Because capacity gets provisioned for peak load and then sits mostly idle. Cast AI's 2026 report puts average GPU utilization in production Kubernetes clusters at 5%, and most inference deployments run at only 20–40% average SM (streaming multiprocessor) utilization.

The pattern is straightforward: teams size GPU nodes for the busiest moment a model will ever see, then leave that capacity running around the clock. Training jobs sit on nodes that wait overnight and idle during the day. Inference services lock a full GPU even during the hours when traffic is a fraction of peak. The bill gets cut against provisioned capacity, not against actual use.

That is why GPU cost optimization in 2026 is less about finding cheaper hardware and more about wasting less of the hardware you already have.

## Is it safe to use spot GPUs?

For batch and training jobs, yes, as long as they checkpoint regularly. Spot (or preemptible) instances are GPU capacity the cloud provider can reclaim on short notice, sold at 60–90% below on-demand pricing. The tradeoff is interruption risk: the provider can stop the instance with only a few minutes of warning.

That risk is manageable for jobs that save state as they go. If a training loop checkpoints every N steps, a spot interruption costs at most the few minutes of progress since the last checkpoint. For latency-sensitive, always-on inference services, spot alone is riskier — there it only makes sense paired with extra replicas and fast failover.

As of 2026, the recommended order of highest-impact steps is:

1. **Move training jobs to spot/preemptible nodes** — 60–70% savings.
2. **Configure scale-to-zero for GPU node pools** so idle nodes are actually removed, not just left idling — 50–65% savings for batch and bursty teams.
3. **Enable time-slicing or MIG on inference nodes** so multiple pods or requests share one GPU — a 50–75% per-GPU cost reduction.

The first two remove nodes you do not need; the third makes the nodes you keep do more work per dollar.

## MIG or time-slicing: which should you use?

It depends on how much isolation you need. MIG (Multi-Instance GPU) is NVIDIA's hardware-level partitioning feature: it splits a single A100 into up to seven independent instances, each with hardware-level memory and fault isolation. Time-slicing is a software-only sharing approach that works on any NVIDIA GPU and is a low-effort, ConfigMap-level change in Kubernetes.

The difference that matters is isolation. Each MIG partition has its own memory and fault boundary, so a crash in one partition does not touch the others. Time-slicing shares the card as a single pool: there is no hardware fault isolation, so a memory leak in one workload can affect the others sharing the GPU.

| Approach | Hardware requirement | Isolation | Typical cost impact | Best-fit workload |
| --- | --- | --- | --- | --- |
| No sharing (full GPU) | None | Full isolation | Baseline cost | Single large model, latency-critical |
| MIG | MIG-capable card (A100, H100, etc.) | Hardware-level | 5–6x lower cost per request vs. a dedicated A100 | Multiple services, isolation/security matters |
| Time-slicing | Any NVIDIA GPU | None | 50–75% lower cost per inference | Homogeneous, trusted workloads sharing a card |

Rule of thumb: use MIG when different teams or security boundaries share the cluster, and time-slicing when the same team runs similar models and wants lower operational overhead for a comparable gain. Spot instances and MIG also combine well — running multiple model replicas on a single interruptible GPU — which suits batch inference jobs that checkpoint, but is a poor fit for latency-sensitive serving.

Enabling time-slicing in Kubernetes starts with a ConfigMap like this on the node:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-device-plugin-config
  namespace: kube-system
data:
  time-slicing.yaml: |
    version: v1
    sharing:
      timeSlicing:
        resources:
        - name: nvidia.com/gpu
          replicas: 4
```

This tells the scheduler to treat each physical GPU as four schedulable replicas, so it can pack four times as many pods onto the same card. The change lives entirely in the device plugin config — no application code changes required.

## How do you know if GPU cost cuts actually worked?

By tracking $/million tokens (or $/inference request) and GPU utilization percentage, not total GPU spend. A lower bill from removed capacity is only a real win if utilization on the capacity you kept has gone up; otherwise you have just relocated the waste.

On top of these infrastructure-level tactics, batching requests and quantizing models are complementary levers. Batching groups multiple requests into a single GPU call, extracting more work per GPU-second. Quantization runs inference at int8 or fp8 instead of fp32/fp16, directly cutting the GPU-seconds each request needs. Neither replaces the infrastructure changes above — both stack on top of them.

Here is the opinionated part: most teams buy more GPUs before they ever check utilization. When the bill spikes, the reflex is "add capacity," even though the existing cards are running at 5–40% utilization. Adding more GPUs on top of that is not an engineering decision — it is a budgeting mistake, and in 2026 it is an avoidable one.

For the general principles behind cutting Kubernetes spend, see [Kubernetes cost optimization](/en/posts/kubernetes-cost-optimization); for setting up autoscaling beyond GPU pools, see the [Kubernetes autoscaling guide](/en/posts/kubernetes-autoscaling-guide). On the model side, [cut LLM token costs](/en/posts/cut-llm-token-costs) pairs well with this article, and [FinOps: reduce cloud costs](/en/posts/finops-reduce-cloud-costs) covers the broader process this fits into. The same-day piece on [cutting your observability bill](/en/posts/cut-observability-bill-sampling-cardinality) applies a similar "bill by actual use" logic to telemetry spend.

For more data and implementation detail, see nOps' [GPU cost optimization](https://www.nops.io/blog/gpu-cost-optimization/) writeup, Cast AI's [fractional GPU Kubernetes](https://cast.ai/blog/fractional-gpu-kubernetes/) piece, and CloudRPS' comparison of [fractional GPUs, MIG, time-slicing, and MPS](https://cloudrps.com/blog/fractional-gpus-kubernetes-mig-time-slicing-mps/).

## Frequently Asked Questions

### How much do spot GPU instances save on training jobs?

Spot and preemptible GPU instances cost 60–90% less than on-demand pricing. In exchange, the provider can reclaim capacity with only a few minutes of notice; that risk is manageable for batch and training jobs that checkpoint regularly, but it needs extra safeguards for always-on, latency-sensitive services.

### What is the real difference between MIG and time-slicing?

MIG uses NVIDIA hardware support (available on cards like the A100) to split one GPU into up to seven hardware-isolated instances, cutting cost per request by 5–6x versus dedicating a full A100 to one service. Time-slicing is a software-only method that works on any NVIDIA GPU, cuts cost per inference by 50–75%, but provides no hardware fault isolation between the workloads sharing the card.

### Which GPU cost optimization step should I do first?

The recommended 2026 order is: move training jobs to spot nodes first (60–70% savings), then enable scale-to-zero on GPU node pools (50–65% savings), then turn on time-slicing or MIG on inference nodes (50–75% lower cost per GPU). This order goes from lowest effort and highest impact to more involved changes.

### My GPU bill dropped — how do I know performance didn't suffer?

Track $/million tokens or $/inference request alongside GPU utilization percentage, not total GPU spend alone. If the bill fell but utilization on the remaining capacity did not rise, you removed capacity without becoming more efficient; the actual goal is improving both together.
