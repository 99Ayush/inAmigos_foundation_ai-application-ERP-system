-- ====================================================================
-- InAmigos Foundation ERP — Production Supabase / PostgreSQL Schema
-- Run this script directly in your Supabase SQL Editor or Render Postgres
-- ====================================================================

-- 1. DROP EXISTING TABLES IF ANY
DROP TABLE IF EXISTS VOLUNTEER_APPLICATIONS CASCADE;
DROP TABLE IF EXISTS VOLUNTEERS CASCADE;
DROP TABLE IF EXISTS INITIATIVES CASCADE;
DROP TABLE IF EXISTS CSR_PROPOSALS CASCADE;
DROP TABLE IF EXISTS AUDIT_LOGS CASCADE;

-- 2. CREATE VOLUNTEERS TABLE
CREATE TABLE VOLUNTEERS (
    volunteer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    skills VARCHAR(500),
    availability_hours INT DEFAULT 0 CHECK (availability_hours >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CREATE INITIATIVES TABLE
CREATE TABLE INITIATIVES (
    initiative_id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Archived'))
);

-- 4. CREATE VOLUNTEER_APPLICATIONS TABLE
CREATE TABLE VOLUNTEER_APPLICATIONS (
    application_id SERIAL PRIMARY KEY,
    volunteer_id INT NOT NULL REFERENCES VOLUNTEERS(volunteer_id) ON DELETE CASCADE,
    initiative_id INT REFERENCES INITIATIVES(initiative_id) ON DELETE SET NULL,
    raw_statement TEXT NOT NULL,
    ai_suggested_initiative VARCHAR(100),
    ai_confidence NUMERIC(3,2) CHECK (ai_confidence IS NULL OR (ai_confidence >= 0.00 AND ai_confidence <= 1.00)),
    ai_reasoning TEXT,
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'ai_triaged', 'manual_review', 'accepted', 'rejected')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CREATE CSR PROPOSALS TABLE
CREATE TABLE CSR_PROPOSALS (
    id VARCHAR(50) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    pledged_amount NUMERIC(12,2) NOT NULL,
    targeted_initiative VARCHAR(100) NOT NULL,
    proposal_summary TEXT,
    status VARCHAR(30) DEFAULT 'Under Review',
    submitted_date VARCHAR(50) DEFAULT CURRENT_DATE
);

-- 6. CREATE AUDIT LOGS TABLE
CREATE TABLE AUDIT_LOGS (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    target VARCHAR(100),
    details TEXT,
    category VARCHAR(50) NOT NULL
);

-- 7. SEED CORE INITIATIVES
INSERT INTO INITIATIVES (title, category, status) VALUES 
('Project Bachpanshala', 'Education', 'Active'),
('Project Jeev', 'Animal Welfare', 'Active'),
('Project Seva', 'Zero Hunger', 'Active'),
('Project Prakriti', 'Environment', 'Active'),
('Project Udaan', 'Women Empowerment', 'Active'),
('General Operations', 'Admin', 'Active');

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IDX_VOL_APP_VOL ON VOLUNTEER_APPLICATIONS(volunteer_id);
CREATE INDEX IDX_VOL_APP_INIT ON VOLUNTEER_APPLICATIONS(initiative_id);
CREATE INDEX IDX_VOL_APP_STATUS ON VOLUNTEER_APPLICATIONS(status);

-- Complete! Copy & Paste this entire file into Supabase SQL Editor.
