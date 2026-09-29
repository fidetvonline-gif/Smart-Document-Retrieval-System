import { DocumentItem, User } from '../types';

export const SYSTEM_USERS: Record<string, User> = {
  ADMIN: {
    id: 'u-admin-01',
    name: 'Udo-Odu Inibehe David',
    email: 'udo-odu.inibehe@fedpolyukana.edu.ng',
    role: 'ADMIN',
    title: 'Administrator, School of Applied Science Admin Office',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    permissions: {
      canUpload: true,
      canEditMetadata: true,
      canDeleteDocs: true,
      canRerunOCR: true,
      canViewAuditTrail: true,
      canExportAudit: true,
      canRebuildIndex: true,
      canManageTaxonomy: true,
      canViewAdminDiagnostics: true
    }
  },
  EDITOR: {
    id: 'u-editor-02',
    name: 'Marcus Vance',
    email: 'marcus.vance@apexcloud.internal',
    role: 'EDITOR',
    title: 'Senior Knowledge Specialist & Data Curator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    permissions: {
      canUpload: true,
      canEditMetadata: true,
      canDeleteDocs: true,
      canRerunOCR: true,
      canViewAuditTrail: false,
      canExportAudit: false,
      canRebuildIndex: false,
      canManageTaxonomy: false,
      canViewAdminDiagnostics: false
    }
  },
  VIEWER: {
    id: 'u-viewer-03',
    name: 'Elena Rostova',
    email: 'elena.rostova@external-auditors.org',
    role: 'VIEWER',
    title: 'External Compliance Auditor (Read-Only)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    permissions: {
      canUpload: false,
      canEditMetadata: false,
      canDeleteDocs: false,
      canRerunOCR: false,
      canViewAuditTrail: false,
      canExportAudit: false,
      canRebuildIndex: false,
      canManageTaxonomy: false,
      canViewAdminDiagnostics: false
    }
  }
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const SAMPLE_TEMPLATES = [
  {
    name: 'Sample Master Services Agreement (PDF)',
    fileName: 'Cloud_Vendor_MSA_Template.pdf',
    fileType: 'pdf' as const,
    category: 'Legal & Contracts' as const,
    content: `ENTERPRISE CLOUD SERVICES AGREEMENT
Effective as of October 1, 2026.
Provider: Titan Infrastructure Global.
Client: Apex Enterprise Corp.
1. UPTIME COMMITMENT: Provider maintains a 99.995% service SLA for all inverted index queries.
2. LIMITATION OF LIABILITY: In no event shall liability exceed $500,000 USD.
3. DATA RESIDENCY: Documents, OCR tokens, and audit logs are retained in compliance with SOC-2 and ISO 27001 standards.`
  },
  {
    name: 'Sample Hardware Scanned Invoice (PNG)',
    fileName: 'GPU_Compute_Invoice_9921.png',
    fileType: 'png' as const,
    category: 'Financial & Invoices' as const,
    content: `[OCR EXTRACTED DATA - HIGH SPEED]
INVOICE #9921-GPU
VENDOR: Cloud Tensor Silicon Corp.
DATE: 2026-09-18 | TERMS: Net 15
LINE ITEM 1: 8x H100 GPU Cluster Ingestion Worker Nodes: $128,000.00
LINE ITEM 2: Enterprise Fiber Channel Dedicated Uplink: $7,200.00
TOTAL AMOUNT DUE: $135,200.00
Payment Status: Pending Remittance Approval.`
  },
  {
    name: 'Sample Microservice Architecture Doc (DOCX)',
    fileName: 'TFIDF_Indexer_Microservice_RFC.docx',
    fileType: 'docx' as const,
    category: 'Technical & Architecture' as const,
    content: `RFC-408: HYBRID RETRIEVAL SERVICE ARCHITECTURE
Author: Core Engineering Group
This document specifies the decoupled TF-IDF indexer service. Documents are segmented into lexical n-grams, scored with inverse document frequency weights, and cached across distributed memory nodes. Queries achieve sub-15ms p99 latency with zero false dropouts.`
  },
  {
    name: 'Sample Employee Handbook Policy (TXT)',
    fileName: 'Internal_HR_Data_Governance_Policy.txt',
    fileType: 'txt' as const,
    category: 'Human Resources' as const,
    content: `INTERNAL HR DATA GOVERNANCE & ACCESS CONTROL
Reference: HR-POL-2026-01
Scope: All employees, contractors, and administrators.
Policy: Access to employee compensation, performance reviews, and health information is strictly restricted to designated HR administrators via RBAC tokens. All document views and export actions are logged to the immutable compliance audit trail.`
  }
];

