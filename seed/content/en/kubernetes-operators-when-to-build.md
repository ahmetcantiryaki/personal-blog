---
title: "Kubernetes Operators: When to Build One"
slug: "kubernetes-operators-when-to-build"
translationKey: "kubernetes-operators-explained-2026"
locale: "en"
excerpt: "Short answer: build an operator when day-2 operations — backups, failover, upgrades — keep demanding human intervention; otherwise a Helm chart is enough."
category: "devops-cloud"
tags: ["kubernetes", "platform-engineering", "automation", "infrastructure-as-code", "devops"]
publishedAt: "2026-10-21"
seoTitle: "Kubernetes Operators: When to Build One"
seoDescription: "Short answer: build an operator when day-2 operations — backups, failover, upgrades — keep demanding human intervention; otherwise a Helm chart is enough."
---

Short answer: an operator earns its cost when your application's day-2 operations — backups, failover, version upgrades, scaling decisions — keep demanding manual intervention. If that's not the case, a Helm chart or plain YAML manifest does the same job without taking on an operator's maintenance burden.

## What is a Kubernetes operator?

An operator is software that extends the Kubernetes API itself with application-specific operational knowledge. It's built from three pieces: a CRD (Custom Resource Definition) defines a new object type in your cluster, a controller continuously watches those objects, and a reconcile loop runs whatever actions close the gap between "where we are now" and "where we should be." A Helm chart just applies YAML templates once; an operator is software that keeps running in your cluster, continuously watching state and correcting it on its own.

## How does the reconcile loop actually work?

The reconcile loop repeats four steps on a cycle: watch, compare, act, update status, then requeue if needed. A database operator, for example, watches a CRD object defined with `replicas: 3`; if it sees only 2 pods running in the cluster, it starts the third one and requeues until that's done. This loop has to be idempotent — running the same reconcile function five times in a row has to produce the same result, because Kubernetes can and does call it repeatedly without a specific reason.

## Should you build an operator, or use an existing one?

Look for an existing operator first — most popular databases and message queues (PostgreSQL, Redis, Kafka, Elasticsearch) already have a community- or vendor-maintained operator. Building your own is justified only when a piece of day-2 operational logic specific to your business — a custom failover order, a regulatory compliance rule — isn't covered by any existing operator. When you do pick an existing one, check how actively it's maintained: if the last commit is older than six months and open issues keep piling up, running that operator in production can be riskier than writing your own.

| Criterion | Helm Chart | Existing Operator | Your Own Operator |
|---|---|---|---|
| Setup complexity | Low | Medium | High |
| Day-2 operations support | None, done by hand | Varies by application | Full, as much as you define |
| Maintenance burden | None | Carried by vendor/community | Stays with your team |
| Best fit | Stateless apps, one-time setup | Standard databases, queues | Company-specific, repeated operational logic |

## What's the maintenance cost of owning an operator?

Building an operator means adding a new software component that runs continuously in your cluster and has to keep up with Kubernetes API versions. Every Kubernetes version upgrade can require updating the `client-go` and controller-runtime libraries your operator depends on — which means you can't treat it as "write once, forget." Shipping it to production without assigning a specific owner (a team or person) responsible for that upkeep means it turns into a critical component nobody remembers to update six months later. As your team grows the operator's codebase, a bug in the reconcile loop has a bigger blast radius too — the same "keep a single component's blast radius small" principle we cover in our [common Kubernetes mistakes guide](/en/posts/kubernetes-mistakes-to-avoid) applies here.

## Where do you start writing an operator?

Kubebuilder is the standard tool for scaffolding the CRD and controller skeleton in seconds — `kubebuilder init` sets up the project, `kubebuilder create api` generates each resource type. Operator SDK, part of the Operator Framework, builds on the same scaffolding with extra tooling for packaging your operator for catalogs like OperatorHub. Both expect you to write the reconcile function itself in Go — you own the logic; the tooling only generates the CRD schema, RBAC rules, and controller skeleton.

```go
// A simplified reconcile function skeleton
func (r *DatabaseReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	var db myappv1.Database
	if err := r.Get(ctx, req.NamespacedName, &db); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	current := r.countRunningPods(ctx, &db)
	if current < db.Spec.Replicas {
		r.scaleUp(ctx, &db, db.Spec.Replicas-current)
		return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
	}
	return ctrl.Result{}, nil
}
```

## How do you test an operator?

Operator testing happens in three layers: unit tests run your reconcile function against a fake Kubernetes client with no real cluster involved; Kubebuilder's `envtest` tool spins up a real API server (including etcd, but no kubelet) so you can confirm your CRD and RBAC rules actually work; and a full cluster on Kind or Minikube covers end-to-end scenarios, like a pod actually crashing and the operator actually restarting it. Skipping these three layers and testing directly in production turns a reconcile loop stuck in an infinite loop into an incident that hits the whole cluster.

## What are the real signs you need an operator?

Three signs together justify building one: you repeat the same day-2 operation manually more than once a month, that operation requires multiple resources (pods, services, secrets) to change in a coordinated way, and the margin for error is high — a failover run in the wrong order can cause data loss. If only one of those three signs is present, a simple post-install hook added to a Helm chart or a cron job usually does the same job without an operator's maintenance load.

My own take: teams reach for an operator too early because being "Kubernetes-native" sounds technically appealing. But an operator is a new distributed system that lives in your cluster and that you now own — asking whether a cron job or a simple script can solve the same day-2 logic, before writing one, usually saves months of maintenance work later. Every operator your platform team stands up is really a Kubernetes subsystem you wrote and now support; building one before you're ready to own that responsibility, just because it's trendy, turns into a codebase nobody fully understands two years later.

If you want to settle how you manage the YAML around an operator, see our [Helm vs Kustomize comparison](/en/posts/helm-vs-kustomize-kubernetes); to decide whether scaling decisions belong to the operator or to built-in HPA/VPA, our [Kubernetes autoscaling guide](/en/posts/kubernetes-autoscaling-guide) can help. If you're questioning whether you need Kubernetes at all, check [our comparison here](/en/posts/do-you-still-need-kubernetes-2026). For the official concepts, [kubernetes.io's operator pattern page](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) and the [Kubebuilder book](https://book.kubebuilder.io/) for a practical start are the most reliable sources.

## Frequently Asked Questions

### Do you need to know Go to write an operator?

In practice, yes. Kubebuilder and Operator SDK's main ecosystem is built on Go, and the `client-go` library has its best support there; operators can be written in Python or Java too, but community support and examples are far thinner.

### What's the difference between a CRD and a ConfigMap?

A CRD adds a new resource type to the Kubernetes API, with its own schema, validation, and version history; a ConfigMap is just a generic resource carrying key-value data, and no controller is required to watch it.

### How often does the reconcile loop run?

Not on a fixed interval — it's event-driven: it fires immediately when the watched resource changes, and again after whatever delay you set with `RequeueAfter`. That's more efficient than a fixed-interval polling loop.

### Is a simple cron job enough instead of writing an operator?

Often, yes. If your day-2 operation affects a single resource and needs no coordination, a cron job or simple script does the same job; an operator's real value shows up when it has to continuously and coordinately watch multiple resources and react to failures automatically.
