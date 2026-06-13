# API Contracts

Status: active
Last updated: 2026-06-14
Owner: project
Purpose: document active API routes, payloads, responses, and error behavior.

## GET `/api/bakeries`

Returns all bakeries with products, availability, and pickup slots.

Response:

```json
{
  "bakeries": []
}
```

Used by:

1. `components/storefront-workspace.js`

## GET `/api/bakeries/:slug`

Returns one bakery by slug.

Response:

```json
{
  "bakery": {}
}
```

Errors:

1. `404` with `{ "error": "Bakery not found" }`

Used by:

1. `components/single-bakery-page.js`

## GET `/api/orders`

Query parameters:

1. `date` optional
2. `bakeryId` optional

Response:

```json
{
  "orders": [],
  "metrics": {}
}
```

Used by:

1. `components/orders-feed.js`
2. `components/dashboard-panel.js`

## POST `/api/orders`

Creates a pre-order and reduces product availability.

Request:

```json
{
  "bakeryId": "bakery-1",
  "pickupDate": "2026-06-14",
  "pickupSlotId": "slot-1",
  "customerName": "Анна",
  "customerPhone": "+7 900 123-45-67",
  "comment": "optional",
  "items": [
    {
      "productId": "prod-1",
      "qty": 2
    }
  ]
}
```

Response:

```json
{
  "order": {},
  "bakery": {},
  "metrics": {}
}
```

Errors:

1. `400` when required fields are missing.
2. `400` when pickup slot is invalid.
3. `400` when product does not belong to the bakery.
4. `400` when quantity is not a positive integer.
5. `400` when one product appears more than once in the payload.
6. `400` when requested quantity exceeds availability.

Used by:

1. `components/storefront-workspace.js`
2. `components/single-bakery-page.js`

## PATCH `/api/orders/:id`

Updates order status through the allowed status flow.

Request:

```json
{
  "status": "confirmed"
}
```

Response:

```json
{
  "order": {},
  "metrics": {}
}
```

Errors:

1. `404` when order is not found.
2. `400` when status is unknown.
3. `400` when transition is not allowed.

Used by:

1. `components/dashboard-panel.js`

## GET `/api/metrics`

Returns overview metrics for the primary date.

Response:

```json
{
  "metrics": {
    "primaryDate": "2026-06-14",
    "bakeriesCount": 3,
    "ordersCount": 2,
    "itemsCount": 7
  }
}
```

Used by:

1. `components/hero-section.js`
