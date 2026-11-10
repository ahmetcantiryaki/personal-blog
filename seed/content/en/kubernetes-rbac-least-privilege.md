---
title: "How Do You Apply Least Privilege in Kubernetes RBAC?"
slug: "kubernetes-rbac-least-privilege"
translationKey: "kubernetes-rbac-least-privilege"
locale: "en"
excerpt: "Short answer: never bind cluster-admin to a workload, write explicit verbs instead of verbs: [\"*\"], and give each workload its own ServiceAccount."
category: "devops-cloud"
tags: ["kubernetes", "container-security", "devops", "best-practices"]
publishedAt: "2026-11-10"
seoTitle: "Kubernetes RBAC Least Privilege Guide (Nov 2026)"
seoDescription: "How to apply least privilege in Kubernetes RBAC: Role vs ClusterRole, ServiceAccount token risks, auditing with kubectl auth can-i, and a ready-made manifest."
---

Short answer: never bind `cluster-admin` to a workload, write explicit verbs (`get`, `list`, `watch`) instead of `verbs: ["*"]`, and give every workload its own dedicated ServiceAccount instead of letting it fall back to the namespace default. As of November 2026, those three rules alone close most of the RBAC misconfigurations we actually see in the wild.

RBAC (Role-Based Access Control) defines which API operations each user and workload can perform on which resources in your cluster. Get it wrong, and a single compromised pod can read every Secret across every namespace it can reach.

## Role vs ClusterRole: Which Do You Need?

Short answer: use a `Role` + `RoleBinding` when a user or workload only needs access inside one namespace; use a `ClusterRole` when you need access to cluster-scoped resources (Nodes, PersistentVolumes) or across multiple namespaces.

A `Role` is namespace-scoped and binds to a subject through a `RoleBinding`. A `ClusterRole` is defined cluster-wide and can be bound either cluster-wide via a `ClusterRoleBinding`, or namespace-by-namespace via a `RoleBinding` — the second pattern lets you reuse the same ClusterRole across many namespaces without redefining it each time.

Per Kubernetes' own API reference, a `ClusterRole` can also be "aggregated" via the `aggregationRule` field: you set label selectors under `clusterRoleSelectors`, and the controller automatically copies in the rules from any other ClusterRole that matches those labels. While aggregation is active, manual edits to the `rules` field get overwritten by the controller — so you change the label, not the rules, when you want to add permissions to an aggregated role.

## What Are the Three Most Common Over-Grant Mistakes?

Short answer: binding `cluster-admin` to a workload, using a wildcard like `verbs: ["*"]` or `resources: ["*"]`, and relying on the namespace's default ServiceAccount — all three are the usual answer to "why can this pod do everything?" during an incident review.

| Over-grant | Least-privilege fix |
| --- | --- |
| `cluster-admin` bound to a Deployment | A scoped `Role` covering only the namespace and resources it needs |
| `verbs: ["*"]` or `resources: ["*"]` | An explicit verb list: `get`, `list`, `watch` |
| Using the default ServiceAccount | A dedicated, single-purpose ServiceAccount per workload |
| Auto-mounting a token on every pod | `automountServiceAccountToken: false` on pods that never call the API |

The third row gets skipped most often because the Kubernetes default is already safer than people assume: since Kubernetes 1.22, the kubelet mounts a short-lived, audience-bound, auto-rotated projected token instead of the old indefinite Secret-based token. That cuts down the old "leak one token, own the cluster forever" risk — but the token still carries every RBAC permission granted to that pod's ServiceAccount, so an over-privileged ServiceAccount is still exactly as dangerous as before.

## Why Is the Default ServiceAccount a Risk?

Short answer: every namespace has its own `default` ServiceAccount, and any pod that doesn't specify otherwise is bound to it automatically — if you accidentally attach a broad Role to that ServiceAccount, every pod in the namespace inherits it.

The practical rule: never create a RoleBinding against the `default` ServiceAccount. Instead, create a named, single-purpose ServiceAccount per workload (`log-shipper-sa`, `metrics-reader-sa`) and bind RBAC to that account specifically. For pods that never talk to the API server at all — most ordinary web services — skip the token mount entirely:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: metrics-reader-sa
  namespace: observability
