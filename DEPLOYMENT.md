# Deployment Guide

This guide will help you deploy the Bookmark Manager application:
- **Backend**: Django REST Framework on **Render**.
- **Frontend**: Next.js on **Vercel**.

---

## 🚀 1. Deploying the Backend (Render)

Render is great for Python/Django apps.

1.  **Sign Up/Login**: Go to [Render.com](https://render.com/) and log in (e.g., with GitHub).
2.  **New Web Service**:
    *   Click the **New +** button and select **Web Service**.
    *   Connect your GitHub repository (`figmenta`).
3.  **Configure the Service**:
    *   **Name**: `figmenta-backend` (or similar)
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
    *   **Instance Type**: Free (if available) or Starter.
4.  **Environment Variables**:
    Scroll down to "Environment Variables" and add these:
    *   `PYTHON_VERSION`: `3.10.9`
    *   `SECRET_KEY`: (Generate a random string, e.g., using `openssl rand -base64 32`)
    *   `DEBUG`: `False`
    *   `ALLOWED_HOSTS`: `*` (or your Render URL, e.g., `figmenta-backend.onrender.com`)
    *   `CORS_ALLOWED_ORIGINS`: (Leave empty for now, we'll update this after deploying frontend)
5.  **Deploy**: Click **Create Web Service**.

**Wait for the deployment to finish.** Once live, copy your backend URL (e.g., `https://figmenta-backend.onrender.com`).

---

## 🌐 2. Deploying the Frontend (Vercel)

Vercel is the creators of Next.js and the best place to deploy it.

1.  **Sign Up/Login**: Go to [Vercel.com](https://vercel.com/) and log in.
2.  **Add New Project**:
    *   Click **Add New...** -> **Project**.
    *   Import your `figmenta` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Build Command**: `next build` (default).
    *   **Output Directory**: `.next` (default).
    *   **Install Command**: `npm install` (default).
4.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: Your Render Backend URL + `/api` (e.g., `https://figmenta-backend.onrender.com/api`)
    *   **Important**: Do not include a trailing slash.
5.  **Deploy**: Click **Deploy**.

**Wait for the deployment to finish.** Once live, copy your frontend URL (e.g., `https://figmenta.vercel.app`).

---

## 🔗 3. Connecting Them (CORS)

Now that you have your frontend URL, you need to tell the backend to allow requests from it.

1.  Go back to your **Render Dashboard** -> **Settings** -> **Environment Variables**.
2.  Add/Edit `CORS_ALLOWED_ORIGINS`.
3.  Set the Value to your Vercel frontend URL (e.g., `https://figmenta.vercel.app`).
    *   Do not include a trailing slash.
4.  **Save Changes**. Render will automatically redeploy.

---

## 🎉 Done!

Your full-stack application is now live!
- Visit your Vercel URL to use the app.
- The frontend will communicate with your Django backend on Render.
