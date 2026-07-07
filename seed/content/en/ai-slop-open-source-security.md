---
title: "AI Slop Is Breaking Open-Source Security"
slug: "ai-slop-open-source-security"
translationKey: "ai-slop-open-source-security"
locale: "en"
excerpt: "curl's genuine-report rate cratered from over 15% to under 5% in 2025 as AI slop flooded HackerOne. Here's the signal-vs-noise fight facing maintainers."
category: "software-engineering"
tags: ["open-source", "web-security", "ai-coding", "burnout", "code-quality"]
publishedAt: "2026-07-07"
seoTitle: "AI Slop Open Source: curl's Summer of Bliss Explained"
seoDescription: "curl paused HackerOne reports for a month as AI slop swamped maintainers. The data on the signal-vs-noise crisis, and why the same AI is fixing real bugs."
---

In 2025, the share of genuine security reports reaching curl fell from over 15% to under 5%. That is not a typo. During the worst of it, roughly one in twenty submissions to one of the most security-critical projects on the internet described a real vulnerability. The rest were AI slop: fluent, confident, correctly formatted reports about code paths curl does not have, CVEs patched years ago, or bugs that simply do not exist.

On July 1, 2026, curl's lead maintainer Daniel Stenberg drew a line. From that day until August 3, curl accepts no vulnerability reports on HackerOne at all. He called it the "Summer of Bliss," and the announcement promptly went viral on [Hacker News](https://news.ycombinator.com/item?id=48537165) (793 points, 316 comments). It is a striking move for a project that ships in billions of devices. It is also the clearest signal yet that AI-generated noise is straining the unpaid people who hold open-source security together.

## What curl's "Summer of Bliss" actually is

The Summer of Bliss is a one-month, deliberate pause on inbound vulnerability reports, not a permanent shutdown. It is a maintainer buying back attention. Every slop report, dressed in the right jargon and insisting curl is one step from disaster, forces a human to read the code, confirm the claim is false, and write a rebuttal. That work is indistinguishable from real triage right up until the moment it turns out to be nothing.

The path here was not sudden. AI slop swamped curl's bug bounty through 2025, the team paused the bounty in January 2026, ran a failed GitHub-based experiment, returned to HackerOne in March, and has now simply taken a month off to breathe. As [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/curl-ending-bug-bounty-program-after-flood-of-ai-slop-reports/), by mid-2025 about 20% of all submissions were the fake, LLM-generated kind. The genuine-report rate is the number that tells the story:

| Period | Genuine-report rate | State of the queue |
|--------|--------------------|--------------------|
| Before 2025 | >15% | Normal signal-to-noise |
| Mid–late 2025 | <5% | Slop flood, ~20% pure AI slop |
| January 2026 | — | Bounty paused |
| March 2026 | 15–16% | Recovered, back on HackerOne |
| July 2026 | — | Summer of Bliss (voluntary pause) |

Here is the twist the headlines skip: by March 2026 the slop was largely gone and confirmation rates had recovered to pre-slop levels. Reports now arrive at roughly double the 2025 rate, which was already double the years before. The problem in July 2026 is no longer garbage. It is sheer volume against a tiny team.

## The uncomfortable other half: AI is also fixing curl's bugs

