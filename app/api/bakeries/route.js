import { NextResponse } from "next/server";
import { dbRepository } from "@/lib/db-repository";

export async function GET() {
  return NextResponse.json({ bakeries: await dbRepository.getBakeries() });
}
