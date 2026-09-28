import React, { useState } from 'react';
import {
  Database,
  Layers,
  Server,
  Copy,
  Check,
  Container,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { MYSQL_SCHEMA_TABLES } from '../services/mockData';

export const ArchitectureSpecView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'mysql' | 'api' | 'docker' | 'dod'>('architecture');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('documents');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlDdl = `CREATE TABLE users (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  role_id ENUM('ADMIN', 'EDITOR', 'VIEWER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type ENUM('pdf', 'docx', 'txt', 'csv', 'png', 'jpg') NOT NULL,
  file_size_bytes BIGINT UNSIGNED NOT NULL,
  storage_uri VARCHAR(512) NOT NULL,
  category VARCHAR(64) NOT NULL,
  ocr_confidence DECIMAL(5,2) DEFAULT 100.00,
  classification_confidence DECIMAL(5,2) DEFAULT 95.00,
  word_count INT UNSIGNED NOT NULL DEFAULT 0,
  uploaded_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_file_type (file_type),
  INDEX idx_created (created_at),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE document_contents (
  document_id VARCHAR(36) NOT NULL PRIMARY KEY,
  summary TEXT,
  extracted_text LONGTEXT NOT NULL,
  entities_json JSON,
  FULLTEXT idx_fts (extracted_text, summary),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE inverted_index_terms (
  term VARCHAR(96) NOT NULL PRIMARY KEY,
  doc_frequency INT UNSIGNED NOT NULL DEFAULT 1,
  idf_weight FLOAT NOT NULL
);

CREATE TABLE inverted_index_postings (
  term VARCHAR(96) NOT NULL,
  document_id VARCHAR(36) NOT NULL,
  term_frequency INT UNSIGNED NOT NULL,
  positions_json JSON,
  PRIMARY KEY (term, document_id),
  INDEX idx_postings_term (term),
  FOREIGN KEY (term) REFERENCES inverted_index_terms(term) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actor_id VARCHAR(36) NOT NULL,
  actor_role ENUM('ADMIN', 'EDITOR', 'VIEWER') NOT NULL,
  action VARCHAR(64) NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  status ENUM('SUCCESS', 'WARNING', 'DENIED', 'FAILED') NOT NULL,
  details TEXT,
  INDEX idx_timestamp (timestamp),
  INDEX idx_action (action)
);`;

  const dockerComposeYaml = `version: '3.8'

services:
  app:
    build: .
    container_name: smart-doc-retrieval-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=mysql://root:secret@mysql:3306/smart_docs
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.0
    container_name: smart-doc-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: smart_docs
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    container_name: smart-doc-cache
    restart: unless-stopped
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    ports:
      - "6379:6379"

volumes:
  mysql_data:`;

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          System Architecture & Technical Specifications
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Engineering documentation covering the pipeline architecture, MySQL schema, REST APIs, and deployment configurations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'architecture', label: 'Architecture & Pipeline' },
          { id: 'mysql', label: 'MySQL Schema & DDL' },
          { id: 'api', label: 'REST API Specification' },
          { id: 'docker', label: 'Docker Deployment' },
          { id: 'dod', label: 'Definition of Done (DoD)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-5">
          <h2 className="text-sm font-semibold text-slate-900">
            End-to-End System Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 1</div>
              <div className="font-semibold text-slate-800">Client Application</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                React interface with role-based access control, search hit highlighting, and client-side index fallback.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 2</div>
              <div className="font-semibold text-slate-800">API Gateway</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Express.js server handling multi-format uploads, authentication tokens, and audit telemetry dispatch.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 3</div>
              <div className="font-semibold text-slate-800">OCR & Extraction</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Binarization, line segmentation, character recognition, and entity extraction for dates and figures.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 4</div>
              <div className="font-semibold text-slate-800">TF-IDF Indexer</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Tokenization, stopword filtering, inverted index postings, and BM25 term weighting.
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-mono text-[10px] text-slate-400 font-semibold">STAGE 5</div>
              <div className="font-semibold text-slate-800">Persistence Store</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Relational MySQL tables for metadata, document bodies, posting inverted lists, and audit records.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-800">Hybrid Search Formula</div>
            <div className="font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200 text-[11px]">
              Score(q, d) = 0.50 × CosineSimilarity(TF-IDF_q, TF-IDF_d) + 0.25 × TitleMatch + 0.15 × TagMatch + 0.10 × CategoryMatch
            </div>
            <p className="text-[11px] text-slate-500">
              IDF computed via BM25 logarithmic dampening: <code className="font-mono text-slate-700">ln(1 + (N - df + 0.5) / (df + 0.5))</code>
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MYSQL */}
      {activeTab === 'mysql' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Relational MySQL Schema & Inverted Index Tables
              </h2>
              <p className="text-xs text-slate-500">
                Select a table to inspect columns, constraints, foreign keys, and indexes.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(sqlDdl, 'ddl')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
            >
              {copiedSection === 'ddl' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedSection === 'ddl' ? 'Copied' : 'Copy DDL'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {MYSQL_SCHEMA_TABLES.map((table) => (
              <button
                key={table.tableName}
                onClick={() => setSelectedTable(table.tableName)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedTable === table.tableName
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {table.tableName}
              </button>
            ))}
          </div>

          {(() => {
            const table = MYSQL_SCHEMA_TABLES.find((t) => t.tableName === selectedTable);
            if (!table) return null;
            return (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-slate-500">
                  <strong className="text-slate-700">{table.tableName}:</strong> {table.description}
                </div>

                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Column</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Constraints</th>
                        <th className="p-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {table.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-900">{col.name}</td>
                          <td className="p-2.5 text-blue-700">{col.type}</td>
                          <td className="p-2.5 text-amber-700">{col.constraints}</td>
                          <td className="p-2.5 font-sans text-slate-500">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: REST API */}
      {activeTab === 'api' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              REST API Endpoints Specification
            </h2>
            <span className="text-xs font-mono text-slate-400">Base URI: /api</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { method: 'GET', path: '/api/documents', desc: 'List documents with optional category, format, or sort filters.', auth: 'Viewer+' },
              { method: 'POST', path: '/api/documents', desc: 'Ingest and process a document through OCR & inverted index.', auth: 'Editor / Admin' },
              { method: 'POST', path: '/api/search', desc: 'Run hybrid TF-IDF + cosine search across documents.', auth: 'All Roles' },
              { method: 'PUT', path: '/api/documents/:id', desc: 'Update document title, category, and metadata tags.', auth: 'Editor / Admin' },
              { method: 'DELETE', path: '/api/documents/:id', desc: 'Delete document and purge postings from index.', auth: 'Editor / Admin' },
              { method: 'GET', path: '/api/audit', desc: 'Fetch regulatory compliance audit log records.', auth: 'Admin' },
              { method: 'GET', path: '/api/stats', desc: 'Fetch document counts, index size, and retrieval latency metrics.', auth: 'All Roles' }
            ].map((ep, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-slate-800 text-[11px]">{ep.method}</span>
                    <span className="text-slate-900 text-xs">{ep.path}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">{ep.desc}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {ep.auth}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCKER */}
      {activeTab === 'docker' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Docker Compose Configuration
            </h2>
            <button
              onClick={() => copyToClipboard(dockerComposeYaml, 'compose')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
            >
              {copiedSection === 'compose' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedSection === 'compose' ? 'Copied' : 'Copy Compose YAML'}</span>
            </button>
          </div>

          <pre className="p-4 rounded bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            {dockerComposeYaml}
          </pre>
        </div>
      )}

      {/* TAB 5: DEFINITION OF DONE */}
      {activeTab === 'dod' && (
        <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            MVP Acceptance Criteria & Definition of Done
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { title: 'Multi-Format Ingestion (6 Formats)', desc: 'Full support for PDF, DOCX, TXT, CSV, PNG, and JPG files.' },
              { title: 'Optical Character Recognition (OCR)', desc: 'Extraction pipeline with confidence evaluation on scanned images.' },
              { title: 'TF-IDF Inverted Index Search', desc: 'Cosine relevance scoring, BM25 term weighting, and keyword snippet highlighting.' },
              { title: 'Document Classification & Taxonomy', desc: '6 enterprise domains (Legal, Financial, Technical, HR, Marketing, Operations).' },
              { title: 'Role-Based Access Control (RBAC)', desc: 'Administrator, Editor, and Viewer permission enforcement.' },
              { title: 'Regulatory Compliance Audit Trail', desc: 'Event logging for document views, uploads, searches, and exports (CSV/JSON).' },
              { title: 'Relational MySQL Schema & Postings Table', desc: 'Complete DDL specifications with inverted index structures.' }
            ].map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{item.title}</div>
                  <div className="text-slate-500 text-[11px]">{item.desc}</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-medium">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
