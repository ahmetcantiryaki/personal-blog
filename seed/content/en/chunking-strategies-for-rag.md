---
title: "Chunking Strategies for Better RAG"
slug: "chunking-strategies-for-rag"
translationKey: "rag-chunking-strategies"
locale: "en"
excerpt: "Most of your RAG accuracy is hiding in your chunk size. We compare fixed, recursive, semantic, and agentic chunking against 2026 data to find the real default."
category: "ai"
tags: ["rag", "embeddings", "llm", "best-practices"]
publishedAt: "2026-07-17"
seoTitle: "RAG Chunking Strategies: Picking the Right Size"
seoDescription: "Fixed, recursive, semantic, and agentic chunking compared against 2026 benchmark data, plus the default chunk size and overlap that actually retrieves well."
---

If your RAG system hallucinates or keeps surfacing irrelevant passages, the culprit is usually your chunking strategy, not your embedding model. A benchmark published in February 2026 tested seven chunking methods across 50 academic papers, and the winner was a plain recursive 512-token split — it beat out the more elaborate semantic methods entirely. Here's what the four approaches actually do, what the right default is, and when it's worth paying for something more expensive.

## The Four Chunking Approaches

**Fixed-size chunking** splits text at a set token count with no regard for sentence or paragraph boundaries. It's the fastest and simplest method, but it risks slicing a sentence in half, which breaks that fragment's semantic coherence.

**Recursive chunking** tries paragraph boundaries first, then sentence boundaries, then word boundaries, working down that hierarchy until it hits the target token count. It keeps fixed-size's speed while respecting natural text boundaries.

**Semantic chunking** measures embedding similarity between sentences and splits at points where the topic actually shifts. In theory it should produce the most coherent fragments, since each chunk stays focused on a single idea.

**Agentic chunking** has an LLM read the text and decide where to split it itself — the highest quality ceiling of the four, but also the slowest and most expensive, since it requires a model call per chunking decision.

## What the February 2026 Benchmark Found

Vecta's benchmark, published in February 2026, tested seven chunking strategies across 50 academic papers, and the result inverted most teams' assumptions: **recursive 512-token splitting came in first at 69% accuracy**. Semantic chunking landed at just 54% — the fragments it produced averaged only 43 tokens, too small to carry enough context for the retriever to reliably find the right one. An earlier LlamaIndex study, separately, found that 1024 tokens sat near peak faithfulness — meaning "bigger chunks are always worse" isn't true either; the right size depends on the task.

| Strategy | Accuracy in Feb 2026 benchmark | Speed | When to reach for it |
|---|---|---|---|
| Fixed-size | Behind recursive | Fastest | Quick prototyping, structured/uniform text |
| Recursive (512 tokens) | 69% — first place | Fast | The 2026 default starting point |
| Semantic | 54% — fragments too small | ~14x slower | Prose-heavy, unstructured text; needs tuning |
| Agentic | Not tested in this benchmark, assumed highest quality | Slowest, most expensive | High-value, low-volume document sets |

A separate speed benchmark from Chonkie found token-based chunking processes roughly 4.82 MB/s while semantic chunking manages about 0.33 MB/s — roughly a 14x gap. On a large corpus, that's the difference between minutes and hours.

## The Default: Recursive 512 Tokens, 10–20% Overlap

The benchmark-validated default is clear: **512 tokens, recursive splitting, with 10–20% overlap (50–100 tokens)**. Overlap ensures that a sentence cut at a chunk boundary still has its context present in the neighboring chunk — without it, a retriever can find half a sentence and miss the half that completes its meaning.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,          # approximate token count (use a token-aware counter)
    chunk_overlap=80,        # ~15% overlap
    separators=["\n\n", "\n", ". ", " ", ""],
)

chunks = splitter.split_text(document_text)
```

Don't conflate token count with character count — measuring `chunk_size` with a real tokenizer (`tiktoken`, for instance) gives you a far more accurate estimate against your embedding model's actual token limit.

## When Semantic Chunking Actually Wins

The low benchmark score doesn't mean semantic chunking belongs in the trash — the problem was more about default parameters than the method itself. Setting a minimum chunk size floor (say, 150–200 tokens) and only accepting split points above it largely fixes the oversized-fragmentation problem the benchmark exposed. For weakly structured, long-form prose that jumps topics frequently — interview transcripts, forum threads — semantic chunking can still outperform recursive splitting. Just tune and measure it against your own dataset before shipping it to production; don't trust the default configuration.

**Late chunking** is a newer alternative worth knowing about: instead of splitting text first and embedding each piece separately, it runs the full document through a long-context embedding model first, then splits the resulting token-level embeddings into chunks afterward. Every chunk's embedding ends up carrying the context of the entire document, so even a small chunk doesn't lose its connection to the surrounding paragraphs. As embedding models with longer context windows (8K+ tokens) become more common, this method sits at a sweet spot — agentic-level quality at closer to fixed-size cost.

## A Strategy-Selection Flow

The decision follows a simple order: start with recursive 512-token splitting plus 15% overlap, and measure it. If your retrieval metrics (precision@k, recall@k) fall short and your documents are unstructured, long-form prose, try semantic chunking with a minimum-size floor. If you're still losing context regardless of chunk size, move to late chunking. If document volume is low but getting each one split correctly is business-critical — legal contracts, for instance — agentic chunking's cost is worth accepting. Never default to "pick one and never measure it" — chunking is the layer where RAG pipelines quietly accumulate the most errors.

## A Note on Evals

When you change chunking strategy, measure retrieval quality with an eval harness, not by eyeballing outputs: compute precision@k and recall@k against a fixed question-answer set for each strategy separately, and don't ship a change until those numbers actually improve. Our [guide to evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) walks through building exactly this kind of harness.

Even with the right chunking, retrieval stays weak if your embedding model and vector database are mismatched for the job — our [vector database comparison](/en/posts/vector-database-comparison) and [text embeddings guide](/en/posts/text-embeddings-explained) cover those two layers in depth. If you're building RAG from scratch, [how to build a RAG system](/en/posts/how-to-build-rag-system) shows where chunking fits into the full pipeline.

## Frequently Asked Questions

### What's the best chunk size for RAG?

Per the February 2026 benchmark data, 512 tokens with 10–20% overlap using recursive splitting delivers the highest overall accuracy. Treat it as a starting point, though — you still need to measure and tune against your own dataset.

### Why did semantic chunking underperform in the benchmark?

With default settings, it produced fragments averaging just 43 tokens — too small to carry enough context for the retriever to reliably locate the right passage. Setting a minimum chunk-size floor largely fixes this.

### When does agentic chunking pay off?

When document volume is low but getting each one split correctly is business-critical — think contracts or medical records — where the value per document justifies the cost of a model call for each chunking decision.

### How is late chunking different from the others?

The other methods split text first and embed each piece independently. Late chunking embeds the entire document first, then splits the resulting token-level representations into chunks — so even a small chunk's embedding carries the document's broader context.
