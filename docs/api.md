# Backend API Structure

Base URL: `/api`

## Auth
- `POST /auth/register` — { name, email, phone?, password, role, businessName?, craftType? }
- `POST /auth/login` — { email, password }
- `GET /auth/me` — requires Bearer token

## Artisans
- `GET /artisans`
- `GET /artisans/:id`
- `GET /artisans/:id/products`
- `PATCH /artisans/me` — artisan only

## Products
- `GET /products` — query: q, category, minPrice, maxPrice, page, limit
- `GET /products/:id`
- `POST /products` — artisan only, creates a draft
- `PUT /products/:id/update` — artisan only, owner only
- `POST /products/:id/publish` — artisan only, owner only, server validates price & images
- `DELETE /products/:id` — artisan/admin, archives the product

## Categories
- `GET /categories`
- `POST /categories` — admin only
- `PATCH /categories/:id` — admin only
- `DELETE /categories/:id` — admin only (soft-deactivate)

## Cart
- `GET /cart`
- `POST /cart` — { productId, quantity }
- `DELETE /cart/:productId`
- `DELETE /cart` — clear

## Orders
- `GET /orders` — buyer sees own orders, artisan sees orders on their products
- `POST /orders` — buyer only; server re-validates product ids & authoritative price
- `GET /orders/:id`
- `PATCH /orders/:id` — artisan/admin; updates status

## Conversations & Messages
- `GET /conversations`
- `POST /conversations` — { otherUserId, productId? } get-or-create
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages` — REST fallback; live delivery is via Socket.IO

## AI (artisan only)
- `POST /ai/analyze-product` — { imageUrl }
- `POST /ai/enhance-image` — { imageUrl, background }
- `POST /ai/analyze-scene` — { imageUrl }
- `POST /ai/catalog` — { audioUrl | transcript, sourceLanguage, detectedObject, material }
- `POST /ai/price` — { category, material, rawMaterialEstimate, comparableProducts }

## Notifications
- `GET /notifications`
- `PATCH /notifications/:id/read`

## App version
- `GET /app/version?platform=android|ios`
- `POST /app/version` — admin only

## Socket.IO events
| Event | Direction | Payload |
|---|---|---|
| `user:online` | client -> server | `{ userId }` |
| `notification:subscribe` | client -> server | `{ userId }` |
| `message:send` | client -> server | `{ conversationId, senderId, receiverId, type, text }` |
| `message:new` | server -> client | Message document |
| `message:read` | both | `{ conversationId, userId }` |
| `typing:start` / `typing:stop` | both | `{ conversationId, userId, receiverId }` |
| `order:subscribe` / `order:unsubscribe` | client -> server | `{ orderId }` |
| `order:created` / `order:updated` / `order:cancelled` | server -> client | `{ orderId, ... }` |
| `product:published` | server -> client | `{ productId, artisanId }` |
| `notification:new` | server -> client | Notification document |
| `user:online` / `user:offline` | server -> client | `{ userId }` |
