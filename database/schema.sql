-- ANTIGRAVITY DIGITAL LIBRARY
-- PostgreSQL Database Schema Setup

-- Drop tables if they exist to allow clean runs
DROP TABLE IF EXISTS borrow_records CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER', -- ADMIN or USER
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books Table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    summary TEXT,
    cover_image TEXT, -- Real HTTPS image URL
    availability_count INT NOT NULL DEFAULT 5,
    total_count INT NOT NULL DEFAULT 5
);

-- Borrow Records Table
CREATE TABLE borrow_records (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    book_id INT REFERENCES books(id) ON DELETE CASCADE,
    borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
    return_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'BORROWED' -- BORROWED or RETURNED
);

-- Indices for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_borrow_status ON borrow_records(status);
