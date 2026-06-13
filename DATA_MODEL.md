# Data Model

Status: active
Last updated: 2026-06-14
Owner: project
Purpose: define current entities, relationships, and business invariants.

## Entities

### Bakery

Fields:

1. `id`
2. `slug`
3. `name`
4. `district`
5. `address`
6. `phone`
7. `hours`
8. `lead`
9. `badge`

A bakery owns products and pickup slots.

### Pickup Slot

Fields:

1. `id`
2. `date`
3. `label`
4. `bakery_id`

A slot belongs to exactly one bakery. An order can use only a slot from its bakery and pickup date.

### Product

Fields:

1. `id`
2. `bakery_id`
3. `name`
4. `price`
5. `description`

A product belongs to exactly one bakery.

### Product Availability

Fields:

1. `id`
2. `product_id`
3. `date`
4. `quantity`

Availability is per product and date. Quantity is reduced when an order is created.

### Order

Fields:

1. `id`
2. `bakery_id`
3. `bakery_name`
4. `customer_name`
5. `customer_phone`
6. `pickup_date`
7. `pickup_slot_id`
8. `pickup_slot_label`
9. `status`
10. `comment`

An order belongs to one bakery and one pickup slot.

### Order Item

Fields:

1. `id`
2. `order_id`
3. `product_id`
4. `name`
5. `qty`
6. `price`

An order item snapshots product name and price at order creation time.

## Invariants

1. Customer name is required.
2. Customer phone is required.
3. An order must contain at least one item.
4. Each item quantity must be a positive integer.
5. A product can appear only once in a single order payload.
6. Every ordered product must belong to the selected bakery.
7. The pickup slot must belong to the selected bakery and pickup date.
8. Ordered quantity cannot exceed product availability for the pickup date.
9. Creating an order reduces product availability in the same transaction.
10. Payment is always on pickup in the current product focus.

## Order Status Flow

Allowed transitions:

1. `new` -> `confirmed`
2. `new` -> `cancelled`
3. `confirmed` -> `ready`
4. `confirmed` -> `cancelled`
5. `ready` -> `picked_up`
6. `ready` -> `not_picked_up`

No other status transitions are allowed.