If this were only a story about AI producing garbage, it would be easy. It is not. In the same breath that Stenberg says [AI is DDoSing open source](https://thenewstack.io/curls-daniel-stenberg-ai-is-ddosing-open-source-and-fixing-its-bugs/), he credits AI security tooling for real, merged results.

AI-assisted scanners such as AISLE, ZeroPath, and Codex Security have contributed on the order of 200 to 300 merged bugfixes to curl, along with roughly a dozen genuine CVEs. The models that used to hallucinate vulnerabilities are now, when driven properly, finding real ones. That is the contrarian nuance worth sitting with: the exact technology flooding the inbox with noise is also, in different hands, surfacing legitimate defects that human reviewers missed.

The distinction is not "AI good" or "AI bad." It is *who is holding the tool and whether a competent human stands behind the output*. A researcher who runs a scanner, verifies the finding, reproduces it, and writes a precise report adds signal. A prompt-and-paste "hacker" chasing a bounty with an unverified LLM transcript adds noise. Same model, opposite value. This is the same discipline that separates useful assistance from liability in day-to-day coding, which we cover in [7 mistakes when using AI coding assistants](/en/posts/ai-coding-assistant-mistakes).

## Why unpaid maintainers are the pressure point

The Hacker News thread quickly moved past curl to the structural issue: critical internet infrastructure depends on individuals working for free. curl is a volunteer-led project embedded in operating systems, cars, phones, and cloud platforms worldwide. When an asymmetric cost lands on that model, it lands hard.

And the cost here is deeply asymmetric. Generating a plausible slop report takes seconds and no expertise. Disproving one takes a qualified maintainer's focused time and, worse, their trust. Every false alarm makes the next report a little more likely to be waved through or a little more likely to be dismissed, and both failure modes are dangerous in security work. This is textbook burnout fuel: high-stakes, thankless, endlessly interruptible labor. If you manage or mentor maintainers, our guide on [how to avoid burnout as a developer](/en/posts/avoid-developer-burnout) applies directly to volunteer security triage.

My opinionated take: bug-bounty platforms, not maintainers, should own this problem. The economic incentive to submit slop exists because payouts reward volume-with-a-chance over verified quality. Until platforms charge reputational or monetary stake for submissions and penalize confirmed slop, individual projects will keep absorbing a cost that was designed into the system above them.

## How projects can filter signal from noise

You cannot stop people from pointing an LLM at your repo. You can raise the cost of wasting your time. As of July 2026, the tactics maintainers are converging on fall into three layers.

**1. Triage gates at intake.** Require a reproduction before a report enters the human queue. A structured template that demands a failing command, an affected version, and expected-versus-actual output filters most slop automatically, because slop rarely reproduces.

```yaml
# .github/ISSUE_TEMPLATE/security.yml — force proof, not prose
- type: input
  id: curl-version
  attributes: { label: "Affected version (curl -V output)" }
  validations: { required: true }
- type: textarea
  id: repro
  attributes:
    label: "Exact command that reproduces the issue"
    placeholder: "curl --with-flags https://... → observed vs expected"
  validations: { required: true }
- type: checkboxes
  id: attestation
  attributes:
    label: "Attestation"
    options:
      - label: "I reproduced this on a supported version and did not paste unverified AI output"
        required: true
```

**2. Reputation weighting.** Route reports from first-time, zero-history accounts into a slower lane, and fast-track researchers with a track record of confirmed findings. Reputation is the cheapest signal you have, and it costs the submitter something to build.

**3. AI-assisted pre-screening.** Fight fire with fire. A model can cross-check a claimed vulnerability against the actual codebase and flag reports that reference nonexistent functions or already-patched CVEs before a human ever opens them. The point is not to auto-close, but to rank the queue so the maintainer's first hour goes to the most likely real report. Because these screeners can themselves be wrong, keep a human on the final call and verify the reasoning, much as our guide to [reducing LLM hallucinations in production](/en/posts/reduce-llm-hallucinations) recommends.

None of this is exotic. It is the same "make the machine, not the reviewer, enforce the invariant" instinct behind [writing unit tests that actually help](/en/posts/how-to-write-unit-tests) and shipping to a [clean code checklist](/en/posts/clean-code-principles-checklist): push verification to the earliest, cheapest gate. For more on the engineering culture behind these habits, browse the [software engineering](/en/category/software-engineering) category.

The curl story is not an argument against AI in security. It is an argument for keeping a competent, rested human in the loop, and for redesigning the incentives so that human is not the only line of defense against an infinite supply of confident nonsense.

## Frequently Asked Questions

### What is curl's "Summer of Bliss"?

It is a deliberate, one-month pause during which curl accepts no vulnerability reports on HackerOne, running from July 1 to August 3, 2026. Lead maintainer Daniel Stenberg introduced it to give his small team relief from the flood of AI-generated "slop" reports. It is a temporary breather, not the end of curl's security process, and reports resume in August.

### What is "AI slop" in the context of security reports?

AI slop is a low-quality, LLM-generated vulnerability report that looks legitimate but describes nothing real: code paths the project does not have, CVEs patched years ago, or invented bugs. It is dangerous precisely because it is fluent and correctly formatted, so a human maintainer has to read the code and disprove it. At its 2025 peak, about 20% of curl's submissions were this kind of report.

### Is AI purely harmful to open-source security?

No, and that is the key nuance. The same wave of AI tooling that produced the slop is also finding real bugs. AI-assisted scanners like AISLE, ZeroPath, and Codex Security have contributed roughly 200 to 300 merged fixes and about a dozen genuine CVEs to curl. The deciding factor is whether a competent human verifies the output before submitting it.

### How can maintainers filter slop from genuine reports?

Use three layers: triage gates that require a working reproduction before a report reaches the human queue, reputation weighting that slows down zero-history accounts and fast-tracks proven researchers, and AI-assisted pre-screening that ranks the queue by likelihood a report is real. Keep a human on the final decision. Together these raise the cost of submitting noise without blocking legitimate researchers.
