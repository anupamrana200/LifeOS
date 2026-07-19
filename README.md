# 🧠 LifeOS

> **Your AI-powered Second Brain**  
> Organize documents, extract knowledge, chat with your data, and manage your digital life—all in one intelligent workspace.

![Status](https://img.shields.io/badge/Status-Active-success)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![React](https://img.shields.io/badge/React-19-blue)
![Express](https://img.shields.io/badge/Express-5-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

---

## 📖 Overview

LifeOS is an AI-powered personal knowledge management platform that helps users securely store, organize, search, and interact with their digital information.

Instead of manually searching through notes and documents, users can upload files, organize them into collections, and use AI to instantly retrieve meaningful insights through natural conversations.

Built with modern web technologies, LifeOS combines document management, OCR, authentication, and Large Language Models into a single productivity platform.

---

## ✨ Features

### 🔐 Authentication

- Secure User Registration
- JWT Authentication
- Access Token & Refresh Token
- HTTP-Only Cookie Authentication
- Protected Routes
- Automatic Token Refresh

---

### 📂 Document Management

- Upload PDF Documents
- Organize Documents
- Delete Documents
- View Uploaded Files
- Metadata Management

---

### 🤖 AI Assistant

- Chat with Uploaded Documents
- AI-powered Question Answering
- Context-aware Responses
- OpenAI Integration
- Google Gemini Integration
- Switch AI Provider

---

### 📄 OCR Support

- Extract Text from PDFs
- OCR using Tesseract
- Searchable Document Content

---

### 🔎 Search

- Intelligent Document Search
- Fast Retrieval
- AI-assisted Knowledge Discovery

---

### 🎨 Modern UI

- Responsive Design
- Clean Dashboard
- Modern User Experience
- Mobile Friendly

---

## 🏗️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hook Form

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cookie Parser
- Multer

### AI

- OpenAI API
- Google Gemini API

### OCR

- Tesseract OCR
- Poppler

### Deployment

- Oracle Cloud VM
- Ubuntu Server
- Nginx
- PM2
- MongoDB

---

# 📁 Project Structure

```text
LifeOS/
│
├── client/
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/
│   ├── src/
│   ├── uploads/
│   ├── config/
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/LifeOS.git
cd LifeOS
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## Environment Variables

### Client

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Server

```env
PORT=5000

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

OPENAI_API_KEY=
GEMINI_API_KEY=

COOKIE_SAME_SITE=lax
```

---

# 🔒 Authentication Flow

```
User Login
      │
      ▼
Backend verifies credentials
      │
      ▼
Creates Access Token
Creates Refresh Token
      │
      ▼
Stores Tokens in HTTP-Only Cookies
      │
      ▼
Protected APIs verify Access Token
      │
      ▼
Expired?
      │
     Yes
      │
      ▼
Refresh Token generates new Access Token
```

---

# 📸 Screenshots

> Add screenshots of:

- Landing Page
- Login
- Register
- Dashboard
- Document Upload
- AI Chat
- Collections

---

# 🌐 Live Demo

**Application**

```
http://140.245.208.82
```

---

# 🔧 Deployment

The application is deployed using:

- Oracle Cloud VM
- Ubuntu Server
- PM2 Process Manager
- Nginx Reverse Proxy
- MongoDB
- Node.js 22

---

# 🛣️ Future Enhancements

- Email Verification
- Password Reset
- Document Sharing
- Team Workspaces
- Vector Database
- Semantic Search
- AI Memory
- Voice Assistant
- Dark Mode
- Mobile Application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Anupam Rana**

- GitHub: https://github.com/anupamrana200
- LinkedIn: https://www.linkedin.com/in/anupamrana200/

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It motivates further development and helps others discover the project.

---

<p align="center">
Made with ❤️ using React, Node.js, Express, MongoDB & AI
</p>
