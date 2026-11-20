# 🎓 IT - B Hourly Attendance Management System

> Lightweight, high-performance Node.js hourly attendance web application designed specifically for **IT - B** class. Features full 8-period daily tracking, one-click bulk select ("Select All Present / Absent"), instant WhatsApp absentee announcement generator, full-day matrix grid, attendance analytics with &lt;75% defaulter detection, and seamless deployment to **Northflank**.

[![Deploy to Northflank](https://img.shields.io/badge/Deploy%20to-Northflank-blueviolet?style=for-the-badge&logo=docker)](https://northflank.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

---

## ✨ Features

- ⏰ **Hourly 8-Period Tracking**:
  - Period 1: 08:45 – 09:35
  - Period 2: 09:35 – 10:25
  - Period 3: 10:40 – 11:30
  - Period 4: 11:30 – 12:20
  - Period 5: 01:10 – 02:00
  - Period 6: 02:00 – 02:50
  - Period 7: 03:00 – 03:45
  - Period 8: 03:45 – 04:30
- 🔘 **One-Click Select All Buttons**:
  - **Select All Present**: Mark all 55 students Present with a single click.
  - **Select All Absent**: Mark all students Absent.
  - **Invert Selection**: Instantly swap Present &lt;-&gt; Absent.
  - **Batch Selection**: Multi-select students with checkboxes to mark On Duty (OD) or Late (L).
- 📱 **One-Click WhatsApp Absentee Broadcaster**:
  - Formats ready-to-send messages with emojis, roll numbers, names, and percentage for posting into class / faculty WhatsApp groups.
- 📊 **Day Matrix Spreadsheet View**:
  - View all 8 periods side-by-side for the entire class for any given date.
  - Export daily attendance reports to CSV / Excel.
- 🚨 **Analytics & Defaulters Alert (&lt;75%)**:
  - Real-time attendance percentage computation per student.
  - Automatic detection of students below Anna University / College 75% minimum attendance rule.
- 👥 **Student Roster Management**:
  - Preloaded with IT - B student roster (Roll No: 22ITB01 to 22ITB55).
  - Add, edit, and delete students.
  - Bulk CSV import for roster updates.
  - Reset to default students anytime.
- 🚀 **Northflank Ready**:
  - Lightweight Express backend with zero native compilation dependencies (`better-sqlite3` build issues avoided).
  - Production-ready `Dockerfile` based on `node:20-alpine`.
  - `/health` endpoint for Northflank health checks.

---

## 🚀 How to Host on Northflank (Step-by-Step)

Northflank allows you to host Node.js / Docker services with automated CI/CD directly from GitHub.

### Step 1: Sign Up / Log In
1. Go to [Northflank.com](https://northflank.com) and log in with your GitHub account.

### Step 2: Create a New Service
1. In your Northflank Dashboard, click **Create Service** &rarr; Select **Deployment**.
2. Service Name: `it-b-attendance`.

### Step 3: Connect GitHub Repository
1. Under **Source**, choose **GitHub**.
2. Select your repository: `Sriramlite/it-b-hourly-attendance`.
3. Branch: `main`.

### Step 4: Build Configuration
Northflank supports both Dockerfile and Node.js Buildpack:
- **Option A (Recommended - Dockerfile)**:
  - Northflank will automatically detect `Dockerfile` in the root of the repo.
  - Build context: `/`.
- **Option B (Node.js Buildpack)**:
  - Build command: `npm install`
  - Run command: `npm start`

### Step 5: Port & Networking
1. Under **Networking / Ports**:
   - Port: `3000` (or leave default HTTP `3000`).
   - Protocol: `HTTP`.
   - Public facing: **Enabled** (this assigns your free Northflank URL like `https://it-b-attendance-xxxx.northflank.app`).
2. Under **Health Checks**:
   - Health check path: `/health`
   - Port: `3000`

### Step 6: Deploy
1. Click **Deploy Service**.
2. Northflank will clone the GitHub repo, build the image in ~15-30 seconds, and provide you with a live secure HTTPS URL!

---

## 💻 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Sriramlite/it-b-hourly-attendance.git
cd it-b-hourly-attendance

# Install dependencies
npm install

# Start the server
npm start
```

Visit **`http://localhost:3000`** in your browser.

For live reload development:
```bash
npm run dev
```

---

## 📁 Project Structure

```
it-b-hourly-attendance/
├── server.js          # Express server & REST API endpoints
├── db.js              # Lightweight JSON storage engine & analytics logic
├── package.json       # App configuration & scripts
├── Dockerfile         # Multi-stage lightweight Node-Alpine container
├── .dockerignore      # Excluded files for fast Docker builds
├── .gitignore         # Git ignore rules
├── public/            # Modern frontend SPA
│   ├── index.html     # Dashboard layout & modals
│   ├── css/
│   │   └── style.css  # Custom animations & theme styles
│   └── js/
│       └── app.js     # Attendance, WhatsApp copy & analytics logic
└── data/              # Persistent data folder (students, attendance, timetable)
    ├── students.json
    ├── attendance.json
    └── config.json
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint for Northflank |
| `GET` | `/api/config` | Get class timetable and period schedule |
| `POST` | `/api/config` | Update class timetable settings |
| `GET` | `/api/students` | Get all students in IT - B |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Delete student |
| `POST` | `/api/students/import`| Bulk import students via CSV list |
| `POST` | `/api/students/reset` | Reset roster to default 55 students |
| `GET` | `/api/attendance?date=...&period=...` | Fetch attendance for a specific period |
| `POST` | `/api/attendance` | Save hourly attendance record |
| `GET` | `/api/attendance/day?date=...` | Fetch all 8 periods for a day |
| `GET` | `/api/analytics` | Overall class statistics & defaulters (&lt;75%) |
| `GET` | `/api/export/csv?date=...` | Download daily attendance sheet in CSV |

---

## 📜 License
MIT License • Created for IT - B Class
