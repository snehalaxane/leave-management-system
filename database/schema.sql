-- Create Employee Table

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    role ENUM('EMPLOYEE', 'MANAGER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Create Leave Requests Table

CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL,

    leave_type ENUM(
        'CASUAL',
        'SICK',
        'EARNED',
        'WFH'
    ) NOT NULL,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    reason TEXT NOT NULL,

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED'
    ) DEFAULT 'PENDING',

    manager_comments TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee
        FOREIGN KEY(employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);

-- Create Indexes

CREATE INDEX idx_employee_email
ON employees(email);

CREATE INDEX idx_leave_employee
ON leave_requests(employee_id);

CREATE INDEX idx_leave_status
ON leave_requests(status);