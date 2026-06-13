export function getBakeryDates(bakery) {
  return [...new Set((bakery?.slots ?? []).map((slot) => slot.date))].sort();
}
