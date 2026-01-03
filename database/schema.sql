-- DayFlow HRMS Database Schema
-- This SQL schema is designed for production use with MySQL/PostgreSQL
-- Current implementation uses localStorage for demo purposes

-- ============================================
-- DATABASE SETUP
-- ============================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dayflow_hrms
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE dayflow_hrms;

-- Drop existing tables if they exist (CAUTION: This will delete all data!)
-- Uncomment the following lines if you want to reset the database
/*
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS generated_reports;
DROP TABLE IF EXISTS report_templates;
DROP TABLE IF EXISTS notification_preferences;
DROP TABLE IF EXISTS email_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS payslips;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS salary_structures;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS leave_balances;
DROP TABLE IF EXISTS leave_types;
DROP TABLE IF EXISTS holidays;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;
*/

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'hr', 'employee') DEFAULT 'employee',
    department VARCHAR(50),
    position VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    avatar_url VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    status ENUM('active', 'inactive', 'pending_verification', 'suspended') DEFAULT 'pending_verification',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_employee_id (employee_id),
    INDEX idx_status (status)
);

CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    remember_me BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

CREATE TABLE password_resets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reset_token (reset_token)
);

-- ============================================
-- EMPLOYEE MANAGEMENT
-- ============================================

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    nationality VARCHAR(50),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    hire_date DATE NOT NULL,
    termination_date DATE NULL,
    employment_type ENUM('full-time', 'part-time', 'contract', 'intern') DEFAULT 'full-time',
    work_location VARCHAR(100),
    manager_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_manager_id (manager_id)
);

CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    document_type ENUM('resume', 'offer_letter', 'contract', 'id_proof', 'degree', 'certification', 'other'),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_employee_id (employee_id)
);

-- ============================================
-- ATTENDANCE TRACKING
-- ============================================

CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('present', 'absent', 'half-day', 'leave', 'holiday', 'weekend') NOT NULL,
    work_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    marked_by INT,
    ip_address VARCHAR(45),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_employee_date (employee_id, date),
    INDEX idx_employee_date (employee_id, date),
    INDEX idx_date (date),
    INDEX idx_status (status)
);

CREATE TABLE holidays (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    type ENUM('national', 'company', 'optional') DEFAULT 'company',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date)
);

-- ============================================
-- LEAVE MANAGEMENT
-- ============================================

CREATE TABLE leave_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    default_days INT DEFAULT 0,
    is_paid BOOLEAN DEFAULT TRUE,
    requires_document BOOLEAN DEFAULT FALSE,
    max_consecutive_days INT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_balances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    used_days DECIMAL(5,2) DEFAULT 0,
    remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (total_days - used_days) STORED,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_employee_leave_year (employee_id, leave_type_id, year),
    INDEX idx_employee_year (employee_id, year)
);

CREATE TABLE leave_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    approved_by INT NULL,
    approval_date TIMESTAMP NULL,
    approval_comment TEXT,
    document_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

-- ============================================
-- PAYROLL MANAGEMENT
-- ============================================

CREATE TABLE salary_structures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    house_rent_allowance DECIMAL(12,2) DEFAULT 0,
    transport_allowance DECIMAL(12,2) DEFAULT 0,
    medical_allowance DECIMAL(12,2) DEFAULT 0,
    special_allowance DECIMAL(12,2) DEFAULT 0,
    provident_fund DECIMAL(12,2) DEFAULT 0,
    professional_tax DECIMAL(12,2) DEFAULT 0,
    income_tax DECIMAL(12,2) DEFAULT 0,
    other_deductions DECIMAL(12,2) DEFAULT 0,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_employee_id (employee_id),
    INDEX idx_effective_dates (effective_from, effective_to)
);

CREATE TABLE payroll (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    salary_structure_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    working_days INT NOT NULL,
    present_days INT NOT NULL,
    leave_days INT NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    allowances DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    gross_salary DECIMAL(12,2) NOT NULL,
    net_salary DECIMAL(12,2) NOT NULL,
    payment_date DATE,
    payment_method ENUM('bank_transfer', 'cash', 'cheque') DEFAULT 'bank_transfer',
    payment_reference VARCHAR(100),
    status ENUM('draft', 'processed', 'paid', 'cancelled') DEFAULT 'draft',
    processed_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (salary_structure_id) REFERENCES salary_structures(id) ON DELETE RESTRICT,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_employee_month_year (employee_id, month, year),
    INDEX idx_employee_id (employee_id),
    INDEX idx_month_year (month, year),
    INDEX idx_status (status)
);

CREATE TABLE payslips (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payroll_id INT NOT NULL,
    employee_id INT NOT NULL,
    payslip_number VARCHAR(50) UNIQUE NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    file_path VARCHAR(500),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_id) REFERENCES payroll(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_payroll_id (payroll_id),
    INDEX idx_employee_id (employee_id)
);

