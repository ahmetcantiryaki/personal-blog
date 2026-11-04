---
title: "Catch Infrastructure Drift Before It Bites"
slug: "catch-infrastructure-drift-before-it-bites"
translationKey: "infrastructure-drift-detection-2026"
locale: "en"
excerpt: "Short answer: schedule `plan -detailed-exitcode` for Terraform, lean on ArgoCD self-heal or Flux reconciliation in Kubernetes — GitOps is not drift detection."
category: "devops-cloud"
tags: ["terraform", "infrastructure-as-code", "gitops", "kubernetes", "monitoring"]
publishedAt: "2026-11-04"
seoTitle: "Infrastructure Drift Detection: Terraform, GitOps"
seoDescription: "What is infrastructure drift and how do you catch it before an incident? Scheduled Terraform/OpenTofu plans vs. ArgoCD self-heal vs. Flux reconciliation."
---

Short answer: the standard way to catch drift in Terraform or OpenTofu is a scheduled `plan -detailed-exitcode` run — exit code 2 means something changed outside your code. In Kubernetes, that job falls to ArgoCD's `selfHeal` setting or Flux's periodic reconciliation, not to GitOps as a concept, and the two give different guarantees.

## What is infrastructure drift?

Drift is the gap between a resource's real-world state and its definition in your repo (Terraform, OpenTofu, or a Kubernetes manifest). It usually creeps in from three places: someone edits a security group rule by hand in the AWS console, an autoscaler changes an instance count outside the value written in code, or an on-call engineer applies a hotfix during an incident and never backports it to the repo.

Drift itself is not the dangerous part; undetected drift is. The next time `terraform apply` runs, it can delete or recreate a resource nobody expected, because the IaC tool trusts its own state file as the "real" state.

## Why isn't a plan in CI enough?

A `terraform plan` in CI only runs when a pull request opens or merges — it says nothing about the drift that accumulates in the days or weeks between PRs. A security team could hand-edit an IAM policy on a Tuesday and nothing would flag it until a PR happened to land on Thursday.

