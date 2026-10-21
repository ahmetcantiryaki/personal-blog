---
title: "How Do You Kill Serverless Cold Starts?"
slug: "kill-serverless-cold-starts"
translationKey: "serverless-cold-starts-2026"
locale: "en"
excerpt: "Short answer: use AWS SnapStart, provisioned concurrency, or a smaller deployment bundle — the right pick depends on your runtime and traffic pattern."
category: "devops-cloud"
tags: ["aws", "cloud", "performance", "cost-optimization", "devops"]
publishedAt: "2026-10-21"
seoTitle: "How Do You Kill Serverless Cold Starts?"
seoDescription: "Short answer: use AWS SnapStart, provisioned concurrency, or a smaller deployment bundle — the right pick depends on your runtime and traffic pattern."
---

Short answer: kill cold starts with one of three levers — AWS SnapStart (free on supported runtimes), provisioned concurrency (paid, keeps instances always warm), or a smaller deployment package. Which one is right depends on your function's language, how spiky your traffic is, and whether the cold start is actually visible to a user.

## What is a cold start, and why does it happen?

A cold start is the extra latency a serverless function pays the first time it runs in a brand-new execution environment. Before AWS Lambda can handle a request, it has to boot a micro-VM, load the runtime, import your function code, and run any initialization code in the global scope — all of that happens before your handler even sees the request. A function gets torn down after sitting idle for a while (typically 5–15 minutes), and the next request pays that startup cost again. A function that gets steady, frequent traffic usually stays "warm" and rarely cold-starts; one with spiky or infrequent traffic pays that cost repeatedly.

## Which languages suffer most from cold starts?

Startup cost varies by language: interpreted runtimes (Node.js, Python) generally cold-start faster than JVM-based ones (Java, .NET before SnapStart), because the environment skips a heavier runtime-loading step. Compiled, single-binary languages like Go and Rust also tend to start fast. The JVM's class-loading and just-in-time compilation steps put Java and .NET functions at the slow end of the list — which is exactly why SnapStart was built for those two language families first.

## What is AWS SnapStart, and which runtimes does it support?

SnapStart is a Lambda feature that takes a snapshot of your function's already-initialized state and caches it, restoring that snapshot on every invocation — the function resumes from an already-warmed point instead of starting from zero. SnapStart first shipped for Java 11+ in 2022, then expanded to Python 3.12+ and .NET 8+ runtimes in November 2024. In September 2026, AWS announced SnapStart support for container-packaged functions built on AWS's own base images, covering the same three language families; functions built on Node.js, Ruby, or custom base images need extra setup to qualify. SnapStart's biggest advantage: on supported runtimes, it's a configuration flag, not an added cost.

| Approach | Cost | Runtimes covered | Best fit |
|---|---|---|---|
| AWS SnapStart | No added fee | Java 11+, Python 3.12+, .NET 8+ (plus supporting container images) | Spiky traffic, on a supported language |
| Provisioned concurrency | Hourly, billed on reserved capacity | All languages | Predictable, steady traffic on critical paths |
| Smaller bundle | Engineering time | All languages | Every scenario, on top of SnapStart or provisioned concurrency |
| Keep-warm ping | Extra invocation cost | All languages, low reliability | Low-traffic, non-critical functions |

## How does provisioned concurrency fix cold starts, and what does it cost?

Provisioned concurrency tells Lambda to keep a set number of environments permanently warm and ready to invoke — those environments never shut down, so no request pays the cold-start tax. The cost is explicit: every unit of reserved capacity is billed hourly regardless of how many invocations actually happen, so the bill keeps running even if traffic drops to zero. This approach makes sense on critical paths where a cold start is directly visible to a user — checkout or authentication — and is money thrown away on a background batch function nobody is watching in real time.

## How does a smaller bundle reduce cold starts?

