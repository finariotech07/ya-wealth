-- db/db.sql
-- All SQL commands for YaWealth project table structures (development trace)

-- 1. Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL, -- 'article' or 'live_stream'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100),
    link VARCHAR(255),
    timestamp DATETIME,
    status VARCHAR(20), -- e.g., 'live', 'recent', 'market'
    image_url VARCHAR(255)
);

-- 2. Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(100),
    image_url VARCHAR(255),
    category VARCHAR(100),
    published_at DATETIME,
    status VARCHAR(20) DEFAULT 'published'
);

--2. Create Advisory table
CREATE TABLE IF NOT EXISTS advisory_signals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset VARCHAR(50) NOT NULL,
    action ENUM('BUY', 'SELL') NOT NULL,
    entry DECIMAL(15,2) NOT NULL,
    stop_loss DECIMAL(15,2) NOT NULL,
    target DECIMAL(15,2) NOT NULL,
    status ENUM('Active', 'Pending', 'Closed') NOT NULL,
    chart_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--3. Create Contact table
-- 4. Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    number VARCHAR(20),
    message TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert default roles
INSERT INTO roles (id, name) VALUES
    (1, 'user'),
    (2, 'admin'),
    (3, 'author'),
    (4, 'leadsmanager')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Rewrite users table to reference roles
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fname VARCHAR(100),
    lname VARCHAR(100),
    phone VARCHAR(20),
    role_id INT NOT NULL DEFAULT 1,
    is_verified BOOLEAN DEFAULT FALSE,
    auth_provider VARCHAR(50) DEFAULT 'manual',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 6. Create otps table (for signup, email change, password reset)
CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    operation ENUM('signup', 'email_change', 'password_reset') NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    target_email VARCHAR(150),
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add more table structures below as the project grows 