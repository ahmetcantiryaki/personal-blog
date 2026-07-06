---
title: "How to Evaluate LLM Outputs with Evals"
slug: "how-to-evaluate-llm-outputs"
translationKey: "evaluate-llm-outputs"
locale: "en"
excerpt: "Learn how to evaluate LLM outputs with evals: build a gold set, pick metrics, run code-based and LLM-as-judge checks, and gate every deploy on real numbers."
category: "ai"
tags: ["llm", "evals", "ai-reliability", "testing"]
publishedAt: "2026-06-28"
seoTitle: "How to Evaluate LLM Outputs with Evals"
seoDescription: "How to evaluate LLM outputs with evals: build a gold dataset, choose metrics, run code and LLM-as-judge checks, and gate deploys on scores. Real numbers inside."
---

To evaluate LLM outputs, build a fixed dataset of real inputs with known-good answers, define pass/fail metrics, then score every model or prompt change against it with automated evals. That is the whole game: turn "the output looks fine" into a number you can track, compare, and gate a deploy on. Evals are unit tests for probabilistic systems.

We ship LLM features every week, and the single biggest reliability upgrade was not a better model. It was a proper eval suite. Below is the exact process, the metrics we trust, and where it broke.

## What are LLM evals, and why do you need them?

An LLM eval is an automated test that scores a model's output against a defined expectation, so you can measure quality objectively instead of eyeballing samples. You run it on a fixed dataset every time you change a prompt, model, or retrieval step, and you compare the score to the last run.

Without evals you are flying blind. A prompt tweak that fixes one case silently breaks three others, and you only find out when a user complains. Manual spot-checking does not scale past a handful of examples and is not repeatable.

Evals give you three things:

- **Regression safety.** Catch quality drops before they reach production.
- **Comparability.** Decide objectively whether GPT-5.1 beats Claude Opus 4.8 *for your task*, not on a public leaderboard.
- **A shared definition of "good."** Your team argues about the rubric once, then the numbers settle disputes.

## How do you evaluate LLM outputs, step by step?

Evaluating LLM outputs is a repeatable pipeline: collect real inputs, label the correct outputs, pick metrics, run graders, and gate deploys on the score. Follow these eight steps to go from zero to a working eval suite.

1. **Collect a gold dataset.** Pull 50-200 real inputs from logs or support tickets. Include the ugly edge cases, not just the happy path. This set is your ground truth.
2. **Label expected outputs.** Write the correct answer or acceptance criteria for each input. A human expert does this once; it is the most valuable asset in the whole system.
3. **Choose metrics per task.** Classification uses accuracy and F1. Extraction uses exact match on fields. Open-ended generation needs an LLM judge or a rubric. Match the metric to the output shape.
4. **Write graders.** Prefer code-based checks (regex, JSON schema, string match) wherever the answer is deterministic. They are fast, free, and never flake.
5. **Add an LLM-as-judge for subjective quality.** For tone, helpfulness, or faithfulness, have a strong model score the output against a rubric with a 1-5 scale and a required justification.
6. **Run the full suite.** Execute all cases, record per-case pass/fail plus an aggregate score. Save the run so you can diff against it later.
7. **Set a threshold and gate.** Block the deploy if the score drops below your bar (we use 90% pass on the core set). Treat a red eval like a failing test.
8. **Grow the set from failures.** Every production bug becomes a new eval case. The suite gets stronger exactly where you got burned.

## Which eval methods should you use?

Pick the grading method that matches how deterministic the output is. Deterministic outputs get cheap code checks; subjective outputs need a judge. Most real suites mix all three below.

| Method | Best for | Cost | Reliability | Example |
|--------|----------|------|-------------|---------|
| Exact match | Classification, labels | Free | Very high | Is intent == "refund"? |
| Schema / regex | Structured extraction | Free | Very high | Valid JSON with `amount` field? |
| Semantic similarity | Paraphrased answers | Low | Medium | Embedding cosine > 0.85 |
| LLM-as-judge | Tone, faithfulness | Medium | Medium-high | "Rate helpfulness 1-5" |
| Human review | Final sign-off, calibration | High | Highest | Weekly sample audit |

