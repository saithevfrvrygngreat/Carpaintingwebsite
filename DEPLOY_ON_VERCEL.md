# 🚀 Ultimate Deployment Guide: AutoGlow

This guide covers everything from zero to a fully deployed application on Vercel with MongoDB Atlas.

---

## ✅ Phase 1: Database Setup (MongoDB Atlas)
*Goal: Get your cloud database ready and accessible.*

1.  **Log in** to [MongoDB Atlas](https://cloud.mongodb.com).
2.  **Get Connection String**:
    *   Click **Connect** on your Cluster -> **Drivers** -> **Node.js**.
    *   Copy the string (looks like `mongodb+srv://<user>:<password>@cluster...`).
    *   *Tip*: Replace `<password>` with your real database password.
3.  **Allow Access from Vercel**:
    *   Go to **Network Access** (left sidebar).
    *   Click **Add IP Address**.
    *   Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
    *   Click **Confirm**. *Without this, Vercel cannot connect.*

---

## ✅ Phase 2: Backend Deployment (API)
*Goal: specific "server" project that talks to the database.*

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub Repository: `saithevfrvrygngreat/Carpaintingwebsite`.
4.  **Configure the Project**:
    *   **Project Name**: `car-painting-api`
    *   **Framework Preset**: Select **Other**.
    *   **Root Directory**: Click **Edit** -> Select `backend`.
5.  **Environment Variables** (Expand section):
    *   `MONGO_URI` = (Paste your Atlas Connection String from Phase 1)
    *   `JWT_SECRET` = `secret` (or any secure word)
    *   *Optional*: `EMAIL_USER` (Your Gmail), `EMAIL_PASS` (Gmail App Password) for contact form emails.
6.  Click **Deploy**.
7.  **Copy the URL**: Once finished, you will get a domain like `https://car-painting-api.vercel.app`. **Save this.**

---

## ✅ Phase 3: Frontend Deployment (UI)
*Goal: The website users will actually see.*

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import the **SAME** GitHub Repository (`Carpaintingwebsite`) again.
4.  **Configure the Project**:
    *   **Project Name**: `car-painting-website`
    *   **Framework Preset**: **Vite** (Should be auto-detected).
    *   **Root Directory**: Click **Edit** -> Select `frontend`.
5.  **Environment Variables**:
    *   `VITE_API_URL` = (Paste the Backend URL from Phase 2, e.g., `https://car-painting-api.vercel.app`)
    *   *Important*: Do **NOT** add a trailing slash (`/`) at the end.
6.  Click **Deploy**.

---

## ✅ Phase 4: Verification
1.  Open your new **Frontend Website URL**.
2.  **Test 1**: Go to "Services" -> "Book Appointment". It should NOT crash.
3.  **Test 2**: Log in as Admin (`kameswarraodasetti@gmail.com`).
4.  **Test 3**: Check "My Bookings". If it loads without error, your database connection is perfect.

## ⚠️ Known Limitations
*   **Images**: When you upload a new avatar or gallery image, it will appear broken after a few minutes. This is because Vercel does not support permanent file storage. The images you see now might be missing. For a real production app, you would need to add an AWS S3 or Cloudinary integration.
