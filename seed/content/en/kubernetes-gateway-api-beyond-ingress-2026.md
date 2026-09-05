---
title: "Kubernetes Gateway API: Beyond Ingress in 2026"
slug: "kubernetes-gateway-api-beyond-ingress-2026"
translationKey: "kubernetes-gateway-api-2026"
locale: "en"
excerpt: "Short answer: Gateway API replaces Ingress's annotation sprawl with GatewayClass, Gateway, and HTTPRoute, and hit GA with v1.6.0 in June 2026."
category: "devops-cloud"
tags: ["kubernetes", "devops", "cloud", "platform-engineering"]
publishedAt: "2026-09-05"
seoTitle: "Kubernetes Gateway API: Migrating From Ingress in 2026"
seoDescription: "Short answer: Gateway API replaces Ingress's annotation sprawl with GatewayClass, Gateway, and HTTPRoute, and hit GA with v1.6.0 in June 2026."
---

Short answer: the Kubernetes Gateway API is the official traffic-routing standard that fixes Ingress's annotation sprawl and single-role model by splitting responsibility across GatewayClass, Gateway, and HTTPRoute resources. With v1.6.0, released in June 2026, TCPRoute and UDPRoute also reached Standard (GA) status; HTTPRoute, Gateway, and GatewayClass have been at v1 GA since v1.0.

## Why did Ingress stop being enough?

Short answer: Ingress couldn't express complex routing needs — header-based routing, traffic splitting, cross-namespace references — through a single standard field set, so every controller invented its own annotations. That made porting an NGINX Ingress definition to a Traefik or Istio setup nearly impossible.

Ingress's second problem was a missing role split: the infrastructure that a platform team owns and the routing rules that an application team owns lived in the same YAML file. In larger organizations, that meant every route change needed platform-team sign-off — exactly the bottleneck Gateway API is built to remove.

## How does the Gateway API's resource model actually work?

Short answer: the model splits into three layers — GatewayClass (the template a cloud provider or controller offers), Gateway (the actual listener/IP created from that template), and HTTPRoute (the rule defining which traffic through that Gateway goes where). The platform team owns GatewayClass and Gateway, while application teams define their own HTTPRoutes inside their own namespaces.

That split makes role-based access control natural: an application team can edit its own HTTPRoute but can't touch the Gateway's TLS certificate or listening port. The `ReferenceGrant` resource also forces explicit permission for cross-namespace references — say, an HTTPRoute pointing at a Service in a different namespace — which prevents accidental traffic leakage.

## How do you do traffic splitting and header-based routing?

Short answer: the `weight` field inside an HTTPRoute defines percentage-based traffic splitting between two services (say, a 90/10 canary split) directly at the API level, with no controller-specific CRD or annotation needed. Header, path, and method-based matching rules work the same way, through standard fields.

This is particularly useful when applying [blue-green versus canary deployment strategies](/en/posts/blue-green-vs-canary-deployments) — with Gateway API, adjusting a canary's traffic percentage becomes a single controller-agnostic YAML field update.

## Which controllers support the Gateway API?

Short answer: Envoy Gateway, Istio, NGINX Gateway Fabric, and the major cloud providers' own controllers (Azure's App Routing Gateway API reached GA in June 2026, for instance) all support the Gateway API — which one to pick depends on the Gateway API version you need and any extra features like mTLS or observability.

| Version | Release date | Key change |
|---|---|---|
| v1.0 | October 2023 | Gateway, GatewayClass, HTTPRoute reach GA |
| v1.5 | February 27, 2026 | Most experimental features move to Standard |
| v1.6.0 | June 30, 2026 | TCPRoute and UDPRoute reach Standard (GA) |

Gateway API follows roughly a four-month release cadence on its standard channel, which makes it easier to predict when a controller will pick up a given feature.

## How do you migrate from Ingress to the Gateway API?

Short answer: migrate in phases — stand up a GatewayClass and Gateway alongside your existing Ingress resources, route a small percentage of traffic to the new setup, then move HTTPRoutes over service by service and retire the old Ingress definitions last. Running both systems in parallel in the same cluster for a while keeps the cutover at zero downtime.

A practical sequence looks like this:
1. Confirm your controller's (Istio, Envoy Gateway, NGINX Gateway Fabric) Gateway API support and version.
2. Define one GatewayClass and one or more Gateways for the platform team (one per region, for example).
3. Convert Ingress rules to HTTPRoutes one-to-one, starting with your lowest-risk service.
4. Watch traffic, and once it's clean, move to the next service; retire the old Ingress controller once every service has migrated.

This overlaps with the question of [whether you actually need a service mesh](/en/posts/service-mesh-2026-do-you-need-one) — Gateway API gives you some of the traffic-management features a mesh provides, like weighted routing, without standing up a mesh. For some teams, Gateway API alone is enough.

## Does the Gateway API replace a service mesh?

Short answer: no — the Gateway API is built to manage north-south traffic (external clients entering the cluster), while a service mesh strengthens east-west traffic (internal traffic between services) with mTLS and observability; they operate at different layers and complement each other. Some mesh solutions, like Istio, already ship their own Gateway API implementation, so a single controller can end up handling both external and internal traffic.

For small and mid-sized teams, the practical advice is this: if you only need external traffic routing (canary splits, header-based routing), a plain Gateway API controller (Envoy Gateway or NGINX Gateway Fabric) is enough without standing up a mesh at all. Once you need service-to-service mTLS, circuit breaking, or fine-grained traffic telemetry, that's when reaching for a mesh starts to make sense.

## Does the Gateway API add cost and operational overhead?

Short answer: in the short term, yes — there's a learning curve and two resource types (GatewayClass plus HTTPRoute) to manage — but the operational load drops over time because it eliminates annotation-driven custom scripts and controller-specific documentation. My take: teams that automate the route-change approval flow between the platform and application teams lose time in month one of the migration, but see a clear net gain by month three.

Adding HTTPRoute validation to your CI/CD pipeline should be a natural part of this migration; [building a CI/CD pipeline from scratch](/en/posts/how-to-build-cicd-pipeline) covers how to add this kind of manifest validation step.

## Frequently Asked Questions

### Is the Gateway API stable (GA) right now?

Yes, Gateway, GatewayClass, and HTTPRoute have been at v1 GA status since v1.0 in October 2023. With v1.6.0 in June 2026, TCPRoute and UDPRoute also reached Standard (GA) status.

### Does the Gateway API fully replace Ingress?

The Ingress resource hasn't been removed and still works, but the Kubernetes community is directing new feature development toward the Gateway API. If you need complex traffic routing, a multi-team model, or traffic splitting, the Gateway API is a clear upgrade.

### Which controller should I pick for a Gateway API migration?

It depends on your existing infrastructure — if you already run Istio, evaluate its Gateway API support first; for plain HTTP routing, consider Envoy Gateway or NGINX Gateway Fabric. All three support the core v1.6-level resources.

### How do you do canary traffic splitting with the Gateway API?

Add multiple services to an HTTPRoute's `backendRefs` field and assign each a `weight` value — for example, 90% to the old version and 10% to the new one. This works through the standard API with no extra annotation or controller-specific CRD required.
