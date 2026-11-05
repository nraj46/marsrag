import { NextResponse } from "next/server";
import { connection } from "next/server";
import { DOCUMENTS } from "@/lib/documents";
import { KB_STATS } from "@/lib/rag";

export async function GET() {
  await connection();
  return NextResponse.json({
    stats: KB_STATS,
    documents: DOCUMENTS.map((d) => ({
      id: d.id,
      title: d.title,
      source: d.source,
      year: d.year,
      topic: d.topic,
      sections: d.sections.map((s) => s.heading),
    })),
  });
}
