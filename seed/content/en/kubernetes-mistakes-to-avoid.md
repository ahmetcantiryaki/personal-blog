---
title: "10 Kubernetes Mistakes to Avoid"
slug: "kubernetes-mistakes-to-avoid"
translationKey: "kubernetes-mistakes"
locale: "en"
excerpt: "The 10 Kubernetes mistakes we still see wreck production clusters in 2026, from missing resource requests to plaintext secrets, each with the exact manifest that fixes it."
category: "devops-cloud"
tags: ["kubernetes", "devops", "containers", "best-practices"]
publishedAt: "2026-07-04"
seoTitle: "10 Kubernetes Mistakes to Avoid (2026 Guide)"
seoDescription: "The most common Kubernetes mistakes and how to fix them on 1.33+ clusters: resource requests, probes, secrets, PSA, and HA, with real manifests for 2026."
---

The most common Kubernetes mistakes are shipping pods with no resource requests, no health probes, and no high-availability setup, then discovering the gaps during a 2 a.m. incident. Every mistake below is one we have debugged in real production clusters, and each comes with the exact manifest or command that fixes it. Fix these ten and you eliminate the majority of self-inflicted outages.

As of July 2026 the supported Kubernetes releases are 1.35, 1.34, and 1.33 (v1.36 is current, with 1.37 due at the end of August). Everything here applies to any distribution on 1.33+ — EKS, GKE, AKS, or bare-metal k3s — using plain `kubectl` and standard YAML, so nothing is vendor-locked.

## What are the most common Kubernetes mistakes?

They cluster around three themes: **no resource governance** (missing requests, limits, and quotas), **no availability guarantees** (missing probes, single replicas, no disruption budgets), and **weak security defaults** (root containers, plaintext secrets, wide-open RBAC). The list below is ordered roughly by how often each one bites teams.

### 1. Running pods with no resource requests or limits

This is the number-one Kubernetes mistake. Without `requests`, the scheduler can't place pods intelligently and one noisy neighbor starves the whole node. Without `limits`, a memory leak takes down every pod on that machine.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    memory: "512Mi"   # cap memory to prevent node-wide OOM
```

Set memory `requests` and `limits` equal to get the Guaranteed QoS class. Leave CPU limits off in most cases so you avoid throttling. And here's genuinely good news: [in-place pod resize went GA in Kubernetes 1.35](https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/) (December 2025), so you can now bump CPU and memory on a running pod without a restart. That kills the old excuse for guessing high "just in case." We cover right-sizing in depth in our [Kubernetes cost optimization](/en/posts/kubernetes-cost-optimization) guide.

### 2. Using the `latest` image tag

`image: myapp:latest` is not a version, it's a moving target. Two nodes can pull two different builds of "latest," and a rollback becomes impossible because there's nothing to roll back to. We once spent an hour chasing a bug that only existed on one replica because of this.

Pin an immutable tag or, better, a digest:

```yaml
image: myapp:1.8.3
# or fully immutable:
image: myapp@sha256:9b2c...e41
imagePullPolicy: IfNotPresent
```

### 3. Missing or misconfigured health probes

Without a `readinessProbe`, Kubernetes routes traffic to pods that aren't ready, so users hit 502s during every deploy. Without a `livenessProbe`, a hung process stays in the pool forever. The classic mistake is pointing both at the same endpoint.

```yaml
readinessProbe:
  httpGet: { path: /ready, port: 8080 }
  initialDelaySeconds: 5
  periodSeconds: 5
livenessProbe:
  httpGet: { path: /healthz, port: 8080 }
  initialDelaySeconds: 15
  periodSeconds: 10
```

Keep the liveness check cheap and dependency-free. A liveness probe that queries the database will restart your pod every time the DB blips. Slow starters should use a `startupProbe` instead of a huge `initialDelaySeconds`.

### 4. Deploying everything into the `default` namespace

The `default` namespace has no quotas, no network policies, and no clear ownership. Everything piles up, RBAC becomes impossible to reason about, and one team's runaway job affects another's. Create namespaces per team or environment from day one:

```bash
kubectl create namespace payments
kubectl label namespace payments team=billing tier=prod
```

### 5. No `ResourceQuota` or `LimitRange`

Even with per-pod limits, a single Deployment can request 500 replicas and drain the cluster. A `ResourceQuota` caps total consumption per namespace, and a `LimitRange` supplies sane defaults so pods without explicit requests don't slip through.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata: { name: payments-quota, namespace: payments }
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.memory: 40Gi
```

### 6. Running containers as root

By default a container often runs as UID 0. If an attacker escapes it, they land as root on the node. This is the most common finding in every cluster audit we run. Drop privileges explicitly:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  seccompProfile: { type: RuntimeDefault }
  capabilities: { drop: ["ALL"] }
