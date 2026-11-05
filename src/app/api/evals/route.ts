import { NextResponse } from "next/server";
import { connection } from "next/server";
import { runEvals } from "@/lib/rag";

export async function POST() {
  await connection();
  const report = runEvals();
  return NextResponse.json(report);
}
