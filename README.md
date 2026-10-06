<div align="center">
  <img src="assets/banner.png" alt="CodeSync Banner" width="100%">
</div>

<div align="center">

# CodeSync

### Real-time Collaborative Code Editor

**[🔗 Live Demo](https://code-sync-jnzj.vercel.app)** &nbsp;|&nbsp; **[📦 Backend API](https://codesync-backend-gur0.onrender.com/api/health)**

<p>
  <img src="https://img.shields.io/github/stars/Harsh-128/CodeSync?style=for-the-badge" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/Harsh-128/CodeSync?style=for-the-badge" alt="Forks"/>
  <img src="https://img.shields.io/github/issues/Harsh-128/CodeSync?style=for-the-badge" alt="Issues"/>
  <img src="https://img.shields.io/github/last-commit/Harsh-128/CodeSync?style=for-the-badge" alt="Last Commit"/>
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 🚀 Live Demo

> **Try it now → [https://code-sync-jnzj.vercel.app](https://code-sync-jnzj.vercel.app)**

1. Sign up for a free account
2. Create a room or join with a Room ID
3. Share the room link with a friend
4. Code together in real-time!

---

## ✨ Features

| Feature | Description |
|---|---|
| 👥 **Live Collaboration** | Multiple users code in the same room simultaneously |
| ⚡ **Real-time Sync** | Code changes sync instantly via Socket.IO WebSockets |
| 🖱️ **Live Cursors** | See every collaborator's cursor with colored name labels |
| ▶️ **Code Execution** | Run C++, Python, JavaScript, Java directly in the browser |
| 💬 **Live Chat** | Built-in chat panel with Enter-to-send |
| 🔐 **JWT Auth** | Secure signup/login with 7-day token expiry |
| 🎨 **VS Code Layout** | Monaco editor with themes, syntax highlighting, bracket pairs |
| 📱 **Invite Links** | Share room links — friends join with one click |
| 📜 **Execution History** | Last 10 runs saved per room |
| 🌙 **Dark IDE Theme** | Full-screen IDE layout, no scrolling |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Monaco Editor, Socket.IO Client |
| **Backend** | Node.js 22, Express 5, Socket.IO 4 |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Execution** | Local compilers — g++ (C++17), Python 3, Java 21, Node.js |
| **Deployment** | Vercel (frontend), Render Docker (backend), MongoDB Atlas |

---

## 📂 Project Structure

```
CodeSync/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Navbar, CodeEditor, ChatPanel, UsersPanel...
│   │   ├── pages/           # Home, Room, Login, Signup, Profile
│   │   ├── services/        # API (axios), Auth helpers
│   │   └── styles/          # room.css, auth.css
│   └── package.json
│
└── server/                  # Node.js + Express backend
    ├── controllers/         # auth, room, code execution, history
    ├── models/              # User, Room, RoomHistory (Mongoose)
    ├── routes/              # authRoutes, roomRoutes, codeRoutes...
    ├── socket/              # socketHandler (real-time events)
    ├── Dockerfile           # Docker with g++, python3, java
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas URI
- g++ (for C++ execution)
- Python 3
- Java JDK

### Clone & Install

```bash
git clone https://github.com/Harsh-128/CodeSync.git
cd CodeSync

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Configure Environment

Create `server/.env` (copy from `server/.env.example`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/codesync
JWT_SECRET=your_long_random_secret_here
PORT=3000
CLIENT_URL=http://localhost:5173
```

### Run Locally

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open **http://localhost:5173**

---

## 🚢 Deployment

| Service | Purpose | URL |
|---|---|---|
| Vercel | Frontend hosting | https://code-sync-jnzj.vercel.app |
| Render | Backend (Docker) | https://codesync-backend-gur0.onrender.com |
| MongoDB Atlas | Database | AWS Mumbai |

> **Note:** Render free tier sleeps after 15 min of inactivity. First request after sleep takes ~30s to wake up.

---

## 📸 Screenshots

### 🏠 Home Page
<img src="screenshots/home.png" width="900">

### 🚪 Room — Live Collaboration
<img src="screenshots/room.png" width="900">

### 💬 Chat
<img src="screenshots/chat.png" width="900">

---

## 👨‍💻 Author

**Harsh Sharma**
- GitHub: [@Harsh-128](https://github.com/Harsh-128)

---

<div align="center">

If you found this useful, please give it a ⭐ on GitHub!

</div>
