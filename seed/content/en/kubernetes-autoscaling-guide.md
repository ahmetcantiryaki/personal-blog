---
title: "Kubernetes Autoscaling: HPA, VPA, and CA"
slug: "kubernetes-autoscaling-guide"
translationKey: "kubernetes-autoscaling-guide"
locale: "en"
excerpt: "How to combine HPA, VPA, and Cluster Autoscaler without them fighting each other, why same-metric setups spiral, and what it costs to get wrong."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "devops", "automation"]
publishedAt: "2026-07-13"
seoTitle: "Kubernetes Autoscaling Guide: HPA, VPA, CA"
seoDescription: "How to combine HPA, VPA, and Cluster Autoscaler without them fighting each other, why same-metric setups spiral, and the cost trade-offs to expect."
---

HPA scales pod count, VPA resizes each pod's CPU and memory requests, and Cluster Autoscaler scales node count. Combine them carelessly, especially by pointing HPA and VPA at the same metric, and you get an oscillating feedback loop instead of stable scaling. Here's how each piece works and how to wire them together safely, with the data behind each recommendation.

## What does HPA scale, and on what signal?

The Horizontal Pod Autoscaler adjusts the replica count of a deployment or statefulset based on a chosen metric. By default it watches CPU or memory utilization, but it can also target custom or external metrics, such as requests-per-second pulled through a Prometheus adapter, when utilization alone doesn't reflect real load. The logic is straightforward: cross the target threshold and a new pod is added; drop below it and replicas are removed.

