# ⚙️ Task Tracker — Backend API

Express.js REST API for the Task Tracker application. Connects to MongoDB Atlas and supports both traditional Node.js server deployment and **Netlify Serverless Functions**.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | 5.x | REST API framework |
| MongoDB Atlas | — | Cloud NoSQL database |
| Mongoose | 9.x | Schema modeling & ODM |
| serverless-http | 4.x | Netlify function adapter |
| cors | 2.x | Cross-origin requests |
| dotenv | 17.x | Env variable management |
| nodemon | 3.x | Dev auto-restart (dev only) |

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js                   # MongoDB connection logic
├── controllers/
│   └── taskController.js       # Business logic for all task operations
├── middlewares/
│   ├── errorHandler.js         # Global error handling middleware
│   └── validation.js           # Request body validation middleware
├── models/
│   └── Task.js                 # Mongoose Task schema
├── netlify/
│   └── functions/
│       └── api.js              # Serverless function entry point
├── routes/
│   └── taskRoutes.js           # Route definitions
├── .env.example                # Environment variable template
├── app.js                      # Express application setup
├── netlify.toml                # Netlify deployment configuration
├── package.json
├── seed.js                     # Database seeder with sample data
└── server.js                   # Server entry point (local dev)
```

---

## ⚡ Local Development

### 1. Install Dependencies

```bash
# Using npm
npm install

# Or using Bun (faster)
bun install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### 3. Run the Development Server

```bash
# Using npm + nodemon (auto-restarts on change)
npm run dev

# Using Bun with file watcher
bun run bun-dev

# Production start
npm start
```

The API will be available at: **`http://localhost:5000`**

### 4. Seed Sample Data (Optional)

```bash
npm run seed
# or
bun run bun-seed
```

---

## 📡 API Reference

### Base URL (Local)
```
http://localhost:5000/api/tasks
```

### Endpoints

| Method | Route | Middleware | Description |
|--------|-------|------------|-------------|
| `GET` | `/api/tasks` | — | Get all tasks (supports query filters) |
| `POST` | `/api/tasks` | `validateTaskInput` | Create a new task |
| `GET` | `/api/tasks/:id` | — | Get a single task by MongoDB ID |
| `PUT` | `/api/tasks/:id` | `validateTaskInput` | Update a task |
| `DELETE` | `/api/tasks/:id` | — | Delete a task |

### Query Parameters — `GET /api/tasks`

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `search` | `string` | `?search=react` | Searches title and description |
| `status` | `string` | `?status=pending` | `pending`, `in-progress`, `completed` |
| `priority` | `string` | `?priority=high` | `low`, `medium`, `high` |
| `tag` | `string` | `?tag=backend` | Filter by exact tag match |
| `overdue` | `boolean` | `?overdue=true` | Only return overdue tasks |
| `sortBy` | `string` | `?sortBy=priority` | `createdAt`, `dueDate`, `priority` |
| `order` | `string` | `?order=asc` | `asc` or `desc` |

### Task Object Schema

```json
{
  "_id": "64abc...",
  "title": "Build REST API",
  "description": "Set up Express routes with Mongoose",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-07-15T00:00:00.000Z",
  "tags": ["backend", "express"],
  "subtasks": [
    { "_id": "...", "title": "Define routes", "isCompleted": true },
    { "_id": "...", "title": "Write controllers", "isCompleted": false }
  ],
  "isOverdue": false,
  "createdAt": "2026-06-20T10:00:00.000Z",
  "updatedAt": "2026-06-28T08:00:00.000Z"
}
```

---

## ☁️ Deploy to Netlify (Serverless)

The backend is pre-configured for Netlify Serverless Functions via [`netlify.toml`](./netlify.toml) and [`netlify/functions/api.js`](./netlify/functions/api.js).

### Steps

1. Push your code to GitHub.
2. Log in to [Netlify](https://app.netlify.com/) and click **Add New Site → Import from GitHub**.
3. Set the following build options:
   - **Base directory**: `backend`
   - **Build command**: *(leave blank)*
   - **Publish directory**: `backend`
4. Add environment variables:
   ```
   MONGO_URI = mongodb+srv://...
   NODE_ENV  = production
   ```
5. Click **Deploy Site**.

> **Important:** In MongoDB Atlas, set Network Access to `0.0.0.0/0` to allow serverless IP connections.

---

## 🔧 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | — | MongoDB Atlas connection string |
| `PORT` | ❌ | `5000` | Port number for local server |
| `NODE_ENV` | ❌ | `development` | `development` or `production` |
