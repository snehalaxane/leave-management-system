# 📋 Leave Management System

A full-stack **Employee Leave Management System** built with **React + Tailwind CSS** (frontend) and **Node.js + Express + Prisma + MySQL** (backend). It enables employees to apply for leaves and managers to review, approve, or reject them — all through a clean, professional web interface.

---

## 📌 Project Overview

This system simulates a real-world leave management workflow used in organizations. Employees can submit leave requests with date ranges and reasons, while managers have a dedicated portal to view pending approvals and take action. The entire system is secured with JWT-based authentication and role-based access control.

---

## ✨ Features

### Employee
- Secure login with JWT authentication
- Apply for leave (Casual, Sick, Earned, WFH)
- View personal leave history with status filters and search
- View detailed leave status and manager comments
- Cancel pending leave requests
- View personal profile

### Manager
- Dashboard with team leave statistics
- View all pending leave requests with employee details
- Approve or reject leave requests with custom modal dialogs
- Add rejection comments for transparency

### General
- Role-based access control (Employee / Manager)
- Clean, responsive UI with Tailwind CSS
- Axios interceptors for automatic JWT token handling
- Graceful session expiry handling

---

## 🛠️ Technology Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4     |
| Backend    | Node.js, Express.js                 |
| ORM        | Prisma                              |
| Database   | MySQL                               |
| Auth       | JSON Web Tokens (JWT), bcrypt       |
| HTTP Client| Axios                               |
| Icons      | Lucide React                        |
| Validation | express-validator                   |

---

## 📁 Folder Structure

```
leave-management-system/
├── frontend/                   # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js        # Axios instance with JWT interceptor
│       ├── components/
│       │   ├── Layout.jsx      # Sidebar + Navbar layout
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx # Global auth state
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── EmployeeDashboard.jsx
│       │   ├── ManagerDashboard.jsx
│       │   ├── ApplyLeave.jsx
│       │   ├── LeaveHistory.jsx
│       │   ├── PendingApprovals.jsx
│       │   ├── LeaveDetails.jsx
│       │   ├── EmployeeProfile.jsx
│       │   └── NotFound.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── backend/                    # Node.js + Express backend
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API route definitions
│   ├── middleware/             # Auth & role middleware
│   ├── validators/             # Input validation schemas
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.js             # Database seeder
│   │   └── seedData.js         # Sample seed data
│   ├── utils/                  # Response helpers
│   ├── config/                 # DB config
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
│
├── database/                   # SQL schema file
├── docs/                       # API documentation
├── postman/                    # Postman collection
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

---

## ⚙️ Installation Steps

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+
- [Git](https://git-scm.com/)
- npm v9+

### 1. Clone the Repository

```bash
git clone https://github.com/snehalaxane/leave-management-system.git
cd leave-management-system
```

---

## 🔐 Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example backend/.env
```

Then edit `backend/.env`:

```env
PORT=5000
DATABASE_URL="mysql://YOUR_MYSQL_USER:YOUR_MYSQL_PASSWORD@localhost:3306/leave_management"
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
```

