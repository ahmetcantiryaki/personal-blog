---
title: "eBPF for Observability, Explained"
slug: "ebpf-for-observability-explained"
translationKey: "ebpf-observability-explained"
locale: "en"
excerpt: "Can you get traces without touching application code at all? We break down eBPF's kernel-level visibility, the 2026 stack, and its real limits."
category: "devops-cloud"
tags: ["observability", "kubernetes", "performance", "devops", "monitoring"]
publishedAt: "2026-07-12"
seoTitle: "eBPF for Observability: A Zero-Instrumentation Guide"
seoDescription: "Can you get traces without touching application code at all? We break down eBPF's kernel-level visibility, the 2026 stack, and its real limits."
---

You've got 200 microservices, none of them have the OTel SDK installed, and leadership wants full visibility in three weeks. Is there a way to get traces without touching every single service? That's eBPF: a technology that programs hooks directly into the kernel, observing network traffic, system calls, and process behavior without a single line of application code changed.

Here we cover what eBPF actually is and why the kernel gives you visibility "for free," the 2026 eBPF stack (Cilium+Hubble for network, Pixie for APM, Tetragon for security, Beyla for OTel spans), its real limits and overhead, and when eBPF complements SDK instrumentation versus when it replaces it.

## What eBPF is, and why the kernel gives you free visibility

[eBPF (extended Berkeley Packet Filter)](https://ebpf.io/what-is-ebpf/) lets you run small, sandboxed programs directly inside the Linux kernel, without recompiling the kernel or loading a kernel module. These programs fire when a network packet arrives, a system call is made, or a process starts — meaning the data is captured at the kernel level, before it ever passes through your application's own code. The "free" part is this: you don't need a separate library per language or framework — any process that opens a TCP connection, regardless of what language it's written in, passes through the same kernel hook.

## The 2026 eBPF observability stack

eBPF has stopped being a single tool and become a set of complementary layers. [**Cilium + Hubble**](https://docs.cilium.io/en/stable/) enforces and visualizes Kubernetes network policy and service-to-service traffic flow via eBPF, replacing kube-proxy's iptables-based routing. **Pixie** delivers zero-instrumentation APM: it captures HTTP, gRPC, and database queries at the kernel level and produces traces without touching application code. **Tetragon** is security-focused: it monitors file access, process execution, and network connections in real time and can block policy violations instantly. **Beyla** converts the data it captures directly into OTel format (OTLP), so you can send spans to the Collector we cover in our [getting started with OpenTelemetry guide](/en/posts/getting-started-with-opentelemetry) without installing an SDK anywhere.

| Tool | Focus | What it delivers |
|---|---|---|
| Cilium + Hubble | Network | Kubernetes network policy + traffic visualization |
| Pixie | APM | Zero-instrumentation automatic traces and metrics |
| Tetragon | Security | Real-time process/file/network monitoring and blocking |
| Beyla | Integration | Converts kernel data to OTLP and forwards to the Collector |

## AWS EKS and Cilium: getting the claim proportioned correctly

Worth being precise here: standard EKS clusters still default to the AWS VPC CNI, not Cilium. Cilium is the default for EKS Hybrid Nodes and EKS Anywhere. Per the [official AWS EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/alternate-cni-plugins.html), on standard EC2-based EKS clusters Cilium remains an "alternate CNI" — an option you can chain with the VPC CNI or install in its place. So "AWS now runs Cilium everywhere" would overstate it; the accurate version is that AWS officially supports Cilium and made it the default for hybrid/on-prem scenarios, while it's still an optional upgrade on standard cloud-native clusters.

## The real limits and overhead

eBPF's "free" visibility isn't entirely free: every hook consumes extra CPU cycles in the kernel. JIT-compiled eBPF programs are efficient, but under heavy packet-processing loads (millions of packets per second, say) they add measurable overhead — which is why you need to benchmark against your own traffic profile before rolling it into production. eBPF is also kernel-version dependent: some features are only available on newer kernels (5.x and up), so fleets running older OS images may find themselves limited. There's also an application-logic limit: eBPF can see what's happening at the network and syscall level, but it can't answer business-logic-specific questions like "why did this function take 200ms" as well as manual SDK-based spans can.

## Where to start: a practical first step

If you're starting from scratch, don't try to stand up the whole stack at once. If you're already running Kubernetes networking through kube-proxy, try Cilium first at just the network-policy layer — the flow visualization Hubble gives you shows which service talks to which from day one, and it's a pilot you can run in parallel without ripping out your existing CNI. On the APM side, if you want zero-instrumentation visibility, install Pixie in a single namespace and observe it for a week; if the traces it produces cover what you need, expand from there. Roll Tetragon out to a staging cluster first, running policy violations in "log only, don't block" mode, rather than straight to production — that keeps false positives from cutting off real traffic.

## When eBPF complements SDK instrumentation, and when it replaces it

If you're writing a new service and want detailed, business-logic-specific traces, [OTel SDK instrumentation](/en/posts/getting-started-with-opentelemetry) is still the right tool — eBPF answers "which services did this request pass through," while the SDK answers "which step inside this service was slow." But if you have dozens of legacy services with no SDK installed that nobody wants to touch, an eBPF-based tool like Pixie gets you baseline visibility in days, with zero code changes. In practice, the most mature teams run both: deep SDK instrumentation on critical, actively-developed services, and eBPF-based baseline coverage across the rest of the fleet.

That combined approach also feeds directly into your [Kubernetes autoscaling decisions](/en/posts/kubernetes-mistakes-to-avoid) — telling apart a service that's genuinely CPU-hungry from one that just looks slow because it's stuck on I/O wait has a direct effect on how accurate your scaling decisions are. If you want to fold eBPF-based policy checks into your GitOps workflows, our [GitOps explained guide](/en/posts/gitops-explained) is a reasonable starting point.

For more observability and Kubernetes coverage, browse our [DevOps & Cloud category](/en/category/devops-cloud).

## Frequently Asked Questions

### Does eBPF replace the OpenTelemetry SDK?

Not exactly — it complements it. eBPF gives you baseline network and syscall-level visibility with zero code changes; deep, business-logic-specific traces still need SDK-based manual instrumentation. Tools like Beyla merge both into the same OTel format.

### Does AWS EKS use Cilium by default?

No. Standard EC2-based EKS clusters still default to the AWS VPC CNI. Cilium is the default, officially supported CNI for EKS Hybrid Nodes and EKS Anywhere; on standard clusters it remains an optional alternative.

### Does eBPF work on every Linux kernel version?

No. Core eBPF features exist on older kernels too, but advanced capabilities (some Cilium or Tetragon features, for example) require newer kernels, generally 5.x and up. Check your fleet's kernel version before committing to a large-scale eBPF rollout.

### Does eBPF have a noticeable performance impact in production?

At low-to-moderate traffic, the overhead is generally negligible. But on high-traffic systems processing millions of packets per second, it adds a measurable CPU cost, so benchmarking against your own traffic profile before production rollout is worth doing.
