import Link from "next/link";

export function OwnerHomeView({ bakeries }) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Кабинет пекарни</p>
          <h2>Управление карточкой, витриной и выдачей заказов.</h2>
          <p className="hero-text">
            Выбери пекарню, чтобы посмотреть публичную карточку, ассортимент, слоты самовывоза
            и операционный срез по заказам.
          </p>
        </div>
      </section>

      <section className="catalog-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Мои пекарни</p>
            <h3>Карточки в каталоге</h3>
          </div>
        </div>

        <div className="owner-bakery-grid">
          {bakeries.map((bakery) => (
            <article className="bakery-card" key={bakery.id}>
              <div>
                <div className="bakery-meta">
                  <span className="bakery-badge">{bakery.badge}</span>
                  <span>{bakery.district}</span>
                </div>
                <h4>{bakery.name}</h4>
                <p className="storefront-lead">{bakery.lead}</p>
              </div>
              <div className="bakery-meta">
                <span>{bakery.address}</span>
                <span>{bakery.products.length} позиций</span>
                <span>{bakery.slots.length} слотов</span>
              </div>
              <div className="hero-actions">
                <Link className="inline-btn" href={`/owner/bakeries/${bakery.slug}`}>
                  Управлять
                </Link>
                <Link className="secondary-link" href={`/bakeries/${bakery.slug}`}>
                  Открыть витрину
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