| Variable       | Description                                    |
|----------------|------------------------------------------------|
| `PORT`         | Port the Express server listens on (default 5000) |
| `DATABASE_URL` | MySQL connection string for Prisma             |
| `JWT_SECRET`   | Secret key used to sign JWT tokens             |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`, `24h`)   |

---

## 🗄️ Database Setup

### 1. Create the MySQL Database

Log in to MySQL and run:

```sql
CREATE DATABASE leave_management;
```

### 2. Run Prisma Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

This will create all tables (`employees`, `leave_requests`) based on the Prisma schema.

### 3. Seed the Database

Populate the database with sample employees:

```bash
node prisma/seed.js
```

> This creates 1 manager and 2 employee accounts with a default password of `Password@123`.

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

To generate the Prisma client (run after any schema change):

```bash
npx prisma generate
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```
Backend runs at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 📡 API Documentation

All endpoints use `Content-Type: application/json`.  
Protected routes require the header: `Authorization: Bearer <token>`

### 🔑 Authentication

| Method | Endpoint         | Auth Required | Description           |
|--------|-----------------|---------------|-----------------------|
| POST   | `/api/auth/login`  | ❌            | Login and receive JWT |
| POST   | `/api/auth/logout` | ✅            | Logout (invalidate)   |

**Login Request Body:**
```json
{
  "email": "employee1@gmail.com",
  "password": "Password@123"
}
```

---

### 👨‍💼 Employee Routes

| Method | Endpoint                  | Auth Required | Role       | Description                  |
|--------|--------------------------|---------------|------------|------------------------------|
| GET    | `/api/employees/dashboard` | ✅           | EMPLOYEE   | Get employee dashboard stats |
| GET    | `/api/employees`           | ✅           | ANY        | Get all employees            |
| GET    | `/api/employees/:id`       | ✅           | ANY        | Get employee by ID           |

---

### 🗓️ Leave Routes (Employee)

| Method | Endpoint          | Auth Required | Role     | Description                       |
|--------|------------------|---------------|----------|-----------------------------------|
| POST   | `/api/leaves`      | ✅           | EMPLOYEE | Apply for a new leave             |
| GET    | `/api/leaves`      | ✅           | EMPLOYEE | Get leave history (with filters)  |
| GET    | `/api/leaves/:id`  | ✅           | EMPLOYEE | Get a specific leave by ID        |
| PUT    | `/api/leaves/:id`  | ✅           | EMPLOYEE | Update a pending leave request    |
| DELETE | `/api/leaves/:id`  | ✅           | EMPLOYEE | Cancel a pending leave request    |

**Apply Leave Request Body:**
```json
{
  "leaveType": "CASUAL",
  "startDate": "2026-07-10",
  "endDate": "2026-07-12",
  "reason": "Family function"
}
```

Leave types: `CASUAL`, `SICK`, `EARNED`, `WFH`

---

### 🏢 Manager Routes

| Method | Endpoint                         | Auth Required | Role    | Description                      |
|--------|----------------------------------|---------------|---------|----------------------------------|
| GET    | `/api/manager/dashboard`          | ✅           | MANAGER | Get manager dashboard stats      |
| GET    | `/api/manager/pending-leaves`     | ✅           | MANAGER | Get all pending leave requests   |
| PUT    | `/api/manager/leaves/:id/approve` | ✅           | MANAGER | Approve a leave request          |
| PUT    | `/api/manager/leaves/:id/reject`  | ✅           | MANAGER | Reject a leave request           |

**Reject Request Body:**
```json
{
  "managerComments": "Please reschedule as project deadline is near"
}
```

---

## 🔑 Sample Login Credentials

> All accounts use the default password set during seeding.

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Manager  | manager@gmail.com      | Password@123  |
| Employee | employee1@gmail.com    | Password@123  |
| Employee | employee2@gmail.com    | Password@123  |

---

## 📐 Database Schema Overview

```
employees
├── id (PK, auto-increment)
├── employee_code (unique)
├── name
├── email (unique)
├── password (bcrypt hashed)
├── department
├── role (EMPLOYEE | MANAGER)
├── created_at
└── updated_at

leave_requests
├── id (PK, auto-increment)
├── employee_id (FK → employees.id)
├── leave_type (CASUAL | SICK | EARNED | WFH)
├── start_date
├── end_date
├── reason
├── status (PENDING | APPROVED | REJECTED) [default: PENDING]
├── manager_comments
├── created_at
└── updated_at
```

---

## 🧾 Assumptions

- Each user account is pre-created by an admin (no self-registration).
- A manager can approve/reject leaves for all employees in the system.
- There is no leave balance or quota tracking — any leave type can be applied freely.
- Password reset functionality is not included in this version.
- The system assumes a single organization with one tier of managers.

---

## ⚠️ Known Limitations

- No email notifications on leave approval/rejection.
- No leave balance management (days remaining per type).
- No multi-level approval workflow.
- No pagination on large datasets (e.g., leave history tables).
- No admin role for user management from the UI.

---

## 🚀 Future Enhancements

- [ ] Email notifications via NodeMailer or SendGrid
- [ ] Leave balance tracking per employee per year
- [ ] Admin panel for creating/managing employee accounts
- [ ] Pagination and sorting on all list views
- [ ] Export leave reports as CSV or PDF
- [ ] Calendar view for visualizing leave schedules
- [ ] Multi-level approval workflows
- [ ] Mobile-responsive improvements and PWA support

---

## 👩‍💻 Author

**Sneha Laxane**  
Full Stack Developer Intern Assignment  
📅 July 2026
