# Deployment Guide - Task Management Dashboard

This guide provides step-by-step instructions to deploy the Task Management Dashboard to a production environment.

## 1. Firebase Setup

Before deploying, ensure your Firebase project is correctly configured.

### Authentication
- Go to **Firebase Console** > **Build** > **Authentication**.
- Enable **Email/Password** sign-in method.

### Firestore Database
- Go to **Firebase Console** > **Build** > **Firestore Database**.
- Click **Create Database**.
- Start in **Production Mode** and choose a location.
- Apply the rules found in the documentation or console to allow access based on roles.

### Service Account (Required for Backend)
- Go to **Project Settings** > **Service accounts**.
- Click **Generate new private key**.
- Download the JSON file. You will need values from this for your backend environment variables.

---

## 2. Backend Deployment (Node.js/Express)

*Recommended Hosting: [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com)*

### Steps:
1. Connect your GitHub repository to your hosting provider.
2. Set the **Root Directory** to `server`.
3. Set the **Build Command**: `npm install`
4. Set the **Start Command**: `npm start`
5. Configure the following **Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `PORT` | `5000` (or provided by host) |
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `FIREBASE_PRIVATE_KEY` | Your Firebase Service Account Private Key (include quotes) |
| `FIREBASE_CLIENT_EMAIL` | Your Firebase Service Account Client Email |
| `JWT_SECRET` | A secure random string for signing JWT tokens |
| `CORS_ORIGIN` | The URL of your deployed frontend (e.g., `https://your-app.vercel.app`) |

---

## 3. Frontend Deployment (React/Vite)

*Recommended Hosting: [Vercel](https://vercel.com), [Netlify](https://netlify.com), or [Cloudflare Pages](https://pages.cloudflare.com/)*

### Steps:
1. Connect your GitHub repository to your hosting provider.
2. Set the **Root Directory** to `client`.
3. Select **Vite** as the framework preset (if available).
4. Set the **Build Command**: `npm run build`
5. Set the **Output Directory**: `dist`
6. Configure the following **Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_API_URL` | Your deployed Backend URL (e.g., `https://your-api.onrender.com`) |

---

## 4. Verification

Once both are deployed:
1. Visit your frontend URL.
2. Try to Sign Up or Login.
3. Check the browser console (F12) for any CORS or connection errors.
4. Verify that data persists in the Firestore console.

> [!TIP]
> Ensure `VITE_API_URL` in the frontend does **not** have a trailing slash unless your backend routes expect it.
