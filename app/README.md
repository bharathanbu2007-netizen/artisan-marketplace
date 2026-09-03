# Artisan Marketplace

AI-driven market linkage & smart cataloging platform for marginalized artisans.
Connects local artisans directly with buyers, removing middlemen, through
AI-assisted product cataloging, dynamic pricing, and real-time translated chat.

## Structure

```
artisan-marketplace/
├── backend/       Node.js + Express + MongoDB + Socket.io API
├── mobile/        Expo (React Native) app — buyer & seller experiences
├── admin-web/     Vite + React admin panel — approvals & reports
└── docs/          Architecture notes
```

## Features

- **Smart voice cataloging** — sellers speak a product description in
  English, Hindi, or Tamil; the backend transcribes it and auto-generates a
  multilingual listing (title + description in all three languages).
- **AI image enhancement** — uploaded product photos get an enhancement pass
  before publishing (pluggable provider).
- **Dynamic pricing assistant** — suggests a price automatically from
  category heuristics and recent comparable listings.
- **Real-time buyer↔seller chat** with automatic translation — a Tamil
  manufacturer and a Hindi/English buyer can message (text or voice) and each
  reads every message in their own language.
- **Admin panel** — approve sellers, approve/reject product listings, manage
  users, view marketplace-wide reports.

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # already copied — edit as needed
npm run dev             # starts on http://localhost:4000, needs MongoDB running
npm run seed             # optional: creates a default admin user (+910000000000)
```

Requires a running MongoDB instance (`MONGO_URI` in `.env`, defaults to
`mongodb://localhost:27017/artisan_marketplace`).

All AI-adjacent services (translation, speech-to-text, image enhancement)
run in a **mock mode** by default so the whole app works end-to-end without
any API keys. To use real providers, set the relevant `*_PROVIDER` and API
key variables in `backend/.env` (see comments in `.env.example`).

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start
```

Update `app.json` → `expo.extra.apiUrl` / `socketUrl` to point at your
backend (defaults to `http://localhost:4000`).

### 3. Admin panel

```bash
cd admin-web
npm install
npm run dev              # http://localhost:5173
```

Admin routes require a user with `role: admin` — the seed script above
creates one; verify OTP normally through `/api/auth` to get a token, then
store it as `admin_token` in `localStorage` (a proper admin login screen can
be wired to `authController` the same way the mobile app does).

## Notes

- Chat scope: initial build targets Tamil seller ↔ Tamil buyer as the first
  fully-tested language pair; the translation pipeline itself supports all
  three languages (en/hi/ta) symmetrically.
- Real transcription/translation/image-enhancement providers are left as
  clean integration points (`backend/src/services/*.js`) rather than bundled,
  so you can plug in Google Cloud, Azure, or OpenAI without touching calling
  code.
