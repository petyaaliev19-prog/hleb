import { NextResponse } from "next/server";
import { dbRepository } from "@/lib/db-repository";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;
  const bakeryId = searchParams.get("bakeryId") ?? undefined;

  return NextResponse.json({
    orders: await dbRepository.getOrders({ date, bakeryId }),
    metrics: await dbRepository.getOverviewMetrics(),
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await dbRepository.createOrder(payload);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 400 },
    );
  }
}
