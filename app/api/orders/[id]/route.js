import { NextResponse } from "next/server";
import { dbRepository } from "@/server/db/db-repository";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const result = await dbRepository.updateOrderStatus(id, payload.status);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update order status";
    const status =
      message === "Order not found"
        ? 404
        : message === "Order status is invalid" || message === "Order status transition is invalid"
          ? 400
          : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
