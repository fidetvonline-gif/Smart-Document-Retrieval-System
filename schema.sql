-- ==============================================================================
-- DATABASE SCHEMA: School of Applied Science Admin Office
-- INSTITUTION: Federal Polytechnic Ukana, Akwa Ibom State
-- ADMINISTRATOR: Udo-Odu Inibehe David
-- DATABASE ENGINE: PostgreSQL / MySQL / Supabase Compatible
-- ==============================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(32) PRIMARY KEY,
  display_name VARCHAR(64) NOT NULL,
  permissions_mask BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  title VARCHAR(255),
  role_id VARCHAR(32) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(16) NOT NULL CHECK (file_type IN ('pdf', 'docx', 'txt', 'csv', 'png', 'jpg')),
  file_size_bytes BIGINT NOT NULL,
  storage_uri VARCHAR(512),
  category VARCHAR(64) NOT NULL DEFAULT 'General Administrative',
  ocr_confidence DECIMAL(5,2) DEFAULT 100.00,
  classification_confidence DECIMAL(5,2) DEFAULT 95.00,
  word_count INT DEFAULT 0,
  page_count INT DEFAULT 1,
  uploaded_by_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  uploaded_by_name VARCHAR(128) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DOCUMENT CONTENTS & OCR DATA
CREATE TABLE IF NOT EXISTS document_contents (
  document_id VARCHAR(36) PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
  summary TEXT,
  extracted_text TEXT NOT NULL,
  entities_json JSONB,
  tags JSONB
);

-- 5. INVERTED INDEX LEXICON
CREATE TABLE IF NOT EXISTS inverted_index_terms (
  term VARCHAR(96) PRIMARY KEY,
  doc_frequency INT NOT NULL DEFAULT 1,
  idf_weight FLOAT NOT NULL
);

-- 6. INVERTED INDEX POSTINGS LIST
CREATE TABLE IF NOT EXISTS inverted_index_postings (
  term VARCHAR(96) NOT NULL REFERENCES inverted_index_terms(term) ON DELETE CASCADE,
  document_id VARCHAR(36) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  term_frequency INT NOT NULL DEFAULT 1,
  positions_json JSONB,
  PRIMARY KEY (term, document_id)
);

-- 7. AUDIT TRAIL LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actor_id VARCHAR(36) NOT NULL,
  actor_name VARCHAR(128) NOT NULL,
  actor_role VARCHAR(32) NOT NULL,
  action VARCHAR(64) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
  status VARCHAR(16) NOT NULL DEFAULT 'SUCCESS',
  details TEXT
);

-- Ensure columns exist if audit_logs table pre-existed with legacy schema
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_id VARCHAR(36);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_name VARCHAR(128);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_role VARCHAR(32);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action VARCHAR(64);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS resource_id VARCHAR(255);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) DEFAULT '127.0.0.1';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS status VARCHAR(16) DEFAULT 'SUCCESS';
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS details TEXT;

-- 8. INDEXES FOR FAST RETRIEVAL & SEARCH
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON documents(file_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed System Roles
INSERT INTO roles (id, display_name, permissions_mask) VALUES
('ADMIN', 'System Administrator', 511),
('EDITOR', 'Data Curator / Editor', 15),
('VIEWER', 'Auditor / Read-Only', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Administrator: Udo-Odu Inibehe David
INSERT INTO users (id, email, full_name, title, role_id, avatar_url) VALUES
('u-admin-01', 'udo-odu.inibehe@fedpolyukana.edu.ng', 'Udo-Odu Inibehe David', 'Administrator, School of Applied Science Admin Office', 'ADMIN', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- HELPER QUERIES FOR ADMIN OFFICE
-- ==============================================================================

-- 1. Fetch Document Stats
-- SELECT count(*) AS total_docs, sum(file_size_bytes) AS total_bytes FROM documents;

-- 2. Audit Trail Log Query
-- SELECT * FROM audit_logs WHERE actor_id = 'u-admin-01' ORDER BY timestamp DESC LIMIT 50;
