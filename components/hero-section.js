"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchMetrics } from "@/lib/api";

export function HeroSection({ initialMetrics }) {
  const [metrics, setMetrics] = useState(initialMetrics);

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      const data = await fetchMetrics();
      if (active) {
        setMetrics(data.metrics);
      }
    }

    loadMetrics().catch(() => {});

    function handleRefresh() {
      loadMetrics().catch(() => {});
    }

    window.addEventListener("orders:changed", handleRefresh);
    return () => {
      active = false;
      window.removeEventListener("orders:changed", handleRefresh);
    };
  }, []);

  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Свежий хлеб под самовывоз</p>
        <h2>Покупатель бронирует хлеб заранее, а пекарня видит точный план на день.</h2>
        <p className="hero-text">
          В текущей версии нет доставки и онлайн-оплаты. Есть понятный каталог, оформление
          предзаказа и операционная панель для пекарни.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" href="/bakeries/muka">
            Открыть витрину
          </Link>
          <Link className="ghost-btn" href="/dashboard">
            Открыть панель пекарни
          </Link>
        </div>
      </div>
      <div className="hero-stats">
        <article className="metric-card">
          <span>Пекарен в пилоте</span>
          <strong>{metrics.bakeriesCount}</strong>
        </article>
        <article className="metric-card">
          <span>Заказов на завтра</span>
          <strong>{metrics.ordersCount}</strong>
        </article>
        <article className="metric-card">
          <span>Позиций в бронях</span>
          <strong>{metrics.itemsCount}</strong>
        </article>
      </div>
    </section>
  );
}
