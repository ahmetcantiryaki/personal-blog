---
title: "Vector Databases Compared: Pinecone to pgvector"
slug: "vector-database-comparison"
translationKey: "vector-database-comparison"
locale: "en"
category: "ai"
tags: ["vector-database", "rag", "ai-infrastructure"]
publishedAt: "2026-07-04"
seoTitle: "Vector Database Comparison 2026: Pinecone to pgvector"
seoDescription: "A hands-on 2026 vector database comparison with current versions and pricing: Pinecone, pgvector, Qdrant, Weaviate, and Milvus on cost, scale, filtering, and ops."
excerpt: "A hands-on vector database comparison for July 2026 — Pinecone serverless v2, pgvector 0.8.4, Qdrant GPU indexing, Weaviate, and Milvus 2.6 on cost, scale, and filtering."
---

In May 2026 a team we advise opened their Pinecone invoice and found a line item they'd never seen in the pricing calculator: a capacity fee. Their agent product had gone viral for a week, sustained concurrency spiked, and the reservation charge quietly kicked in. The bill tripled. Nothing was broken — they just hadn't read the fine print on serverless. That invoice is the whole reason this vector database comparison exists: the right choice is rarely about raw benchmark numbers, and almost always about the failure mode you can live with.

## Which vector database should you choose in 2026?

For most teams, the honest answer is pgvector until it hurts, then a dedicated engine. A vector database stores high-dimensional embeddings and finds the nearest neighbors to a query vector — the retrieval half of every [RAG system](/en/posts/how-to-build-rag-system). The right pick depends on scale, filtering needs, and how much ops work you'll tolerate.

We've run all five in production. The pattern is consistent: teams over-provision early, reaching for Pinecone or Milvus when a single Postgres table with an HNSW index would have carried them to a few million vectors just fine. Pick for where you are, not where you dream of being.

## Vector database comparison table

This table sums up how the main options stack up as of July 2026, with current versions. Scale ceilings are rough guides from our own load tests, not marketing numbers.

| Database | Current version | Hosting | Index | Best for | Practical scale | Pricing signal |
|----------|-----------------|---------|-------|----------|-----------------|----------------|
| pgvector | 0.8.4 (Jun 2026) | Any Postgres | HNSW, IVFFlat | Teams already on Postgres | ~5M vectors | Free extension |
| Pinecone | Serverless v2 (Q1 2026) | Managed only | Proprietary | Zero-ops, huge scale | Billions | ~$3.60/GB/mo + read/write/capacity units |
| Qdrant | 1.15.x | Self-host or cloud | HNSW (GPU builds) | Rich filtering, hybrid | 100M+ | Free OSS + cloud |
| Weaviate | 1.38 | Self-host or cloud | HNSW | Built-in vectorizers | 100M+ | Free OSS + cloud |
| Milvus | 2.6 | Self-host or Zilliz | HNSW, IVF, DiskANN | Billion-scale, GPU | Billions | Free OSS + cloud |

Read "practical scale" as where each option stays comfortable, not its hard limit. pgvector will technically hold far more than 5M rows; query latency just stops being fun without careful tuning.

## When is pgvector the right call?

pgvector wins when you already run Postgres and your vector count sits under a few million. It's a single extension (`CREATE EXTENSION vector`), your embeddings live next to your relational data, and you get transactions, joins, and backups for free — no extra service, no new query language, no sync job to keep two stores consistent. If you want the mechanics behind the index itself, our [database indexing guide](/en/posts/database-indexing-explained) covers why HNSW behaves the way it does.

As of pgvector 0.8.4 (released 30 June 2026), you get parallel HNSW builds — 30–50% faster on multi-core boxes — plus the iterative index scans introduced in 0.8.0 that fixed the old "filter throws away most of your top-k" overfiltering problem. One caution worth flagging: if you're pinned to an older build, upgrade past [0.8.2](https://www.postgresql.org/about/news/pgvector-082-released-3245/), which patched CVE-2026-3172, a buffer overflow in parallel HNSW index builds. Here's the setup we use:

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

On a 2M-vector table (1536 dims) with that config, we see p95 latency around 15–25 ms on a mid-tier managed Postgres instance. Plenty for a support chatbot or internal search. The moment you push past ~5M vectors or need heavy metadata filtering at low latency, index build times and memory pressure start to bite — that's your signal to graduate.

## When does Pinecone earn its price?

Pinecone earns it when you never want to think about infrastructure and you're heading toward hundreds of millions of vectors. Serverless v2, which shipped in Q1 2026 with lower latency, decouples storage from compute, so you pay for what you query rather than an always-on cluster.