```

Enforce it cluster-wide with [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/) set to `restricted` — it has been stable since 1.25 and remains the recommended baseline in 2026. The `restricted` profile requires exactly the settings above: non-root, all capabilities dropped, and a seccomp profile. For anything beyond the three built-in profiles, reach for a policy engine like Kyverno.

### 7. Storing secrets in plain ConfigMaps or env vars

Putting a database password in a ConfigMap, or hardcoding it in a Deployment's `env`, means it lands in Git, in `kubectl describe` output, and in anyone's terminal history. Kubernetes Secrets are only base64-encoded, not encrypted, so at minimum enable encryption at rest and pull real secrets from an external store.

My opinionated take for 2026: unless you already run Vault for its dynamic secrets, the External Secrets Operator (ESO) is the pragmatic default. It syncs from 45+ backends — AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, 1Password — and keeps zero secret material in Git.

| Approach | Encrypted? | Rotates? | Verdict |
|----------|-----------|----------|---------|
| ConfigMap / env | No | No | Never for secrets |
| Native Secret | At rest only if configured | Manual | Baseline |
| Sealed Secrets | Yes (in Git) | Manual | Good for pure GitOps |
| External Secrets + cloud/Vault | Yes | Automatic | Best for prod |

This ties directly into [GitOps](/en/posts/gitops-explained): declare the `ExternalSecret` in Git, let the operator materialize the real value in-cluster.

### 8. Single replica and no spread constraints

One replica means every deploy, node drain, or spot reclaim is an outage. Even three replicas won't save you if they all land on the same node. Run at least two or three and spread them across nodes and zones:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels: { app: payments-api }
```

### 9. No Pod Disruption Budget

When you drain a node for an upgrade, Kubernetes will happily evict all your replicas at once unless a `PodDisruptionBudget` stops it. This bites teams during routine cluster upgrades, exactly when they least expect downtime.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: payments-pdb }
spec:
  minAvailable: 2
  selector:
    matchLabels: { app: payments-api }
```

### 10. Treating `kubectl logs` as monitoring

Grepping logs after users complain is not observability, it's archaeology. Without metrics, alerts, and dashboards you find out about problems last. Install Prometheus and Grafana, alert on the golden signals (latency, traffic, errors, saturation), and wire probes into your alerting. Start with our [observability 101](/en/posts/observability-logs-metrics-traces) guide, and pair it with the practices in [production Docker best practices](/en/posts/docker-best-practices-production) and [how to build a CI/CD pipeline](/en/posts/how-to-build-cicd-pipeline).

## A quick pre-deploy checklist

Run through this before any workload ships. It catches roughly nine of the ten mistakes above in under a minute:

1. Every container has `requests` and memory `limits`.
2. Images use a pinned tag or digest, never `latest`.
3. Readiness and liveness probes exist and point at different endpoints.
4. The workload lives in a dedicated namespace with a `ResourceQuota`.
5. `securityContext` sets `runAsNonRoot`, a seccomp profile, and drops all capabilities.
6. Secrets come from an external store, never a ConfigMap.
7. At least two replicas with `topologySpreadConstraints`.
8. A `PodDisruptionBudget` protects the workload during drains.
9. Prometheus scrapes the pod and alerts are defined.

For the wider picture on operating clusters well, see [what platform engineering is](/en/posts/what-is-platform-engineering), and browse our full [DevOps & Cloud category](/en/category/devops-cloud) for related deep dives.

## Frequently Asked Questions

### What is the single most damaging Kubernetes mistake?

Skipping resource `requests` and `limits`. It causes the widest blast radius: bad scheduling, noisy-neighbor contention, and node-wide OOMKills that take down unrelated workloads. Setting sensible requests and memory limits on every container prevents the majority of capacity-related incidents on its own — and since 1.35 you can even resize them live without a restart.

### Are Kubernetes Secrets safe to use?

Native Secrets are only base64-encoded by default, not encrypted, and anyone with `get secret` RBAC can read them. Enable encryption at rest on etcd, lock down RBAC, and for production pull values from an external manager via the External Secrets Operator, or seal them into Git with Sealed Secrets. Reserve Vault for teams that genuinely need dynamic, short-TTL credentials.

### How many replicas should a production workload run?

At least two, ideally three, spread across nodes and availability zones with `topologySpreadConstraints`, plus a Pod Disruption Budget. A single replica turns every node upgrade, spot reclaim, or crash into user-facing downtime, which defeats most of the reason to run Kubernetes at all.

### How do I check my cluster for these mistakes automatically?

Run a policy scanner. Tools like Polaris, Kubescape, and kube-bench flag missing limits, root containers, and absent probes against best-practice baselines. Wire one into CI so misconfigured manifests fail the build before they reach the cluster, and enforce Pod Security Admission at the namespace level as a runtime backstop.
