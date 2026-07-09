---
title: "Vercel Services: Microservices in One Project"
slug: "vercel-services-multi-framework-microservices"
translationKey: "vercel-services-multi-framework"
locale: "en"
excerpt: "Vercel Services now runs Next.js, Go, FastAPI, and Rails inside a single project. Here's how service bindings, container support, and atomic deploys work."
category: "devops-cloud"
tags: ["cloud", "containers", "deployment", "docker", "microservices"]
publishedAt: "2026-07-09"
seoTitle: "Vercel Services Explained: Multi-Framework Microservices"
seoDescription: "Vercel Services now runs Next.js, Go, FastAPI, and Rails inside a single project. Here's how service bindings, container support, and atomic deploys work."
---

On July 1, 2026, Vercel moved **Vercel Services** into open beta: a single Vercel project can now define multiple frameworks and runtimes — say, a Next.js frontend, a Go service, and a FastAPI backend — that deploy together, talk to each other over an internal network, and share one preview URL. It's one of the biggest architectural shifts in Vercel's history, turning it from a frontend-first platform into a full-stack microservices platform.

This piece covers how Vercel Services works, how you declare services in `vercel.json`, where container support ends, and when it's actually worth reaching for over a single monolithic project.

## What Vercel Services actually changes

Before July 2026, running "multiple services" on Vercel meant deploying each backend as its own project and calling between them over the public internet. That meant extra latency, separate preview URLs per service, and deploy drift — you'd ship the frontend while the backend preview was still one version behind, so your staging environment silently lied to you.

Vercel Services collapses that into one project scope. Per [Vercel's official announcement](https://vercel.com/blog/vercel-services-run-full-stack-on-vercel), a project can now contain services across multiple frameworks or runtimes, and Vercel handles routing, builds, deploys, and autoscaling for all of them. The payoff breaks into three pieces: **atomic deploys** (frontend and backend ship and roll back together), **shared preview deployments** (a single PR preview URL reflects every service's change at once), and **internal service communication** (services call each other without ever touching the public internet).

## Declaring services in vercel.json

Services live under the `services` key in `vercel.json`. Every service is internal by default — nothing is reachable from the internet unless you explicitly expose it.

```json
{
  "services": {
    "web": {
      "directory": "apps/web",
      "framework": "nextjs"
    },
    "inventory": {
      "directory": "apps/inventory",
      "framework": "fastapi"
    },
    "pricing": {
      "directory": "apps/pricing",
      "runtime": "container"
    }
  }
}
```

The `"runtime": "container"` line on the `pricing` service matters: if you'd rather build a service as a Docker image than target a first-party framework runtime, Vercel supports that too. Per [Vercel's docs](https://vercel.com/docs/services), OCI-compatible container images are stored in the Vercel Container Registry (VCR) and served as an autoscaling Vercel Function — meaning you can lift existing containerized services onto the platform without rewriting them.

## Service bindings — and where they stop

Cross-service calls run through **service bindings**: a binding injects an environment variable into one service pointing at another service's internal URL. If `orders` declares a binding to `inventory`, JavaScript code in `orders` can call `process.env.INVENTORY_URL` and reach `inventory` without ever leaving Vercel's internal network.

There's a real limitation here as of this writing: per [Vercel's service bindings documentation](https://vercel.com/docs/services/bindings), bindings aren't yet available for services running on the Go or Rust runtime. A Go service can still be *called* by another service via a binding, but the Go service itself can't declare an outgoing binding — it has to fall back to a plain HTTP client for its own outbound calls. Container runtime support has outpaced language-level binding support; this is still a maturing corner of the feature in July 2026.

## When it's a real win, and when it's overkill

Vercel Services is a clear win for teams that already run multiple languages or frameworks and want them under one deploy unit instead of coordinating separate repos and CI pipelines. Testing a Next.js frontend, a Python-backed ML service, and a Go API together in one preview URL beats stitching them together by hand — it's a practical answer to the "when is distributed complexity worth it" question we raised in [Microservices vs Monolith](/en/posts/microservices-vs-monolith): you get a distributed codebase with a single deploy discipline.

But if your app is a single framework built by a single team, splitting it into services purely to use this feature reproduces the operational overhead we warned about in [Docker Best Practices for Production](/en/posts/docker-best-practices-production). Vercel Services isn't an architectural mandate — it's a way to manage multi-service complexity you already have, not a reason to create it.

| Criterion | One project, multi-framework (Vercel Services) | Separate projects + public HTTP |
|---|---|---|
| Deploy sync | Atomic, roll back together | Manual coordination required |
| Preview environment | All services under one URL | Separate preview per service |
| Cross-service calls | Internal network, never public | Public internet HTTP |
| Go/Rust outgoing binding support | Not yet (July 2026) | Not an issue — already HTTP |
| Container (Docker) support | Yes, via VCR | Depends on the framework |
| Best fit | Multiple languages/frameworks, one team | Independent teams, separate release cadences |

## Container support and rollout speed

Container support is a practical bridge for teams migrating existing Docker-based services onto Vercel. Once you build an image and push it to VCR, Vercel serves it as an autoscaling function — the same zero-downtime rollout guarantees we outlined in [Zero-Downtime Deployments](/en/posts/zero-downtime-deployments) apply here too: atomic deploys, instant rollback, and gradual traffic shifting all hold regardless of whether a service is a Next.js app or a container image.

Honestly, the most interesting part of this launch isn't technical — it's organizational. Teams no longer have to ask "do we need a separate cloud provider for our backend" just to write Python or Go. For anyone who still thinks of Vercel purely as a Next.js host, this is a natural extension of the rendering strategy we covered in [Edge Functions and Rendering: A 2026 Guide](/en/posts/edge-functions-rendering-guide) — the platform now reaches past the render layer into full backend architecture.

For more infrastructure and deployment coverage, browse the [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### Is Vercel Services production-ready?

As of July 2026, it's in open beta. Core flows — routing, atomic deploys, internal communication — work today, but pieces like Go/Rust binding support are still maturing. Check Vercel's current documentation for up-to-date limitations before putting critical production traffic on it.

### Does Vercel Services replace Kubernetes?

No, it solves a different scale problem. Vercel Services targets teams managing a handful of services — typically a frontend plus a few backends — under one project with minimal ceremony. Systems orchestrating dozens of microservices with custom scaling and service-mesh requirements still need Kubernetes.

### Is internal service-to-service traffic secure?

Yes — calls made through a binding never touch the public internet, which cuts both latency and attack surface. But remember the default is internal-only; explicitly exposing a service is the exception, and accidentally making one public is a classic misconfiguration to watch for.

### Can I migrate an existing Docker Compose project directly?

Partially. You'll need to declare each service individually with `runtime: container` and adapt cross-service calls to Vercel's binding model — a Docker Compose file won't just work as-is. For a handful of services the migration is usually a day or less, but you should revisit any networking assumptions baked into your compose file first.
