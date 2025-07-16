# 👨‍💻 Codeon - MERN Online Judge

A scalable, full-stack Online Judge web application built using the MERN stack (MongoDB, Express, React, Node.js). Features real-time code submission, Docker-based evaluation, and AI-powered debugging assistance.

---

## 🚀 Features

### Core Features
- 🧾 **User Registration & Login** (with token-based auth)
- 🔐 **Protected Routes** for authenticated users
- ✅ **Real-time Code Submission** with instant verdicts
- 💻 **Multi-language Support** (C++, Python, Java)
- 🐳 **Docker-based Code Execution** with secure sandboxing
- 🧪 **Test Case Evaluation** with detailed failure reports
- 🎯 **Problem Management** with custom input testing
- 🧠 **Admin Panel for problem** creation

### AI-Powered Features
- 🤖 **AI Assistant** with 4 modes: Hint, Debug, Optimize, Explain
- 🚫 **Rate Limiting**: 5 AI requests per user per day
- 🔄 **Persistent Sessions** and **Resizable AI Panel**
- 🧠 **Google Gemini API** integration for intelligent responses

### Upcoming Features
- 👨‍🏫 Profile & Submissions History
- 🎯 Contests & Leaderboards

---

## 🛠️ Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Frontend    | React + Vite + Monaco Editor |
| Backend     | Node.js + Express.js     |
| Database    | MongoDB (with Mongoose)  |
| Code Execution | Docker + Custom Compiler Service |
| Auth        | JWT (JSON Web Tokens)    |
| AI Engine   | Google Gemini API        |
| Styling     | Tailwind CSS + shadcn/ui |
| Containerization | Docker & Docker Compose |

---

## 📂 Project Structure
```bash
OJ_project/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── compiler/          # Docker-based code execution service