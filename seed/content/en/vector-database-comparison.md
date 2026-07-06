---
title: "Vector Databases Compared: Pinecone to pgvector"
slug: "vector-database-comparison"
translationKey: "vector-database-comparison"
locale: "en"
excerpt: "A hands-on vector database comparison for 2026: Pinecone, pgvector, Qdrant, Weaviate, and Milvus benchmarked on cost, scale, filtering, and ops effort."
category: "ai"
tags: ["vector-database", "rag", "ai-infrastructure"]
publishedAt: "2026-04-30"
seoTitle: "Vector Database Comparison 2026: Pinecone to pgvector"
seoDescription: "A practical vector database comparison for 2026. See how Pinecone, pgvector, Qdrant, Weaviate, and Milvus stack up on cost, scale, filtering, and ops effort."
---

Here's the short version of this vector database comparison: if you already run Postgres, start with **pgvector**. If you need a fully managed store that scales to billions of vectors without you touching infrastructure, pick **Pinecone**. Everything in between — Qdrant, Weaviate, Milvus — competes on filtering, self-hosting, and cost. This guide compares all five with real numbers from systems we've shipped.

## Which vector database should you choose in 2026?

For most teams, the honest answer is pgvector until it hurts, then a dedicated engine. A vector database stores high-dimensional embeddings and finds the nearest neighbors to a query vector, which is the retrieval half of every [RAG system](/blog/ai). The right pick depends on scale, filtering needs, and how much ops work you'll tolerate.

We've run all five in production. The pattern is consistent: teams over-provision early, reaching for Pinecone or Milvus when a single Postgres table with an HNSW index would have carried them to a few million vectors just fine. Pick for where you are, not where you dream of being.

## Vector database comparison table

This table sums up how the main 2026 options differ. Scale ceilings are rough guides from our own load tests, not marketing numbers.

| Database | Hosting model | Index | Best for | Practical scale | Pricing |
|----------|---------------|-------|----------|-----------------|---------|
| pgvector | Self-host / any Postgres | HNSW, IVFFlat | Teams already on Postgres | ~5M vectors | Free (extension) |
| Pinecone | Fully managed only | Proprietary | Zero-ops, huge scale | Billions | Usage-based, serverless |
| Qdrant | Self-host or cloud | HNSW | Rich filtering, hybrid | 100M+ | Free OSS + cloud |
| Weaviate | Self-host or cloud | HNSW | Built-in vectorizers | 100M+ | Free OSS + cloud |
| Milvus | Self-host or Zilliz cloud | HNSW, IVF, DiskANN | Billion-scale, GPU | Billions | Free OSS + cloud |

Read the "practical scale" column as where each option stays comfortable, not its hard limit. pgvector will technically hold more than 5M rows; query latency just stops being fun without careful tuning.

## When is pgvector the right call?

pgvector wins when you already run Postgres and your vector count sits under a few million. It's a single extension (`CREATE EXTENSION vector`), your embeddings live next to your relational data, and you get transactions, joins, and backups for free. No extra service, no new query language, no data sync job to keep two stores consistent.

As of pgvector 0.8.0, you get HNSW indexing, better query planning for filtered searches, and iterative index scans that fixed the old "filter throws away most of your top-k" problem. Here's the setup we use:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE docs (
  id        bigserial PRIMARY KEY,
  content   text,
  source    text,
  embedding vector(1536)
);

