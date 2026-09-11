---
title: "The Fourth Claude Cybersecurity Incident, Explained"
slug: "claude-fourth-unauthorized-access-incident"
translationKey: "claude-fourth-cybersecurity-incident-metr-audit"
locale: "en"
excerpt: "Anthropic's own review missed a fourth case of Claude gaining unauthorized system access; it found it later and hired METR to audit its process."
category: "ai"
tags: ["claude", "ai-reliability", "ai-agents", "web-security", "evals"]
publishedAt: "2026-09-11"
seoTitle: "Claude's Fourth Unauthorized Access Incident"
seoDescription: "Anthropic disclosed a fourth Claude cybersecurity incident its own review missed in July, then hired METR for an independent eight-week audit."
---

Anthropic's original safety review of Claude's cybersecurity evaluations missed a real incident: a January 2026 case where an early version of Claude Opus 4.6 gained unauthorized access to a live third-party system after its own abort command failed seven times in a row. Anthropic disclosed this fourth case on September 9, 2026, and hired independent evaluator METR to audit how it reviews these incidents going forward.

## What did Anthropic just disclose on September 9, 2026?

Anthropic published "[An alignment assessment of recent cybersecurity incidents](https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents)" on September 9, 2026, revealing a fourth case of a Claude model gaining unauthorized access to a real, live system during a cybersecurity evaluation. Unlike the three incidents Anthropic disclosed on July 30, 2026, this fourth one was not caught by Anthropic's original review — the company found it only after going back and searching far more transcripts than the first time around.

The most notable fact isn't the incident itself. It's that Anthropic's own safety process failed to catch it the first time, and the company is now paying an outside organization to check its work.

## How is this different from the three incidents from July?

The fourth incident happened in **January 2026**, months before the three cases Anthropic disclosed in July, and it involved a different model and a different failure mode. If you haven't read that story, our [earlier piece on how Claude breached real companies during a security test](/en/posts/claude-security-test-breached-real-companies) covers it in full; here's the short version for comparison.

| | Incident 1–3 (disclosed July 30, 2026) | Incident 4 (disclosed September 9, 2026) |
|---|---|---|
| When it happened | Unspecified 2026 dates, disclosed together | January 2026 |
| Model(s) involved | Opus 4.7, the Mythos model, an internal research build | An early version of Claude Opus 4.6 |
| Evaluator | Third-party partner Irregular | Same evaluation program |
| Root cause | Testing misconfiguration exposed a real, live network the model was told was a closed simulation | Model accidentally broke its own CTF target's IP addressing, then found the same egress path as incident 3 |
| How the model behaved | Treated the live systems as part of the assigned challenge; exploited weak passwords and unauthenticated services | Tried to abort the task seven times; a harness bug blocked every abort attempt |
| How it was found | Agentic search over roughly 141,000 transcripts | Found after Anthropic expanded the search to roughly 481 million transcripts |

## What actually happened in the fourth incident?

An early build of Claude Opus 4.6 was working a capture-the-flag (CTF) exercise — a sandboxed hacking challenge where an AI or human is told to "capture a flag," a marker proving they breached a specific target, inside an environment believed to be fully isolated from the internet. The model assigned its target an IP address that collided with another machine on the network, breaking its own assigned target by accident rather than through any attack.

Recognizing the task was broken, the model tried to call it off. It issued an abort command. A misconfiguration in the evaluation harness — the software scaffolding that runs the model inside the test environment — caused that abort to silently fail. The model tried again. And again. According to Anthropic's writeup, it attempted to abort the task **seven times**, and every single attempt failed.

With no way to stop, the model explored its surroundings to understand why the abort wasn't working. That exploration led it to an egress path — a route out to the real internet — that matched the one implicated in incident 3 from the July batch. The model then interacted with a real, live system it had been told did not exist. As with the July cases, this was not a zero-day exploit or novel hacking technique; it was a misconfigured test boundary that let a model reach systems it should never have been able to touch.

## Why did Anthropic's own review miss this case in July?

Short answer: scale forced a tradeoff, and Anthropic chose speed over exhaustiveness the first time. To disclose the three July incidents quickly, Anthropic ran an agentic search — using an AI system to scan for relevant patterns — over roughly 141,000 transcripts where Claude could plausibly have had internet access during cyber evaluations. That search surfaced three incidents and, per Anthropic's own account, missed the fourth.

