---
title: "How Do You Lock Down Kubernetes with Pod Security?"
slug: "kubernetes-pod-security-admission"
translationKey: "kubernetes-pod-security-admission-2026"
locale: "en"
excerpt: "Short answer: enable Pod Security Admission's restricted profile with one namespace label; it rejects root containers and extra Linux capabilities."
category: "devops-cloud"
tags: ["kubernetes", "container-security", "devops", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Kubernetes Pod Security Admission Guide 2026"
seoDescription: "Enable Pod Security Admission with one namespace label, see what the restricted profile actually blocks, and know when Kyverno is still needed, as of Nov 2026."
---

Short answer: Pod Security Admission (PSA), Kubernetes' built-in admission controller, turns on with a single namespace label; in `restricted` mode, it rejects any pod that runs as root, mounts a writable root filesystem, or carries unnecessary Linux capabilities — no extra policy engine required.

Most teams skip straight past this and reach for a service mesh or a heavyweight policy engine like OPA or Kyverno. But Kubernetes has shipped a built-in baseline since version 1.25, with zero extra components to install. The problem usually isn't a missing tool — it's that this one never gets turned on.

## What is Pod Security Admission?

Pod Security Admission is an in-tree admission controller that enforces the three fixed Pod Security Standards profiles — `privileged`, `baseline`, and `restricted` — at the namespace level. It's the direct, built-in replacement for PodSecurityPolicy (PSP), which was deprecated in 2021 and fully removed in Kubernetes 1.25. Per the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/security/pod-security-admission/), PSA has been stable and the recommended default baseline since that release, and remains so as of November 2026.

The key difference from PSP: PSA can't mutate a pod before validating it, and it only operates at namespace granularity — you can't write a custom rule for one specific pod or deployment. Everything in a namespace is held to the same profile.

## Baseline or restricted — what's the difference?

The `baseline` profile only blocks known privilege-escalation paths: privileged containers, host namespace sharing, and a short list of dangerous capabilities. `restricted` goes further and positively enforces a pod's security context: non-root user, all capabilities dropped, privilege escalation disabled, and a seccomp profile set. The `privileged` profile applies no restrictions at all — it's a deliberate "leave this namespace fully open" setting, not a default.

| Profile | What it blocks | Typical use |
|---|---|---|
| `privileged` | Nothing | System components (CNI, CSI drivers) |
| `baseline` | Privileged containers, host namespaces, known dangerous capabilities | Transition period, legacy apps |
| `restricted` | Running as root, writable root filesystem, extra capabilities, privilege escalation, missing seccomp | New production workloads |

## How do you enforce a profile on a namespace?

You add three independent labels: `enforce` (rejects violating pods), `audit` (logs a violation without blocking it), and `warn` (shows a warning to the user without blocking it). Each mode works independently, and you can combine different levels in the same namespace.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: payments
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: v1.34
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted
```

You can also apply it to an existing namespace with one command:

```bash
kubectl label --overwrite ns payments pod-security.kubernetes.io/enforce=restricted
```

The `-version` suffix is optional but pins which Kubernetes release's profile definition applies; skip it and the profile's exact scope can quietly shift when the cluster is upgraded.

## What exactly does the restricted profile block?

`restricted` requires `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, all Linux capabilities dropped (`drop: ["ALL"]`) with only the specific ones you need added back, a read-only root filesystem (`readOnlyRootFilesystem: true`), and a `RuntimeDefault` or custom seccomp profile defined. Miss any one of these five conditions and the pod is rejected at admission — before it ever starts.

This is the root fix for the "container running as root" mistake covered in [10 Kubernetes Mistakes to Avoid](/en/posts/kubernetes-mistakes-to-avoid), where it gets one paragraph; here we go deeper on the namespace label itself. A minimal pod spec that actually clears all five checks looks like this:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
  namespace: payments
spec:
  containers:
    - name: web
      image: example/web:1.4.0
      securityContext:
        runAsNonRoot: true
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
        seccompProfile:
          type: RuntimeDefault
```

Drop any one of those five fields and the `restricted` enforcement in the `payments` namespace rejects the pod outright, with an admission error naming the exact field that failed.

## How do you migrate off PodSecurityPolicy without breaking workloads?

A cluster still running pre-1.25 manifests built around PodSecurityPolicy needs a deliberate migration, not a straight swap — disabling PSP and enabling PSA on the same day is how teams end up with either broken workloads or a silently weaker security posture, since PSA doesn't cover every PSP feature. The Kubernetes project's own migration guidance recommends mapping each existing PSP's rules to the closest PSS profile first, applying that profile in `audit`/`warn` mode across every namespace, and only then removing the PSP objects once the audit logs show a clean pass. Namespaces whose PSPs allowed privileged behavior PSA has no equivalent for — fine-grained host path allowlists, per-pod mutation — are exactly where a policy engine like Kyverno picks up the slack, rather than trying to force everything into one of the three fixed PSA profiles.

## How do you audit before you enforce?

Switching straight to `enforce` in production can break running workloads instantly; you need to see which pods are non-compliant first, using `audit` and `warn` modes. A server-side dry run shows you which pods would fail without actually applying the label:

```bash
kubectl label --dry-run=server --overwrite ns payments \
  pod-security.kubernetes.io/enforce=restricted
```

The dry run returns every admission error you'd get before the label is live. Skipping this step and flipping straight to `enforce` on a Friday afternoon is the single most reliable way to break production during the first weekend nobody's watching.

## When is PSA not enough, and when do you actually need OPA or Kyverno?

PSA can't express custom rules outside its three fixed profiles — requirements like "images may only come from this specific registry" or "every pod must carry this label" fall outside its scope entirely. PSA also can't mutate a pod; it only accepts or rejects. That's the point where a real policy engine, covered in [Policy as Code: OPA vs Kyverno for Kubernetes](/en/posts/policy-as-code-opa-vs-kyverno), becomes necessary — but most teams reach for one of those tools without ever turning PSA on first.

My own take: enabling PSA's restricted profile with a namespace label takes five minutes and adds zero new components, yet plenty of teams install a service mesh and start writing Kyverno policies before ever asking "doesn't restricted already block this?" If `restricted` had been the Kubernetes default a decade ago, half of today's Kyverno policies would never have needed writing.

It's worth pairing PSA with access control, not substituting one for the other — [applying least privilege in Kubernetes RBAC](/en/posts/kubernetes-rbac-least-privilege) limits who can do what, while PSA limits what a pod itself is allowed to do. For more on this, browse the [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### What's the difference between Pod Security Admission and PodSecurityPolicy?

PodSecurityPolicy (PSP) was deprecated in 2021 and fully removed in Kubernetes 1.25 — it no longer runs on any current cluster. Pod Security Admission is its built-in replacement, but unlike PSP it can't mutate pods and only enforces rules at the namespace level, through three fixed profiles instead of custom policy objects.

### Is it safe to apply the restricted profile directly in production?

No — switching straight to `enforce` without first checking which pods are non-compliant via `audit` and `warn` modes can break running workloads immediately. Running a server-side dry run, or testing with audit/warn first and fixing violations, then switching to enforce, is the safer sequence.

### What five rules does the restricted profile require?

Non-root user (`runAsNonRoot: true`), privilege escalation disabled (`allowPrivilegeEscalation: false`), all Linux capabilities dropped, a read-only root filesystem, and a defined seccomp profile. Missing any one of these five causes the pod to be rejected at admission.

### When is PSA not enough, and you need OPA or Kyverno instead?

PSA falls short once you need custom business rules outside its three fixed profiles, such as restricting which image registries are allowed or requiring specific labels on every pod. At that point, a general-purpose policy engine like OPA Gatekeeper or Kyverno is the right next step.

**Sources:** [Kubernetes — Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/), [Kubernetes — Enforce Pod Security Standards with Namespace Labels](https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/).
