import { seedBakeries, seedOrders } from "../data/seed-data.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildOrderId(existingOrders) {
  const maxNumeric = existingOrders.reduce((max, order) => {
    const numeric = Number.parseInt(String(order.id).replace(/\D/g, ""), 10);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 1044);

  return `ORD-${maxNumeric + 1}`;
}

export function createMockStore({ bakeries = seedBakeries, orders = seedOrders } = {}) {
  const state = {
    bakeries: clone(bakeries),
    orders: clone(orders),
  };

  function getBakeries() {
    return clone(state.bakeries);
  }

  function getBakeryById(id) {
    return state.bakeries.find((bakery) => bakery.id === id);
  }

  function getBakeryBySlug(slug) {
    return state.bakeries.find((bakery) => bakery.slug === slug);
  }

  function getOrders({ date, bakeryId } = {}) {
    return clone(
      state.orders.filter((order) => {
        if (date && order.pickupDate !== date) {
          return false;
        }
        if (bakeryId && order.bakeryId !== bakeryId) {
          return false;
        }
        return true;
      }),
    );
  }

  function getAvailableDates() {
    const dates = new Set();
    for (const bakery of state.bakeries) {
      for (const slot of bakery.slots) {
        dates.add(slot.date);
      }
    }
    for (const order of state.orders) {
      dates.add(order.pickupDate);
    }
    return [...dates].sort();
  }

  function getOverviewMetrics() {
    const primaryDate = getAvailableDates()[0];
    const ordersForDate = getOrders({ date: primaryDate });
    return {
      primaryDate,
      bakeriesCount: state.bakeries.length,
      ordersCount: ordersForDate.length,
      itemsCount: ordersForDate.reduce(
        (sum, order) => sum + order.items.reduce((inner, item) => inner + item.qty, 0),
        0,
      ),
    };
  }

  function createOrder(payload) {
    const {
      bakeryId,
      pickupDate,
      pickupSlotId,
      customerName,
      customerPhone,
      comment = "",
      items = [],
    } = payload;

    const bakery = getBakeryById(bakeryId);
    if (!bakery) {
      throw new Error("Bakery not found");
    }

    const slot = bakery.slots.find((item) => item.id === pickupSlotId && item.date === pickupDate);
    if (!slot) {
      throw new Error("Pickup slot is invalid");
    }

    if (!customerName?.trim()) {
      throw new Error("Customer name is required");
    }

    if (!customerPhone?.trim()) {
      throw new Error("Customer phone is required");
    }

    if (!items.length) {
      throw new Error("Order items are required");
    }

    const normalizedItems = items.map((item) => {
      if (!item.productId) {
        throw new Error("Product id is required");
      }
      if (!Number.isInteger(item.qty) || item.qty <= 0) {
        throw new Error("Quantity must be a positive integer");
      }

      const product = bakery.products.find((candidate) => candidate.id === item.productId);
      if (!product) {
        throw new Error("Product not found in bakery");
      }

      const available = product.availability[pickupDate] ?? 0;
      if (item.qty > available) {
        throw new Error("Requested quantity exceeds availability");
      }

      return { product, qty: item.qty };
    });

    for (const entry of normalizedItems) {
      entry.product.availability[pickupDate] -= entry.qty;
    }

    const order = {
      id: buildOrderId(state.orders),
      bakeryId: bakery.id,
      bakeryName: bakery.name,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      pickupDate,
      pickupSlotId: slot.id,
      pickupSlotLabel: slot.label,
      status: "new",
      comment: comment.trim(),
      items: normalizedItems.map(({ product, qty }) => ({
        productId: product.id,
        name: product.name,
        qty,
        price: product.price,
      })),
    };

    state.orders.unshift(order);

    return {
      order: clone(order),
      bakery: clone(bakery),
      metrics: getOverviewMetrics(),
    };
  }

  return {
    getBakeries,
    getBakeryById: (id) => clone(getBakeryById(id)),
    getBakeryBySlug: (slug) => clone(getBakeryBySlug(slug)),
    getOrders,
    getAvailableDates,
    getOverviewMetrics,
    createOrder,
  };
}

const globalStore = globalThis.__hlebushekStore ?? createMockStore();

if (!globalThis.__hlebushekStore) {
  globalThis.__hlebushekStore = globalStore;
}

export const mockStore = globalStore;
