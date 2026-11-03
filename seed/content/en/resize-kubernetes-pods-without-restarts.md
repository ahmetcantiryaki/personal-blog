---
title: "Resize Kubernetes Pods Without Restarts"
slug: "resize-kubernetes-pods-without-restarts"
translationKey: "kubernetes-in-place-pod-resize-2026"
locale: "en"
excerpt: "Kubernetes 1.35 made in-place pod resize stable, so you can now change a running pod's CPU and memory requests without ever restarting its containers."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "performance", "containers"]
publishedAt: "2026-11-03"
seoTitle: "Resize Kubernetes Pods Without Restarts (2026)"
seoDescription: "In-place pod resize went stable in Kubernetes 1.35. Here is how resizePolicy, the resize subresource, and VPA work, and when you still need a restart."
---

Short answer: as of Kubernetes v1.35 (stable since December 19, 2025), you can change a running pod's CPU and memory requests and limits through the pod's `resize` subresource, and the kubelet applies the change live for most CPU edits without restarting the container. Memory decreases, swap, and the static CPU/Memory Manager policies are the cases where you still need a restart or can't resize at all.

## What changed in Kubernetes 1.35?

Before 1.35, a pod's CPU and memory requests and limits were immutable after creation — the only way to "rightsize" a running workload was to delete and recreate the pod, which meant a restart, a scheduling round-trip, and a few seconds to minutes of disruption depending on your readiness probes. In-place Pod Resize (its official KEP name is "In-Place Update of Pod Resources") went alpha in v1.27, beta in v1.33, and stable in v1.35, nearly 11 months ago as of this writing. The feature makes `resources.requests` and `resources.limits` mutable fields you patch through a dedicated `resize` subresource, so the pod object itself never gets torn down just to change its resource envelope.

That single change removes the main cost of rightsizing: before, every adjustment you made based on observed usage carried a restart penalty, so teams either over-provisioned permanently to avoid frequent restarts, or tolerated OOMKills and CPU throttling rather than resize often. With in-place resize, the restart cost mostly disappears for CPU changes, so you can afford to rightsize weekly or even on a tighter loop instead of once a quarter.

## How do you actually trigger a resize?

You patch the pod's resources through the `resize` subresource, not the regular pod spec endpoint — the main spec stays mostly immutable, but Kubernetes added this subresource specifically to carry resize requests. In practice:

```bash
kubectl patch pod my-app-7f9c7d6b9-x2kqp \
  --subresource resize \
  --patch '{"spec":{"containers":[{"name":"my-app","resources":{"requests":{"cpu":"500m"},"limits":{"cpu":"1"}}}]}}'
```

The API server validates and stores the new desired values immediately, then the kubelet on the node reconciles the actual container cgroup limits — that reconciliation is where `resizePolicy` decides whether your container keeps running or gets restarted.

## Does resizing memory still restart the container?

It depends on the resource, the direction, and your container runtime, but as a working rule: CPU changes in either direction and memory increases are the cases most likely to apply without a restart, while memory decreases are the case most likely to still restart the container. You set this explicitly per container and per resource with `resizePolicy`, where each entry takes `restartPolicy: NotRequired` or `restartPolicy: RestartContainer`:

```yaml
containers:
  - name: my-app
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
      limits:
        cpu: "1"
        memory: "1Gi"
    resizePolicy:
      - resourceName: cpu
        restartPolicy: NotRequired
      - resourceName: memory
        restartPolicy: RestartContainer
```

| Change | Typical outcome | Why |
|---|---|---|
| CPU increase or decrease | Applied in place, no restart | cgroup CPU shares/quota update cleanly on most runtimes |
| Memory increase | Usually applied in place | Raising a cgroup memory ceiling is low-risk |
| Memory decrease | Often restarts the container | Shrinking below current usage risks an immediate OOM inside the container; many runtimes treat this as unsafe to do live |
| Non-CPU/memory resources (e.g. ephemeral-storage) | Not resizable | Still immutable after pod creation at GA |

My take: don't trust the "memory decrease restarts" behavior blindly across every runtime and `resizePolicy` setting — test it against your actual container images and runtime (containerd, CRI-O) before you depend on it in a latency-sensitive service, since the exact behavior at the edge of your memory ceiling is where surprises happen.

