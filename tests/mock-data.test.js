import test from "node:test";
import assert from "node:assert/strict";
import {
  getAvailableDates,
  getBakeryById,
  getBakeryBySlug,
  getBakeries,
  getOrdersByDate,
  getOrdersForBakeryByDate,
  getOverviewMetrics,
} from "../data/mock-data.js";
import { getBakeryDates } from "../lib/bakery-utils.js";

test("bakery selectors return expected bakery entities", () => {
  const bakery = getBakeryBySlug("muka");
  assert.ok(bakery);
  assert.equal(getBakeryById(bakery.id)?.slug, "muka");
});

test("getBakeryDates returns sorted unique dates for bakery slots", () => {
  const bakery = getBakeryBySlug("muka");
  assert.deepEqual(getBakeryDates(bakery), ["2026-06-14", "2026-06-15"]);
});

test("getOrdersByDate and getOrdersForBakeryByDate filter correctly", () => {
  const dailyOrders = getOrdersByDate("2026-06-14");
  const bakeryOrders = getOrdersForBakeryByDate("bakery-1", "2026-06-14");

  assert.equal(dailyOrders.length, 2);
  assert.equal(bakeryOrders.length, 1);
  assert.equal(bakeryOrders[0].id, "ORD-1042");
});

test("getAvailableDates combines slot and order dates without duplicates", () => {
  const dates = getAvailableDates();
  assert.deepEqual(dates, ["2026-06-14", "2026-06-15"]);
});

test("getOverviewMetrics reflects current mock overview", () => {
  const metrics = getOverviewMetrics();
  assert.equal(metrics.primaryDate, "2026-06-14");
  assert.equal(metrics.bakeriesCount, getBakeries().length);
  assert.equal(metrics.ordersCount, 2);
  assert.equal(metrics.itemsCount, 7);
});
