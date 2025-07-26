# 👨‍💻 Codeon - MERN Online Judge

A scalable, full-stack Online Judge platform built with the MERN stack. It features real-time code execution, secure Docker-based sandboxing, and intelligent AI-powered debugging tools—all hosted on AWS infrastructure.

**🌐 Live Platform**: [https://codeon.co.in](https://codeon.co.in)

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

### DevOps & Infrastructure
- ☁️ **AWS Integration** using:
  - EC2 (application hosting)
  - ECR (Docker image storage)
- 🐳 **Dockerized Microservices** with production deployment
- 🔒 **SSL/HTTPS** with Let's Encrypt certificates
- 🌐 **Custom Domain** with DNS configuration
- ⚙️ **Nginx Reverse Proxy** for load balancing and routing

### Frontend Highlights
- ⚛️ Built using **React + Vite**
- 💼 **Redux** for global state management
- ✨ **shadcn/ui** + **Tailwind CSS** for modern UI styling
- 🧠 **Monaco Editor** embedded for professional code editing
- 🌙 **Dark/Light Theme** support

### Upcoming Features
- 👤 **User Profile & Submission History**
- 🧠 **AI Explanation for Failed Test Cases**
- 🧮 **Contest Hosting & Leaderboard System**
- 🛡️ **Enhanced Role-Based Access Control**
- 📊 **Analytics Dashboard** for problem-solving insights

---

## 🛠️ Tech Stack

| Layer             | Technologies                             |
|------------------|------------------------------------------|
| Frontend          | React, Vite, Redux, Monaco Editor       |
| Backend           | Node.js, Express.js                     |
| Database          | MongoDB (via Mongoose)                  |
| Authentication    | JWT (JSON Web Tokens)                   |
| Code Execution    | Docker, Custom Compiler Service         |
| AI Integration    | Google Gemini API                       |
| Styling/UI        | Tailwind CSS, shadcn/ui                 |
| Containerization  | Docker, Docker Compose                  |
| Cloud Deployment  | AWS EC2, ECR                            |
| Web Server        | Nginx (Reverse Proxy)                   |
| SSL/Security      | Let's Encrypt, HTTPS                    |

---

## 📂 Project Structure

```bash
OJ_project/
├── frontend/                    # React frontend with Redux and Monaco Editor
├── backend/                     # Node.js + Express.js API
├── compiler/                    # Docker-based isolated code runner
├── docker-compose.yml           # Local development setup
├── docker-compose.prod.yml      # AWS production deployment
└── .env                         # Environment variables
```

---

## 🧪 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/OJ_project.git
cd OJ_project

# 2. Setup environment files
cp .env.example .env
# Update .env with your configuration

# 3. Start services locally
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Compiler Service: http://localhost:5001
```

---

## 🌐 Production Deployment

### AWS Infrastructure
- **EC2 Instance**: Hosts all Docker containers
- **ECR Repository**: Stores Docker images
- **SSL Certificates**: Let's Encrypt for HTTPS
- **Domain**: Custom domain with DNS configuration
- **Nginx**: Reverse proxy for routing and load balancing

### Deployment Process
```bash
# 1. Build and push images to ECR
docker build -t your-ecr-repo/frontend:latest ./frontend
docker push your-ecr-repo/frontend:latest

# 2. Deploy on EC2
docker compose -f docker-compose.prod.yml --env-file .env up -d

# 3. Configure Nginx and SSL
sudo certbot --nginx -d yourdomain.com
```

---

## 🚀 Key Achievements

- ✅ **Full-Stack Application** with modern tech stack
- ✅ **Microservices Architecture** using Docker
- ✅ **Cloud Deployment** on AWS infrastructure
- ✅ **AI Integration** for intelligent code assistance
- ✅ **Real-time Code Execution** with multiple languages
- ✅ **Production-Ready** with SSL and custom domain
- ✅ **Scalable Design** for future enhancements

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📃 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Built with passion by Aryav**

- 🌐 **Live Demo**: [https://codeon.co.in](https://codeon.co.in)

---

*⭐ If you found this project helpful, please give it a star on GitHub!*