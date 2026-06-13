import { NextResponse } from "next/server";
import { dbRepository } from "@/lib/db-repository";

export async function GET(_request, { params }) {
  const bakery = await dbRepository.getBakeryBySlug(params.slug);

  if (!bakery) {
    return NextResponse.json({ error: "Bakery not found" }, { status: 404 });
  }

  return NextResponse.json({ bakery });
}
