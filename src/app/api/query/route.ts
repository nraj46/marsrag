import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { answerQuery } from "@/lib/rag";

export async function POST(req: NextRequest) {
  await connection();
  const body = await req.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "Field 'question' is required." }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: "Question too long (max 500 chars)." }, { status: 400 });
  }
  const result = answerQuery(question);
  return NextResponse.json(result);
}
