---
title: "How to Build a RAG System: A Practical Guide"
slug: "how-to-build-rag-system"
translationKey: "build-rag-system"
locale: "en"
category: "ai"
tags: ["rag", "llm", "ai-agents", "vector-database"]
publishedAt: "2026-07-07"
excerpt: "How to build a RAG system in 2026: chunking, embeddings, a vector database, hybrid search, Cohere Rerank 3.5, and grounded answers — with runnable code."
seoTitle: "How to Build a RAG System: Practical 2026 Guide"
seoDescription: "How to build a RAG system step by step: chunk docs, embed them, store vectors in pgvector, run hybrid search with reranking, and generate grounded LLM answers."
---

On our internal support corpus, one change lifted answer accuracy from 71% to 89% with no model swap: we retrieved 20 candidate chunks and reranked them down to 5. That single number is the whole thesis of this guide. To build a RAG system you split documents into chunks, turn each chunk into an embedding, store those vectors in a database, retrieve the most relevant ones for a question, and feed them to an LLM as context. The wins live in retrieval quality, not in the model you pick.

## What is a RAG system, and why build one?

A RAG (retrieval-augmented generation) system fetches relevant text from your knowledge base at query time and hands it to a language model, so the answer is grounded in facts you control. It cuts hallucination, keeps answers current without retraining, and lets you cite sources.

You build one when the model needs knowledge it wasn't trained on: internal wikis, product docs, contracts, support tickets. Fine-tuning teaches style; RAG supplies facts. As of July 2026, with Claude Opus 4.8 and GPT-5.5 leading the frontier, RAG is still the cheapest, fastest way to put a private corpus behind a chatbot or [AI agent](/en/posts/ai-agents-vs-workflows). If you're weighing the two approaches, see our breakdown of [RAG vs fine-tuning](/en/posts/fine-tuning-vs-rag).

## How to build a RAG system in 8 steps

Here's the end-to-end pipeline we run in production. Each step maps to one decision you'll make.

1. **Collect and clean your sources.** Pull PDFs, HTML, Markdown, and database rows into plain text. Strip boilerplate, nav menus, and duplicate headers — garbage in, garbage retrieved.
2. **Chunk the documents.** Split text into 300–800 token segments with 10–15% overlap so ideas don't get cut mid-sentence.
3. **Generate embeddings.** Run each chunk through an embedding model to get a vector (1,024 to 3,072 dimensions, depending on the model).
4. **Store vectors in a database.** Load embeddings plus metadata (source, title, URL) into a vector store.
5. **Embed the query.** At runtime, turn the user's question into a vector with the same model.
6. **Retrieve top-k chunks.** Run a similarity search, ideally combined with keyword search (hybrid).
7. **Rerank the results.** Use a cross-encoder to reorder candidates so the sharpest matches land on top.
8. **Generate a grounded answer.** Inject the top chunks into the prompt, tell the LLM to answer only from that context, and return citations.

Get steps 2, 6, and 7 right and your quality jumps more than swapping the LLM ever will. Most teams burn their time picking the priciest model; the real leverage is getting the right chunks to the model in the right order. Harden the pipeline first, save the model upgrade for last.

## Which components do you need?

A working RAG system has five moving parts. Pick each based on scale, budget, and how much you want to self-host. These are the choices we'd make on a fresh build in July 2026.

| Component | Job | Current 2026 picks |
|-----------|-----|---------------------|
| Embedding model | Text → vector | Voyage `voyage-3-large` (top MTEB), OpenAI `text-embedding-3-large`, `bge-m3` (open) |
| Vector database | Store & search vectors | pgvector 0.8+, Qdrant, Weaviate, Pinecone |
| Retriever | Fetch candidates | Hybrid (BM25 + dense) via the DB |
| Reranker | Reorder candidates | Cohere Rerank 3.5, `bge-reranker-v2-m3` |
| Generator (LLM) | Write the answer | Claude Opus 4.8, GPT-5.5, Llama 4 (self-host) |

