import test from "node:test";
import assert from "node:assert/strict";
import {
  canTransitionOrderStatus,
  getNextOrderStatuses,
  isKnownOrderStatus,
} from "../features/orders/order-status.js";

test("order status helpers expose known statuses and next transitions", () => {
  assert.equal(isKnownOrderStatus("confirmed"), true);
  assert.equal(isKnownOrderStatus("mystery"), false);
  assert.deepEqual(getNextOrderStatuses("ready"), ["picked_up", "not_picked_up"]);
});

test("order status transitions allow only the configured flow", () => {
  assert.equal(canTransitionOrderStatus("new", "confirmed"), true);
  assert.equal(canTransitionOrderStatus("new", "ready"), false);
  assert.equal(canTransitionOrderStatus("ready", "picked_up"), true);
  assert.equal(canTransitionOrderStatus("picked_up", "cancelled"), false);
  assert.equal(canTransitionOrderStatus("confirmed", "confirmed"), true);
});
