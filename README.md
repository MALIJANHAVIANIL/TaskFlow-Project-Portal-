# 🚀 TaskFlow — Smart Task & Team Management Portal

TaskFlow is a production-ready, full-stack web application designed for task tracking, project organization, and team collaboration. Built with MongoDB, ExpressJS, React 19, and Node.js, featuring a clean, cinematic dark-mode glassmorphic interface styled with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Axios, React Hook Form, React Hot Toast
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Helmet, CORS, Express Validator, Morgan, Cookie Parser
- **Database**: MongoDB Atlas, Mongoose

---

## 🚀 Installation Steps

Follow these steps to run TaskFlow locally on your development machine:

### 1. Clone the Repository
```bash
git clone https://github.com/MALIJANHAVIANIL/TaskFlow-Project-Portal-.git
cd TaskFlow-Project-Portal-
```

### 2. Install All Dependencies
Install dependencies for the root, server, and client concurrently using:
```bash
npm install
npm run install:client
npm run install:server
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
cp server/.env.example server/.env
```
Ensure the environment variables are correctly configured inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow   # Or your MongoDB Atlas connection string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### 4. Start the Application
Run both the frontend and backend servers concurrently:
```bash
npm run dev
```

The application will be hosted at:
- **Frontend client**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API server**: [http://localhost:5000/](http://localhost:5000/)

---

## 🏗️ Architecture

TaskFlow uses a modern three-tier client-server architecture with stateless JWT security:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Tier                           │
│  React 19 SPA (Vite) + Tailwind CSS (Glassmorphism UI)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ (HTTPS/REST + Credentials)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Server                       │
│  Node.js + Express.js API Routing & Security Middleware     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Mongoose ODM)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database Tier                         │
│                    MongoDB Atlas Cloud                      │
└─────────────────────────────────────────────────────────────┘
```

### Key Flows:
1. **Authentication Flow**: Login requests verify credentials, generate a signed JWT (30-day expiration), and set an `httpOnly` cookie with `SameSite=Strict`. Subsequent requests pass this cookie to allow middleware validation.
2. **Data Validation Flow**: Incoming REST payloads are sanitized and validated using `express-validator` schemas before writing to MongoDB.
3. **Responsive State Management**: The React frontend synchronizes authentication state across the DOM using Context Providers (`AuthContext` and `ThemeContext`).

---

## 🗄️ Database Design

TaskFlow uses three interconnected Mongoose collections:

```
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│     User Model    │        │   Project Model   │        │     Task Model    │
├───────────────────┤        ├───────────────────┤        ├───────────────────┤
│ _id (ObjectId)    │◄───────┤ owner (ObjectId)  │◄───────┤ creator(ObjectId) │
│ name (String)     │        │ members (Array)   │        │ assignee(ObjectId)│
│ email (String)    │        │ status (Enum)     │        │ project(ObjectId) │
│ password (String) │        └───────────────────┘        │ priority (Enum)   │
│ avatar (String)   │                                     │ status (Enum)     │
│ role (Enum)       │                                     └───────────────────┘
└───────────────────┘
```

### 1. User Schema (`User.js`)
- `name`: String, required, trim (2-50 chars).
- `email`: String, required, unique, lowercase.
- `password`: String, required, selected false by default.
- `avatar`: String, default generated from UI-Avatars API.
- `role`: String, enum `['admin', 'member']`, default `'member'`.
- Pre-save hook hashes password with `bcryptjs` (12 rounds) on change.

### 2. Project Schema (`Project.js`)
- `title`: String, required, trim (3-100 chars).
- `description`: String, trim (max 500 chars).
- `owner`: ObjectId, ref `'User'`, required.
- `members`: Array of ObjectIds, ref `'User'`.
- `status`: String, enum `['active', 'completed', 'archived']`, default `'active'`.
- `startDate` / `endDate`: Date.

### 3. Task Schema (`Task.js`)
- `title`: String, required, trim (3-100 chars).
- `description`: String, trim (max 1000 chars).
- `project`: ObjectId, ref `'Project'`, required.
- `assignee`: ObjectId, ref `'User'`, optional.
- `creator`: ObjectId, ref `'User'`, required.
- `priority`: String, enum `['low', 'medium', 'high']`, default `'medium'`.
- `status`: String, enum `['todo', 'in-progress', 'completed']`, default `'todo'`.
- `dueDate`: Date.

---

## 📡 API List

Base Endpoint: `http://localhost:5000/api`

### 🔒 Authentication
- `POST /auth/register` — Register a new user account (public)
- `POST /auth/login` — Sign in and retrieve JWT in cookie (public)
- `POST /auth/logout` — Sign out and clear active session cookie (protected)
- `GET /auth/profile` — Get current user information (protected)
- `PUT /auth/profile` — Update username, email, or password (protected)

### 📁 Projects
- `GET /projects` — Retrieve all projects where user is owner or member (protected)
- `POST /projects` — Create a new project workspace (protected)
- `GET /projects/:id` — Retrieve detailed project details and tasks list (protected)
- `PUT /projects/:id` — Update project metadata/members (protected)
- `DELETE /projects/:id` — Delete project and cascade-delete all child tasks (protected)

### ✅ Tasks
- `GET /tasks` — Get paginated, filterable task list (protected)
- `GET /tasks/stats` — Get task counts aggregated by priority, status, and due date (protected)
- `POST /tasks` — Create a new task within a project (protected)
- `GET /tasks/:id` — Get detailed task by ID (protected)
- `PUT /tasks/:id` — Update task status, priority, description, or assignee (protected)
- `DELETE /tasks/:id` — Delete task (protected)

---

## 📝 Assumptions

1. **Local Environment**: MongoDB is assumed to be running on `mongodb://localhost:27017` locally, or populated via MongoDB Atlas.
2. **Access Control**: Users can only view, edit, or create tasks inside projects of which they are either the owner or a listed member.
3. **Stateless JWT**: Sessions are verified via secure signed JSON Web Tokens stored in `httpOnly` cookies to protect against XSS and CSRF.
4. **Theme Preference**: Dark mode is set as the default UI mode, with local storage persisting the user's theme selection.
5. **No Placeholders**: The portal has been built as a complete product with realistic database queries, search/filtering options, and a functional Kanban interface.
