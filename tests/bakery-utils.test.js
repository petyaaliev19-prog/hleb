import test from "node:test";
import assert from "node:assert/strict";
import { getBakeryDates } from "../lib/bakery-utils.js";

test("getBakeryDates returns sorted unique dates and handles missing bakery", () => {
  assert.deepEqual(getBakeryDates(null), []);
  assert.deepEqual(
    getBakeryDates({
      slots: [
        { id: "slot-2", date: "2026-06-15", label: "10:00-12:00" },
        { id: "slot-1", date: "2026-06-14", label: "08:00-10:00" },
        { id: "slot-3", date: "2026-06-14", label: "12:00-14:00" },
      ],
    }),
    ["2026-06-14", "2026-06-15"],
  );
});
