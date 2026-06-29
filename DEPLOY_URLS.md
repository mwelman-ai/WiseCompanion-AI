# SparkStream Deployment Instructions

Since direct CLI deployment requires owner authentication, please follow these steps to deploy SparkStream to production.

## 1. Backend Deployment (Render)

1.  **Log in** to your [Render dashboard](https://dashboard.render.com).
2.  Click **"New"** and select **"Web Service"**.
3.  Connect your GitHub repository: `mwelman-ai/SparkStream`.
4.  Configure the service:
    - **Name**: `sparkstream-backend`
    - **Root Directory**: `backend`
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Environment Variables**: Add the following (refer to `backend/.env.example`):
    - `PORT`: `10000`
    - `JWT_SECRET`: (Your secret key)
    - `OPENAI_API_KEY`: (Your OpenAI API key)
    - `STRIPE_SECRET_KEY`: (Your Stripe secret key)
    - `STRIPE_WEBHOOK_SECRET`: (Your Stripe webhook secret)
    - `FRONTEND_URL`: (The URL of your Vercel deployment - you may need to update this after step 2)
    - `STRIPE_PRO_PRICE_ID`: (Your Stripe Price ID for Pro)
    - `STRIPE_PREMIUM_PRICE_ID`: (Your Stripe Price ID for Premium)
    - `TURSO_DATABASE_URL`: (Your Turso Database URL, e.g., libsql://your-db.turso.io)
    - `TURSO_AUTH_TOKEN`: (Your Turso Auth Token)
6.  Click **"Create Web Service"**.
7.  **Note the backend URL** (e.g., `https://sparkstream-backend.onrender.com`).

> **Note**: If you have already deployed and are missing the latest OpenAI fix, click **"Manual Deploy"** -> **"Deploy Latest Commit"** in the Render dashboard.

## 2. Frontend Deployment (Vercel)

1.  **Log in** to your [Vercel dashboard](https://vercel.com).
2.  Click **"Add New"** and select **"Project"**.
3.  Import your GitHub repository: `mwelman-ai/SparkStream`.
4.  Configure the project:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
5.  **Environment Variables**:
    - `VITE_API_URL`: (The backend URL from Render, e.g., `https://sparkstream-backend.onrender.com`)
6.  Click **"Deploy"**.
7.  **Note the frontend URL** (e.g., `https://sparkstream.vercel.app`).

## 3. Post-Deployment Update

1.  Go back to the **Render dashboard** for your backend service.
2.  Update the `FRONTEND_URL` environment variable with your new Vercel URL.
3.  Render will automatically redeploy with the updated config.

## Summary of URLs
- **GitHub Repo**: `https://github.com/mwelman-ai/SparkStream.git`
- **Backend (Render)**: (Pending)
- **Frontend (Vercel)**: (Pending)