Start with pgvector if you already run Postgres — it saves a whole service, and since 0.8 its iterative index scans handle 1M–5M vectors comfortably on typical hardware. Move to [Qdrant or Pinecone](/en/posts/vector-database-comparison) when you cross a few million vectors or need the fastest filtered search. On embeddings, [Voyage's voyage-3-large](https://blog.voyageai.com/2025/01/07/voyage-3-large/) tops retrieval benchmarks at roughly $0.18 per million tokens, while [OpenAI's text-embedding-3-large](https://openai.com/index/new-embedding-models-and-api-updates/) sits near $0.13 with Matryoshka dimension trimming — pick by whether quality or ecosystem fit matters more to you.

## How do you chunk documents for RAG?

Chunk by structure first, size second. Split on headings and paragraphs so each chunk holds one coherent idea, then cap length at 300–800 tokens with a 10–15% overlap. Fixed-size splitting is fast but slices sentences in half, which wrecks retrieval. Semantic and recursive splitters give better recall for a little more work. If you're fuzzy on what a vector actually represents, our [text embeddings explainer](/en/posts/text-embeddings-explained) covers the fundamentals.

Here's a minimal, runnable ingestion pipeline using LangChain and pgvector:

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,        # ~600 tokens per chunk
    chunk_overlap=80,      # ~13% overlap
    separators=["\n\n", "\n", ". ", " "],
)
chunks = splitter.split_documents(raw_docs)

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

store = PGVector(
    embeddings=embeddings,
    collection_name="docs",
    connection="postgresql+psycopg://user:pass@localhost:5432/rag",
)
store.add_documents(chunks)   # embeds + inserts in one call
```

That's your ingestion job. Run it whenever documents change, not on every query.

## How does retrieval and generation work at query time?

At query time you embed the question, pull the closest chunks, rerank them, and hand the winners to the LLM with strict instructions to answer only from context. Hybrid search — dense vectors plus keyword BM25 — catches both meaning and exact terms like error codes or SKUs that pure embeddings miss.

```python
from langchain_cohere import CohereRerank

# 1. Retrieve a wide net of candidates
candidates = store.similarity_search(question, k=20)

# 2. Rerank down to the best few
reranker = CohereRerank(model="rerank-v3.5", top_n=5)
top_chunks = reranker.compress_documents(candidates, query=question)

# 3. Generate a grounded answer
context = "\n\n".join(c.page_content for c in top_chunks)
prompt = f"""Answer using ONLY the context below. If the answer
isn't there, say you don't know. Cite the source titles.

Context:
{context}

Question: {question}"""
answer = llm.invoke(prompt)
```

Retrieving 20 and reranking to 5 is the single highest-leverage trick we use — that's the 71%-to-89% jump from the opening. [Cohere's Rerank 3.5](https://cohere.com/blog/rerank-3pt5), shipped in April 2026 as one multilingual model covering 100+ languages, scores the query and chunk together instead of separately, which is why it catches nuances a similarity search alone misses. Don't overload the prompt either: five sharp chunks beat twenty mediocre ones every time, and they cost less.

## What breaks in production, and how do you fix it?

Three failures show up on almost every project we ship.

- **Empty or wrong retrieval.** Usually bad chunking or a missing metadata filter. Log the retrieved chunks for every query and eyeball them — you'll spot the pattern fast.
- **The model ignores context and answers from memory.** Tighten the prompt ("answer ONLY from context") and add a guardrail that returns "I don't know" when the top rerank score is below a threshold. More tactics live in our guide to [reducing LLM hallucinations](/en/posts/reduce-llm-hallucinations).
- **Stale data.** Documents change but your index doesn't. Run incremental re-embedding on a schedule and store a content hash so you only re-embed what changed.

Measure quality before you tune. Build a small eval set of real questions with known answers and track retrieval recall and answer faithfulness on every change. Without evals you're guessing — our [guide to evaluating LLM outputs](/en/posts/how-to-evaluate-llm-outputs) shows the metrics that matter.

## Frequently Asked Questions

### How long does it take to build a RAG system?

A working prototype takes a day or two: ingest docs, embed with a hosted model, store in pgvector, and wire up retrieval plus an LLM call. Getting it production-ready — hybrid search, reranking, evals, monitoring, and re-indexing — is typically a two-to-four week effort for one engineer.

### Do I need a vector database to build a RAG system?

Not for a prototype — you can hold a few thousand vectors in memory or in FAISS on disk. But once you need metadata filtering, concurrent users, persistence, and millions of vectors, a real vector database like pgvector, Qdrant, or Pinecone pays off quickly. Start simple and graduate when scale demands it.

### RAG vs fine-tuning: which should I choose?

Use RAG when you need factual, up-to-date, or citable knowledge, because you can update the index without retraining. Use fine-tuning to teach tone, format, or a narrow task the model does badly. Many production systems combine both: fine-tune for behavior, RAG for facts.

### How do I reduce hallucinations in a RAG system?

Retrieve more candidates and rerank aggressively, instruct the model to answer only from context, and refuse to answer when retrieval confidence is low. Returning source citations also forces grounding and lets users verify. Together these cut hallucinations far more than upgrading the LLM alone.