## When can't you use in-place resize at all?

In-place resize is explicitly excluded in three situations as of GA: pods using swap, pods pinned under the static CPU Manager policy, and pods under the static Memory Manager policy. If any of those apply to a workload, you're back to the old delete-and-recreate rightsizing path for it. Windows node pools are also excluded from this feature. Outside those cases, the main limitation is scope — only CPU and memory are resizable; other resource types stay immutable for the life of the pod.

## What about resizing the whole pod instead of each container?

Kubernetes v1.36, announced April 30, 2026, added pod-level in-place vertical scaling as a beta feature, which lets you resize at the pod's own resource envelope instead of patching each container individually. One detail matters here: `resizePolicy` isn't supported at the pod level — the kubelet still looks at each container's own `resizePolicy` to decide restart-or-not, even when the resize request came in as a pod-level change. So a pod-level resize is a convenience for the request, not a way around the per-container restart rules above.

## Should you combine this with the Vertical Pod Autoscaler?

Yes, if your goal is to stop manually rightsizing altogether — VPA support for the `InPlaceOrRecreate` update mode reached beta alongside the 1.35 GA announcement, meaning VPA can issue in-place resize requests based on observed usage instead of only recommending values for a human to apply or forcing a full pod recreate. The rollout pattern that works in practice: run VPA in recommendation-only mode for a couple of weeks to see what it would change, switch a non-critical workload to `InPlaceOrRecreate`, and watch for the same restart edge cases (memory decreases, static manager conflicts) that apply to manual resizes.

## What should you watch out for before rolling this out?

The GA announcement itself flags a known rough edge: race conditions between the kubelet and the scheduler, where a resize that increases a pod's requests can momentarily disagree with the scheduler's view of how much capacity the node has left. This is rare but worth testing under load before you lean on frequent resizes in a tightly packed cluster — see [Kubernetes cost optimization: 10 tactics](/en/posts/kubernetes-cost-optimization) for the broader context on bin-packing trade-offs this interacts with.

A short rollout checklist that has worked for teams adopting this:

1. Confirm your cluster is on 1.35+ and check whether any workloads use swap or the static CPU/Memory Manager — those stay on the old restart-based path.
2. Set explicit `resizePolicy` per container instead of relying on defaults, so restart behavior is a decision you made, not one you discovered in production.
3. Start with CPU-only resizes on a handful of services, measure the restart rate (should be near zero), then extend to memory increases.
4. Treat memory decreases as "restart expected" until you've tested your specific runtime and image, and track actual node CPU/memory utilization before and after to quantify the savings — this is the number that justifies the rollout to anyone asking why it matters. For how that number feeds into billing, see [Kubernetes FinOps: how to cut your cloud bill](/en/posts/kubernetes-finops-cost-optimization).

If you're also tuning autoscaling policy — not just per-pod sizing — the horizontal and vertical pieces are explained together in [Kubernetes autoscaling: HPA, VPA, and CA](/en/posts/kubernetes-autoscaling-guide).

## Frequently Asked Questions

### When did Kubernetes in-place pod resize become stable?

In-place pod resize graduated to stable (GA) in Kubernetes v1.35, announced on the official Kubernetes blog on December 19, 2025. It had been alpha since v1.27 and beta since v1.33, so GA followed roughly eight release cycles of iteration.

### Can you resize memory without restarting a pod?

Sometimes. Memory increases are usually applied in place without a restart, but memory decreases often still restart the container because shrinking the memory ceiling below current usage risks an immediate out-of-memory condition. The exact behavior depends on the container's `resizePolicy` setting and the runtime, so test it before relying on it.

### Does in-place resize work with the Vertical Pod Autoscaler?

Yes. VPA support for the `InPlaceOrRecreate` update mode reached beta alongside the Kubernetes 1.35 GA announcement, letting VPA trigger an in-place resize based on observed usage instead of only recommending values or forcing a pod recreate.

### Which workloads can't use in-place pod resize?

Pods that use swap, or that are pinned under the static CPU Manager or static Memory Manager policies, are excluded from in-place resize as of GA. Windows node pools are also excluded. Those workloads still need the old delete-and-recreate approach to change their resource requests or limits.
