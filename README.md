# 👨‍💻 Codeon - MERN Online Judge

A scalable, full-stack Online Judge platform built with the MERN stack. It features real-time code execution, secure Docker-based sandboxing, and intelligent AI-powered debugging tools—all hosted on AWS infrastructure.

Live Preview: [http://65.2.78.180:3000](http://65.2.78.180:3000)  
Coming Soon: [https://codeon.co.in](https://codeon.co.in)

---

## 🚀 Features

### Core Functionality
- 🧾 **User Registration & Login** with JWT authentication
- 🔐 **Protected Routes** for authenticated users
- 💻 **Real-time Code Submission** with instant verdicts
- 🧪 **Test Case Evaluation** with support for hidden and sample cases
- 🐳 **Docker-Based Code Execution** with language-level isolation
- 🔠 **Multi-Language Support**: C++, Python, and Java
- 🧠 **Problem Management System** with admin access
- 🧾 **Custom Input Testing** for user-side debugging

### AI-Powered Tools
- 🤖 **AI Assistant** with 4 smart modes:
  - Hint 🧠
  - Debug 🔍
  - Optimize ⚙️
  - Explain 📘
- ⛔ **Rate Limiting**: 5 AI prompts per user per day
- 🔄 **Resizable Panel** with persistent session memory
- 🧠 **Powered by Google Gemini API** for contextual intelligence

### DevOps & Infra
- ☁️ **AWS Integration** using:
  - EC2 (app hosting)
  - ECR (Docker image storage)
- 🐳 **Dockerized Microservices** with `docker-compose.prod.yml`

### Frontend Highlights
- ⚛️ Built using **React + Vite**
- 💼 **Redux** for global state management
- ✨ **shadcn/ui** + **Tailwind CSS** for UI styling
- 🧠 **Monaco Editor** embedded for code editing

### Upcoming Features
- 👤 **User Profile & Submission History**
- 🧠 **AI Explanation for Failed Test Cases**
- 🧮 **Contest Hosting & Leaderboard System**
- 🛡️ **Enhanced Role-Based Access Control**

---

## 🛠️ Tech Stack

| Layer             | Tech Stack                              |
|------------------|------------------------------------------|
| Frontend          | React, Vite, Redux, Monaco Editor       |
| Backend           | Node.js, Express.js                     |
| Database          | MongoDB (via Mongoose)                  |
| Auth              | JWT (JSON Web Tokens)                   |
| Code Execution    | Docker, Custom Compiler Service         |
| AI Integration    | Google Gemini API                       |
| Styling/UI        | Tailwind CSS, shadcn/ui                 |
| Containerization  | Docker, Docker Compose                  |
| Cloud Deployment  | AWS EC2, ECR                            |

---

## 📂 Project Structure

```bash
OJ_project/
├── frontend/          # React frontend with Redux and Monaco Editor
├── backend/           # Node.js + Express.js API
├── compiler/          # Docker-based isolated code runner
├── docker-compose.yml           # Local dev setup
├── docker-compose.prod.yml      # AWS production deployment
└── .env               # Environment variables
```

---

## 🧪 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/OJ_project.git
cd OJ_project

# 2. Setup environment files
cp .env.example .env

# 3. Start services locally
docker-compose up --build
```

---

## 🌐 Deployment (AWS)

- EC2: Hosts Docker containers (frontend, backend, compiler)
- ECR: Stores Docker images pushed via CI or manual push
- Use `docker-compose.prod.yml` for deploying production builds
- Access via [http://65.2.78.180:3000](http://65.2.78.180:3000)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📃 License

[MIT](LICENSE)

---

Built with passion by Aryav.
