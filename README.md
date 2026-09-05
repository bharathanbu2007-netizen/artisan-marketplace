# AI Artisan Marketplace

AI-driven market linkage and smart cataloging mobile application for marginalized artisans.

## What this is

A production-oriented starter codebase implementing the architecture described in
`AI_Artisan_Marketplace_Complete_Guide`:

- **mobile/** — React Native + Expo + TypeScript (Expo Router) app for Buyers and Artisans
- **backend/** — Node.js + Express + Socket.IO API, MongoDB (Mongoose), Cloudinary, JWT auth, AI service modules
- **admin/** — React + Vite admin web dashboard
- **docs/** — architecture, API, database and deployment notes

## Quick start

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in your own values
npm install
npm run dev             # http://localhost:5000
```

### 2. Admin web
```bash
cd admin
npm install
npm run dev              # http://localhost:5173
```

### 3. Mobile app
```bash
cd mobile
npm install
npx expo start
```
Update `mobile/constants/theme.ts` -> `API_URL` (or `.env` via `EXPO_PUBLIC_API_URL`) to point at your backend.

## Build order (recommended)

1. Backend foundation (auth, DB, models) — already scaffolded
2. Marketplace (products, categories, search, cart)
3. Artisan dashboard (products, inventory, orders)
4. AI Studio (photo scan → enhance → catalog → price → publish)
5. Real-time chat (Socket.IO)
6. Orders & notifications
7. Admin panel
8. Deployment (Render + Netlify + MongoDB Atlas)

See `docs/` for details on each subsystem.

## License
Proprietary — build for your own artisan marketplace project.
