# 🎯 Web Quiz Management & Online Assessment Platform

A full-stack online assessment engine built with **React**, **Tailwind CSS**, and **Node.js/Express**, featuring role-based dashboards, live countdown timers, automated scoring, and real-time performance analytics[cite: 11].


## 🚀 Key Highlights

* **Role-Based Portals:** Dedicated dashboards with granular controls for **Admins** and streamlined quiz interfaces for **Students**[cite: 11].
* **Tamper-Proof Scoring Engine:** All quiz submissions, timers, and score calculations are strictly validated on the backend[cite: 11].
* **Live Quiz Mechanics:** Integrated timer with automatic submission on expiration and real-time question navigation[cite: 11].
* **Analytics & Leaderboard:** Visual performance tracking and global/category rankings[cite: 11].

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Axios, React Router, Recharts[cite: 11] |
| **Backend** | Node.js, Express.js, JWT Authentication, Bcrypt[cite: 11] |
| **Database** | Mongodb[cite: 11] |

## ⚡ Quick Start

### 1. Clone & Setup Backend
```powershell
cd backend
npm install
# Configure .env (PORT, DB_URL, JWT_SECRET)
npm start
```[cite: 11]

### 2. Setup Frontend
```poweshell
cd frontend
npm install
npm run dev
```[cite: 11]

## 📌 Main API Architecture

* `POST /api/auth/register` — Student Registration[cite: 11]
* `POST /api/auth/login` — Role-based Login[cite: 11]
* `POST /api/quizzes/:quizId/start` — Initialize Quiz Timer[cite: 11]
* `POST /api/quizzes/:quizId/submit` — Process Answers & Generate Results[cite: 11]
* `GET  /api/leaderboard` — Fetch Rankings[cite: 11]