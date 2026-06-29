<![CDATA[# 🎬 Demo Script

## Smart Task & Team Management Portal — Live Walkthrough Guide

---

## Pre-Demo Setup

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas cluster running with a valid connection string
- [ ] Project dependencies installed (`npm run install:all`)
- [ ] `server/.env` file configured with `MONGO_URI` and `JWT_SECRET`
- [ ] Postman installed (optional, for API demo)
- [ ] Two browser windows ready (one regular, one incognito — for multi-user demo)
- [ ] Screen resolution set to at least 1920×1080 (for best presentation)

### Quick Start

```bash
# Terminal 1: Start the application
npm run dev
```

Wait until you see:

```
[server] ✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
[server] 🚀 Server running on port 5000 in development mode
[client] VITE v5.4.8  ready in 500ms
[client] ➜  Local:   http://localhost:5173/
```

### Demo Credentials (Pre-register or use during demo)

| User | Email | Password |
|---|---|---|
| Demo Admin | admin@example.com | password123 |
| Team Member | jane@example.com | password123 |

---

## Demo Flow

### Step 1: Show the Landing / Login Page

**Duration:** 1–2 minutes

**Actions:**
1. Open browser and navigate to `http://localhost:5173`
2. The app redirects unauthenticated users to the **Login** page
3. Point out the UI elements:
   - Clean, modern design with Indigo color scheme
   - Form fields with placeholder text
   - "Register" link for new users
   - Responsive layout

**Talking Points:**
> "This is the Smart Task & Team Management Portal. The first thing users see is a clean login page. Notice the modern design — we're using Tailwind CSS for a consistent, professional look. Users who don't have an account can click the Register link to create one."

**Expected Outcome:** Login page displayed with email and password fields.

---

### Step 2: Register a New User

**Duration:** 2–3 minutes

**Actions:**
1. Click on **"Register"** or navigate to the registration page
2. Fill in the registration form:
   - **Name:** `John Doe`
   - **Email:** `john.doe@example.com`
   - **Password:** `securePassword123`
3. Submit the form
4. Note the success toast notification
5. Observe the automatic redirect to the Dashboard

**Talking Points:**
> "Let's register a new user. The form uses React Hook Form for high-performance validation — notice how it validates in real-time. When we submit, the backend hashes the password with bcrypt using 12 salt rounds, generates a JWT token, and sets it as a secure httpOnly cookie. The user also gets an auto-generated avatar from ui-avatars.com based on their name."

**Expected Outcome:** User registered, toast notification shown, redirected to Dashboard.

---

### Step 3: Login and Explore the Dashboard

**Duration:** 2–3 minutes

**Actions:**
1. If not already logged in, navigate to Login and enter credentials
2. Once on the Dashboard, walk through the components:
   - **Statistics cards** showing task counts (To Do, In Progress, Completed)
   - **Recent projects** section
   - **Recent tasks** section
   - **Navigation sidebar** with links to all sections
3. Point out the header with the user's avatar and name

**Talking Points:**
> "The Dashboard is the command center. At a glance, you can see your task statistics — how many tasks are in each status. Below that, you see your recent projects and tasks. The sidebar gives you quick access to all major sections: Projects, Tasks, and Profile. Notice the user's avatar in the header — it's auto-generated based on their name."

**Expected Outcome:** Dashboard with stats cards, recent items, and navigation displayed.

---

### Step 4: Toggle Dark Mode

**Duration:** 1 minute

**Actions:**
1. Locate the **dark mode toggle** in the header/navigation area
2. Click to switch to **Dark Mode**
3. Observe the smooth transition across all elements
4. Toggle back to **Light Mode** to show the comparison
5. Switch back to whichever mode looks best on the projector

**Talking Points:**
> "We've implemented a full dark mode using Tailwind CSS's class-based dark mode strategy. Watch how every element — cards, sidebar, header, text — transitions smoothly. This isn't just inverting colors; we've carefully chosen a dark palette that maintains readability and visual hierarchy. The user's preference is persisted across sessions."

**Expected Outcome:** Entire UI smoothly transitions between light and dark themes.

---

### Step 5: Create a Project

**Duration:** 2–3 minutes

**Actions:**
1. Navigate to **Projects** from the sidebar
2. Click the **"Create Project"** button
3. Fill in the project form:
   - **Title:** `Website Redesign`
   - **Description:** `Complete overhaul of the company website with new branding and improved UX`
   - **Status:** `Active`
   - **Start Date:** Today's date
   - **End Date:** 3 months from today
4. Submit the form
5. See the new project appear in the project list
6. Create a second project for variety:
   - **Title:** `Mobile App Development`
   - **Description:** `Build a cross-platform mobile app for task management on the go`

**Talking Points:**
> "Let's create a project. Projects are the top-level organizational unit — they contain tasks and can have team members. Notice the validation — the title must be between 3 and 100 characters. The owner is automatically set to the logged-in user. We can set a date range to track the project timeline. The status can be Active, Completed, or Archived."

**Expected Outcome:** Two projects created and visible in the projects list.

---

### Step 6: Create Tasks in the Project

**Duration:** 3–4 minutes

**Actions:**
1. Click into the **"Website Redesign"** project
2. Click **"Create Task"** or **"Add Task"**
3. Create the first task:
   - **Title:** `Design homepage mockup`
   - **Description:** `Create high-fidelity mockups for the new homepage layout`
   - **Priority:** `High`
   - **Status:** `To Do`
   - **Due Date:** 2 weeks from today
4. Create a second task:
   - **Title:** `Set up CI/CD pipeline`
   - **Description:** `Configure GitHub Actions for automated testing and deployment`
   - **Priority:** `Medium`
   - **Status:** `To Do`
   - **Due Date:** 1 week from today
5. Create a third task:
   - **Title:** `Write unit tests`
   - **Description:** `Add Jest unit tests for all API endpoints with 80% coverage target`
   - **Priority:** `Low`
   - **Status:** `In Progress`
   - **Due Date:** 3 weeks from today

**Talking Points:**
> "Now let's add tasks to our project. Each task has a title, description, priority level, status, and due date. We support three priority levels — Low, Medium, and High — and three statuses — To Do, In Progress, and Completed. The task creator is automatically recorded, and tasks are linked to their parent project."

**Expected Outcome:** Three tasks created within the Website Redesign project with different priorities and statuses.

---

### Step 7: Assign Tasks and Set Priorities

**Duration:** 2–3 minutes

**Actions:**
1. Click on the **"Design homepage mockup"** task to open it
2. Edit the task:
   - Assign it to a team member (if a second user exists)
   - Confirm the priority is set to **High**
3. Save the changes
4. Go back to the task list
5. Click on **"Set up CI/CD pipeline"** and change priority to **High**
6. Demonstrate how the priority badge color changes:
   - **High** → Red/urgent badge
   - **Medium** → Yellow/amber badge
   - **Low** → Green/calm badge

**Talking Points:**
> "Task assignment is where team collaboration happens. You can assign any task to a team member. The priority system uses visual cues — high-priority tasks get a red badge, medium gets amber, and low gets green. This makes it instantly clear which tasks need attention first."

**Expected Outcome:** Tasks with assigned team members and color-coded priority badges.

---

### Step 8: Update Task Status

**Duration:** 2 minutes

**Actions:**
1. Select the **"Write unit tests"** task
2. Change its status from **In Progress** to **Completed**
3. Save and observe the status badge update
4. Return to the **Dashboard** to show the updated statistics:
   - To Do count decreased or stayed the same
   - Completed count increased
5. Go back to the tasks list and note the updated status display

**Talking Points:**
> "Updating task status is as simple as selecting the new status. Watch how the dashboard statistics update in real-time — the completed count goes up, reflecting the change immediately. This gives project managers instant visibility into team progress."

**Expected Outcome:** Task status updated, dashboard stats reflect the change.

---

### Step 9: Search and Filter

**Duration:** 2–3 minutes

**Actions:**
1. Navigate to the **Tasks** page (all tasks view)
2. Demonstrate the **status filter**:
   - Filter by **To Do** → show only pending tasks
   - Filter by **Completed** → show only finished tasks
   - Clear filter to show all
3. Demonstrate the **priority filter**:
   - Filter by **High** → show only high-priority tasks
4. Demonstrate the **search** feature:
   - Search for `"homepage"` → should find the design mockup task
   - Search for `"pipeline"` → should find the CI/CD task
   - Clear search
5. Navigate to **Projects** and demonstrate project status filtering:
   - Filter by **Active** projects

**Talking Points:**
> "As your project grows, finding the right task quickly becomes crucial. Our filtering system lets you narrow down by status, priority, or assignee. The search function scans both titles and descriptions. On the projects page, you can filter by project status — Active, Completed, or Archived. These filters work server-side for optimal performance with large datasets."

**Expected Outcome:** Tasks and projects filtered dynamically based on selected criteria.

---

### Step 10: View and Update Profile

**Duration:** 1–2 minutes

**Actions:**
1. Click on the user's **avatar** or **Profile** in the navigation
2. Show the profile page:
   - User's auto-generated avatar
   - Name and email
   - Account role (member or admin)
   - Account creation date
3. Click **"Edit Profile"**
4. Change the name to `"John D. Developer"`
5. Save and observe:
   - Name updated
   - Avatar URL regenerated with new name
   - Toast notification confirming the update

**Talking Points:**
> "The profile page shows your account details including the auto-generated avatar. You can update your name, email, or password at any time. Notice how the avatar updates automatically when you change your name — it's regenerated on the backend using a pre-save hook."

**Expected Outcome:** Profile displayed, name updated, avatar refreshed.

---

### Step 11: Show Responsive Design

**Duration:** 2 minutes

**Actions:**
1. Open browser **Developer Tools** (F12)
2. Toggle the **device toolbar** (responsive mode)
3. Show the app at different breakpoints:
   - **Desktop** (1920px) — Full sidebar + content layout
   - **Tablet** (768px) — Collapsible sidebar, adjusted grid
   - **Mobile** (375px) — Stacked layout, hamburger menu
4. Navigate through different pages at mobile size:
   - Dashboard cards stack vertically
   - Project list adapts to single column
   - Task cards remain readable
5. Close DevTools and return to full desktop view

**Talking Points:**
> "The entire application is built mobile-first with Tailwind CSS. Watch how the layout adapts — on desktop you get the full sidebar navigation, on tablet the sidebar becomes collapsible, and on mobile everything stacks elegantly. Every component, from stat cards to task lists, is fully responsive. This means your team can manage tasks from any device."

**Expected Outcome:** App displays correctly and is fully functional at all screen sizes.

---

### Step 12: Show API with Postman

**Duration:** 3–5 minutes

**Actions:**
1. Open **Postman**
2. Import the collection from `docs/POSTMAN_COLLECTION.json`
3. Show the collection structure:
   - **Auth** folder (Register, Login, Logout, Get Profile, Update Profile)
   - **Projects** folder (CRUD operations)
   - **Tasks** folder (CRUD + Stats)
4. Run the **Login** request:
   - Show the request body with email/password
   - Execute and show the 200 response with user data and token
   - Point out the test script that auto-saves the token
5. Run **Get All Projects**:
   - Show the Authorization header using `{{token}}`
   - Execute and show the paginated response
6. Run **Create Task**:
   - Show the request body
   - Execute and show the 201 response
   - Point out the auto-saved `{{taskId}}`
7. Run **Get Task Stats**:
   - Show the aggregated statistics response

**Talking Points:**
> "Let me show you the API behind the scenes. We've prepared a complete Postman collection with all endpoints. Watch — when I log in, the test script automatically saves the JWT token. Every subsequent request uses this token via the Authorization header. The API follows RESTful conventions with consistent JSON responses. We have full CRUD for projects and tasks, plus aggregate statistics. The collection includes test scripts for automated validation."

**Expected Outcome:** Postman requests execute successfully showing the full API functionality.

---

## Closing Remarks

**Duration:** 1–2 minutes

**Talking Points:**

> "To summarize, the Smart Task & Team Management Portal is a full-stack MERN application that provides:
> 
> - **Secure authentication** with JWT and bcrypt
> - **Project organization** with team member support
> - **Task management** with priority, status tracking, and assignments
> - **Real-time statistics** on your dashboard
> - **Responsive design** that works on any device
> - **Dark mode** for comfortable viewing
> - **A robust API** protected by rate limiting, input validation, and security headers
> 
> The codebase follows clean architecture patterns with separation of concerns, making it maintainable and extensible. Future enhancements could include real-time notifications with WebSockets, file attachments, Gantt chart views, and role-based access control."

---

## Troubleshooting During Demo

| Issue | Solution |
|---|---|
| Server won't start | Check `server/.env` file has valid `MONGO_URI` |
| MongoDB connection error | Verify Atlas IP whitelist includes your IP |
| Client won't start | Run `npm run install:client` to ensure deps are installed |
| API returns 401 | Re-login to get a fresh token |
| Port already in use | Kill process on port 5000/5173 or change in config |
| Slow loading | Check network connection; MongoDB Atlas can be slow on first request |

## Demo Timing Summary

| Step | Topic | Duration |
|---|---|---|
| 1 | Login page | 1–2 min |
| 2 | Register user | 2–3 min |
| 3 | Dashboard tour | 2–3 min |
| 4 | Dark mode | 1 min |
| 5 | Create projects | 2–3 min |
| 6 | Create tasks | 3–4 min |
| 7 | Assign & prioritize | 2–3 min |
| 8 | Update status | 2 min |
| 9 | Search & filter | 2–3 min |
| 10 | Profile | 1–2 min |
| 11 | Responsive design | 2 min |
| 12 | API / Postman | 3–5 min |
| — | Closing | 1–2 min |
| **Total** | | **~25–35 min** |

---

*Prepared for live demonstration of the Smart Task & Team Management Portal.*
]]>
