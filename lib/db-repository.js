import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { canTransitionOrderStatus, isKnownOrderStatus } from "./order-status.js";
import { seedBakeries, seedOrders } from "../data/seed-data.js";

const DEFAULT_DB_PATH = path.join(process.cwd(), "work", "hlebushek.db");

function ensureDirectory(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

function mapBakeryRows(bakeryRows, slotRows, productRows, availabilityRows) {
  return bakeryRows.map((bakery) => {
    const slots = slotRows
      .filter((slot) => slot.bakery_id === bakery.id)
      .map((slot) => ({ id: slot.id, date: slot.date, label: slot.label }))
      .sort((a, b) => `${a.date}${a.label}`.localeCompare(`${b.date}${b.label}`));

    const products = productRows
      .filter((product) => product.bakery_id === bakery.id)
      .map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        availability: Object.fromEntries(
          availabilityRows
            .filter((entry) => entry.product_id === product.id)
            .map((entry) => [entry.date, entry.quantity])
            .sort(([left], [right]) => left.localeCompare(right)),
        ),
      }));

    return {
      id: bakery.id,
      slug: bakery.slug,
      name: bakery.name,
      district: bakery.district,
      address: bakery.address,
      phone: bakery.phone,
      hours: bakery.hours,
      lead: bakery.lead,
      badge: bakery.badge,
      slots,
      products,
    };
  });
}

