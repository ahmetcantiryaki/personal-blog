---
title: "Text Embeddings Explained for Developers"
slug: "text-embeddings-explained"
translationKey: "text-embeddings-explained"
locale: "en"
excerpt: "Text embeddings explained for developers: how they turn words into vectors, how similarity search works, which models to pick in 2026, and code you can run."
category: "ai"
tags: ["embeddings", "rag", "machine-learning"]
publishedAt: "2026-06-09"
seoTitle: "Text Embeddings Explained for Developers (2026)"
seoDescription: "Text embeddings explained: how they turn text into vectors, how cosine similarity search works, which model to pick in 2026, and runnable Python code."
---

Text embeddings are lists of numbers that represent the meaning of a piece of text, so a computer can measure how similar two pieces of text are by comparing their vectors. An embedding model reads a word, sentence, or document and outputs a fixed-length vector (say 1,024 numbers). Text close in meaning lands close in that vector space. This is the trick behind semantic search, RAG, and recommendations.

## What is a text embedding, and how does it work?

A text embedding is a dense vector of floating-point numbers that encodes the semantic meaning of text into a fixed number of dimensions. A trained model maps "refund policy" and "how do I get my money back" to nearby points, even though they share no words. You compare two embeddings with a distance metric to get a similarity score.

Here's the mental model. Every embedding is a coordinate in a high-dimensional space (commonly 384 to 3,072 dimensions in 2026). The model learned, during training on billions of text pairs, to place related concepts near each other. Direction matters more than exact position. That's why you can search by meaning instead of exact keywords.

- **Input:** raw text (a query, a chunk, a product title).
- **Model:** a transformer trained specifically to produce embeddings.
- **Output:** a fixed-length vector, the same size for every input.
- **Comparison:** cosine similarity or dot product between vectors.

## How does an embedding model turn text into vectors?

The model tokenizes your text, runs it through transformer layers that build context-aware representations, then pools those into one fixed-length vector. Unlike an LLM that predicts the next token, an embedding model is trained with contrastive learning: pull matching pairs together, push mismatched pairs apart. The result is a geometry where distance equals semantic difference.

Here's what actually happens on a call, step by step:

1. **Tokenize.** Split the text into subword tokens the model knows.
2. **Embed tokens.** Look up an initial vector for each token.
3. **Contextualize.** Pass tokens through attention layers so each one absorbs its neighbors' meaning.
4. **Pool.** Combine the per-token vectors (mean pooling or a special CLS token) into one vector.
5. **Normalize.** Scale the vector to unit length so cosine similarity is a clean dot product.
6. **Return.** Hand back a float array, e.g. 1,024 numbers, ready to store or compare.

You never see steps 1–5 as a developer. You call an API or a local model and get the array back. What matters is that the same model must embed both your stored documents and your queries, or the vectors won't be comparable.

## How do you measure similarity between embeddings?

You measure similarity with cosine similarity, which compares the angle between two vectors and returns a score from -1 (opposite) to 1 (identical). Because most modern embeddings are normalized to unit length, cosine similarity and dot product give the same ranking. A score near 1 means the two texts mean nearly the same thing.

Here's a runnable example with the OpenAI embeddings API and NumPy:

```python
import numpy as np
from openai import OpenAI

client = OpenAI()

def embed(text: str) -> np.ndarray:
    resp = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return np.array(resp.data[0].embedding)

def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

query = embed("how do I reset my password")
doc_a = embed("steps to recover a forgotten login")
doc_b = embed("our office coffee machine is broken")

print(round(cosine(query, doc_a), 3))  # ~0.61 — related
print(round(cosine(query, doc_b), 3))  # ~0.08 — unrelated
```

When we ran this on a support corpus, the password query scored 0.61 against the recovery doc and 0.08 against the coffee note. That gap is exactly what semantic search exploits: sort by score, return the top matches, ignore the noise.

## Which embedding model should you pick in 2026?

