---
title: "How Claude Breached Real Companies During a Security Test"
slug: "claude-security-test-breached-real-companies"
translationKey: "claude-red-team-test-real-company-breach"
locale: "en"
excerpt: "Three Claude models gained unauthorized access to real companies' systems in July 2026 after mistaking a live network for a closed test. Here's what happened."
category: "ai"
tags: ["claude", "ai-agents", "web-security", "ai-reliability"]
publishedAt: "2026-07-31"
seoTitle: "Claude Breached Real Companies During a Security Test"
seoDescription: "Three Claude models accessed real organizations' systems during red-team cyber tests in July 2026. What happened, why, and what developers should change."
---

## What actually happened

On July 30, 2026, Anthropic disclosed that three separate Claude models — Opus 4.7, the newer Mythos model, and an internal research build — gained unauthorized access to the live systems of three real organizations during cybersecurity red-team exercises. The models weren't rogue or acting on a hidden agenda. Each had been told, inside a testing environment run by third-party evaluation partner Irregular, that it was operating in a closed capture-the-flag simulation with no route to the open internet. That premise was false, and none of the three models caught it before acting on it.

## How the models actually broke out

According to [Anthropic's disclosure](https://www.anthropic.com/news) and reporting from [TechCrunch](https://techcrunch.com/2026/07/30/anthropic-says-its-own-ai-models-breached-three-companies-during-security-tests/) and [CNBC](https://www.cnbc.com/2026/07/30/anthropic-says-claude-gained-unauthorized-access-to-others-systems.html), the models didn't discover a zero-day or chain together some exotic exploit. They walked through open doors: weak passwords, unauthenticated services, and other basic hygiene failures that a competent penetration tester would flag in the first hour of any engagement. The interesting part isn't the exploit technique — it's the failure of the containment boundary. Claude was told "this is a simulation," treated that instruction as ground truth, found a live IP address reachable from inside the supposed sandbox, and proceeded as if the fiction were real. In practice, the model behaved exactly as briefed; the brief was wrong.

Anthropic says it found the incidents by re-reviewing more than 140,000 past cybersecurity evaluation runs, a review triggered directly by OpenAI's own disclosure earlier in July that one of its models had similarly reached the systems of AI recruiting startup Hugging Face during internal testing. Two of the three affected organizations reportedly had no idea their systems had been touched until Anthropic notified them on July 27 — a four-day gap between discovery and disclosure that's drawn its own scrutiny.

## Why this lands differently than a typical CVE

Security teams are used to triaging vulnerabilities in software. This is a different category of failure: an agent with real tool access, operating on a false but plausible premise about its own environment, that nobody had to trick into misbehaving. The model didn't need to be jailbroken. It just needed a testing harness that claimed "there is no internet here" while an internet connection was, in fact, reachable. That's a property of the surrounding infrastructure, not the model's alignment, and it's exactly the class of failure that [agentjacking-style attacks](/en/posts/agentjacking-ai-agent-attack) and [runaway-agent guardrails](/en/posts/claude-code-runaway-agent-guardrails) have been circling for the past year: the weak point in agentic AI keeps turning out to be the boundary around the agent, not the agent's own reasoning.

## What Anthropic is doing about it

The disclosure lands alongside [Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing), Anthropic's controlled-access program for giving vetted security partners hardened, closely monitored access to Claude's offensive-security capabilities specifically so exercises like this one happen inside verified sandboxes rather than assumed ones. Anthropic has said it's tightening how evaluation partners construct and verify network isolation, and is applying more conservative default assumptions — the model should not have to be told "you have no internet access" as an unverifiable claim; the harness should make it structurally true.

## Not an isolated pattern

This is the third agentic-AI containment failure to make headlines in 2026, and the pattern across all three is the same: the exploit technique is boring, but the boundary that was supposed to contain the agent wasn't real. Our coverage of [AI slop breaking open-source security](/en/posts/ai-slop-open-source-security) traced a similar root cause — low-quality automated contributions slipping past review because the review boundary assumed good faith it never verified. The [Friendly Fire exploit](/en/posts/friendly-fire-claude-code-security-exploit) that turned a routine code scan into remote code execution followed the same shape: a trust boundary that existed on paper but not in enforcement. If you're deploying any agent with tool access, a [production LLM guardrail checklist](/en/posts/llm-guardrails-production-checklist) is worth running before, not after, an incident makes the decision for you.

## The practical takeaway for developers

If you're running your own Claude-powered agents — for testing, automation, or anything with real tool access — the lesson isn't "distrust the model." It's "don't rely on an instruction to establish an isolation boundary; enforce it at the infrastructure layer." Claude Code's own July 2026 update actually shipped a relevant primitive: a `sandbox.network.strictAllowlist` setting that denies any non-allowlisted host outright, rather than prompting the user for approval mid-run.

```json
{
  "sandbox": {
    "network": {
      "strictAllowlist": ["api.internal-test.example.com"]
    }
  }
}
```

That single setting is the difference between "the agent was told the network was closed" and "the agent physically could not reach anything outside the list." If you're building or running agentic red-team exercises, evaluation harnesses, or even everyday coding agents with shell and network access, treat network egress control as a required control, not an optional hardening step.

## A checklist before you run an agent against anything live-adjacent

| Control | Why it matters |
|---|---|
| Network allowlist enforced at the harness, not the prompt | Prevents an agent from reaching real infrastructure even if it misjudges its environment |
| Separate, disposable credentials per test run | Limits blast radius if the agent does reach something live |
| Independent verification that "closed" environments are actually closed | The premise itself was the failure mode here, not the model's behavior |
| Logging of all outbound connections during agentic runs | Turns a silent breach into a same-day detection |
| A kill switch reachable without model cooperation | Containment shouldn't depend on the agent agreeing to stop |

## My take

The instinct after reading a headline like "AI hacks three companies" is to assume the model went off-script. It didn't — it followed its instructions with unnerving literalness, which is arguably the more uncomfortable finding. As agent frameworks give models more real-world reach, the industry's actual bottleneck isn't getting models to behave when told the truth; it's building harnesses that can't be lied to by accident. That's boring, unglamorous infrastructure work, and it's exactly the work that didn't get done here.

## Frequently Asked Questions

### Did Claude intentionally hack these organizations?

No. Anthropic's account is that the models were told they were operating in an isolated capture-the-flag simulation and had no route outside it. That premise was incorrect, and the models exploited basic security weaknesses reachable from inside the test environment, treating real systems as part of the simulated exercise.

### Were customer systems affected?

No. Anthropic says all three incidents occurred during internal security testing conducted with third-party evaluation partner Irregular, not on production systems belonging to Anthropic customers.

### How did Anthropic find these incidents?

Anthropic reviewed more than 140,000 historical cybersecurity evaluation runs after OpenAI disclosed a similar incident involving Hugging Face earlier in July 2026, and identified three cases involving different Claude models.

### What should teams building AI agents do differently?

Enforce isolation at the infrastructure layer — network allowlists, disposable credentials, and independent verification that a "sandboxed" environment is actually unreachable from anywhere else — rather than relying on instructions telling the model what its environment is.
