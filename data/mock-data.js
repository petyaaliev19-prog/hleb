import { seedBakeries, seedOrders } from "./seed-data.js";
import { getBakeryDates } from "../lib/bakery-utils.js";

export function getBakeries() {
  return seedBakeries;
}

export function getBakeryById(id) {
  return seedBakeries.find((bakery) => bakery.id === id);
}

export function getBakeryBySlug(slug) {
  return seedBakeries.find((bakery) => bakery.slug === slug);
}

export function getOrdersByDate(date) {
  return seedOrders.filter((order) => order.pickupDate === date);
}

export function getOrdersForBakeryByDate(bakeryId, date) {
  return seedOrders.filter((order) => order.bakeryId === bakeryId && order.pickupDate === date);
}

export function getAvailableDates() {
  return [...new Set(seedOrders.map((order) => order.pickupDate).concat(seedBakeries.flatMap(getBakeryDates)))].sort();
}

export function getOverviewMetrics() {
  const primaryDate = getAvailableDates()[0];
  const ordersForDate = getOrdersByDate(primaryDate);
  return {
    primaryDate,
    bakeriesCount: seedBakeries.length,
    ordersCount: ordersForDate.length,
    itemsCount: ordersForDate.reduce(
      (sum, order) => sum + order.items.reduce((inner, item) => inner + item.qty, 0),
      0,
    ),
  };
}
