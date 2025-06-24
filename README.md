# 👨‍💻 MERN Online Judge

A scalable, full-stack Online Judge web application built using the MERN stack (MongoDB, Express, React, Node.js). Users can register, login, solve coding problems, and get real-time verdicts.

---

## 🚀 Features

- 🧾 User Registration & Login (with token-based auth)
- 🔐 Protected Routes for authenticated users
- ✅ Real-time Code Submission (coming soon)
- 👨‍🏫 Profile & Submissions History (upcoming)
- 🧠 Admin Panel for problem creation (future)
- 🧪 Docker-based code evaluation (future)
- 🎯 Contests & Leaderboards (planned)

---

## 🛠️ Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Frontend    | React + Vite + Axios     |
| Backend     | Node.js + Express.js     |
| Database    | MongoDB (with Mongoose)  |
| Auth        | JWT (JSON Web Tokens)    |
| Compiler    | Docker-based (planned)   |
| Hosting     | To be hosted on Vercel + Render or EC2 |

---

## 📂 Project Structure

online-judge/
├── online-judge-frontend/ # React frontend (Vite)
├── online-judge-backend/ # Express backend (with MongoDB)

## 🔐 Auth Flow

- If not logged in, users are redirected to `/login`
- After login, JWT is saved in `localStorage` and user is redirected to `/`
- Register page has toggle to Login and vice versa
- Logout button clears token and resets auth state