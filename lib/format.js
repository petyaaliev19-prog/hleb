import { isKnownOrderStatus } from "../features/orders/order-status.js";

export function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "short",
  }).format(new Date(`${value}T12:00:00`));
}

export function getStatusLabel(status) {
  const labels = {
    new: "Новый",
    confirmed: "Подтвержден",
    ready: "Готов",
    picked_up: "Выдан",
    completed: "Выдан",
    not_picked_up: "Не забран",
    cancelled: "Отменен",
  };

  if (status === "completed") {
    return labels.completed;
  }

  return isKnownOrderStatus(status) ? labels[status] : status;
}
