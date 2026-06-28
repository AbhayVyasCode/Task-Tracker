# ✅ Task Tracker — Premium MERN Task Management App

A full-stack, production-ready **Task Management** application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Features an Obsidian-themed premium UI with gold accents, real-time task updates, subtask checklists, priority sorting, and full serverless deployment support.

---

## 🌐 Live Demo

| Service    | URL                                      |
|------------|------------------------------------------|
| Frontend   | Deployed on **Vercel**                  |
| Backend API | Deployed on **Netlify Serverless**      |

---

## ✨ Features

- 📋 **Full Task CRUD** — Create, read, update, and delete tasks
- ✅ **Subtask Checklists** — Nested subtasks with real-time completion sync
- 🏷️ **Tag System** — Add multiple tags to organize tasks
- 🔥 **Priority Levels** — Low, Medium, High task prioritization
- 📅 **Due Date Tracking** — Overdue task detection with visual indicators
- 🔎 **Search & Filter** — Real-time search by title, description, or tags
- 📊 **Productivity Index** — Live progress ring showing completion rate
- 🌙 **Obsidian Dark Theme** — Premium UI with champagne gold accents
- 📱 **Responsive Design** — Works seamlessly on all screen sizes
- 🔔 **Toast Notifications** — Elegant success and error feedback
- ⚡ **Serverless Ready** — Backend deployable as Netlify Functions

---

## 🏗️ Project Structure

```
task-traker-colledge-connect/
│
├── backend/                    # Express.js REST API
│   ├── config/                 # MongoDB connection
│   ├── controllers/            # Route handler logic
│   ├── middlewares/            # Validation & error handling
│   ├── models/                 # Mongoose schemas
│   ├── netlify/functions/      # Serverless function wrapper
│   ├── routes/                 # API route definitions
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── seed.js                 # Database seeder
│   └── netlify.toml            # Netlify deployment config
│
└── frontend/                   # Vite + React SPA
    ├── public/                 # Static assets
    ├── src/
    │   ├── components/         # UI components
    │   ├── services/           # API client (fetch wrapper)
    │   ├── App.jsx             # Root app component
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Global design system styles
    └── vercel.json             # Vercel deployment config
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Lucide React | Icon library |
| Vanilla CSS | Styling & animations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js 5 | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose 9 | ODM / schema modeling |
| Serverless HTTP | Netlify function adapter |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or [Bun](https://bun.sh/)
- [MongoDB Atlas](https://cloud.mongodb.com/) account (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-traker-colledge-connect.git
cd task-traker-colledge-connect
```

### 2. Setup & Run the Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your MONGO_URI
npm install
npm run dev
# API is running at http://localhost:5000
```

### 3. Setup & Run the Frontend

```bash
cd frontend
# Create .env with the backend URL
echo "VITE_API_URL=http://localhost:5000/api/tasks" > .env
npm install
npm run dev
# App is running at http://localhost:5173
```

---

## ☁️ Deployment

| Part       | Platform  | Guide |
|------------|-----------|-------|
| **Backend**  | Netlify Serverless | See [`backend/README.md`](./backend/README.md) |
| **Frontend** | Vercel            | See [`frontend/README.md`](./frontend/README.md) |

For a complete step-by-step walkthrough, see the [Deployment Guide](./DEPLOYMENT.md).

---

## 📡 API Endpoints

| Method | Endpoint          | Description            |
|--------|-------------------|------------------------|
| GET    | `/api/tasks`      | Fetch all tasks (with filters) |
| POST   | `/api/tasks`      | Create a new task      |
| GET    | `/api/tasks/:id`  | Get a task by ID       |
| PUT    | `/api/tasks/:id`  | Update a task          |
| DELETE | `/api/tasks/:id`  | Delete a task          |

### Query Parameters (GET `/api/tasks`)

| Param    | Type    | Description                        |
|----------|---------|------------------------------------|
| `search` | string  | Search title or description        |
| `status` | string  | Filter: `pending`, `in-progress`, `completed` |
| `priority` | string | Filter: `low`, `medium`, `high`  |
| `tag`    | string  | Filter by tag name                 |
| `overdue`| boolean | Show only overdue tasks            |
| `sortBy` | string  | Sort by: `createdAt`, `dueDate`, `priority` |
| `order`  | string  | `asc` or `desc`                    |

---

## 👨‍💻 Author

**Abhay** — Full Stack Developer

---

## 📄 License

This project is licensed under the **ISC License**.
