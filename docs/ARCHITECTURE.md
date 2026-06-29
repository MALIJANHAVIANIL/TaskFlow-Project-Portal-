<![CDATA[# 🏗️ Architecture Documentation

## Smart Task & Team Management Portal

---

## Table of Contents

- [System Overview](#system-overview)
- [High-Level Architecture](#high-level-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [Request Lifecycle](#request-lifecycle)
- [Folder Structure](#folder-structure)
- [Design Patterns](#design-patterns)
- [Security Measures](#security-measures)

---

## System Overview

The Smart Task & Team Management Portal follows a **client-server architecture** built on the MERN stack. The frontend (React SPA) communicates with the backend (Express REST API) over HTTP, and the backend persists data in MongoDB Atlas (cloud-hosted).

```mermaid
graph LR
    subgraph Client["🖥️ Client (Port 5173)"]
        A["React 19 SPA"]
        B["Vite Dev Server"]
    end

    subgraph Server["⚙️ Server (Port 5000)"]
        C["Express.js API"]
        D["Middleware Stack"]
        E["Business Logic"]
    end

    subgraph Database["🗄️ Database"]
        F["MongoDB Atlas"]
    end

    subgraph External["🌐 External"]
        G["ui-avatars.com"]
    end

    A -->|"HTTP/REST (JSON)"| C
    B -->|"Proxy /api → :5000"| C
    C --> D --> E
    E -->|"Mongoose ODM"| F
    A -->|"Avatar URLs"| G

    style Client fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    style Server fill:#dcfce7,stroke:#22c55e,color:#14532d
    style Database fill:#fef3c7,stroke:#f59e0b,color:#78350f
    style External fill:#f3e8ff,stroke:#a855f7,color:#581c87
```

### Key Architecture Decisions

| Decision | Rationale |
|---|---|
| **Monorepo structure** | Single repository with root `package.json` orchestrating both apps via `concurrently` |
| **Vite proxy** | Frontend dev server proxies `/api` requests to backend, avoiding CORS issues in development |
| **JWT in httpOnly cookies** | Secure token storage that prevents XSS attacks; falls back to Authorization header for non-browser clients |
| **Mongoose ODM** | Schema-based modeling provides validation, middleware hooks, and virtuals for MongoDB |
| **Tailwind CSS** | Utility-first approach enables rapid UI development with consistent design tokens |

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        UI["React Components"]
        Router["React Router"]
        Context["Context Providers"]
    end

    subgraph Application["Application Layer"]
        Services["API Services (Axios)"]
        Hooks["Custom Hooks"]
        Forms["React Hook Form"]
    end

    subgraph API["API Layer"]
        Routes["Express Routes"]
        MW["Middleware"]
        Controllers["Controllers"]
        Validators["Validators"]
    end

    subgraph Data["Data Layer"]
        Models["Mongoose Models"]
        DB["MongoDB Atlas"]
    end

    UI --> Router
    Router --> Context
    Context --> Services
    Services --> Hooks
    Forms --> Services

    Services -->|"HTTP Requests"| Routes
    Routes --> MW
    MW --> Controllers
    Controllers --> Validators
    Controllers --> Models
    Models --> DB

    style Presentation fill:#eff6ff,stroke:#3b82f6,color:#1e3a5f
    style Application fill:#f0fdf4,stroke:#22c55e,color:#14532d
    style API fill:#fefce8,stroke:#eab308,color:#713f12
    style Data fill:#fef2f2,stroke:#ef4444,color:#7f1d1d
```

---

## Frontend Architecture

### Component Hierarchy

```mermaid
graph TB
    App["App.jsx"]
    App --> AuthProvider["AuthContext Provider"]
    App --> ThemeProvider["ThemeContext Provider"]

    AuthProvider --> RouterSetup["React Router"]

    RouterSetup --> PublicRoutes["Public Routes"]
    RouterSetup --> ProtectedRoutes["Protected Routes"]

    PublicRoutes --> Login["Login Page"]
    PublicRoutes --> Register["Register Page"]

    ProtectedRoutes --> Layout["Layout Component"]
    Layout --> Header["Header"]
    Layout --> Sidebar["Sidebar"]
    Layout --> MainContent["Main Content Area"]
    Layout --> Footer["Footer"]

    MainContent --> Dashboard["Dashboard"]
    MainContent --> ProjectsPage["Projects Page"]
    MainContent --> ProjectDetail["Project Detail"]
    MainContent --> TasksPage["Tasks Page"]
    MainContent --> Profile["Profile Page"]

    Dashboard --> StatCards["Stat Cards"]
    Dashboard --> RecentTasks["Recent Tasks"]
    Dashboard --> RecentProjects["Recent Projects"]

    ProjectsPage --> ProjectList["Project List"]
    ProjectList --> ProjectCard["Project Card"]
    ProjectsPage --> ProjectForm["Create/Edit Project Form"]

    ProjectDetail --> TaskList["Task List"]
    TaskList --> TaskCard["Task Card"]

    TasksPage --> TaskFilters["Task Filters"]
    TasksPage --> TaskListFull["Task List"]
    TasksPage --> TaskForm["Create/Edit Task Form"]

    style App fill:#818cf8,stroke:#4f46e5,color:#fff
    style Layout fill:#a5b4fc,stroke:#6366f1,color:#fff
    style Dashboard fill:#c7d2fe,stroke:#818cf8,color:#312e81
    style ProjectsPage fill:#c7d2fe,stroke:#818cf8,color:#312e81
    style TasksPage fill:#c7d2fe,stroke:#818cf8,color:#312e81
```

### Frontend Technology Map

| Layer | Technology | Responsibility |
|---|---|---|
| **UI Rendering** | React 19 | Component-based UI with hooks |
| **Routing** | React Router DOM 6 | Client-side navigation with protected routes |
| **State Management** | React Context API | Global auth state and theme state |
| **Forms** | React Hook Form | Performant form handling with validation |
| **HTTP Client** | Axios | API communication with interceptors |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with custom theme |
| **Notifications** | React Hot Toast | User feedback and error messages |
| **Icons** | React Icons | Consistent iconography |
| **Build Tool** | Vite 5 | Fast HMR, build optimization, API proxy |

### State Management Strategy

```mermaid
graph LR
    subgraph Global["Global State (Context)"]
        Auth["AuthContext"]
        Theme["ThemeContext"]
    end

    subgraph Local["Component State (useState)"]
        Forms["Form Data"]
        UI["UI State"]
        Filters["Filter/Search"]
    end

    subgraph Server["Server State"]
        API["API Responses"]
        Cache["Cached Data"]
    end

    Auth -->|"user, token, isAuthenticated"| Components["Components"]
    Theme -->|"darkMode, toggleTheme"| Components
    Forms -->|"input values"| Components
    API -->|"projects, tasks"| Components

    style Global fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    style Local fill:#dcfce7,stroke:#22c55e,color:#14532d
    style Server fill:#fef3c7,stroke:#f59e0b,color:#78350f
```

---

## Backend Architecture

### Request Processing Pipeline

```mermaid
graph LR
    Client["Client Request"] --> Express["Express Server"]
    Express --> Helmet["Helmet (Security Headers)"]
    Helmet --> CORS["CORS"]
    CORS --> RateLimit["Rate Limiter"]
    RateLimit --> Morgan["Morgan (Logger)"]
    Morgan --> CookieParser["Cookie Parser"]
    CookieParser --> JSONParser["JSON Body Parser"]
    JSONParser --> Router["Route Matcher"]

    Router -->|"/api/auth/*"| AuthRoutes["Auth Routes"]
    Router -->|"/api/projects/*"| ProjectRoutes["Project Routes"]
    Router -->|"/api/tasks/*"| TaskRoutes["Task Routes"]
    Router -->|"No match"| NotFound["404 Handler"]

    AuthRoutes --> AuthLimiter["Auth Rate Limiter"]
    AuthLimiter --> AuthMiddleware["Auth Middleware"]
    AuthMiddleware --> Validator["Request Validator"]
    Validator --> Controller["Controller"]

    ProjectRoutes --> AuthMiddleware2["Auth Middleware"]
    AuthMiddleware2 --> Controller2["Controller"]

    TaskRoutes --> AuthMiddleware3["Auth Middleware"]
    AuthMiddleware3 --> Controller3["Controller"]

    Controller --> Model["Mongoose Model"]
    Controller2 --> Model
    Controller3 --> Model
    Model --> MongoDB["MongoDB Atlas"]

    Controller -->|"Response"| ErrorHandler["Error Handler"]
    ErrorHandler --> Client

    style Client fill:#e0e7ff,stroke:#6366f1,color:#312e81
    style Express fill:#dcfce7,stroke:#22c55e,color:#14532d
    style MongoDB fill:#fef3c7,stroke:#f59e0b,color:#78350f
```

### Middleware Stack (in order)

| Order | Middleware | Purpose |
|---|---|---|
| 1 | `helmet()` | Sets secure HTTP response headers |
| 2 | `cors()` | Configures Cross-Origin Resource Sharing |
| 3 | `generalLimiter` | Rate limits all routes (100 req/15 min) |
| 4 | `morgan('dev')` | Logs HTTP requests in development |
| 5 | `cookieParser()` | Parses cookies from request headers |
| 6 | `express.json()` | Parses JSON request bodies |
| 7 | Route-specific `authLimiter` | Stricter rate limit for auth routes (20 req/15 min) |
| 8 | Route-specific `protect` | Verifies JWT and attaches user to request |
| 9 | `notFound` | Catches undefined routes → 404 |
| 10 | `errorHandler` | Global error handler → consistent JSON response |

---

## Database Design

### Entity-Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name "2-50 chars, required"
        String email "unique, required"
        String password "hashed, min 6 chars"
        String avatar "auto-generated URL"
        String role "admin | member"
        Date createdAt
        Date updatedAt
    }

    PROJECT {
        ObjectId _id PK
        String title "3-100 chars, required"
        String description "max 500 chars"
        ObjectId owner FK "ref: User, required"
        String status "active | completed | archived"
        Date startDate
        Date endDate
        Date createdAt
        Date updatedAt
    }

    TASK {
        ObjectId _id PK
        String title "3-100 chars, required"
        String description "max 1000 chars"
        ObjectId project FK "ref: Project, required"
        ObjectId assignee FK "ref: User"
        ObjectId creator FK "ref: User, required"
        String priority "low | medium | high"
        String status "todo | in-progress | completed"
        Date dueDate
        Date createdAt
        Date updatedAt
    }

    USER ||--o{ PROJECT : "owns"
    USER }o--o{ PROJECT : "is member of"
    PROJECT ||--o{ TASK : "contains"
    USER ||--o{ TASK : "creates"
    USER ||--o{ TASK : "is assigned"
```

### Model Details

#### User Model

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `name` | String | Required, 2–50 chars, trimmed | Used to generate avatar URL |
| `email` | String | Required, unique, lowercase, regex-validated | Used for login |
| `password` | String | Required, min 6 chars, `select: false` | Hashed with bcryptjs (12 rounds) |
| `avatar` | String | Auto-generated | Generated from `ui-avatars.com` on save |
| `role` | String | Enum: `admin`, `member` | Default: `member` |

**Pre-save Hooks:**
1. Auto-generates avatar URL from user's name via `ui-avatars.com`
2. Hashes password with bcryptjs (12 salt rounds) if modified

**Instance Methods:**
- `matchPassword(candidatePassword)` — Compares plain-text password against stored hash

#### Project Model

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `title` | String | Required, 3–100 chars, trimmed | — |
| `description` | String | Max 500 chars, trimmed | Default: `""` |
| `owner` | ObjectId → User | Required | The user who created the project |
| `members` | ObjectId[] → User | — | Array of team member references |
| `status` | String | Enum: `active`, `completed`, `archived` | Default: `active` |
| `startDate` | Date | — | Optional project start date |
| `endDate` | Date | — | Optional project end date |

**Indexes:** `{ owner: 1 }`, `{ status: 1 }`, `{ owner: 1, status: 1 }`

**Virtuals:** `taskCount` — Count of tasks with matching `project` field

#### Task Model

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `title` | String | Required, 3–100 chars, trimmed | — |
| `description` | String | Max 1000 chars, trimmed | Default: `""` |
| `project` | ObjectId → Project | Required | The project this task belongs to |
| `assignee` | ObjectId → User | — | The user assigned to complete the task |
| `creator` | ObjectId → User | Required | The user who created the task |
| `priority` | String | Enum: `low`, `medium`, `high` | Default: `medium` |
| `status` | String | Enum: `todo`, `in-progress`, `completed` | Default: `todo` |
| `dueDate` | Date | — | Optional deadline |

**Indexes:** `{ project: 1 }`, `{ assignee: 1 }`, `{ status: 1 }`, `{ priority: 1 }`, `{ project: 1, status: 1 }`, `{ assignee: 1, status: 1 }`

---

## Authentication Flow

### Registration Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as React Client
    participant API as Express API
    participant DB as MongoDB

    User->>Client: Fill registration form
    Client->>Client: Validate with React Hook Form
    Client->>API: POST /api/auth/register
    API->>API: Validate input (express-validator)
    API->>DB: Check if email exists
    DB-->>API: No existing user

    API->>API: Create User document
    Note over API: Pre-save hook: generate avatar
    Note over API: Pre-save hook: hash password (bcrypt 12 rounds)
    API->>DB: Save User
    DB-->>API: User saved

    API->>API: Generate JWT (30-day expiry)
    API->>API: Set httpOnly cookie
    API-->>Client: 201 { user, token }

    Client->>Client: Store user in AuthContext
    Client->>Client: Redirect to Dashboard
    Client-->>User: Dashboard displayed
```

### Login Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as React Client
    participant API as Express API
    participant DB as MongoDB

    User->>Client: Enter email & password
    Client->>API: POST /api/auth/login
    API->>DB: Find user by email (include password)
    DB-->>API: User document

    API->>API: bcrypt.compare(password, hash)
    Note over API: Returns true if match

    API->>API: Generate JWT (30-day expiry)
    API->>API: Set httpOnly cookie
    API-->>Client: 200 { user, token }

    Client->>Client: Store user in AuthContext
    Client->>Client: Redirect to Dashboard
```

### Authenticated Request Flow

```mermaid
sequenceDiagram
    participant Client as React Client
    participant MW as Auth Middleware
    participant API as Controller
    participant DB as MongoDB

    Client->>MW: GET /api/projects (with cookie/header)
    MW->>MW: Extract token from cookie or header
    MW->>MW: jwt.verify(token, JWT_SECRET)
    MW->>DB: User.findById(decoded.id)
    DB-->>MW: User document (no password)
    MW->>MW: Attach user to req.user
    MW->>API: next()

    API->>DB: Query with user context
    DB-->>API: Results
    API-->>Client: 200 { success, data }
```

---

## Request Lifecycle

A typical API request passes through the following stages:

```mermaid
graph TB
    A["1. HTTP Request Received"] --> B["2. Helmet (Security Headers)"]
    B --> C["3. CORS Check"]
    C --> D["4. Rate Limit Check"]
    D -->|"Exceeded"| D1["429 Too Many Requests"]
    D -->|"OK"| E["5. Morgan Logger"]
    E --> F["6. Cookie Parser"]
    F --> G["7. JSON Body Parser"]
    G --> H["8. Route Matching"]

    H -->|"No Match"| H1["404 Not Found"]
    H -->|"Match"| I["9. Auth Middleware"]

    I -->|"No Token"| I1["401 Unauthorized"]
    I -->|"Invalid Token"| I2["401 Token Invalid"]
    I -->|"Valid"| J["10. Controller Logic"]

    J -->|"Validation Error"| J1["400 Bad Request"]
    J -->|"Not Found"| J2["404 Not Found"]
    J -->|"Forbidden"| J3["403 Forbidden"]
    J -->|"Success"| K["11. Response Sent"]
    J -->|"Server Error"| L["12. Error Handler"]
    L --> K

    style A fill:#818cf8,stroke:#4f46e5,color:#fff
    style K fill:#22c55e,stroke:#16a34a,color:#fff
    style D1 fill:#ef4444,stroke:#dc2626,color:#fff
    style H1 fill:#ef4444,stroke:#dc2626,color:#fff
    style I1 fill:#ef4444,stroke:#dc2626,color:#fff
    style I2 fill:#ef4444,stroke:#dc2626,color:#fff
    style J1 fill:#f59e0b,stroke:#d97706,color:#fff
    style J2 fill:#f59e0b,stroke:#d97706,color:#fff
    style J3 fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## Folder Structure

### Backend (`server/`)

```
server/
├── config/
│   └── db.js                    # MongoDB connection using Mongoose
│                                  - Reads MONGO_URI from env
│                                  - Logs connection status
│                                  - Exits process on failure
│
├── middleware/
│   ├── authMiddleware.js        # JWT verification guard
│   │                              - Checks cookies → then Authorization header
│   │                              - Verifies token and attaches req.user
│   │                              - Returns 401 on failure
│   │
│   ├── errorMiddleware.js       # Error handling
│   │                              - notFound: catches 404 for undefined routes
│   │                              - errorHandler: consistent JSON error responses
│   │                              - Stack trace only in development
│   │
│   └── rateLimiter.js           # Rate limiting
│                                  - generalLimiter: 100 req / 15 min (all routes)
│                                  - authLimiter: 20 req / 15 min (login/register)
│
├── models/
│   ├── User.js                  # User schema + password hashing + avatar generation
│   ├── Project.js               # Project schema + virtuals + indexes
│   └── Task.js                  # Task schema + indexes for query optimization
│
├── routes/                      # Express route definitions
│   ├── authRoutes.js            # /api/auth/*
│   ├── projectRoutes.js         # /api/projects/*
│   └── taskRoutes.js            # /api/tasks/*
│
├── controllers/                 # Business logic separated from routes
│   ├── authController.js        # register, login, logout, getProfile, updateProfile
│   ├── projectController.js     # CRUD operations for projects
│   └── taskController.js        # CRUD operations + stats for tasks
│
├── utils/
│   └── generateToken.js         # JWT creation + httpOnly cookie setter
│
├── server.js                    # Application entry point
│                                  - Loads env vars, connects DB
│                                  - Mounts middleware stack
│                                  - Mounts routes, starts listening
│
├── package.json                 # Server dependencies
└── .env                         # Environment variables (not committed)
```

### Frontend (`client/`)

```
client/
├── public/                      # Static assets served as-is
│
├── src/
│   ├── components/              # Reusable UI building blocks
│   │   ├── layout/              # Structural components (Header, Sidebar, Footer)
│   │   ├── auth/                # Authentication forms
│   │   ├── projects/            # Project-related components
│   │   ├── tasks/               # Task-related components
│   │   └── common/              # Shared components (Button, Modal, Loader, etc.)
│   │
│   ├── pages/                   # Route-level page components
│   │   ├── Dashboard.jsx        # Overview with stats and recent items
│   │   ├── Projects.jsx         # Project listing with CRUD
│   │   ├── ProjectDetail.jsx    # Single project with its tasks
│   │   ├── Tasks.jsx            # Task listing with filters
│   │   ├── Profile.jsx          # User profile management
│   │   ├── Login.jsx            # Login page
│   │   └── Register.jsx         # Registration page
│   │
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.jsx      # Auth state: user, login, logout, register
│   │   └── ThemeContext.jsx     # Theme state: darkMode, toggle
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   │   └── api.js               # Axios instance with base URL and interceptors
│   │
│   ├── utils/                   # Helper/utility functions
│   ├── App.jsx                  # Root component with routing setup
│   ├── main.jsx                 # Entry point — renders App to DOM
│   └── index.css                # Tailwind directives (@tailwind base, etc.)
│
├── index.html                   # HTML shell
├── vite.config.js               # Vite config with API proxy to :5000
├── tailwind.config.js           # Tailwind theme with custom colors & animations
├── postcss.config.js            # PostCSS plugins (Tailwind + Autoprefixer)
└── package.json                 # Client dependencies
```

---

## Design Patterns

### Patterns Used

| Pattern | Where | Description |
|---|---|---|
| **MVC (Model-View-Controller)** | Backend | Models define data, Controllers handle logic, Routes map URLs |
| **Middleware Chain** | Backend | Express middleware pipeline for cross-cutting concerns |
| **Repository Pattern** | Models | Mongoose models abstract database operations |
| **Context Provider** | Frontend | React Context for global state (auth, theme) |
| **Container/Presentational** | Frontend | Pages (containers) manage state; Components render UI |
| **Service Layer** | Frontend | `services/api.js` centralizes all HTTP communication |
| **Hook Composition** | Frontend | Custom hooks encapsulate reusable logic |
| **Proxy Pattern** | Dev Setup | Vite proxies `/api` to backend, abstracting the server URL |
| **Factory Pattern** | Backend | `generateToken()` encapsulates JWT creation and cookie setup |
| **Observer Pattern** | Frontend | React state changes trigger re-renders automatically |

### Separation of Concerns

```mermaid
graph LR
    subgraph Frontend["Frontend Layers"]
        Pages["Pages (State + Logic)"]
        Components["Components (UI)"]
        Services["Services (API Calls)"]
        ContextProviders["Context (Global State)"]
    end

    subgraph Backend["Backend Layers"]
        RoutesLayer["Routes (URL Mapping)"]
        MiddlewareLayer["Middleware (Cross-cutting)"]
        ControllersLayer["Controllers (Business Logic)"]
        ModelsLayer["Models (Data + Validation)"]
    end

    Pages --> Components
    Pages --> Services
    Pages --> ContextProviders
    Services -->|"HTTP"| RoutesLayer
    RoutesLayer --> MiddlewareLayer
    MiddlewareLayer --> ControllersLayer
    ControllersLayer --> ModelsLayer

    style Frontend fill:#eff6ff,stroke:#3b82f6,color:#1e3a5f
    style Backend fill:#f0fdf4,stroke:#22c55e,color:#14532d
```

---

## Security Measures

### Defense-in-Depth Strategy

The application implements multiple layers of security:

```mermaid
graph TB
    subgraph Layer1["Layer 1: Transport"]
        HTTPS["HTTPS (Production)"]
        CORS["CORS Whitelist"]
    end

    subgraph Layer2["Layer 2: Rate Limiting"]
        General["General: 100 req / 15 min"]
        Auth["Auth: 20 req / 15 min"]
    end

    subgraph Layer3["Layer 3: HTTP Headers"]
        HelmetSec["Helmet.js"]
        CSP["Content Security Policy"]
        HSTS["Strict Transport Security"]
        XFrame["X-Frame-Options"]
    end

    subgraph Layer4["Layer 4: Authentication"]
        JWT["JWT Verification"]
        HttpOnly["httpOnly Cookies"]
        SameSite["SameSite: strict"]
        BCrypt["bcrypt (12 rounds)"]
    end

    subgraph Layer5["Layer 5: Input Validation"]
        ExpressVal["express-validator"]
        MongooseVal["Mongoose Schema Validation"]
        Sanitize["Input Trimming + Sanitization"]
    end

    subgraph Layer6["Layer 6: Data Protection"]
        SelectFalse["Password select: false"]
        NoStack["No stack traces in production"]
        EnvVars["Secrets in env variables"]
    end

    Layer1 --> Layer2 --> Layer3 --> Layer4 --> Layer5 --> Layer6

    style Layer1 fill:#fee2e2,stroke:#ef4444,color:#7f1d1d
    style Layer2 fill:#fef3c7,stroke:#f59e0b,color:#78350f
    style Layer3 fill:#dcfce7,stroke:#22c55e,color:#14532d
    style Layer4 fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f
    style Layer5 fill:#e0e7ff,stroke:#6366f1,color:#312e81
    style Layer6 fill:#f3e8ff,stroke:#a855f7,color:#581c87
```

### Security Feature Summary

| Feature | Implementation | Threat Mitigated |
|---|---|---|
| **Password Hashing** | bcryptjs with 12 salt rounds | Password theft from database breach |
| **JWT httpOnly Cookies** | `httpOnly: true` flag on cookie | XSS-based token theft |
| **SameSite Cookies** | `sameSite: 'strict'` | Cross-Site Request Forgery (CSRF) |
| **Secure Cookies** | `secure: true` in production | Token interception over HTTP |
| **Helmet.js** | Default security headers | Various HTTP-level attacks |
| **CORS** | Whitelisted origins only | Unauthorized cross-origin requests |
| **Rate Limiting (General)** | 100 requests per 15 min per IP | DoS and abuse |
| **Rate Limiting (Auth)** | 20 requests per 15 min per IP | Brute-force login attempts |
| **Input Validation** | express-validator + Mongoose schemas | Injection attacks, invalid data |
| **Password Exclusion** | `select: false` on password field | Accidental password exposure in queries |
| **Error Sanitization** | Stack traces hidden in production | Information disclosure |
| **Environment Variables** | `.env` file for secrets | Hardcoded credentials in source code |

---

*Last updated: June 2024*
]]>
