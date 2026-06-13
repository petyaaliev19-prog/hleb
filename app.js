const state = {
  currentScreen: "showcase",
  selectedBakeryId: "bakery-1",
  selectedDate: "2026-06-14",
  selectedSlotId: "",
  cart: {},
  dashboardBakeryId: "bakery-1",
  ordersDate: "2026-06-14",
  orders: [
    {
      id: "ORD-1042",
      bakeryId: "bakery-1",
      bakeryName: "Мука",
      customerName: "Анна Смирнова",
      customerPhone: "+7 900 100-22-11",
      pickupDate: "2026-06-14",
      pickupSlotId: "slot-1",
      pickupSlotLabel: "08:00-10:00",
      status: "confirmed",
      comment: "Два багета отдельно",
      items: [
        { productId: "prod-1", name: "Французский багет", qty: 2, price: 170 },
        { productId: "prod-2", name: "Бородинский", qty: 1, price: 140 },
      ],
    },
    {
      id: "ORD-1043",
      bakeryId: "bakery-2",
      bakeryName: "Хруст",
      customerName: "Илья Корнеев",
      customerPhone: "+7 921 000-77-31",
      pickupDate: "2026-06-14",
      pickupSlotId: "slot-4",
      pickupSlotLabel: "10:00-12:00",
      status: "new",
      comment: "",
      items: [{ productId: "prod-5", name: "Круассан классический", qty: 4, price: 130 }],
    },
    {
      id: "ORD-1044",
      bakeryId: "bakery-1",
      bakeryName: "Мука",
      customerName: "Марина Долгова",
      customerPhone: "+7 911 555-20-20",
      pickupDate: "2026-06-15",
      pickupSlotId: "slot-2",
      pickupSlotLabel: "16:00-18:00",
      status: "ready",
      comment: "Самовывоз после работы",
      items: [
        { productId: "prod-3", name: "Ржаной на закваске", qty: 1, price: 190 },
        { productId: "prod-4", name: "Слойка с корицей", qty: 3, price: 95 },
      ],
    },
  ],
  bakeries: [
    {
      id: "bakery-1",
      name: "Мука",
      district: "Петроградский",
      address: "Каменноостровский пр., 28",
      phone: "+7 812 300-21-20",
      hours: "07:30-20:00",
      lead: "Ремесленная пекарня с ежедневной выпечкой хлеба на закваске и утренними слотами самовывоза.",
      badge: "Утренний самовывоз",
      slots: [
        { id: "slot-1", date: "2026-06-14", label: "08:00-10:00" },
        { id: "slot-2", date: "2026-06-14", label: "16:00-18:00" },
        { id: "slot-3", date: "2026-06-15", label: "08:00-10:00" },
      ],
      products: [
        {
          id: "prod-1",
          name: "Французский багет",
          price: 170,
          description: "Хрустящая корка, мягкий мякиш, удобно брать к завтраку.",
          availability: { "2026-06-14": 18, "2026-06-15": 14 },
        },
        {
          id: "prod-2",
          name: "Бородинский",
          price: 140,
          description: "Плотный ржаной хлеб с кориандром для ежедневного стола.",
          availability: { "2026-06-14": 10, "2026-06-15": 8 },
        },
        {
          id: "prod-3",
          name: "Ржаной на закваске",
          price: 190,
          description: "Длинная ферментация, насыщенный вкус, хорошо держит свежесть.",
          availability: { "2026-06-14": 6, "2026-06-15": 5 },
        },
        {
          id: "prod-4",
          name: "Слойка с корицей",
          price: 95,
          description: "Теплая выпечка для утреннего кофе, небольшие партии.",
          availability: { "2026-06-14": 12, "2026-06-15": 10 },
        },
      ],
    },
    {
      id: "bakery-2",
      name: "Хруст",
      district: "Василеостровский",
      address: "Средний пр., 41",
      phone: "+7 812 555-14-19",
      hours: "08:00-21:00",
      lead: "Городская пекарня с акцентом на круассаны, сэндвичные булки и быстрый дневной самовывоз.",
      badge: "Дневные слоты",
      slots: [
        { id: "slot-4", date: "2026-06-14", label: "10:00-12:00" },
        { id: "slot-5", date: "2026-06-14", label: "18:00-20:00" },
        { id: "slot-6", date: "2026-06-15", label: "10:00-12:00" },
      ],
      products: [
        {
          id: "prod-5",
          name: "Круассан классический",
          price: 130,
          description: "Слоистый, масляный, на утро и под офисный кофе.",
          availability: { "2026-06-14": 24, "2026-06-15": 20 },
        },
        {
          id: "prod-6",
          name: "Булка для бургера",
          price: 80,
          description: "Мягкая молочная булка, популярна у семейных заказов.",
          availability: { "2026-06-14": 16, "2026-06-15": 14 },
        },
        {
          id: "prod-7",
          name: "Чиабатта",
          price: 165,
          description: "Пористая структура, хорошо уходит в обеденные слоты.",
          availability: { "2026-06-14": 11, "2026-06-15": 9 },
        },
      ],
    },
    {
      id: "bakery-3",
      name: "Печь и зерно",
      district: "Центральный",
      address: "ул. Жуковского, 13",
      phone: "+7 812 700-44-10",
      hours: "09:00-19:00",
      lead: "Небольшая районная точка с фермерскими буханками и размеренным вечерним самовывозом.",
      badge: "Вечерний забор",
      slots: [
        { id: "slot-7", date: "2026-06-14", label: "17:00-19:00" },
        { id: "slot-8", date: "2026-06-15", label: "17:00-19:00" },
      ],
      products: [
        {
          id: "prod-8",
          name: "Фермерская буханка",
          price: 210,
          description: "Большая буханка на семью, хорошо продается по предзаказу.",
          availability: { "2026-06-14": 7, "2026-06-15": 7 },
        },
        {
          id: "prod-9",
          name: "Бриошь",
          price: 240,
          description: "Сдобная, мягкая, для завтраков и выходных.",
          availability: { "2026-06-14": 5, "2026-06-15": 4 },
        },
      ],
    },
  ],
};

