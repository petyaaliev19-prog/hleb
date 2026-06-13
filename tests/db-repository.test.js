import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createDbRepository } from "../lib/db-repository.js";

function createTempDbPath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hlebushek-db-"));
  return path.join(dir, "test.db");
}

test("db repository seeds bakeries and metrics on first boot", () => {
  const repository = createDbRepository(createTempDbPath());

  const bakeries = repository.getBakeries();
  const metrics = repository.getOverviewMetrics();

  assert.equal(bakeries.length, 3);
  assert.equal(metrics.primaryDate, "2026-06-14");
  assert.equal(metrics.ordersCount, 2);
});

test("db repository creates order and persists updated availability", () => {
  const repository = createDbRepository(createTempDbPath());

  const result = repository.createOrder({
    bakeryId: "bakery-1",
    pickupDate: "2026-06-14",
    pickupSlotId: "slot-1",
    customerName: "Покупатель",
    customerPhone: "+79990000000",
    items: [{ productId: "prod-1", qty: 2 }],
  });

  const bakery = repository.getBakeryBySlug("muka");
  const dailyOrders = repository.getOrders({ date: "2026-06-14", bakeryId: "bakery-1" });

  assert.equal(result.order.id, "ORD-1045");
  assert.equal(bakery.products.find((product) => product.id === "prod-1").availability["2026-06-14"], 16);
  assert.equal(dailyOrders.length, 2);
});

test("db repository rejects overbooking", () => {
  const repository = createDbRepository(createTempDbPath());

  assert.throws(
    () =>
      repository.createOrder({
        bakeryId: "bakery-1",
        pickupDate: "2026-06-14",
        pickupSlotId: "slot-1",
        customerName: "Покупатель",
        customerPhone: "+79990000000",
        items: [{ productId: "prod-3", qty: 50 }],
      }),
    /Requested quantity exceeds availability/,
  );
});

test("db repository updates order status through allowed transitions", () => {
  const repository = createDbRepository(createTempDbPath());

  const confirmed = repository.updateOrderStatus("ORD-1043", "confirmed");
  const ready = repository.updateOrderStatus("ORD-1043", "ready");
  const pickedUp = repository.updateOrderStatus("ORD-1043", "picked_up");

  assert.equal(confirmed.order.status, "confirmed");
  assert.equal(ready.order.status, "ready");
  assert.equal(pickedUp.order.status, "picked_up");
  assert.equal(repository.getOrderById("ORD-1043").status, "picked_up");
});

test("db repository rejects invalid order status transitions", () => {
  const repository = createDbRepository(createTempDbPath());

  assert.throws(
    () => repository.updateOrderStatus("ORD-1043", "ready"),
    /Order status transition is invalid/,
  );

  assert.throws(
    () => repository.updateOrderStatus("ORD-1043", "mystery"),
    /Order status is invalid/,
  );
});
