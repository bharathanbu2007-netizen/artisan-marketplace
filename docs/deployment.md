# Deployment

```
Mobile App -> Render Backend -> MongoDB Atlas
                              -> Cloudinary
                              -> AI Services

Admin (React/Vite) -> Netlify -> Render Backend
```

## Backend (Render)
1. Push `backend/` to GitHub.
2. Create a new Web Service on Render, root directory `backend`.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables from `backend/.env.example`.
5. Render provides the public HTTPS URL used by both the admin web app and the mobile app.

## Admin (Netlify)
1. Push `admin/` to GitHub (or use the same monorepo with a `admin` base directory).
2. Build command: `npm run build`. Publish directory: `dist`.
3. Set `VITE_API_URL` to your Render backend URL + `/api`.

## Database (MongoDB Atlas)
1. Create a free-tier cluster.
2. Create a database user and allow network access from Render's IPs (or 0.0.0.0/0 during development).
3. Copy the connection string into `MONGO_URI`.

## Mobile (Expo / EAS)
1. `npx expo install` to align native dependency versions.
2. Set `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_SOCKET_URL` to the Render backend URL.
3. `eas build --platform android` for a production APK/AAB.
4. Use Expo Updates / EAS Update for over-the-air JS updates between store releases; native-capability
   changes still require a new store submission (see `backend/src/models/AppVersion.js` and
   `GET /api/app/version` for the in-app update-check flow).

## Git workflow
```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin YOUR_REPOSITORY
git push -u origin main
```