const elements = {
  bakeryGrid: document.querySelector("#bakery-grid"),
  bakerySearch: document.querySelector("#bakery-search"),
  bakeryHeader: document.querySelector("#bakery-header"),
  pickupDateSelect: document.querySelector("#pickup-date-select"),
  pickupSlotSelect: document.querySelector("#pickup-slot-select"),
  productGrid: document.querySelector("#product-grid"),
  orderSummary: document.querySelector("#order-summary"),
  checkoutForm: document.querySelector("#checkout-form"),
  confirmationCard: document.querySelector("#confirmation-card"),
  customerName: document.querySelector("#customer-name"),
  customerPhone: document.querySelector("#customer-phone"),
  customerComment: document.querySelector("#customer-comment"),
  ordersList: document.querySelector("#orders-list"),
  ordersDateSelect: document.querySelector("#orders-date-select"),
  dashboardBakerySelect: document.querySelector("#dashboard-bakery-select"),
  summaryList: document.querySelector("#summary-list"),
  pickupTimeline: document.querySelector("#pickup-timeline"),
  metricBakeries: document.querySelector("#metric-bakeries"),
  metricOrders: document.querySelector("#metric-orders"),
  metricItems: document.querySelector("#metric-items"),
  showcaseScreen: document.querySelector("#showcase-screen"),
  ordersScreen: document.querySelector("#orders-screen"),
  dashboardScreen: document.querySelector("#dashboard-screen"),
  heroBrowseBtn: document.querySelector("#hero-browse-btn"),
  navLinks: [...document.querySelectorAll(".nav-link")],
  screenSwitchers: [...document.querySelectorAll("[data-screen-target]")],
};

function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

function getSelectedBakery() {
  return state.bakeries.find((bakery) => bakery.id === state.selectedBakeryId) ?? state.bakeries[0];
}

function getDashboardBakery() {
  return state.bakeries.find((bakery) => bakery.id === state.dashboardBakeryId) ?? state.bakeries[0];
}

function getAvailableDates(bakery) {
  return [...new Set(bakery.slots.map((slot) => slot.date))].sort();
}

function getSlotsForSelectedDate(bakery) {
  return bakery.slots.filter((slot) => slot.date === state.selectedDate);
}

function getCartItems() {
  const bakery = getSelectedBakery();
  return Object.entries(state.cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const product = bakery.products.find((item) => item.id === productId);
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);
}

function getOrdersForDate(date) {
  return state.orders.filter((order) => order.pickupDate === date);
}

function getOrdersForBakeryAndDate(bakeryId, date) {
  return state.orders.filter((order) => order.bakeryId === bakeryId && order.pickupDate === date);
}

function updateMetrics() {
  const tomorrowOrders = getOrdersForDate(state.ordersDate);
  const totalItems = tomorrowOrders.reduce(
    (sum, order) => sum + order.items.reduce((acc, item) => acc + item.qty, 0),
    0,
  );

  elements.metricBakeries.textContent = String(state.bakeries.length);
  elements.metricOrders.textContent = String(tomorrowOrders.length);
  elements.metricItems.textContent = String(totalItems);
}