export const MYSQL_SCHEMA_TABLES = [
  {
    tableName: 'users',
    description: 'Stores authenticated users, password hashes / SSO identifiers, and assigned system roles.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'NOT NULL PRIMARY KEY', description: 'UUID user identifier' },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'NOT NULL UNIQUE', description: 'User login email address' },
      { name: 'full_name', type: 'VARCHAR(128)', constraints: 'NOT NULL', description: 'Full legal name of the user' },
      { name: 'role_id', type: 'VARCHAR(32)', constraints: 'NOT NULL', description: 'Foreign key to roles table (ADMIN, EDITOR, VIEWER)' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Account creation timestamp' }
    ],
    indexes: ['idx_users_email', 'idx_users_role']
  },
  {
    tableName: 'roles',
    description: 'Defines Role-Based Access Control (RBAC) tiers and feature permission bits.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'VARCHAR(32)', constraints: 'NOT NULL PRIMARY KEY', description: 'ADMIN, EDITOR, VIEWER' },
      { name: 'display_name', type: 'VARCHAR(64)', constraints: 'NOT NULL', description: 'Human readable role designation' },
      { name: 'permissions_mask', type: 'BIGINT UNSIGNED', constraints: 'NOT NULL', description: 'Bitmask of enabled system privileges' }
    ],
    indexes: ['idx_roles_id']
  },
  {
    tableName: 'documents',
    description: 'Master table for all indexed corporate documents across the 6 supported file types.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'NOT NULL PRIMARY KEY', description: 'Unique document identifier (UUID)' },
      { name: 'title', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Document title' },
      { name: 'file_name', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Original uploaded file name' },
      { name: 'file_type', type: 'ENUM("pdf","docx","txt","csv","png","jpg")', constraints: 'NOT NULL', description: 'Standardized file extension' },
      { name: 'file_size_bytes', type: 'BIGINT UNSIGNED', constraints: 'NOT NULL', description: 'Physical file size in bytes' },
      { name: 'storage_uri', type: 'VARCHAR(512)', constraints: 'NOT NULL', description: 'Object storage pointer (S3 / GCS bucket path)' },
      { name: 'category', type: 'VARCHAR(64)', constraints: 'NOT NULL', description: 'Automated classification category' },
      { name: 'ocr_confidence', type: 'DECIMAL(5,2)', constraints: 'DEFAULT 100.00', description: 'Percentage confidence from OCR engine' },
      { name: 'classification_confidence', type: 'DECIMAL(5,2)', constraints: 'DEFAULT 95.00', description: 'Classifier model confidence' },
      { name: 'word_count', type: 'INT UNSIGNED', constraints: 'NOT NULL DEFAULT 0', description: 'Extracted word count' },
      { name: 'uploaded_by', type: 'VARCHAR(36)', constraints: 'NOT NULL', description: 'Uploader user ID' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Ingestion timestamp' },
      { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: 'Last modified' }
    ],
    foreignKeys: [
      { column: 'uploaded_by', references: 'users(id)' }
    ],
    indexes: ['idx_documents_category', 'idx_documents_file_type', 'idx_documents_created_at']
  },
  {
    tableName: 'document_contents',
    description: 'Full extracted OCR text, raw markdown, and AI generated executive summaries.',
    primaryKey: 'document_id',
    columns: [
      { name: 'document_id', type: 'VARCHAR(36)', constraints: 'NOT NULL PRIMARY KEY', description: 'Foreign key to documents' },
      { name: 'summary', type: 'TEXT', constraints: 'NULL', description: 'Auto-generated 2-sentence summary' },
      { name: 'extracted_text', type: 'LONGTEXT', constraints: 'NOT NULL', description: 'Complete plaintext extracted via OCR or native parser' },
      { name: 'entities_json', type: 'JSON', constraints: 'NULL', description: 'Named entities: orgs, dates, amounts, reference numbers' }
    ],
    foreignKeys: [
      { column: 'document_id', references: 'documents(id) ON DELETE CASCADE' }
    ],
    indexes: ['FULLTEXT idx_document_contents_fts (extracted_text, summary)']
  },
  {
    tableName: 'inverted_index_terms',
    description: 'Vocabulary lexicon dictionary with global collection document frequencies for TF-IDF.',
    primaryKey: 'term',
    columns: [
      { name: 'term', type: 'VARCHAR(96)', constraints: 'NOT NULL PRIMARY KEY', description: 'Normalized lowercased token' },
      { name: 'doc_frequency', type: 'INT UNSIGNED', constraints: 'NOT NULL DEFAULT 1', description: 'Total documents containing this term (df)' },
      { name: 'idf_weight', type: 'FLOAT', constraints: 'NOT NULL', description: 'Precalculated BM25 / TF-IDF inverse document frequency' }
    ],
    indexes: ['idx_terms_term']
  },
  {
    tableName: 'inverted_index_postings',
    description: 'Posting list linking vocabulary terms to documents with term frequency (TF) and positions.',
    primaryKey: '(term, document_id)',
    columns: [
      { name: 'term', type: 'VARCHAR(96)', constraints: 'NOT NULL', description: 'Normalized vocabulary token' },
      { name: 'document_id', type: 'VARCHAR(36)', constraints: 'NOT NULL', description: 'Target document ID' },
      { name: 'term_frequency', type: 'INT UNSIGNED', constraints: 'NOT NULL', description: 'Occurrences in document (tf)' },
      { name: 'positions_json', type: 'JSON', constraints: 'NULL', description: 'Array of token character offsets for snippet highlighting' }
    ],
    foreignKeys: [
      { column: 'term', references: 'inverted_index_terms(term) ON DELETE CASCADE' },
      { column: 'document_id', references: 'documents(id) ON DELETE CASCADE' }
    ],
    indexes: ['idx_postings_term', 'idx_postings_doc']
  },
  {
    tableName: 'audit_logs',
    description: 'Immutable regulatory compliance audit trail recording all user and administrative actions.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'VARCHAR(36)', constraints: 'NOT NULL PRIMARY KEY', description: 'Event identifier' },
      { name: 'timestamp', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP', description: 'Event UTC timestamp' },
      { name: 'actor_id', type: 'VARCHAR(36)', constraints: 'NOT NULL', description: 'User performing the action' },
      { name: 'actor_role', type: 'VARCHAR(32)', constraints: 'NOT NULL', description: 'ADMIN, EDITOR, VIEWER at time of event' },
      { name: 'action', type: 'VARCHAR(64)', constraints: 'NOT NULL', description: 'DOCUMENT_UPLOAD, DOCUMENT_VIEW, SEARCH_QUERY, etc.' },
      { name: 'resource_id', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Impacted document ID or system object' },
      { name: 'ip_address', type: 'VARCHAR(45)', constraints: 'NOT NULL', description: 'Client IPv4/IPv6' },
      { name: 'status', type: 'ENUM("SUCCESS","WARNING","DENIED","FAILED")', constraints: 'NOT NULL', description: 'Outcome of the event' },
      { name: 'details', type: 'TEXT', constraints: 'NULL', description: 'Descriptive context and query parameters' }
    ],
    foreignKeys: [
      { column: 'actor_id', references: 'users(id)' }
    ],
    indexes: ['idx_audit_timestamp', 'idx_audit_action', 'idx_audit_actor']
  }
];