Start at the top of the table and only reach for the expensive rows when the cheap ones cannot express your criterion. We grade roughly 70% of our cases with pure code, which keeps a full eval run under 30 seconds and near-zero cost.

## What does a real eval look like in code?

Here is a trimmed version of the harness we run in CI. It loads a JSONL gold set, calls the model, and applies a code grader plus an optional judge.

```python
import json
from statistics import mean

def grade_case(case, output):
    # Code-based grader: deterministic and free
    if case["type"] == "extraction":
        try:
            parsed = json.loads(output)
        except json.JSONDecodeError:
            return 0.0
        return 1.0 if parsed.get("amount") == case["expected"]["amount"] else 0.0
    # Fall back to LLM-as-judge for open-ended answers
    return llm_judge(case["input"], output, case["rubric"])

def run_evals(dataset, model):
    scores = []
    for case in dataset:
        output = model(case["input"])
        score = grade_case(case, output)
        scores.append(score)
        if score < 1.0:
            print(f"FAIL: {case['id']} -> {output[:80]}")
    return mean(scores)

data = [json.loads(l) for l in open("gold_set.jsonl")]
score = run_evals(data, my_model)
assert score >= 0.90, f"Eval regressed to {score:.2%}"
```

The `assert` at the end is the gate. Wire it into CI and a bad prompt never merges. If you already test other code this way, evals slot right into the same mindset as [writing solid unit tests](/blog/how-to-write-unit-tests).

## How do you keep LLM-as-judge honest?

An LLM judge drifts, so you calibrate it against human labels before you trust it. Score 20-30 cases by hand, run the judge on the same cases, and measure agreement. If the judge agrees with humans below ~85% of the time, tighten the rubric or switch judge models.

What broke for us: our first judge rated almost everything a 4 or 5 because the rubric said "rate the quality." Vague rubrics produce vague scores. Rewriting it as explicit binary criteria ("Does the answer cite a source? Y/N. Does it stay on topic? Y/N.") pushed judge-human agreement from 72% to 94%.

Three rules that keep judges reliable:

- **Force a justification** before the score. Reasoning-first grading is measurably more consistent.
- **Use a different, stronger model** as judge than the one under test, to avoid a model rubber-stamping its own style.
- **Recalibrate whenever you change the judge model.** A judge upgrade is a silent scoring change.

For the prompt structure behind good judges, our notes on [prompt engineering patterns](/blog/prompt-engineering-patterns) cover the rubric and few-shot tricks we rely on.

## Where do evals fit in your reliability stack?

Evals are the measurement layer under every other reliability tactic. They tell you whether grounding, retrieval, or a refusal threshold actually helped, or just moved the failure around. Pair them with the defenses in our guide to [reducing LLM hallucinations](/blog/reduce-llm-hallucinations), and if your feature depends on retrieval, eval that separately using the ideas in [how to build a RAG system](/blog/how-to-build-rag-system).

Run evals on three triggers: every prompt or model change, on a nightly schedule against fresh production samples, and before any deploy. The full cluster lives on the [AI](/blog/ai) hub.

## Frequently Asked Questions

### How many examples does an LLM eval set need?

Start with 50-100 well-chosen cases that cover your real failure modes, not thousands of random ones. Coverage of edge cases matters far more than volume. Grow the set every time production surfaces a new bug; a curated 150-case set beats an unfiltered 2,000-case dump.

### What is the difference between evals and benchmarks?

Benchmarks like MMLU measure general model capability on public datasets. Evals measure *your* model on *your* task with *your* data. A model can top every benchmark and still fail your extraction schema. Always evaluate LLM outputs against your own gold set before trusting a leaderboard.

### Can I use an LLM to evaluate LLM outputs?

Yes, LLM-as-judge is standard for subjective qualities like tone and faithfulness, but you must calibrate it against human labels first and force it to justify each score. Use code-based graders for anything deterministic, and reserve the judge for outputs you genuinely cannot check with a rule.

### How often should I run evals?

Run the full suite on every prompt or model change and block the merge if the score regresses. Add a nightly run against fresh production samples to catch drift, plus a weekly human audit on a small sample to keep your judges calibrated.
