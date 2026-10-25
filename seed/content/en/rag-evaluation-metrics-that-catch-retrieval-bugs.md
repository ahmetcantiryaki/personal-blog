---
title: "RAG Evaluation: Metrics That Catch Retrieval Bugs"
slug: "rag-evaluation-metrics-that-catch-retrieval-bugs"
translationKey: "rag-evaluation-metrics-2026"
locale: "en"
excerpt: "Use recall@k and nDCG to check retrieval, then faithfulness and answer relevancy to check generation. Vibes-based review misses regressions both catch."
category: "ai"
tags: ["rag", "evals", "llm", "machine-learning"]
publishedAt: "2026-10-25"
seoTitle: "RAG Evaluation Metrics: What to Measure and Why"
seoDescription: "Recall@k, nDCG, faithfulness, and answer relevancy each catch a different RAG failure. Here's how to combine them into a golden set that gates regressions."
---

Short answer: a RAG pipeline needs two separate sets of metrics — retrieval metrics (recall@k, precision@k, MRR, nDCG) that check whether the right chunks got pulled, and generation metrics (faithfulness, answer relevancy, context precision) that check whether the model used those chunks correctly. Skipping either half means you'll ship regressions that "feel fine" in a manual spot check.

## Why does RAG need metrics instead of manual review?

Short answer: because a human reading five sample answers cannot detect a 15% drop in retrieval recall, and a model that sounds confident can still be unfaithful to its retrieved context. Both failure modes are common, and both are invisible without a fixed, repeatable test set.

The failure that hurts the most in practice is silent retrieval drift: someone re-chunks a document set, swaps an embedding model, or adds a reranker, and overall answer quality looks unchanged in spot checks because the model papers over missing context with its own training knowledge. That's the exact case automated metrics on a frozen golden set catch and a five-minute vibe check does not.

## What do recall@k, precision@k, MRR, and nDCG actually measure?

Short answer: these four metrics score the retrieval step alone, before generation ever runs, by comparing the chunks your retriever returned against a labeled set of chunks that should have been returned for each query.

- **Recall@k** = (relevant chunks retrieved in the top k) / (total relevant chunks that exist for the query). It answers "did we find everything relevant?" and ignores ranking order.
- **Precision@k** = (relevant chunks retrieved in the top k) / k. It answers "how much of what we returned was actually useful?"
- **MRR (Mean Reciprocal Rank)** = the average of 1/rank of the first relevant result across queries. A first relevant hit at position 1 scores 1.0; at position 4 it scores 0.25. It rewards getting the best chunk near the top, not just somewhere in the list.
- **nDCG@k (normalized Discounted Cumulative Gain)** = DCG@k / IDCG@k, where DCG@k sums each result's relevance score discounted by its rank position. Unlike the other three, nDCG supports graded relevance (a chunk can be "somewhat relevant," not just relevant or not) and rewards putting the most relevant chunks first, not just any relevant chunk.

| Metric | What it rewards | Blind to |
| --- | --- | --- |
| Recall@k | Finding all relevant chunks | Ranking order |
| Precision@k | Returning mostly-relevant chunks | Missing chunks outside top k |
| MRR | A strong first hit | Quality of hits after the first |
| nDCG@k | Correct ranking with graded relevance | Nothing major — closest to end-user perceived quality |

## What do faithfulness, answer relevancy, and context precision measure?

Short answer: these are generation-side metrics from the Ragas framework that score the model's output against the context it retrieved, independent of whether retrieval itself was perfect. Faithfulness checks whether every claim in the answer is actually supported by the retrieved chunks — it's your hallucination detector. Answer relevancy checks whether the answer addresses what the user actually asked, even if it's fully grounded. Context precision checks whether the chunks that were retrieved and ranked highly were actually useful for generating a correct answer, which requires a reference answer to score against.

A model can score well on faithfulness while scoring poorly on answer relevancy — it accurately summarized the retrieved documents but never answered the question. That gap is exactly why you need both metrics, not one combined "quality" score.

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from datasets import Dataset

golden_set = Dataset.from_dict({
    "question": questions,
    "contexts": retrieved_contexts,   # list[list[str]] per question
    "answer": generated_answers,
    "ground_truth": reference_answers,
})

