# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT Bearer token in the request header:
```
Authorization: Bearer <token>
```
The token is obtained from the `POST /auth/login` endpoint.

## Standard Response Format
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

---

## 🔑 Auth Endpoints

### POST /auth/login
Login and receive a JWT token.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "employee1@gmail.com",
  "password": "Password@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "employeeCode": "EMP001",
      "name": "Employee One",
      "email": "employee1@gmail.com",
      "department": "IT",
      "role": "EMPLOYEE"
    }
  }
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 400 | Validation error (missing fields) |
| 401 | Invalid email or password |

---

### POST /auth/logout
Logout the current user.

**Auth Required:** Yes

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 Employee Endpoints

### GET /employees/dashboard
Get leave statistics for the logged-in employee.

**Auth Required:** Yes | **Role:** EMPLOYEE

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLeaves": 5,
    "pendingLeaves": 1,
    "approvedLeaves": 3,
    "rejectedLeaves": 1,
    "recentLeaves": [ ... ]
  }
}
```

---

### GET /employees
Get all employees. Supports optional filters.

**Auth Required:** Yes | **Role:** ANY

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by name or email |
| department | string | Filter by department |
| role | string | EMPLOYEE or MANAGER |

---

### GET /employees/:id
Get a single employee by ID.

**Auth Required:** Yes | **Role:** ANY

**Error Response (404):**
```json
{ "success": false, "message": "Employee not found" }
```

---

## 🗓️ Leave Endpoints (Employee)

### POST /leaves
Apply for a new leave request.

**Auth Required:** Yes | **Role:** EMPLOYEE

**Request Body:**
```json
{
  "leaveType": "CASUAL",
  "startDate": "2026-07-15",
  "endDate": "2026-07-17",
  "reason": "Personal work"
}
```

**Leave Types:** `CASUAL` | `SICK` | `EARNED` | `WFH`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Leave applied successfully",
  "data": { "id": 10, "status": "PENDING", ... }
}
```

---

### GET /leaves
Get leave history for logged-in employee.

**Auth Required:** Yes | **Role:** EMPLOYEE

**Query Parameters:**
| Param | Description |
|-------|-------------|
| status | PENDING / APPROVED / REJECTED |
| leaveType | CASUAL / SICK / EARNED / WFH |
| search | Keyword in reason |

---

### GET /leaves/:id
Get a specific leave request by ID.

**Auth Required:** Yes | **Role:** EMPLOYEE

---

### PUT /leaves/:id
Update a pending leave request.

**Auth Required:** Yes | **Role:** EMPLOYEE

> Only `PENDING` leaves can be updated.

**Request Body:** Same as POST /leaves

---

### DELETE /leaves/:id
Cancel a pending leave request.

**Auth Required:** Yes | **Role:** EMPLOYEE

> Only `PENDING` leaves can be cancelled.

**Success Response (200):**
```json
{ "success": true, "message": "Leave request cancelled successfully" }
```

---

## 🏢 Manager Endpoints

### GET /manager/dashboard
Get team-wide leave statistics.

**Auth Required:** Yes | **Role:** MANAGER

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 2,
    "pendingApprovals": 3,
    "approvedRequests": 10,
    "rejectedRequests": 2,
    "recentActivities": [ ... ]
  }
}
```

---

### GET /manager/pending-leaves
Get all leave requests with PENDING status.

**Auth Required:** Yes | **Role:** MANAGER

---

### PUT /manager/leaves/:id/approve
Approve a pending leave request.

**Auth Required:** Yes | **Role:** MANAGER

**No request body required.**

**Success Response (200):**
```json
{ "success": true, "message": "Leave approved successfully", "data": { "status": "APPROVED", ... } }
```

---

### PUT /manager/leaves/:id/reject
Reject a pending leave request.

**Auth Required:** Yes | **Role:** MANAGER

**Request Body:**
```json
{
  "managerComments": "Project deadline approaching, please reschedule"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Leave rejected successfully", "data": { "status": "REJECTED", ... } }
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no token or invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Resource Not Found |
| 500 | Internal Server Error |
