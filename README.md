<![CDATA[<div align="center">

# 🚀 Smart Task & Team Management Portal

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A full-stack MERN application for smart task tracking, project organization, and team collaboration — built with modern best practices.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-endpoints) · [Documentation](#-documentation) · [Contributing](#-contributing)

</div>

---

## 📋 Description

The **Smart Task & Team Management Portal** is a production-ready, full-stack web application that empowers teams to organize projects, create and assign tasks, track progress, and collaborate efficiently. Built on the MERN stack (MongoDB, Express.js, React 19, Node.js) with a clean, responsive UI powered by Tailwind CSS and Vite.

Whether you're a solo developer managing personal projects or a team lead coordinating deliverables across multiple workstreams, this portal provides the structure and visibility you need to stay on top of your work.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user registration and login with email/password
- JWT-based authentication with httpOnly cookie storage
- Passwords hashed with bcryptjs (12 salt rounds)
- Persistent sessions with 30-day token expiry
- User profile management with auto-generated avatars

### 📁 Project Management
- Create, edit, and delete projects
- Set project status: **Active**, **Completed**, or **Archived**
- Add team members to projects
- Track start and end dates
- Virtual task count per project

### ✅ Task Management
- Create tasks within projects with rich detail
- Assign tasks to team members
- Set priority levels: **Low**, **Medium**, **High**
- Track status: **To Do**, **In Progress**, **Completed**
- Set due dates for deadline tracking
- Task statistics and analytics dashboard

### 🔍 Search, Filter & Sort
- Filter tasks by status, priority, and assignee
- Filter projects by status
- Search across projects and tasks
- Paginated results for large datasets

### 🎨 UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Dark mode / light mode toggle with class-based switching
- Smooth animations (fade-in, slide-up, float effects)
- Toast notifications for user feedback
- Clean, modern design with Indigo primary color palette

### 🛡️ Security
- Helmet.js for HTTP security headers
- CORS configuration for cross-origin protection
- Rate limiting (100 req/15 min global; 20 req/15 min for auth)
- Input validation with express-validator
- XSS protection via httpOnly cookies
- CSRF prevention with SameSite cookie policy

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.0.0 | UI component library |
| Vite | 5.4.8 | Build tool and dev server |
| Tailwind CSS | 3.4.12 | Utility-first CSS framework |
| React Router DOM | 6.26.2 | Client-side routing |
| Axios | 1.7.7 | HTTP client for API requests |
| React Hook Form | 7.53.0 | Performant form handling |
| React Hot Toast | 2.4.1 | Toast notification system |
| React Icons | 5.3.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.21.0 | Web application framework |
| MongoDB Atlas | — | Cloud database service |
| Mongoose | 8.7.0 | MongoDB ODM |
| JSON Web Token | 9.0.2 | Authentication tokens |
| bcryptjs | 2.4.3 | Password hashing |
| Helmet | 7.1.0 | HTTP security headers |
| express-rate-limit | 7.4.0 | API rate limiting |
| express-validator | 7.2.0 | Request validation |
| Morgan | 1.10.0 | HTTP request logger |
| cookie-parser | 1.4.6 | Cookie parsing middleware |
| CORS | 2.8.5 | Cross-origin resource sharing |

### Dev Tools

| Technology | Version | Purpose |
|---|---|---|
| Concurrently | 9.0.1 | Run server & client simultaneously |
| Nodemon | 3.1.4 | Auto-restart server on changes |
| PostCSS | 8.4.47 | CSS processing |
| Autoprefixer | 10.4.20 | CSS vendor prefixing |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Minimum Version | Check Command |
|---|---|---|
| **Node.js** | 18.0.0+ | `node --version` |
| **npm** | 9.0.0+ | `npm --version` |
| **MongoDB Atlas Account** | — | [Sign up free](https://www.mongodb.com/cloud/atlas) |
| **Git** | 2.0+ | `git --version` |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-task-team-management-portal.git
cd smart-task-team-management-portal
```

### 2. Install All Dependencies

This single command installs dependencies for the root, server, and client:

```bash
npm run install:all
```

> **What this does:** Runs `npm install` at the root level, then in `server/`, then in `client/`.

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory by copying the example:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` with your values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client Origin (for CORS)
CLIENT_URL=http://localhost:5173
```

### 4. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (the free M0 tier works perfectly)
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development)
5. Click **Connect** → **Connect your application** → Copy the connection string
6. Paste the connection string into your `server/.env` file as `MONGO_URI`
7. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

### 5. Run the Application

Start both the backend and frontend simultaneously:

```bash
npm run dev
```

You should see output like:

```
[server] ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
[server] 🚀 Server running on port 5000 in development mode
[client] VITE v5.4.8  ready in 500ms
[client] ➜  Local:   http://localhost:5173/
```

### 6. Open in Browser

Navigate to **[http://localhost:5173](http://localhost:5173)** to access the application.

---

## ⚙️ Environment Variables

All environment variables are configured in `server/.env`:

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Application environment (`development` or `production`) |
| `PORT` | No | `5000` | Port number for the backend server |
| `MONGO_URI` | **Yes** | — | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JSON Web Tokens |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL for CORS configuration |

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and get JWT token | ❌ |
| `POST` | `/auth/logout` | Logout and clear cookie | ✅ |
| `GET` | `/auth/profile` | Get current user profile | ✅ |
| `PUT` | `/auth/profile` | Update user profile | ✅ |

### Projects

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/projects` | Get all projects (with filters) | ✅ |
| `POST` | `/projects` | Create a new project | ✅ |
| `GET` | `/projects/:id` | Get project by ID | ✅ |
| `PUT` | `/projects/:id` | Update a project | ✅ |
| `DELETE` | `/projects/:id` | Delete a project | ✅ |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/tasks` | Get all tasks (with filters) | ✅ |
| `GET` | `/tasks/stats` | Get task statistics | ✅ |
| `POST` | `/tasks` | Create a new task | ✅ |
| `GET` | `/tasks/:id` | Get task by ID | ✅ |
| `PUT` | `/tasks/:id` | Update a task | ✅ |
| `DELETE` | `/tasks/:id` | Delete a task | ✅ |

> 📖 For complete API documentation with request/response examples, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 📂 Folder Structure

```
smart-task-team-management-portal/
├── package.json                  # Root config with concurrently
│
├── server/                       # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication guard
│   │   ├── errorMiddleware.js    # 404 & global error handlers
│   │   └── rateLimiter.js        # Rate limiting (general + auth)
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   ├── Project.js            # Project schema (title, status, members)
│   │   └── Task.js               # Task schema (title, priority, status)
│   ├── routes/                   # Express route definitions
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── projectRoutes.js      # /api/projects/*
│   │   └── taskRoutes.js         # /api/tasks/*
│   ├── controllers/              # Route handler logic
│   │   ├── authController.js     # Auth business logic
│   │   ├── projectController.js  # Project CRUD operations
│   │   └── taskController.js     # Task CRUD + stats
│   ├── utils/
│   │   └── generateToken.js      # JWT token creation + cookie setter
│   ├── server.js                 # Express app entry point
│   ├── package.json              # Server dependencies
│   └── .env                      # Environment variables (not committed)
│
├── client/                       # Frontend (React 19 + Vite)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── layout/           # Header, Sidebar, Footer
│   │   │   ├── auth/             # Login, Register forms
│   │   │   ├── projects/         # Project cards, forms, lists
│   │   │   ├── tasks/            # Task cards, forms, filters
│   │   │   └── common/           # Buttons, Modals, Loaders
│   │   ├── pages/                # Route-level page components
│   │   │   ├── Dashboard.jsx     # Main dashboard view
│   │   │   ├── Projects.jsx      # Projects listing page
│   │   │   ├── ProjectDetail.jsx # Single project + tasks
│   │   │   ├── Tasks.jsx         # Tasks listing page
│   │   │   ├── Profile.jsx       # User profile page
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── context/              # React Context providers
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   └── ThemeContext.jsx  # Dark/light mode state
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # Axios API service layer
│   │   │   └── api.js            # Centralized API calls
│   │   ├── utils/                # Helper functions
│   │   ├── App.jsx               # Root component with routing
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Tailwind CSS imports
│   ├── index.html                # HTML entry point
│   ├── vite.config.js            # Vite configuration with proxy
│   ├── tailwind.config.js        # Tailwind CSS theme config
│   ├── postcss.config.js         # PostCSS configuration
│   └── package.json              # Client dependencies
│
└── docs/                         # Documentation
    ├── API_DOCUMENTATION.md      # Complete API reference
    ├── ARCHITECTURE.md           # System architecture & diagrams
    ├── DEMO_SCRIPT.md            # Demo walkthrough guide
    ├── PRESENTATION.md           # 10-slide presentation
    └── POSTMAN_COLLECTION.json   # Importable Postman collection
```

---

## 📸 Screenshots

<div align="center">

### Login Page
> *The clean, responsive login page with form validation and dark mode support.*

### Dashboard
> *Overview dashboard showing project summaries, task statistics, and recent activity.*

### Project Management
> *Create and manage projects with team members, status tracking, and date ranges.*

### Task Board
> *Task listing with priority badges, status filters, and assignee avatars.*

### Dark Mode
> *Full dark mode support across all pages with smooth transitions.*

### Responsive Design
> *Mobile-optimized layout that works seamlessly across all screen sizes.*

</div>

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/smart-task-team-management-portal.git
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Install** dependencies:
   ```bash
   npm run install:all
   ```
5. **Make** your changes
6. **Test** your changes thoroughly
7. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
8. **Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
9. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactor (no feature or fix) |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Code Guidelines

- Follow existing code style and project structure
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation for new features
- Test on multiple browsers and screen sizes

---

## 📖 Documentation

| Document | Description |
|---|---|
| [API Documentation](docs/API_DOCUMENTATION.md) | Complete REST API reference with examples |
| [Architecture](docs/ARCHITECTURE.md) | System design, diagrams, and patterns |
| [Demo Script](docs/DEMO_SCRIPT.md) | Step-by-step walkthrough guide |
| [Presentation](docs/PRESENTATION.md) | 10-slide project presentation |
| [Postman Collection](docs/POSTMAN_COLLECTION.json) | Import-ready API testing collection |

---

## 📜 Available Scripts

From the **root** directory:

| Command | Description |
|---|---|
| `npm run dev` | Start both server and client concurrently |
| `npm run dev:server` | Start only the backend server (with nodemon) |
| `npm run dev:client` | Start only the frontend dev server |
| `npm run install:all` | Install dependencies for root, server, and client |
| `npm run install:server` | Install server dependencies only |
| `npm run install:client` | Install client dependencies only |
| `npm start` | Start server in production mode |
| `npm run build` | Build the client for production |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Smart Task & Team Management Portal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ using the MERN Stack**

[⬆ Back to Top](#-smart-task--team-management-portal)

</div>
]]>
