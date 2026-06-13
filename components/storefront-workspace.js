"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBakeryDates, getBakeries } from "@/data/mock-data";
import { createOrder, fetchBakeries } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { buildCartItems, calculateCartTotals, normalizeCartQty } from "@/lib/order-utils";

export function StorefrontWorkspace() {
  const initialBakeries = getBakeries();
  const [bakeries, setBakeries] = useState(initialBakeries);
  const [query, setQuery] = useState("");
  const [selectedBakeryId, setSelectedBakeryId] = useState(initialBakeries[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(getBakeryDates(initialBakeries[0])[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(initialBakeries[0]?.slots[0]?.id ?? "");
  const [cart, setCart] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const selectedBakery = bakeries.find((bakery) => bakery.id === selectedBakeryId) ?? bakeries[0];
  const dates = useMemo(() => getBakeryDates(selectedBakery), [selectedBakery]);
  const slots = useMemo(
    () => selectedBakery.slots.filter((slot) => slot.date === selectedDate),
    [selectedBakery, selectedDate],
  );

  const filteredBakeries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return bakeries;
    }

    return bakeries.filter((bakery) =>
      `${bakery.name} ${bakery.address} ${bakery.district}`.toLowerCase().includes(normalized),
    );
  }, [bakeries, query]);

  const cartItems = buildCartItems(selectedBakery.products, cart);
  const { totalPrice: total, totalItems } = calculateCartTotals(cartItems);

  useEffect(() => {
    let active = true;

    async function loadBakeries() {
      const data = await fetchBakeries();
      if (!active || !data.bakeries.length) {
        return;
      }

      setBakeries(data.bakeries);
      setSelectedBakeryId((current) =>
        data.bakeries.some((bakery) => bakery.id === current) ? current : data.bakeries[0].id,
      );
    }

    loadBakeries().catch(() => {});

    function handleRefresh() {
      loadBakeries().catch(() => {});
    }

    window.addEventListener("orders:changed", handleRefresh);
    return () => {
      active = false;
      window.removeEventListener("orders:changed", handleRefresh);
    };
  }, []);

  function handleBakerySelect(bakeryId) {
    const bakery = bakeries.find((item) => item.id === bakeryId);
    const nextDates = getBakeryDates(bakery);
    setSelectedBakeryId(bakeryId);
    setSelectedDate(nextDates[0]);
    setSelectedSlotId(bakery?.slots.find((slot) => slot.date === nextDates[0])?.id ?? "");
    setCart({});
    setConfirmation(null);
  }

  function handleDateChange(nextDate) {
    setSelectedDate(nextDate);
    setSelectedSlotId(selectedBakery.slots.find((slot) => slot.date === nextDate)?.id ?? "");
    setCart({});
    setConfirmation(null);
  }

  function updateQty(productId, nextQty, maxQty) {
    const normalized = normalizeCartQty(nextQty, maxQty);
    setCart((current) => {
      const draft = { ...current };
      if (normalized === 0) {
        delete draft[productId];
      } else {
        draft[productId] = normalized;
      }
      return draft;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();
    const slot = slots.find((item) => item.id === selectedSlotId);

    if (!name || !phone || !slot || !cartItems.length) {
      setConfirmation({
        tone: "error",
        title: "Нужно заполнить заказ",
        body: "Выбери позиции, укажи имя и телефон, а затем оформи предзаказ.",
      });
      return;
    }

    try {
      const result = await createOrder({
        bakeryId: selectedBakery.id,
        pickupDate: selectedDate,
        pickupSlotId: slot.id,
        customerName: name,
        customerPhone: phone,
        comment,
        items: cartItems.map((item) => ({ productId: item.id, qty: item.qty })),
      });

      setBakeries((current) =>
        current.map((bakery) => (bakery.id === result.bakery.id ? result.bakery : bakery)),
      );
      setConfirmation({
        tone: "success",
        title: "Предзаказ создан",
        body: `${name}, забери заказ ${formatDate(selectedDate)} в слот ${slot.label}. Оплата будет на месте.`,
        total,
        totalItems,
      });
      setCart({});
      event.currentTarget.reset();
      window.dispatchEvent(new CustomEvent("orders:changed"));
    } catch (error) {
      setConfirmation({
        tone: "error",
        title: "Не удалось создать заказ",
        body: error instanceof Error ? error.message : "Попробуй еще раз.",
      });
    }
  }

  return (
    <section className="content-grid">
      <div className="catalog-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Каталог пекарен</p>
            <h3>Где забрать хлеб</h3>
          </div>
          <label className="field">
            <span>Поиск</span>
            <input
              type="search"
              placeholder="Название или район"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="bakery-grid">
          {filteredBakeries.map((bakery) => (
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
                <span>{bakery.hours}</span>
              </div>
              <div className="hero-actions">
                <button className="inline-btn" onClick={() => handleBakerySelect(bakery.id)} type="button">
                  Выбрать
                </button>
                <Link className="secondary-link" href={`/bakeries/${bakery.slug}`}>
                  Отдельная страница
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="storefront-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Витрина пекарни</p>
            <h3>{selectedBakery.name}</h3>
            <p className="storefront-lead">{selectedBakery.lead}</p>
            <div className="bakery-meta">
              <span>{selectedBakery.address}</span>
              <span>{selectedBakery.hours}</span>
              <span>{selectedBakery.phone}</span>
            </div>
          </div>
          <span className="bakery-badge">{selectedBakery.badge}</span>
        </div>

        <div className="selectors">
          <label className="field">
            <span>Дата самовывоза</span>
            <select value={selectedDate} onChange={(event) => handleDateChange(event.target.value)}>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Слот выдачи</span>
            <select value={selectedSlotId} onChange={(event) => setSelectedSlotId(event.target.value)}>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="product-grid">
          {selectedBakery.products.map((product) => {
            const availableQty = product.availability[selectedDate] ?? 0;
            const qty = cart[product.id] ?? 0;

            return (
              <article className="product-card" key={product.id}>
                <div className="product-topline">
                  <div>
                    <div className="product-meta">
                      <span className="availability-badge">Доступно {availableQty} шт.</span>
                    </div>
                    <h4>{product.name}</h4>
                  </div>
                  <span className="price">{formatPrice(product.price)}</span>
                </div>
                <p className="storefront-lead">{product.description}</p>
                <div className="qty-row">
                  <div className="qty-stepper">
                    <button type="button" onClick={() => updateQty(product.id, qty - 1, availableQty)}>
                      -
                    </button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => updateQty(product.id, qty + 1, availableQty)}>
                      +
                    </button>
                  </div>
                  <button
                    className="inline-btn"
                    type="button"
                    onClick={() => updateQty(product.id, qty + 1, availableQty)}
                  >
                    Добавить
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="order-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Предзаказ</p>
            <h3>Твоя корзина</h3>
          </div>
        </div>

        <div className="order-summary">
          {cartItems.length ? (
            <>
              {cartItems.map((item) => (
                <article className="order-item" key={item.id}>
                  <strong>{item.name}</strong>
                  <div className="order-meta">
                    <span>{item.qty} шт.</span>
                    <span>{formatPrice(item.qty * item.price)}</span>
                  </div>
                </article>
              ))}
              <article className="order-item">
                <strong>Итого</strong>
                <div className="order-meta">
                  <span>{totalItems} позиций</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </article>
            </>
          ) : (
            <div className="empty-state">Корзина пока пустая. Выбери позиции из витрины.</div>
          )}
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Имя</span>
            <input name="name" placeholder="Например, Анна" />
          </label>
          <label className="field">
            <span>Телефон</span>
            <input name="phone" placeholder="+7 900 123-45-67" />
          </label>
          <label className="field">
            <span>Комментарий</span>
            <textarea name="comment" rows={3} placeholder="Например, нарезать хлеб" />
          </label>
          <button className="primary-btn" type="submit">
            Оформить предзаказ
          </button>
        </form>

        {confirmation ? (
          <div className="confirmation-card">
            <p className="eyebrow">{confirmation.tone === "success" ? "Заказ создан" : "Нужно действие"}</p>
            <h3>{confirmation.title}</h3>
            <p className="storefront-lead">{confirmation.body}</p>
            {confirmation.total ? (
              <div className="order-meta">
                <span>{confirmation.totalItems} позиций</span>
                <span>{formatPrice(confirmation.total)}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </aside>
    </section>
  );
}
