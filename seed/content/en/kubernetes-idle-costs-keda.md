---
title: "How Do You Cut Idle Kubernetes Costs With KEDA?"
slug: "kubernetes-idle-costs-keda"
translationKey: "kubernetes-idle-costs-keda-2026"
locale: "en"
excerpt: "Use KEDA to scale event-driven Kubernetes workloads to zero between bursts; standard HPA can't do that, since it always keeps at least one replica running."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "finops", "automation"]
publishedAt: "2026-11-24"
seoTitle: "Cut Idle Kubernetes Costs With KEDA (2026 Guide)"
seoDescription: "Use KEDA to scale event-driven Kubernetes workloads to zero between bursts, pair it with kube-downscaler and Karpenter, and set guardrails so SLOs survive."
---

Short answer: install KEDA, point it at the queue, topic, or cron schedule that actually drives your workload, and let it scale replicas to zero when there's nothing to process — standard Kubernetes HPA can't do that because it always keeps at least one replica running, even at 2 a.m. with an empty queue.

## What makes a Kubernetes workload "idle" and costly?

A workload is idle when it reserves CPU, memory, or GPU capacity that nothing is using right now. Cast AI's 2026 State of Kubernetes Optimization report, built from tens of thousands of production clusters, puts median GPU utilization at just 5% — and the same pattern shows up on CPU-bound queue consumers, batch jobs, and staging environments that run around the clock for no reason. Every idle pod still holds a node reservation, and that reservation is what shows up on the bill whether or not it does any work.

The root cause is usually a scaling tool built for steady HTTP traffic, not bursty event sources. Kubernetes' built-in Horizontal Pod Autoscaler requires at least one replica running at all times, so a Kafka consumer or SQS worker that's busy for ten minutes an hour still pays for the other fifty.

## How does KEDA cut idle costs?

KEDA (Kubernetes Event-driven Autoscaling) scales a workload based on the actual event source — queue depth, Kafka lag, a cron schedule, a Prometheus metric — instead of CPU percentage, and it can scale all the way to zero replicas when there's nothing to do. KEDA is a CNCF Graduated project, and it doesn't replace the HPA; it generates and manages HPA objects under the hood, feeding them event-driven metrics the HPA alone can't read. It works for Deployments, Jobs, and StatefulSets.

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: order-queue-worker
spec:
  scaleTargetRef:
    name: order-queue-worker
  minReplicaCount: 0
  maxReplicaCount: 20
  cooldownPeriod: 120
  triggers:
    - type: aws-sqs-queue
      metadata:
        queueURL: https://sqs.eu-central-1.amazonaws.com/123456789/orders
        queueLength: "5"
