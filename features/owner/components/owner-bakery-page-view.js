import Link from "next/link";
import { DashboardPanel } from "@/features/dashboard/components/dashboard-panel";
import { formatDate, formatPrice } from "@/lib/format";

export function OwnerBakeryPageView({
  bakery,
  allBakeries,
  initialDate,
  initialAvailableDates,
  initialOrders,
}) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Управление пекарней</p>
          <h2>{bakery.name}</h2>
          <p className="hero-text">{bakery.lead}</p>
          <div className="hero-actions">
            <Link className="primary-btn" href={`/bakeries/${bakery.slug}`}>
              Открыть публичную витрину
            </Link>
            <Link className="ghost-btn" href="/owner">
              Все пекарни
            </Link>
          </div>
        </div>
      </section>

      <section className="owner-management-grid">
        <article className="dashboard-card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Публичная карточка</p>
              <h4>{bakery.name}</h4>
            </div>
            <span className="bakery-badge">{bakery.badge}</span>
          </div>
          <p className="storefront-lead">{bakery.lead}</p>
          <div className="bakery-meta">
            <span>{bakery.district}</span>
            <span>{bakery.address}</span>
            <span>{bakery.hours}</span>
            <span>{bakery.phone}</span>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Ассортимент</p>
              <h4>Позиции в витрине</h4>
            </div>
          </div>
          <div className="summary-list">
            {bakery.products.map((product) => (
              <article className="summary-item" key={product.id}>
                <span>{product.name}</span>
                <strong>{formatPrice(product.price)}</strong>
              </article>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Самовывоз</p>
              <h4>Слоты выдачи</h4>
            </div>
          </div>
          <div className="summary-list">
            {bakery.slots.map((slot) => (
              <article className="summary-item" key={slot.id}>
                <span>{formatDate(slot.date)}</span>
                <strong>{slot.label}</strong>
              </article>
            ))}
          </div>
        </article>
      </section>

      <DashboardPanel
        initialDate={initialDate}
        initialBakeries={allBakeries}
        initialAvailableDates={initialAvailableDates}
        initialOrders={initialOrders}
        initialBakeryId={bakery.id}
      />
    </>
  );
}
