# Database Documentation

## Overview
The Leave Management System uses **MySQL** as the database, accessed through the **Prisma ORM**. The schema consists of two primary tables: `employees` and `leave_requests`.

---

## Entity Relationship Diagram (ERD)

```
┌──────────────────────────────┐          ┌──────────────────────────────────────┐
│           employees          │          │            leave_requests            │
├──────────────────────────────┤          ├──────────────────────────────────────┤
│ id           INT  (PK)       │◄────┐    │ id              INT  (PK)            │
│ employee_code VARCHAR(20) UQ │     └────│ employee_id     INT  (FK)            │
│ name         VARCHAR(100)    │          │ leave_type      ENUM                 │
│ email        VARCHAR(100) UQ │          │ start_date      DATE                 │
│ password     VARCHAR(255)    │          │ end_date        DATE                 │
│ department   VARCHAR(100)    │          │ reason          TEXT                 │
│ role         ENUM            │          │ status          ENUM (default PENDING)│
│ created_at   TIMESTAMP       │          │ manager_comments TEXT                │
│ updated_at   TIMESTAMP       │          │ created_at      TIMESTAMP            │
└──────────────────────────────┘          │ updated_at      TIMESTAMP            │
                                          └──────────────────────────────────────┘
```

**Relationship:** One `Employee` → Many `LeaveRequests` (1:N)

---

## Tables

### `employees`

Stores all system users — both employees and managers.

| Column        | Type         | Constraints          | Description                      |
|---------------|--------------|----------------------|----------------------------------|
| id            | INT          | PK, Auto Increment   | Unique identifier                |
| employee_code | VARCHAR(20)  | UNIQUE, NOT NULL     | e.g. EMP001, MGR001              |
| name          | VARCHAR(100) | NOT NULL             | Full name                        |
| email         | VARCHAR(100) | UNIQUE, NOT NULL     | Login email                      |
| password      | VARCHAR(255) | NOT NULL             | bcrypt-hashed password           |
| department    | VARCHAR(100) | NULLABLE             | Department name                  |
| role          | ENUM         | NOT NULL             | `EMPLOYEE` or `MANAGER`          |
| created_at    | TIMESTAMP    | Default: NOW()       | Account creation timestamp       |
| updated_at    | TIMESTAMP    | Default: NOW()       | Last update timestamp            |

**Indexes:**
- `idx_employee_email` on `email`

---

### `leave_requests`

Stores all leave applications made by employees.

| Column           | Type     | Constraints        | Description                           |
|------------------|----------|--------------------|---------------------------------------|
| id               | INT      | PK, Auto Increment | Unique identifier                     |
| employee_id      | INT      | FK → employees.id  | References the applicant              |
| leave_type       | ENUM     | NOT NULL           | `CASUAL`, `SICK`, `EARNED`, `WFH`     |
| start_date       | DATE     | NOT NULL           | First day of leave                    |
| end_date         | DATE     | NOT NULL           | Last day of leave                     |
| reason           | TEXT     | NOT NULL           | Employee's reason for the leave       |
| status           | ENUM     | Default: PENDING   | `PENDING`, `APPROVED`, `REJECTED`     |
| manager_comments | TEXT     | NULLABLE           | Manager's note on rejection/approval  |
| created_at       | TIMESTAMP| Default: NOW()     | Request creation timestamp            |
| updated_at       | TIMESTAMP| Default: NOW()     | Last update timestamp                 |

**Indexes:**
- `idx_leave_employee` on `employee_id`
- `idx_leave_status` on `status`

**Foreign Key:**
- `employee_id` → `employees.id` (ON DELETE CASCADE)

---

## Enums

### `Role`
| Value    | Description           |
|----------|-----------------------|
| EMPLOYEE | Regular employee user |
| MANAGER  | Manager with approval rights |

### `LeaveType`
| Value   | Description           |
|---------|-----------------------|
| CASUAL  | Casual / personal leave |
| SICK    | Medical / sick leave  |
| EARNED  | Earned / annual leave |
| WFH     | Work from home        |

### `LeaveStatus`
| Value    | Description                            |
|----------|----------------------------------------|
| PENDING  | Submitted, awaiting manager action     |
| APPROVED | Approved by manager                    |
| REJECTED | Rejected by manager                    |

---

## Database Setup Commands

```bash
# 1. Create the database in MySQL
CREATE DATABASE leave_management;

# 2. Run Prisma migrations (from the backend folder)
npx prisma migrate dev --name init

# 3. Generate Prisma client
npx prisma generate

# 4. Seed the database with sample data
node prisma/seed.js
```

---

## Sample Seed Data

The `prisma/seed.js` script creates the following accounts (password: `Password@123`):

| Employee Code | Name          | Email                | Role     | Department     |
|---------------|---------------|----------------------|----------|----------------|
| MGR001        | Manager User  | manager@gmail.com    | MANAGER  | Administration |
| EMP001        | Employee One  | employee1@gmail.com  | EMPLOYEE | IT             |
| EMP002        | Employee Two  | employee2@gmail.com  | EMPLOYEE | HR             |