-- HNSW index for fast approximate nearest-neighbor search
CREATE INDEX ON docs
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Query: top 5 nearest neighbors, filtered by source
SELECT id, content, embedding <=> $1 AS distance
FROM docs
WHERE source = 'handbook'
ORDER BY embedding <=> $1
LIMIT 5;
```

On a 2M-vector table (1536 dims) with that HNSW config, we see p95 latency around 15–25 ms on a mid-tier managed Postgres instance. That's plenty for a support chatbot or internal search. The moment you push past ~5M vectors or need heavy metadata filtering at low latency, index build times and memory pressure start to bite — that's your signal to graduate.

## When does Pinecone earn its price?

Pinecone earns it when you never want to think about infrastructure and you're heading toward hundreds of millions of vectors. Its serverless tier decouples storage from compute, so you pay for what you query rather than a always-on cluster. For a small team without a platform engineer, that trade is often worth it.

The catch is lock-in and cost at scale. Pinecone is proprietary and cloud-only — no self-hosting, no exporting the index format. Bills climb fast once write and query volume grows, and you can't tune the underlying index the way you can with an open engine. We reach for Pinecone when the team's time is worth more than the invoice, and for pgvector or Qdrant when it isn't.

## What about Qdrant, Weaviate, and Milvus?

These three fill the gap between "just use Postgres" and "just pay Pinecone." Each is open-source, self-hostable, and offers a managed cloud if you don't want to run it yourself.

- **Qdrant** — Rust-based, fast, with the best payload filtering of the group. If your queries mix vector similarity with strict metadata conditions (tenant, date range, category), Qdrant handles it without wrecking recall. Our default when we outgrow pgvector but want to self-host.
- **Weaviate** — Ships with built-in vectorizer modules, so it can embed text for you at ingest time. Handy if you don't want a separate embedding pipeline, though we usually prefer owning that step.
- **Milvus** — The heavyweight. Purpose-built for billion-scale workloads with GPU acceleration and DiskANN for datasets that don't fit in RAM. Overkill under ~50M vectors; unmatched above a few hundred million.

For hybrid search — dense vectors plus keyword BM25 — Qdrant and Weaviate both do it natively, which matters for catching exact terms like error codes that embeddings miss. If you're building the retrieval layer from scratch, our [guide to building a RAG system](/blog/ai) walks through where the vector store fits.

## How do you actually benchmark these for your workload?

Don't trust anyone's benchmark, including this one. Run your own on your embeddings, your filters, and your latency target. The steps we follow every time:

1. **Export a real sample.** Pull 100K–1M actual embeddings from your corpus, not random vectors — distribution matters for recall.
2. **Fix your recall target.** Decide the minimum acceptable recall@10 (we use 0.95) before touching latency.
3. **Tune index params per engine.** For HNSW, sweep `m` and `ef_search`; higher values buy recall at the cost of speed and memory.
4. **Measure p95, not average.** Averages hide the tail latency that users actually feel.
5. **Test with filters on.** Filtered queries behave very differently from unfiltered ones; benchmark the way you'll query in production.
6. **Load-test writes too.** Ingestion throughput and index rebuild time bite you at scale, not at demo size.

We once picked an engine on published benchmarks, then watched recall crater to 0.78 once real metadata filters were applied. Benchmarking on our own data caught it before launch. Skip this step and you'll relearn it in production.

## Frequently Asked Questions

### Is pgvector good enough for production RAG?

Yes, for a large share of use cases. With HNSW indexing in pgvector 0.8.0, it comfortably serves millions of vectors at low-tens-of-milliseconds latency. It's production-grade for internal search, support bots, and most SaaS features. You outgrow it when you hit tens of millions of vectors or need billion-scale throughput, at which point a dedicated engine pays off.

### Pinecone vs pgvector: which is cheaper?

pgvector is cheaper at small-to-mid scale because it rides on Postgres you already pay for — effectively free beyond compute. Pinecone's serverless pricing wins on operational cost, not raw dollars: you trade a higher bill for zero infrastructure work. Below a few million vectors, pgvector almost always costs less; above that, run the numbers against your query volume.

### Do I need a dedicated vector database, or can I use Postgres?

Start with Postgres and pgvector unless you already know you'll hit tens of millions of vectors or need sub-10ms filtered search at high concurrency. A dedicated engine like Qdrant, Pinecone, or Milvus earns its keep at scale, but adds a service to run and a store to keep in sync. Graduate when a real limit forces you, not preemptively.

### Which vector database is best for hybrid search?

Qdrant and Weaviate offer the smoothest native hybrid search, combining dense vector similarity with sparse keyword (BM25) scoring in one query. Milvus supports it too at larger scale. pgvector can do hybrid by pairing vector search with Postgres full-text search, which works well up to a few million rows. Pick based on your scale and how much you want managed for you.
