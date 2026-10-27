---
title: "Draft Landing-Page Variants to A/B Test With Claude"
slug: "draft-landing-page-variants-to-ab-test-with-claude"
translationKey: "landing-page-variants-claude-ab-test"
locale: "en"
excerpt: "Short answer: don't ask Claude for random variants — define one hypothesis first, then point Claude at writing only the copy that isolates that hypothesis."
category: "digital-marketing"
tags: ["claude", "ab-testing", "conversion-optimization"]
publishedAt: "2026-10-27"
seoTitle: "How to Draft Landing-Page A/B Test Variants With Claude"
seoDescription: "A practical workflow for prompting Claude to write hypothesis-driven landing-page variants, wiring them into a test tool, and reading results correctly."
---

Short answer: instead of asking Claude for "five different headlines," define the single hypothesis you're testing first — for example, "a headline with a concrete number converts better than an abstract promise" — then have Claude write exactly one control and one challenger variant that isolates that hypothesis. Randomly generated variants can still produce a statistically significant result, but you won't know why it won — and without that, you can't design your next test.

## What should you actually vary on a landing page?

Five elements drive most test outcomes: the headline (hook), the opening promise, the call-to-action copy, social proof (testimonials, logos, numbers), and the offer itself (price, duration, guarantee). Changing all of them at once makes it impossible to know which change drove the result — so isolating one element per test round is worth more than changing five elements at once to get a "better-looking page."

| Element tested | Example hypothesis | What it measures |
|---|---|---|
| Headline | "A number-led headline beats an abstract promise" | First impression, attention |
| CTA copy | "'Try It Free' outperforms 'Sign Up'" | Threshold to take action |
| Social proof | "A customer logo builds more trust than a star rating" | Trust formation |
| Offer framing | "Monthly price feels less steep than an annual total" | Price perception |

## How do you get Claude to write hypothesis-driven variants instead of random ones?

Write the hypothesis down first, then feed it to Claude as the opening line of your prompt — an open-ended request like "write me different headlines" won't produce a testable comparison. A structure like this forces Claude to produce a control and a challenger under the same frame, varying only the tested variable:

```text
Hypothesis: A concrete number in the headline (duration, percentage, amount)
drives more clicks and form fills than an abstract benefit promise.

Control (current): "The Smart Way to Grow Your Business"
Challenger: Write exactly one alternative in the same tone and length as the
control, but adding one measurable number (duration, percentage, or amount)
to the headline. Don't change the subheadline, CTA, or any other page copy.
```

This structure forces Claude to isolate a single variable — otherwise the model tends to produce a "better" version of the copy that changes tone, length, and the promise all at once, which contaminates your test.

## How do you wire the variants into a test tool?

Paste the generated variant copy directly into your test tool's variant field (an experimentation platform or a simple server-side redirect); when you copy Claude's output onto the page by hand, don't change typography, spacing, or button styling — visual differences add an extra variable that defeats the point of testing the copy hypothesis. Before launching, confirm both variants draw traffic from the same source (the same ad campaign, for instance); comparing traffic from different sources means you're comparing two different audiences, not running an A/B test.

## How do you calculate the sample size you actually need?

The required sample size depends on three inputs: the control variant's baseline conversion rate, the minimum detectable effect (MDE) you want to catch, and the statistical power you're willing to accept. Standard settings are 80% power and 95% significance (alpha = 0.05), which keeps the risk of missing a real effect at 20% and the false-positive risk at 5%. A worked example: detecting a 10% relative lift from a 30% baseline conversion rate (i.e., to 33%) under those settings needs roughly 3,692 visitors per variant — a typical output from standard tools like Evan Miller's sample size calculator.

Chasing a smaller effect requires a much bigger sample: trying to detect just a 5% relative lift from the same baseline multiplies the required traffic several times over. That's a real practical problem on a low-traffic site — our guide on [A/B testing a low-traffic site](/en/posts/ab-testing-cro-small-sites) covers why testing bigger, more dramatic changes makes more sense than running a long test for a small effect in that situation.

## How do you read results without fooling yourself?

Don't stop the test before reaching your calculated sample size — stopping early because "it looks significant right now" meaningfully raises your false-positive risk, because the significance threshold fluctuates over time and can cross the line at a random moment. Drawing a conclusion before the test's pre-set duration or sample target completes is a well-documented mistake known as p-hacking, and most teams do it without realizing it. When you do read results, look at the confidence interval, not just the conversion rate: even a statistically significant difference between variants can have limited practical importance if that interval is wide.

## How should you design the next test after a variant loses?

Before writing off a losing variant as "it just didn't work," ask why the hypothesis didn't hold — there are three possibilities: the hypothesis was wrong, the hypothesis was right but the execution (the actual copy) was weak, or the test ended before reaching an adequate sample size. To tell these apart, try a second round where you have Claude rewrite the same hypothesis in a different tone or structure; if that second execution also loses, the odds rise that the hypothesis itself is the problem. This loop — form a hypothesis, have Claude write an isolated variant, test it, interpret the result against the hypothesis — compounds what you learn each round in a way that a process built on random variants never does.

Keeping a running log of tests (hypothesis, variant copy, result, confidence interval) builds a "what actually works" library over time. Six months later, when you're writing a new page, pulling from that library gives you a much faster starting point than generating a hypothesis from scratch — especially once a recurring pattern shows up, like "number-led headlines consistently win with this audience."

## When does AI-written copy underperform human copy?

On pages that need a brand-specific voice, a customer story, or industry-specific vocabulary, Claude's output tends to drift toward a safe, generic average — which is exactly where it sometimes loses to human copy in test results. My own observation: Claude performs strongly on narrow, hypothesis-driven variants (a headline, a CTA line), but on full-page rewrites that need long-form sales copy or emotional storytelling, a version from an experienced copywriter usually wins. Use AI for narrow, testable variants — not for rewriting the whole page.

## Frequently Asked Questions

### How specific should I be when asking Claude to write an A/B test variant?

Define a single hypothesis clearly, and tell Claude to change only that one variable while holding everything else (tone, length, other page elements) constant. Open-ended requests like "write me different headlines" don't produce a testable comparison.

### How do I calculate the minimum sample size for an A/B test?

You need your baseline conversion rate, the minimum detectable effect (MDE) you want to catch, and your target statistical power (typically 80%) and significance level (typically 95%). Standard tools like Evan Miller's sample size calculator turn those inputs into a required visitor count per variant.

### Can I stop a test early once it looks significant?

No — stopping before you reach your pre-calculated sample size meaningfully raises your false-positive risk. The significance threshold fluctuates over the course of a test, and an early snapshot can be misleading.

### When does AI-written copy underperform human-written copy?

On full-page rewrites that need brand-specific voice, emotional storytelling, or long-form sales copy, AI text often loses to human copy in test results. AI performs better on narrow, hypothesis-driven variants like a single headline or CTA line.
