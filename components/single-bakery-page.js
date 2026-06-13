"use client";

import { useEffect, useMemo, useState } from "react";
import { createOrder, fetchBakeryBySlug } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { getBakeryDates } from "@/data/mock-data";
import { buildCartItems, calculateCartTotals, normalizeCartQty } from "@/lib/order-utils";

export function SingleBakeryPage({ slug, initialBakery }) {
  const [bakery, setBakery] = useState(initialBakery);
  const [cart, setCart] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const dates = useMemo(() => getBakeryDates(bakery), [bakery]);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(
    bakery.slots.find((slot) => slot.date === dates[0])?.id ?? "",
  );

  const slots = bakery.slots.filter((slot) => slot.date === selectedDate);
  const cartItems = buildCartItems(bakery.products, cart);
  const { totalPrice: total, totalItems } = calculateCartTotals(cartItems);

  useEffect(() => {
    let active = true;

    async function loadBakery() {
      const data = await fetchBakeryBySlug(slug);
      if (active) {
        setBakery(data.bakery);
      }
    }

    loadBakery().catch(() => {});

    function handleRefresh() {
      loadBakery().catch(() => {});
    }

    window.addEventListener("orders:changed", handleRefresh);
    return () => {
      active = false;
      window.removeEventListener("orders:changed", handleRefresh);
    };
  }, [slug]);

  function handleDateChange(nextDate) {
    setSelectedDate(nextDate);
    setSelectedSlotId(bakery.slots.find((slot) => slot.date === nextDate)?.id ?? "");
    setCart({});
  }

  function updateQty(productId, nextQty, maxQty) {
    const normalized = normalizeCartQty(nextQty, maxQty);
    setCart((current) => {
      const draft = { ...current };
      if (!normalized) {
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
        bakeryId: bakery.id,
        pickupDate: selectedDate,
        pickupSlotId: slot.id,
        customerName: name,
        customerPhone: phone,
        comment,
        items: cartItems.map((item) => ({ productId: item.id, qty: item.qty })),
      });

      setBakery(result.bakery);
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
    <section className="single-bakery-stack">
      <article className="single-bakery">
        <p className="eyebrow">Страница пекарни</p>
        <h2 className="section-title">{bakery.name}</h2>
        <p className="section-lead">{bakery.lead}</p>
        <div className="single-bakery-meta">
          <span>{bakery.address}</span>
          <span>{bakery.hours}</span>
          <span>{bakery.phone}</span>
          <span className="bakery-badge">{bakery.badge}</span>
        </div>
      </article>

      <div className="single-bakery-grid">
        <article className="storefront-panel">
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
            {bakery.products.map((product) => {
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
        </article>

        <aside className="order-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Предзаказ</p>
              <h3>Сводка заказа</h3>
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
                    <span>{cartItems.reduce((sum, item) => sum + item.qty, 0)} позиций</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </article>
              </>
            ) : (
              <div className="empty-state">Выбери позиции, чтобы увидеть итог заказа.</div>
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
          ) : (
            <div className="confirmation-card">
              <p className="eyebrow">Как работает заказ</p>
              <p className="storefront-lead">
                Эта страница уже работает через тот же mock API слой, что и главная витрина.
                Заказы создаются с оплатой на месте и сразу отражаются в панели пекарни.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
