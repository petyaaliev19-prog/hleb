"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOrders, updateOrderStatus } from "@/lib/api";
import { formatDate, getStatusLabel } from "@/lib/format";
import { getNextOrderStatuses } from "@/features/orders/order-status";
import { buildDashboardSummary, groupOrdersBySlot } from "@/features/orders/order-utils";

export function DashboardPanel({
  initialDate,
  initialBakeries,
  initialAvailableDates,
  initialOrders,
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedBakeryId, setSelectedBakeryId] = useState(initialBakeries[0]?.id ?? "");
  const [orders, setOrders] = useState(initialOrders);
  const [pendingOrderId, setPendingOrderId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      const data = await fetchOrders({ date: selectedDate, bakeryId: selectedBakeryId });
      if (active) {
        setOrders(data.orders);
      }
    }

    if (!selectedBakeryId) {
      setOrders([]);
      return undefined;
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
  }, [selectedDate, selectedBakeryId]);

  const selectedBakery = useMemo(
    () => initialBakeries.find((bakery) => bakery.id === selectedBakeryId) ?? null,
    [initialBakeries, selectedBakeryId],
  );
  const summary = useMemo(() => buildDashboardSummary(orders), [orders]);
  const ordersBySlot = useMemo(() => groupOrdersBySlot(orders), [orders]);

  async function handleStatusChange(orderId, status) {
    setPendingOrderId(orderId);

    try {
      const result = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? result.order : order)),
      );
      window.dispatchEvent(new CustomEvent("orders:changed"));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Не удалось обновить статус заказа");
    } finally {
      setPendingOrderId("");
    }
  }

  return (
    <section className="dashboard-screen">
      <div className="section-header">
        <div>
          <p className="eyebrow">Панель пекарни</p>
          <h3>Операционный срез на день</h3>
        </div>
        <div className="hero-actions">
          <label className="field compact-field">
            <span>Дата</span>
            <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
              {initialAvailableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </label>
          <label className="field compact-field">
            <span>Пекарня</span>
            <select value={selectedBakeryId} onChange={(event) => setSelectedBakeryId(event.target.value)}>
              {initialBakeries.map((bakery) => (
                <option key={bakery.id} value={bakery.id}>
                  {bakery.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="storefront-lead">
        {selectedBakery?.name ?? "Пекарня"}: панель показывает план выпечки и выдачи на выбранную дату.
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">План производства</p>
              <h4>Сводка по позициям</h4>
            </div>
          </div>
          <div className="summary-list">
            {summary.length ? (
              summary.map(([name, qty]) => (
                <article className="summary-item" key={name}>
                  <span>{name}</span>
                  <strong>{qty}</strong>
                </article>
              ))
            ) : (
              <div className="empty-state">На эту дату у пекарни пока нет заказов.</div>
            )}
          </div>
        </article>

        <article className="dashboard-card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Выдача</p>
              <h4>Заказы по слотам</h4>
            </div>
          </div>
          <div className="pickup-timeline">
            {Object.keys(ordersBySlot).length ? (
              Object.entries(ordersBySlot).map(([slotLabel, slotOrders]) => (
                <article className="timeline-slot" key={slotLabel}>
                  <h5>{slotLabel}</h5>
                  <div className="timeline-order-list">
                    {slotOrders.map((order) => {
                      const nextStatuses = getNextOrderStatuses(order.status);
                      const isPending = pendingOrderId === order.id;

                      return (
                        <article className="timeline-order-card" key={order.id}>
                          <div className="timeline-order-top">
                            <div>
                              <strong>{order.customerName}</strong>
                              <div className="order-meta">
                                <span>{order.id}</span>
                                <span>{order.customerPhone}</span>
                              </div>
                            </div>
                            <span className={`status-chip ${order.status}`}>{getStatusLabel(order.status)}</span>
                          </div>

                          <div className="order-meta">
                            <span>{order.items.map((item) => `${item.name} x ${item.qty}`).join(", ")}</span>
                            <span>{order.comment || "Без комментария"}</span>
                          </div>

                          {nextStatuses.length ? (
                            <div className="status-actions">
                              {nextStatuses.map((status) => (
                                <button
                                  key={status}
                                  className="inline-btn"
                                  disabled={isPending}
                                  onClick={() => handleStatusChange(order.id, status)}
                                  type="button"
                                >
                                  {isPending ? "Сохраняем..." : getStatusLabel(status)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="order-meta">Финальный статус, действий больше не требуется.</div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">Слоты будут заполнены, как только появятся заказы.</div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
