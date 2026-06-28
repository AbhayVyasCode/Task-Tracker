# 🎨 Task Tracker — Frontend Client

Premium Vite + React 19 single-page application for the Task Tracker project. Features an **Obsidian dark theme** with champagne gold accents, smooth micro-animations, real-time task management, and a fully responsive layout.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool & HMR dev server |
| Lucide React | 1.x | Premium icon library |
| Vanilla CSS | — | Design system & animations |

---

## 📁 Folder Structure

```
frontend/
├── public/
│   └── favicon.svg             # App favicon
├── src/
│   ├── components/
│   │   ├── GlassCard.jsx       # Reusable Obsidian panel wrapper
│   │   ├── Header.jsx          # Top dashboard header with greeting
│   │   ├── Sidebar.jsx         # Collapsible navigation sidebar
│   │   ├── TaskCard.jsx        # Individual task card with subtasks
│   │   ├── TaskModal.jsx       # Create/Edit task modal dialog
│   │   └── Toast.jsx           # Success/error toast notification
│   ├── services/
│   │   └── api.js              # Fetch-based API client
│   ├── App.jsx                 # Root component with state management
│   ├── index.css               # Global CSS design system
│   └── main.jsx                # React DOM entry point
├── index.html                  # HTML shell
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel SPA rewrite rules
└── package.json
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

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api/tasks
```

> Make sure the backend server is running on `localhost:5000` before starting the frontend.

### 3. Start the Dev Server

```bash
npm run dev
# App runs at http://localhost:5173
```

### 4. Build for Production

```bash
npm run build
# Output is generated in the dist/ folder
```

### 5. Preview Production Build Locally

```bash
npm run preview
# Serves the dist/ build at http://localhost:4173
```

---

## 🎨 Design System

The UI is built with a custom **Obsidian & Champagne Gold** design system defined entirely in [`src/index.css`](./src/index.css).

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-app` | `#09090b` | Main background (Obsidian black) |
| `--bg-panel` | `#111113` | Panel/card backgrounds |
| `--bg-elevated` | `#18181b` | Elevated surfaces, modals |
| `--accent-gold` | `#d9941e` | Primary gold accent |
| `--accent-gold-light` | `#e5a93b` | Hover states, active items |
| `--text-primary` | `#fafafa` | Primary readable text |
| `--text-secondary` | `#a1a1aa` | Secondary / supporting text |
| `--text-muted` | `#52525b` | Muted / placeholder text |
| `--status-green` | `#10b981` | Completed task status |
| `--status-blue` | `#3b82f6` | In-progress task status |
| `--status-amber` | `#f59e0b` | Pending task status |
| `--status-red` | `#ef4444` | Overdue / error states |

### Typography

- **Heading Font**: `Outfit` (Google Fonts) — Bold, modern
- **Body Font**: `Inter` (Google Fonts) — Clean, readable

---

## 🧩 Components

### `TaskCard.jsx`
Displays a single task with:
- Status checkbox toggle
- Priority badge with color coding
- Subtask progress bar + checklist (expanded by default)
- Due date display with overdue detection
- Tag pills
- Edit and delete actions

### `TaskModal.jsx`
A full-featured create/edit modal with:
- Title, description, status, priority fields
- Date picker for due date
- Tag input with chip-style display
- Dynamic subtask builder
- Field-level validation with error messages

### `Sidebar.jsx`
Collapsible navigation panel with:
- Brand logo and "Task Tracker" name
- Filter navigation: All Tasks, In Progress, Completed, High Priority, Overdue
- Live task count badges
- Productivity ring with percentage index
- Keyboard shortcut: `Ctrl+B` to toggle collapse

### `Header.jsx`
Top dashboard bar with:
- Dynamic greeting by time of day (Good morning/afternoon/evening, Abhay)
- Active task count summary

### `Toast.jsx`
Auto-dismissing notifications (4s timeout) with:
- ✅ Success (green) and ❌ Error (red) variants
- Dismiss button

### `GlassCard.jsx`
Reusable obsidian panel wrapper that applies the base `obsidian-panel` class and forwards all props/styles.

---

## ☁️ Deploy to Vercel

The frontend is pre-configured for Vercel via [`vercel.json`](./vercel.json) which handles SPA routing (rewrites all paths to `index.html` to prevent 404s on refresh).

### Steps

1. Push your code to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New → Project**.
3. Import your GitHub repository.
4. Set the following configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add the environment variable:
   ```
   VITE_API_URL = https://your-backend.netlify.app
   ```
   *(Replace with your actual deployed Netlify backend URL)*
6. Click **Deploy**.

> **Note:** Do NOT include a trailing slash in `VITE_API_URL`.

---

## 🔧 Environment Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ | `http://localhost:5000/api/tasks` | Full URL to the backend API tasks endpoint |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite HMR development server |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run OXLint static code analysis |
