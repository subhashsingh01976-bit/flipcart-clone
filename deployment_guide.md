# 🌐 MERN Stack Flipkart Clone — Deployment Guide

Since this is a full-stack MERN application, making it live requires hosting three distinct parts:
1. **Database** on **MongoDB Atlas** (Cloud Database)
2. **Backend Server** on **Render.com** (Node/Express Hosting)
3. **Frontend Client** on **Vercel** or **Netlify** (React Static Hosting)

---

## 🟢 Step 1: Setup MongoDB Atlas (Cloud Database)

You need to host your database in the cloud so the live backend can access it.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new **Free Shared Cluster**.
3. Under **Database Access**, create a user (e.g., username: `admin`, password: `yourpassword`). Keep these safe.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** -> **Connect your application** and copy the Connection String:
   ```env
   mongodb+srv://admin:<password>@cluster0.mongodb.net/flipkart?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your created database password).*

---

## 🔵 Step 2: Deploy Backend Server to Render

[Render.com](https://render.com) is free and perfect for hosting Node APIs.

1. Sign up on **Render** and link your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your `flipcart-clone` repository.
4. Set the following configuration details:
   - **Name**: `flipkart-clone-backend`
   - **Root Directory**: `server` (Important!)
   - **Language**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add these Environment Variables:
   - `MONGO_URI` = *(Your MongoDB Atlas connection string from Step 1)*
   - `JWT_SECRET` = `any_long_random_string`
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app` (You can update this after Step 3)
6. Click **Create Web Service**. Once built, copy your live backend URL (e.g., `https://flipkart-clone-backend.onrender.com`).

---

## 🟡 Step 3: Deploy Frontend Client to Vercel

[Vercel](https://vercel.com) is the best and fastest place to host Vite React applications.

1. Go to **Vercel** and sign up using your GitHub account.
2. Click **Add New** -> **Project**.
3. Select your `flipcart-clone` repository and click **Import**.
4. Configure the Vite setup:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` (Important!)
   - **Environment Variables**: Add one key-value pair:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-domain.onrender.com/api` (Use the Render backend URL from Step 2)
5. Click **Deploy**. Your site will be live in less than 2 minutes!

---

## ⚙️ Configuration Adjustments

Once deployed, make sure to update the **CLIENT_URL** env variable in your **Render backend dashboard** to match the live Vercel URL (e.g., `https://flipcart-clone.vercel.app`) so requests are not blocked by CORS policy.
