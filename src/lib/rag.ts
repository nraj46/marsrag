// MarsRAG retrieval engine — runs fully locally in "Demo mode" (no API key).
// Pipeline: chunk -> embed (hashing TF-IDF vectors) -> hybrid retrieval
// (vector cosine + BM25) -> rerank (phrase / title / recency cross-signals)
// -> grounded, extractive answer composition with numbered citations.

import { DOCUMENTS } from "./documents";

export interface Chunk {
  id: string;
  docId: string;
  docTitle: string;
  source: string;
  year: number;
  topic: string;
  section: string;
  text: string;
  tokens: string[];
}

const STOPWORDS = new Set(
  "the a an and or of to in on for with by at from as is are was were be been being it its this that these those what how why when where which who whom can could should would do does did have has had will shall may might than then so such into about over under more most other some any only also just".split(" ")
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.%-]/g, " ")
    .split(/[\s]+/)
    .map((t) => t.replace(/^[.\-%]+|[.\-%]+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// ---------- Chunking ----------
export const CHUNKS: Chunk[] = DOCUMENTS.flatMap((doc) =>
  doc.sections.map((sec, i) => {
    const text = sec.body.trim();
    return {
      id: `${doc.id}#${i + 1}`,
      docId: doc.id,
      docTitle: doc.title,
      source: doc.source,
      year: doc.year,
      topic: doc.topic,
      section: sec.heading,
      text,
      tokens: tokenize(`${doc.title} ${sec.heading} ${text}`),
    };
  })
);

// ---------- IDF over the corpus ----------
const DF = new Map<string, number>();
for (const chunk of CHUNKS) {
  for (const term of new Set(chunk.tokens)) DF.set(term, (DF.get(term) ?? 0) + 1);
}
const N = CHUNKS.length;
function idf(term: string): number {
  const df = DF.get(term) ?? 0;
  return Math.log(1 + (N - df + 0.5) / (df + 0.5));
}

// ---------- Hashing embeddings (feature hashing, TF-IDF weighted) ----------
const DIM = 512;
function hashToken(term: string): number {
  // FNV-1a
  let h = 0x811c9dc5;
  for (let i = 0; i < term.length; i++) {
    h ^= term.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h) % DIM;
}

function embed(tokens: string[]): Float32Array {
  const vec = new Float32Array(DIM);
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  for (const [term, c] of counts) {
    vec[hashToken(term)] += (1 + Math.log(c)) * idf(term);
  }
  let norm = 0;
  for (let i = 0; i < DIM; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < DIM; i++) vec[i] /= norm;
  return vec;
}

const CHUNK_VECTORS = CHUNKS.map((c) => embed(c.tokens));
const AVG_DL = CHUNKS.reduce((s, c) => s + c.tokens.length, 0) / N;

// ---------- BM25 ----------
function bm25(queryTokens: string[], chunk: Chunk): number {
  const k1 = 1.5;
  const b = 0.75;
  const freq = new Map<string, number>();
  for (const t of chunk.tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  let score = 0;
  for (const term of new Set(queryTokens)) {
    const f = freq.get(term) ?? 0;
    if (f === 0) continue;
    const denom = f + k1 * (1 - b + (b * chunk.tokens.length) / AVG_DL);
    score += idf(term) * ((f * (k1 + 1)) / denom);
  }
  return score;
}

function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  for (let i = 0; i < DIM; i++) dot += a[i] * b[i];
  return dot; // both vectors are L2-normalized
}

// ---------- Retrieval + reranking ----------
export interface ScoredChunk {
  chunk: Chunk;
  vectorScore: number;
  bm25Score: number;
  hybridScore: number;
  rerankScore: number;
  rerankSignals: { phrase: number; title: number; recency: number };
}

export interface RetrievalResult {
  query: string;
  preRerank: ScoredChunk[];
  postRerank: ScoredChunk[];
  confidence: number;
  lowConfidence: boolean;
  latencyMs: number;
}

const CONFIDENCE_THRESHOLD = 0.32;

function bigrams(tokens: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i + 1 < tokens.length; i++) out.push(`${tokens[i]} ${tokens[i + 1]}`);
  return out;
}

export function retrieve(query: string, topK = 5): RetrievalResult {
  const started = performance.now();
  const qTokens = tokenize(query);
  const qVec = embed(qTokens);
  const qBigrams = bigrams(
    query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1)
  );

  const raw = CHUNKS.map((chunk, i) => ({
    chunk,
    vectorScore: Math.max(0, cosine(qVec, CHUNK_VECTORS[i])),
    bm25Score: bm25(qTokens, chunk),
  }));

  const maxVec = Math.max(...raw.map((r) => r.vectorScore), 1e-9);
  const maxBm = Math.max(...raw.map((r) => r.bm25Score), 1e-9);

  const hybridized: ScoredChunk[] = raw.map((r) => {
    const hybrid = 0.5 * (r.vectorScore / maxVec) + 0.5 * (r.bm25Score / maxBm);
    return {
      ...r,
      hybridScore: hybrid,
      rerankScore: hybrid,
      rerankSignals: { phrase: 0, title: 0, recency: 0 },
    };
  });

  const preRerank = [...hybridized].sort((a, b) => b.hybridScore - a.hybridScore).slice(0, 6);

  // Rerank: cross-signals on top of the hybrid score.
  const reranked = hybridized.map((r) => {
    const text = r.chunk.text.toLowerCase();
    let phraseHits = 0;
    for (const bg of qBigrams) if (text.includes(bg)) phraseHits++;
    const phrase = Math.min(phraseHits * 0.08, 0.24);

    const titleTokens = tokenize(r.chunk.docTitle);
    const titleHits = qTokens.filter((t) => titleTokens.includes(t)).length;
    const title = qTokens.length ? (titleHits / qTokens.length) * 0.18 : 0;

    const recency = ((r.chunk.year - 2022) / 3) * 0.04; // 2022 -> 0, 2025 -> +0.04

    return {
      ...r,
      rerankScore: r.hybridScore * 0.82 + phrase + title + recency,
      rerankSignals: { phrase, title, recency },
    };
  });

  const postRerank = [...reranked].sort((a, b) => b.rerankScore - a.rerankScore).slice(0, topK);

  // Absolute confidence from raw signals (normalized scores always max at 1,
  // so confidence must come from un-normalized evidence strength).
  const top = postRerank[0];
  const rawTop = raw.find((r) => r.chunk.id === top?.chunk.id);
  const confidence = top
    ? Math.min(
        1,
        0.55 * Math.min(1, (rawTop?.vectorScore ?? 0) / 0.42) +
          0.45 * Math.min(1, (rawTop?.bm25Score ?? 0) / 9)
      )
    : 0;

  return {
    query,
    preRerank,
    postRerank,
    confidence,
    lowConfidence: confidence < CONFIDENCE_THRESHOLD,
    latencyMs: Math.max(1, Math.round(performance.now() - started)),
  };
}