function mapOrderRows(orderRows, orderItemRows) {
  return orderRows.map((order) => ({
    id: order.id,
    bakeryId: order.bakery_id,
    bakeryName: order.bakery_name,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    pickupDate: order.pickup_date,
    pickupSlotId: order.pickup_slot_id,
    pickupSlotLabel: order.pickup_slot_label,
    status: order.status,
    comment: order.comment,
    items: orderItemRows
      .filter((item) => item.order_id === order.id)
      .map((item) => ({
        productId: item.product_id,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
  }));
}

function makeAvailabilityId(productId, date) {
  return `${productId}:${date}`;
}

function makeOrderItemId(orderId, productId) {
  return `${orderId}:${productId}`;
}

function initializeSchema(db) {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS bakeries (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      hours TEXT NOT NULL,
      lead TEXT NOT NULL,
      badge TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pickup_slots (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      label TEXT NOT NULL,
      bakery_id TEXT NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      bakery_id TEXT NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_availability (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      UNIQUE(product_id, date)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      bakery_id TEXT NOT NULL REFERENCES bakeries(id) ON DELETE CASCADE,
      bakery_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      pickup_date TEXT NOT NULL,
      pickup_slot_id TEXT NOT NULL REFERENCES pickup_slots(id),
      pickup_slot_label TEXT NOT NULL,
      status TEXT NOT NULL,
      comment TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id),
      name TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price INTEGER NOT NULL
    );
  `);
}

function seedIfEmpty(db) {
  const count = db.prepare("SELECT COUNT(*) AS count FROM bakeries").get().count;
  if (count > 0) {
    return;
  }

  const insertBakery = db.prepare(`
    INSERT INTO bakeries (id, slug, name, district, address, phone, hours, lead, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSlot = db.prepare(`
    INSERT INTO pickup_slots (id, date, label, bakery_id)
    VALUES (?, ?, ?, ?)
  `);
  const insertProduct = db.prepare(`
    INSERT INTO products (id, bakery_id, name, price, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertAvailability = db.prepare(`
    INSERT INTO product_availability (id, product_id, date, quantity)
    VALUES (?, ?, ?, ?)
  `);
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, bakery_id, bakery_name, customer_name, customer_phone, pickup_date,
      pickup_slot_id, pickup_slot_label, status, comment
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (id, order_id, product_id, name, qty, price)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const bakery of seedBakeries) {
      insertBakery.run(
        bakery.id,
        bakery.slug,
        bakery.name,
        bakery.district,
        bakery.address,
        bakery.phone,
        bakery.hours,
        bakery.lead,
        bakery.badge,
      );

      for (const slot of bakery.slots) {
        insertSlot.run(slot.id, slot.date, slot.label, bakery.id);
      }

      for (const product of bakery.products) {
        insertProduct.run(product.id, bakery.id, product.name, product.price, product.description);

        for (const [date, quantity] of Object.entries(product.availability)) {
          insertAvailability.run(makeAvailabilityId(product.id, date), product.id, date, quantity);
        }
      }
    }

    for (const order of seedOrders) {
      insertOrder.run(
        order.id,
        order.bakeryId,
        order.bakeryName,
        order.customerName,
        order.customerPhone,
        order.pickupDate,
        order.pickupSlotId,
        order.pickupSlotLabel,
        order.status,
        order.comment,
      );

      for (const item of order.items) {
        insertOrderItem.run(
          makeOrderItemId(order.id, item.productId),
          order.id,
          item.productId,
          item.name,
          item.qty,
          item.price,
        );
      }
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function createDbRepository(dbPath = DEFAULT_DB_PATH) {
  ensureDirectory(dbPath);
  const db = new DatabaseSync(dbPath);
  initializeSchema(db);
  seedIfEmpty(db);

  function getBakeries() {
    const bakeryRows = db.prepare("SELECT * FROM bakeries ORDER BY name ASC").all();
    const slotRows = db.prepare("SELECT * FROM pickup_slots").all();
    const productRows = db.prepare("SELECT * FROM products").all();
    const availabilityRows = db.prepare("SELECT * FROM product_availability").all();
    return mapBakeryRows(bakeryRows, slotRows, productRows, availabilityRows);
  }

  function getBakeryBySlug(slug) {
    return getBakeries().find((bakery) => bakery.slug === slug) ?? null;
  }

  function getOrders({ date, bakeryId } = {}) {
    const where = [];
    const values = [];

    if (date) {
      where.push("pickup_date = ?");
      values.push(date);
    }
    if (bakeryId) {
      where.push("bakery_id = ?");
      values.push(bakeryId);
    }

    const query = `
      SELECT * FROM orders
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY pickup_date ASC, id ASC
    `;
    const orderRows = db.prepare(query).all(...values);
    const orderItemRows = db.prepare("SELECT * FROM order_items").all();
    return mapOrderRows(orderRows, orderItemRows);
  }

  function getOrderById(orderId) {
    return getOrders().find((order) => order.id === orderId) ?? null;
  }

  function getAvailableDates() {
    const slotDates = db.prepare("SELECT date FROM pickup_slots").all().map((row) => row.date);
    const orderDates = db.prepare("SELECT pickup_date FROM orders").all().map((row) => row.pickup_date);
    return [...new Set([...slotDates, ...orderDates])].sort();
  }

  function getOverviewMetrics() {
    const primaryDate = getAvailableDates()[0];
    const orders = getOrders({ date: primaryDate });
    return {
      primaryDate,
      bakeriesCount: db.prepare("SELECT COUNT(*) AS count FROM bakeries").get().count,
      ordersCount: orders.length,
      itemsCount: orders.reduce(
        (sum, order) => sum + order.items.reduce((inner, item) => inner + item.qty, 0),
        0,
      ),
    };
  }

  function createOrder(payload) {
    const {
      bakeryId,
      pickupDate,
      pickupSlotId,
      customerName,
      customerPhone,
      comment = "",
      items = [],
    } = payload;

    if (!customerName?.trim()) {
      throw new Error("Customer name is required");
    }
    if (!customerPhone?.trim()) {
      throw new Error("Customer phone is required");
    }
    if (!items.length) {
      throw new Error("Order items are required");
    }

    const bakery = db.prepare("SELECT * FROM bakeries WHERE id = ?").get(bakeryId);
    if (!bakery) {
      throw new Error("Bakery not found");
    }

    const slot = db
      .prepare("SELECT * FROM pickup_slots WHERE id = ? AND bakery_id = ? AND date = ?")
      .get(pickupSlotId, bakeryId, pickupDate);
    if (!slot) {
      throw new Error("Pickup slot is invalid");
    }

    const validatedItems = items.map((item) => {
      if (!item.productId) {
        throw new Error("Product id is required");
      }
      if (!Number.isInteger(item.qty) || item.qty <= 0) {
        throw new Error("Quantity must be a positive integer");
      }

      const product = db
        .prepare("SELECT * FROM products WHERE id = ? AND bakery_id = ?")
        .get(item.productId, bakeryId);
      if (!product) {
        throw new Error("Product not found in bakery");
      }

      const availability = db
        .prepare("SELECT * FROM product_availability WHERE product_id = ? AND date = ?")
        .get(item.productId, pickupDate);
      const available = availability?.quantity ?? 0;
      if (item.qty > available) {
        throw new Error("Requested quantity exceeds availability");
      }

      return { product, availability, qty: item.qty };
    });

    const lastOrder = db.prepare("SELECT id FROM orders ORDER BY id DESC LIMIT 1").get();
    const nextNumeric = lastOrder ? Number.parseInt(lastOrder.id.replace(/\D/g, ""), 10) + 1 : 1045;
    const nextOrderId = `ORD-${nextNumeric}`;

    db.exec("BEGIN");
    try {
      for (const item of validatedItems) {
        db.prepare("UPDATE product_availability SET quantity = ? WHERE product_id = ? AND date = ?").run(
          item.availability.quantity - item.qty,
          item.product.id,
          pickupDate,
        );
      }

      db.prepare(`
        INSERT INTO orders (
          id, bakery_id, bakery_name, customer_name, customer_phone, pickup_date,
          pickup_slot_id, pickup_slot_label, status, comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        nextOrderId,
        bakery.id,
        bakery.name,
        customerName.trim(),
        customerPhone.trim(),
        pickupDate,
        slot.id,
        slot.label,
        "new",
        comment.trim(),
      );

      for (const item of validatedItems) {
        db.prepare(`
          INSERT INTO order_items (id, order_id, product_id, name, qty, price)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          makeOrderItemId(nextOrderId, item.product.id),
          nextOrderId,
          item.product.id,
          item.product.name,
          item.qty,
          item.product.price,
        );
      }
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }

    return {
      order: getOrderById(nextOrderId),
      bakery: getBakeries().find((item) => item.id === bakery.id),
      metrics: getOverviewMetrics(),
    };
  }

  function updateOrderStatus(orderId, nextStatus) {
    if (!orderId?.trim()) {
      throw new Error("Order id is required");
    }
    if (!isKnownOrderStatus(nextStatus)) {
      throw new Error("Order status is invalid");
    }

    const currentOrder = getOrderById(orderId);
    if (!currentOrder) {
      throw new Error("Order not found");
    }
    if (!canTransitionOrderStatus(currentOrder.status, nextStatus)) {
      throw new Error("Order status transition is invalid");
    }

    if (currentOrder.status !== nextStatus) {
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(nextStatus, orderId);
    }

    return {
      order: getOrderById(orderId),
      metrics: getOverviewMetrics(),
    };
  }

  return {
    getBakeries,
    getBakeryBySlug,
    getOrders,
    getOrderById,
    getAvailableDates,
    getOverviewMetrics,
    createOrder,
    updateOrderStatus,
  };
}

export const dbRepository = createDbRepository();
