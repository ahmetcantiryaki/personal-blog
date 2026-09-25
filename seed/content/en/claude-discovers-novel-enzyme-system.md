---
title: "Did Claude Just Discover a New Enzyme System?"
slug: "claude-discovers-novel-enzyme-system"
translationKey: "claude-enzyme-system-discovery-2026"
locale: "en"
excerpt: "Yes: Anthropic says Claude used 950 agents over 21 hours to scan 1.9 billion protein clusters, finding a new CRISPR-like enzyme system of unknown function."
category: "ai"
tags: ["claude", "ai-agents", "machine-learning", "llm"]
publishedAt: "2026-09-25"
seoTitle: "Did Claude Discover a New Enzyme System? ART Explained"
seoDescription: "Anthropic says Claude found a novel, CRISPR-like enzyme system called ART in bacteriophage genomes. Here's the method, the scale, and the open questions."
---

Short answer: yes. On September 23, 2026, Anthropic published a report saying Claude used roughly 950 agents running in parallel for 21 hours to scan 1.9 billion protein clusters, uncovering a previously undescribed enzyme system in bacteriophage (bacteria-infecting virus) genomes. The system is called ART, for array-associated reverse transcriptase, and it carries CRISPR-like regular DNA repeats — but nobody yet knows what it actually does.

## What exactly is the ART system?

ART is a three-part molecular system: a reverse transcriptase enzyme (one that copies RNA into DNA), a neighboring partner gene of unknown function, and a long array of evenly spaced DNA repeat sequences sitting beside them. According to Anthropic's research team, this specific combination of three traits has only ever been observed together in a handful of known systems — and every one of those known systems turned out to be programmable, capable of cutting, copying, and pasting DNA.

As of September 2026, ART's actual biological function has not been confirmed. Anthropic describes it as a "plausible" gene-editing tool, not a proven one. [Anthropic's own announcement](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system) is explicit about this: the finding is a hypothesis awaiting lab verification, not a finished discovery.

## How did Claude actually find this?

Anthropic's internal research system ran roughly 950 Claude agents in parallel for 21 hours, consuming about 210 million tokens in total. The agents first pulled more than 200,000 reverse transcriptase enzymes from public genomic databases, then grouped them into candidate biological systems based on structural similarity and rarity.

The process narrowed in four stages: a scan of 200,000+ enzymes, a shortlist of 3,500 candidate systems, a further cut to 20 finalists, and finally one system — ART — that received a full written report. That funnel compressed a search that would take human researchers weeks, possibly months, of manual annotation into under a single day.

| Stage | Count |
|---|---|
| Agents deployed | ~950 |
| Total runtime | 21 hours |
| Tokens spent | ~210 million |
| Protein clusters scanned | ~1.9 billion |
| Reverse transcriptases collected | 200,000+ |
| Candidate systems | 3,500 |
| Finalists reviewed in detail | 20 |
| Systems written up | 1 (ART) |

## Is this really an "AI scientific discovery," or something narrower?

Partly. Claude didn't invent a new molecule here — it autonomously detected a pattern that already existed in nature but had escaped human researchers' notice inside a dataset too large to review by hand. That's a different capability than generative AI's usual "produce new content" trick: it's pattern recognition and hypothesis-narrowing, done at a scale and speed no human team could match without the same agent infrastructure.

Our take: the real news here isn't the single enzyme — it's the pipeline. A fleet of agents that can sweep 1.9 billion data points in 21 hours makes the question "how many years would this discovery have taken a human lab" almost beside the point; the bottleneck shifts from search speed to the lab capacity needed to verify what gets found. That mirrors a broader trend in how Anthropic uses Claude internally, which we cover in [our piece on Claude now handling 26% of Anthropic's own R&D](/en/posts/ai-building-itself-claude-26-percent-rnd).

## Does this discovery carry security or biosafety risk?

Anthropic acknowledges that programmable gene-editing systems carry misuse potential, which is why it has not published ART's full sequence or activation protocol as of this writing. The company says it is sharing the finding only in a controlled way, with scientists committed to peer review.

That caution fits Anthropic's broader safety posture. Throughout 2026 the company has rolled out separate safeguard layers aimed at limiting agentic-system risk in biology and cybersecurity specifically; we cover that framework in [our piece on Anthropic's 2026 threat intelligence report](/en/posts/anthropic-2026-threat-intelligence-report).

