import { NextResponse } from "next/server";
import { dbRepository } from "@/server/db/db-repository";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const bakery = await dbRepository.getBakeryBySlug(slug);

  if (!bakery) {
    return NextResponse.json({ error: "Bakery not found" }, { status: 404 });
  }

  return NextResponse.json({ bakery });
}
