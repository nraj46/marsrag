# MarsRAG — Mars Mission Research Assistant

A production-pattern **retrieval-augmented generation (RAG)** system over a curated archive of NASA-style Mars research reports. Ask a question and MarsRAG retrieves evidence with **hybrid search** (vector + BM25), **reranks** it, and composes a **grounded answer with numbered citations** — or honestly refuses when retrieval confidence is too low. A built-in **evaluation suite** measures pass rate, citation accuracy, latency, and estimated cost.

**Live demo:** https://marsrag.vercel.app · **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4

> Runs in **Demo mode** by default: the retrieval + composition engine is fully local, so no API key is required and every query costs $0. The generation step is extractive (sentences are selected from retrieved chunks, never invented), which keeps citations 100% faithful. An LLM generation layer can be dropped onto the same retrieved context via `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` without changing the retrieval pipeline.

## Architecture

```
13 reports ──► section-aware chunking (39 chunks + metadata)
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 hashing TF-IDF vectors      BM25 index
 (512-dim, FNV feature       (k1=1.5, b=0.75,
  hashing, cosine sim)        corpus IDF)
        └───────────┬───────────┘
                    ▼
          hybrid fusion (50/50, per-query normalized)
                    ▼
          reranker: exact-phrase + title-overlap + recency signals
                    ▼
          confidence gate (refuses below threshold)
                    ▼
          grounded answer + numbered citations [1][2] → source cards
                    ▼
          eval suite: 13-case golden set, pass rate / citation
          accuracy / latency / cost per query
```

Key design decisions:

- **Section-aware chunking** instead of fixed windows — each chunk is one report section, so citations land on coherent, human-verifiable passages. Chunk metadata (doc title, section, source, year) powers both the UI source cards and the reranker's title/recency signals.
- **Hybrid retrieval** because neither method alone is enough for technical corpora: BM25 nails exact terms (`MOXIE`, `SHARAD`, `tau`), while TF-IDF vectors generalize across wording ("how much oxygen was produced" vs. "122 grams of oxygen").
- **Transparent reranking** — a signal-based stand-in for a cross-encoder stage (phrase match, title overlap, recency). Every signal is shown in the Retrieval Inspector, so ranking decisions are debuggable, not magic.
- **Absolute confidence, not normalized confidence** — per-query normalized scores always max at 1.0, so the grounding gate uses raw vector/BM25 evidence strength. That is what lets the system correctly refuse off-topic questions (try the pizza sample).
- **Evals are executable, not screenshots** — `POST /api/evals` runs the real pipeline against the golden set on demand.

## Features → AI-engineer job requirements

| MarsRAG feature | Job requirement it demonstrates |
| --- | --- |
| End-to-end RAG pipeline (chunk → embed → retrieve → rerank → generate) | "Design and ship RAG systems in production" |
| Hybrid vector + BM25 retrieval with score fusion | "Experience with vector databases / embeddings / hybrid search" |
| Reranking stage with inspectable signals | "Retrieval quality: rerankers, cross-encoders, relevance tuning" |
| Numbered citations mapped to source chunks | "Grounded generation, citation accuracy, hallucination mitigation" |
| Confidence gate with honest refusal | "Guardrails and trust/safety for LLM features" |
| Golden-set eval suite: pass rate, citation accuracy, latency, cost | "LLMOps: evaluation harnesses, quality metrics, cost/latency tracking" |
| Retrieval inspector (pre/post-rerank rankings + component scores) | "Observability and debugging of AI systems" |
| Token + cost estimation per query | "LLM cost engineering / FinOps awareness" |
| Next.js API routes with typed request/response contracts | "Full-stack delivery of AI features (React, TypeScript, Node)" |
| Demo-mode local engine + env-key adapter seam | "Provider abstraction across OpenAI / Anthropic / local models" |

## API

| Endpoint | Description |
| --- | --- |
| `POST /api/query` `{ "question": "..." }` | Answer, citations, confidence, latency, token/cost estimate, and full pre/post-rerank inspector data |
| `POST /api/evals` | Runs the 13-case golden set through the live pipeline and returns the metrics report |
| `GET /api/docs` | Knowledge-base stats and document/section metadata |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

No environment variables are required. Corpus content is illustrative, written in NASA report style from public mission facts (MOXIE results, Ingenuity flight log, InSight seismology, Gale Crater findings, and more).

## Corpus

13 reports / 39 chunks: Olympus Mons geology · Gale Crater aqueous history · MOXIE oxygen production · radiation shielding · global dust storms · entry/descent/landing · Perseverance sample caching · Ingenuity helicopter · subsurface ice mapping · closed-loop life support · deep-space communications delay · regolith agriculture · InSight seismology.

---

Built by **Nagaraju Chinthalacheruvu** — Senior Front-End / AI Engineer (React, TypeScript, LLMs, RAG, LangChain, MCP).
[GitHub](https://github.com/nraj46) · [LinkedIn](https://www.linkedin.com/in/nagr)