## How does agent-driven scientific discovery actually work?

The simplified flow below captures the funnel logic Anthropic describes — the real system involves more verification steps, but the core architecture looks like this:

```text
1. Pull raw protein sequences from a genomic database (1.9B clusters)
2. Match each cluster against known enzyme families (reverse-transcriptase filter)
3. Group matching sequences with their neighboring genes (candidate systems)
4. Rank candidates by rarity and structural-similarity score
5. Write a detailed report for the top-ranked candidates (ready for human review)
```

This is a textbook agent-pipeline design: broad sweep, narrowing, prioritization, human sign-off. We cover when this kind of agent architecture beats a fixed workflow more generally in [our AI Agents vs Workflows guide](/en/posts/ai-agents-vs-workflows).

## Why should software developers care about a biology story?

It isn't a direct API or tooling change, but what it demonstrates matters: the same agent architecture — hundreds of parallel subtasks, a coordination layer merging intermediate results, a funnel down to human review — applies just as well to engineering problems like codebase auditing, vulnerability hunting, or large-dataset analysis. Anthropic using Claude this way internally for its own R&D is itself evidence of that transfer.

The scale difference is concrete too: 210 million tokens is hundreds of times a single developer's typical daily Claude Code usage. Committing that kind of budget, even at enterprise scale, requires a genuinely strong business case — and "a plausible new CRISPR-like tool" clearly cleared that bar for Anthropic.

For an engineering team, the practical takeaway is that the same funnel logic (broad sweep → narrowing → prioritization → human sign-off) can be built for a security-vulnerability sweep or a technical-debt inventory across an old codebase. The data is source code instead of biological sequences, but the architecture stays the same. Deciding exactly where a code-review agent should hand off to a human reviewer is the engineering equivalent of the funnel Anthropic used to compress 20 finalists down into one written report.

## How will this discovery actually get verified?

The next step is wet-lab testing. Anthropic's research team plans to isolate the gene encoding the ART system and express it inside a bacterial cell to test whether it can actually cut and paste DNA the way its CRISPR-like structure suggests. That process can take months — unlike the 21-hour scan Claude completed, biological verification still runs at human lab speed.

That asymmetry points to a bottleneck we're likely to see more of going forward: AI agents can dramatically accelerate how fast hypotheses get generated, but the physical experimental capacity needed to verify them doesn't scale at the same rate. Anthropic's separate efforts to expand support for scientists partly target that exact gap.

## Frequently Asked Questions

### Is the ART system Claude found actually CRISPR?

Short answer: no, not confirmed. ART carries the regular DNA repeats characteristic of CRISPR-like systems, but as of September 2026 it has no lab-verified gene-editing function; Anthropic calls it "plausible," not proven.

### Did Claude make this discovery completely autonomously?

Short answer: the scanning and narrowing process was largely autonomous — 950 agents ran for 21 hours without human intervention — but the final review of the 20 finalists and the decision to publish the finding were overseen by human researchers.

### Why hasn't the ART sequence been published?

Short answer: Anthropic says programmable gene-editing systems carry misuse risk, so it is sharing the full sequence for now only with researchers committed to peer review, rather than publishing it openly.

### How common are AI-driven discoveries like this?

Short answer: this is the first time Anthropic has publicly detailed a scientific scan at this scale (950 agents, 1.9 billion data points); combined with the company's earlier disclosure that Claude now handles 26% of its own R&D, it points to a growing trend of autonomous research use, not a one-off.

**Sources:** [Anthropic — Claude discovers a novel enzyme system](https://www.anthropic.com/news/claude-discovers-novel-enzyme-system), [Al Jazeera coverage](https://www.aljazeera.com/economy/2026/9/24/ai-model-claude-discovers-crispr-like-enzyme-system-anthropic-says), [Interesting Engineering coverage](https://interestingengineering.com/ai-robotics/claude-discovers-crispr-like-enzyme-system).