// ---------- Grounded answer composition (extractive, Demo mode) ----------
export interface Citation {
  n: number;
  chunkId: string;
  docTitle: string;
  source: string;
  section: string;
  score: number;
  snippet: string;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  confidence: number;
  lowConfidence: boolean;
  mode: "demo";
  latencyMs: number;
  tokensIn: number;
  tokensOut: number;
  estCostUsd: number;
  inspector: {
    preRerank: InspectorRow[];
    postRerank: InspectorRow[];
  };
}

export interface InspectorRow {
  chunkId: string;
  docTitle: string;
  section: string;
  vector: number;
  bm25: number;
  hybrid: number;
  rerank: number;
  signals: { phrase: number; title: number; recency: number };
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

function sentenceScore(sentence: string, qTokens: string[]): number {
  const toks = tokenize(sentence);
  const set = new Set(toks);
  let hits = 0;
  for (const t of new Set(qTokens)) if (set.has(t)) hits += idf(t);
  return hits;
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 4));
}

export function answerQuery(query: string): QueryResponse {
  const started = performance.now();
  const r = retrieve(query, 4);
  const qTokens = tokenize(query);

  const citations: Citation[] = r.postRerank.map((s, i) => ({
    n: i + 1,
    chunkId: s.chunk.id,
    docTitle: s.chunk.docTitle,
    source: s.chunk.source,
    section: s.chunk.section,
    score: Number(s.rerankScore.toFixed(3)),
    snippet: s.chunk.text.slice(0, 220) + "…",
  }));

  let answer: string;
  if (r.lowConfidence || r.postRerank.length === 0) {
    answer =
      "I could not find strong evidence for that in the Mars research archive. " +
      "The closest material is cited below, but its relevance score is below the grounding threshold, " +
      "so I won't compose a definitive answer from it. Try rephrasing with mission or topic terms " +
      "(for example: MOXIE, Gale Crater, Olympus Mons, radiation shielding, Ingenuity, subsurface ice).";
  } else {
    const parts: string[] = [];
    r.postRerank.slice(0, 3).forEach((s, idx) => {
      const sentences = splitSentences(s.chunk.text)
        .map((sent) => ({ sent, score: sentenceScore(sent, qTokens) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .sort((a, b) => s.chunk.text.indexOf(a.sent) - s.chunk.text.indexOf(b.sent));
      for (const { sent } of sentences) parts.push(`${sent} [${idx + 1}]`);
    });
    answer =
      `Based on ${Math.min(3, r.postRerank.length)} sources from the Mars research archive ` +
      `(retrieval confidence ${(r.confidence * 100).toFixed(0)}%):\n\n` +
      parts.join(" ");
  }

  const tokensIn = estimateTokens(query) + r.postRerank.reduce((s, c) => s + estimateTokens(c.chunk.text), 0);
  const tokensOut = estimateTokens(answer);
  // API-equivalent estimate at small-model rates ($0.15 / $0.60 per 1M tokens).
  // Demo mode itself runs locally at $0.
  const estCostUsd = (tokensIn / 1e6) * 0.15 + (tokensOut / 1e6) * 0.6;

  const toRow = (s: ScoredChunk): InspectorRow => ({
    chunkId: s.chunk.id,
    docTitle: s.chunk.docTitle,
    section: s.chunk.section,
    vector: Number(s.vectorScore.toFixed(3)),
    bm25: Number(s.bm25Score.toFixed(2)),
    hybrid: Number(s.hybridScore.toFixed(3)),
    rerank: Number(s.rerankScore.toFixed(3)),
    signals: {
      phrase: Number(s.rerankSignals.phrase.toFixed(3)),
      title: Number(s.rerankSignals.title.toFixed(3)),
      recency: Number(s.rerankSignals.recency.toFixed(3)),
    },
  });

  return {
    answer,
    citations,
    confidence: Number(r.confidence.toFixed(3)),
    lowConfidence: r.lowConfidence,
    mode: "demo",
    latencyMs: Math.max(1, Math.round(performance.now() - started)),
    tokensIn,
    tokensOut,
    estCostUsd: Number(estCostUsd.toFixed(6)),
    inspector: {
      preRerank: r.preRerank.map(toRow),
      postRerank: r.postRerank.map(toRow),
    },
  };
}

// ---------- Evaluation set ----------
export interface EvalCase {
  question: string;
  expectedDocId: string | null; // null = off-topic control; system must flag low confidence
  note: string;
}

export const EVAL_CASES: EvalCase[] = [
  { question: "How much oxygen did MOXIE produce in total and how does it work?", expectedDocId: "moxie", note: "MOXIE totals + electrolysis" },
  { question: "How tall is Olympus Mons and why did it grow so large?", expectedDocId: "olympus-mons", note: "Olympus Mons dimensions/formation" },
  { question: "What evidence did Curiosity find for an ancient lake in Gale Crater?", expectedDocId: "gale-crater", note: "Gale lake evidence" },
  { question: "How much regolith shielding does a Mars habitat need against radiation?", expectedDocId: "radiation", note: "Regolith shielding depth" },
  { question: "Why did the 2018 global dust storm end the Opportunity rover mission?", expectedDocId: "dust-storms", note: "2018 storm / Opportunity" },
  { question: "What is the heaviest payload landed on Mars and what limits EDL mass?", expectedDocId: "edl", note: "EDL mass ceiling" },
  { question: "How many flights did the Ingenuity helicopter complete?", expectedDocId: "ingenuity", note: "Ingenuity flight count" },
  { question: "Where is subsurface water ice accessible for a human landing site?", expectedDocId: "subsurface-ice", note: "SWIM ice mapping" },
  { question: "What water recovery rate does Mars life support need to reach?", expectedDocId: "life-support", note: "98% water closure" },
  { question: "What is the one-way radio delay between Earth and Mars?", expectedDocId: "comm-delay", note: "Light-time delay range" },
  { question: "Why are perchlorates in Martian soil a problem for growing crops?", expectedDocId: "regolith-ag", note: "Perchlorate toxicity" },
  { question: "How large is the liquid core of Mars measured by InSight?", expectedDocId: "insight-seismology", note: "Core radius" },
  { question: "What is the best recipe for Neapolitan pizza dough?", expectedDocId: null, note: "Off-topic control — must be flagged low-confidence" },
];

export interface EvalResult {
  question: string;
  expectedDocId: string | null;
  topDocId: string | null;
  passed: boolean;
  citationAccuracy: number;
  latencyMs: number;
  estCostUsd: number;
  confidence: number;
}

export interface EvalReport {
  results: EvalResult[];
  passRate: number;
  avgCitationAccuracy: number;
  avgLatencyMs: number;
  avgCostUsd: number;
  totalCases: number;
  passedCases: number;
  ranAt: string;
}

export function runEvals(): EvalReport {
  const results: EvalResult[] = EVAL_CASES.map((c) => {
    const resp = answerQuery(c.question);
    const topDocId = resp.citations.length
      ? CHUNKS.find((ch) => ch.id === resp.citations[0].chunkId)?.docId ?? null
      : null;

    if (c.expectedDocId === null) {
      return {
        question: c.question,
        expectedDocId: null,
        topDocId,
        passed: resp.lowConfidence,
        citationAccuracy: resp.lowConfidence ? 1 : 0,
        latencyMs: resp.latencyMs,
        estCostUsd: resp.estCostUsd,
        confidence: resp.confidence,
      };
    }

    const top3Docs = resp.citations.slice(0, 3).map(
      (cit) => CHUNKS.find((ch) => ch.id === cit.chunkId)?.docId
    );
    const passed = top3Docs.includes(c.expectedDocId) && !resp.lowConfidence;
    const relevant = resp.citations.filter(
      (cit) => CHUNKS.find((ch) => ch.id === cit.chunkId)?.docId === c.expectedDocId
    ).length;
    return {
      question: c.question,
      expectedDocId: c.expectedDocId,
      topDocId,
      passed,
      citationAccuracy: resp.citations.length ? relevant / resp.citations.length : 0,
      latencyMs: resp.latencyMs,
      estCostUsd: resp.estCostUsd,
      confidence: resp.confidence,
    };
  });

  const passedCases = results.filter((r) => r.passed).length;
  return {
    results,
    passRate: passedCases / results.length,
    avgCitationAccuracy: results.reduce((s, r) => s + r.citationAccuracy, 0) / results.length,
    avgLatencyMs: Math.round(results.reduce((s, r) => s + r.latencyMs, 0) / results.length),
    avgCostUsd: Number((results.reduce((s, r) => s + r.estCostUsd, 0) / results.length).toFixed(6)),
    totalCases: results.length,
    passedCases,
    ranAt: new Date().toISOString(),
  };
}

export const KB_STATS = {
  documents: DOCUMENTS.length,
  chunks: CHUNKS.length,
  vocabulary: DF.size,
};