```

With `minReplicaCount: 0`, this worker holds zero nodes when the queue is empty and scales up only once messages start arriving. Google Cloud's own GKE guidance frames the payoff directly: you align cost with actual usage, paying only for the resources you consume, not the capacity you reserved "just in case."

## How do you park non-production workloads on a schedule?

KEDA's event triggers include a cron source, which is the simplest way to scale a Deployment to zero outside business hours without touching application code. For environments that aren't driven by a real event at all — a staging cluster nobody touches after 7 p.m., a demo environment used only on weekdays — a scheduled-downscale controller like kube-downscaler gives you the same scale-to-zero outcome on a plain time window, which is a cleaner fit than wiring a fake cron trigger into every non-prod `ScaledObject`.

The combination matters: KEDA for workloads with a real event signal, a downscaler for workloads that only need a clock. Running both means almost nothing in a non-production namespace holds a node reservation overnight.

## Does KEDA replace the cluster autoscaler or Karpenter?

No — KEDA scales pods, not nodes. Once KEDA scales a Deployment down to zero pods, something still has to remove the now-empty node, and that's a cluster autoscaler's or [Karpenter's](/en/posts/karpenter-vs-cluster-autoscaler) job, not KEDA's. Pairing the two is what actually turns pod-level scale-to-zero into a lower cloud bill: KEDA removes the pods, Karpenter right-sizes and removes the underlying nodes, and you stop paying for either layer when there's genuinely nothing running.

| Tool | Scales | Signal | Scale-to-zero |
|---|---|---|---|
| Kubernetes HPA | Pods | CPU/memory % | No — floor of 1 replica |
| KEDA | Pods | Queue depth, cron, custom metrics | Yes |
| kube-downscaler | Pods (via replica count) | Fixed time window | Yes |
| Karpenter / Cluster Autoscaler | Nodes | Unscheduled pods | Yes, at the node level |

## What guardrails keep scale-to-zero from breaking your SLOs?

Scaling to zero trades idle cost for a cold start: the first request after a quiet period waits for a pod to schedule, pull its image, and pass readiness checks, which can run from a few hundred milliseconds to tens of seconds depending on image size and startup work. Before you set `minReplicaCount: 0` on anything user-facing, check the latency budget in its SLO — a background queue worker can usually absorb a cold start that a synchronous API endpoint cannot.

A practical middle ground is `minReplicaCount: 1` with a low `cooldownPeriod`, which still lets you shed every replica above the floor the moment the queue is empty, rather than scaling that one path all the way to zero. Reserve true scale-to-zero for workloads with slack in their response-time budget, and keep it off anything a dashboard or a customer is waiting on synchronously.

## How do you find idle spend before fixing it?

Scale-to-zero only pays off on workloads that are actually idle a meaningful share of the time, so start with namespace- or pod-level cost attribution rather than guessing. Most [Kubernetes cost optimization](/en/posts/kubernetes-cost-optimization) work starts here: tag workloads by team and environment, pull a week of actual CPU/memory requests versus usage, and rank by the gap between what's reserved and what's used. The namespaces with the largest gap are where a `ScaledObject` or a downscaler will show up on next month's bill — everywhere else, the tuning effort usually isn't worth it. If you haven't settled on a node autoscaler yet, [Karpenter vs. Cluster Autoscaler](/en/posts/karpenter-vs-cluster-autoscaler) and the broader [Kubernetes autoscaling guide](/en/posts/kubernetes-autoscaling-guide) are the right next reads before you touch KEDA's own configuration.

My honest take: KEDA gets credited as a "cost tool," but it's really a correctness fix — most clusters are scaling pods on CPU percentage when the thing that actually drives load is a queue or a clock, and that mismatch is where the idle spend comes from in the first place.

Primary sources: [keda.sh](https://keda.sh/), [Microsoft Learn's KEDA guidance for AKS](https://learn.microsoft.com/azure/aks/keda-about), and [Cast AI's Kubernetes GPU optimization research](https://cast.ai/blog/kubernetes-gpu-optimization/).

## Frequently Asked Questions

### Does KEDA replace the Kubernetes Horizontal Pod Autoscaler?

No. KEDA doesn't replace the HPA — it generates and manages HPA objects under the hood and feeds them event-driven metrics, like queue depth or a cron schedule, that the HPA can't read on its own. The HPA still does the actual scaling; KEDA decides when and by how much.

### Can KEDA scale a workload all the way to zero replicas?

Yes, for Deployments, Jobs, and StatefulSets, which is the one thing the standard HPA cannot do — Kubernetes' built-in HPA always keeps at least one replica running. Set `minReplicaCount: 0` on a `ScaledObject` to allow a full scale-down when there's no event to process.

### What's the difference between KEDA and kube-downscaler?

KEDA scales based on a real event signal — queue depth, Kafka lag, a custom metric, or a cron expression tied to the workload itself. kube-downscaler instead scales replicas down on a fixed time window, which fits non-production environments that don't have a meaningful event source but still shouldn't run 24/7.

### Will scaling to zero hurt my application's latency?

It can. The first request after a scale-to-zero period pays a cold-start cost — pod scheduling, image pull, and readiness checks — that can range from under a second to tens of seconds. Keep `minReplicaCount` at 1 or higher for latency-sensitive, synchronous endpoints, and reserve true scale-to-zero for background and batch workloads with slack in their response-time budget.
