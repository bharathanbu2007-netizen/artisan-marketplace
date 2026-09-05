# Architecture

## Stack
- Mobile: React Native + Expo + TypeScript + Expo Router
- State/API: Zustand + Axios + Socket.IO Client
- Backend: Node.js + Express.js + Socket.IO
- Database: MongoDB Atlas + Mongoose
- Images: Cloudinary
- Auth: JWT + bcrypt
- AI: Vision/NLP/Speech services exposed through backend `services/ai` modules
- Admin Web: React + Vite
- Deployment: Render (backend), Netlify (admin), MongoDB Atlas (database)

## High-level flow
```
MOBILE APP (React Native + Expo)
        |  HTTPS / WebSocket
        v
RENDER SERVER (Node.js + Express + Socket.IO)
        |
        +--- MongoDB Atlas
        |
        +--- Cloudinary
        |
        +--- AI Services

ADMIN WEB (React + Vite) ---> Netlify
```

## AI Artisan Studio pipeline
```
Camera -> compression -> Vision AI -> object/product detection ->
background segmentation/removal -> lighting & color correction ->
e-commerce crop/alignment -> professional preview -> publish
```
Backend touchpoints: `POST /api/ai/analyze-product`, `POST /api/ai/enhance-image`.

## AI Scene Scan pipeline
```
Camera -> analyze environment -> detect surface/background/lighting/colors ->
recommend product/category -> recommend placement/background ->
optionally visualize product in scene
```
Backend touchpoint: `POST /api/ai/analyze-scene`.

## Multilingual AI Cataloger pipeline
```
Regional-language voice -> speech-to-text -> product info extraction ->
translation -> professional description generation ->
English + Hindi + regional language
```
Backend touchpoint: `POST /api/ai/catalog`.

## Real-time architecture
```
React Native <-> Socket.IO <-> Node.js/Express <-> MongoDB
```
Events: `message:new`, `message:read`, `order:created`, `order:updated`,
`order:cancelled`, `product:published`, `notification:new`, `user:online`,
`user:offline`, `typing:start`, `typing:stop`.

## Module build order
1. Foundation (mobile/backend/admin scaffolding — done in this repo)
2. Backend (Express, MongoDB, auth, roles)
3. Marketplace (products, categories, search, favorites, cart)
4. Artisan dashboard (registration, profile, products, inventory, orders)
5. AI Studio (scan, detect, remove background, enhance, theme)
6. AI Cataloger (voice, speech-to-text, translation, description)
7. AI Pricing (market analysis, suggested range, manufacturer control)
8. Real-time chat (Socket.IO conversations/messages/typing/read receipts)
9. Orders (cart, checkout, lifecycle, notifications)
10. Notifications (socket events + push)
11. Admin (dashboard, users, artisans, products, orders, reports, categories)
12. Deployment (GitHub, Render, Netlify, MongoDB Atlas, Android build)
