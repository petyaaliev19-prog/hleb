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
        <h2>Свежий хлеб и выпечка рядом с домом, готовые к самовывозу.</h2>
        <p className="hero-text">
          Выбирай пекарню, смотри доступные позиции на нужную дату и оформляй предзаказ
          без регистрации. Оплата будет на месте.
        </p>
        <div className="hero-actions">
          <Link className="primary-btn" href="#bakeries">
            Выбрать пекарню
          </Link>
          <Link className="ghost-btn" href="/owner">
            Кабинет пекарни
          </Link>
        </div>
      </div>
      <div className="hero-stats">
        <article className="metric-card">
          <span>Пекарен доступно</span>
          <strong>{metrics.bakeriesCount}</strong>
        </article>
        <article className="metric-card">
          <span>Предзаказов сегодня</span>
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
