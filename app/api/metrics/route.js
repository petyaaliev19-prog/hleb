import { NextResponse } from "next/server";
import { dbRepository } from "@/server/db/db-repository";

export async function GET() {
  return NextResponse.json({ metrics: await dbRepository.getOverviewMetrics() });
}
