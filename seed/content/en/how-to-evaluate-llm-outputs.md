---
title: "How to Evaluate LLM Outputs with Evals"
slug: "how-to-evaluate-llm-outputs"
translationKey: "evaluate-llm-outputs"
locale: "en"
category: "ai"
tags: ["llm", "evals", "ai-reliability", "testing"]
publishedAt: "2026-07-02"
excerpt: "Evaluate LLM outputs the way you test code: build a gold set, pick metrics, run code and LLM-as-judge checks, and gate every deploy on a number. With current July 2026 tools."
seoTitle: "How to Evaluate LLM Outputs with Evals (2026)"
seoDescription: "How to evaluate LLM outputs with evals: build a gold dataset, choose metrics, run code and LLM-as-judge checks, and gate deploys on scores. Fresh 2026 tooling and numbers."
---

On a Tuesday in June 2026 a teammate shipped a one-word prompt change to our support classifier: "categorize" became "classify" to match our docs. Harmless. It merged green because nobody ran the eval suite locally. Forty minutes later, refund tickets started landing in the billing queue. The model had quietly read "classify" as a narrower instruction and dropped about 6% of refund intents on the floor.

The fix was not a smarter model. It was a gate. To evaluate LLM outputs reliably you build a fixed dataset of real inputs with known-good answers, define pass/fail metrics, then score every prompt or model change against it automatically. That is the whole game: turn "the output looks fine" into a number you can track, compare, and block a deploy on. Evals are unit tests for probabilistic systems.

We ship LLM features every week, and our single biggest reliability upgrade was a proper eval suite, not a better model. Below is the exact process, the metrics we trust, and the current tooling as of July 2026.

## What are LLM evals, and why do you need them?

An LLM eval is an automated test that scores a model's output against a defined expectation, so you measure quality objectively instead of eyeballing samples. You run it on a fixed dataset every time you touch a prompt, model, or retrieval step, and you diff the score against the last run.

Without evals you fly blind. A tweak that fixes one case silently breaks three others, and you learn about it from an angry user. Manual spot-checking does not scale past a handful of examples and is never repeatable.

Evals give you three things:

- **Regression safety.** Catch quality drops before they reach production, like our routing bug above.
- **Comparability.** Decide objectively whether GPT-5.5 beats Claude Opus 4.8 *for your task*, not on a public leaderboard. As of July 2026 Opus 4.8 leads LLM Stats' aggregate at 67.9 to GPT-5.5's 62.9, but that ranking says nothing about your extraction schema.
- **A shared definition of "good."** Your team argues about the rubric once, then the numbers settle disputes.

## How do you evaluate LLM outputs, step by step?

Evaluating LLM outputs is a repeatable pipeline: collect real inputs, label the correct outputs, pick metrics, run graders, and gate deploys on the score. These eight steps take you from zero to a working suite.

1. **Collect a gold dataset.** Pull 50–200 real inputs from logs or support tickets. Include the ugly edge cases, not just the happy path. This set is your ground truth.
2. **Label expected outputs.** Write the correct answer or acceptance criteria for each input. A human expert does this once; it is the most valuable asset in the system.
3. **Choose metrics per task.** Classification uses accuracy and F1. Extraction uses exact match on fields. Open-ended generation needs an LLM judge or a rubric. Match the metric to the output shape.
4. **Write graders.** Prefer code-based checks (regex, JSON schema, string match) wherever the answer is deterministic. They are fast, free, and never flake.
5. **Add an LLM-as-judge for subjective quality.** For tone, helpfulness, or faithfulness, have a strong model score the output against a rubric with a 1–5 scale and a required justification.
6. **Run the full suite.** Execute every case, record per-case pass/fail plus an aggregate score, and save the run so you can diff against it later.
7. **Set a threshold and gate.** Block the deploy if the score drops below your bar; we use 90% pass on the core set. Treat a red eval like a failing test.
8. **Grow the set from failures.** Every production bug becomes a new eval case. That refund misfire is now case #147. The suite gets stronger exactly where you got burned.

## Which eval methods should you use?

Pick the grading method that matches how deterministic the output is. Deterministic outputs get cheap code checks; subjective outputs need a judge. Most real suites mix all three.

| Method | Best for | Cost | Reliability | Example |
|--------|----------|------|-------------|---------|
| Exact match | Classification, labels | Free | Very high | Is intent == "refund"? |
| Schema / regex | Structured extraction | Free | Very high | Valid JSON with `amount` field? |
| Semantic similarity | Paraphrased answers | Low | Medium | Embedding cosine > 0.85 |
| LLM-as-judge | Tone, faithfulness | Medium | Medium-high | "Rate helpfulness 1–5" |
| Human review | Final sign-off, calibration | High | Highest | Weekly sample audit |

Start at the top and only reach for the expensive rows when the cheap ones cannot express your criterion. We grade roughly 70% of our cases with pure code, which keeps a full run under 30 seconds and near-zero cost. My opinionated take: if more than half your suite runs through a judge, your task is more structured than you admit, and you are paying latency and money for checks a regex would nail.

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

