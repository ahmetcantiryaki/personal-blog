---
title: "How Do You Resize Pods in Kubernetes 1.35?"
slug: "kubernetes-in-place-pod-resize"
translationKey: "k8s-in-place-pod-resize-2026"
locale: "en"
excerpt: "Kubernetes 1.35 lets you change a running pod's CPU and memory limits without a restart; the feature reached GA in December 2025 and is production-ready today."
category: "devops-cloud"
tags: ["kubernetes", "devops", "cost-optimization", "reliability"]
publishedAt: "2026-11-21"
seoTitle: "Kubernetes 1.35 In-Place Pod Resize Guide"
seoDescription: "Kubernetes 1.35 lets you change a running pod's CPU and memory limits without a restart; the feature reached GA in December 2025 and is production-ready today."
---

Short answer: as of Kubernetes 1.35, you can change a running pod's CPU and memory requests and limits without restarting it. This capability, called in-place pod resize, became generally available (GA) in Kubernetes 1.35, released December 17, 2025. Before this, the only way to change a pod's resource allocation was to delete and recreate it.

## What is in-place pod resize?

In-place pod resize is the ability to change a running container's CPU and memory resource settings without evicting or recreating the pod. The process inside the container keeps running, so local disk state and in-memory caches survive the change.

Previously, Kubernetes could only change a pod's resource allocation by tearing it down, the same way the Vertical Pod Autoscaler's (VPA) "Recreate" mode works. That meant every resize caused a short outage and forced clients to reconnect. In-place resize removes that step entirely.

## When did this feature reach GA?

In-place pod resize graduated to stable (GA) in Kubernetes 1.35 on December 17, 2025, confirmed by an official Kubernetes blog post published December 19, 2025. The feature started as alpha in Kubernetes 1.27, moved to beta in Kubernetes 1.33, and reached GA in 1.35.

| Stage | Kubernetes version | Status |
|---|---|---|
| Alpha | v1.27 | Off by default, behind a feature gate |
| Beta | v1.33 | Enabled by default on most clusters |
| GA (stable) | v1.35 (December 17, 2025) | Recommended for production use |

As of November 2026, this is not breaking news. It has been stable for roughly eleven months and is safe to rely on in production clusters today.

## How do you perform an in-place resize?

You patch the pod's `resize` subresource with `kubectl`, specifying the new CPU or memory values. The example below raises the memory limit on a running pod:

```bash
kubectl patch pod my-stateful-app --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app","resources":{"limits":{"memory":"2Gi"}}}]}}'

# Note: verify the exact flag and subresource syntax against the
# Kubernetes docs before running this in production; minor
# differences exist across kubectl versions.
```

To control whether a container restarts when a specific resource changes, set `resizePolicy` in the pod manifest:

```yaml
spec:
  containers:
    - name: app
      resizePolicy:
        - resourceName: cpu
          restartPolicy: NotRequired
        - resourceName: memory
          restartPolicy: NotRequired
```

`restartPolicy: NotRequired` tells Kubernetes the container does not need to restart when that resource changes. Some changes, such as lowering a memory limit below current usage, can still trigger a restart for safety reasons.

## Which workloads benefit most from this feature?

Stateful workloads that cannot easily scale horizontally, such as databases, long-warm-up JVM applications, and in-memory caches, gain the most from in-place resize. These workloads can now grow or shrink vertically on the same pod instead of starting cold in a brand-new one.

A Redis pod facing an upcoming traffic spike can have its memory limit raised, manually or through the VPA, without losing its warm cache. Teams focused on tighter resource usage will find this fits directly into a broader [Kubernetes cost optimization](/en/posts/kubernetes-cost-optimization) strategy.

## What prerequisites does in-place resize need?

In-place pod resize requires the node's container runtime to support cgroup v2. Most current managed node images default to cgroup v2 already, but older nodes still running cgroup v1 cannot use this feature. Do not assume your cluster meets this requirement; verify the cgroup version on your own nodes, since it depends on the node operating system image and kernel version.

## How does this relate to VPA and Kubernetes 1.36?

In-place pod resize is an API capability you or an automation tool trigger at the container level; having the Vertical Pod Autoscaler use it automatically is a separate, ongoing effort. The VPA's "InPlaceOrRecreate" update mode has graduated to beta, with the eventual goal of letting VPA resize pods in place instead of evicting and recreating them.

There is an important distinction here: Kubernetes 1.36 introduced a separate beta feature called "in-place vertical scaling for pod-level resources," which is narrower and newer than the container-level resize that went GA in 1.35. Do not conflate the two. The 1.35 GA announcement covers container-level resources; the 1.36 beta covers pod-level resources behind its own feature gate.

If you are reviewing your broader autoscaling setup, see the [Kubernetes autoscaling guide](/en/posts/kubernetes-autoscaling-guide) and, for node-level scaling choices, [Karpenter vs. Cluster Autoscaler](/en/posts/karpenter-vs-cluster-autoscaler).

## How does manual resize compare with HPA and VPA modes?

| Method | Downtime | Best suited for |
|---|---|---|
| HPA (Horizontal Pod Autoscaler) | None (adds new pods) | Stateless services that scale horizontally |
| VPA – Recreate mode | Yes (pod is deleted and recreated) | Vertically scaled workloads that tolerate brief disruption |
| VPA – InPlaceOrRecreate (beta) | Usually none | Teams who want automatic, disruption-free vertical scaling |
| Manual in-place resize (GA, v1.35) | None | Databases, cache layers, controlled manual tuning |

The most useful row in that table is the third one. VPA's "InPlaceOrRecreate" mode is still beta, but it is the real path toward automatic, disruption-free vertical scaling, so teams should plan around it rather than treat manual `kubectl patch` calls as a long-term workflow. Manual resize is production-ready today; its full value shows up once it is paired with automation.

Getting pod-level resource management right also depends on efficient container images, which is where [Docker best practices for production](/en/posts/docker-best-practices-production) comes in. Teams questioning whether they need the platform at all may also want [Do you still need Kubernetes in 2026?](/en/posts/do-you-still-need-kubernetes-2026) for a different angle.

For deeper technical detail, see the official [Kubernetes 1.35 GA announcement](https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/), the [v1.35 release blog post](https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/), and the [resize-pod-resources documentation](https://kubernetes.io/docs/tasks/configure-pod-container/resize-pod-resources/).

## Frequently Asked Questions

### How do you resize a pod in Kubernetes without restarting it?

You patch the pod's `resize` subresource with `kubectl`, updating the `resources.limits` or `resources.requests` fields for a container. As of Kubernetes 1.35, if the container's `resizePolicy` is set to `NotRequired` for that resource, the change takes effect without restarting the container.

### Which Kubernetes version made in-place pod resize GA?

In-place pod resize reached GA (stable) status in Kubernetes 1.35, released December 17, 2025, as confirmed by an official Kubernetes blog post published December 19, 2025. The feature had previously gone through alpha in v1.27 and beta in v1.33.

### Does in-place resize work on every node?

No, in-place pod resize requires the node's container runtime to support cgroup v2. Most current managed node images use cgroup v2 by default, but older or custom-configured nodes may still run cgroup v1, where the feature is unavailable, so you need to verify this on your own cluster.

### Can the Vertical Pod Autoscaler resize pods without recreating them?

Yes, but this is still a beta capability. The VPA's "InPlaceOrRecreate" update mode uses the in-place resize API to scale pods vertically instead of evicting and recreating them. As of November 2026, this mode is in beta and represents the path toward fully automatic, disruption-free vertical scaling.