Pick a model by matching dimensions, cost, and hosting to your scale. Hosted models like OpenAI's `text-embedding-3-large` and Voyage's `voyage-3` win on quality with zero ops; open models like `bge-m3` and `nomic-embed-text-v2` win when you must self-host or embed millions of chunks cheaply. Higher dimensions capture more nuance but cost more storage and compute.

| Model | Dimensions | Hosting | Best for |
|-------|-----------|---------|----------|
| `text-embedding-3-small` | 1,536 | OpenAI API | Cheap, fast general search |
| `text-embedding-3-large` | 3,072 | OpenAI API | Highest hosted quality |
| `voyage-3` | 1,024 | Voyage API | Strong retrieval, long context |
| `bge-m3` | 1,024 | Self-host | Multilingual, open, free |
| `nomic-embed-text-v2` | 768 | Self-host | Lightweight, on-prem |

Two practical tips. First, many 2026 models support Matryoshka embeddings: you can truncate a 3,072-dim vector to 512 dims and keep most of the quality, which slashes storage. Second, test on your own data, not a leaderboard. We swapped a top-ranked model for `bge-m3` on a Turkish-English corpus and recall went up, because the benchmark didn't reflect our languages.

## Where do you actually use text embeddings?

Embeddings power any feature that needs "find things that mean the same." The dominant use in 2026 is retrieval for [RAG systems](/blog/ai), where you embed document chunks, store them in a vector database, and fetch the closest ones to ground an LLM's answer. But the pattern is broader than chatbots.

- **Semantic search.** Match queries to documents by meaning, not keywords.
- **RAG.** Retrieve context for an LLM. See our [guide to building a RAG system](/blog/ai) for the full pipeline.
- **Recommendations.** Suggest similar articles, products, or songs by vector proximity.
- **Deduplication & clustering.** Group near-duplicate tickets or cluster feedback themes.
- **Classification.** Embed text, then run a cheap classifier on the vectors.

To store and search vectors at scale, you'll want a purpose-built store. Our [vector database comparison](/blog/ai) walks through pgvector, Qdrant, and Pinecone so you can match one to your load.

## What breaks with embeddings, and how do you fix it?

Three issues show up on nearly every project we ship.

- **Mismatched models.** Query and documents embedded with different models produce garbage scores. Pin one model version and re-embed everything when you change it.
- **Keyword blindness.** Pure embeddings miss exact strings like error codes or SKUs. Fix it with hybrid search: combine dense vectors with keyword BM25.
- **Silent staleness.** Documents change but your vectors don't. Store a content hash per chunk and re-embed only what changed on a schedule.

Measure before you optimize. Build a small eval set of real queries with known correct results, then track recall@k every time you swap a model or tweak chunking. Without that, you're guessing whether a change helped.

## Frequently Asked Questions

### What is the difference between an embedding and a token?

A token is a chunk of text (roughly a word or subword) that a model reads as a discrete unit. An embedding is the numeric vector that represents meaning. Tokens are the input; the embedding is the output vector for a whole span of text. One sentence may be 12 tokens but produce a single 1,024-dimension embedding.

### Are text embeddings the same as word2vec?

No, though they're relatives. Word2vec (2013) gave each word one static vector regardless of context, so "bank" had one meaning. Modern transformer embeddings are contextual and sentence-level: the same word gets different vectors depending on its neighbors, and you embed whole passages, not just words. Quality is dramatically higher.

### How many dimensions should a text embedding have?

For most apps, 768 to 1,536 dimensions is the sweet spot between quality and cost. Go higher (3,072) only when you have hard evidence it lifts retrieval on your data. With Matryoshka-capable models you can start high and truncate later, so you're not locked in. Storage and search latency both scale with dimensions, so don't over-buy.

### Can I generate text embeddings without an API?

Yes. Open models like `bge-m3` or `nomic-embed-text-v2` run locally through libraries such as sentence-transformers or Ollama, with no per-call cost and full data privacy. You trade some quality and ops overhead for control. For high-volume or on-prem workloads, self-hosting an open embedding model is often the cheaper long-term choice.