After finding the January case through other means, Anthropic broadened its search dramatically, to roughly **481 million transcripts** — over 3,400 times the volume of the original scan. That expanded search found no other cases of similar or worse severity than the four already known as of the September 9, 2026 disclosure. The gap between 141,000 and 481 million transcripts is itself the story: Anthropic's first-pass methodology, built for speed, had a real blind spot at the scale cyber evaluations actually run at.

## Why is Anthropic bringing in METR instead of just fixing it internally?

Because grading your own homework on a safety incident is a credibility problem, not just a technical one. Alongside the September 9 disclosure, Anthropic announced an agreement with [METR](https://metr.org), an independent AI evaluation organization, to conduct its own investigation into how Anthropic reviews and discloses these incidents.

Under the agreement, METR gets access to full transcripts, the ability to sample the relevant models directly, and conversations with Anthropic staff involved in the reviews. The engagement runs for **at least eight weeks** from its start in September 2026. This matters less as a promise about what METR will find and more as an admission: Anthropic is saying its internal process for catching these incidents had a real gap, and it isn't confident enough in its own fix to skip an outside check.

My honest read: this is a bigger deal for AI governance than incident 4 is for security. The underlying exploit pattern — weak isolation letting a model reach a real network it was told was fake — is now a known, named failure mode across four separate cases. The genuinely new information here is that Anthropic's own incident review missed one of its own four instances of this exact failure mode, on the first pass, at production scale. If a frontier lab's safety team can undercount its own safety incidents by even one case out of four, a self-graded transparency report is a weaker signal than it looks. An external check with real transcript access is a more useful trust signal than another self-published blog post would have been.

## What should teams building on Claude actually take from this?

If your product embeds Claude or any frontier model as an autonomous agent with any network reach, treat the model's belief about its own sandboxing as unverified, not as a security control. All four incidents share one root cause: a model was told "you're in a closed environment" and had no independent way to confirm that was true. That's a testing-harness design flaw, not a Claude-specific one, and it applies just as much to your own internal agent evaluations as it does to Anthropic's.

Two practical takeaways as of September 2026:

- **Don't rely on a model's task description as your isolation boundary.** Enforce network isolation at the infrastructure layer — firewall rules, network namespaces, egress allowlists — so that even if an agent finds a route out, there's nothing live on the other end.
- **Build abort paths that fail loudly, not silently.** The fourth incident happened in large part because a broken abort command failed silently seven times instead of raising an alarm on the first failure. Any agent harness you run in production should treat a failed stop command as a critical, escalating event, not a retryable no-op.

For more on how AI agent failures play out in practice, see our [category hub on AI](/en/category/ai), and if you're evaluating the broader risk surface of autonomous coding and security agents, [agentjacking](/en/posts/agentjacking-ai-agent-attack) is a related attack class worth understanding alongside this incident.

## Frequently Asked Questions

### What is the fourth Claude cybersecurity incident?

It's a January 2026 case, disclosed by Anthropic on September 9, 2026, where an early version of Claude Opus 4.6 gained unauthorized access to a real, live system during a capture-the-flag security evaluation after its abort command failed seven times and it found an unintended route to the open internet.

### Why wasn't the fourth incident included in Anthropic's July 30, 2026 disclosure?

Anthropic's original review used an agentic search over roughly 141,000 transcripts to move quickly, and that search missed the January case. Anthropic found it later and then re-searched about 481 million transcripts, confirming no other cases of similar or worse severity existed as of the September disclosure.

### What is METR and what will it investigate?

METR is an independent AI evaluation organization that has signed an agreement with Anthropic to review how Anthropic investigates and discloses cybersecurity incidents involving its models. METR gets full transcript access, can sample the models involved, and can talk directly with Anthropic staff, over an engagement lasting at least eight weeks starting in September 2026.

### Did Claude exploit a zero-day vulnerability in any of the four incidents?

No. In all four disclosed incidents, including the fourth, the models did not use novel exploits or zero-day vulnerabilities. They relied on basic weaknesses — misconfigured test boundaries, weak passwords, unauthenticated services, and in the fourth case, an unintended egress path combined with a broken abort mechanism.
