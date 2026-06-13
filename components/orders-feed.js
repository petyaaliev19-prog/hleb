"use client";

import { useEffect, useState } from "react";
import { getAvailableDates } from "@/data/mock-data";
import { fetchOrders } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { OrderCard } from "@/components/order-card";

export function OrdersFeed({ initialDate, initialOrders }) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      const data = await fetchOrders({ date: selectedDate });
      if (active) {
        setOrders(data.orders);
      }
    }

    loadOrders().catch(() => {});

    function handleRefresh() {
      loadOrders().catch(() => {});
    }

    window.addEventListener("orders:changed", handleRefresh);
    return () => {
      active = false;
      window.removeEventListener("orders:changed", handleRefresh);
    };
  }, [selectedDate]);

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  return (
    <section className="orders-screen">
      <div className="section-header">
        <div>
          <p className="eyebrow">Лента заказов</p>
          <h3>Что уже оформили покупатели</h3>
        </div>
        <label className="field compact-field">
          <span>Дата</span>
          <select value={selectedDate} onChange={(event) => handleDateChange(event.target.value)}>
            {getAvailableDates().map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="orders-list">
        {orders.length ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <div className="empty-state">На выбранную дату заказов пока нет.</div>
        )}
      </div>
    </section>
  );
}
