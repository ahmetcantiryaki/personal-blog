---
title: "10 Kubernetes Mistakes to Avoid"
slug: "kubernetes-mistakes-to-avoid"
translationKey: "kubernetes-mistakes"
locale: "en"
excerpt: "The 10 most common Kubernetes mistakes we see in production, from missing resource limits to plaintext secrets, plus the exact fix and manifest for each one."
category: "devops-cloud"
tags: ["kubernetes", "devops", "containers", "best-practices"]
publishedAt: "2026-06-05"
seoTitle: "10 Kubernetes Mistakes to Avoid (2026 Guide)"
seoDescription: "The most common Kubernetes mistakes and how to fix them: resource limits, probes, secrets, HA, and RBAC, with real manifests and commands for 2026 clusters."
---

The most common Kubernetes mistakes are shipping pods with no resource requests, no health probes, and no high-availability setup, then discovering the gaps during a 2 a.m. incident. Every mistake below is one we have debugged in real production clusters, and each comes with the exact manifest or command that fixes it. Fix these ten and you eliminate the majority of self-inflicted Kubernetes outages.

These apply to any distribution (EKS, GKE, AKS, or bare-metal k3s) running Kubernetes 1.29+ in 2026. The examples use plain `kubectl` and standard YAML so nothing here is vendor-locked.

## What are the most common Kubernetes mistakes?

The most common Kubernetes mistakes cluster around three themes: **no resource governance** (missing requests, limits, and quotas), **no health and availability guarantees** (missing probes, single replicas, no disruption budgets), and **weak security defaults** (root containers, plaintext secrets, wide-open RBAC). The list below is ordered roughly by how often each one bites teams.

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

Set memory `requests` and `limits` equal to get the Guaranteed QoS class. Leave CPU limits off in most cases so you avoid throttling. We cover sizing in depth in our [Kubernetes cost optimization](/blog/kubernetes-cost-optimization) guide.

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

Keep the liveness check cheap and dependency-free. A liveness probe that queries the database will restart your pod every time the DB blips.

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

By default a container often runs as UID 0. If an attacker escapes the container, they land with root on the node. This is the most common finding in every cluster audit we run. Drop privileges explicitly:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities: { drop: ["ALL"] }
```

Enforce it cluster-wide with Pod Security Admission set to `restricted`, or a policy engine like Kyverno.

### 7. Storing secrets in plain ConfigMaps or env vars

Putting a database password in a ConfigMap, or hardcoding it in a Deployment's `env`, means it lands in Git, in `kubectl describe` output, and in anyone's terminal history. Kubernetes Secrets are only base64-encoded, not encrypted, so at minimum enable encryption at rest and pull real secrets from an external store.

| Approach | Encrypted? | Rotates? | Verdict |
|----------|-----------|----------|---------|
| ConfigMap / env | No | No | Never for secrets |
| Native Secret | At rest only if configured | Manual | Baseline |
| Sealed Secrets | Yes (in Git) | Manual | Good for GitOps |
| External Secrets + Vault | Yes | Automatic | Best for prod |

### 8. Single replica and no anti-affinity

One replica means every deploy, node drain, or spot reclaim is an outage. Even three replicas won't save you if they all land on the same node. Run at least two or three replicas and spread them across nodes and zones:

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

Grepping logs after users complain is not observability, it's archaeology. Without metrics, alerts, and dashboards you find out about problems last. Install Prometheus and Grafana, alert on golden signals (latency, traffic, errors, saturation), and wire probes into your alerting. This pairs directly with the practices in our [production Docker best practices](/blog/docker-best-practices-production) and [how to build a CI/CD pipeline](/blog/how-to-build-cicd-pipeline) guides.

## A quick pre-deploy checklist

Run through this before any workload ships to production. It catches roughly nine of the ten mistakes above in under a minute:

1. Every container has `requests` and memory `limits`.
2. Images use a pinned tag or digest, never `latest`.
3. Readiness and liveness probes exist and point at different endpoints.
4. The workload lives in a dedicated namespace with a `ResourceQuota`.
5. `securityContext` sets `runAsNonRoot` and drops all capabilities.
6. Secrets come from an external store, never a ConfigMap.
7. At least two replicas with `topologySpreadConstraints`.
8. A `PodDisruptionBudget` protects the workload during drains.
9. Prometheus scrapes the pod and alerts are defined.

For the wider picture on operating clusters well, see [what platform engineering is](/blog/what-is-platform-engineering) and browse our full DevOps and cloud category for related deep dives.

## Frequently Asked Questions

### What is the single most damaging Kubernetes mistake?

Skipping resource `requests` and `limits`. It causes the widest blast radius: bad scheduling, noisy-neighbor contention, and node-wide OOMKills that take down unrelated workloads. Setting sensible requests and memory limits on every container prevents the majority of capacity-related incidents on its own.

### Are Kubernetes Secrets safe to use?

Native Secrets are only base64-encoded by default, not encrypted, and anyone with `get secret` RBAC can read them. Enable encryption at rest on etcd, lock down RBAC, and for production pull values from an external manager like Vault or your cloud's secret store via the External Secrets Operator.

### How many replicas should a production workload run?

Run at least two, ideally three, replicas spread across nodes and availability zones with `topologySpreadConstraints`, plus a Pod Disruption Budget. A single replica turns every node upgrade, spot reclaim, or crash into user-facing downtime, which defeats most of the reason to run Kubernetes at all.

### How do I check my cluster for these mistakes automatically?

Run a policy scanner. Tools like Polaris, Kubescape, and kube-bench flag missing limits, root containers, and absent probes against best-practice baselines. Wire one into CI so misconfigured manifests fail the build before they ever reach the cluster, and enforce Pod Security Admission at the namespace level.
