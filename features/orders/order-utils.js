export function normalizeCartQty(nextQty, maxQty) {
  return Math.max(0, Math.min(nextQty, maxQty));
}

export function buildCartItems(products, cart) {
  return products
    .map((product) => ({ ...product, qty: cart[product.id] ?? 0 }))
    .filter((product) => product.qty > 0);
}

export function calculateCartTotals(cartItems) {
  return cartItems.reduce(
    (acc, item) => {
      acc.totalItems += item.qty;
      acc.totalPrice += item.qty * item.price;
      return acc;
    },
    { totalItems: 0, totalPrice: 0 },
  );
}

export function buildDashboardSummary(orders) {
  const summary = new Map();

  for (const order of orders) {
    for (const item of order.items) {
      summary.set(item.name, (summary.get(item.name) ?? 0) + item.qty);
    }
  }

  return [...summary.entries()];
}

export function groupOrdersBySlot(orders) {
  return orders.reduce((acc, order) => {
    acc[order.pickupSlotLabel] = acc[order.pickupSlotLabel] ?? [];
    acc[order.pickupSlotLabel].push(order);
    return acc;
  }, {});
}