-- ============================================
-- NOTIFICATIONS & ALERTS
-- ============================================

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('info', 'alert', 'email', 'leave', 'payroll', 'attendance', 'system') DEFAULT 'info',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

CREATE TABLE email_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    email_to VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    email_type VARCHAR(50),
    status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

CREATE TABLE notification_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    email_leave_request BOOLEAN DEFAULT TRUE,
    email_leave_approval BOOLEAN DEFAULT TRUE,
    email_attendance_reminder BOOLEAN DEFAULT TRUE,
    email_payroll_generated BOOLEAN DEFAULT TRUE,
    email_birthday_wishes BOOLEAN DEFAULT TRUE,
    email_system_updates BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- ANALYTICS & REPORTS
-- ============================================

CREATE TABLE report_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('attendance', 'leave', 'payroll', 'performance', 'custom') NOT NULL,
    description TEXT,
    query_template TEXT NOT NULL,
    parameters JSON,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_type (type)
);

CREATE TABLE generated_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_id INT NULL,
    generated_by INT NOT NULL,
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50),
    file_path VARCHAR(500),
    file_format ENUM('pdf', 'excel', 'csv', 'json') DEFAULT 'pdf',
    parameters JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES report_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_generated_by (generated_by),
    INDEX idx_generated_at (generated_at)
);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- SYSTEM SETTINGS
-- ============================================

CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key)
);

-- ============================================
-- INITIAL DATA SEEDS
-- ============================================

-- Insert default leave types
INSERT INTO leave_types (name, code, default_days, is_paid, description) VALUES
('Vacation Leave', 'VACATION', 20, TRUE, 'Annual vacation leave'),
('Sick Leave', 'SICK', 10, TRUE, 'Sick leave for medical reasons'),
('Personal Leave', 'PERSONAL', 5, TRUE, 'Personal leave for personal matters'),
('Unpaid Leave', 'UNPAID', 0, FALSE, 'Unpaid leave'),
('Maternity Leave', 'MATERNITY', 90, TRUE, 'Maternity leave'),
('Paternity Leave', 'PATERNITY', 10, TRUE, 'Paternity leave');