The `assert` at the end is the gate. Wire it into CI and a bad prompt never merges. If you already test other code this way, evals slot into the same mindset as [writing solid unit tests](/en/posts/how-to-write-unit-tests).

## Which eval tools are worth using in 2026?

You do not have to hand-roll everything. The landscape settled this year into a familiar shape: a lightweight framework for CI gating paired with a platform for annotation.

| Tool | Type | Best for | CI gating | July 2026 note |
|------|------|----------|-----------|----------------|
| OpenAI Evals | OSS (MIT) | Reproducible benchmark-style runs | Manual | ~18.5k GitHub stars |
| DeepEval | OSS | Metric-rich unit tests | Native, pytest-style | v4.0.3, 50+ metrics, agent traces |
| Inspect AI | OSS | Rigorous, auditable evals | Yes | v0.3.225, from the UK AI Security Institute |
| Braintrust | Commercial | Datasets + regression dashboards | GitHub Action blocks merges | $80M Series B in Feb 2026 |
| Promptfoo | Commercial | Red-team and security testing | Declarative CLI | Acquired by OpenAI, March 2026 |
| LangSmith | Commercial | LangChain/LangGraph tracing | Yes | Plus plan ~$39/seat/mo |

Most engineering-led teams pick one open-source runner for the CI gate and one platform for human review. We run [DeepEval](https://github.com/confident-ai/deepeval) in CI and keep a [Braintrust](https://www.braintrust.dev/) dashboard for the weekly audit. If you want the most auditable open-source runner, [Inspect AI](https://inspect.aisi.org.uk/) from the UK AI Security Institute is hard to beat, and [OpenAI Evals](https://github.com/openai/evals) remains the reference for benchmark-style registry runs. Whatever you choose, the gate lives in your pipeline, not a vendor's UI.

## How do you keep LLM-as-judge honest?

An LLM judge drifts, so you calibrate it against human labels before you trust it. Score 20–30 cases by hand, run the judge on the same cases, and measure agreement. The bar to clear is human-human agreement itself: strong judges land around 80%, the same rate at which two people agree. Below ~85% for your task, tighten the rubric or switch judge models.

What broke for us: our first judge rated almost everything a 4 or 5 because the rubric said "rate the quality." Vague rubrics produce vague scores. Rewriting it as explicit binary criteria ("Does the answer cite a source? Y/N. Does it stay on topic? Y/N.") pushed judge-human agreement from 72% to 94%.

Watch the bias literature, too. A 2026 RAND study found no judge is uniformly reliable across benchmarks, and frontier models blow past 50% error on the hardest bias probes. Position bias alone swings 10–15 points of win rate on close pairwise calls, so if you compare two answers A-versus-B, run each pair both ways and average.

Three rules that keep judges reliable:

- **Force a justification** before the score. Reasoning-first grading is measurably more consistent.
- **Use a different, stronger model** as judge than the one under test, to stop a model rubber-stamping its own style.
- **Recalibrate whenever you change the judge model.** A judge upgrade is a silent scoring change — and with Claude Sonnet 5 landing as the new default on June 30, 2026, a lot of pipelines swapped judges without noticing.

For the prompt structure behind good judges, our notes on [prompt engineering patterns](/en/posts/prompt-engineering-patterns) cover the rubric and few-shot tricks we rely on.

## Where do evals fit in your reliability stack?

Evals are the measurement layer under every other reliability tactic. They tell you whether grounding, retrieval, or a refusal threshold actually helped or just moved the failure around. Pair them with the defenses in our guide to [reducing LLM hallucinations](/en/posts/reduce-llm-hallucinations), and if your feature depends on retrieval, eval that separately using the ideas in [how to build a RAG system](/en/posts/how-to-build-rag-system).

Run evals on three triggers: every prompt or model change, nightly against fresh production samples, and before any deploy. When you are deciding what to build in the first place, our take on [AI agents vs workflows](/en/posts/ai-agents-vs-workflows) gives the context. The full cluster lives on the [AI](/en/category/ai) hub.

## Frequently Asked Questions

### How many examples does an LLM eval set need?

Start with 50–100 well-chosen cases that cover your real failure modes, not thousands of random ones. Coverage of edge cases matters far more than volume. Grow the set every time production surfaces a new bug; a curated 150-case set beats an unfiltered 2,000-case dump.

### What is the difference between evals and benchmarks?

Benchmarks measure general model capability on public datasets. Evals measure *your* model on *your* task with *your* data. A model can top every 2026 leaderboard and still fail your extraction schema. Always evaluate LLM outputs against your own gold set before trusting a public ranking.

### Can I use an LLM to evaluate LLM outputs?

Yes, LLM-as-judge is standard for subjective qualities like tone and faithfulness, but you must calibrate it against human labels first and force it to justify each score. Use code-based graders for anything deterministic, and reserve the judge for outputs you genuinely cannot check with a rule.

### How often should I run evals?

Run the full suite on every prompt or model change and block the merge if the score regresses. Add a nightly run against fresh production samples to catch drift, plus a weekly human audit on a small sample to keep your judges calibrated.
