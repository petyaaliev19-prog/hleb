import Link from "next/link";
import { formatPrice } from "@/lib/format";

function getStartingPrice(products) {
  if (!products.length) {
    return null;
  }

  return Math.min(...products.map((product) => product.price));
}

function getProductPreview(products) {
  return products.slice(0, 3);
}

export function PublicBakeryCatalog({ initialBakeries }) {
  return (
    <section className="catalog-panel" id="bakeries">
      <div className="section-header">
        <div>
          <p className="eyebrow">Каталог пекарен</p>
          <h3>Выбери, где забрать хлеб</h3>
        </div>
      </div>

      <div className="public-bakery-grid">
        {initialBakeries.map((bakery) => (
          <Link className="public-bakery-card" href={`/bakeries/${bakery.slug}`} key={bakery.id}>
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
              <span>{bakery.hours}</span>
              {getStartingPrice(bakery.products) ? (
                <span>от {formatPrice(getStartingPrice(bakery.products))}</span>
              ) : null}
            </div>

            <div className="product-preview-list">
              {getProductPreview(bakery.products).map((product) => (
                <span key={product.id}>{product.name}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
