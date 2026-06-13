import test from "node:test";
import assert from "node:assert/strict";
import { getBakeryBySlug, getOrdersByDate } from "../data/mock-data.js";
import {
  buildCartItems,
  buildDashboardSummary,
  calculateCartTotals,
  groupOrdersBySlot,
  normalizeCartQty,
} from "../lib/order-utils.js";

test("normalizeCartQty clamps values into valid range", () => {
  assert.equal(normalizeCartQty(-4, 10), 0);
  assert.equal(normalizeCartQty(4, 10), 4);
  assert.equal(normalizeCartQty(14, 10), 10);
});

test("buildCartItems and calculateCartTotals derive cart state from products", () => {
  const bakery = getBakeryBySlug("muka");
  const cartItems = buildCartItems(bakery.products, { "prod-1": 2, "prod-3": 1, "prod-999": 4 });
  const totals = calculateCartTotals(cartItems);

  assert.equal(cartItems.length, 2);
  assert.deepEqual(
    cartItems.map((item) => ({ id: item.id, qty: item.qty })),
    [
      { id: "prod-1", qty: 2 },
      { id: "prod-3", qty: 1 },
    ],
  );
  assert.deepEqual(totals, { totalItems: 3, totalPrice: 530 });
});

test("buildDashboardSummary aggregates quantities by product name", () => {
  const summary = buildDashboardSummary(getOrdersByDate("2026-06-14"));
  assert.deepEqual(summary, [
    ["Французский багет", 2],
    ["Бородинский", 1],
    ["Круассан классический", 4],
  ]);
});

test("groupOrdersBySlot groups daily orders under pickup slot labels", () => {
  const grouped = groupOrdersBySlot(getOrdersByDate("2026-06-14"));
  assert.deepEqual(Object.keys(grouped).sort(), ["08:00-10:00", "10:00-12:00"]);
  assert.equal(grouped["08:00-10:00"][0].id, "ORD-1042");
});