Adoption is already mainstream. Roughly 64% of organizations running Kubernetes have adopted HPA in production. What's more telling is what happens after adoption: 86% of HPA adopters apply it across most of their clusters, and nearly half use it in every cluster they run. HPA isn't a niche feature teams dabble with — once adopted, it becomes foundational infrastructure. Meanwhile, 46% of unscaled workloads experience multiple significant CPU spikes per day, which marks a large pool of teams that would benefit from horizontal scaling but haven't turned it on yet. Cast.ai's [breakdown of HPA adoption and savings](https://cast.ai/blog/what-is-kubernetes-hpa-and-how-can-it-help-you-save-on-the-cloud/) frames this as one of the lowest-risk first moves a team can make toward both performance headroom and cost control.

A minimal HPA manifest looks like this:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
```

## What does VPA scale, and how?

The Vertical Pod Autoscaler doesn't touch replica count at all. Instead, it right-sizes each container's CPU and memory requests and limits based on historical usage, either recommending new values or applying them automatically. Most teams set initial requests as a guess — 500m CPU, 1Gi memory — and never revisit them. VPA replaces that guess with data, and it routinely surfaces resources that were over-provisioned from day one.

The lowest-risk way to run VPA is in "Off," or recommendation-only, mode: it changes nothing live, it just tells you "this container needs 250m CPU, not 500m." Here's the opinionated part: most teams spend disproportionate effort fine-tuning HPA thresholds while overlooking that running VPA in recommendation-only mode alone would surface more waste with far less operational risk than deploying a full HPA-plus-VPA combination. Recommendation mode never touches production traffic; it just produces a report. Getting a live HPA+VPA combination right, by contrast, takes hours of careful observation and testing.

## How does Cluster Autoscaler scale nodes?

Cluster Autoscaler (CA) scales neither pod count nor pod size — it scales the number of nodes. Its trigger signal is simple: unschedulable pods. When existing nodes can't fit new pods, CA provisions additional nodes; when nodes sit underused for long enough and their pods can be moved elsewhere, it removes nodes. HPA and VPA operate at the pod level, while CA supplies the physical (or virtual) capacity those pods run on. In practice the three work as a chain: HPA or VPA decides a pod needs more room, that pod becomes unschedulable, and CA responds by adding a node.

## Why do HPA and VPA fight when they share a metric?

Kubernetes community guidance is explicit on this point: never run HPA and VPA on the same resource metric, such as both scaling on CPU. Here's the mechanism. VPA raises a container's CPU request. That inflates the denominator of the utilization ratio, so the utilization percentage drops. HPA sees that lower utilization and scales replicas down. Fewer replicas means each remaining pod absorbs more real traffic, so utilization climbs back up. VPA sees the higher utilization and raises the CPU request again. The loop restarts.

Framed precisely: HPA operates on the numerator of the utilization ratio, while VPA operates on the denominator. Run both on the same signal and each one keeps pulling the ground out from under the other. The community has nicknamed this oscillation the "Kubernetes death spiral," and [GitHub issue 6247 on kubernetes/autoscaler](https://github.com/kubernetes/autoscaler/issues/6247) documents the behavior with real cluster traces. ScaleOps' [analysis of HPA's architectural flaws](https://scaleops.com/blog/hpas-three-architectural-flaws-and-why-your-autoscaling-keeps-failing/) points out that much of this comes from HPA being designed as if it always operates in isolation.

There are two safe combinations. First: run HPA on a custom or external metric, such as requests-per-second, while letting VPA independently adjust CPU and memory requests — since the two are reading different signals, they don't compete. Second: keep VPA in "Off" or recommendation-only mode and let HPA handle all live autoscaling on CPU or memory. OneUptime's [guide to running VPA and HPA together](https://oneuptime.com/blog/post/2026-02-09-vpa-hpa-together-cpu-memory-autoscaling/view) walks through both patterns with concrete examples.

## Custom metrics and the cost angle

CPU-based scaling doesn't always capture the right signal — an API call waiting on I/O can keep CPU low while latency still climbs. External metrics such as requests-per-second, queue depth, or latency percentiles track real user experience more closely. As we cover in [Kubernetes cost optimization](/en/posts/kubernetes-cost-optimization), scaling on the wrong signal drives both over-provisioning (wasted spend) and under-provisioning (dropped performance) at the same time. VPA recommendations alone typically surface 20–40% of over-provisioned capacity, and unlocking that saving doesn't require a full autoscaling rollout — just turning on recommendation mode. Our [FinOps guide to reducing cloud costs](/en/posts/finops-reduce-cloud-costs) makes the case for prioritizing exactly this kind of low-risk win first.

## Keeping autoscaling fair across teams

When multiple teams share a cluster, one team's aggressive HPA or VPA configuration can starve the others of capacity. Namespace-level ResourceQuotas cap each team's total CPU and memory footprint, so autoscaling stays fair instead of turning into a race for shared nodes. It's one of the setup steps we see skipped most often, alongside other issues covered in [Kubernetes mistakes to avoid](/en/posts/kubernetes-mistakes-to-avoid). Teams standardizing configuration across namespaces should also check our [guide to cloud secrets management done right](/en/posts/cloud-secrets-management-done-right).

As of July 2026, the trend across the ecosystem is clear: teams are treating HPA as a default and redirecting their energy toward reading VPA's recommendation output to eliminate waste, rather than endlessly tuning thresholds. For more on this space, see our [DevOps & Cloud category](/en/category/devops-cloud).

## Decision matrix

| Tool | What it scales | Trigger signal | Safe combination notes |
|---|---|---|---|
| HPA | Pod replica count | CPU/memory utilization or custom/external metric (RPS, etc.) | Don't run on the same metric as VPA; use a different metric or keep VPA in recommendation mode |
| VPA | Container CPU/memory requests and limits | Historical usage data | Conflicts with HPA on the same metric; "Off" mode is safest, or pair with HPA on a different metric |
| Cluster Autoscaler | Node count | Unschedulable pods | Doesn't directly conflict with HPA/VPA; acts as the capacity layer beneath both |

## Frequently Asked Questions

### Can I never use HPA and VPA together at all?

You can, just not on the same metric. Running HPA on a custom metric like RPS while VPA independently adjusts CPU and memory requests is safe, and so is keeping VPA in recommendation-only mode while HPA does the live scaling.

### Is Cluster Autoscaler useful without HPA or VPA?

Yes. CA only reacts to unschedulable pods, so it still adds capacity if replicas are scaled manually or by another scheduler. In practice, though, it's usually paired with HPA, since replica growth is what most often creates the node demand CA responds to.

### Why is recommendation-only VPA safer?

Because it never restarts a live pod or changes a resource request; it only produces a report based on historical usage. Teams can review that report and apply changes manually or gradually, which keeps production risk close to zero.

### What happens without ResourceQuotas in a shared cluster?

Without a namespace-level ceiling, one team's HPA scaling to its max replica count can consume the shared node pool, leaving other teams' pods unschedulable. ResourceQuotas guarantee that fairness at the namespace level.
