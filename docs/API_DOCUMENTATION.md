<![CDATA[# 📡 API Documentation

## Smart Task & Team Management Portal — REST API Reference

**Base URL:** `http://localhost:5000/api`

**Content-Type:** `application/json`

---

## Table of Contents

- [Overview](#overview)
- [Authentication Mechanism](#authentication-mechanism)
- [Error Response Format](#error-response-format)
- [Rate Limiting](#rate-limiting)
- [Auth Endpoints](#auth-endpoints)
  - [Register](#1-register)
  - [Login](#2-login)
  - [Logout](#3-logout)
  - [Get Profile](#4-get-profile)
  - [Update Profile](#5-update-profile)
- [Project Endpoints](#project-endpoints)
  - [Get All Projects](#1-get-all-projects)
  - [Create Project](#2-create-project)
  - [Get Project by ID](#3-get-project-by-id)
  - [Update Project](#4-update-project)
  - [Delete Project](#5-delete-project)
- [Task Endpoints](#task-endpoints)
  - [Get All Tasks](#1-get-all-tasks)
  - [Get Task Stats](#2-get-task-stats)
  - [Create Task](#3-create-task)
  - [Get Task by ID](#4-get-task-by-id)
  - [Update Task](#5-update-task)
  - [Delete Task](#6-delete-task)

---

## Overview

The API follows RESTful conventions and returns JSON responses. All successful responses include `"success": true` and all error responses include `"success": false` with a descriptive message.

### Common Response Structure

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Success Response (with pagination):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## Authentication Mechanism

The API uses **JSON Web Tokens (JWT)** for authentication. Tokens are valid for **30 days**.

### How It Works

1. **Register** or **Login** to receive a JWT
2. The token is automatically set as an **httpOnly cookie** named `token`
3. Alternatively, include the token in the **Authorization header**

### Token Delivery

The server delivers the JWT in two ways simultaneously:

| Method | Details |
|---|---|
| **httpOnly Cookie** | Set automatically on login/register. Sent with every subsequent request. Secure, not accessible via JavaScript. |
| **Response Body** | Returned in the JSON response for clients that need to store the token manually. |

### Using the Token

**Option 1 — Automatic (Cookie):**
Cookies are sent automatically by the browser. No additional headers needed.

**Option 2 — Manual (Authorization Header):**
```
Authorization: Bearer <your_jwt_token>
```

### Token Verification Flow

1. Server checks for token in cookies first (`req.cookies.token`)
2. If not found, falls back to the `Authorization` header (`Bearer <token>`)
3. Token is verified using the `JWT_SECRET` environment variable
4. The authenticated user (without password) is attached to `req.user`
5. If no token or invalid token, returns `401 Unauthorized`

### Cookie Configuration

| Property | Value | Purpose |
|---|---|---|
| `maxAge` | 30 days | Token lifetime |
| `httpOnly` | `true` | Prevents XSS attacks |
| `secure` | `true` in production | HTTPS only in production |
| `sameSite` | `strict` | Prevents CSRF attacks |

---

## Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "... (only in development mode)"
}
```

### Common HTTP Status Codes

| Code | Meaning | When Used |
|---|---|---|
| `200` | OK | Successful GET, PUT requests |
| `201` | Created | Successful POST (resource created) |
| `400` | Bad Request | Validation errors, malformed request |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Not allowed to access this resource |
| `404` | Not Found | Resource doesn't exist or route undefined |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

---

## Rate Limiting

The API implements two levels of rate limiting:

| Limiter | Scope | Limit | Window | Response on Exceed |
|---|---|---|---|---|
| **General** | All routes | 100 requests | 15 minutes | `429` — "Too many requests, please try again after 15 minutes" |
| **Auth** | `/auth/login`, `/auth/register` | 20 requests | 15 minutes | `429` — "Too many authentication attempts, please try again after 15 minutes" |

Rate limit information is included in response headers:
- `RateLimit-Limit` — Maximum requests allowed
- `RateLimit-Remaining` — Remaining requests in current window
- `RateLimit-Reset` — Time when the window resets

---

## Auth Endpoints

### 1. Register

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Auth Required:** No

**Rate Limiter:** Auth limiter (20 req / 15 min)

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |

**Request Body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | `string` | Yes | 2–50 characters, trimmed |
| `email` | `string` | Yes | Valid email format, unique, lowercase |
| `password` | `string` | Yes | Minimum 6 characters |

**Request Example:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128",
      "role": "member",
      "createdAt": "2024-09-23T10:30:00.000Z",
      "updatedAt": "2024-09-23T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Name is required"` |
| `400` | `"Please provide a valid email address"` |
| `400` | `"Password must be at least 6 characters"` |
| `400` | `"User already exists with this email"` |

---

### 2. Login

Authenticate with email and password.

**Endpoint:** `POST /api/auth/login`

**Auth Required:** No

**Rate Limiter:** Auth limiter (20 req / 15 min)

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | Yes | Registered email address |
| `password` | `string` | Yes | Account password |

**Request Example:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128",
      "role": "member",
      "createdAt": "2024-09-23T10:30:00.000Z",
      "updatedAt": "2024-09-23T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Email and password are required"` |
| `401` | `"Invalid email or password"` |

---

### 3. Logout

Clear the authentication cookie and log out.

**Endpoint:** `POST /api/auth/logout`

**Auth Required:** Yes

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Authorization` | `Bearer <token>` | Yes (if not using cookies) |

**Request Body:** None

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |

---

### 4. Get Profile

Retrieve the currently authenticated user's profile.

**Endpoint:** `GET /api/auth/profile`

**Auth Required:** Yes

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Authorization` | `Bearer <token>` | Yes (if not using cookies) |

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128",
    "role": "member",
    "createdAt": "2024-09-23T10:30:00.000Z",
    "updatedAt": "2024-09-23T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |
| `401` | `"Not authorized, user not found"` |

---

### 5. Update Profile

Update the authenticated user's profile information.

**Endpoint:** `PUT /api/auth/profile`

**Auth Required:** Yes

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer <token>` | Yes (if not using cookies) |

**Request Body (all fields optional):**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | `string` | No | 2–50 characters |
| `email` | `string` | No | Valid email format |
| `password` | `string` | No | Minimum 6 characters |

**Request Example:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "avatar": "https://ui-avatars.com/api/?name=John%20Updated&background=random&color=fff&size=128",
    "role": "member",
    "createdAt": "2024-09-23T10:30:00.000Z",
    "updatedAt": "2024-09-24T08:15:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Email already in use by another account"` |
| `401` | `"Not authorized, no token provided"` |

---

## Project Endpoints

### 1. Get All Projects

Retrieve all projects for the authenticated user with optional filters and pagination.

**Endpoint:** `GET /api/projects`

**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `10` | Number of results per page |
| `status` | `string` | — | Filter by status: `active`, `completed`, `archived` |
| `search` | `string` | — | Search in project title and description |
| `sort` | `string` | `-createdAt` | Sort field with direction (prefix `-` for descending) |

**Request Example:**
```
GET /api/projects?status=active&page=1&limit=10&search=website&sort=-createdAt
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "66f1b2c3d4e5f6a7b8c9d0e1",
      "title": "Website Redesign",
      "description": "Complete overhaul of the company website with new branding",
      "owner": {
        "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe",
        "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128"
      },
      "members": [
        {
          "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
          "name": "Jane Smith",
          "avatar": "https://ui-avatars.com/api/?name=Jane%20Smith&background=random&color=fff&size=128"
        }
      ],
      "status": "active",
      "startDate": "2024-09-01T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "taskCount": 8,
      "createdAt": "2024-09-23T10:30:00.000Z",
      "updatedAt": "2024-09-23T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

### 2. Create Project

Create a new project. The authenticated user is automatically set as the owner.

**Endpoint:** `POST /api/projects`

**Auth Required:** Yes

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer <token>` | Yes (if not using cookies) |

**Request Body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | Yes | 3–100 characters |
| `description` | `string` | No | Max 500 characters |
| `members` | `string[]` | No | Array of User ObjectIds |
| `status` | `string` | No | `active` (default), `completed`, `archived` |
| `startDate` | `string` | No | ISO 8601 date format |
| `endDate` | `string` | No | ISO 8601 date format |

**Request Example:**
```json
{
  "title": "Website Redesign",
  "description": "Complete overhaul of the company website with new branding",
  "members": ["66f1a2b3c4d5e6f7a8b9c0d2"],
  "status": "active",
  "startDate": "2024-09-01",
  "endDate": "2024-12-31"
}
```

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1b2c3d4e5f6a7b8c9d0e1",
    "title": "Website Redesign",
    "description": "Complete overhaul of the company website with new branding",
    "owner": "66f1a2b3c4d5e6f7a8b9c0d1",
    "members": ["66f1a2b3c4d5e6f7a8b9c0d2"],
    "status": "active",
    "startDate": "2024-09-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "createdAt": "2024-09-23T10:45:00.000Z",
    "updatedAt": "2024-09-23T10:45:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Project title is required"` |
| `400` | `"Title must be at least 3 characters"` |
| `400` | `"Title must not exceed 100 characters"` |
| `400` | `"Status must be active, completed, or archived"` |
| `401` | `"Not authorized, no token provided"` |

---

### 3. Get Project by ID

Retrieve a single project by its ID, including populated owner and members.

**Endpoint:** `GET /api/projects/:id`

**Auth Required:** Yes

**URL Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the project |

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1b2c3d4e5f6a7b8c9d0e1",
    "title": "Website Redesign",
    "description": "Complete overhaul of the company website with new branding",
    "owner": {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128"
    },
    "members": [
      {
        "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "avatar": "https://ui-avatars.com/api/?name=Jane%20Smith&background=random&color=fff&size=128"
      }
    ],
    "status": "active",
    "startDate": "2024-09-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "taskCount": 8,
    "createdAt": "2024-09-23T10:45:00.000Z",
    "updatedAt": "2024-09-23T10:45:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Invalid project ID format"` |
| `401` | `"Not authorized, no token provided"` |
| `404` | `"Project not found"` |

---

### 4. Update Project

Update an existing project by ID.

**Endpoint:** `PUT /api/projects/:id`

**Auth Required:** Yes

**URL Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the project |

**Request Body (all fields optional):**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | No | 3–100 characters |
| `description` | `string` | No | Max 500 characters |
| `members` | `string[]` | No | Array of User ObjectIds |
| `status` | `string` | No | `active`, `completed`, `archived` |
| `startDate` | `string` | No | ISO 8601 date format |
| `endDate` | `string` | No | ISO 8601 date format |

**Request Example:**
```json
{
  "status": "completed",
  "endDate": "2024-11-15"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1b2c3d4e5f6a7b8c9d0e1",
    "title": "Website Redesign",
    "description": "Complete overhaul of the company website with new branding",
    "owner": "66f1a2b3c4d5e6f7a8b9c0d1",
    "members": ["66f1a2b3c4d5e6f7a8b9c0d2"],
    "status": "completed",
    "startDate": "2024-09-01T00:00:00.000Z",
    "endDate": "2024-11-15T00:00:00.000Z",
    "createdAt": "2024-09-23T10:45:00.000Z",
    "updatedAt": "2024-09-25T14:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Invalid project ID format"` |
| `400` | `"Status must be active, completed, or archived"` |
| `401` | `"Not authorized, no token provided"` |
| `403` | `"Not authorized to update this project"` |
| `404` | `"Project not found"` |

---

### 5. Delete Project

Delete a project by ID. Only the project owner can delete it.

**Endpoint:** `DELETE /api/projects/:id`

**Auth Required:** Yes

**URL Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the project |

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Invalid project ID format"` |
| `401` | `"Not authorized, no token provided"` |
| `403` | `"Not authorized to delete this project"` |
| `404` | `"Project not found"` |

---

## Task Endpoints

### 1. Get All Tasks

Retrieve tasks with optional filters, search, and pagination.

**Endpoint:** `GET /api/tasks`

**Auth Required:** Yes

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |
| `project` | `string` | — | Filter by project ObjectId |
| `status` | `string` | — | Filter: `todo`, `in-progress`, `completed` |
| `priority` | `string` | — | Filter: `low`, `medium`, `high` |
| `assignee` | `string` | — | Filter by assignee ObjectId |
| `search` | `string` | — | Search in task title and description |
| `sort` | `string` | `-createdAt` | Sort field (prefix `-` for descending) |

**Request Example:**
```
GET /api/tasks?project=66f1b2c3d4e5f6a7b8c9d0e1&status=todo&priority=high&page=1&limit=10
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "66f1c3d4e5f6a7b8c9d0e1f2",
      "title": "Design homepage mockup",
      "description": "Create high-fidelity mockups for the new homepage layout",
      "project": {
        "_id": "66f1b2c3d4e5f6a7b8c9d0e1",
        "title": "Website Redesign"
      },
      "assignee": {
        "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Jane Smith",
        "avatar": "https://ui-avatars.com/api/?name=Jane%20Smith&background=random&color=fff&size=128"
      },
      "creator": {
        "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe",
        "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128"
      },
      "priority": "high",
      "status": "todo",
      "dueDate": "2024-10-15T00:00:00.000Z",
      "createdAt": "2024-09-23T11:00:00.000Z",
      "updatedAt": "2024-09-23T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

### 2. Get Task Stats

Retrieve aggregate task statistics for the authenticated user.

**Endpoint:** `GET /api/tasks/stats`

**Auth Required:** Yes

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Authorization` | `Bearer <token>` | Yes (if not using cookies) |

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "total": 24,
    "byStatus": {
      "todo": 8,
      "in-progress": 10,
      "completed": 6
    },
    "byPriority": {
      "low": 5,
      "medium": 12,
      "high": 7
    },
    "overdue": 3,
    "dueSoon": 5
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |

---

### 3. Create Task

Create a new task within a project.

**Endpoint:** `POST /api/tasks`

**Auth Required:** Yes

**Request Headers:**

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer <token>` | Yes (if not using cookies) |

**Request Body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | Yes | 3–100 characters |
| `description` | `string` | No | Max 1000 characters |
| `project` | `string` | Yes | Valid Project ObjectId |
| `assignee` | `string` | No | Valid User ObjectId |
| `priority` | `string` | No | `low`, `medium` (default), `high` |
| `status` | `string` | No | `todo` (default), `in-progress`, `completed` |
| `dueDate` | `string` | No | ISO 8601 date format |

**Request Example:**
```json
{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity mockups for the new homepage layout",
  "project": "66f1b2c3d4e5f6a7b8c9d0e1",
  "assignee": "66f1a2b3c4d5e6f7a8b9c0d2",
  "priority": "high",
  "status": "todo",
  "dueDate": "2024-10-15"
}
```

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1c3d4e5f6a7b8c9d0e1f2",
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockups for the new homepage layout",
    "project": "66f1b2c3d4e5f6a7b8c9d0e1",
    "assignee": "66f1a2b3c4d5e6f7a8b9c0d2",
    "creator": "66f1a2b3c4d5e6f7a8b9c0d1",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-10-15T00:00:00.000Z",
    "createdAt": "2024-09-23T11:00:00.000Z",
    "updatedAt": "2024-09-23T11:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Task title is required"` |
| `400` | `"Title must be at least 3 characters"` |
| `400` | `"Project reference is required"` |
| `400` | `"Priority must be low, medium, or high"` |
| `400` | `"Status must be todo, in-progress, or completed"` |
| `401` | `"Not authorized, no token provided"` |
| `404` | `"Project not found"` |

---

### 4. Get Task by ID

Retrieve a single task by its ID with populated references.

**Endpoint:** `GET /api/tasks/:id`

**Auth Required:** Yes

**URL Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the task |

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1c3d4e5f6a7b8c9d0e1f2",
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockups for the new homepage layout",
    "project": {
      "_id": "66f1b2c3d4e5f6a7b8c9d0e1",
      "title": "Website Redesign",
      "status": "active"
    },
    "assignee": {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "avatar": "https://ui-avatars.com/api/?name=Jane%20Smith&background=random&color=fff&size=128"
    },
    "creator": {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "avatar": "https://ui-avatars.com/api/?name=John%20Doe&background=random&color=fff&size=128"
    },
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-10-15T00:00:00.000Z",
    "createdAt": "2024-09-23T11:00:00.000Z",
    "updatedAt": "2024-09-23T11:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Invalid task ID format"` |
| `401` | `"Not authorized, no token provided"` |
| `404` | `"Task not found"` |

---

### 5. Update Task

Update an existing task by ID.

**Endpoint:** `PUT /api/tasks/:id`

**Auth Required:** Yes

**URL Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the task |

**Request Body (all fields optional):**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | No | 3–100 characters |
| `description` | `string` | No | Max 1000 characters |
| `assignee` | `string` | No | Valid User ObjectId |
| `priority` | `string` | No | `low`, `medium`, `high` |
| `status` | `string` | No | `todo`, `in-progress`, `completed` |
| `dueDate` | `string` | No | ISO 8601 date format |

**Request Example:**
```json
{
  "status": "in-progress",
  "priority": "high"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "_id": "66f1c3d4e5f6a7b8c9d0e1f2",
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockups for the new homepage layout",
    "project": "66f1b2c3d4e5f6a7b8c9d0e1",
    "assignee": "66f1a2b3c4d5e6f7a8b9c0d2",
    "creator": "66f1a2b3c4d5e6f7a8b9c0d1",
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2024-10-15T00:00:00.000Z",
    "createdAt": "2024-09-23T11:00:00.000Z",
    "updatedAt": "2024-09-25T09:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Invalid task ID format"` |
| `400` | `"Status must be todo, in-progress, or completed"` |
| `400` | `"Priority must be low, medium, or high"` |
| `401` | `"Not authorized, no token provided"` |
| `403` | `"Not authorized to update this task"` |
| `404` | `"Task not found"` |

---

### 6. Delete Task

Delete a task by ID.

**Endpoint:** `DELETE /api/tasks/:id`

**Auth Required:** Yes

**URL Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` | MongoDB ObjectId of the task |

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**

| Status | Message |
|---|---|
| `400` | `"Invalid task ID format"` |
| `401` | `"Not authorized, no token provided"` |
| `403` | `"Not authorized to delete this task"` |
| `404` | `"Task not found"` |

---

## Testing the API

### With cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Projects (with cookie):**
```bash
curl -X GET http://localhost:5000/api/projects \
  -b cookies.txt
```

**Create Task (with Bearer token):**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Task","project":"PROJECT_ID_HERE","priority":"high"}'
```

### With Postman

Import the [Postman Collection](POSTMAN_COLLECTION.json) included in the `docs/` directory for a ready-to-use API testing setup with all endpoints pre-configured.

---

*Last updated: June 2024*
]]>