Lambda downloads and unpacks your deployment package before it can run your function — the bigger the package, the longer that step takes. Tree-shaking unused dependencies, importing large SDKs by their specific submodules instead of the whole package, and removing heavy initialization code from the global scope (an unused connection pool, for example) is a language-agnostic optimization that stacks with both SnapStart and provisioned concurrency.

```yaml
# Enabling SnapStart in an AWS SAM template
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: java21
      SnapStart:
        ApplyOn: PublishedVersions
      AutoPublishAlias: live
```

## Does keep-warm pinging still work?

Partially. A keep-warm ping is based on triggering the function with an empty request every few minutes so it never sits idle long enough to shut down — but it doesn't guarantee Lambda's concurrency count. One ping keeps one environment warm; if 10 concurrent requests arrive at once, 9 of them still cold-start. That makes keep-warm a reasonable extra buffer for low, predictable-concurrency, non-critical functions — it's not a substitute for provisioned concurrency on a critical, high-concurrency path like a payment flow.

## How do you actually measure cold starts?

CloudWatch's `Init Duration` metric reports exactly how long each cold start takes — without it, every optimization you make is a guess. Turning on AWS X-Ray lets you see the cold-start segment separately from the rest of the request, showing which step (runtime loading or global-scope initialization) is actually driving the cost. Applying SnapStart, provisioned concurrency, and bundle trimming all at once without measuring means you'll never know which one actually made the difference.

## Does a cold start even matter for your traffic?

No, not for every function. The real cost of a cold start depends on whether a user ever notices it: an extra 300 ms added to a background job that already takes 2–3 seconds is invisible, but that same 300 ms added to a synchronous call behind an API gateway directly hits user experience. Check whether your function's invocation pattern is steady or spiky first, then where in the user flow the cold start actually surfaces; if both are low-stakes, the optimization isn't worth the engineering time.

My own take: most teams treat cold starts as "the unavoidable cost of serverless" and never actually measure them. The same observability principle we lay out in our [cell-based architecture guide](/en/posts/cell-based-architecture-blast-radius) applies here — measure first, then decide which lever to pull. Stacking every fix at once raises your bill without a noticeably better latency number, and a provisioned-concurrency bill sitting on top of an unmeasured problem is just unnecessary fixed cost.

How your team reacts to cold starts is often really a budget question: flipping on provisioned concurrency as a "fix it and don't ask about the bill" move feels good short-term, but the same rule from our [Kubernetes cost optimization guide](/en/posts/kubernetes-cost-optimization) applies here too — any reserved capacity nobody measures turns into a line item nobody remembers six months later.

If you're deciding between serverless and container orchestration more broadly, [our comparison](/en/posts/do-you-still-need-kubernetes-2026) can help; to reduce deployment risk along the way, see our [CI/CD pipeline guide](/en/posts/how-to-build-cicd-pipeline). AWS's own [SnapStart documentation](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) and the [container image support announcement](https://aws.amazon.com/about-aws/whats-new/2026/07/aws-lambda-snapstart-container/) are the most reliable sources for current coverage.

## Frequently Asked Questions

### Is SnapStart free on every Lambda function?

On supported runtimes (Java 11+, Python 3.12+, .NET 8+), yes — SnapStart itself adds no fee, you only pay normal Lambda invocation and duration charges. Node.js functions and custom container images fall outside this coverage.

### Can you use provisioned concurrency and SnapStart together?

No. Lambda doesn't let you enable both on the same function version at once — you have to pick whichever one matches your function's traffic pattern.

### How many milliseconds does a cold start actually take?

There's no standard number; it depends on the language, memory size, number of dependencies, and whether the function runs inside a VPC. The only reliable way to learn your own function's real number is watching the `Init Duration` metric in CloudWatch.

### Is it worth optimizing cold starts for a small side project?

Usually not. On a low-traffic, non-critical project, an extra 200–500 ms rarely gets noticed; your engineering time is better spent somewhere with actual user impact.
