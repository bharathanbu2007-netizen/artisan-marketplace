# Architecture

## Overview

Three deployable units sharing one MongoDB-backed API:

- **backend** (Node/Express/Socket.io) — REST API for auth, catalog, orders,
  chat, AI services, and admin operations. Socket.io handles real-time chat.
- **mobile** (Expo/React Native) — buyer and seller-facing app, role-based
  navigation after OTP login.
- **admin-web** (Vite/React) — internal approval & reporting console.

## Data flow: smart cataloging

1. Seller records a voice description in the mobile AI Studio screen.
2. Audio uploads to `POST /api/ai/catalog/voice` (or inline during
   `POST /api/seller/products`).
3. `speechService.transcribeAudio` produces a transcript.
4. `catalogService.catalogFromVoice` splits it into title/description and
   calls `translationService.translateToAllLanguages` to produce en/hi/ta
   versions, stored on the `Product.translations` field.
5. Buyers browsing the catalog get `title`/`description` localized to their
   `preferredLanguage` at read time.

## Data flow: translated chat

1. Buyer opens a `Conversation` with a seller (optionally scoped to a
   product).
2. Client connects to Socket.io with a JWT; server authenticates the socket
   and joins `conversation:<id>` rooms.
3. On `message:send`, the server translates the message into every
   supported language once, stores all versions on the `Message` document,
   and broadcasts the raw message to the room.
4. Each client resolves `translations[<their preferredLanguage>]` when
   rendering — so sender and recipient each read in their own language
   without any client-side translation logic.

## Dynamic pricing

`pricingService.suggestPrice` blends a category-based heuristic multiplier
with the average price of recent active listings in the same category,
returning a `suggestedPrice` sellers can accept or override.
