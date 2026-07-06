---
title: "FinOps: How to Cut Your Cloud Bill"
slug: "finops-reduce-cloud-costs"
translationKey: "finops-cloud-costs"
locale: "en"
excerpt: "A FinOps checklist for how to reduce cloud costs: tag everything, kill idle resources, right-size, commit to savings plans, and set budget alerts, with real numbers."
category: "devops-cloud"
tags: ["finops", "cost-optimization", "cloud", "devops"]
publishedAt: "2026-06-24"
seoTitle: "FinOps: How to Cut Your Cloud Bill"
seoDescription: "How to reduce cloud costs with FinOps: a 10-step checklist covering tagging, idle cleanup, right-sizing, commitments, and budget alerts, with real numbers from 2026."
---

If you want to know how to reduce cloud costs, FinOps is the operating model that gets you there: give every resource an owner, make spend visible in near real time, then attack idle capacity, over-provisioning, and on-demand pricing in that order. The checklist below is the exact sequence we run on a bloated AWS or GCP account, and it usually finds 20-40% of savings in the first two weeks.

FinOps isn't a tool you buy. It's a practice that pulls engineering, finance, and product into one loop so cost becomes a first-class metric, not a quarterly surprise. On one 2026 engagement this checklist took a client's monthly AWS bill from $61,000 to $38,500 without shipping a single feature slower.

## What is FinOps, exactly?

FinOps (Cloud Financial Operations) is a cultural and operational practice for managing variable cloud spend, where engineering, finance, and business teams share accountability for cost. It combines real-time visibility, resource ownership, and continuous optimization so teams make data-driven trade-offs between speed, cost, and quality instead of guessing.

The FinOps Foundation frames it in three phases that repeat forever: **Inform** (visibility and allocation), **Optimize** (rates and usage), and **Operate** (continuous governance). Cloud cost optimization with FinOps is a loop, not a one-time cleanup, because usage and prices both drift.

## Why do cloud bills get out of control?

Cloud bills balloon for three predictable reasons: **nobody owns the spend**, **resources outlive their purpose**, and **teams pay on-demand rates for steady workloads**. Self-service provisioning makes it trivial to spin up a `db.r6g.4xlarge` for a test and forget it. Without tagging and alerts, that cost hides in a five-figure line item.

The other silent killer is over-provisioning. Engineers size instances for peak-of-peak "just in case," so you pay 24/7 for capacity you touch two hours a day. FinOps fixes the incentive by making every dollar traceable to a team.

## The FinOps checklist: how do you cut the bill?

Cloud cost reduction with FinOps works best as an ordered checklist, cheapest and safest wins first. Each step below is independently measurable, so you always know which change moved the number. Run them roughly in this order.

### 1. Tag and allocate everything

You can't optimize what you can't attribute. Enforce a tagging policy (`team`, `env`, `service`, `cost-center`) and block untagged resources in CI. Then turn on Cost Allocation Tags so every dollar maps to an owner.

```bash
# Find untagged EC2 instances (the usual budget leak)
aws ec2 describe-instances \
  --query "Reservations[].Instances[?!not_null(Tags[?Key=='team'].Value)].InstanceId" \
  --output text
```

### 2. Kill idle and orphaned resources

Idle resources are the fastest, safest cut you'll ever make. Sweep weekly for unattached EBS volumes, idle load balancers, old snapshots, and stopped instances still holding elastic IPs. On one account, deleting orphaned volumes and snapshots alone saved $4,200 a month.

```bash
# Unattached EBS volumes burning money
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query "Volumes[].[VolumeId,Size]" --output table
```

### 3. Right-size over-provisioned compute

Right-sizing typically saves 30-50% on compute by itself. Pull 14 days of p95 CPU and memory from CloudWatch or your monitoring stack and move workloads down a tier. A fleet sitting at 8% average CPU does not need `m5.2xlarge` nodes.

### 4. Schedule non-production shutdowns

Dev, staging, and CI environments rarely need to run nights and weekends. Auto-stop them outside business hours and you cut their runtime by roughly 65% (from 168 hours a week to about 50). This one script paid for the whole engagement on a recent client.

### 5. Commit to Savings Plans or Reserved Instances

For steady baseline load, a Savings Plan or Committed Use Discount saves 40-72% versus on-demand. Commit only to the floor you're confident about, cover the peak with on-demand or spot. Review commitment coverage monthly so you don't over-commit into a shrinking baseline.

### 6. Move interruptible workloads to spot

Spot / preemptible instances run 60-90% cheaper than on-demand. Route stateless, fault-tolerant workloads (batch jobs, CI runners, stateless APIs behind a queue) to spot, and keep databases and single-replica critical services on committed capacity.

