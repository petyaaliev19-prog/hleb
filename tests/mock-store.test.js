import test from "node:test";
import assert from "node:assert/strict";
import { createMockStore } from "../lib/mock-store.js";

test("mock store creates order and decreases bakery availability", () => {
  const store = createMockStore();
  const result = store.createOrder({
    bakeryId: "bakery-1",
    pickupDate: "2026-06-14",
    pickupSlotId: "slot-1",
    customerName: "Тестовый клиент",
    customerPhone: "+79990000000",
    comment: "Потестировать заказ",
    items: [
      { productId: "prod-1", qty: 3 },
      { productId: "prod-2", qty: 2 },
    ],
  });

  assert.equal(result.order.id, "ORD-1045");
  assert.equal(result.order.status, "new");
  assert.equal(store.getOrders({ date: "2026-06-14" }).length, 3);
  assert.equal(store.getBakeryById("bakery-1").products.find((item) => item.id === "prod-1").availability["2026-06-14"], 15);
  assert.equal(store.getBakeryById("bakery-1").products.find((item) => item.id === "prod-2").availability["2026-06-14"], 8);
  assert.equal(result.metrics.ordersCount, 3);
  assert.equal(result.metrics.itemsCount, 12);
});

test("mock store rejects orders with invalid availability", () => {
  const store = createMockStore();

  assert.throws(
    () =>
      store.createOrder({
        bakeryId: "bakery-1",
        pickupDate: "2026-06-14",
        pickupSlotId: "slot-1",
        customerName: "Тестовый клиент",
        customerPhone: "+79990000000",
        items: [{ productId: "prod-3", qty: 99 }],
      }),
    /Requested quantity exceeds availability/,
  );
});

test("mock store rejects duplicate product lines in one order", () => {
  const store = createMockStore();

  assert.throws(
    () =>
      store.createOrder({
        bakeryId: "bakery-1",
        pickupDate: "2026-06-14",
        pickupSlotId: "slot-1",
        customerName: "Покупатель",
        customerPhone: "+79990000000",
        items: [
          { productId: "prod-1", qty: 1 },
          { productId: "prod-1", qty: 1 },
        ],
      }),
    /Duplicate order items are not allowed/,
  );
});

test("mock store rejects invalid pickup slot for selected bakery and date", () => {
  const store = createMockStore();

  assert.throws(
    () =>
      store.createOrder({
        bakeryId: "bakery-1",
        pickupDate: "2026-06-14",
        pickupSlotId: "slot-6",
        customerName: "Тестовый клиент",
        customerPhone: "+79990000000",
        items: [{ productId: "prod-1", qty: 1 }],
      }),
    /Pickup slot is invalid/,
  );
});
