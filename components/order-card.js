import { getStatusLabel } from "@/lib/format";

export function OrderCard({ order }) {
  return (
    <article className="order-card">
      <div className="order-card-header">
        <div>
          <div className="order-meta">
            <span>{order.id}</span>
            <span>{order.bakeryName}</span>
            <span>{order.pickupSlotLabel}</span>
          </div>
          <h4>{order.customerName}</h4>
          <div className="order-meta">
            <span>{order.customerPhone}</span>
            <span>{order.comment || "Без комментария"}</span>
          </div>
        </div>
        <span className={`status-chip ${order.status}`}>{getStatusLabel(order.status)}</span>
      </div>
      <div className="order-meta">
        {order.items.map((item) => (
          <span key={`${order.id}-${item.productId}`}>
            {item.name} x {item.qty}
          </span>
        ))}
      </div>
    </article>
  );
}
