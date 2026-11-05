import RagStudio from "@/components/RagStudio";
import { DOCUMENTS } from "@/lib/documents";
import { KB_STATS } from "@/lib/rag";

const PIPELINE = [
  {
    step: "1 · Chunk",
    title: "Section-aware chunking",
    body: "13 NASA-style reports split into 39 chunks along section boundaries, each carrying document title, section, source and year metadata.",
  },
  {
    step: "2 · Retrieve",
    title: "Hybrid retrieval",
    body: "Hashing TF-IDF vector cosine similarity fused 50/50 with BM25 keyword scoring — semantic breadth plus exact-term precision (MOXIE, tau, SHARAD).",
  },
  {
    step: "3 · Rerank",
    title: "Signal reranking",
    body: "Top candidates are rescored with exact-phrase matches, title-term overlap and source recency, mimicking a cross-encoder stage with transparent signals.",
  },
  {
    step: "4 · Generate",
    title: "Grounded generation",
    body: "Answers are composed only from retrieved chunks, with numbered citations [1][2] mapped to source cards — and an honest refusal when confidence is below threshold.",
  },
  {
    step: "5 · Evaluate",
    title: "Built-in evals",
    body: "A 13-case golden set (including an off-topic control) measures pass rate, citation accuracy, latency and estimated cost — run it live below.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-700 text-lg">♂</div>
            <div>
              <p className="font-bold leading-none tracking-tight">MarsRAG</p>
              <p className="text-[11px] text-zinc-500">Mission Research Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 sm:inline">
              Demo mode — no API key required
            </span>
            <a
              href="https://github.com/nraj46/marsrag"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400">
            Production-pattern RAG · Hybrid search · Reranking · Evals
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Ask the Mars archive anything —{" "}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              get cited answers, not hallucinations.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-400">
            MarsRAG is a retrieval-augmented generation system over {KB_STATS.documents} curated NASA-style research
            reports ({KB_STATS.chunks} chunks, {KB_STATS.vocabulary.toLocaleString()} indexed terms). Every answer is
            grounded in retrieved evidence with verifiable citations, every ranking is inspectable, and a built-in
            evaluation suite keeps the pipeline honest.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div><span className="text-xl font-bold text-white">{KB_STATS.documents}</span> <span className="text-zinc-500">reports</span></div>
            <div><span className="text-xl font-bold text-white">{KB_STATS.chunks}</span> <span className="text-zinc-500">chunks</span></div>
            <div><span className="text-xl font-bold text-white">2-stage</span> <span className="text-zinc-500">retrieve → rerank</span></div>
            <div><span className="text-xl font-bold text-white">13</span> <span className="text-zinc-500">eval cases</span></div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PIPELINE.map((p, i) => (
            <div key={p.step} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-400">{p.step}</p>
              <h3 className="mt-1.5 font-semibold text-zinc-100">{p.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{p.body}</p>
              {i < PIPELINE.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-zinc-600 lg:block">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Studio */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <RagStudio />
      </section>

      {/* Knowledge base */}
      <section className="border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="text-2xl font-bold tracking-tight">Knowledge base</h2>
          <p className="mt-1 text-sm text-zinc-400">The corpus behind every answer — chunked by section, cited by chunk ID.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTS.map((d) => (
              <article key={d.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-semibold text-orange-300">{d.topic}</span>
                  <span className="text-xs text-zinc-500">{d.year}</span>
                </div>
                <h3 className="mt-2.5 text-sm font-semibold leading-snug text-zinc-100">{d.title}</h3>
                <p className="mt-1 text-[11px] text-zinc-500">{d.source}</p>
                <ul className="mt-2.5 space-y-1 text-xs text-zinc-400">
                  {d.sections.map((s, i) => (
                    <li key={s.heading} className="flex gap-1.5">
                      <span className="text-zinc-600">{d.id}#{i + 1}</span>
                      <span>{s.heading}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-6">
        <p className="mx-auto max-w-7xl px-6 text-xs text-zinc-600">
          MarsRAG · Built by Nagaraju Chinthalacheruvu · Next.js + TypeScript · Retrieval runs locally in demo mode —
          optional OpenAI/Anthropic generation can be layered on the same grounded context via environment keys.
          Corpus content is illustrative, written in NASA report style from public mission facts.
        </p>
      </footer>
    </main>
  );
}