automountServiceAccountToken: false
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: configmap-secret-reader
  namespace: observability
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: metrics-reader-binding
  namespace: observability
subjects:
  - kind: ServiceAccount
    name: metrics-reader-sa
    namespace: observability
roleRef:
  kind: Role
  name: configmap-secret-reader
  apiGroup: rbac.authorization.k8s.io
```

This manifest guarantees `metrics-reader-sa` can only read ConfigMaps and Secrets inside the `observability` namespace, with no reach into any other namespace or cluster-scoped resource — if the token leaks, the attacker is stuck with exactly that narrow surface.

## How Do You Audit RBAC With kubectl auth can-i?

Short answer: `kubectl auth can-i <verb> <resource> --as=<subject> -n <namespace>` returns an instant yes/no for whether that subject can perform a specific action, and `--list` dumps every permission a subject has in that namespace in one shot.

```bash
# Can this specific ServiceAccount delete secrets?
kubectl auth can-i delete secrets \
  --as=system:serviceaccount:observability:metrics-reader-sa \
  -n observability

# List EVERY permission that ServiceAccount has in the namespace
kubectl auth can-i --list \
  --as=system:serviceaccount:observability:metrics-reader-sa \
  -n observability
```

If you want to scan the whole cluster instead of checking subjects one at a time, community tools like `rbac-tool` (Alcide) or `kubectl-who-can` query in the other direction — "who can delete this Secret?" — directly. Running that scan as a weekly CI step catches a new Helm chart quietly requesting `cluster-admin` before it ever merges.

## How Does RBAC Fit With Namespace Isolation and Admission Policy?

Short answer: RBAC alone isn't enough — it answers who can call which API, not whether a pod can run a given image or request `hostNetwork`, so you still need NetworkPolicy for namespace isolation and an admission controller like OPA Gatekeeper or Kyverno for runtime rules.

For the full RBAC-plus-admission-policy setup, our [OPA vs Kyverno comparison](/en/posts/policy-as-code-opa-vs-kyverno) covers the trade-offs between the two in detail, so we won't repeat it here. If you also want to revisit how Secrets themselves are stored cluster-wide, see our [cloud secrets management guide](/en/posts/cloud-secrets-management-done-right). And if you're running an autoscaling cluster and wondering how RBAC behaves as new nodes join, check our [Kubernetes autoscaling guide](/en/posts/kubernetes-autoscaling-guide).

Honestly, this is the audit teams skip most: binding `cluster-admin` to a workload ServiceAccount is the single most common — and most dangerous — Kubernetes misconfiguration, and almost no team scans for it on a recurring basis. Every other piece of RBAC hygiene, from wildcard verbs to default ServiceAccounts, matters less than catching that one.

For more on cluster operations, browse our [DevOps & Cloud category](/en/category/devops-cloud), and see [10 Kubernetes Mistakes to Avoid](/en/posts/kubernetes-mistakes-to-avoid) for other common pitfalls.

## Frequently Asked Questions

### What's the difference between Role and ClusterRole in Kubernetes?

A Role is namespace-scoped and can only grant permissions on resources inside that one namespace. A ClusterRole is defined cluster-wide, which you need for cluster-scoped resources like Nodes and PersistentVolumes, or to reuse the same rule set across multiple namespaces without redefining it each time.

### Does the ServiceAccount token auto-rotate now?

Yes. Since Kubernetes 1.22, the default behavior mounts a short-lived, audience-bound, auto-rotated projected token instead of the old indefinite Secret-based token. That shortens how long a leaked token stays useful, but it does not limit the RBAC permissions that token still carries.

### Does kubectl auth can-i test real API server behavior?

Yes, `kubectl auth can-i` queries the API server's actual authorization layer and returns what that subject can really do — it's not a simulation, it's a live query against your current RBAC rules. Use `--as` to check as a different user or ServiceAccount, and `--list` to dump the full permission set at once.

### Does giving every pod its own ServiceAccount create extra operational overhead?

A little at first, but it's low: the ServiceAccount, Role, and RoleBinding manifests for a workload are usually added once to a Helm chart template and then generated automatically from then on. That overhead is trivial compared to the "one compromised pod puts the whole namespace at risk" scenario that sharing the default ServiceAccount creates.