But price it honestly. As of July 2026, [Pinecone bills on four axes](https://docs.pinecone.io/guides/manage-cost/understanding-cost): write units, read units, storage at roughly $3.60/GB/month, and — the one that surprises people — capacity fees that activate under sustained high concurrency. That last component is exactly what tripled our advisee's bill. It's proprietary and cloud-only: no self-hosting, no exporting the index. My opinionated take: Pinecone is worth it precisely when your team's time costs more than the invoice, and a liability the moment it doesn't. (There's a $250 bulk-import credit running through 31 July 2026 if you're migrating in.)

## What about Qdrant, Weaviate, and Milvus?

These three fill the gap between "just use Postgres" and "just pay Pinecone." Each is open-source, self-hostable, and offers a managed cloud.

- **Qdrant** — Rust-based, fast, with the best payload filtering of the group. As of April 2026, [Qdrant Cloud added GPU-accelerated indexing](https://qdrant.tech/blog/qdrant-cloud-enterprise-launch/) (up to 4x faster HNSW builds, in open source since v1.13), Multi-AZ clusters, and audit logging. Our default when we outgrow pgvector but want to self-host.
- **Weaviate** — Version 1.38 hardened production paths with a batch-operation rate limiter and auto-enabling async replication. Its built-in vectorizer modules (OpenAI, Cohere, Hugging Face) can embed text at ingest time — handy if you don't want a separate pipeline, though we usually prefer owning that step.
- **Milvus** — The heavyweight. [Version 2.6](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md) leans hard into cost at billion scale, adding nullable vector fields (insert entities before their embedding exists, zero extra storage) and element-level search on struct fields. Overkill under ~50M vectors; unmatched above a few hundred million.

For hybrid search — dense vectors plus keyword BM25 — Qdrant and Weaviate both do it natively, which matters for catching exact terms like error codes that embeddings miss. Still deciding whether you even need a vector store versus tuning the model? Our take on [fine-tuning vs RAG](/en/posts/fine-tuning-vs-rag) frames that call, and the [embeddings primer](/en/posts/text-embeddings-explained) covers what actually goes into these indexes.

## How do you actually benchmark these for your workload?

Don't trust anyone's benchmark, including this one. Run your own on your embeddings, your filters, and your latency target. The steps we follow every time:

1. **Export a real sample.** Pull 100K–1M actual embeddings from your corpus, not random vectors — distribution matters for recall.
2. **Fix your recall target.** Decide the minimum acceptable recall@10 (we use 0.95) before touching latency.
3. **Tune index params per engine.** For HNSW, sweep `m` and `ef_search`; higher values buy recall at the cost of speed and memory.
4. **Measure p95, not average.** Averages hide the tail latency users actually feel.
5. **Test with filters on.** Filtered queries behave very differently from unfiltered ones; benchmark the way you'll query in production.
6. **Load-test writes too.** Ingestion throughput and index rebuild time bite you at scale, not at demo size.

We once picked an engine on published benchmarks, then watched recall crater to 0.78 once real metadata filters were applied. Benchmarking on our own data caught it before launch. Skip this step and you'll relearn it in production. For more on how these engines slot into a wider AI stack, browse the [AI category](/en/category/ai).

## Frequently Asked Questions

### Is pgvector good enough for production RAG?

Yes, for a large share of use cases. With HNSW indexing and the parallel builds in pgvector 0.8.4, it comfortably serves millions of vectors at low-tens-of-milliseconds latency. It's production-grade for internal search, support bots, and most SaaS features. You outgrow it when you hit tens of millions of vectors or need billion-scale throughput, at which point a dedicated engine pays off.

### Pinecone vs pgvector: which is cheaper?

pgvector is cheaper at small-to-mid scale because it rides on Postgres you already pay for — effectively free beyond compute. Pinecone's serverless pricing wins on operational cost, not raw dollars, and its capacity fees can surprise you under sustained load. Below a few million vectors, pgvector almost always costs less; above that, model your read, write, storage, and capacity units against real traffic.

### Do I need a dedicated vector database, or can I use Postgres?

Start with Postgres and pgvector unless you already know you'll hit tens of millions of vectors or need sub-10ms filtered search at high concurrency. A dedicated engine like Qdrant, Pinecone, or Milvus earns its keep at scale, but adds a service to run and a store to keep in sync. Graduate when a real limit forces you, not preemptively.

### Which vector database is best for hybrid search?

Qdrant and Weaviate offer the smoothest native hybrid search, combining dense vector similarity with sparse keyword (BM25) scoring in one query. Milvus 2.6 supports it at larger scale. pgvector can do hybrid by pairing vector search with Postgres full-text search, which works well up to a few million rows. Pick based on your scale and how much you want managed for you.
