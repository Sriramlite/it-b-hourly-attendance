# 🎓 IT - B Hourly Attendance Management System

> Lightweight, high-performance Node.js hourly attendance web application designed specifically for **IT - B** class. Features full 8-period daily tracking, one-click bulk select ("Select All Present / Absent"), instant WhatsApp absentee announcement generator, full-day matrix grid, attendance analytics with &lt;75% defaulter detection, persistent cloud storage with **Supabase PostgreSQL**, and seamless 1-click deployment to **Vercel** or **Northflank**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Northflank](https://img.shields.io/badge/Deploy%20to-Northflank-blueviolet?style=for-the-badge&logo=docker)](https://northflank.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)

---

## ✨ Features

- ⏰ **Hourly 8-Period Tracking**:
  - Period 1: 08:45 – 09:35 | Period 2: 09:35 – 10:25 | Period 3: 10:40 – 11:30 | Period 4: 11:30 – 12:20
  - Period 5: 01:10 – 02:00 | Period 6: 02:00 – 02:50 | Period 7: 03:00 – 03:45 | Period 8: 03:45 – 04:30
- 🔘 **One-Click Select All Buttons**:
  - **Select All Present**: Mark all 55 students Present with a single click.
  - **Select All Absent**: Mark all students Absent.
  - **Invert Selection**: Instantly swap Present &lt;-&gt; Absent.
  - **Batch Selection**: Multi-select students with checkboxes to mark On Duty (OD) or Late (L).
- 📱 **One-Click WhatsApp Absentee Broadcaster**:
  - Formats ready-to-send messages with emojis, roll numbers, names, and percentage for posting into class / faculty WhatsApp groups.
- 📊 **Day Matrix Spreadsheet View**:
  - View all 8 periods side-by-side for the entire class for any given date with CSV export.
- 🚨 **Analytics & Defaulters Alert (&lt;75%)**:
  - Real-time attendance percentage computation per student with Anna University 75% minimum warning.
- ⚡ **Supabase PostgreSQL Cloud Storage**:
  - Attendance, student roster, and timetable data saved directly to your Supabase cloud database.
  - No data loss on serverless restarts (Vercel).
  - Also includes a built-in local JSON fallback when running offline!

---

## 🗄️ Step 1: Set Up Free Supabase Database (2 Minutes)

1. Go to [Supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** &rarr; Name it `itb-attendance` &rarr; Set a password &rarr; Click **Create new project**.
3. Once created, click on the **SQL Editor** tab in the left sidebar.
4. Open the file [`supabase_setup.sql`](./supabase_setup.sql) in this repository, copy all contents, paste it into the Supabase SQL Editor, and click **RUN**.
   - *This automatically creates the `students`, `attendance`, and `class_config` tables and populates the default 55 IT - B students!*
5. Go to **Project Settings** (gear icon) &rarr; **API**:
   - Copy **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - Copy **anon / public key** (or `service_role` key)

---

## ▲ Step 2: Deploy to Vercel (1 Minute)

1. Log in to [Vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New...** &rarr; **Project**.
3. Select your repository: `it-b-hourly-attendance`.
4. Under **Environment Variables**, add the 2 variables from your Supabase project:
   - `SUPABASE_URL` = *(Your Supabase Project URL)*
   - `SUPABASE_ANON_KEY` = *(Your Supabase Anon / Public Key)*
5. Click **Deploy**.
6. Vercel will deploy the site in ~15 seconds and give you a free production HTTPS domain (e.g. `https://it-b-hourly-attendance.vercel.app`)!

---

## 🚀 Alternative: Deploy to Northflank

You can also host this same repository on Northflank:
1. Log into [Northflank.com](https://northflank.com) &rarr; Create **Deployment Service**.
2. Select GitHub repository: `it-b-hourly-attendance` (branch `main`).
3. Under **Environment Variables**, add `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. Port: `3000` &rarr; Public facing: `ON`.
5. Click **Deploy Service**.

---

## 💻 Running Locally

```bash
# Clone the repository
git clone https://github.com/Sriramlite/it-b-hourly-attendance.git
cd it-b-hourly-attendance

# Install dependencies
npm install

# (Optional) Create .env file with Supabase credentials
# If skipped, it will automatically use local JSON storage!
copy .env.example .env

# Run server
npm start
```

Visit **`http://localhost:3000`** in your browser.

---

## 📁 Project Structure

```
it-b-hourly-attendance/
├── server.js            # Express server (works on both standalone Node & Vercel)
├── db.js                # Hybrid Database Layer (Supabase PostgreSQL + Local fallback)
├── supabase_setup.sql   # 1-Click SQL setup script for Supabase
├── vercel.json          # Vercel serverless routing configuration
├── Dockerfile           # Docker container for Northflank / Container hosting
├── package.json         # Dependencies & startup scripts
├── api/
│   └── index.js         # Vercel Serverless Function entry point
├── public/              # Frontend Web Application
│   ├── index.html       # UI Layout with 8 Periods, Select All & WhatsApp generator
│   ├── css/style.css    # Custom styles & animations
│   └── js/app.js        # Attendance, WhatsApp copy & analytics logic
└── data/                # Local storage fallback directory
```

---

## 📜 License
MIT License • Created for IT - B Class