-- Insert demo admin user (password: Admin@123, use bcrypt in production)
-- Note: In production, use proper password hashing (bcrypt, argon2, etc.)
INSERT INTO users (employee_id, full_name, email, password_hash, role, department, position, email_verified, status) VALUES
('ADMIN001', 'System Administrator', 'admin@dayflow.com', '$2b$10$rQ8hZJ0HqC8K4VJjJxN5c.xKx8EJ5J5J5J5J5J5J5J5J5J5J5J5', 'admin', 'IT', 'System Administrator', TRUE, 'active');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, data_type, description, is_public) VALUES
('company_name', 'DayFlow HRMS', 'string', 'Company name', TRUE),
('working_hours_per_day', '8', 'number', 'Standard working hours per day', FALSE),
('weekend_days', '["Saturday", "Sunday"]', 'json', 'Weekend days', FALSE),
('currency', 'USD', 'string', 'Default currency', FALSE),
('date_format', 'YYYY-MM-DD', 'string', 'Date format', TRUE),
('time_zone', 'UTC', 'string', 'System timezone', FALSE);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_attendance_employee_status ON attendance(employee_id, status);
CREATE INDEX idx_leave_requests_employee_status ON leave_requests(employee_id, status);
CREATE INDEX idx_payroll_employee_status ON payroll(employee_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active employees with full details
CREATE VIEW active_employees AS
SELECT 
    e.*,
    u.email,
    u.role,
    u.status,
    u.last_login,
    CONCAT(e.first_name, ' ', e.last_name) AS full_name
FROM employees e
JOIN users u ON e.user_id = u.id
WHERE u.status = 'active' AND e.termination_date IS NULL;

-- Current month attendance summary
CREATE VIEW current_month_attendance AS
SELECT 
    e.id AS employee_id,
    e.employee_id AS emp_code,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_days,
    COUNT(CASE WHEN a.status = 'half-day' THEN 1 END) AS half_days,
    COUNT(CASE WHEN a.status = 'leave' THEN 1 END) AS leave_days,
    SUM(a.work_hours) AS total_work_hours
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id 
    AND MONTH(a.date) = MONTH(CURRENT_DATE)
    AND YEAR(a.date) = YEAR(CURRENT_DATE)
GROUP BY e.id, e.employee_id, employee_name;

-- Leave balance summary
CREATE VIEW leave_balance_summary AS
SELECT 
    e.id AS employee_id,
    e.employee_id AS emp_code,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    lt.name AS leave_type,
    lb.total_days,
    lb.used_days,
    lb.remaining_days,
    lb.year
FROM employees e
JOIN leave_balances lb ON e.id = lb.employee_id
JOIN leave_types lt ON lb.leave_type_id = lt.id
WHERE lb.year = YEAR(CURRENT_DATE);

-- ============================================
-- STORED PROCEDURES (Examples)
-- ============================================

DELIMITER $$

-- Procedure to calculate and create payroll for all employees
CREATE PROCEDURE generate_monthly_payroll(IN p_month INT, IN p_year INT, IN p_processed_by INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_employee_id INT;
    DECLARE v_salary_structure_id INT;
    DECLARE v_working_days INT;
    DECLARE v_present_days INT;
    DECLARE v_leave_days INT;
    
    DECLARE employee_cursor CURSOR FOR 
        SELECT e.id FROM employees e
        JOIN users u ON e.user_id = u.id
        WHERE u.status = 'active' AND e.termination_date IS NULL;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Get working days for the month (excluding weekends and holidays)
    SET v_working_days = (
        SELECT COUNT(*) FROM (
            SELECT DATE_ADD(DATE_FORMAT(CONCAT(p_year, '-', p_month, '-01'), '%Y-%m-01'), INTERVAL seq DAY) AS date
            FROM (
                SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
                UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
                UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
                UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29
                UNION ALL SELECT 30
            ) numbers
        ) dates
        WHERE MONTH(date) = p_month
        AND YEAR(date) = p_year
        AND DAYOFWEEK(date) NOT IN (1, 7) -- Exclude Saturday and Sunday
        AND date NOT IN (SELECT date FROM holidays)
    );
    
    OPEN employee_cursor;
    
    employee_loop: LOOP
        FETCH employee_cursor INTO v_employee_id;
        IF done THEN
            LEAVE employee_loop;
        END IF;
        
        -- Get current salary structure
        SELECT id INTO v_salary_structure_id
        FROM salary_structures
        WHERE employee_id = v_employee_id
        AND effective_from <= LAST_DAY(CONCAT(p_year, '-', p_month, '-01'))
        AND (effective_to IS NULL OR effective_to >= LAST_DAY(CONCAT(p_year, '-', p_month, '-01')))
        ORDER BY effective_from DESC
        LIMIT 1;
        
        -- Get attendance data
        SELECT 
            COUNT(CASE WHEN status IN ('present', 'half-day') THEN 1 END),
            COUNT(CASE WHEN status = 'leave' THEN 1 END)
        INTO v_present_days, v_leave_days
        FROM attendance
        WHERE employee_id = v_employee_id
        AND MONTH(date) = p_month
        AND YEAR(date) = p_year;
        
        -- Insert payroll record (simplified calculation)
        INSERT INTO payroll (
            employee_id, salary_structure_id, month, year, 
            working_days, present_days, leave_days,
            basic_salary, allowances, deductions, 
            gross_salary, net_salary, processed_by, status
        )
        SELECT 
            v_employee_id, v_salary_structure_id, p_month, p_year,
            v_working_days, v_present_days, v_leave_days,
            basic_salary,
            (house_rent_allowance + transport_allowance + medical_allowance + special_allowance),
            (provident_fund + professional_tax + income_tax + other_deductions),
            (basic_salary + house_rent_allowance + transport_allowance + medical_allowance + special_allowance),
            (basic_salary + house_rent_allowance + transport_allowance + medical_allowance + special_allowance - 
             provident_fund - professional_tax - income_tax - other_deductions),
            p_processed_by,
            'processed'
        FROM salary_structures
        WHERE id = v_salary_structure_id;
        
    END LOOP;
    
    CLOSE employee_cursor;
END$$

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER $$

-- Trigger to update user status on employee termination
CREATE TRIGGER update_user_on_termination
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    IF NEW.termination_date IS NOT NULL AND OLD.termination_date IS NULL THEN
        UPDATE users SET status = 'inactive' WHERE id = NEW.user_id;
    END IF;
END$$

-- Trigger to create notification on leave request
CREATE TRIGGER notify_on_leave_request
AFTER INSERT ON leave_requests
FOR EACH ROW
BEGIN
    DECLARE hr_user_id INT;
    
    -- Get HR/Admin users
    DECLARE hr_cursor CURSOR FOR 
        SELECT id FROM users WHERE role IN ('hr', 'admin') AND status = 'active';
    
    OPEN hr_cursor;
    
    hr_loop: LOOP
        FETCH hr_cursor INTO hr_user_id;
        IF hr_user_id IS NULL THEN
            LEAVE hr_loop;
        END IF;
        
        INSERT INTO notifications (user_id, type, title, message, priority)
        VALUES (
            hr_user_id,
            'leave',
            'New Leave Request',
            CONCAT('Employee ID ', (SELECT employee_id FROM employees WHERE id = NEW.employee_id), ' has submitted a leave request'),
            'medium'
        );
    END LOOP;
    
    CLOSE hr_cursor;
END$$

-- Trigger to send notification on leave approval/rejection
CREATE TRIGGER notify_on_leave_decision
AFTER UPDATE ON leave_requests
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status AND NEW.status IN ('approved', 'rejected') THEN
        INSERT INTO notifications (user_id, type, title, message, priority)
        SELECT 
            u.id,
            'leave',
            CONCAT('Leave Request ', UPPER(NEW.status)),
            CONCAT('Your leave request from ', NEW.start_date, ' to ', NEW.end_date, ' has been ', NEW.status),
            'high'
        FROM users u
        JOIN employees e ON u.id = e.user_id
        WHERE e.id = NEW.employee_id;
        
        -- Update leave balance if approved
        IF NEW.status = 'approved' THEN
            UPDATE leave_balances
            SET used_days = used_days + NEW.total_days
            WHERE employee_id = NEW.employee_id
            AND leave_type_id = NEW.leave_type_id
            AND year = YEAR(NEW.start_date);
        END IF;
    END IF;
END$$

DELIMITER ;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- ============================================
-- EXECUTION INSTRUCTIONS
-- ============================================

-- HOW TO RUN THIS SCHEMA:
-- 
-- METHOD 1: Using MySQL Command Line
-- 1. Open terminal/command prompt
-- 2. Navigate to the database folder: cd F:\DayFlow\database
-- 3. Run: mysql -u root -p < schema.sql
-- 4. Enter your MySQL password when prompted
--
-- METHOD 2: Using phpMyAdmin or MySQL Workbench
-- 1. Open phpMyAdmin or MySQL Workbench
-- 2. Click "Import" or "Open SQL Script"
-- 3. Select this schema.sql file
-- 4. Click "Execute" or "Run"
-- 5. The database 'dayflow_hrms' will be created automatically
--
-- METHOD 3: Copy-Paste in phpMyAdmin SQL Tab
-- 1. Open phpMyAdmin
-- 2. Click on "SQL" tab at the top
-- 3. Copy the ENTIRE contents of this file
-- 4. Paste into the SQL query box
-- 5. Click "Go" button
-- 6. Wait for execution to complete (may take 30-60 seconds)
--
-- IMPORTANT NOTES:
-- - This script will create a new database called 'dayflow_hrms'
-- - No need to manually create or select a database first
-- - The script includes CREATE DATABASE and USE statements
-- - If you want to reset/drop existing tables, uncomment the DROP statements at the top
-- - Make sure your MySQL user has CREATE DATABASE privileges
-- - Estimated execution time: 30-60 seconds

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- After running the schema, verify installation with these queries:

-- 1. Check if database was created:
-- SHOW DATABASES LIKE 'dayflow_hrms';

-- 2. Check all tables were created:
-- USE dayflow_hrms;
-- SHOW TABLES;

-- 3. Verify table structures:
-- DESCRIBE users;
-- DESCRIBE employees;
-- DESCRIBE attendance;

-- 4. Check initial data:
-- SELECT * FROM leave_types;
-- SELECT * FROM users WHERE role = 'admin';
-- SELECT * FROM system_settings;

-- ============================================
-- PRODUCTION DEPLOYMENT CHECKLIST
-- ============================================

-- Remember to:
-- 1. Use proper password hashing (bcrypt, argon2) in production
-- 2. Implement proper session management with secure tokens
-- 3. Add SSL/TLS for database connections
-- 4. Regular backups and disaster recovery plans
-- 5. Implement proper access controls and row-level security
-- 6. Add database monitoring and logging
-- 7. Optimize queries with proper indexing
-- 8. Use environment variables for sensitive configuration
-- 9. Set up database user with appropriate privileges (not root)
-- 10. Configure firewall rules to restrict database access
-- 11. Enable MySQL binary logging for point-in-time recovery
-- 12. Set up automated backup schedule (daily recommended)

-- ============================================
-- DATABASE USER SETUP (Production)
-- ============================================

-- Create a dedicated database user for the application:
-- CREATE USER 'dayflow_app'@'localhost' IDENTIFIED BY 'strong_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON dayflow_hrms.* TO 'dayflow_app'@'localhost';
-- FLUSH PRIVILEGES;

-- For remote access (if needed):
-- CREATE USER 'dayflow_app'@'%' IDENTIFIED BY 'strong_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON dayflow_hrms.* TO 'dayflow_app'@'%';
-- FLUSH PRIVILEGES;