function renderBakeryGrid() {
  const query = elements.bakerySearch.value.trim().toLowerCase();
  const items = state.bakeries.filter((bakery) => {
    const haystack = `${bakery.name} ${bakery.address} ${bakery.district}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!items.length) {
    elements.bakeryGrid.innerHTML = '<div class="empty-state">Пекарни не найдены. Попробуй изменить запрос.</div>';
    return;
  }

  elements.bakeryGrid.innerHTML = items
    .map(
      (bakery) => `
        <article class="bakery-card">
          <div>
            <div class="bakery-meta">
              <span class="bakery-badge">${bakery.badge}</span>
              <span>${bakery.district}</span>
            </div>
            <h4>${bakery.name}</h4>
            <p class="storefront-lead">${bakery.lead}</p>
          </div>
          <div class="bakery-meta">
            <span>${bakery.address}</span>
            <span>${bakery.hours}</span>
          </div>
          <button type="button" data-bakery-id="${bakery.id}">Открыть витрину</button>
        </article>
      `,
    )
    .join("");
}

function renderBakeryHeader() {
  const bakery = getSelectedBakery();
  elements.bakeryHeader.innerHTML = `
    <div>
      <p class="eyebrow">Витрина пекарни</p>
      <h3>${bakery.name}</h3>
      <p class="storefront-lead">${bakery.lead}</p>
      <div class="bakery-meta">
        <span>${bakery.address}</span>
        <span>${bakery.hours}</span>
        <span>${bakery.phone}</span>
      </div>
    </div>
    <span class="bakery-badge">${bakery.badge}</span>
  `;
}

function renderDateSelect() {
  const bakery = getSelectedBakery();
  const dates = getAvailableDates(bakery);

  if (!dates.includes(state.selectedDate)) {
    state.selectedDate = dates[0];
  }

  elements.pickupDateSelect.innerHTML = dates
    .map((date) => `<option value="${date}">${formatDate(date)}</option>`)
    .join("");
  elements.pickupDateSelect.value = state.selectedDate;

  elements.ordersDateSelect.innerHTML = dates
    .map((date) => `<option value="${date}">${formatDate(date)}</option>`)
    .join("");

  if (!dates.includes(state.ordersDate)) {
    state.ordersDate = dates[0];
  }

  elements.ordersDateSelect.value = state.ordersDate;
}

function renderSlotSelect() {
  const bakery = getSelectedBakery();
  const slots = getSlotsForSelectedDate(bakery);
  const fallbackSlot = slots[0]?.id ?? "";

  if (!slots.some((slot) => slot.id === state.selectedSlotId)) {
    state.selectedSlotId = fallbackSlot;
  }

  elements.pickupSlotSelect.innerHTML = slots
    .map((slot) => `<option value="${slot.id}">${slot.label}</option>`)
    .join("");
  elements.pickupSlotSelect.value = state.selectedSlotId;
}

function renderProducts() {
  const bakery = getSelectedBakery();
  elements.productGrid.innerHTML = bakery.products
    .map((product) => {
      const availableQty = product.availability[state.selectedDate] ?? 0;
      const cartQty = state.cart[product.id] ?? 0;

      return `
        <article class="product-card">
          <div class="product-topline">
            <div>
              <div class="product-meta">
                <span class="availability-badge">Доступно ${availableQty} шт.</span>
              </div>
              <h4>${product.name}</h4>
            </div>
            <span class="price">${formatPrice(product.price)}</span>
          </div>
          <p class="storefront-lead">${product.description}</p>
          <div class="qty-row">
            <div class="qty-stepper">
              <button type="button" data-product-action="decrease" data-product-id="${product.id}">-</button>
              <span>${cartQty}</span>
              <button type="button" data-product-action="increase" data-product-id="${product.id}">+</button>
            </div>
            <button type="button" data-product-action="add-one" data-product-id="${product.id}">
              Добавить
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderOrderSummary() {
  const cartItems = getCartItems();

  if (!cartItems.length) {
    elements.orderSummary.innerHTML = '<div class="empty-state">Корзина пока пустая. Выбери позиции из витрины.</div>';
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const slot = getSelectedBakery().slots.find((item) => item.id === state.selectedSlotId);

  elements.orderSummary.innerHTML = `
    ${cartItems
      .map(
        (item) => `
          <article class="order-item">
            <strong>${item.name}</strong>
            <div class="order-meta">
              <span>${item.qty} шт.</span>
              <span>${formatPrice(item.price * item.qty)}</span>
            </div>
          </article>
        `,
      )
      .join("")}
    <article class="order-item">
      <strong>Самовывоз</strong>
      <div class="order-meta">
        <span>${formatDate(state.selectedDate)}</span>
        <span>${slot?.label ?? "Слот не выбран"}</span>
      </div>
    </article>
    <article class="order-item">
      <strong>Итого</strong>
      <div class="order-meta">
        <span>${cartItems.reduce((sum, item) => sum + item.qty, 0)} позиций</span>
        <span>${formatPrice(total)}</span>
      </div>
    </article>
  `;
}

function renderOrdersList() {
  const orders = getOrdersForDate(state.ordersDate);

  if (!orders.length) {
    elements.ordersList.innerHTML = '<div class="empty-state">На выбранную дату заказов пока нет.</div>';
    return;
  }

  elements.ordersList.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card">
          <div class="order-card-header">
            <div>
              <div class="order-meta">
                <span>${order.id}</span>
                <span>${order.bakeryName}</span>
                <span>${order.pickupSlotLabel}</span>
              </div>
              <h4>${order.customerName}</h4>
              <div class="order-meta">
                <span>${order.customerPhone}</span>
                <span>${order.comment || "Без комментария"}</span>
              </div>
            </div>
            <span class="status-chip ${order.status}">${getStatusLabel(order.status)}</span>
          </div>
          <div class="order-meta">
            ${order.items.map((item) => `<span>${item.name} x ${item.qty}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderDashboardBakerySelect() {
  elements.dashboardBakerySelect.innerHTML = state.bakeries
    .map((bakery) => `<option value="${bakery.id}">${bakery.name}</option>`)
    .join("");
  elements.dashboardBakerySelect.value = state.dashboardBakeryId;
}

function renderDashboard() {
  const bakery = getDashboardBakery();
  const orders = getOrdersForBakeryAndDate(bakery.id, state.ordersDate);

  if (!orders.length) {
    elements.summaryList.innerHTML = '<div class="empty-state">На эту дату у пекарни пока нет заказов.</div>';
    elements.pickupTimeline.innerHTML = '<div class="empty-state">Слоты будут заполнены, как только появятся заказы.</div>';
    return;
  }

  const summary = new Map();
  for (const order of orders) {
    for (const item of order.items) {
      summary.set(item.name, (summary.get(item.name) ?? 0) + item.qty);
    }
  }

  elements.summaryList.innerHTML = [...summary.entries()]
    .map(
      ([name, qty]) => `
        <article class="summary-item">
          <span>${name}</span>
          <strong>${qty}</strong>
        </article>
      `,
    )
    .join("");

  const ordersBySlot = orders.reduce((acc, order) => {
    acc[order.pickupSlotLabel] = acc[order.pickupSlotLabel] ?? [];
    acc[order.pickupSlotLabel].push(order);
    return acc;
  }, {});

  elements.pickupTimeline.innerHTML = Object.entries(ordersBySlot)
    .map(
      ([slotLabel, slotOrders]) => `
        <article class="timeline-slot">
          <h5>${slotLabel}</h5>
          <ul>
            ${slotOrders
              .map(
                (order) =>
                  `<li>${order.customerName}: ${order.items
                    .map((item) => `${item.name} x ${item.qty}`)
                    .join(", ")}</li>`,
              )
              .join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function getStatusLabel(status) {
  const labels = {
    new: "Новый",
    confirmed: "Подтвержден",
    ready: "Готов",
    completed: "Выдан",
    not_picked_up: "Не забран",
    cancelled: "Отменен",
  };
  return labels[status] ?? status;
}

function switchScreen(target) {
  state.currentScreen = target;
  const showcaseVisible = target === "showcase";
  const ordersVisible = target === "orders";
  const dashboardVisible = target === "dashboard";

  elements.showcaseScreen.parentElement.classList.toggle("hidden", !showcaseVisible);
  elements.ordersScreen.classList.toggle("hidden", !ordersVisible);
  elements.dashboardScreen.classList.toggle("hidden", !dashboardVisible);

  for (const link of elements.navLinks) {
    link.classList.toggle("is-active", link.dataset.screenTarget === target);
  }
}

function setCartQty(productId, nextQty) {
  const bakery = getSelectedBakery();
  const product = bakery.products.find((item) => item.id === productId);
  if (!product) {
    return;
  }

  const max = product.availability[state.selectedDate] ?? 0;
  const normalized = Math.max(0, Math.min(nextQty, max));

  if (normalized === 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = normalized;
  }

  renderProducts();
  renderOrderSummary();
}

function resetCartForBakeryChange() {
  state.cart = {};
  elements.confirmationCard.classList.add("hidden");
  elements.checkoutForm.reset();
}

function createOrderFromForm() {
  const customerName = elements.customerName.value.trim();
  const customerPhone = elements.customerPhone.value.trim();
  const customerComment = elements.customerComment.value.trim();
  const cartItems = getCartItems();
  const bakery = getSelectedBakery();
  const slot = bakery.slots.find((item) => item.id === state.selectedSlotId);

  if (!customerName || !customerPhone || !cartItems.length || !slot) {
    return null;
  }

  return {
    id: `ORD-${1045 + state.orders.length}`,
    bakeryId: bakery.id,
    bakeryName: bakery.name,
    customerName,
    customerPhone,
    pickupDate: state.selectedDate,
    pickupSlotId: slot.id,
    pickupSlotLabel: slot.label,
    status: "new",
    comment: customerComment,
    items: cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
  };
}

function applyOrderToAvailability(order) {
  const bakery = state.bakeries.find((item) => item.id === order.bakeryId);
  if (!bakery) {
    return;
  }

  for (const orderItem of order.items) {
    const product = bakery.products.find((item) => item.id === orderItem.productId);
    if (!product) {
      continue;
    }
    const currentAvailability = product.availability[order.pickupDate] ?? 0;
    product.availability[order.pickupDate] = Math.max(0, currentAvailability - orderItem.qty);
  }
}

function renderConfirmation(order) {
  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  elements.confirmationCard.innerHTML = `
    <p class="eyebrow">Заказ создан</p>
    <h3>${order.id}</h3>
    <p class="storefront-lead">
      ${order.customerName}, забери заказ ${formatDate(order.pickupDate)} в слот ${order.pickupSlotLabel}.
      Оплата будет на месте.
    </p>
    <div class="order-meta">
      <span>${order.items.reduce((sum, item) => sum + item.qty, 0)} позиций</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;
  elements.confirmationCard.classList.remove("hidden");
}

function bindEvents() {
  elements.bakerySearch.addEventListener("input", renderBakeryGrid);

  elements.bakeryGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-bakery-id]");
    if (!button) {
      return;
    }
    state.selectedBakeryId = button.dataset.bakeryId;
    state.dashboardBakeryId = button.dataset.bakeryId;
    resetCartForBakeryChange();
    renderAll();
  });

  elements.pickupDateSelect.addEventListener("change", (event) => {
    state.selectedDate = event.target.value;
    state.selectedSlotId = "";
    state.cart = {};
    renderAll();
  });

  elements.pickupSlotSelect.addEventListener("change", (event) => {
    state.selectedSlotId = event.target.value;
    renderOrderSummary();
  });

  elements.productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-action]");
    if (!button) {
      return;
    }

    const productId = button.dataset.productId;
    const currentQty = state.cart[productId] ?? 0;

    if (button.dataset.productAction === "increase" || button.dataset.productAction === "add-one") {
      setCartQty(productId, currentQty + 1);
    }

    if (button.dataset.productAction === "decrease") {
      setCartQty(productId, currentQty - 1);
    }
  });

  elements.checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const order = createOrderFromForm();

    if (!order) {
      elements.confirmationCard.innerHTML =
        '<p class="storefront-lead">Чтобы оформить предзаказ, выбери позиции, укажи имя и телефон.</p>';
      elements.confirmationCard.classList.remove("hidden");
      return;
    }

    state.orders.unshift(order);
    applyOrderToAvailability(order);
    renderConfirmation(order);
    state.cart = {};
    renderAll();
  });

  elements.ordersDateSelect.addEventListener("change", (event) => {
    state.ordersDate = event.target.value;
    updateMetrics();
    renderOrdersList();
    renderDashboard();
  });

  elements.dashboardBakerySelect.addEventListener("change", (event) => {
    state.dashboardBakeryId = event.target.value;
    renderDashboard();
  });

  for (const link of elements.screenSwitchers) {
    link.addEventListener("click", () => switchScreen(link.dataset.screenTarget));
  }

  elements.heroBrowseBtn.addEventListener("click", () => {
    switchScreen("showcase");
    document.querySelector(".content-grid").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderAll() {
  renderBakeryGrid();
  renderBakeryHeader();
  renderDateSelect();
  renderSlotSelect();
  renderProducts();
  renderOrderSummary();
  renderOrdersList();
  renderDashboardBakerySelect();
  renderDashboard();
  updateMetrics();
}

bindEvents();
renderAll();
switchScreen("showcase");
