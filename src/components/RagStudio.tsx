"use client";

import { useMemo, useRef, useState } from "react";
import type { EvalReport, QueryResponse } from "@/lib/rag";

const SAMPLE_QUESTIONS = [
  "How much oxygen did MOXIE produce, and how does solid-oxide electrolysis work?",
  "What evidence is there for an ancient lake in Gale Crater?",
  "How much regolith shielding does a Mars habitat need?",
  "How many flights did Ingenuity complete and why did the mission end?",
  "Where can astronauts mine subsurface water ice?",
  "What's the best pizza dough recipe?", // off-topic demo of the grounding guardrail
];

interface ChatTurn {
  question: string;
  response: QueryResponse | null;
  error?: string;
}

function renderAnswer(text: string) {
  // Turn [n] markers into highlighted chips.
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((p, i) =>
    /^\[\d+\]$/.test(p) ? (
      <span
        key={i}
        className="mx-0.5 inline-flex items-center rounded bg-orange-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-orange-300 align-baseline"
      >
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

function ScoreBar({ value, max = 1, color = "bg-orange-500" }: { value: number; max?: number; color?: string }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded bg-zinc-800">
      <div className={`h-1.5 rounded ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function RagStudio() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0); // index of turn shown in inspector
  const [evals, setEvals] = useState<EvalReport | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeTurn = turns[active] ?? turns[turns.length - 1];
  const avgLatency = useMemo(() => {
    const rs = turns.filter((t) => t.response).map((t) => t.response!.latencyMs);
    return rs.length ? Math.round(rs.reduce((a, b) => a + b, 0) / rs.length) : null;
  }, [turns]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);
    const idx = turns.length;
    setTurns((t) => [...t, { question: q, response: null }]);
    setActive(idx);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setTurns((t) => t.map((turn, i) => (i === idx ? { ...turn, response: data as QueryResponse } : turn)));
    } catch (e) {
      setTurns((t) =>
        t.map((turn, i) => (i === idx ? { ...turn, error: e instanceof Error ? e.message : "Error" } : turn))
      );
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  async function runEvalSuite() {
    setEvalLoading(true);
    try {
      const res = await fetch("/api/evals", { method: "POST" });
      const data = (await res.json()) as EvalReport;
      setEvals(data);
    } finally {
      setEvalLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* ---------- Chat column ---------- */}
      <div className="lg:col-span-3 flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
          <div>
            <h3 className="font-semibold text-zinc-100">Mission Q&amp;A</h3>
            <p className="text-xs text-zinc-400">Grounded answers with numbered citations — click a turn to inspect its retrieval.</p>
          </div>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
            DEMO MODE · local engine · $0/query
          </span>
        </div>

        <div className="max-h-[560px] min-h-[320px] flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {turns.length === 0 && (
            <div className="text-sm text-zinc-400">
              <p className="mb-3">Ask anything covered by the 13-report Mars archive, or try a sample:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-left text-xs text-zinc-200 transition hover:border-orange-500/60 hover:text-orange-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {turns.map((turn, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => setActive(i)}
                  className={`max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-left text-sm ${
                    active === i ? "bg-orange-600 text-white" : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                  }`}
                >
                  {turn.question}
                </button>
              </div>
              {turn.response ? (
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-sm leading-relaxed text-zinc-200">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                    <span className={`rounded px-1.5 py-0.5 font-semibold ${turn.response.lowConfidence ? "bg-red-500/15 text-red-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                      confidence {(turn.response.confidence * 100).toFixed(0)}%{turn.response.lowConfidence ? " · below grounding threshold" : ""}
                    </span>
                    <span>{turn.response.latencyMs} ms</span>
                    <span>{turn.response.tokensIn} in / {turn.response.tokensOut} out tokens</span>
                    <span>API-equiv. ${turn.response.estCostUsd.toFixed(5)}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{renderAnswer(turn.response.answer)}</div>
                </div>
              ) : turn.error ? (
                <p className="text-sm text-red-400">{turn.error}</p>
              ) : (
                <p className="animate-pulse text-sm text-zinc-500">Running chunk → embed → hybrid retrieve → rerank…</p>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          className="flex gap-2 border-t border-zinc-800 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Mars missions, geology, ISRU, life support…"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-orange-500/70"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-40"
          >
            {loading ? "…" : "Ask"}
          </button>
        </form>
        {avgLatency !== null && (
          <p className="border-t border-zinc-800 px-5 py-2 text-[11px] text-zinc-500">
            Session average latency: {avgLatency} ms across {turns.filter((t) => t.response).length} answered queries · engine: hashing TF-IDF vectors + BM25, hybrid fusion, signal reranker
          </p>
        )}
      </div>

      {/* ---------- Side column: citations + inspector + evals ---------- */}
      <div className="lg:col-span-2 space-y-6">
        {/* Citations */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="mb-1 font-semibold text-zinc-100">Citations</h3>
          <p className="mb-3 text-xs text-zinc-400">Sources for the selected answer — every claim maps to a chunk.</p>
          {activeTurn?.response ? (
            <div className="space-y-3">
              {activeTurn.response.citations.map((c) => (
                <div key={c.chunkId} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-100">
                      <span className="mr-1.5 rounded bg-orange-500/20 px-1.5 py-0.5 text-[11px] font-bold text-orange-300">[{c.n}]</span>
                      {c.docTitle}
                    </p>
                    <span className="shrink-0 text-xs font-semibold text-orange-300">{c.score.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-500">
                    {c.section} · {c.source} · chunk {c.chunkId}
                  </p>
                  <div className="mt-2"><ScoreBar value={c.score} /></div>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">{c.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Ask a question to see its sources.</p>
          )}
        </div>

        {/* Retrieval inspector */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="mb-1 font-semibold text-zinc-100">Retrieval Inspector</h3>
          <p className="mb-3 text-xs text-zinc-400">Hybrid ranking before vs. after the reranker (phrase, title-match and recency signals).</p>
          {activeTurn?.response ? (
            <div className="space-y-4">
              {(["preRerank", "postRerank"] as const).map((stage) => (
                <div key={stage}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {stage === "preRerank" ? "Before rerank (hybrid)" : "After rerank"}
                  </p>
                  <div className="space-y-2">
                    {activeTurn.response!.inspector[stage].slice(0, 5).map((row, i) => (
                      <div key={row.chunkId} className="rounded-lg border border-zinc-800 bg-zinc-950/70 px-3 py-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="truncate text-zinc-200">
                            <span className="mr-1 text-zinc-500">#{i + 1}</span>
                            {row.docTitle.split(":")[0]} — {row.section}
                          </span>
                          <span className="shrink-0 font-semibold text-zinc-100">
                            {(stage === "preRerank" ? row.hybrid : row.rerank).toFixed(3)}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <ScoreBar value={stage === "preRerank" ? row.hybrid : row.rerank} color={stage === "preRerank" ? "bg-zinc-500" : "bg-orange-500"} />
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-500">
                          vec {row.vector.toFixed(2)} · bm25 {row.bm25.toFixed(1)}
                          {stage === "postRerank" && (
                            <> · signals: phrase +{row.signals.phrase.toFixed(2)}, title +{row.signals.title.toFixed(2)}, recency {row.signals.recency >= 0 ? "+" : ""}{row.signals.recency.toFixed(2)}</>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Pipeline stages will appear here after your first query.</p>
          )}
        </div>

        {/* Evaluation panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-100">Evaluation Suite</h3>
            <button
              onClick={runEvalSuite}
              disabled={evalLoading}
              className="rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:opacity-40"
            >
              {evalLoading ? "Running…" : "Run evals"}
            </button>
          </div>
          <p className="mb-3 text-xs text-zinc-400">
            13-case golden set (12 topical + 1 off-topic control that must be refused). Executes the real pipeline server-side.
          </p>
          {evals ? (
            <div>
              <div className="mb-3 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-zinc-950/70 p-2.5">
                  <p className="text-lg font-bold text-emerald-400">{(evals.passRate * 100).toFixed(0)}%</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">Pass rate ({evals.passedCases}/{evals.totalCases})</p>
                </div>
                <div className="rounded-lg bg-zinc-950/70 p-2.5">
                  <p className="text-lg font-bold text-zinc-100">{(evals.avgCitationAccuracy * 100).toFixed(0)}%</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">Citation accuracy</p>
                </div>
                <div className="rounded-lg bg-zinc-950/70 p-2.5">
                  <p className="text-lg font-bold text-zinc-100">{evals.avgLatencyMs} ms</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">Avg latency</p>
                </div>
                <div className="rounded-lg bg-zinc-950/70 p-2.5">
                  <p className="text-lg font-bold text-zinc-100">${evals.avgCostUsd.toFixed(5)}</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">Est. cost / query*</p>
                </div>
              </div>
              <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {evals.results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950/70 px-2.5 py-2 text-xs">
                    <span className={r.passed ? "text-emerald-400" : "text-red-400"}>{r.passed ? "✓" : "✗"}</span>
                    <span className="flex-1 text-zinc-300">{r.question}</span>
                    <span className="shrink-0 text-zinc-500">{r.latencyMs} ms</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-zinc-600">*API-equivalent estimate; demo engine runs locally at $0. Ran {new Date(evals.ranAt).toLocaleTimeString()}.</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No eval run yet this session.</p>
          )}
        </div>
      </div>
    </div>
  );
}
