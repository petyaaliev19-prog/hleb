import test from "node:test";
import assert from "node:assert/strict";
import { formatDate, formatPrice, getStatusLabel } from "../lib/format.js";

test("formatPrice formats rubles without kopecks", () => {
  assert.equal(formatPrice(170), "170\u00a0\u20bd");
});

test("formatDate returns readable Russian date label", () => {
  const formatted = formatDate("2026-06-14");
  assert.match(formatted, /14/);
  assert.match(formatted.toLowerCase(), /июн|июня/);
});

test("getStatusLabel resolves known statuses and falls back for unknown", () => {
  assert.equal(getStatusLabel("ready"), "Готов");
  assert.equal(getStatusLabel("picked_up"), "Выдан");
  assert.equal(getStatusLabel("mystery"), "mystery");
});