### 7. Optimize storage tiers

Storage quietly compounds. Move cold data to infrequent-access or archive tiers with lifecycle policies, and delete incomplete multipart uploads. Dropping 90-day log retention to 30 days often shaves four figures a month on its own.

### 8. Trim data transfer and egress

Egress is the bill nobody reads until it spikes. Keep chatty services in the same region and AZ, put a CDN in front of static assets, and use VPC endpoints instead of routing through NAT gateways. Cross-AZ traffic is a common hidden line item.

### 9. Set budgets and anomaly alerts

Optimization rots without guardrails. Set per-team budgets and turn on anomaly detection so a runaway job pages someone the same day. Alert on the rate of change, not just the absolute total.

### 10. Make cost a weekly ritual (showback)

Attribute spend back to each team (showback) and share a short weekly report. When engineers see their own number, they self-correct. This is the "Operate" phase, and it's what keeps the savings from creeping back.

## Which FinOps tools should you use in 2026?

The table below shows the tools we reach for most and where each fits. Start with visibility, then layer on optimization.

| Tool | Purpose | Cost | Best for |
|------|---------|------|----------|
| AWS Cost Explorer | Native visibility + forecasting | Free | AWS-only accounts |
| Cloudability / Apptio | Multi-cloud FinOps platform | Paid | Enterprise showback |
| Kubecost / OpenCost | Kubernetes cost allocation | Freemium / OSS | Container spend |
| Infracost | Cost estimates in pull requests | Freemium | Shift-left in CI |
| AWS Compute Optimizer | Right-sizing recommendations | Free | Instance tuning |
| CloudZero | Unit-economics (cost per customer) | Paid | SaaS margins |

Practical order: use native tools or OpenCost to see where money goes, add Infracost so cost shows up in code review, and only add a paid platform once you're managing multi-cloud spend.

## How do you run your first FinOps pass?

Run your first pass as a tight two-week loop on a single account so you can prove savings before scaling the practice. Here's the sequence we follow on every new engagement:

1. **Enable Cost Explorer or OpenCost** and let it collect a few days of allocation data.
2. **Enforce a tagging policy** and flag every untagged resource.
3. **Sweep for idle resources** — unattached volumes, idle LBs, old snapshots, stopped instances.
4. **Pull 14 days of p95 usage** and right-size the top 10 costliest workloads.
5. **Schedule non-prod shutdowns** for nights and weekends.
6. **Move interruptible jobs to spot** with proper fallback to on-demand.
7. **Buy a Savings Plan** covering only your confident baseline.
8. **Set per-team budgets and anomaly alerts.**
9. **Send a weekly cost report** and re-measure after 14 days.

Each step is reversible and independently measurable, so you always know exactly which lever moved the bill.

## What should you watch out for?

The biggest FinOps mistake is optimizing so aggressively that reliability suffers. Right-size too tight and you'll hit throttling and OOMKills; over-commit a Savings Plan and you're locked into capacity you no longer need. Roll changes out gradually, watch p95/p99 latency and error rates, and keep a Pod Disruption Budget on any spot workload.

Culture is the other failure mode. Tools show the number, but only shared ownership keeps it down. For deeper dives, see our guides to [Kubernetes cost optimization](/en/kubernetes-cost-optimization), [what platform engineering is](/en/what-is-platform-engineering), and [observability with logs, metrics, and traces](/en/observability-logs-metrics-traces). Our [DevOps and cloud category](/en/category/devops-cloud) links the full cluster.

## Frequently Asked Questions

### How much can FinOps realistically save on a cloud bill?

In our field experience, a neglected account typically yields 20-40% in the first month from idle cleanup and right-sizing alone, then another 20-30% from commitments and spot over the following quarter. Mature accounts still find 10-15% a year because usage and pricing constantly drift.

### Is FinOps only for large enterprises?

No. The practice scales down cleanly. A startup spending $5,000 a month can run the same checklist in an afternoon: tag resources, kill idle capacity, schedule non-prod shutdowns, and set a budget alert. You don't need a dedicated team or a paid platform to start reducing cloud costs.

### What's the difference between FinOps and cost cutting?

Cost cutting is a one-time event; FinOps is a continuous operating model. Cost cutting asks "what can we delete this quarter?" FinOps asks "how do we make cost a metric every team owns?" The goal isn't the lowest possible bill, it's the best value per dollar, so sometimes FinOps means spending more to ship faster.

### Who owns FinOps in an organization?

FinOps is a shared responsibility, usually coordinated by a small central team or practitioner who sets standards and builds tooling. Engineers own their workloads' efficiency, finance owns forecasting and commitments, and product owns the value trade-offs. The central team enables; it doesn't police every decision.
