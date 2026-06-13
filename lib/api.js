export async function fetchOrders({ date, bakeryId } = {}) {
  const search = new URLSearchParams();
  if (date) {
    search.set("date", date);
  }
  if (bakeryId) {
    search.set("bakeryId", bakeryId);
  }

  const response = await fetch(`/api/orders?${search.toString()}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function fetchMetrics() {
  const response = await fetch("/api/metrics", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }

  return response.json();
}

export async function fetchBakeries() {
  const response = await fetch("/api/bakeries", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch bakeries");
  }

  return response.json();
}

export async function fetchBakeryBySlug(slug) {
  const response = await fetch(`/api/bakeries/${slug}`, { cache: "no-store" });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to fetch bakery");
  }

  return data;
}

export async function createOrder(payload) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create order");
  }

  return data;
}

export async function updateOrderStatus(orderId, status) {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update order status");
  }

  return data;
}
