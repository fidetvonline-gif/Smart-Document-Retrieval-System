import { DocumentItem, User } from '../types';

export const SYSTEM_USERS: Record<string, User> = {
  ADMIN: {
    id: 'u-admin-01',
    name: 'Sarah Chen',
    email: 'sarah.chen@apexcloud.internal',
    role: 'ADMIN',
    title: 'Lead Systems Administrator & Security Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
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

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'Vendor Master Service Agreement v3',
    fileName: 'Vendor_Master_Service_Agreement_v3.pdf',
    fileType: 'pdf',
    fileSize: 2457600,
    uploadDate: '2026-09-24T10:15:00Z',
    uploadedBy: 'Sarah Chen (Admin)',
    category: 'Legal & Contracts',
    status: 'Indexed',
    ocrConfidence: 99.2,
    classificationConfidence: 98.6,
    wordCount: 3840,
    pageCount: 14,
    tags: ['contract', 'vendor', 'sla', 'compliance', 'liability', 'indemnity'],
    entities: {
      organizations: ['Apex Cloud Global Inc.', 'Nova Systems LLC'],
      persons: ['David K. Miller (General Counsel)', 'Rachel Adams (COO)'],
      dates: ['Effective Date: 2026-01-15', 'Expiration: 2029-01-14'],
      monetaryValues: ['$250,000 Annual Cap', '$1,000,000 Umbrella Coverage'],
      referenceNumbers: ['MSA-2026-088-B', 'SEC-REV-4']
    },
    summary: 'Master Service Agreement detailing terms for cloud infrastructure provisioning, 99.99% uptime SLA commitments, data sovereignty requirements, and indemnification caps.',
    content: `MASTER SERVICE AGREEMENT (MSA)
Reference: MSA-2026-088-B
This Agreement is entered into between Apex Cloud Global Inc. ("Provider") and Nova Systems LLC ("Client").
1. SCOPE OF SERVICES: Provider agrees to deliver enterprise document retrieval infrastructure, distributed storage nodes, and OCR text processing pipelines.
2. SERVICE LEVEL AGREEMENT (SLA): Provider guarantees monthly service availability of 99.99%. Downtime exceeding 0.01% incurs penalty credits of 10% per hour of unplanned outage.
3. DATA PROTECTION & SOVEREIGNTY: All customer records, inverted indexes, and OCR artifacts must reside within designated cloud regions with AES-256 encryption at rest.
4. INDEMNIFICATION AND LIABILITY: Total liability under this agreement shall not exceed $250,000 or the total fees paid by Client during the preceding twelve months.
5. GOVERNING LAW: This contract is governed by Delaware corporate law.
Signatures: David K. Miller, Rachel Adams.`
  },
  {
    id: 'doc-002',
    title: 'Q3 Enterprise Architecture & Retrieval Pipeline Spec',
    fileName: 'Q3_System_Architecture_Spec.docx',
    fileType: 'docx',
    fileSize: 1468006,
    uploadDate: '2026-09-25T14:30:00Z',
    uploadedBy: 'Marcus Vance (Editor)',
    category: 'Technical & Architecture',
    status: 'Indexed',
    ocrConfidence: 100.0,
    classificationConfidence: 97.9,
    wordCount: 4210,
    pageCount: 18,
    tags: ['architecture', 'microservices', 'tfidf', 'inverted_index', 'mysql', 'ocr', 'docker'],
    entities: {
      organizations: ['Engineering Platform Team', 'Distributed Search WG'],
      persons: ['Marcus Vance (Staff Architect)', 'Kenji Sato (Lead Eng)'],
      dates: ['Release: 2026-10-01', 'RFC Review: 2026-08-20'],
      monetaryValues: ['$18,000/mo Infrastructure Budget'],
      referenceNumbers: ['ARCH-DOC-772', 'PR-4401']
    },
    summary: 'Comprehensive engineering specification of the Smart Document Retrieval System covering React frontend, Express REST API, TF-IDF ranking engine, OCR queue, and MySQL schema.',
    content: `SMART DOCUMENT RETRIEVAL SYSTEM - SYSTEM ARCHITECTURE SPECIFICATION
Document ID: ARCH-DOC-772
1. SYSTEM OVERVIEW: The platform provides unified document ingestion across 6 formats: PDF, DOCX, TXT, CSV, PNG, and JPG.
2. RETRIEVAL ENGINE (TF-IDF & BM25):
Inverted index maps each term t to posting lists with term frequency (TF) and inverse document frequency (IDF).
Formula: TF(t,d) = f(t,d) / max_w(f(w,d)). IDF(t) = ln((N - n_t + 0.5) / (n_t + 0.5) + 1).
Hybrid ranker merges TF-IDF cosine score (60%) with metadata match score (25%) and title exactness boost (15%).
3. OCR PIPELINE: Images (PNG, JPG) and scanned documents undergo preprocessing: binarization, skew correction, text line segmentation, and character recognition.
4. STORAGE & DATABASE: MySQL relational schema maintains users, roles, documents, inverted_index, and audit_logs tables.
5. DOCKER & CONTAINERIZATION: Multi-stage Dockerfile packaging Node.js, Express, and React bundle with health check probes.`
  },
  {
    id: 'doc-003',
    title: 'Corporate Financial Audit & Expense Reconciliation',
    fileName: 'Q2_Corporate_Financial_Audit.csv',
    fileType: 'csv',
    fileSize: 524288,
    uploadDate: '2026-09-26T09:10:00Z',
    uploadedBy: 'Sarah Chen (Admin)',
    category: 'Financial & Invoices',
    status: 'Indexed',
    ocrConfidence: 100.0,
    classificationConfidence: 99.1,
    wordCount: 1850,
    tags: ['financial', 'audit', 'tax', 'reconciliation', 'expenses', 'quarterly', 'accounting'],
    entities: {
      organizations: ['Ernst & Young LLP', 'Global Treasury Dept'],
      persons: ['Alina Gomez (CFO)', 'Samuel Price (Auditor)'],
      dates: ['Audit Period: Q2 2026', 'Submission: 2026-07-31'],
      monetaryValues: ['$4,820,500 Total Revenue', '$1,294,300 OpEx', '$340,000 OCR R&D'],
      referenceNumbers: ['AUD-2026-Q2-09', 'TX-78190']
    },
    summary: 'Audited financial ledger listing departmental expenditures, cloud compute allocations, vendor software licenses, and tax deduction schedules.',
    content: `Transaction_ID,Date,Department,Category,Vendor,Amount_USD,Status,Notes
TX-78190,2026-04-12,Infrastructure,Cloud Hosting,Apex Cloud Global,84200.00,Approved,Monthly server farm & OCR GPU nodes
TX-78191,2026-04-18,Engineering,Tooling & Licenses,JetBrains / GitHub,12450.00,Approved,Enterprise IDE & CI/CD pipeline
TX-78192,2026-05-02,Legal,External Counsel,Baker & McKenzie,35000.00,Approved,Contract compliance review & patent filings
TX-78193,2026-05-20,Operations,Hardware,Dell Technologies,48900.00,Approved,On-premise edge OCR backup units
TX-78194,2026-06-15,Finance,Audit Services,Ernst & Young LLP,65000.00,Approved,Quarterly statutory financial audit`
  },
  {
    id: 'doc-004',
    title: 'Critical Incident Postmortem Report - Cache Failure',
    fileName: 'Incident_Postmortem_Report_2026.txt',
    fileType: 'txt',
    fileSize: 143360,
    uploadDate: '2026-09-22T16:45:00Z',
    uploadedBy: 'Marcus Vance (Editor)',
    category: 'Operational & Reports',
    status: 'Indexed',
    ocrConfidence: 100.0,
    classificationConfidence: 96.4,
    wordCount: 2190,
    tags: ['incident', 'postmortem', 'outage', 'redis', 'cache', 'devops', 'sla', 'operational'],
    entities: {
      organizations: ['Site Reliability Engineering (SRE)', 'Database Ops'],
      persons: ['Tariq Al-Mansoor (On-Call Lead)', 'Kenji Sato (VP Eng)'],
      dates: ['Incident Date: 2026-08-14', 'Recovery Time: 18 minutes'],
      monetaryValues: ['$0 Direct Customer Loss'],
      referenceNumbers: ['INC-2026-9041', 'JIRA-SRE-882']
    },
    summary: 'Root cause analysis of Redis cluster failover during search query spike. Document retrieval fell back to MySQL full-text engine gracefully.',
    content: `INCIDENT POSTMORTEM REPORT
Incident Reference: INC-2026-9041
Severity: SEV-2 | Impacted Component: Distributed Search Inverted Index Cache
Date & Time: 2026-08-14 14:22 UTC - 14:40 UTC (Duration: 18m)

EXECUTIVE SUMMARY:
At 14:22 UTC, an automated batch ingestion job submitted 5,000 PDF documents simultaneously, causing a burst in TF-IDF index generation. The Redis cache node experienced memory eviction thresholds, triggering failover.

ROOT CAUSE:
The default maxmemory-policy was configured to 'volatile-lru' instead of 'allkeys-lru', preventing eviction of non-expiring inverted index chunks.

MITIGATION & RECOVERY:
1. SRE switched search query traffic to local memory index fallback within 90 seconds.
2. Redis cluster memory allocation expanded from 16GB to 64GB.
3. Inverted index partitioning enabled with sharding key based on document category hash.

ACTION ITEMS:
- Implement rate limiting on document upload ingestion queue (Max 100 docs/min/tenant).
- Add automated regression alerting on search query latency p99 > 50ms.`
  },
  {
    id: 'doc-005',
    title: 'Scanned Hardware Purchase Invoice 7829',
    fileName: 'Scanned_Receipt_Invoice_7829.png',
    fileType: 'png',
    fileSize: 3145728,
    uploadDate: '2026-09-27T08:20:00Z',
    uploadedBy: 'Marcus Vance (Editor)',
    category: 'Financial & Invoices',
    status: 'Indexed',
    ocrConfidence: 97.4,
    classificationConfidence: 98.2,
    wordCount: 420,
    tags: ['invoice', 'receipt', 'hardware', 'gpu', 'ocr_scanned', 'procurement'],
    entities: {
      organizations: ['NVIDIA Enterprise Solutions', 'Apex Cloud Global Inc.'],
      persons: ['Authorized Signatory: L. Henderson'],
      dates: ['Invoice Date: 2026-09-02', 'Payment Due: Net 30'],
      monetaryValues: ['$64,800.00 Total Due', '$4,800.00 State Tax'],
      referenceNumbers: ['INV-NV-782901', 'PO-99412']
    },
    summary: 'High-resolution scanned commercial invoice for NVIDIA A100 Tensor Core GPU accelerators dedicated to optical character recognition (OCR) and embedding extraction.',
    content: `[OCR EXTRACTED TEXT - ENGINE: HIGH_PRECISION_V4]
INVOICE NUMBER: INV-NV-782901
VENDOR: NVIDIA Enterprise Solutions | Silicon Valley, CA
SOLD TO: Apex Cloud Global Inc. - Data Infrastructure Division
DATE: September 02, 2026 | TERMS: Net 30 | PO: PO-99412

LINE ITEMS:
Item 1: NVIDIA A100 80GB PCIe Server Accelerator (Qty: 4) - Unit: $15,000.00 - Subtotal: $60,000.00
Item 2: Enterprise Support & CUDA AI Acceleration Suite (1-Yr) - Subtotal: $4,800.00
SUBTOTAL: $64,800.00
TAX (0.00% Exempt): $0.00
TOTAL BALANCE DUE: $64,800.00

Payment Method: Wire Transfer to Silicon Valley Bank Routing #121000358
Extracted with OCR Confidence: 97.4% across 42 text bounding boxes.`
  },
  {
    id: 'doc-006',
    title: 'Signed Mutual Non-Disclosure Certificate',
    fileName: 'Signed_Non_Disclosure_Certificate.jpg',
    fileType: 'jpg',
    fileSize: 2097152,
    uploadDate: '2026-09-21T11:00:00Z',
    uploadedBy: 'Sarah Chen (Admin)',
    category: 'Legal & Contracts',
    status: 'Indexed',
    ocrConfidence: 96.1,
    classificationConfidence: 97.5,
    wordCount: 880,
    tags: ['nda', 'confidentiality', 'legal', 'signed', 'certificate', 'intellectual_property'],
    entities: {
      organizations: ['Apex Cloud Global Inc.', 'Quantum Logic BioTech'],
      persons: ['Dr. Aris Thorne (CEO)', 'Sarah Chen (Admin / Witness)'],
      dates: ['Signed: 2026-02-10', 'Term: 5 Years'],
      monetaryValues: ['Statutory injunctive damages'],
      referenceNumbers: ['NDA-MUTUAL-2026-44']
    },
    summary: 'Scanned and countersigned mutual NDA protecting proprietary search algorithms, TF-IDF weight parameters, and customer document repositories.',
    content: `[OCR EXTRACTED TEXT - ENGINE: HIGH_PRECISION_V4]
MUTUAL NON-DISCLOSURE AND PROPRIETARY INFORMATION CERTIFICATE
Document No: NDA-MUTUAL-2026-44
Parties: Apex Cloud Global Inc. and Quantum Logic BioTech
RECITALS:
The parties wish to explore a business relationship concerning machine learning retrieval pipelines and encrypted indexing.
1. CONFIDENTIAL INFORMATION: Includes all source code, TF-IDF mathematical formulations, inverted index schemas, OCR training sets, and business strategies.
2. OBLIGATIONS: Neither party shall disclose Confidential Information to third parties without prior written consent for a period of 5 years.
3. RETURN OF MATERIALS: Upon termination, all physical and electronic documents shall be certified destroyed or returned.
IN WITNESS WHEREOF, duly executed by authorized representatives.
[Signature Verified: Dr. Aris Thorne, CEO, Quantum Logic BioTech]
[Signature Verified: Sarah Chen, Administrator, Apex Cloud Global Inc.]`
  }
];

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