The practical fix is to treat drift detection as a time-based job, not a code-change-triggered one. [Terramate's GitHub Actions drift-check documentation](https://terramate.io/docs/cli/automation/github-actions/drift-check-workflow) shows a cron job running across stacks at 2 AM daily — a mechanism entirely separate from the PR pipeline.

## How do you set up continuous drift detection?

Continuous drift detection means wiring a scheduled `plan -detailed-exitcode` run into CI/CD and alerting on the exit code. Terraform and OpenTofu return one of three codes: `0` for no changes, `1` for an error, `2` for detected drift — scripts should alert specifically on `2`, not on any nonzero code.

In practice, the setup looks like this:

```bash
set +e
tofu plan -refresh-only -detailed-exitcode -no-color -lock=false
exit_code=$?
set -e

if [ "$exit_code" -eq 2 ]; then
  echo "Drift detected, sending alert"
  # Slack/PagerDuty webhook call here
elif [ "$exit_code" -eq 1 ]; then
  echo "Plan error" && exit 1
fi
```

The `-refresh-only` flag matters: it updates the state file against real cloud state and reports only the diff, instead of misreporting pending code changes as drift. [Scalr's drift management guide](https://scalr.com/learning-center/drift-management-part-2/) notes that a plan already queries the provider for each resource's real state, while a refresh-only apply updates state to match it. Teams typically run this every 6 hours to once a day — too frequent and you risk hitting provider rate limits, too infrequent and detection lag grows.

## Should detected drift auto-apply?

No — auto-applying detected drift can silently undo a deliberate human change, such as an emergency fix made during an incident. The safer flow routes the drift report to a human or an approval step and leaves the apply as a manual trigger.

The exception is drift you already know is caused by a trusted automation, like an autoscaler changing instance counts. For that "expected drift," excluding the field from state comparison with a mechanism like `ignore_changes` in your IaC definition prevents false alarms without hiding real ones.

## What do driftctl-style tools and cloud config rules add?

These tools exist to catch resources that were never added to your Terraform state in the first place — "unmanaged" or "ghost" resources. A `terraform plan` only looks at resources already in state, so it never sees an S3 bucket or security group someone opened by hand outside that state. The driftctl project itself was officially archived in 2022, but commercial tools filling the same gap (Env0, Firefly, and Spacelift's drift modules among them) and cloud-native tooling keep covering this job.

AWS Config rules do a related but distinct job on the cloud side: they continuously track a resource's compliance status against a rule you define and fire a compliance event the moment it drifts from that expected configuration. The difference from a Terraform/OpenTofu plan check is that AWS Config has no idea what your code says — it checks against a policy you defined separately, such as "no security group may expose SSH to 0.0.0.0/0." The two approaches complement each other: one catches drift from your code, the other catches drift from your policy.

For a small team, a practical order is: set up scheduled `plan -detailed-exitcode` first to catch drift from code, then separately monitor critical security rules (open ports, public buckets) with your cloud provider's native policy engine (AWS Config, Azure Policy, GCP Organization Policy). Trying to stand up both at once usually means neither gets built properly. Teams that build this discipline often end up adopting [branching preview databases for every PR](/en/posts/branching-preview-databases-every-pr) too — both rest on the same principle: temporary state should never corrupt the permanent one.

## How does GitOps handle drift in Kubernetes?

GitOps controllers like ArgoCD and Flux can correct drift automatically, but that is not a separate "detection" phase — it's a side effect of the reconciliation loop. ArgoCD by default only marks an application "OutOfSync"; actually auto-correcting drift requires explicitly enabling `syncPolicy.automated.selfHeal: true`.

| Feature | ArgoCD | Flux |
|---|---|---|
| Detection mechanism | Kubernetes API watch + cluster cache | Periodic reconciliation (configured `interval` field) |
| Default reconciliation interval | ~180 seconds (with jitter) | Typically configured at 5–10 minutes |
| Auto-correction | Opt-in via `syncPolicy.automated.selfHeal: true` | Built into reconciliation; no separate detect-only mode |
| Excluding controller-managed fields | `ignoreDifferences` | Omit the field from the manifest, or patch it out |

The practical consequence: if an engineer runs `kubectl edit` on a live Flux-managed resource, that change gets reverted at the next reconciliation interval (say, within 10 minutes) — a temporary window, not a permanent fix. In ArgoCD with `selfHeal` disabled, the same edit just shows as "OutOfSync" and can sit there indefinitely if nobody checks.

## How do you build an alerting and ownership model?

A drift alert with no owner turns into a Slack channel nobody reads. Every drift alert needs a clear owner (usually the team that defined the resource) and an SLA — for example, "triage within 4 hours in production" — or your "known drift" list grows until it buries the real signal.

A three-tier model works well in practice: (1) production and other critical environments get an automatic PagerDuty/Slack alert with mandatory triage on detected drift, (2) staging and lower environments get a weekly summary instead of a page, (3) resources that drift often for a known reason (say, a legacy system that needs manual intervention) get explicitly scoped out with `ignore_changes`. This three-tier split follows the same logic as [safely wiring AI agents into CI/CD](/en/posts/ai-agents-in-cicd-safely): keep automation's power inside boundaries a human has actually approved.

My take: GitOps's "self-healing" promise gets conflated with drift detection far too often, and they are not the same thing — a controller silently correcting drift never asks why that drift happened in the first place. If a team keeps making manual changes, usually because self-service tooling is missing or the incident process has no sanctioned fast path, self-heal just hides that root cause instead of fixing it. Teams trying to shrink the blast radius of this kind of surprise often look at [cell-based architecture](/en/posts/cell-based-architecture-blast-radius) next, for the same underlying reason. More on this in the [DevOps & Cloud](/en/category/devops-cloud) category.

## Frequently Asked Questions

### How do you detect drift in Terraform?

Run a scheduled `terraform plan -refresh-only -detailed-exitcode` and check the exit code: `2` means drift, `0` means no changes, `1` means an error. Running this daily or every 6 hours in CI, separate from the PR pipeline, gives you continuous coverage instead of only checking at merge time.

### Does ArgoCD automatically fix drift?

Not by default. ArgoCD only flags drift by marking the application "OutOfSync"; auto-correction requires explicitly turning on `syncPolicy.automated.selfHeal: true`, which then kicks in after a short detection window of around 5 seconds.

### Is GitOps a substitute for drift detection?

No. GitOps controllers like ArgoCD and Flux can correct drift as part of their reconciliation loop, but that isn't the same guarantee as a scheduled plan check in the Terraform/OpenTofu world; in Flux, drift can go unnoticed until the next reconciliation interval, typically 5 to 10 minutes.

### Is it safe to auto-apply when drift is detected?

Usually not. Auto-applying can silently revert a deliberate emergency change a human just made. The safer approach routes the drift report to an approval step and keeps the apply manual, reserving `ignore_changes` exclusions only for automation you already trust, like an autoscaler.
