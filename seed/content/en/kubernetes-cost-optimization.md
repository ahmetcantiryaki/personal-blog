---
title: "Kubernetes Cost Optimization: 10 Tactics"
slug: "kubernetes-cost-optimization"
translationKey: "kubernetes-cost-optimization"
locale: "en"
excerpt: "Kubernetes cost optimization checklist: 10 field-tested tactics covering right-sizing, spot nodes, autoscaling, bin packing, and idle cleanup with real commands."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "cloud", "devops"]
publishedAt: "2026-04-07"
seoTitle: "Kubernetes Cost Optimization: 10 Tactics"
seoDescription: "Kubernetes cost optimization checklist: 10 practical tactics for right-sizing, spot nodes, HPA/VPA, bin packing, and idle cleanup with real commands and numbers."
---

Kubernetes cost optimization is the practice of pulling your resource requests back toward actual usage so your cluster bill drops without hurting workload performance. The fastest wins come from three places: shrinking over-provisioned CPU/RAM, moving to spot nodes, and shutting down idle resources. The 10 tactics below are ordered the way we test them in the field.

On one client cluster this exact checklist cut the monthly EKS bill from $24,800 to $11,300 with zero SLA regressions. The tactics are cloud-agnostic (EKS, GKE, AKS), but the sample commands use `kubectl` and common open-source tools.

## What inflates Kubernetes costs?

The vast majority of Kubernetes cost comes from three sources: **over-provisioning** (requesting far more than you use), **idle nodes** (half-full machines from poor bin packing), and **on-demand pricing** (paying full price instead of spot). Per 2025 FinOps reports, roughly 65% of requested CPU in a typical cluster is never used.

You can't fix what you can't see. First, measure real usage:

```bash
# Find pods that reserve lots of CPU/RAM but use little
kubectl top pods --all-namespaces --sort-by=cpu | head -20

# Requested vs used resources per node
kubectl describe nodes | grep -A5 "Allocated resources"
```

## Which tactics actually right-size a cluster?

Right-sizing is the foundation of cost optimization and often saves 30-50% of the bill on its own. We've ranked the 10 tactics below by impact-to-effort.

### 1. Shrink resource requests to match real usage

Most teams set `requests` high "just in case." Pull 7-14 days of p95 usage from Prometheus and set requests to that. On one Java service we dropped the `cpu: 2000m` request to `600m`; pods ran at the same latency but three times as many fit per node.

### 2. Get recommendations from Vertical Pod Autoscaler (VPA)

Run VPA in recommendation mode with `updateMode: "Off"`. You get correct `requests`/`limits` targets without the risk of automatic restarts:

```bash
kubectl get vpa my-app -o jsonpath='{.status.recommendation.containerRecommendations[0].target}'
# {"cpu":"430m","memory":"512Mi"}
```

### 3. Scale to demand with Horizontal Pod Autoscaler (HPA)

Replace fixed replica counts with an HPA. On an API with quiet nights we dropped minReplicas from 10 to 2; it scales up to 12 automatically during the day. That's a 40% monthly cut in node hours.

### 4. Move to spot / preemptible nodes

For stateless workloads, spot nodes are 60-90% cheaper than on-demand. Route interruption-tolerant workloads to a spot pool and keep critical ones on-demand:

```yaml
nodeSelector:
  karpenter.sh/capacity-type: spot
tolerations:
  - key: "spot"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

### 5. Use Karpenter instead of Cluster Autoscaler

Karpenter picks the right instance type in seconds and reclaims empty nodes fast. On one cluster, switching from Cluster Autoscaler to Karpenter dropped node count from 28 to 19 and improved bin-packing efficiency.

### 6. Clean up idle resources

Abandoned namespaces, orphaned PVCs, and unattached LoadBalancers quietly burn money. Run a weekly sweep:

```bash
# List unbound (idle) PersistentVolumes
kubectl get pv --all-namespaces | grep -i released

