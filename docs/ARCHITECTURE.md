# System Architecture

## Overview

The Leave Management System is a full-stack web application built using a layered **MVC-like architecture**, with a decoupled React frontend communicating with a Node.js REST API backend over HTTP.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │             React (Vite) + Tailwind CSS              │  │
│   │                                                      │  │
│   │  ┌─────────────┐   ┌──────────────┐  ┌───────────┐  │  │
│   │  │  AuthContext │   │  React Router│  │   Pages   │  │  │
│   │  │  (JWT state) │   │  (Protected  │  │ Employee  │  │  │
│   │  └─────────────┘   │   Routes)    │  │  Manager  │  │  │
│   │                    └──────────────┘  └───────────┘  │  │
│   │                    Axios (with JWT Interceptor)       │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │  HTTP/REST (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                         │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │              Node.js + Express.js                    │  │
│   │                                                      │  │
│   │  ┌──────────┐  ┌────────────┐  ┌───────────────┐   │  │
│   │  │  Routes  │→ │ Controllers│→ │   Services    │   │  │
│   │  └──────────┘  └────────────┘  └───────┬───────┘   │  │
│   │       ↑                                 │           │  │
│   │  ┌────┴──────────────┐                  ▼           │  │
│   │  │    Middleware      │         ┌───────────────┐   │  │
│   │  │ • authMiddleware   │         │  Prisma ORM   │   │  │
│   │  │ • roleMiddleware   │         └───────┬───────┘   │  │
│   │  │ • validators       │                 │           │  │
│   │  └───────────────────┘                 ▼           │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │  SQL Queries
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                        │
│                                                             │
│               MySQL Database                                │
│         ┌──────────────┐   ┌────────────────┐              │
│         │  employees   │───│ leave_requests │              │
│         └──────────────┘   └────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Layer Breakdown

### Request Lifecycle
```
Incoming HTTP Request
        │
        ▼
    Routes (/api/auth, /api/leaves, /api/manager)
        │
        ▼
    Middleware
    ├── authMiddleware   → Verify JWT token
    ├── roleMiddleware   → Check user role (EMPLOYEE/MANAGER)
    └── validators       → Validate request body fields
        │
        ▼
    Controller
    └── Validates input, calls service, formats response
        │
        ▼
    Service
    └── Business logic + Prisma ORM queries
        │
        ▼
    Prisma ORM → MySQL Database
        │
        ▼
    Response (JSON)
    └── { success, message, data }
```

---

## Frontend Layer Breakdown

### Component Structure
```
App.jsx (React Router)
│
├── /login              → Login.jsx
│
├── /employee/*         → ProtectedRoute (role: EMPLOYEE)
│   └── Layout.jsx (Sidebar + Navbar)
│       ├── /employee/dashboard  → EmployeeDashboard.jsx
│       ├── /employee/apply      → ApplyLeave.jsx
│       ├── /employee/history    → LeaveHistory.jsx
│       ├── /employee/leaves/:id → LeaveDetails.jsx
│       └── /employee/profile    → EmployeeProfile.jsx
│
└── /manager/*          → ProtectedRoute (role: MANAGER)
    └── Layout.jsx (Sidebar + Navbar)
        ├── /manager/dashboard   → ManagerDashboard.jsx
        ├── /manager/approvals   → PendingApprovals.jsx
        ├── /manager/leaves/:id  → LeaveDetails.jsx
        └── /manager/profile     → EmployeeProfile.jsx
```

### Auth Flow
```
User submits Login Form
        │
        ▼
POST /api/auth/login
        │
        ▼
JWT token received
        │
   ┌────┴─────────────────┐
   │  localStorage.setItem │
   │  • "token" = JWT      │
   │  • "user" = userObj   │
   └────┬─────────────────┘
        │
        ▼
AuthContext updates state (user)
        │
        ▼
React Router redirects to Dashboard
        │
All subsequent API requests →
Axios interceptor reads token from localStorage
and adds: Authorization: Bearer <token>
```

---

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| ORM | Prisma | Type-safe queries, easy migrations, readable schema |
| Auth | JWT | Stateless, scalable, no server-side session storage needed |
| CSS | Tailwind CSS v4 | Utility-first, fast to build, consistent design system |
| Routing | React Router v7 | Industry standard, supports nested protected routes |
| HTTP Client | Axios | Supports interceptors for automatic token injection |
| Password Hashing | bcrypt | Industry standard for secure password storage |

---

## Security Measures

- **Passwords** are hashed using `bcrypt` before storing in the database.
- **JWT tokens** expire after `7 days` (configurable via `JWT_EXPIRES_IN`).
- **Role-based middleware** prevents employees from accessing manager routes and vice versa.
- **Axios interceptors** automatically handle `401 Unauthorized` responses by clearing local storage and logging out the user.
- **Environment variables** store all sensitive config — never hardcoded.
- **Input validation** on all POST/PUT endpoints using `express-validator`.