result = evaluate(
    golden_set,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)
print(result)
```

## How do you build a golden question set that actually catches regressions?

Short answer: pull 50-200 real questions from production logs or support tickets, hand-label the chunks that should answer each one, and freeze that set so every pipeline change gets scored against the exact same baseline. A golden set assembled from questions your team invented tends to be easier than what real users ask, which hides exactly the failures you're trying to catch.

Keep the set split by difficulty — questions with a single clear-cut answer, questions requiring multiple chunks stitched together, and adversarial questions where the correct answer is "the documents don't say." That last category matters: a RAG system that never says "I don't know" is often failing faithfulness silently, filling gaps with invented facts instead of admitting a retrieval miss.

## How do you gate RAG regressions in CI?

Short answer: run the golden set through the full pipeline on every pull request that touches retrieval, chunking, or the system prompt, and fail the build if recall@k, faithfulness, or answer relevancy drops below a fixed threshold from the last known-good baseline. Treat these as you would unit test assertions, not as a dashboard someone checks occasionally.

The threshold should be a regression check, not an absolute bar — pick numbers from your own baseline run, not from a blog post. A team whose faithfulness baseline sits at 0.81 on their actual corpus should gate on drops below roughly 0.78, not chase a universal "0.9 is good" number that was measured on someone else's data.

One pitfall worth flagging explicitly: using the same LLM to grade faithfulness and answer relevancy that you use to generate the answers introduces judge bias — the grading model tends to rate its own phrasing style and reasoning patterns more favorably than a neutral evaluator would. Use a different model family for grading when you can, and periodically spot-check a sample of the LLM judge's scores against human labels to catch drift in the grader itself.

## What mistakes make RAG evals useless?

Short answer: the three most common are a golden set too small to be statistically meaningful (under 30 questions), test leakage where the same questions used to tune prompts are reused to "validate" them, and grading answer quality with the exact model being evaluated. All three produce evaluation numbers that look great and mean almost nothing.

A golden set of 20 questions can swing by two or three correct/incorrect answers from one run to the next due to minor nondeterminism, which makes a reported "4% improvement" statistical noise, not a real signal. Build toward 100+ labeled questions before trusting small percentage changes between pipeline versions.

For the agent side of this problem, see our guide on [building a RAG system from scratch](/en/posts/how-to-build-rag-system), and if your RAG pipeline feeds a multi-agent setup, our piece on [AI agent memory systems](/en/posts/ai-agent-memory-systems) covers the related problem of what context survives between turns. For broader context engineering, see our [AI category](/en/category/ai).

My honest take: most teams skip retrieval metrics entirely and only eyeball final answers, which is backwards — a broken retriever is cheaper to catch and fix than a broken prompt, but it's invisible unless you're measuring recall@k directly against labeled chunks.

## Frequently Asked Questions

### What is the difference between recall@k and precision@k in RAG evaluation?

Recall@k measures what fraction of all relevant chunks were retrieved in your top k results, ignoring order. Precision@k measures what fraction of your top k results were actually relevant. A retriever can have high recall and low precision by returning many chunks, most of them irrelevant.

### What does faithfulness mean in RAG evaluation?

Faithfulness measures whether every claim in a generated answer is actually supported by the retrieved context, rather than invented or pulled from the model's training data. It's the primary metric for detecting hallucination in a RAG system and is computed per-claim, then averaged across the answer.

### How many questions do you need in a RAG golden evaluation set?

Aim for at least 100 hand-labeled questions before trusting small percentage changes between pipeline versions; sets under 30 questions produce evaluation scores that swing on run-to-run noise rather than real improvement or regression.

### Can you use the same LLM to generate and grade RAG answers?

You can, but it introduces judge bias: the grading model tends to score its own phrasing and reasoning patterns more favorably than a neutral evaluator would. Use a different model family for grading, and periodically check a sample of its scores against human labels.

Sources:
- [Ragas documentation](https://docs.ragas.io/)
- [RAG Evaluation Explained (Atlan)](https://atlan.com/know/how-to-evaluate-rag-systems-explained/)
- [RAGAS metrics glossary (PromptLayer)](https://www.promptlayer.com/glossary/ragas-metrics)