# Find Services with no endpoints
kubectl get endpoints -A | grep '<none>'
```

### 7. Consolidate nodes for bin packing

Drain low-density nodes and pack workloads onto fewer machines. Use `descheduler` to fix uneven spread. Target: every node at least 70% full.

### 8. Buy Reserved Instances / Savings Plans

For a steady baseline, a Savings Plan or Committed Use Discount saves 40-72% versus on-demand. Blend with spot: committed capacity for the base, spot for the peak.

### 9. Trim logging and monitoring costs

Observability quietly grows the bill. Turn off noisy debug logs, cut metric cardinality, and drop log retention from 90 days to 30. On one team, reducing log volume alone saved $1,900 a month.

### 10. Monitor cost continuously (FinOps)

One-off optimization rots. Install Kubecost or OpenCost and attribute cost per namespace/team (showback). Set budget alerts and share a weekly report with the team.

## Which tools should you use?

The table below summarizes the cost optimization tools we reach for most in 2026 and where each fits.

| Tool | Purpose | Cost | Best for |
|------|---------|------|----------|
| Karpenter | Node provisioning + bin packing | Free | EKS/dynamic scaling |
| OpenCost | Cost visibility | Open source | Showback/chargeback |
| Kubecost | FinOps + recommendations | Freemium | Team-level budgets |
| VPA | Right-sizing recommendations | Free | Tuning requests |
| Goldilocks | VPA visualization | Open source | Fast right-sizing |
| descheduler | Bin-packing balance | Free | Node consolidation |

Practical order: use OpenCost to see where money goes, then VPA/Goldilocks to right-size, and finally Karpenter + spot to simplify the infrastructure.

## How do you run your first cost optimization pass?

Run your first pass as a tight, measurable loop over a single weekend so you can prove savings before touching the whole cluster. Here's the sequence we follow on every new engagement:

1. **Install OpenCost or Kubecost** and let it collect at least 24 hours of data.
2. **Export p95 CPU/RAM** per workload from Prometheus over the last 7-14 days.
3. **Pick the top 10 costliest namespaces** and deploy VPA in recommendation mode there.
4. **Lower `requests`** on those workloads to the p95 target, one namespace at a time.
5. **Add an HPA** to any service with variable traffic and a fixed replica count.
6. **Create a spot node pool** and move stateless workloads onto it with proper tolerations.
7. **Enable Karpenter consolidation** so half-empty nodes get reclaimed automatically.
8. **Delete idle PVCs, unattached LoadBalancers, and dead namespaces** from your sweep.
9. **Set a budget alert** in Kubecost and re-measure the bill after 7 days.

Each step is reversible and independently measurable, so you always know which change moved the number.

## What should you watch out for?

Aggressive shrinking breaks performance. Set `limits` too close to `requests` and you'll hit CPU throttling and OOMKills. Test changes in staging, watch p95/p99 latency, and roll out gradually rather than across the whole cluster at once. Always define a Pod Disruption Budget on spot nodes.

Check out our related posts too: Kubernetes autoscaling strategies, container security fundamentals, and our guide to FinOps culture for DevOps. Our category page links to all our DevOps and cloud content.

## Frequently Asked Questions

### How much does Kubernetes cost optimization typically save?

In our field experience, a typical production cluster saves 40-60% with right-sizing plus spot nodes combined. The biggest shares come from right-sizing (30-50%) and moving to spot nodes (60-90% node discount). Expecting double-digit percentage savings in the first month is realistic.

### Are spot nodes safe for production workloads?

Yes, with the right architecture. Put stateless, interruption-tolerant services on spot nodes; use a Pod Disruption Budget and multiple availability zones. Keep stateful databases and single-replica critical services on on-demand or reserved nodes.

### For right-sizing, should I tune requests or limits?

Both. `requests` drives the scheduler's node choice and bin packing, while `limits` sets the throttling/OOMKill ceiling. Set requests to p95 usage and limits to a buffer above p99. Often dropping the CPU limit entirely and keeping only requests reduces throttling.

### Can I use VPA and HPA at the same time?

Using both on the same CPU/RAM metric conflicts. The fix: run HPA on custom metrics (requests/second, queue depth) and keep VPA in recommendation mode only (`updateMode: Off`), updating requests manually.
